// lib/seoParam.ts

export type ParamTokens = {
  raw: string; // decoded string, trimmed
  spaced: string; // "-" "_" collapsed to spaces, normalized whitespace
  display: string; // title-cased for UI
};

export type BrandParam = ParamTokens;

export type CountryParam = ParamTokens & {
  upper: string;
};

export type ModelParam = ParamTokens & {
  /**
   * A canonical model spaced form (model-only).
   * Useful for /buy/model/[model] where you want canonical URLs.
   */
  canonicalSpaced: string;

  /**
   * When the URL includes a prefix like "beneteau-oceanis-51-1",
   * we treat the first token as a brandCandidate and the rest as the modelCandidate.
   * This helps normalize canonical model-only slugs.
   */
  brandCandidateRaw: string | null;
  modelCandidateRaw: string | null;

  /**
   * Candidates used for database matching (robust against "51 1" vs "51.1", casing, etc.)
   */
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

/**
 * Loose slugify that matches your existing hub conventions.
 * - strips quotes
 * - converts & -> "and"
 * - collapses non-alphanumerics into "-"
 */
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

/**
 * Convert URL-ish string to spaced:
 * "beneteau-oceanis_51-1" -> "beneteau oceanis 51 1"
 */
export function paramToSpaced(param: string) {
  const raw = normalizeSpaces(decodeParam(param || ""));
  const spaced = normalizeSpaces(raw.replace(/[-_]+/g, " "));
  return { raw, spaced };
}

/**
 * BRAND
 */
export function brandFromParam(param: string): BrandParam {
  const { raw, spaced } = paramToSpaced(param);
  return {
    raw,
    spaced,
    display: titleCaseWords(spaced),
  };
}

/**
 * COUNTRY
 * We keep `upper` for matching legacy data that might be stored uppercased.
 */
export function countryFromParam(param: string): CountryParam {
  const { raw, spaced } = paramToSpaced(param);
  const display = titleCaseWords(spaced);
  return {
    raw,
    spaced,
    display,
    upper: spaced.toUpperCase(),
  };
}

/**
 * MODEL helpers
 *
 * Important: "51 1" -> "51.1"
 * This is the common "Oceanis 51.1" issue when slugs become space-separated digits.
 */
export function dottedNumberVariant(input: string) {
  return normalizeSpaces(
    normalizeSpaces(input)
      // "51 1" -> "51.1"
      .replace(/\b(\d+)\s+(\d+)\b/g, "$1.$2")
  );
}

/**
 * MODEL (for /buy/model/[model])
 * Accepts:
 * - "oceanis-51-1"
 * - "beneteau-oceanis-51-1" (brand prefixed)
 *
 * We do NOT enforce brand matching on model-only pages.
 * Instead we derive canonicalSpaced = modelCandidateRaw || spaced.
 */
export function modelFromParam(param: string): ModelParam {
  const { raw, spaced } = paramToSpaced(param);

  const parts = spaced.split(" ").filter(Boolean);
  const brandCandidateRaw = parts.length >= 2 ? parts[0] : null;
  const modelCandidateRaw = parts.length >= 2 ? parts.slice(1).join(" ") : null;

  const canonicalSpaced = normalizeSpaces(modelCandidateRaw || spaced);
  const canonicalDotted = dottedNumberVariant(canonicalSpaced);

  // For display, we prefer a clean title-cased canonical.
  const display = titleCaseWords(canonicalSpaced);

  // Build robust candidates for DB matching
  const candidates = uniqStrings([
    canonicalSpaced,
    canonicalDotted,
    titleCaseWords(canonicalSpaced),
    titleCaseWords(canonicalDotted),

    // Also include the original spaced/raw forms in case the DB stored the prefixed input
    spaced,
    dottedNumberVariant(spaced),
    titleCaseWords(spaced),
    titleCaseWords(dottedNumberVariant(spaced)),
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

/**
 * MODEL (for /buy/brand/[brand]/model/[model])
 * Brand-scoped routes don’t need the “brandCandidate” parsing.
 * They should still generate dotted + cased candidates robustly.
 */
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

/**
 * Convenience: slug for brand and model canonical.
 */
export function brandSlugFromValue(value: string) {
  return slugifyLoose(paramToSpaced(value).spaced);
}

export function countrySlugFromValue(value: string) {
  return slugifyLoose(paramToSpaced(value).spaced);
}

export function modelSlugFromValue(value: string) {
  // for model-only hubs, prefer dotted normalization in canonical slug
  const spaced = paramToSpaced(value).spaced;
  const canonical = dottedNumberVariant(spaced);
  return slugifyLoose(canonical);
}
