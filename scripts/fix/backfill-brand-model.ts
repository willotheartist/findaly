// scripts/fix/backfill-brand-model.ts
import "dotenv/config";
import { prisma } from "@/lib/db";

type BrandRow = { brand: string; count: number };

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
  ]);
  return bad.has(k);
}

function splitWords(input: string) {
  const n = normalize(input);
  return n ? n.split(" ").filter(Boolean) : [];
}

function startsWithWords(titleWords: string[], brandWords: string[]) {
  if (brandWords.length === 0) return false;
  if (titleWords.length < brandWords.length) return false;
  for (let i = 0; i < brandWords.length; i++) {
    if (titleWords[i] !== brandWords[i]) return false;
  }
  return true;
}

async function buildBrandTruthSet(): Promise<
  Array<{
    raw: string; // keep best display string
    words: string[];
    len: number;
    count: number;
  }>
> {
  // Pull existing brand values as your “truth set”
  const rows = await prisma.listing.groupBy({
    by: ["brand"],
    where: {
      status: "LIVE",
      kind: "VESSEL",
      brand: { not: null },
    },
    _count: { brand: true },
    orderBy: { _count: { brand: "desc" } },
    take: 20000,
  });

  const truth: BrandRow[] = rows
    .map((r) => ({
      brand: (r.brand || "").trim(),
      count: r._count.brand ?? 0,
    }))
    .filter((r) => r.brand && !isGarbageBrand(r.brand));

  // Normalize & dedupe by normalized key, keeping the most common raw casing
  const bestByKey = new Map<
    string,
    { raw: string; words: string[]; len: number; count: number }
  >();

  for (const r of truth) {
    const key = normalize(r.brand);
    const words = splitWords(r.brand);
    if (!key || words.length === 0) continue;

    const existing = bestByKey.get(key);
    if (!existing || r.count > existing.count) {
      bestByKey.set(key, { raw: r.brand, words, len: words.length, count: r.count });
    }
  }

  // Sort longest-first so “Fountaine Pajot” wins over “Fountaine”
  return Array.from(bestByKey.values()).sort((a, b) => {
    if (b.len !== a.len) return b.len - a.len;
    return b.count - a.count;
  });
}

async function main() {
  const truth = await buildBrandTruthSet();
  console.log(`[backfill] truth brands: ${truth.length}`);

  // Find listings that need fixing (brand missing/garbage OR model missing)
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

  for (const l of candidates) {
    const title = (l.title || "").trim();
    if (!title) {
      skipped++;
      continue;
    }

    const titleWords = splitWords(title);
    if (titleWords.length < 2) {
      skipped++;
      continue;
    }

    // If brand exists and isn’t garbage, we only fill model if missing.
    const brandIsOk = l.brand && !isGarbageBrand(l.brand);

    let matchedBrand: string | null = null;
    let matchedBrandWords: string[] = [];

    if (!brandIsOk) {
      // Find the best brand match at the beginning of title
      for (const b of truth) {
        if (startsWithWords(titleWords, b.words)) {
          matchedBrand = b.raw;
          matchedBrandWords = b.words;
          break;
        }
      }
    }

    // Derive model as remaining title once brand prefix is removed
    let derivedModel: string | null = null;
    if (!l.model) {
      if (matchedBrand && matchedBrandWords.length) {
        const rest = titleWords.slice(matchedBrandWords.length).join(" ").trim();
        derivedModel = rest ? rest : null;
      } else {
        // Fallback: if no brand match, don’t guess model from whole title
        derivedModel = null;
      }
    }

    const nextBrand = brandIsOk ? l.brand : matchedBrand;
    const nextModel = l.model ?? derivedModel;

    // Nothing to do
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
      console.log(`[backfill] updated ${updated} / ${candidates.length}`);
    }
  }

  console.log(`[backfill] done. updated=${updated} skipped=${skipped} total=${candidates.length}`);
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