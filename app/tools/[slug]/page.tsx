// app/tools/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";

import {
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  Info,
  Layers,
  Plug,
  XCircle,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { getToolInternalLinks, type LinkItem } from "@/lib/internalLinking/engine";
import { getAlternatives } from "@/lib/decision/alternatives";
import ToolLogo from "@/components/ToolLogo";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

function slugifyCategory(category: string) {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

function getDomain(url?: string | null) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function uniqueTop(arr: (string | null | undefined)[], n: number) {
  return Array.from(new Set(arr.map((x) => (x ?? "").trim()).filter(Boolean))).slice(0, n);
}

function fmtPriceFromCents(cents?: number | null) {
  if (cents === null || cents === undefined) return null;
  const value = (cents / 100).toFixed(2);
  return value.endsWith(".00") ? value.slice(0, -3) : value;
}

function periodLabel(p?: string | null) {
  switch (p) {
    case "MONTH":
      return "/mo";
    case "YEAR":
      return "/yr";
    case "ONE_TIME":
      return " one-time";
    default:
      return "";
  }
}

function isIndexWorthy(tool: {
  shortDescription?: string | null;
  bestFor?: string[] | null;
  targetAudience?: string[] | null;
  keyFeatures?: string[] | null;
}) {
  const hasShort = Boolean((tool.shortDescription ?? "").trim());
  const bestForCount = (tool.bestFor ?? []).filter(Boolean).length;
  const audCount = (tool.targetAudience ?? []).filter(Boolean).length;
  const featCount = (tool.keyFeatures ?? []).filter(Boolean).length;

  return hasShort && (bestForCount >= 3 || audCount >= 3) && featCount >= 5;
}

function safeJsonObject(v: unknown): Record<string, unknown> {
  if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
  return {};
}

function prettyKey(k: string) {
  return k
    .replace(/^has_/, "")
    .replace(/_/g, " ")
    .replace(/\bapi\b/i, "API")
    .replace(/\bsso\b/i, "SSO")
    .replace(/\bocr\b/i, "OCR")
    .replace(/\bgdpr\b/i, "GDPR")
    .replace(/\bai\b/i, "AI")
    .replace(/\bcrm\b/i, "CRM")
    .replace(/\bseo\b/i, "SEO")
    .replace(/\b2fa\b/i, "2FA")
    .replace(/\bhipaa\b/i, "HIPAA")
    .replace(/\bslack\b/i, "Slack")
    .replace(/\bzapier\b/i, "Zapier")
    .replace(/^\w/, (m) => m.toUpperCase());
}

type FeatureItem = {
  key: string;
  label: string;
  value: true | string;
};

function extractFeatureItems(featureFlags: Record<string, unknown>): FeatureItem[] {
  const items: FeatureItem[] = [];
  for (const [k, v] of Object.entries(featureFlags)) {
    if (v === true) items.push({ key: k, label: prettyKey(k), value: true });
    else if (typeof v === "string" && v.trim().length > 0)
      items.push({ key: k, label: `${prettyKey(k)}: ${v.trim()}`, value: v.trim() });
  }
  return items;
}

function groupForKey(k: string) {
  const s = k.toLowerCase();
  if (
    s.includes("sso") ||
    s.includes("2fa") ||
    s.includes("rbac") ||
    s.includes("audit") ||
    s.includes("gdpr") ||
    s.includes("hipaa") ||
    s.includes("soc2") ||
    s.includes("security")
  )
    return "Security";
  if (s.includes("api") || s.includes("webhook") || s.includes("sdk")) return "API & Dev";
  if (
    s.includes("integration") ||
    s.includes("zapier") ||
    s.includes("slack") ||
    s.includes("salesforce")
  )
    return "Integrations";
  if (
    s.includes("billing") ||
    s.includes("invoice") ||
    s.includes("payment") ||
    s.includes("stripe") ||
    s.includes("pricing")
  )
    return "Billing";
  if (s.includes("team") || s.includes("collab") || s.includes("comment") || s.includes("share"))
    return "Collaboration";
  if (s.includes("report") || s.includes("analytics") || s.includes("dashboard") || s.includes("export"))
    return "Reporting";
  if (s.includes("ai") || s.includes("gpt") || s.includes("llm") || s.includes("automation"))
    return "AI & Automation";
  return "Core";
}

function buildFeatureGroups(items: FeatureItem[]) {
  const groups = new Map<string, FeatureItem[]>();
  for (const it of items) {
    const g = groupForKey(it.key);
    groups.set(g, [...(groups.get(g) ?? []), it]);
  }
  const order = [
    "Core",
    "AI & Automation",
    "Reporting",
    "Collaboration",
    "Integrations",
    "API & Dev",
    "Billing",
    "Security",
  ];
  return order
    .filter((g) => (groups.get(g) ?? []).length)
    .map((g) => ({ name: g, items: (groups.get(g) ?? []).slice(0, 10) }));
}

/* ---------------------- External consensus types ---------------------- */

type ConsensusTopic = {
  topic: string;
  signal: number; // -1..+1
  sentiment: "positive" | "mixed" | "negative";
  confidence: number; // 0..1
  sources: string[];
  n: number;
};

type Sentiment = "positive" | "mixed" | "negative";

function isSentiment(v: unknown): v is Sentiment {
  return v === "positive" || v === "mixed" || v === "negative";
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

type ExternalConsensusMeta = {
  version?: number;
  generatedAt?: string;
  topicCount?: number;
  topics?: ConsensusTopic[];
};

function parseExternalConsensus(v: unknown): ExternalConsensusMeta | null {
  const obj = safeJsonObject(v);
  const topicsRaw = obj["topics"];
  const topics: ConsensusTopic[] = Array.isArray(topicsRaw)
    ? topicsRaw
        .map((t) => safeJsonObject(t))
        .map((t) => ({
          topic: String(t["topic"] ?? "other"),
          signal: Number(t["signal"] ?? 0),
          sentiment: isSentiment(t["sentiment"]) ? t["sentiment"] : "mixed",
          confidence: Number(t["confidence"] ?? 0),
          sources: asStringArray(t["sources"]),
          n: Number(t["n"] ?? 0),
        }))
        .filter((t) => t.topic && Number.isFinite(t.signal) && Number.isFinite(t.confidence))
    : [];

  if (!topics.length) return null;

  return {
    version: typeof obj["version"] === "number" ? (obj["version"] as number) : undefined,
    generatedAt: typeof obj["generatedAt"] === "string" ? (obj["generatedAt"] as string) : undefined,
    topicCount: typeof obj["topicCount"] === "number" ? (obj["topicCount"] as number) : topics.length,
    topics,
  };
}

function fmtSentiment(s: ConsensusTopic["sentiment"]) {
  if (s === "positive") return "Positive";
  if (s === "negative") return "Negative";
  return "Mixed";
}

function fmtTopicLabel(topic: string) {
  const t = topic.replace(/_/g, " ").trim();
  return t.length ? t.charAt(0).toUpperCase() + t.slice(1) : "Other";
}

function humanizeSourceName(s: string) {
  const key = s.trim().toUpperCase();
  const map: Record<string, string> = {
    SOFTWARE_ADVICE: "Software Advice",
    TRUSTRADIUS: "TrustRadius",
    GETAPP: "GetApp",
    CAPTERRA: "Capterra",
    G2: "G2",
    REDDIT: "Reddit",
    HN: "Hacker News",
    YOUTUBE: "YouTube",
  };
  return (
    map[key] ??
    s
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (m) => m.toUpperCase())
  );
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function sentimentPillClasses(s: ConsensusTopic["sentiment"]) {
  if (s === "positive") return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  if (s === "negative") return "border-rose-400/25 bg-rose-400/10 text-rose-200";
  return "border-violet-400/25 bg-violet-400/10 text-violet-200";
}

function sentimentFillGradient(s: ConsensusTopic["sentiment"]) {
  if (s === "positive") {
    return "linear-gradient(90deg, rgba(16,185,129,0.95), rgba(52,211,153,0.65), rgba(110,231,183,0.20))";
  }
  if (s === "negative") {
    return "linear-gradient(90deg, rgba(244,63,94,0.95), rgba(251,113,133,0.65), rgba(253,164,175,0.20))";
  }
  return "linear-gradient(90deg, rgba(139,92,246,0.95), rgba(167,139,250,0.65), rgba(196,181,253,0.20))";
}

function ConfidenceBar({
  value,
  sentiment,
  compact,
}: {
  value: number;
  sentiment: ConsensusTopic["sentiment"];
  compact?: boolean;
}) {
  const pct = Math.round(clamp01(value) * 100);
  const fillStyle: CSSProperties = {
    width: `${pct}%`,
    backgroundImage: sentimentFillGradient(sentiment),
  };

  return (
    <div className={compact ? "mt-4" : "mt-5"}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Confidence</p>
          <p className="mt-1 text-sm text-white/70">How consistent this theme is across sources</p>
        </div>
        <div className="shrink-0 text-right">
          <p
            className={
              compact
                ? "text-3xl font-semibold tabular-nums text-white"
                : "text-5xl font-semibold tabular-nums text-white"
            }
          >
            {pct}%
          </p>
          <p className="text-xs text-white/50">Platform-level consensus</p>
        </div>
      </div>

      <div className={compact ? "mt-3" : "mt-4"}>
        <div className={compact ? "h-3 w-full rounded-full bg-white/10" : "h-4 w-full rounded-full bg-white/10"}>
          <div className="h-full rounded-full" style={fillStyle} />
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Findaly rating (v2 meta) ---------------------- */

type FindalySubscoreV2 = {
  score?: number;
  confidence?: number; // 0..1
  evidence?: Record<string, string[]>;
};

function isSubscoreV2(v: unknown): v is FindalySubscoreV2 {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  const o = v as Record<string, unknown>;
  const scOk = o.score === undefined || typeof o.score === "number";
  const confOk = o.confidence === undefined || typeof o.confidence === "number";
  const evOk = o.evidence === undefined || (o.evidence && typeof o.evidence === "object" && !Array.isArray(o.evidence));
  return !!(scOk && confOk && evOk);

}

function scoreToPct(score0to10: number) {
  const s = Math.max(0, Math.min(10, score0to10));
  return Math.round(s * 10);
}

function fmtEvidenceDomains(ev: Record<string, string[]>, limit = 3) {
  const urls = Object.values(ev ?? {})
    .flat()
    .filter(Boolean)
    .slice(0, 30);

  const domains = Array.from(
    new Set(
      urls
        .map((u) => getDomain(u))
        .filter((x): x is string => Boolean(x))
    )
  );

  return domains.slice(0, limit);
}

function overallConsensusSentiment(externalConsensus: ExternalConsensusMeta | null): ConsensusTopic["sentiment"] {
  const topics = externalConsensus?.topics ?? [];
  if (!topics.length) return "mixed";
  const avg = topics.reduce((s, t) => s + (Number.isFinite(t.signal) ? t.signal : 0), 0) / topics.length;
  if (avg >= 0.2) return "positive";
  if (avg <= -0.2) return "negative";
  return "mixed";
}

function ScorePill({
  pct,
  sentiment,
  label,
}: {
  pct: number;
  sentiment: ConsensusTopic["sentiment"];
  label?: string;
}) {
  const fillStyle: CSSProperties = {
    width: `${Math.max(0, Math.min(100, pct))}%`,
    backgroundImage: sentimentFillGradient(sentiment),
  };

  return (
    <div className="mt-3">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {label ? (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">{label}</p>
          ) : null}
        </div>
        <p className="text-4xl font-semibold tabular-nums text-white">{pct}%</p>
      </div>
      <div className="mt-3 h-3 w-full rounded-full bg-white/10">
        <div className="h-3 rounded-full" style={fillStyle} />
      </div>
    </div>
  );
}

function FindalyRatingPanel({
  toolName,
  findalyScore,
  findalyMeta,
  externalConsensus,
}: {
  toolName: string;
  findalyScore: number | null;
  findalyMeta: Record<string, unknown>;
  externalConsensus: ExternalConsensusMeta | null;
}) {
  const version = String(findalyMeta["version"] ?? "");
  const subs = safeJsonObject(findalyMeta["subscores"]);

  const order: Array<{ key: string; label: string; sentiment?: "consensus" | "neutral" }> = [
    { key: "pricingValue", label: "Pricing value", sentiment: "neutral" },
    { key: "featureCoverage", label: "Feature coverage", sentiment: "neutral" },
    { key: "integrations", label: "Integrations", sentiment: "neutral" },
    { key: "security", label: "Security & compliance", sentiment: "neutral" },
    { key: "apiDev", label: "API & developers", sentiment: "neutral" },
    { key: "reliability", label: "Reliability", sentiment: "neutral" },
    { key: "consensus", label: "Consensus", sentiment: "consensus" },
  ];

  const isV2 = version === "v2";
  const overallPct = findalyScore === null ? null : scoreToPct(findalyScore);
  const consensusSent = overallConsensusSentiment(externalConsensus);

  function consensusTopicsForOverall(ex: ExternalConsensusMeta | null): ConsensusTopic["sentiment"] | null {
    if (!ex?.topics?.length) return null;
    return overallConsensusSentiment(ex);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Findaly rating</p>
          <p className="mt-2 text-sm text-white/70">
            A structured score based on verified product signals and third-party consensus.
          </p>
        </div>
        {isV2 ? (
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            v2
          </span>
        ) : null}
      </div>

      {overallPct !== null ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Overall</p>
          <p className="mt-2 text-sm text-white/70">How {toolName} stacks up on our signals today</p>
          <ScorePill pct={overallPct} sentiment={consensusTopicsForOverall(externalConsensus) ? consensusSent : "mixed"} />
          <p className="mt-3 text-xs text-white/50">0–100 scale (derived from 0–10)</p>
        </div>
      ) : (
        <p className="mt-5 text-sm text-white/70">We don’t have a Findaly rating for {toolName} yet.</p>
      )}

      {isV2 ? (
        <div className="mt-5 grid gap-3">
          {order.map(({ key, label, sentiment }) => {
            const raw = subs[key];
            if (!isSubscoreV2(raw)) return null;

            const score = typeof raw.score === "number" ? raw.score : null;
            const conf = typeof raw.confidence === "number" ? raw.confidence : null;
            const ev = (raw.evidence ?? {}) as Record<string, string[]>;
            const basedOn = fmtEvidenceDomains(ev, 3);

            const pct = score === null ? null : scoreToPct(score);
            const confPct = conf === null ? null : Math.round(clamp01(conf) * 100);

            const cardSentiment: ConsensusTopic["sentiment"] =
              sentiment === "consensus" ? consensusSent : "mixed";

            // Skip empty rows (real data only)
            if (score === null && conf === null && !basedOn.length) return null;

            const fillStyle: CSSProperties = {
              width: `${Math.max(0, Math.min(100, confPct ?? 0))}%`,
              backgroundImage: sentimentFillGradient(cardSentiment),
            };

            return (
              <div
                key={key}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">{label}</p>
                    <div className="mt-2 flex items-end gap-2">
                      <p className="text-2xl font-semibold tabular-nums text-white">
                        {score !== null ? score.toFixed(1) : "—"}
                      </p>
                      <p className="pb-1 text-xs text-white/50">/10</p>
                      {pct !== null ? (
                        <span className="ml-auto text-xs font-semibold tabular-nums text-white/70">{pct}%</span>
                      ) : null}
                    </div>
                    {basedOn.length ? (
                      <p className="mt-2 text-xs text-white/55">
                        Based on: <span className="text-white/70">{basedOn.join(", ")}</span>
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-white/55">Based on: —</p>
                    )}
                  </div>

                  {sentiment === "consensus" ? (
                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${sentimentPillClasses(
                        consensusSent
                      )}`}
                    >
                      {fmtSentiment(consensusSent)}
                    </span>
                  ) : null}
                </div>

                {confPct !== null ? (
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Confidence</span>
                      <span className="text-xs font-semibold text-white/80 tabular-nums">{confPct}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                      <div className="h-2 rounded-full" style={fillStyle} />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-5 text-xs text-white/50">
          This tool is on rating v1. Re-enrich to upgrade to v2 subscores.
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Tabs({ categorySlug }: { categorySlug: string }) {
  const tabs = [
    { href: "#overview", label: "Overview" },
    { href: "#consensus", label: "Consensus" },
    { href: "#pricing", label: "Pricing" },
    { href: "#features", label: "Features" },
    { href: "#integrations", label: "Integrations" },
    { href: "#alternatives", label: "Alternatives" },
    { href: `/tools/category/${categorySlug}`, label: "Category" },
  ];
  return (
    <nav className="sticky top-0 z-10 -mx-6 mb-8 border-b border-white/10 bg-(--bg)/80 px-6 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <a
            key={t.href}
            href={t.href}
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:border-white/20 hover:text-white"
          >
            {t.label}
          </a>
        ))}
      </div>
    </nav>
  );
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : "";
  if (!slug) return {};

  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: { primaryCategory: true },
  });
  if (!tool) return {};

  const title = `${tool.name} — pricing, features, and alternatives`;
  const description =
    tool.shortDescription ||
    tool.tagline ||
    `Compare ${tool.name} pricing, features, integrations, and alternatives.`;

  const indexable = isIndexWorthy({
    shortDescription: tool.shortDescription,
    bestFor: tool.bestFor ?? [],
    targetAudience: tool.targetAudience ?? [],
    keyFeatures: tool.keyFeatures ?? [],
  });

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    robots: indexable ? undefined : { index: false, follow: true },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : "";
  if (!slug) notFound();

  const result = await getAlternatives(slug);
  if (!result) notFound();

  const { tool, alternatives } = result;
  if (tool.status !== "ACTIVE") notFound();

  const internal = await getToolInternalLinks(slug);

  const ratingRow = await prisma.tool.findUnique({
    where: { id: tool.id },
    select: {
      findalyScore: true,
      findalyScoreMeta: true,
      toolSources: { select: { type: true, url: true } },
    },
  });

  const findalyScore = ratingRow?.findalyScore ?? null;
  const findalyMeta = safeJsonObject(ratingRow?.findalyScoreMeta);

  const externalConsensus = parseExternalConsensus(findalyMeta["externalConsensus"]);
  const consensusTopics = (externalConsensus?.topics ?? [])
    .slice()
    .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))
    .slice(0, 5);

  const categoryName = tool.primaryCategory?.name ?? "Tools";
  const categorySlug = tool.primaryCategory?.slug ?? slugifyCategory(categoryName);
  const categoryHref = `/tools/category/${categorySlug}`;

  const domain = getDomain(tool.websiteUrl);

  const priceFromCents = fmtPriceFromCents(tool.startingPriceCents);
  const structuredPrice =
    priceFromCents && tool.startingPricePeriod ? `$${priceFromCents}${periodLabel(tool.startingPricePeriod)}` : null;

  const indexable = isIndexWorthy(tool);

  const topAudiences = uniqueTop(tool.targetAudience ?? [], 6);
  const bestForBullets = uniqueTop(tool.bestFor ?? [], 6);
  const notForBullets = uniqueTop(tool.notFor ?? [], 6);
  const pros = uniqueTop(tool.pros ?? [], 6);
  const cons = uniqueTop(tool.cons ?? [], 6);

  const topFeatures = uniqueTop(tool.keyFeatures ?? [], 10);
  const allIntegrations = uniqueTop(tool.integrations ?? [], 60);
  const topIntegrations = allIntegrations.slice(0, 10);
  const remainingIntegrations = allIntegrations.slice(10);

  const compareTargets = alternatives.slice(0, 3);

  const flagsObj = safeJsonObject(tool.featureFlags);
  const allFeatureItems = extractFeatureItems(flagsObj);
  const featureGroups = buildFeatureGroups(allFeatureItems);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description:
      tool.shortDescription || tool.tagline || `Compare ${tool.name} pricing, features, integrations, and alternatives.`,
    url: tool.websiteUrl ?? undefined,
    applicationCategory: categoryName,
    offers: tool.pricingModel
      ? {
          "@type": "Offer",
          price: priceFromCents ? Number(priceFromCents) : undefined,
          priceCurrency: "USD",
        }
      : undefined,
  };

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Tabs categorySlug={categorySlug} />

      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/60">
          <Link href="/tools" className="hover:text-white">
            Tools
          </Link>
          <span className="text-white/30">/</span>
          <Link href={categoryHref} className="hover:text-white">
            {categoryName}
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-white/80">{tool.name}</span>

          {!indexable ? (
            <span className="ml-2 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] text-amber-200">
              <Info size={14} />
              Limited data (noindex)
            </span>
          ) : null}
        </div>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            {/* HERO */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start gap-4">
                <ToolLogo name={tool.name} logoUrl={tool.logoUrl} websiteUrl={tool.websiteUrl} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h1 className="text-4xl font-semibold tracking-tight">{tool.name}</h1>
                      <p className="mt-2 max-w-2xl text-base text-white/70">
                        {tool.shortDescription ||
                          tool.tagline ||
                          `Compare ${tool.name} pricing, features, integrations, and alternatives.`}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/60">
                        <span className="inline-flex items-center gap-2">
                          <Layers size={16} />
                          <Link href={categoryHref} className="text-white/80 hover:text-white">
                            {categoryName}
                          </Link>
                        </span>
                        {domain ? (
                          <span className="inline-flex items-center gap-2">
                            <ExternalLink size={16} />
                            {domain}
                          </span>
                        ) : null}
                        {tool.lastVerifiedAt ? (
                          <span className="inline-flex items-center gap-2">
                            <Info size={16} />
                            Verified {new Date(tool.lastVerifiedAt).toLocaleDateString()}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      {tool.websiteUrl ? (
                        <a
                          href={tool.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
                        >
                          Visit website <ArrowUpRight size={16} />
                        </a>
                      ) : null}

                      {compareTargets.length ? (
                        <div className="flex flex-wrap gap-2">
                          {compareTargets.map((t) => (
                            <Link
                              key={t.id}
                              href={`/compare/${tool.slug}-vs-${t.slug}`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:border-white/20 hover:text-white"
                            >
                              Compare <span className="text-white/60">vs</span> {t.name}{" "}
                              <ArrowUpRight size={16} className="opacity-70" />
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* At a glance */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Pricing</p>
                      <p className="mt-2 text-sm text-white/85">
                        {String(tool.pricingModel)}
                        {structuredPrice || tool.startingPrice ? (
                          <span className="text-white/60"> • {structuredPrice ?? tool.startingPrice}</span>
                        ) : null}
                      </p>
                      {tool.pricingUrl ? (
                        <a
                          href={tool.pricingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
                        >
                          View pricing <ArrowUpRight size={16} />
                        </a>
                      ) : null}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Trial & free</p>
                      <p className="mt-2 text-sm text-white/85">
                        {tool.hasFreeTrial === true
                          ? tool.trialDays
                            ? `Free trial (${tool.trialDays} days)`
                            : "Free trial"
                          : tool.hasFreeTrial === false
                          ? "No free trial"
                          : "—"}
                      </p>
                      <p className="mt-1 text-sm text-white/70">
                        {tool.hasFreePlan === true
                          ? "Free plan available"
                          : tool.hasFreePlan === false
                          ? "No free plan"
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Integrations</p>
                      <p className="mt-2 text-sm text-white/85">{allIntegrations.length ? `${allIntegrations.length}+` : "—"}</p>
                      <a
                        href="#integrations"
                        className="mt-2 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
                      >
                        See list <ArrowUpRight size={16} />
                      </a>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Best for</p>
                      <p className="mt-2 text-sm text-white/85">{topAudiences.slice(0, 2).join(", ") || "—"}</p>
                      <a
                        href="#overview"
                        className="mt-2 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
                      >
                        Decision guide <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ✅ CONSENSUS (your existing improved section) */}
            <section id="consensus" className="mt-10 scroll-mt-24">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight">What people online are saying</h2>
                {externalConsensus?.generatedAt ? (
                  <p className="text-sm text-white/60">
                    Updated {new Date(externalConsensus.generatedAt).toLocaleDateString()}
                  </p>
                ) : null}
              </div>

              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                {consensusTopics.length ? (
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                    <div className="grid gap-4">
                      {consensusTopics.map((t) => (
                        <div
                          key={t.topic}
                          className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                                {fmtTopicLabel(t.topic)}
                              </p>

                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${sentimentPillClasses(
                                    t.sentiment
                                  )}`}
                                >
                                  {fmtSentiment(t.sentiment)}
                                </span>
                                <span className="text-sm text-white/70">
                                  {t.sources.length} platform{t.sources.length === 1 ? "" : "s"}
                                </span>
                                <span className="text-white/30">•</span>
                                <span className="text-sm text-white/70 tabular-nums">N={t.n}</span>
                              </div>

                              {t.sources.length ? (
                                <p className="mt-3 text-xs text-white/55">
                                  Based on:{" "}
                                  <span className="text-white/70">{t.sources.map(humanizeSourceName).join(", ")}</span>
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <ConfidenceBar value={t.confidence} sentiment={t.sentiment} />
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Summary</p>
                      <p className="mt-3 text-sm leading-relaxed text-white/70">
                        We aggregate recurring themes from third-party review platforms and communities. Each theme shows
                        the overall sentiment and a confidence percentage based on how consistently it appears across sources.
                      </p>

                      {consensusTopics[0] ? (
                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                            Strongest theme right now
                          </p>
                          <p className="mt-2 text-sm text-white/80">
                            <span className="font-semibold text-white">{fmtTopicLabel(consensusTopics[0].topic)}</span>{" "}
                            is{" "}
                            <span className="font-semibold text-white">
                              {fmtSentiment(consensusTopics[0].sentiment).toLowerCase()}
                            </span>{" "}
                            across{" "}
                            <span className="font-semibold text-white tabular-nums">
                              {consensusTopics[0].sources.length}
                            </span>{" "}
                            platforms.
                          </p>
                          <ConfidenceBar
                            value={consensusTopics[0].confidence}
                            sentiment={consensusTopics[0].sentiment}
                            compact
                          />
                        </div>
                      ) : null}

                      <p className="mt-5 text-xs text-white/50">
                        Notes: this section summarizes recurring themes from third-party sources. It’s not a quote and may not reflect every user’s experience.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-white/70">
                    We haven’t aggregated third-party sentiment for {tool.name} yet.
                  </p>
                )}
              </div>
            </section>

            {/* OVERVIEW */}
            <section id="overview" className="mt-10 scroll-mt-24">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
              </div>

              <div className="mt-4 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6">
                  {tool.longDescription ? (
                    <div className="space-y-4 text-sm leading-relaxed text-white/80">
                      <p className="whitespace-pre-line">{tool.longDescription}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-white/70">
                      We’re still building a full breakdown for {tool.name}. Below is a structured decision guide,
                      pricing summary, feature coverage, and alternatives.
                    </p>
                  )}

                  {topFeatures.length ? (
                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Key highlights</p>
                      <ul className="mt-3 grid gap-2 text-sm text-white/85 sm:grid-cols-2">
                        {topFeatures.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="mt-0.5 opacity-70" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Decision guide</p>

                  <div className="mt-4 space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-white/90">Choose {tool.name} if…</p>
                      {bestForBullets.length ? (
                        <ul className="mt-2 space-y-2 text-sm text-white/80">
                          {bestForBullets.map((x) => (
                            <li key={x} className="flex items-start gap-2">
                              <CheckCircle2 size={16} className="mt-0.5 opacity-70" />
                              <span>{x}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-white/65">We’re enriching “best for” signals.</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white/90">Avoid if…</p>
                      {notForBullets.length ? (
                        <ul className="mt-2 space-y-2 text-sm text-white/80">
                          {notForBullets.map((x) => (
                            <li key={x} className="flex items-start gap-2">
                              <XCircle size={16} className="mt-0.5 opacity-70" />
                              <span>{x}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-white/65">We’re enriching “avoid if” signals.</p>
                      )}
                    </div>

                    {pros.length || cons.length ? (
                      <div className="grid gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white/90">Pros</p>
                          {pros.length ? (
                            <ul className="mt-2 space-y-2 text-sm text-white/80">
                              {pros.map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                  <CheckCircle2 size={16} className="mt-0.5 opacity-70" />
                                  <span>{x}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-sm text-white/65">—</p>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white/90">Cons</p>
                          {cons.length ? (
                            <ul className="mt-2 space-y-2 text-sm text-white/80">
                              {cons.map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                  <XCircle size={16} className="mt-0.5 opacity-70" />
                                  <span>{x}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-sm text-white/65">—</p>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            {/* (rest of your page unchanged) */}
            {/* PRICING */}
            <section id="pricing" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight">Pricing</h2>

              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Model</p>
                    <p className="mt-2 text-sm text-white/85">{String(tool.pricingModel)}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Starting price</p>
                    <p className="mt-2 text-sm text-white/85">{structuredPrice ?? tool.startingPrice ?? "—"}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Free plan</p>
                    <p className="mt-2 text-sm text-white/85">
                      {tool.hasFreePlan === true ? "Yes" : tool.hasFreePlan === false ? "No" : "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Free trial</p>
                    <p className="mt-2 text-sm text-white/85">
                      {tool.hasFreeTrial === true
                        ? tool.trialDays
                          ? `${tool.trialDays} days`
                          : "Yes"
                        : tool.hasFreeTrial === false
                        ? "No"
                        : "—"}
                    </p>
                  </div>
                </div>

                {tool.pricingNotes || tool.pricingUrl ? (
                  <div className="mt-5 border-t border-white/10 pt-5 text-sm text-white/75">
                    {tool.pricingNotes ? <p className="whitespace-pre-line">{tool.pricingNotes}</p> : null}
                    {tool.pricingUrl ? (
                      <a
                        href={tool.pricingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-white/85 hover:text-white"
                      >
                        View official pricing <ArrowUpRight size={16} />
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="mt-10 scroll-mt-24">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
                <p className="text-sm text-white/60">
                  Based on known feature signals{tool.dataConfidence ? ` (${tool.dataConfidence})` : ""}.
                </p>
              </div>

              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                {featureGroups.length ? (
                  <div className="space-y-6">
                    {featureGroups.map((g) => (
                      <div key={g.name}>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">{g.name}</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {g.items.map((it) => (
                            <div
                              key={it.key}
                              className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                            >
                              <div className="min-w-0">
                                <p className="text-sm text-white/85">{it.label}</p>
                              </div>
                              <div className="shrink-0">
                                <CheckCircle2 size={18} className="opacity-75" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {allFeatureItems.length > 24 ? (
                      <details className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <summary className="cursor-pointer text-sm text-white/85 hover:text-white">
                          Show all feature signals ({allFeatureItems.length})
                        </summary>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {allFeatureItems.map((it) => (
                            <div
                              key={it.key}
                              className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                            >
                              <p className="text-sm text-white/80">{it.label}</p>
                              <CheckCircle2 size={18} className="opacity-70" />
                            </div>
                          ))}
                        </div>
                      </details>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-white/70">
                    We don’t have structured feature coverage for {tool.name} yet. Check key highlights above and compare alternatives below.
                  </p>
                )}
              </div>
            </section>

            {/* INTEGRATIONS */}
            <section id="integrations" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight">Integrations</h2>

              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                {allIntegrations.length ? (
                  <>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {topIntegrations.map((i) => (
                        <div key={i} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                          <Plug size={16} className="opacity-70" />
                          <span className="text-sm text-white/85">{i}</span>
                        </div>
                      ))}
                    </div>

                    {remainingIntegrations.length ? (
                      <details className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <summary className="cursor-pointer text-sm text-white/85 hover:text-white">
                          Show all integrations ({allIntegrations.length})
                        </summary>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {remainingIntegrations.map((i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4"
                            >
                              <Plug size={16} className="opacity-70" />
                              <span className="text-sm text-white/85">{i}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    ) : null}
                  </>
                ) : (
                  <p className="text-sm text-white/70">No integrations listed yet.</p>
                )}
              </div>
            </section>

            {/* ALTERNATIVES */}
            {alternatives.length ? (
              <section id="alternatives" className="mt-10 scroll-mt-24">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <h2 className="text-2xl font-semibold tracking-tight">Alternatives</h2>
                  <Link href={`/alternatives/${tool.slug}`} className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
                    See all alternatives <ArrowUpRight size={16} />
                  </Link>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {alternatives.slice(0, 6).map((t) => (
                    <Link
                      key={t.id}
                      href={`/tools/${t.slug}`}
                      className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-base font-semibold text-white/90">{t.name}</p>
                          <p className="mt-2 text-sm text-white/65">{t.shortDescription}</p>
                        </div>
                        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
                          {String(t.pricingModel)}
                        </span>
                      </div>

                      <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/80">
                        View profile <ArrowUpRight size={16} className="opacity-70" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {/* RELATED / INTERNAL */}
            <section className="mt-10">
              <h2 className="text-2xl font-semibold tracking-tight">Related</h2>
              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Category</p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {internal.category.slice(0, 8).map((x: LinkItem) => (
                        <li key={x.href}>
                          <Link href={x.href} className="text-white/80 hover:text-white">
                            {x.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                      Alternatives & comparisons
                    </p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {internal.alternatives.slice(0, 6).map((x: LinkItem) => (
                        <li key={x.href}>
                          <Link href={x.href} className="text-white/80 hover:text-white">
                            {x.label}
                          </Link>
                        </li>
                      ))}
                      {internal.comparisons.slice(0, 6).map((x: LinkItem) => (
                        <li key={x.href}>
                          <Link href={x.href} className="text-white/80 hover:text-white">
                            {x.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Best-for pages</p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {internal.best.slice(0, 8).map((x: LinkItem) => (
                        <li key={x.href}>
                          <Link href={x.href} className="text-white/80 hover:text-white">
                            {x.label}
                          </Link>
                        </li>
                      ))}
                      <li className="pt-2">
                        <Link href={categoryHref} className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                          Explore {categoryName} <ArrowUpRight size={16} />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT RAIL */}
          <aside className="lg:sticky lg:top-24">
            <div className="grid gap-6">
              {/* ✅ NEW: Findaly rating breakdown (v2) */}
              <FindalyRatingPanel
                toolName={tool.name}
                findalyScore={findalyScore}
                findalyMeta={findalyMeta}
                externalConsensus={externalConsensus}
              />

              {/* Existing: At a glance */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">At a glance</p>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/65">Category</span>
                    <Link href={categoryHref} className="text-white/85 hover:text-white">
                      {categoryName}
                    </Link>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/65">Pricing model</span>
                    <span className="text-white/85">{String(tool.pricingModel)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/65">Starting</span>
                    <span className="text-white/85">{structuredPrice ?? tool.startingPrice ?? "—"}</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/65">Free plan</span>
                    <span className="text-white/85">{tool.hasFreePlan === true ? "Yes" : tool.hasFreePlan === false ? "No" : "—"}</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/65">Free trial</span>
                    <span className="text-white/85">
                      {tool.hasFreeTrial === true
                        ? tool.trialDays
                          ? `${tool.trialDays} days`
                          : "Yes"
                        : tool.hasFreeTrial === false
                        ? "No"
                        : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/65">Integrations</span>
                    <span className="text-white/85">{allIntegrations.length ? `${allIntegrations.length}+` : "—"}</span>
                  </div>
                </div>

                <div className="mt-6 grid gap-2">
                  {tool.websiteUrl ? (
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
                    >
                      Visit website <ArrowUpRight size={16} />
                    </a>
                  ) : null}

                  {tool.pricingUrl ? (
                    <a
                      href={tool.pricingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:border-white/20 hover:text-white"
                    >
                      Pricing <DollarSign size={16} />
                    </a>
                  ) : null}

                  <Link
                    href={`/alternatives/${tool.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:border-white/20 hover:text-white"
                  >
                    See alternatives <Boxes size={16} />
                  </Link>
                </div>

                {tool.dataConfidence ? (
                  <p className="mt-4 text-xs text-white/50">
                    Data confidence: <span className="text-white/70">{tool.dataConfidence}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
