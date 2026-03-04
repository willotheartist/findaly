// lib/seoParam.ts

export type ParamTokens = {
  raw: string;
  spaced: string;
  display: string;
};

export type BrandParam = ParamTokens;

export type CountryParam = ParamTokens & {
  upper: string;
};

export type ModelParam = ParamTokens & {
  canonicalSpaced: string;
  brandCandidateRaw: string | null;
  modelCandidateRaw: string | null;
  candidates: string[];
};

export function decodeParam(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function normalizeSpaces(input: string) {
  return (input || "").replace(/\s+/g, " ").trim();
}

export function slugifyLoose(input: string) {
  return normalizeSpaces(input)
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function titleCaseWords(input: string) {
  const s = normalizeSpaces(input);
  if (!s) return "";
  return s
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function uniqStrings(arr: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of arr) {
    const k = normalizeSpaces(String(s || ""));
    if (!k) continue;
    const key = k.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(k);
  }
  return out;
}

export function paramToSpaced(param: string) {
  const raw = normalizeSpaces(decodeParam(param || ""));
  const spaced = normalizeSpaces(raw.replace(/[-_]+/g, " "));
  return { raw, spaced };
}

export function brandFromParam(param: string): BrandParam {
  const { raw, spaced } = paramToSpaced(param);
  return { raw, spaced, display: titleCaseWords(spaced) };
}

export function countryFromParam(param: string): CountryParam {
  const { raw, spaced } = paramToSpaced(param);
  const display = titleCaseWords(spaced);
  return { raw, spaced, display, upper: spaced.toUpperCase() };
}

export function dottedNumberVariant(input: string) {
  return normalizeSpaces(
    normalizeSpaces(input).replace(/\b(\d+)\s+(\d+)\b/g, "$1.$2")
  );
}

/**
 * MODEL (for /buy/model/[model])
 *
 * IMPORTANT CHANGE:
 * - We no longer treat the first token as a brand by default for canonical.
 * - CanonicalSpaced is ALWAYS the full spaced form (prevents lossy canonicals).
 * - But we still build candidates that include the "rest-of-words" variant,
 *   so prefixed slugs can still match DB values (Oceanis 51.1 etc).
 */
export function modelFromParam(param: string): ModelParam {
  const { raw, spaced } = paramToSpaced(param);

  const parts = spaced.split(" ").filter(Boolean);
  const brandCandidateRaw = parts.length >= 2 ? parts[0] : null;
  const modelCandidateRaw = parts.length >= 2 ? parts.slice(1).join(" ") : null;

  // Canonical should NOT collapse/strip. This prevents collisions like:
  // oceanis-51-1 -> 51-1, sun-odyssey-490 -> odyssey-490, etc.
  const canonicalSpaced = normalizeSpaces(spaced);
  const canonicalDotted = dottedNumberVariant(canonicalSpaced);

  // For display, if the input *was* prefixed, show the remainder nicely
  const displayBasis = normalizeSpaces(modelCandidateRaw || canonicalSpaced);
  const display = titleCaseWords(displayBasis);

  // Build robust candidates for DB matching
  const candidates = uniqStrings([
    canonicalSpaced,
    canonicalDotted,
    titleCaseWords(canonicalSpaced),
    titleCaseWords(canonicalDotted),

    // Also include stripped modelCandidate variants for matching DB
    modelCandidateRaw || "",
    dottedNumberVariant(modelCandidateRaw || ""),
    titleCaseWords(modelCandidateRaw || ""),
    titleCaseWords(dottedNumberVariant(modelCandidateRaw || "")),
  ]);

  return {
    raw,
    spaced,
    display,
    canonicalSpaced,
    brandCandidateRaw,
    modelCandidateRaw,
    candidates,
  };
}

export function modelFromParamScoped(param: string): ModelParam {
  const { raw, spaced } = paramToSpaced(param);

  const spacedDotted = dottedNumberVariant(spaced);

  const candidates = uniqStrings([
    spaced,
    spacedDotted,
    titleCaseWords(spaced),
    titleCaseWords(spacedDotted),
  ]);

  return {
    raw,
    spaced,
    display: titleCaseWords(spaced),
    canonicalSpaced: spaced,
    brandCandidateRaw: null,
    modelCandidateRaw: null,
    candidates,
  };
}

export function brandSlugFromValue(value: string) {
  return slugifyLoose(paramToSpaced(value).spaced);
}

export function countrySlugFromValue(value: string) {
  return slugifyLoose(paramToSpaced(value).spaced);
}

export function modelSlugFromValue(value: string) {
  const spaced = paramToSpaced(value).spaced;
  const canonical = dottedNumberVariant(spaced);
  return slugifyLoose(canonical);
}