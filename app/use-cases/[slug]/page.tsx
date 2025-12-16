// app/use-cases/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ToolLogo from "@/components/ToolLogo";
import { ArrowUpRight, Boxes, Info, Layers, Sparkles, Star } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

function decode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function scoreToPct(score0to10: number) {
  const s = Math.max(0, Math.min(10, score0to10));
  return Math.round(s * 10);
}

function safeJsonObject(v: unknown): Record<string, unknown> {
  if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
  return {};
}

type ConsensusTopic = {
  topic: string;
  signal: number;
  sentiment: "positive" | "mixed" | "negative";
  confidence: number;
  sources: string[];
  n: number;
};

type ExternalConsensusMeta = {
  generatedAt?: string;
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
          sentiment:
            t["sentiment"] === "positive" || t["sentiment"] === "negative" || t["sentiment"] === "mixed"
              ? (t["sentiment"] as ConsensusTopic["sentiment"])
              : "mixed",
          confidence: Number(t["confidence"] ?? 0),
          sources: Array.isArray(t["sources"]) ? (t["sources"] as unknown[]).map(String) : [],
          n: Number(t["n"] ?? 0),
        }))
        .filter((t) => t.topic && Number.isFinite(t.confidence))
    : [];

  if (!topics.length) return null;

  return {
    generatedAt: typeof obj["generatedAt"] === "string" ? (obj["generatedAt"] as string) : undefined,
    topics,
  };
}

function fmtSentiment(s: ConsensusTopic["sentiment"]) {
  if (s === "positive") return "Positive";
  if (s === "negative") return "Negative";
  return "Mixed";
}

function pillClasses(s: ConsensusTopic["sentiment"]) {
  if (s === "positive") return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  if (s === "negative") return "border-rose-400/25 bg-rose-400/10 text-rose-200";
  return "border-violet-400/25 bg-violet-400/10 text-violet-200";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = decode(raw || "");
  if (!slug) return { title: "Use case" };

  const uc = await prisma.useCase.findUnique({ where: { slug } });
  if (!uc) return { title: "Use case not found" };

  const title = `Best tools for ${uc.name} — Findaly`;
  const description = `Top tools ranked for ${uc.name}, plus fast comparisons and category-specific best lists.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function UseCasePage({ params }: Props) {
  const { slug: raw } = await params;
  const slug = decode(raw || "");
  if (!slug) notFound();

  const uc = await prisma.useCase.findUnique({ where: { slug } });
  if (!uc) notFound();

  // Primary: Top tools for this use case (this is what users expect)
  const topTools = await prisma.tool.findMany({
    where: {
      status: "ACTIVE",
      useCases: { some: { slug: uc.slug } },
    },
    orderBy: [
      { findalyScore: "desc" }, // nulls will naturally fall to the bottom in practice
      { isFeatured: "desc" },
      { name: "asc" },
    ],
    take: 24,
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      websiteUrl: true,
      shortDescription: true,
      pricingModel: true,
      startingPrice: true,
      primaryCategory: { select: { name: true, slug: true } },
      findalyScore: true,
      findalyScoreMeta: true,
    },
  });

  // Secondary: categories that contain tools tagged with this use case (keep your “best pages” strategy)
  const categories = await prisma.category.findMany({
    where: {
      tools: {
        some: {
          status: "ACTIVE",
          useCases: { some: { slug: uc.slug } },
        },
      },
    },
    orderBy: [{ name: "asc" }],
    select: { id: true, name: true, slug: true },
  });

  // Sample tools per category (quick browse, still useful)
  const sampleByCategory = await Promise.all(
    categories.slice(0, 12).map(async (c) => {
      const tools = await prisma.tool.findMany({
        where: {
          status: "ACTIVE",
          primaryCategoryId: c.id,
          useCases: { some: { slug: uc.slug } },
        },
        orderBy: [{ findalyScore: "desc" }, { isFeatured: "desc" }, { name: "asc" }],
        take: 4,
        select: { id: true, name: true, slug: true, pricingModel: true },
      });
      return { category: c, tools };
    }),
  );

  const topForComparisons = topTools.slice(0, 6);

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      {/* top glow */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 -z-20 h-[760px] bg-[radial-gradient(1000px_380px_at_50%_0%,rgba(255,255,255,0.10),rgba(0,0,0,0))]" />

      {/* grid background (keep the vibe) */}
      <div className="pointer-events-none absolute inset-0 -z-30 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(60%_50%_at_50%_20%,black,transparent)]" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-20">
        {/* Breadcrumb */}
        <div className="text-xs text-white/50">
          <Link href="/tools" className="text-white/60 hover:text-white no-underline">
            Tools
          </Link>
          <span className="mx-1">/</span>
          <Link href="/use-cases" className="text-white/60 hover:text-white no-underline">
            Use cases
          </Link>
          <span className="mx-1">/</span>
          <span className="text-white/70">{uc.name}</span>
        </div>

        {/* HERO */}
        <section className="mt-6 text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <Sparkles size={14} className="opacity-80" />
            Best tools for {uc.name}
          </p>

          <h1 className="mx-auto mt-7 max-w-4xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {uc.name}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            Ranked picks based on Findaly signals + third-party consensus where available. Jump into profiles,
            comparisons, and category best lists.
          </p>
        </section>

        {/* TOP TOOLS (what testers expected) */}
        <section className="mt-10 md:mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Top tools</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-white md:text-xl">
                Shortlist for {uc.name}
              </h2>
            </div>

            <Link
              href="/tools"
              className="hidden items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white md:inline-flex no-underline"
            >
              Browse all tools <ArrowUpRight size={16} className="opacity-70" />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topTools.map((t) => {
              const meta = safeJsonObject(t.findalyScoreMeta);
              const externalConsensus = parseExternalConsensus(meta["externalConsensus"]);
              const topTopic = (externalConsensus?.topics ?? [])
                .slice()
                .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))[0];

              const scorePct = typeof t.findalyScore === "number" ? scoreToPct(t.findalyScore) : null;

              // confidence heuristic (if present in v2 meta)
              const v = String(meta["version"] ?? "");
              const subs = safeJsonObject(meta["subscores"]);
              const consensusSub = safeJsonObject(subs["consensus"]);
              const consensusConf =
                typeof consensusSub["confidence"] === "number" ? Math.round(clamp01(consensusSub["confidence"]) * 100) : null;

              return (
                <div
                  key={t.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20"
                >
                  <div className="flex items-start gap-4">
                    <ToolLogo name={t.name} logoUrl={t.logoUrl} websiteUrl={t.websiteUrl} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/tools/${t.slug}`}
                            className="block truncate text-base font-semibold text-white/90 hover:text-white no-underline"
                          >
                            {t.name}
                          </Link>

                          <p className="mt-2 line-clamp-2 text-sm text-white/65">
                            {t.shortDescription || "Compare pricing, features, and alternatives."}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/55">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                              <Layers size={14} className="opacity-70" />
                              <Link
                                href={`/tools/category/${t.primaryCategory?.slug ?? "tools"}`}
                                className="text-white/70 hover:text-white no-underline"
                              >
                                {t.primaryCategory?.name ?? "Tools"}
                              </Link>
                            </span>

                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                              <Boxes size={14} className="opacity-70" />
                              {String(t.pricingModel)}
                              {t.startingPrice ? <span className="text-white/45">• {t.startingPrice}</span> : null}
                            </span>
                          </div>
                        </div>

                        {scorePct !== null ? (
                          <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                              Findaly
                            </p>
                            <p className="mt-1 text-xl font-semibold tabular-nums text-white">{scorePct}%</p>
                            {consensusConf !== null ? (
                              <p className="text-[11px] text-white/45">Conf {consensusConf}%</p>
                            ) : (
                              <p className="text-[11px] text-white/45">Signals</p>
                            )}
                          </div>
                        ) : (
                          <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                              Findaly
                            </p>
                            <p className="mt-1 text-sm text-white/60">No score yet</p>
                          </div>
                        )}
                      </div>

                      {topTopic ? (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${pillClasses(
                              topTopic.sentiment
                            )}`}
                          >
                            {fmtSentiment(topTopic.sentiment)}
                          </span>

                          <span className="text-xs text-white/55">
                            <Star size={14} className="inline -mt-0.5 opacity-70" />{" "}
                            {Math.round(clamp01(topTopic.confidence) * 100)}% consensus
                          </span>

                          {externalConsensus?.generatedAt ? (
                            <span className="text-xs text-white/40 inline-flex items-center gap-2">
                              <Info size={14} className="opacity-70" />
                              Updated {new Date(externalConsensus.generatedAt).toLocaleDateString()}
                            </span>
                          ) : null}
                        </div>
                      ) : null}

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                          href={`/tools/${t.slug}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[rgba(255,255,255,0.08)] px-4 py-2 text-sm font-medium text-white transition hover:border-white/25 hover:bg-[rgba(255,255,255,0.10)] no-underline"
                        >
                          View profile <ArrowUpRight size={16} className="opacity-70" />
                        </Link>

                        {topForComparisons[0] && topForComparisons[0].slug !== t.slug ? (
                          <Link
                            href={`/compare/${t.slug}-vs-${topForComparisons[0].slug}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-transparent px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/25 hover:text-white no-underline"
                          >
                            Compare <Boxes size={16} className="opacity-70" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CATEGORY ROUTES (secondary) */}
        {categories.length ? (
          <section className="mt-14">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Browse by category</p>
                <h2 className="mt-2 text-lg font-semibold tracking-tight text-white md:text-xl">
                  Best lists that match this intent
                </h2>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              {categories.slice(0, 14).map((c) => (
                <Link
                  key={c.id}
                  href={`/best/${c.slug}-tools-for-${uc.slug}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/75 transition hover:border-white/20 hover:text-white no-underline"
                >
                  Best {c.name} tools for {uc.name}
                </Link>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {sampleByCategory.map(({ category, tools }) => (
                <div key={category.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-white/90">{category.name}</h3>
                      <p className="mt-2 text-sm text-white/60">
                        Top matches inside this category for <span className="text-white/80">{uc.name}</span>.
                      </p>
                    </div>

                    <Link
                      href={`/best/${category.slug}-tools-for-${uc.slug}`}
                      className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 hover:border-white/20 hover:text-white no-underline"
                    >
                      View best <ArrowUpRight size={14} className="opacity-70" />
                    </Link>
                  </div>

                  {tools.length ? (
                    <div className="mt-4 space-y-2 text-sm">
                      {tools.map((t) => (
                        <div key={t.id} className="flex items-center justify-between gap-3">
                          <Link href={`/tools/${t.slug}`} className="text-white/80 hover:text-white no-underline">
                            {t.name}
                          </Link>
                          <span className="text-xs text-white/45">{String(t.pricingModel)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-white/60">No tools yet.</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Findaly. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
