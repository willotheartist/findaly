// scripts/fix/backfill-brand-model-from-title.ts
import "dotenv/config";
import { prisma } from "@/lib/db";

function normalize(input: string) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCaseWords(input: string) {
  const s = (input || "").trim();
  if (!s) return "";
  return s
    .split(/\s+/g)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function isGarbageBrand(input: string | null | undefined) {
  const k = normalize(String(input || ""));
  if (!k) return true;
  if (k.length < 2) return true;
  if (!/[a-z]/.test(k)) return true;

  const bad = new Set([
    "other",
    "unknown",
    "n a",
    "na",
    "none",
    "misc",
    "various",
    "tbd",
    "to be confirmed",
    "undefined",
    "null",
    "boat",
    "yacht",
    "catamaran",
    "motor",
    "sail",
    "sailing",
  ]);
  return bad.has(k);
}

function splitWordsNormalized(input: string) {
  const n = normalize(input);
  return n ? n.split(" ").filter(Boolean) : [];
}

function joinWords(words: string[]) {
  return words.join(" ").trim();
}

function looksLikeStopPhrase(phrase: string) {
  // prevent “Custom”, “Motor Yacht”, “Sailing Yacht”, etc becoming “brands”
  const p = normalize(phrase);
  if (!p) return true;

  const badStarts = [
    "custom",
    "sailing",
    "motor",
    "motor yacht",
    "sailing yacht",
    "power",
    "power catamaran",
    "catamaran",
    "gulet",
    "trimaran",
    "ketch",
    "schooner",
    "rib",
    "tender",
    "passenger",
  ];
  return badStarts.some((b) => p === b || p.startsWith(b + " "));
}

function isMostlyNumeric(phrase: string) {
  const p = normalize(phrase);
  if (!p) return true;
  // if phrase has no letters, it’s junk
  return !/[a-z]/.test(p);
}

type BrandPhrase = {
  phrase: string; // normalized spaced phrase
  words: string[]; // normalized words
  n: number; // word count
  count: number;
};

function startsWithWords(titleWords: string[], phraseWords: string[]) {
  if (phraseWords.length === 0) return false;
  if (titleWords.length < phraseWords.length) return false;
  for (let i = 0; i < phraseWords.length; i++) {
    if (titleWords[i] !== phraseWords[i]) return false;
  }
  return true;
}

function cleanModelFromRemainder(remainderWords: string[]) {
  // We keep numbers + dots, but normalize spacing and common “.” cases.
  // Example: ["oceanis","51","1"] -> "Oceanis 51.1"
  const joined = remainderWords.join(" ").trim();

  const dotted = joined.replace(/\b(\d+)\s+(\d+)\b/g, "$1.$2").trim();
  return titleCaseWords(dotted);
}

async function buildBrandPhrasesFromTitles(): Promise<BrandPhrase[]> {
  const rows = await prisma.listing.findMany({
    where: { status: "LIVE", kind: "VESSEL" },
    select: { title: true },
    take: 50000,
  });

  const counts = new Map<string, number>();

  for (const r of rows) {
    const title = (r.title || "").trim();
    if (!title) continue;

    const w = splitWordsNormalized(title);
    if (w.length < 2) continue;

    // candidate phrases: first 1,2,3 words
    for (const n of [1, 2, 3] as const) {
      if (w.length < n) continue;
      const phrase = joinWords(w.slice(0, n));
      if (!phrase) continue;
      if (phrase.length < 2) continue;
      if (looksLikeStopPhrase(phrase)) continue;
      if (isMostlyNumeric(phrase)) continue;

      counts.set(phrase, (counts.get(phrase) || 0) + 1);
    }
  }

  // Keep phrases that occur enough times to be “real”
  // (tweakable, but this is conservative enough to avoid garbage)
  const MIN_COUNT = 2;

  const phrases: BrandPhrase[] = Array.from(counts.entries())
    .filter(([phrase, count]) => count >= MIN_COUNT)
    .map(([phrase, count]) => ({
      phrase,
      words: phrase.split(" ").filter(Boolean),
      n: phrase.split(" ").filter(Boolean).length,
      count,
    }))
    .sort((a, b) => {
      // longest first, then most common
      if (b.n !== a.n) return b.n - a.n;
      return b.count - a.count;
    });

  return phrases;
}

async function main() {
  const phrases = await buildBrandPhrasesFromTitles();
  console.log(`[title-backfill] brand phrases discovered: ${phrases.length}`);

  // Debug: show top phrases so you can sanity-check quickly
  console.log(
    `[title-backfill] top phrases:`,
    phrases.slice(0, 30).map((p) => `${p.phrase}(${p.count})`).join(" · ")
  );

  const candidates = await prisma.listing.findMany({
    where: {
      status: "LIVE",
      kind: "VESSEL",
      OR: [
        { brand: null },
        { model: null },
        { brand: { equals: "" } },
      ],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      brand: true,
      model: true,
    },
    take: 50000,
  });

  let updated = 0;
  let skipped = 0;
  let noMatch = 0;

  for (const l of candidates) {
    const title = (l.title || "").trim();
    if (!title) {
      skipped++;
      continue;
    }

    const titleWords = splitWordsNormalized(title);
    if (titleWords.length < 2) {
      skipped++;
      continue;
    }

    const brandOk = l.brand && !isGarbageBrand(l.brand);

    let matched: BrandPhrase | null = null;
    if (!brandOk) {
      for (const p of phrases) {
        if (startsWithWords(titleWords, p.words)) {
          matched = p;
          break;
        }
      }
    }

    const nextBrand = brandOk ? l.brand : matched ? titleCaseWords(matched.phrase) : null;

    // Only derive model if model is missing AND we have a match
    const nextModel =
      l.model ??
      (matched ? cleanModelFromRemainder(titleWords.slice(matched.words.length)) : null);

    if (!nextBrand && !brandOk) {
      noMatch++;
      skipped++;
      continue;
    }

    if ((l.brand ?? null) === (nextBrand ?? null) && (l.model ?? null) === (nextModel ?? null)) {
      skipped++;
      continue;
    }

    await prisma.listing.update({
      where: { id: l.id },
      data: {
        ...(nextBrand ? { brand: nextBrand } : {}),
        ...(nextModel ? { model: nextModel } : {}),
      },
    });

    updated++;
    if (updated % 50 === 0) {
      console.log(`[title-backfill] updated ${updated} / ${candidates.length}`);
    }
  }

  console.log(
    `[title-backfill] done. updated=${updated} skipped=${skipped} noMatch=${noMatch} total=${candidates.length}`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });