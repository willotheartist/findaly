import { fetchText } from "./http";

export type SourceType =
  | "PRICING"
  | "SECURITY"
  | "DOCS"
  | "INTEGRATIONS"
  | "CHANGELOG"
  | "STATUS";

export type DiscoveredSources = Partial<Record<SourceType, string>>;

// NEW: opinion sources (web consensus)
export type OpinionSourceType =
  | "G2"
  | "CAPTERRA"
  | "GETAPP"
  | "SOFTWARE_ADVICE"
  | "TRUSTRADIUS"
  | "REDDIT_SEARCH"
  | "HN_SEARCH"
  | "BLOG_SEARCH";

export type DiscoveredOpinionSources = Partial<Record<OpinionSourceType, string>>;

function normalizeUrl(maybeUrl: string, base: string): string | undefined {
  try {
    return new URL(maybeUrl, base).toString();
  } catch {
    return undefined;
  }
}

function extractLinks(html: string): string[] {
  const out: string[] = [];
  const re = /<a\s+[^>]*href=["']([^"'#]+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

function pickBest(base: string, links: string[], keywords: string[]): string | undefined {
  const scored: Array<{ url: string; score: number }> = [];
  for (const href of links) {
    const abs = normalizeUrl(href, base);
    if (!abs) continue;
    const u = abs.toLowerCase();
    let score = 0;
    for (const k of keywords) if (u.includes(k)) score += 10;
    if (u.startsWith(base.toLowerCase())) score += 2; // same-domain slight boost
    // prefer shorter URLs
    score += Math.max(0, 10 - Math.min(10, u.length / 20));
    if (score > 0) scored.push({ url: abs, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.url;
}

/**
 * NEW: Find off-site review/rating pages linked from the vendor site (best),
 * otherwise provide search URLs (fallback) so the next pipeline step can fetch/parse.
 */
function pickBestExternal(links: string[], domainKeywords: string[]): string | undefined {
  const scored: Array<{ url: string; score: number }> = [];
  for (const href of links) {
    // allow absolute-only for external review sites
    let abs: string | undefined;
    try {
      abs = new URL(href).toString();
    } catch {
      continue;
    }
    const u = abs.toLowerCase();
    let score = 0;
    for (const k of domainKeywords) if (u.includes(k)) score += 20;
    // prefer shorter canonical pages
    score += Math.max(0, 10 - Math.min(10, u.length / 25));
    if (score > 0) scored.push({ url: abs, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.url;
}

function googleQueryUrl(q: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

export async function discoverSourcesFromWebsite(websiteUrl: string): Promise<{
  homepage: { finalUrl: string; html: string } | null;
  sources: DiscoveredSources;
}> {
  // We only discover from official website HTML (real sources).
  const home = await fetchText(websiteUrl);
  if (!home.text || home.status >= 400) return { homepage: null, sources: {} };

  const base = new URL(home.url).origin;
  const links = extractLinks(home.text);

  const sources: DiscoveredSources = {
    PRICING: pickBest(base, links, ["pricing", "plans", "plan", "billing"]),
    SECURITY: pickBest(base, links, ["security", "trust", "compliance", "soc2", "gdpr", "privacy"]),
    DOCS: pickBest(base, links, ["docs", "documentation", "developers", "api", "help", "support", "knowledge-base"]),
    INTEGRATIONS: pickBest(base, links, ["integrations", "apps", "app-directory", "marketplace"]),
    CHANGELOG: pickBest(base, links, ["changelog", "release", "releases", "updates", "what's-new", "whats-new"]),
    STATUS: pickBest(base, links, ["status", "uptime"]),
  };

  return { homepage: { finalUrl: home.url, html: home.text }, sources };
}

// NEW: opinion discovery (ratings/reviews chatter)
export async function discoverOpinionSourcesFromWebsite(
  websiteUrl: string,
  toolName?: string
): Promise<{
  homepage: { finalUrl: string; html: string } | null;
  opinionSources: DiscoveredOpinionSources;
}> {
  const home = await fetchText(websiteUrl);
  if (!home.text || home.status >= 400) return { homepage: null, opinionSources: {} };

  const links = extractLinks(home.text);

  // 1) Prefer explicit outbound links to review platforms
  const g2 = pickBestExternal(links, ["g2.com", "g2crowd.com"]);
  const capterra = pickBestExternal(links, ["capterra.com"]);
  const getapp = pickBestExternal(links, ["getapp.com"]);
  const softwareAdvice = pickBestExternal(links, ["softwareadvice.com"]);
  const trustRadius = pickBestExternal(links, ["trustradius.com"]);

  // 2) Fallback: search queries (safe + simple)
  const qName = toolName?.trim() ? toolName.trim() : websiteUrl;

  const opinionSources: DiscoveredOpinionSources = {
    ...(g2 ? { G2: g2 } : {}),
    ...(capterra ? { CAPTERRA: capterra } : {}),
    ...(getapp ? { GETAPP: getapp } : {}),
    ...(softwareAdvice ? { SOFTWARE_ADVICE: softwareAdvice } : {}),
    ...(trustRadius ? { TRUSTRADIUS: trustRadius } : {}),
    REDDIT_SEARCH: googleQueryUrl(`${qName} reddit review`),
    HN_SEARCH: googleQueryUrl(`${qName} site:news.ycombinator.com`),
    BLOG_SEARCH: googleQueryUrl(`${qName} review OR "we switched" OR "alternatives"`),
  };

  return { homepage: { finalUrl: home.url, html: home.text }, opinionSources };
}
