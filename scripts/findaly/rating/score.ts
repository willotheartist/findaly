import type { ChecklistItem } from "./checklists";

type Confidence = number; // 0..1

export type SubscoreV2 = {
  score: number; // 0..10
  confidence: Confidence; // 0..1
  evidence: Record<string, string[]>;
};

export type ExternalConsensusTopic = {
  topic: string;
  signal: number; // -1..+1
  sentiment: "positive" | "mixed" | "negative";
  confidence: number; // 0..1
  sources: string[];
  n: number;
};

export type ExternalConsensusMeta = {
  version?: number;
  generatedAt?: string;
  topicCount?: number;
  topics?: ExternalConsensusTopic[];
};

export type RatingMeta = {
  version: "v2";
  category: string;
  confidence: "SEEDED" | "ENRICHED" | "VERIFIED";

  // v2: richer subscores
  subscores: {
    pricingValue: SubscoreV2;
    featureCoverage: SubscoreV2;
    integrations: SubscoreV2;
    security: SubscoreV2;
    apiDev: SubscoreV2;
    reliability: SubscoreV2;
    consensus: SubscoreV2;
  };

  // weights used after availability/renormalization
  weights: Record<string, number>;

  evidence: Record<string, string[]>;
  checklistHit: Array<{ key: string; label: string; hit: boolean; weight: number }>;

  // keep the external consensus payload (real)
  externalConsensus?: ExternalConsensusMeta | null;
};

function clamp10(x: number) {
  return Math.max(0, Math.min(10, x));
}
function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}
function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
function safeObj(v: unknown): Record<string, unknown> {
  return isObj(v) ? v : {};
}
function safeArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function pickEvidence(evidence: Record<string, string[]>, keys: string[]) {
  const out: Record<string, string[]> = {};
  for (const k of keys) {
    const v = evidence[k];
    if (Array.isArray(v) && v.length) out[k] = v;
  }
  return out;
}

function hasAnyEvidence(e: Record<string, string[]>) {
  return Object.values(e).some((arr) => Array.isArray(arr) && arr.length > 0);
}

function isSentiment(v: unknown): v is ExternalConsensusTopic["sentiment"] {
  return v === "positive" || v === "negative" || v === "mixed";
}

function parseExternalConsensus(v: unknown): ExternalConsensusMeta | null {
  const obj = safeObj(v);
  const topicsRaw = obj["topics"];

  const topics: ExternalConsensusTopic[] = safeArray(topicsRaw)
    .map((t) => safeObj(t))
    .map((t) => {
      const sentimentRaw = t["sentiment"];
      const sourcesRaw = t["sources"];

      return {
        topic: String(t["topic"] ?? "other"),
        signal: Number(t["signal"] ?? 0),
        sentiment: isSentiment(sentimentRaw) ? sentimentRaw : "mixed",
        confidence: Number(t["confidence"] ?? 0),
        sources: Array.isArray(sourcesRaw) ? sourcesRaw.map((x) => String(x)) : [],
        n: Number(t["n"] ?? 0),
      };
    })
    .filter((t) => t.topic && Number.isFinite(t.signal) && Number.isFinite(t.confidence));

  if (!topics.length) return null;

  return {
    version: typeof obj["version"] === "number" ? obj["version"] : undefined,
    generatedAt: typeof obj["generatedAt"] === "string" ? obj["generatedAt"] : undefined,
    topicCount: typeof obj["topicCount"] === "number" ? obj["topicCount"] : topics.length,
    topics,
  };
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((s, x) => s + x, 0) / nums.length;
}

function integrationsScoreFromCount(n: number) {
  // Smoothly grows; avoids huge jumps
  // n=0 -> ~2, n=2 -> ~4, n=5 -> ~5.5, n=10 -> ~7, n=20 -> ~8.5, n=50 -> ~10
  const s = 2 + Math.log10(n + 1) * 4.2;
  return clamp10(s);
}

function consensusTopic(external: ExternalConsensusMeta | null, topic: string) {
  const topics = external?.topics ?? [];
  return topics.find((t) => String(t.topic).toLowerCase() === topic.toLowerCase()) ?? null;
}

export function scoreTool(input: {
  category: string;
  confidence: "SEEDED" | "ENRICHED" | "VERIFIED";
  pricingModel: string;
  startingPriceCents?: number | null;
  hasFreeTrial?: boolean | null;
  hasFreePlan?: boolean | null;
  integrations?: string[];
  featureFlags?: Record<string, unknown>;
  evidence?: Record<string, string[]>;
  checklist: ChecklistItem[];

  // NEW: pass Tool.externalConsensus (stored JSON) so we can score/attach it
  externalConsensus?: unknown;
}): { score: number; meta: RatingMeta } {
  const ff = input.featureFlags ?? {};
  const integrations = input.integrations ?? [];
  const evidence = input.evidence ?? {};

  const externalConsensus = parseExternalConsensus(input.externalConsensus);

  // ---------------- Pricing value ----------------
  let pricingValue = 4.5;
  const pm = String(input.pricingModel || "").toUpperCase();

  if (pm === "FREE") pricingValue += 3.0;
  if (pm === "FREEMIUM") pricingValue += 2.0;

  if (input.hasFreeTrial) pricingValue += 1.0;
  if (input.hasFreePlan) pricingValue += 1.0;

  if (typeof input.startingPriceCents === "number" && input.startingPriceCents > 0) {
    if (input.startingPriceCents <= 1000) pricingValue += 1.0;
    else if (input.startingPriceCents >= 5000) pricingValue -= 0.8;
  }

  pricingValue = clamp10(pricingValue);

  const pricingEvidence = pickEvidence(evidence, ["pricing"]);
  const pricingConfidence = clamp01(
    (hasAnyEvidence(pricingEvidence) ? 0.85 : 0.35) +
      (typeof input.startingPriceCents === "number" && input.startingPriceCents > 0 ? 0.1 : 0) +
      (input.hasFreePlan ? 0.05 : 0) +
      (input.hasFreeTrial ? 0.05 : 0),
  );

  // ---------------- Feature coverage (checklist) ----------------
  const totalW = input.checklist.reduce((s, x) => s + x.weight, 0) || 1;
  let hitW = 0;

  const checklistHit = input.checklist.map((it) => {
    const hit = !!ff[it.key];
    if (hit) hitW += it.weight;
    return { key: it.key, label: it.label, hit, weight: it.weight };
  });

  const featureCoverageScore = clamp10((hitW / totalW) * 10);

  // Confidence: how much of the checklist we can “see”
  const checklistCoverage = clamp01(hitW / totalW);
  const featureCoverageConfidence = clamp01(0.35 + checklistCoverage * 0.65);

  const featureEvidence = pickEvidence(evidence, [
    "docs",
    "security",
    "integrations",
    "pricing",
    "changelog",
    "status",
  ]);

  // ---------------- Integrations ----------------
  let integrationsScore = integrationsScoreFromCount(integrations.length);
  const integConsensus = consensusTopic(externalConsensus, "integrations");
  if (integConsensus) {
    // small, real nudge based on consensus signal (bounded)
    integrationsScore = clamp10(integrationsScore + clamp10(integConsensus.signal * 1.2) - 5 /*recenter*/);
    // The recenter above makes signal 0 => +0, +1 => +1.2, -1 => -1.2
    // (Using clamp10 trick to avoid NaN issues; value stays bounded)
  }

  const integrationsEvidence = pickEvidence(evidence, ["integrations"]);
  const integrationsConfidence = clamp01(
    (hasAnyEvidence(integrationsEvidence) ? 0.8 : 0.25) +
      (integrations.length >= 5 ? 0.1 : 0) +
      (integConsensus ? clamp01(integConsensus.confidence) * 0.25 : 0),
  );

  // ---------------- Security & compliance ----------------
  let securityScore = 2.5;
  if (ff.soc2) securityScore += 3.2;
  if (ff.iso27001) securityScore += 2.3;
  if (ff.gdpr) securityScore += 1.0;
  if (ff.hipaa) securityScore += 1.2;
  if (ff.sso) securityScore += 1.0;
  if (ff.scim) securityScore += 1.0;
  securityScore = clamp10(securityScore);

  const securityEvidence = pickEvidence(evidence, ["security"]);
  const securityConfidence = clamp01(
    (hasAnyEvidence(securityEvidence) ? 0.85 : 0.2) + (ff.soc2 || ff.iso27001 ? 0.1 : 0),
  );

  // ---------------- API & developers ----------------
  let apiDevScore = 3.0;
  if (ff.has_api) apiDevScore += 4.5;
  // docs presence is meaningful even if we didn’t extract a specific flag
  const docsEvidence = pickEvidence(evidence, ["docs"]);
  if (hasAnyEvidence(docsEvidence)) apiDevScore += 1.5;
  apiDevScore = clamp10(apiDevScore);

  const apiDevConfidence = clamp01((hasAnyEvidence(docsEvidence) ? 0.8 : 0.2) + (ff.has_api ? 0.1 : 0));

  // ---------------- Reliability & transparency ----------------
  let reliabilityScore = 2.5;
  if (ff.has_status_page) reliabilityScore += 3.5;
  if (ff.has_changelog) reliabilityScore += 4.0;
  reliabilityScore = clamp10(reliabilityScore);

  const reliabilityEvidence = pickEvidence(evidence, ["status", "changelog"]);
  const reliabilityConfidence = clamp01(
    (hasAnyEvidence(reliabilityEvidence) ? 0.85 : 0.2) + (ff.has_status_page || ff.has_changelog ? 0.05 : 0),
  );

  // ---------------- Consensus (overall) ----------------
  const topics = externalConsensus?.topics ?? [];
  let consensusScore = 0;
  let consensusConfidence: Confidence = 0;
  let consensusEvidence: Record<string, string[]> = {};

  if (topics.length) {
    const confs = topics.map((t) => clamp01(t.confidence));
    const signals = topics.map((t) => Math.max(-1, Math.min(1, t.signal)));
    const avgSignal = avg(signals);
    const avgConf = avg(confs);

    // map -1..+1 to roughly 2..8 around neutral 5, then confidence expands range a bit
    consensusScore = clamp10(5 + avgSignal * (2.0 + avgConf * 2.0));
    consensusConfidence = clamp01(avgConf);

    const sourceNames = Array.from(new Set(topics.flatMap((t) => t.sources ?? []).filter(Boolean)));
    consensusEvidence = sourceNames.length ? { externalConsensus: sourceNames } : {};
  }

  // ---------------- Weighted total (0–10), with availability-aware weights ----------------
  const baseWeights: Record<string, number> = {
    pricingValue: 0.18,
    featureCoverage: 0.28,
    integrations: 0.16,
    security: 0.18,
    apiDev: 0.10,
    reliability: 0.10,
    consensus: 0.10,
  };

  const parts: Array<{ key: keyof RatingMeta["subscores"]; score: number; conf: number }> = [
    { key: "pricingValue", score: pricingValue, conf: pricingConfidence },
    { key: "featureCoverage", score: featureCoverageScore, conf: featureCoverageConfidence },
    { key: "integrations", score: integrationsScore, conf: integrationsConfidence },
    { key: "security", score: securityScore, conf: securityConfidence },
    { key: "apiDev", score: apiDevScore, conf: apiDevConfidence },
    { key: "reliability", score: reliabilityScore, conf: reliabilityConfidence },
    { key: "consensus", score: consensusScore, conf: consensusConfidence },
  ];

  // If a component has essentially no backing data, drop its weight and renormalize
  const activeKeys = parts
    .filter((p) => (p.key !== "consensus" ? p.conf >= 0.25 : p.conf > 0)) // consensus must exist to count
    .map((p) => p.key);

  const weightSum = activeKeys.reduce((s, k) => s + (baseWeights[k] ?? 0), 0) || 1;

  const weights: Record<string, number> = {};
  for (const k of Object.keys(baseWeights)) {
    const kk = k as keyof RatingMeta["subscores"];
    weights[kk] = activeKeys.includes(kk) ? baseWeights[kk] / weightSum : 0;
  }

  let raw = 0;
  for (const p of parts) raw += p.score * (weights[p.key] ?? 0);
  raw = clamp10(raw);

  // Confidence scaling (your original approach, kept)
  const confMult = input.confidence === "VERIFIED" ? 1.0 : input.confidence === "ENRICHED" ? 0.95 : 0.85;
  const score = clamp10(raw * confMult);

  const meta: RatingMeta = {
    version: "v2",
    category: input.category,
    confidence: input.confidence,
    subscores: {
      pricingValue: {
        score: Number(pricingValue.toFixed(2)),
        confidence: Number(pricingConfidence.toFixed(3)),
        evidence: pricingEvidence,
      },
      featureCoverage: {
        score: Number(featureCoverageScore.toFixed(2)),
        confidence: Number(featureCoverageConfidence.toFixed(3)),
        evidence: featureEvidence,
      },
      integrations: {
        score: Number(integrationsScore.toFixed(2)),
        confidence: Number(integrationsConfidence.toFixed(3)),
        evidence: integrationsEvidence,
      },
      security: {
        score: Number(securityScore.toFixed(2)),
        confidence: Number(securityConfidence.toFixed(3)),
        evidence: securityEvidence,
      },
      apiDev: {
        score: Number(apiDevScore.toFixed(2)),
        confidence: Number(apiDevConfidence.toFixed(3)),
        evidence: docsEvidence,
      },
      reliability: {
        score: Number(reliabilityScore.toFixed(2)),
        confidence: Number(reliabilityConfidence.toFixed(3)),
        evidence: reliabilityEvidence,
      },
      consensus: {
        score: Number(consensusScore.toFixed(2)),
        confidence: Number(consensusConfidence.toFixed(3)),
        evidence: consensusEvidence,
      },
    },
    weights,
    evidence,
    checklistHit,
    externalConsensus,
  };

  return { score: Number(score.toFixed(2)), meta };
}
