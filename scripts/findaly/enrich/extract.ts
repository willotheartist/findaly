import { fetchText } from "./http";
import type { SourceType, OpinionSourceType } from "./discover";

export type ExtractedFacts = {
  pricingUrl?: string | null;
  hasFreeTrial?: boolean | null;
  trialDays?: number | null;
  hasFreePlan?: boolean | null;
  startingPriceCents?: number | null;
  startingPricePeriod?: "MONTH" | "YEAR" | "ONE_TIME" | "UNKNOWN";
  integrations?: string[];
  featureFlags?: Record<string, boolean>;
  evidence?: Record<string, string[]>; // key -> list of URLs that supported it
};

function textNorm(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function findMoney(html: string): { cents: number | null; period: ExtractedFacts["startingPricePeriod"] } {
  const t = textNorm(html);

  // cheap-but-real extraction: look for "$<num>" and nearby "/month" "/year"
  const moneyRe = /(?:\$|usd\s*)(\d{1,4})(?:\.\d{1,2})?/g;
  let best: number | null = null;
  let m: RegExpExecArray | null;
  while ((m = moneyRe.exec(t))) {
    const n = Number(m[1]);
    if (!Number.isFinite(n)) continue;
    if (n <= 0) continue;
    // keep smallest non-zero price as "starting price" candidate
    if (best === null || n < best) best = n;
  }

  let period: ExtractedFacts["startingPricePeriod"] = "UNKNOWN";
  if (best !== null) {
    // try to infer period if strings exist
    if (t.includes("/month") || t.includes("per month") || t.includes("monthly")) period = "MONTH";
    else if (t.includes("/year") || t.includes("per year") || t.includes("annually") || t.includes("annual")) period = "YEAR";
    else if (t.includes("one-time") || t.includes("one time") || t.includes("lifetime")) period = "ONE_TIME";
  }

  return { cents: best === null ? null : Math.round(best * 100), period };
}

function detectFreeTrial(html: string): { has: boolean | null; days: number | null } {
  const t = textNorm(html);
  const has = t.includes("free trial") ? true : null;

  // detect "14-day" / "14 day free trial"
  const dayRe = /(\d{1,3})\s*-\s*day|\b(\d{1,3})\s*day\b/g;
  let days: number | null = null;
  let m: RegExpExecArray | null;
  while ((m = dayRe.exec(t))) {
    const d = Number(m[1] || m[2]);
    if (Number.isFinite(d) && d > 0 && d <= 365) {
      days = d;
      break;
    }
  }
  return { has, days };
}

function detectFreePlan(html: string): boolean | null {
  const t = textNorm(html);
  if (t.includes("free plan") || t.includes("forever free") || t.includes("free tier")) return true;
  return null;
}

function extractIntegrations(html: string): string[] {
  // lightweight heuristic: look for capitalized integration names in common patterns is hard without deps.
  // Here we extract from explicit list-like tokens: "Slack", "Google Calendar", "Zapier", etc.
  // This is still "real" (derived from official page), but may undercount.
  const candidates = [
    "slack","zapier","google calendar","google drive","gmail","outlook","microsoft teams","zoom","jira","github",
    "gitlab","notion","salesforce","hubspot","stripe","shopify","asana","trello"
  ];
  const t = textNorm(html);
  const found: string[] = [];
  for (const c of candidates) if (t.includes(c)) found.push(c);
  // Title-case display
  return Array.from(new Set(found)).map((x) =>
    x.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  );
}

export async function extractFactsFromSources(sources: Partial<Record<SourceType, string>>): Promise<{
  facts: ExtractedFacts;
  fetched: Record<string, { ok: boolean; status?: number }>;
}> {
  const facts: ExtractedFacts = {
    startingPricePeriod: "UNKNOWN",
    integrations: [],
    featureFlags: {},
    evidence: {},
  };
  const fetched: Record<string, { ok: boolean; status?: number }> = {};

  // PRICING
  if (sources.PRICING) {
    const r = await fetchText(sources.PRICING);
    fetched[sources.PRICING] = { ok: r.status < 400, status: r.status };
    if (r.status < 400) {
      facts.pricingUrl = r.url;
      const { cents, period } = findMoney(r.text);
      if (cents !== null) facts.startingPriceCents = cents;
      facts.startingPricePeriod = period;

      const ft = detectFreeTrial(r.text);
      if (ft.has !== null) facts.hasFreeTrial = ft.has;
      if (ft.days !== null) facts.trialDays = ft.days;

      const fp = detectFreePlan(r.text);
      if (fp !== null) facts.hasFreePlan = fp;

      facts.evidence!["pricing"] = [r.url];
    }
  }

  // INTEGRATIONS
  if (sources.INTEGRATIONS) {
    const r = await fetchText(sources.INTEGRATIONS);
    fetched[sources.INTEGRATIONS] = { ok: r.status < 400, status: r.status };
    if (r.status < 400) {
      const ints = extractIntegrations(r.text);
      if (ints.length) facts.integrations = ints;
      facts.evidence!["integrations"] = [r.url];
    }
  }

  // SECURITY signals → featureFlags (verifiable claims only)
  if (sources.SECURITY) {
    const r = await fetchText(sources.SECURITY);
    fetched[sources.SECURITY] = { ok: r.status < 400, status: r.status };
    if (r.status < 400) {
      const t = r.text.toLowerCase();
      const set = (k: string, v: boolean) => { facts.featureFlags![k] = v; };
      if (t.includes("soc 2") || t.includes("soc2")) set("soc2", true);
      if (t.includes("iso 27001") || t.includes("iso27001")) set("iso27001", true);
      if (t.includes("gdpr")) set("gdpr", true);
      if (t.includes("hipaa")) set("hipaa", true);
      if (t.includes("saml") || t.includes("single sign-on") || t.includes("single sign on")) set("sso", true);
      if (t.includes("scim")) set("scim", true);
      facts.evidence!["security"] = [r.url];
    }
  }

  // DOCS / API signals
  if (sources.DOCS) {
    const r = await fetchText(sources.DOCS);
    fetched[sources.DOCS] = { ok: r.status < 400, status: r.status };
    if (r.status < 400) {
      const t = r.text.toLowerCase();
      if (t.includes("api") || t.includes("developers")) facts.featureFlags!["has_api"] = true;
      facts.evidence!["docs"] = [r.url];
    }
  }

  // CHANGELOG signals
  if (sources.CHANGELOG) {
    const r = await fetchText(sources.CHANGELOG);
    fetched[sources.CHANGELOG] = { ok: r.status < 400, status: r.status };
    if (r.status < 400) {
      // Presence of changelog page is a real signal
      facts.featureFlags!["has_changelog"] = true;
      facts.evidence!["changelog"] = [r.url];
    }
  }

  // STATUS signal
  if (sources.STATUS) {
    const r = await fetchText(sources.STATUS);
    fetched[sources.STATUS] = { ok: r.status < 400, status: r.status };
    if (r.status < 400) {
      facts.featureFlags!["has_status_page"] = true;
      facts.evidence!["status"] = [r.url];
    }
  }

  return { facts, fetched };
}

/* ----------------------------- NEW: CLAIMS ----------------------------- */

export type ExtractedExternalClaim = {
  sourceType: OpinionSourceType | string;
  sourceUrl: string;
  topic:
    | "pricing"
    | "usability"
    | "support"
    | "integrations"
    | "features"
    | "performance"
    | "reliability"
    | "security"
    | "onboarding"
    | "other";
  sentiment: -1 | 0 | 1;
  claim: string;      // normalized summary (no verbatim quotes)
  strength: number;   // 0..1
  evidence?: { snippets?: string[] };
};

function isSearchUrl(u: string) {
  const s = u.toLowerCase();
  return s.includes("google.com/search") || s.includes("bing.com/search") || s.includes("duckduckgo.com/");
}

function topicSignals(): Array<{ topic: ExtractedExternalClaim["topic"]; pos: string[]; neg: string[] }> {
  return [
    {
      topic: "pricing",
      pos: ["good value", "affordable", "fair price", "worth it", "great value"],
      neg: ["expensive", "overpriced", "pricing is high", "price increase", "costs add up", "hidden cost", "billing"],
    },
    {
      topic: "usability",
      pos: ["easy to use", "intuitive", "simple", "clean ui", "user friendly"],
      neg: ["hard to use", "confusing", "clunky", "steep learning curve", "overwhelming", "too complex"],
    },
    {
      topic: "support",
      pos: ["great support", "responsive support", "helpful support", "fast support"],
      neg: ["bad support", "slow support", "unresponsive", "no response", "support is poor"],
    },
    {
      topic: "integrations",
      pos: ["integrations", "connects with", "works with", "api", "zapier"],
      neg: ["missing integration", "no integration", "limited integrations", "integration issues"],
    },
    {
      topic: "performance",
      pos: ["fast", "snappy", "responsive", "reliable performance"],
      neg: ["slow", "lag", "buggy", "crash", "freezes", "performance issues"],
    },
    {
      topic: "reliability",
      pos: ["stable", "reliable", "uptime", "consistent"],
      neg: ["downtime", "outage", "unstable", "data loss"],
    },
    {
      topic: "features",
      pos: ["powerful", "feature rich", "flexible", "customizable", "automation"],
      neg: ["missing features", "limited", "lacks", "feature request", "not enough"],
    },
    {
      topic: "security",
      pos: ["soc2", "gdpr", "iso 27001", "sso", "secure"],
      neg: ["security concern", "privacy concern", "not secure"],
    },
    {
      topic: "onboarding",
      pos: ["easy setup", "quick setup", "onboarding was easy"],
      neg: ["hard to set up", "difficult setup", "onboarding is hard"],
    },
  ];
}

function detectTopicAndSentiment(text: string): {
  topic: ExtractedExternalClaim["topic"];
  sentiment: -1 | 0 | 1;
  strength: number;
} {
  const t = textNorm(text);

  // pick the topic with most hits
  let bestTopic: ExtractedExternalClaim["topic"] = "other";
  let bestScore = 0;
  let bestSent: -1 | 0 | 1 = 0;

  for (const sig of topicSignals()) {
    let posHits = 0;
    let negHits = 0;
    for (const p of sig.pos) if (t.includes(p)) posHits++;
    for (const n of sig.neg) if (t.includes(n)) negHits++;

    const score = posHits + negHits;
    if (score > bestScore) {
      bestScore = score;
      bestTopic = sig.topic;
      bestSent = posHits > negHits ? 1 : negHits > posHits ? -1 : 0;
    }
  }

  // strength: tiny heuristic (more hits => stronger)
  const strength = Math.max(0.25, Math.min(1, bestScore / 3));
  return { topic: bestTopic, sentiment: bestSent, strength };
}

function buildClaimSummary(sourceType: string, topic: string, sentiment: -1 | 0 | 1): string {
  // MVP: simple, non-quoting, non-defamatory language.
  const s =
    sentiment === 1 ? "positive" : sentiment === -1 ? "negative" : "mixed";
  return `Across ${sourceType}, sentiment is ${s} about ${topic}.`;
}

export async function extractClaimsFromOpinionSources(
  opinionSources: Partial<Record<OpinionSourceType, string>>
): Promise<{
  claims: ExtractedExternalClaim[];
  fetched: Record<string, { ok: boolean; status?: number }>;
}> {
  const claims: ExtractedExternalClaim[] = [];
  const fetched: Record<string, { ok: boolean; status?: number }> = {};

  // Only fetch “real” pages for MVP. Skip search URLs (often blocked / noisy).
  const entries = Object.entries(opinionSources).filter(([, url]) => !!url) as Array<
    [OpinionSourceType, string]
  >;

  for (const [sourceType, url] of entries) {
    if (isSearchUrl(url)) continue;

    const r = await fetchText(url);
    fetched[url] = { ok: r.status < 400, status: r.status };
    if (r.status >= 400 || !r.text) continue;

    const { topic, sentiment, strength } = detectTopicAndSentiment(r.text);

    // If we didn’t detect anything meaningful, don’t create junk
    if (topic === "other" && sentiment === 0) continue;

    claims.push({
      sourceType,
      sourceUrl: r.url,
      topic,
      sentiment,
      strength,
      claim: buildClaimSummary(sourceType, topic, sentiment),
      evidence: {
        // keep snippets minimal; avoid long quotes
        snippets: [],
      },
    });
  }

  return { claims, fetched };
}
