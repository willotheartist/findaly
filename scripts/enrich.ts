// scripts/enrich.ts
import "dotenv/config";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
  discoverSourcesFromWebsite,
  discoverOpinionSourcesFromWebsite,
  type SourceType,
} from "./findaly/enrich/discover";
import {
  extractFactsFromSources,
  extractClaimsFromOpinionSources,
} from "./findaly/enrich/extract";
import { ProjectManagementChecklist } from "./findaly/rating/checklists";
import { scoreTool } from "./findaly/rating/score";

/* -------------------------------------------------------------------------- */
/*                                   ARGS                                     */
/* -------------------------------------------------------------------------- */

type Args = {
  categorySlug?: string;
  slugs?: string[];
  limit?: number;
  dryRun?: boolean;
  all?: boolean;
  concurrency?: number;
};

function parseArgs(): Args {
  const a = process.argv.slice(2);
  const out: Args = {};
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    const v = a[i + 1];
    if (k === "--category" && v) {
      out.categorySlug = v;
      i++;
      continue;
    }
    if (k === "--slugs" && v) {
      out.slugs = v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      i++;
      continue;
    }
    if (k === "--limit" && v) {
      out.limit = Number(v);
      i++;
      continue;
    }
    if (k === "--dry") {
      out.dryRun = true;
      continue;
    }
    if (k === "--all") {
      out.all = true;
      continue;
    }
    if (k === "--concurrency" && v) {
      out.concurrency = Number(v);
      i++;
      continue;
    }
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/*                               SMALL HELPERS                                */
/* -------------------------------------------------------------------------- */

type JsonValue = Prisma.InputJsonValue;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isEvidenceMap(v: unknown): v is Record<string, string[]> {
  if (!isRecord(v)) return false;
  return Object.values(v).every((x) => isStringArray(x));
}

/**
 * Convert unknown -> Prisma.InputJsonValue (NO null/JsonNull).
 * Prisma's InputJsonValue type in your version rejects null-ish values,
 * so we normalize null/undefined to {}.
 */
function toJsonValue(v: unknown): JsonValue {
  if (v === null || v === undefined) return {};

  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return v;

  // Objects/arrays: JSON round-trip to strip undefined/functions/etc
  try {
    const cleaned = JSON.parse(JSON.stringify(v)) as unknown;
    // If stringify produced null (can happen), still return {}
    if (cleaned === null || cleaned === undefined) return {};
    return cleaned as JsonValue;
  } catch {
    return {};
  }
}

function mergeFeatureFlags(oldVal: unknown, patch: Record<string, boolean>): Record<string, boolean> {
  const merged: Record<string, boolean> = {};

  if (isRecord(oldVal)) {
    for (const [k, v] of Object.entries(oldVal)) {
      if (typeof v === "boolean") merged[k] = v;
    }
  }

  for (const [k, v] of Object.entries(patch)) merged[k] = v;
  return merged;
}

// Requires @@unique([toolId, type]) in prisma model ToolSource
async function upsertSource(toolId: string, type: SourceType, url: string, meta: JsonValue) {
  return prisma.toolSource.upsert({
    where: { toolId_type: { toolId, type } },
    update: { url, fetchedAt: new Date(), meta },
    create: { toolId, type, url, fetchedAt: new Date(), meta },
  });
}

/**
 * Small no-deps concurrency helper so you don't DDoS websites / your own infra.
 */
async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  fn: (item: T, idx: number) => Promise<void>,
) {
  let i = 0;
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
}

/* -------------------------------------------------------------------------- */
/*                       EXTERNAL CONSENSUS AGGREGATION                        */
/* -------------------------------------------------------------------------- */

type ConsensusTopic = {
  topic: string;
  signal: number; // -1..+1 weighted avg
  sentiment: "positive" | "mixed" | "negative";
  confidence: number; // 0..1 (heuristic)
  sources: string[]; // distinct sourceType values
  n: number; // number of claims for this topic
};

type ExternalConsensusMeta = {
  version: number;
  generatedAt: string; // ISO
  topicCount: number;
  topics: ConsensusTopic[];
};

// You can tune these later; MVP defaults are fine.
const SOURCE_WEIGHTS: Record<string, number> = {
  G2: 1.0,
  CAPTERRA: 0.95,
  TRUSTRADIUS: 0.9,
  SOFTWARE_ADVICE: 0.9,
  GETAPP: 0.85,
  REDDIT_SEARCH: 0.7,
  HN_SEARCH: 0.75,
  BLOG_SEARCH: 0.6,
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function sentimentLabel(signal: number): "positive" | "mixed" | "negative" {
  if (signal >= 0.2) return "positive";
  if (signal <= -0.2) return "negative";
  return "mixed";
}

async function buildExternalConsensusMeta(toolId: string): Promise<ExternalConsensusMeta> {
  const rows = await prisma.externalClaim.findMany({
    where: { toolId },
    select: {
      sourceType: true,
      topic: true,
      sentiment: true,
      strength: true,
    },
  });

  const byTopic = new Map<
    string,
    {
      num: number;
      den: number;
      sources: Set<string>;
      n: number;
      avgStrength: number;
    }
  >();

  for (const r of rows) {
    const topic = r.topic ?? "other";
    const source = r.sourceType ?? "UNKNOWN";
    const strength = typeof r.strength === "number" ? r.strength : 0.5;
    const w = (SOURCE_WEIGHTS[source] ?? 0.75) * strength;

    // sentiment is -1/0/+1 in your model; clamp just in case
    const s = r.sentiment > 0 ? 1 : r.sentiment < 0 ? -1 : 0;

    let entry = byTopic.get(topic);
    if (!entry) {
      entry = { num: 0, den: 0, sources: new Set<string>(), n: 0, avgStrength: 0 };
      byTopic.set(topic, entry);
    }

    entry.num += s * w;
    entry.den += w;
    entry.sources.add(source);
    entry.n += 1;
    entry.avgStrength += strength;
  }

  const topics: ConsensusTopic[] = [];

  for (const [topic, v] of byTopic.entries()) {
    if (v.den <= 0) continue;

    const signal = v.num / v.den; // -1..+1
    const srcCount = v.sources.size;

    const avgStrength = v.n ? v.avgStrength / v.n : 0.5;
    const confidence = clamp01(
      Math.min(1, srcCount / 5) * 0.55 + Math.min(1, v.n / 10) * 0.25 + avgStrength * 0.2,
    );

    topics.push({
      topic,
      signal,
      sentiment: sentimentLabel(signal),
      confidence,
      sources: Array.from(v.sources).sort(),
      n: v.n,
    });
  }

  topics.sort((a, b) => b.confidence * Math.abs(b.signal) - a.confidence * Math.abs(a.signal));

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    topicCount: topics.length,
    topics,
  };
}

/* -------------------------------------------------------------------------- */
/*                           ENRICHMENT PIPELINE                               */
/* -------------------------------------------------------------------------- */

type ToolRow = Prisma.ToolGetPayload<{ include: { primaryCategory: true } }>;

async function persistExternalClaims(tool: ToolRow, args: Args): Promise<{ count: number }> {
  if (!tool.websiteUrl) return { count: 0 };

  const { opinionSources } = await discoverOpinionSourcesFromWebsite(tool.websiteUrl, tool.name);
  const { claims } = await extractClaimsFromOpinionSources(opinionSources);

  console.log(`  -> ExternalClaims=${claims.length}`);

  if (args.dryRun) return { count: claims.length };

  await prisma.externalClaim.deleteMany({ where: { toolId: tool.id } });

  if (!claims.length) return { count: 0 };

  await prisma.externalClaim.createMany({
    data: claims.map((c) => ({
      toolId: tool.id,
      sourceType: String(c.sourceType),
      sourceUrl: c.sourceUrl,
      topic: c.topic,
      sentiment: c.sentiment,
      claim: c.claim,
      strength: c.strength,
      evidence: toJsonValue(c.evidence ?? {}),
    })),
  });

  return { count: claims.length };
}

async function enrichOneTool(tool: ToolRow, categorySlug: string, args: Args) {
  if (!tool.websiteUrl) {
    console.log(`- ${tool.slug}: SKIP (no websiteUrl)`);
    return;
  }

  console.log(`- ${tool.slug}: discover sources from ${tool.websiteUrl}`);

  const { sources } = await discoverSourcesFromWebsite(tool.websiteUrl);

  const discoveredEvidence: Record<string, string[]> = {};
  for (const [type, url] of Object.entries(sources)) {
    if (!url) continue;
    discoveredEvidence[type.toLowerCase()] = [url];
    if (!args.dryRun) {
      await upsertSource(tool.id, type as SourceType, url, toJsonValue({ discoveredFrom: tool.websiteUrl }));
    }
  }

  let consensusMeta: ExternalConsensusMeta | null = null;
  try {
    await persistExternalClaims(tool, args);
    if (!args.dryRun) {
      consensusMeta = await buildExternalConsensusMeta(tool.id);
      console.log(`  -> ExternalConsensusTopics=${consensusMeta.topicCount}`);
    }
  } catch (e) {
    console.error(`  !! External consensus failed for ${tool.slug}`, e);
  }

  const { facts } = await extractFactsFromSources(sources);

  const nextFeatureFlags = mergeFeatureFlags(tool.featureFlags, facts.featureFlags ?? {});
  const nextIntegrations = facts.integrations?.length ? facts.integrations : tool.integrations;

  type ScoreInput = Parameters<typeof scoreTool>[0];

  const prevConfidence =
    typeof tool.dataConfidence === "string" ? tool.dataConfidence : String(tool.dataConfidence ?? "RAW");

  const nextConfidence: ScoreInput["confidence"] = (facts.pricingUrl ||
  (facts.featureFlags && Object.keys(facts.featureFlags).length) ||
  (facts.integrations && facts.integrations.length)
    ? "ENRICHED"
    : prevConfidence) as ScoreInput["confidence"];

  const extractedEvidence = isEvidenceMap(facts.evidence) ? facts.evidence : {};
  const mergedEvidence: Record<string, string[]> = {
    ...extractedEvidence,
    ...discoveredEvidence,
  };

  const { score, meta } = scoreTool({
    category: categorySlug,
    confidence: nextConfidence,
    pricingModel: String(tool.pricingModel),
    startingPriceCents: facts.startingPriceCents ?? tool.startingPriceCents ?? null,
    hasFreeTrial: facts.hasFreeTrial ?? tool.hasFreeTrial ?? null,
    hasFreePlan: facts.hasFreePlan ?? tool.hasFreePlan ?? null,
    integrations: nextIntegrations ?? [],
    featureFlags: nextFeatureFlags,
    evidence: mergedEvidence,
    checklist: ProjectManagementChecklist,
    externalConsensus: consensusMeta,
  });

  const baseMeta = isRecord(meta) ? meta : {};
  const nextMeta = toJsonValue(consensusMeta ? { ...baseMeta, externalConsensus: consensusMeta } : baseMeta);

  console.log(`  -> FindalyScore=${score} confidence=${String(nextConfidence)}`);

  if (!args.dryRun) {
    type ToolUpdateData = Prisma.ToolUpdateArgs["data"];

    await prisma.tool.update({
      where: { id: tool.id },
      data: {
        pricingUrl: facts.pricingUrl ?? tool.pricingUrl,
        hasFreeTrial: facts.hasFreeTrial ?? tool.hasFreeTrial,
        trialDays: facts.trialDays ?? tool.trialDays,
        hasFreePlan: facts.hasFreePlan ?? tool.hasFreePlan,
        startingPriceCents: facts.startingPriceCents ?? tool.startingPriceCents,
        startingPricePeriod: (facts.startingPricePeriod ?? tool.startingPricePeriod) as ToolUpdateData["startingPricePeriod"],
        integrations: nextIntegrations,
        featureFlags: toJsonValue(nextFeatureFlags) as ToolUpdateData["featureFlags"],
        dataConfidence: nextConfidence as ToolUpdateData["dataConfidence"],
        lastVerifiedAt: String(nextConfidence) === "ENRICHED" ? new Date() : tool.lastVerifiedAt,
        findalyScore: score,
        findalyScoreMeta: nextMeta as ToolUpdateData["findalyScoreMeta"],
      },
    });
  }
}

/* -------------------------------------------------------------------------- */
/*                                   MAIN                                     */
/* -------------------------------------------------------------------------- */

async function main() {
  const args = parseArgs();

  if (args.slugs?.length) {
    const tools = await prisma.tool.findMany({
      where: { status: "ACTIVE", slug: { in: args.slugs } },
      include: { primaryCategory: true },
      take: args.limit ?? args.slugs.length,
    });

    const inferredCategory =
      args.categorySlug ?? tools[0]?.primaryCategory?.slug ?? "project-management";

    console.log(`Enriching ${tools.length} tool(s) (slugs override, category=${inferredCategory})`);
    for (const tool of tools) await enrichOneTool(tool, inferredCategory, args);

    console.log("Done.");
    return;
  }

  if (!args.all) {
    const categorySlug = args.categorySlug ?? "project-management";
    const tools = await prisma.tool.findMany({
      where: { status: "ACTIVE", primaryCategory: { slug: categorySlug } },
      include: { primaryCategory: true },
      take: args.limit ?? 999999,
    });

    console.log(`Enriching ${tools.length} tool(s) (category=${categorySlug})`);
    for (const tool of tools) await enrichOneTool(tool, categorySlug, args);

    console.log("Done.");
    return;
  }

  const categories = await prisma.category.findMany({
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });

  console.log(`Enriching ALL categories: ${categories.length}`);

  const concurrency = args.concurrency ?? 2;

  for (const cat of categories) {
    const tools = await prisma.tool.findMany({
      where: {
        status: "ACTIVE",
        primaryCategory: { slug: cat.slug },
        websiteUrl: { not: null },
      },
      include: { primaryCategory: true },
      take: args.limit ?? 999999,
    });

    console.log(`\n==> ${cat.slug} (${tools.length} tools)`);

    await runWithConcurrency(tools, concurrency, async (tool) => {
      try {
        await enrichOneTool(tool, cat.slug, args);
      } catch (e) {
        console.error(`!! ${cat.slug}/${tool.slug} failed`, e);
      }
    });
  }

  console.log("\nDone (all categories).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
