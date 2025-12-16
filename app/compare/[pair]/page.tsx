import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ToolLogo from "@/components/ToolLogo";
import { getCompareInternalLinks } from "@/lib/internalLinking/engine";
import { ArrowUpRight, Sparkles, Boxes } from "lucide-react";

type Props = {
  params: Promise<{ pair: string }>;
};

function decode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function parsePair(pair: string) {
  const decoded = decode(pair || "").trim();
  const parts = decoded.split("-vs-").filter(Boolean);
  if (parts.length !== 2) return null;

  const left = parts[0]?.trim();
  const right = parts[1]?.trim();
  if (!left || !right) return null;

  return { left, right };
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}

function slugifyCategory(category: string) {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

function prettyPricing(p: unknown) {
  const s = String(p ?? "").toUpperCase();
  if (s === "FREE") return "Free";
  if (s === "FREEMIUM") return "Freemium";
  if (s === "PAID") return "Paid";
  if (s === "ENTERPRISE") return "Enterprise";
  return s || "—";
}

function scorePricing(p: unknown) {
  const s = String(p ?? "").toUpperCase();
  if (s === "FREE") return 1;
  if (s === "FREEMIUM") return 2;
  if (s === "PAID") return 3;
  if (s === "ENTERPRISE") return 4;
  return 999;
}

function uniqueTop(arr: (string | null | undefined)[], n: number) {
  return Array.from(new Set(arr.map((x) => (x ?? "").trim()).filter(Boolean))).slice(0, n);
}

function setIntersection(a: string[], b: string[]) {
  const A = new Set(a.map((x) => x.toLowerCase().trim()).filter(Boolean));
  const B = new Set(b.map((x) => x.toLowerCase().trim()).filter(Boolean));
  const out: string[] = [];
  for (const x of A) if (B.has(x)) out.push(x);
  return out;
}

type JsonRecord = Record<string, unknown>;

function isRecord(v: unknown): v is JsonRecord {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function recordOrEmpty(v: unknown): JsonRecord {
  return isRecord(v) ? v : {};
}

type ScoreConfidence = "SEEDED" | "ENRICHED" | "VERIFIED";

function isScoreConfidence(v: unknown): v is ScoreConfidence {
  return v === "SEEDED" || v === "ENRICHED" || v === "VERIFIED";
}

type Subscore = {
  score?: number;
  confidence?: number;
  evidence?: Record<string, string[]>;
};

type ScoreMetaV2 = {
  version?: string;
  confidence?: ScoreConfidence;
  subscores?: Record<string, Subscore>;
};

function asEvidence(v: unknown): Record<string, string[]> | undefined {
  if (!isRecord(v)) return undefined;
  const out: Record<string, string[]> = {};
  for (const [k, val] of Object.entries(v)) {
    if (Array.isArray(val) && val.every((x) => typeof x === "string")) out[k] = val;
  }
  return Object.keys(out).length ? out : undefined;
}

function asSubscore(v: unknown): Subscore | undefined {
  if (!isRecord(v)) return undefined;

  const score = typeof v.score === "number" && Number.isFinite(v.score) ? v.score : undefined;
  const confidence =
    typeof v.confidence === "number" && Number.isFinite(v.confidence) ? v.confidence : undefined;
  const evidence = asEvidence(v.evidence);

  if (score === undefined && confidence === undefined && evidence === undefined) return undefined;
  return { score, confidence, evidence };
}

function asSubscoreMap(v: unknown): Record<string, Subscore> | undefined {
  if (!isRecord(v)) return undefined;

  const out: Record<string, Subscore> = {};
  for (const [k, val] of Object.entries(v)) {
    const sub = asSubscore(val);
    if (sub) out[k] = sub;
  }
  return Object.keys(out).length ? out : undefined;
}

function parseScoreMeta(v: unknown): ScoreMetaV2 | null {
  const o = recordOrEmpty(v);
  const subs = asSubscoreMap(o.subscores);
  if (!subs) return null;

  return {
    version: typeof o.version === "string" ? o.version : undefined,
    confidence: isScoreConfidence(o.confidence) ? o.confidence : undefined,
    subscores: subs,
  };
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function as05From10(x: unknown) {
  const n = typeof x === "number" && Number.isFinite(x) ? x : 0;
  return clamp(n / 2, 0, 5);
}

function fmtPriceCents(cents?: number | null) {
  if (typeof cents !== "number" || !Number.isFinite(cents) || cents <= 0) return null;
  const dollars = cents / 100;
  return dollars >= 10 ? `$${Math.round(dollars)}` : `$${dollars.toFixed(2)}`;
}

function pickConfidence(meta: ScoreMetaV2 | null | undefined, toolConf: unknown): ScoreConfidence | null {
  if (meta?.confidence) return meta.confidence;
  if (isScoreConfidence(toolConf)) return toolConf;
  return null;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70">
      {children}
    </span>
  );
}

function ChipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 transition hover:border-white/20 hover:bg-white/7 hover:text-white no-underline"
    >
      {children}
    </Link>
  );
}

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-7">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{label}</p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-white md:text-xl">
              {title}
            </h2>
          </div>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

function BarRow({
  label,
  left,
  right,
  leftStrong,
  rightStrong,
}: {
  label: string;
  left: number; // 0–5
  right: number; // 0–5
  leftStrong?: boolean;
  rightStrong?: boolean;
}) {
  const max = 5;
  const lp = Math.max(0, Math.min(100, (left / max) * 100));
  const rp = Math.max(0, Math.min(100, (right / max) * 100));

  return (
    <div className="py-3">
      <div className="grid grid-cols-[70px_1fr_70px] items-center gap-4">
        <div
          className={[
            "text-sm font-semibold tabular-nums",
            leftStrong ? "text-white" : "text-white/80",
          ].join(" ")}
        >
          {left.toFixed(1)}
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-medium text-white/50">{label}</div>
            <div className="text-[11px] text-white/40">0–5</div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-3">
            <div className="h-2 w-full rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-white/70" style={{ width: `${lp}%` }} />
            </div>
            <div className="h-2 w-full rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-white/70" style={{ width: `${rp}%` }} />
            </div>
          </div>
        </div>

        <div
          className={[
            "text-sm font-semibold tabular-nums text-right",
            rightStrong ? "text-white" : "text-white/80",
          ].join(" ")}
        >
          {right.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

function CompareTopCard({
  name,
  slug,
  logoUrl,
  websiteUrl,
  findalyScore,
  scoreConfidence,
  pricingLabel,
  startingPrice,
  highlight,
}: {
  name: string;
  slug: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  findalyScore: number | null;
  scoreConfidence: ScoreConfidence | null;
  pricingLabel: string;
  startingPrice: string | null;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border bg-white/5 p-5 md:p-6",
        highlight ? "border-white/25" : "border-white/10",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <ToolLogo name={name} logoUrl={logoUrl} websiteUrl={websiteUrl} className="h-12 w-12" />
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-white">{name}</div>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              {typeof findalyScore === "number" ? (
                <Pill>
                  <span className="font-semibold text-white/85">{findalyScore.toFixed(1)}</span>
                  <span className="ml-1 text-white/45">Findaly score</span>
                </Pill>
              ) : (
                <Pill>Findaly score —</Pill>
              )}

              {scoreConfidence ? <Pill>{scoreConfidence}</Pill> : null}
              <Pill>{pricingLabel}</Pill>
              {startingPrice ? <Pill>{startingPrice}</Pill> : null}
            </div>
          </div>
        </div>

        <Link
          href={`/tools/${slug}`}
          className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/7 hover:text-white no-underline"
        >
          View profile →
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          href={`/alternatives/${slug}`}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/7 hover:text-white no-underline"
        >
          Alternatives
        </Link>
        <a
          href={websiteUrl || "#"}
          target={websiteUrl ? "_blank" : undefined}
          rel="noreferrer"
          className={[
            "rounded-xl border px-4 py-2 text-center text-sm font-medium transition no-underline",
            websiteUrl
              ? "border-white/10 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/7 hover:text-white"
              : "pointer-events-none border-white/5 bg-white/3 text-white/35",
          ].join(" ")}
        >
          Visit website
        </a>
      </div>
    </div>
  );
}

async function getToolsBySlugs(slugA: string, slugB: string) {
  const [a, b] = await Promise.all([
    prisma.tool.findUnique({
      where: { slug: slugA },
      include: { primaryCategory: true, useCases: true },
    }),
    prisma.tool.findUnique({
      where: { slug: slugB },
      include: { primaryCategory: true, useCases: true },
    }),
  ]);
  return { a, b };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return { title: "Compare tools" };

  const { a, b } = await getToolsBySlugs(parsed.left, parsed.right);
  if (!a || !b) return { title: "Compare tools" };

  const title = `${a.name} vs ${b.name} — features, pricing & best for`;
  const description = `Compare ${a.name} vs ${b.name}: pricing, features, integrations, and which teams each tool fits best.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function ComparePage({ params }: Props) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();

  const { a: toolA, b: toolB } = await getToolsBySlugs(parsed.left, parsed.right);
  if (!toolA || !toolB) notFound();
  if (toolA.status !== "ACTIVE" || toolB.status !== "ACTIVE") notFound();

  const internal = await getCompareInternalLinks(pair);

  const categoryNameA = toolA.primaryCategory?.name ?? "Tools";
  const categorySlugA =
    toolA.primaryCategory?.slug ?? slugifyCategory(toolA.primaryCategory?.name ?? "Tools");
  const categoryHrefA = `/tools/category/${categorySlugA}`;

  const categoryNameB = toolB.primaryCategory?.name ?? "Tools";
  const categorySlugB =
    toolB.primaryCategory?.slug ?? slugifyCategory(toolB.primaryCategory?.name ?? "Tools");
  const categoryHrefB = `/tools/category/${categorySlugB}`;

  const sameCategory = toolA.primaryCategoryId === toolB.primaryCategoryId;

  const pricingWinner =
    scorePricing(toolA.pricingModel) < scorePricing(toolB.pricingModel)
      ? "A"
      : scorePricing(toolB.pricingModel) < scorePricing(toolA.pricingModel)
        ? "B"
        : null;

  const aBestFor = uniqueTop(toolA.targetAudience ?? [], 2).join(" & ") || "teams";
  const bBestFor = uniqueTop(toolB.targetAudience ?? [], 2).join(" & ") || "teams";

  const aTopFeature = uniqueTop(toolA.keyFeatures ?? [], 1)[0] || "core workflows";
  const bTopFeature = uniqueTop(toolB.keyFeatures ?? [], 1)[0] || "core workflows";

  const commonIntegrations = setIntersection(toolA.integrations ?? [], toolB.integrations ?? []);
  const commonUseCases = setIntersection(
    (toolA.useCases ?? []).map((u) => u.name),
    (toolB.useCases ?? []).map((u) => u.name),
  );

  const aMeta = parseScoreMeta(toolA.findalyScoreMeta);
  const bMeta = parseScoreMeta(toolB.findalyScoreMeta);

  const aFindaly = typeof toolA.findalyScore === "number" ? toolA.findalyScore : null;
  const bFindaly = typeof toolB.findalyScore === "number" ? toolB.findalyScore : null;

  const aConfidence = pickConfidence(aMeta, toolA.dataConfidence);
  const bConfidence = pickConfidence(bMeta, toolB.dataConfidence);

  const aSub = aMeta?.subscores ?? {};
  const bSub = bMeta?.subscores ?? {};

  const aScores = {
    features: as05From10(aSub.featureCoverage?.score),
    value: as05From10(aSub.pricingValue?.score),
    integrations: as05From10(aSub.integrations?.score),
    security: as05From10(aSub.security?.score),
    reliability: as05From10(aSub.reliability?.score),
    apiDev: as05From10(aSub.apiDev?.score),
    consensus: as05From10(aSub.consensus?.score),
  };

  const bScores = {
    features: as05From10(bSub.featureCoverage?.score),
    value: as05From10(bSub.pricingValue?.score),
    integrations: as05From10(bSub.integrations?.score),
    security: as05From10(bSub.security?.score),
    reliability: as05From10(bSub.reliability?.score),
    apiDev: as05From10(bSub.apiDev?.score),
    consensus: as05From10(bSub.consensus?.score),
  };

  const aKeyFeatures = uniqueTop(toolA.keyFeatures ?? [], 8);
  const bKeyFeatures = uniqueTop(toolB.keyFeatures ?? [], 8);
  const aIntegrations = uniqueTop(toolA.integrations ?? [], 10);
  const bIntegrations = uniqueTop(toolB.integrations ?? [], 10);
  const aAudience = uniqueTop(toolA.targetAudience ?? [], 8);
  const bAudience = uniqueTop(toolB.targetAudience ?? [], 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${toolA.name} vs ${toolB.name}`,
    mainEntityOfPage: `${siteUrl()}/compare/${toolA.slug}-vs-${toolB.slug}`,
    about: [
      { "@type": "SoftwareApplication", name: toolA.name, url: `${siteUrl()}/tools/${toolA.slug}` },
      { "@type": "SoftwareApplication", name: toolB.name, url: `${siteUrl()}/tools/${toolB.slug}` },
    ],
  };

  const jump = [
    { href: "#summary", label: "Summary" },
    { href: "#pricing", label: "Pricing" },
    { href: "#scores", label: "Scores" },
    { href: "#features", label: "Features" },
    { href: "#integrations", label: "Integrations" },
    { href: "#bestfor", label: "Best for" },
    { href: "#paths", label: "More paths" },
  ];

  const aStart = toolA.startingPrice ?? fmtPriceCents(toolA.startingPriceCents) ?? null;
  const bStart = toolB.startingPrice ?? fmtPriceCents(toolB.startingPriceCents) ?? null;

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[520px] bg-[radial-gradient(900px_320px_at_50%_0%,rgba(255,255,255,0.10),rgba(0,0,0,0))]" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-12 md:pt-16">
        <div className="text-xs text-white/55">
          <Link href="/tools" className="hover:text-white/80 no-underline">
            Tools
          </Link>
          <span className="mx-1 text-white/35">/</span>
          {sameCategory ? (
            <>
              <Link href={categoryHrefA} className="hover:text-white/80 no-underline">
                {categoryNameA}
              </Link>
              <span className="mx-1 text-white/35">/</span>
            </>
          ) : null}
          <span className="text-white/55">Compare</span>
        </div>

        <div className="mt-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <Sparkles size={14} className="opacity-80" />
            Comparison
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {toolA.name} vs {toolB.name}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60">
            A clean, modern, decision-first comparison. Scores are derived from your Findaly data (not reviews).
          </p>

          {commonUseCases.length || commonIntegrations.length ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {commonUseCases.slice(0, 4).map((x) => (
                <span
                  key={x}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/65"
                >
                  Use case: <span className="text-white/85">{x}</span>
                </span>
              ))}
              {commonIntegrations.slice(0, 4).map((x) => (
                <span
                  key={x}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/65"
                >
                  Integration: <span className="text-white/85">{x}</span>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="sticky top-0 z-20 -mx-6 mt-8 border-b border-white/10 bg-(--bg)/90 px-6 py-4 backdrop-blur">
          <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
            <CompareTopCard
              name={toolA.name}
              slug={toolA.slug}
              logoUrl={toolA.logoUrl}
              websiteUrl={toolA.websiteUrl}
              findalyScore={aFindaly}
              scoreConfidence={aConfidence}
              pricingLabel={prettyPricing(toolA.pricingModel)}
              startingPrice={aStart}
              highlight={pricingWinner === "A"}
            />

            <div className="hidden md:flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-white/70">
                VS
              </div>
            </div>

            <CompareTopCard
              name={toolB.name}
              slug={toolB.slug}
              logoUrl={toolB.logoUrl}
              websiteUrl={toolB.websiteUrl}
              findalyScore={bFindaly}
              scoreConfidence={bConfidence}
              pricingLabel={prettyPricing(toolB.pricingModel)}
              startingPrice={bStart}
              highlight={pricingWinner === "B"}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {jump.map((j) => (
              <a
                key={j.href}
                href={j.href}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 transition hover:border-white/20 hover:bg-white/7 hover:text-white no-underline"
              >
                {j.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6">
          <Section id="summary" label="Summary" title="At-a-glance">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Best for</p>
                <p className="mt-3 text-sm text-white/70">
                  <span className="font-semibold text-white">{toolA.name}</span>: {aBestFor} who want{" "}
                  <span className="font-semibold text-white">{aTopFeature}</span>.
                </p>
                <p className="mt-3 text-sm text-white/70">
                  <span className="font-semibold text-white">{toolB.name}</span>: {bBestFor} who want{" "}
                  <span className="font-semibold text-white">{bTopFeature}</span>.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Pricing</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">{toolA.name}</span>
                    <span className="font-semibold text-white">{prettyPricing(toolA.pricingModel)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">{toolB.name}</span>
                    <span className="font-semibold text-white">{prettyPricing(toolB.pricingModel)}</span>
                  </div>
                  <div className="mt-3 border-t border-white/10 pt-3 text-xs text-white/55">
                    “Cheaper by model”:{" "}
                    <span className="font-semibold text-white">
                      {pricingWinner === "A" ? toolA.name : pricingWinner === "B" ? toolB.name : "Tie"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Next steps</p>
                <div className="mt-3 grid gap-2 text-sm">
                  <Link
                    href={`/tools/${toolA.slug}`}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center font-medium text-white/80 transition hover:border-white/20 hover:bg-white/7 hover:text-white no-underline"
                  >
                    {toolA.name} profile
                  </Link>
                  <Link
                    href={`/tools/${toolB.slug}`}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center font-medium text-white/80 transition hover:border-white/20 hover:bg-white/7 hover:text-white no-underline"
                  >
                    {toolB.name} profile
                  </Link>
                  <Link
                    href={`/alternatives/${toolA.slug}`}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center font-medium text-white/80 transition hover:border-white/20 hover:bg-white/7 hover:text-white no-underline"
                  >
                    {toolA.name} alternatives
                  </Link>
                </div>
              </div>
            </div>
          </Section>

          <Section id="pricing" label="Pricing" title="Pricing model & starting price">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">{toolA.name}</div>
                    <div className="mt-1 text-xs text-white/50">Pricing model</div>
                  </div>
                  <Pill>{prettyPricing(toolA.pricingModel)}</Pill>
                </div>

                <div className="mt-4 text-sm text-white/70">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/55">Starting price</span>
                    <span className="font-semibold text-white">{aStart ?? "—"}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {toolA.hasFreePlan ? <Pill>Free plan</Pill> : <Pill>No free plan</Pill>}
                    {toolA.hasFreeTrial ? (
                      <Pill>{toolA.trialDays ? `${toolA.trialDays} day trial` : "Free trial"}</Pill>
                    ) : (
                      <Pill>No free trial</Pill>
                    )}
                    {toolA.pricingUrl ? (
                      <a
                        href={toolA.pricingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 transition hover:border-white/20 hover:bg-white/7 hover:text-white no-underline"
                      >
                        Pricing page <ArrowUpRight size={14} className="opacity-70" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">{toolB.name}</div>
                    <div className="mt-1 text-xs text-white/50">Pricing model</div>
                  </div>
                  <Pill>{prettyPricing(toolB.pricingModel)}</Pill>
                </div>

                <div className="mt-4 text-sm text-white/70">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/55">Starting price</span>
                    <span className="font-semibold text-white">{bStart ?? "—"}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {toolB.hasFreePlan ? <Pill>Free plan</Pill> : <Pill>No free plan</Pill>}
                    {toolB.hasFreeTrial ? (
                      <Pill>{toolB.trialDays ? `${toolB.trialDays} day trial` : "Free trial"}</Pill>
                    ) : (
                      <Pill>No free trial</Pill>
                    )}
                    {toolB.pricingUrl ? (
                      <a
                        href={toolB.pricingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 transition hover:border-white/20 hover:bg-white/7 hover:text-white no-underline"
                      >
                        Pricing page <ArrowUpRight size={14} className="opacity-70" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section id="scores" label="Scores" title="Findaly subscores (0–5)">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                    Findaly score
                  </div>
                  <div className="mt-2 flex items-end gap-3">
                    <div className="text-3xl font-semibold text-white">
                      {typeof aFindaly === "number" ? aFindaly.toFixed(1) : "—"}
                    </div>
                    <div className="text-xs text-white/45">{toolA.name}</div>
                  </div>
                  <div className="mt-2 flex items-end gap-3">
                    <div className="text-3xl font-semibold text-white">
                      {typeof bFindaly === "number" ? bFindaly.toFixed(1) : "—"}
                    </div>
                    <div className="text-xs text-white/45">{toolB.name}</div>
                  </div>
                  <div className="mt-3 text-xs text-white/45">
                    These bars are derived from your scoring engine subscores (not review ratings).
                  </div>
                </div>

                <div className="md:col-span-2">
                  <BarRow
                    label="Feature coverage"
                    left={aScores.features}
                    right={bScores.features}
                    leftStrong={aScores.features > bScores.features}
                    rightStrong={bScores.features > aScores.features}
                  />
                  <div className="h-px bg-white/10" />
                  <BarRow
                    label="Value for money"
                    left={aScores.value}
                    right={bScores.value}
                    leftStrong={aScores.value > bScores.value}
                    rightStrong={bScores.value > aScores.value}
                  />
                  <div className="h-px bg-white/10" />
                  <BarRow
                    label="Integrations"
                    left={aScores.integrations}
                    right={bScores.integrations}
                    leftStrong={aScores.integrations > bScores.integrations}
                    rightStrong={bScores.integrations > aScores.integrations}
                  />
                  <div className="h-px bg-white/10" />
                  <BarRow
                    label="Security"
                    left={aScores.security}
                    right={bScores.security}
                    leftStrong={aScores.security > bScores.security}
                    rightStrong={bScores.security > aScores.security}
                  />
                  <div className="h-px bg-white/10" />
                  <BarRow
                    label="Reliability"
                    left={aScores.reliability}
                    right={bScores.reliability}
                    leftStrong={aScores.reliability > bScores.reliability}
                    rightStrong={bScores.reliability > aScores.reliability}
                  />
                  <div className="h-px bg-white/10" />
                  <BarRow
                    label="API / developer"
                    left={aScores.apiDev}
                    right={bScores.apiDev}
                    leftStrong={aScores.apiDev > bScores.apiDev}
                    rightStrong={bScores.apiDev > aScores.apiDev}
                  />
                  <div className="h-px bg-white/10" />
                  <BarRow
                    label="Consensus"
                    left={aScores.consensus}
                    right={bScores.consensus}
                    leftStrong={aScores.consensus > bScores.consensus}
                    rightStrong={bScores.consensus > aScores.consensus}
                  />
                </div>
              </div>
            </div>
          </Section>

          <Section id="features" label="Features" title="Key features side-by-side">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{toolA.name}</div>
                  <Pill>{aKeyFeatures.length ? `${aKeyFeatures.length} highlights` : "No data"}</Pill>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  {aKeyFeatures.length ? (
                    aKeyFeatures.map((x) => (
                      <li key={x} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
                        <span>{x}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-white/50">No feature data yet.</li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{toolB.name}</div>
                  <Pill>{bKeyFeatures.length ? `${bKeyFeatures.length} highlights` : "No data"}</Pill>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  {bKeyFeatures.length ? (
                    bKeyFeatures.map((x) => (
                      <li key={x} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
                        <span>{x}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-white/50">No feature data yet.</li>
                  )}
                </ul>
              </div>
            </div>
          </Section>

          <Section id="integrations" label="Integrations" title="Integrations they support">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{toolA.name}</div>
                  <Pill>{aIntegrations.length ? `${aIntegrations.length} listed` : "—"}</Pill>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {aIntegrations.length ? (
                    aIntegrations.map((x) => (
                      <span
                        key={x}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                      >
                        {x}
                      </span>
                    ))
                  ) : (
                    <div className="text-sm text-white/50">No integration data yet.</div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{toolB.name}</div>
                  <Pill>{bIntegrations.length ? `${bIntegrations.length} listed` : "—"}</Pill>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {bIntegrations.length ? (
                    bIntegrations.map((x) => (
                      <span
                        key={x}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                      >
                        {x}
                      </span>
                    ))
                  ) : (
                    <div className="text-sm text-white/50">No integration data yet.</div>
                  )}
                </div>
              </div>
            </div>

            {commonIntegrations.length ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold text-white">Shared integrations</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {commonIntegrations.slice(0, 14).map((x) => (
                    <span
                      key={x}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </Section>

          <Section id="bestfor" label="Best for" title="Who should choose which?">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-semibold text-white">Choose {toolA.name} if…</h3>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  <li>
                    • You want <span className="text-white font-semibold">{aTopFeature}</span> first.
                  </li>
                  <li>
                    • You fit:{" "}
                    <span className="text-white/85">{aAudience.slice(0, 4).join(", ") || "teams"}</span>.
                  </li>
                  <li>
                    • You care more about:{" "}
                    <span className="text-white/85">
                      {aScores.security > bScores.security
                        ? "security"
                        : aScores.integrations > bScores.integrations
                          ? "integrations"
                          : "feature coverage"}
                    </span>
                    .
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-semibold text-white">Choose {toolB.name} if…</h3>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  <li>
                    • You want <span className="text-white font-semibold">{bTopFeature}</span> first.
                  </li>
                  <li>
                    • You fit:{" "}
                    <span className="text-white/85">{bAudience.slice(0, 4).join(", ") || "teams"}</span>.
                  </li>
                  <li>
                    • You care more about:{" "}
                    <span className="text-white/85">
                      {bScores.security > aScores.security
                        ? "security"
                        : bScores.integrations > aScores.integrations
                          ? "integrations"
                          : "feature coverage"}
                    </span>
                    .
                  </li>
                </ul>
              </div>
            </div>

            {internal.best?.length || internal.categories?.length ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold text-white">Related decision paths</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(internal.best ?? []).slice(0, 6).map((x) => (
                    <ChipLink key={x.href} href={x.href}>
                      <Boxes size={14} className="opacity-75" />
                      {x.label}
                    </ChipLink>
                  ))}
                  {(internal.categories ?? []).slice(0, 2).map((x) => (
                    <ChipLink key={x.href} href={x.href}>
                      {x.label}
                    </ChipLink>
                  ))}
                </div>
              </div>
            ) : null}
          </Section>

          <Section id="paths" label="More" title="More comparisons & paths">
            <div className="flex flex-wrap gap-2">
              {(internal.primary ?? []).slice(0, 10).map((x) => (
                <ChipLink key={x.href} href={x.href}>
                  {x.label} <ArrowUpRight size={14} className="opacity-70" />
                </ChipLink>
              ))}
            </div>

            {!sameCategory ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <Link
                  href={categoryHrefA}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/7 hover:text-white no-underline"
                >
                  Browse {categoryNameA} →
                </Link>
                <Link
                  href={categoryHrefB}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/7 hover:text-white no-underline"
                >
                  Browse {categoryNameB} →
                </Link>
              </div>
            ) : (
              <div className="mt-5 text-sm">
                <Link href={categoryHrefA} className="text-white/75 hover:text-white no-underline">
                  Browse all {categoryNameA} tools →
                </Link>
              </div>
            )}
          </Section>

          <footer className="mt-6 text-center text-xs text-white/40">
            Scores are based on structured data + confidence. Not paid rankings.
          </footer>
        </div>
      </div>
    </main>
  );
}
