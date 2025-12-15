// components/ToolsPageClient.tsx
"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import ToolsExplorer from "@/components/ToolsExplorer";
import { ArrowUpRight, Boxes, Search, Zap, Star } from "lucide-react";

type ToolLite = {
  id: string;
  name: string;
  slug: string;
  primaryCategory: string;
  primaryCategorySlug: string;
  pricingModel: string;
  shortDescription: string;
  startingPrice: string | null;
  keyFeatures: string[];
  isFeatured: boolean;
};

type CategoryLite = { name: string; slug: string };

function splitVs(label: string) {
  const parts = label.split(/\s+vs\s+/i);
  if (parts.length >= 2) return { a: parts[0].trim(), b: parts.slice(1).join(" vs ").trim() };
  return { a: label, b: "" };
}

function initials(name: string) {
  const words = name.split(" ").filter(Boolean);
  const a = words[0]?.[0] ?? "T";
  const b = words[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function MiniLogo({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white/85">
      {initials(name)}
    </div>
  );
}

function Stat({
  left,
  label,
  right,
}: {
  left: React.ReactNode;
  label: string;
  right: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3">
      <div className="text-sm font-semibold text-white/85">{left}</div>
      <div className="text-xs text-white/45">{label}</div>
      <div className="text-sm font-semibold text-white/85 text-right">{right}</div>
    </div>
  );
}

function BarPair({
  label,
  left,
  right,
}: {
  label: string;
  left: number; // 0-5
  right: number; // 0-5
}) {
  const max = 5;
  const leftPct = Math.max(0, Math.min(100, (left / max) * 100));
  const rightPct = Math.max(0, Math.min(100, (right / max) * 100));

  return (
    <div className="py-3">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <div className="text-sm font-semibold text-white/85 tabular-nums">{left.toFixed(1)}</div>

        <div className="flex items-center gap-3">
          <div className="h-1.5 w-full rounded-full bg-white/10">
            <div className="h-1.5 rounded-full bg-white/70" style={{ width: `${leftPct}%` }} />
          </div>
          <div className="text-xs text-white/45">{label}</div>
          <div className="h-1.5 w-full rounded-full bg-white/10">
            <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: `${rightPct}%` }} />
          </div>
        </div>

        <div className="text-sm font-semibold text-white/85 tabular-nums">{right.toFixed(1)}</div>
      </div>
    </div>
  );
}

/**
 * Placeholder comparison stats to make the carousel feel "real" like the example.
 * Swap these for real DB values later.
 */
function fauxStatsFromSlug(slug: string) {
  // deterministic-ish values so it doesn't jump around on refresh
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;

  const r1 = 4.3 + ((h % 40) / 100); // 4.30-4.69
  const r2 = 4.3 + (((h >>> 6) % 40) / 100);
  const reviews1 = 250 + (h % 18000);
  const reviews2 = 250 + ((h >>> 10) % 18000);

  const p1 = 4 + (h % 20); // 4-23
  const p2 = 4 + ((h >>> 12) % 30); // 4-33

  const feat1 = 4.2 + (((h >>> 4) % 50) / 100); // 4.2-4.7
  const feat2 = 4.2 + (((h >>> 14) % 50) / 100);

  const ease1 = 4.1 + (((h >>> 2) % 60) / 100); // 4.1-4.7
  const ease2 = 4.1 + (((h >>> 16) % 60) / 100);

  return {
    ratingA: Number(r1.toFixed(2)),
    ratingB: Number(r2.toFixed(2)),
    reviewsA: reviews1,
    reviewsB: reviews2,
    priceA: p1,
    priceB: p2,
    featuresA: Number(feat1.toFixed(1)),
    featuresB: Number(feat2.toFixed(1)),
    easeA: Number(ease1.toFixed(1)),
    easeB: Number(ease2.toFixed(1)),
  };
}

export default function ToolsPageClient({
  tools,
  categories,
  popularComparisons,
  totalTools,
  totalCategories,
}: {
  tools: ToolLite[];
  categories: CategoryLite[];
  popularComparisons: Array<{ href: string; label: string; category: string }>;
  totalTools: number;
  totalCategories: number;
}) {
  const [query, setQuery] = useState("");
  const explorerRef = useRef<HTMLDivElement | null>(null);

  const topCats = useMemo(() => categories.slice(0, 4), [categories]);

  function scrollToExplorer() {
    explorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      <div className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[760px] bg-[radial-gradient(1000px_380px_at_50%_0%,rgba(255,255,255,0.10),rgba(0,0,0,0))]" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-20">
        {/* HERO */}
        <section className="text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <Zap size={14} className="opacity-80" />
            Browse tools
          </p>

          <h1 className="mx-auto mt-7 max-w-4xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Decision-first software discovery.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            Search tools, filter by category and pricing model, then jump into comparisons and alternatives.
          </p>

          {/* SINGLE search bar */}
          <div className="mx-auto mt-9 max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-3">
                <Search size={18} className="text-white/45" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") scrollToExplorer();
                  }}
                  placeholder="Search tools, categories, pricing models…"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={scrollToExplorer}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-[rgba(255,255,255,0.08)] px-5 py-3 text-sm font-medium text-white transition hover:border-white/25 hover:bg-[rgba(255,255,255,0.10)] md:flex-none"
                >
                  Browse results <ArrowUpRight size={16} className="opacity-70" />
                </button>

                <Link
                  href="/compare"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-transparent px-5 py-3 text-sm font-medium text-white/85 transition hover:border-white/25 hover:text-white md:flex-none no-underline"
                >
                  Compare <Boxes size={16} className="opacity-80" />
                </Link>
              </div>
            </div>

            <div className="mt-3 text-xs text-white/55">
              {totalTools} tools • {totalCategories} categories
              {topCats.length ? (
                <>
                  {" "}
                  • Top:{" "}
                  {topCats.map((c, i) => (
                    <span key={c.slug}>
                      <Link href={`/tools/category/${c.slug}`} className="text-white/70 hover:text-white no-underline">
                        {c.name}
                      </Link>
                      {i < topCats.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </>
              ) : null}
            </div>
          </div>
        </section>

        {/* Popular comparisons (Capterra-ish cards, one row) */}
        {popularComparisons.length ? (
          <section className="mt-12 md:mt-14">
            <div className="mx-auto max-w-6xl">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                    Popular comparisons
                  </p>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight text-white md:text-xl">
                    Fast starting points
                  </h2>
                </div>

                <Link
                  href="/compare"
                  className="hidden items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white md:inline-flex no-underline"
                >
                  View all <ArrowUpRight size={16} className="opacity-70" />
                </Link>
              </div>

              <div className="mt-5 -mx-6 px-6">
                <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {popularComparisons.map((c) => {
                    const { a, b } = splitVs(c.label);
                    const stats = fauxStatsFromSlug(c.href);

                    return (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="snap-start shrink-0 w-[360px] rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/7 no-underline"
                        title={c.category}
                      >
                        {/* top row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <MiniLogo name={a} />
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-white">{a}</div>
                              <div className="text-xs text-white/50">{c.category}</div>
                            </div>
                          </div>

                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-white/70">
                            VS
                          </div>

                          <div className="flex items-center gap-3 min-w-0">
                            <div className="min-w-0 text-right">
                              <div className="truncate text-sm font-semibold text-white">{b || "Comparison"}</div>
                              <div className="text-xs text-white/50">Compare</div>
                            </div>
                            <MiniLogo name={b || "Tool"} />
                          </div>
                        </div>

                        {/* stats block */}
                        <div className="mt-5 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-4">
                          <Stat
                            label="Rating"
                            left={
                              <span className="inline-flex items-center gap-1">
                                <Star size={14} className="opacity-80" />
                                {stats.ratingA}{" "}
                                <span className="text-white/50 font-medium">({stats.reviewsA.toLocaleString()})</span>
                              </span>
                            }
                            right={
                              <span className="inline-flex items-center justify-end gap-1">
                                <Star size={14} className="opacity-80" />
                                {stats.ratingB}{" "}
                                <span className="text-white/50 font-medium">({stats.reviewsB.toLocaleString()})</span>
                              </span>
                            }
                          />
                          <div className="h-px bg-white/10" />
                          <Stat
                            label="Price"
                            left={<span>${stats.priceA}/month</span>}
                            right={<span>${stats.priceB}/month</span>}
                          />
                        </div>

                        {/* bars */}
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4">
                          <BarPair label="Features" left={stats.featuresA} right={stats.featuresB} />
                          <div className="h-px bg-white/10" />
                          <BarPair label="Ease of use" left={stats.easeA} right={stats.easeB} />
                        </div>

                        {/* CTA */}
                        <div className="mt-5 flex items-center justify-center rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-3 text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white">
                          View full comparison →
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 text-xs text-white/45">Tip: scroll sideways.</div>
            </div>
          </section>
        ) : null}

        {/* Explorer */}
        <section className="mt-12 md:mt-14" ref={explorerRef}>
          <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 md:p-6">
            <ToolsExplorer tools={tools} categories={categories} query={query} />
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Findaly. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
