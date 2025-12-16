// components/ComparePageClient.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Boxes, Plus, Search, X, Zap } from "lucide-react";

type ToolLite = {
  id: string;
  name: string;
  slug: string;

  websiteUrl: string | null;
  logoUrl: string | null;

  primaryCategory: string;
  primaryCategorySlug: string;

  pricingModel: string;
  startingPrice: string | null;
  shortDescription: string;

  isFeatured: boolean;
};

type PopularComparison = { href: string; label: string; category: string };

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

function splitVs(label: string) {
  const parts = label.split(/\s+vs\s+/i);
  if (parts.length >= 2) return { a: parts[0].trim(), b: parts.slice(1).join(" vs ").trim() };
  return { a: label, b: "" };
}

function uniqBy<T>(arr: T[] | null | undefined, key: (x: T) => string) {
  if (!Array.isArray(arr)) return [];
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of arr) {
    const k = key(x);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

export default function ComparePageClient({
  tools = [],
  featuredTools = [],
  popularComparisons = [],
}: {
  tools: ToolLite[];
  featuredTools: ToolLite[];
  popularComparisons: PopularComparison[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ToolLite[]>([]);

  const selectedIds = useMemo(() => new Set(selected.map((t) => t.id)), [selected]);
  const canAddMore = selected.length < 4;
  const canCompare = selected.length >= 2;

  const featuredUnique = useMemo(() => uniqBy(featuredTools, (t) => t.id).slice(0, 12), [featuredTools]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return tools
      .filter((t) => {
        const hay = `${t.name} ${t.primaryCategory} ${t.pricingModel} ${t.shortDescription}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 12);
  }, [query, tools]);

  function addTool(t: ToolLite) {
    if (selectedIds.has(t.id)) return;
    if (!canAddMore) return;
    setSelected((prev) => [...prev, t]);
    setQuery(""); // feels nicer (like Capterra)
  }

  function removeTool(id: string) {
    setSelected((prev) => prev.filter((t) => t.id !== id));
  }

  function clearAll() {
    setSelected([]);
  }

  const compareHref = useMemo(() => {
    if (!canCompare) return null;

    if (selected.length === 2) {
      return `/compare/${selected[0]!.slug}-vs-${selected[1]!.slug}`;
    }

    // optional: future multi-compare route
    const slugs = selected.map((t) => t.slug).join(",");
    return `/compare?tools=${encodeURIComponent(slugs)}`;
  }, [canCompare, selected]);

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      <div className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[760px] bg-[radial-gradient(1000px_380px_at_50%_0%,rgba(255,255,255,0.10),rgba(0,0,0,0))]" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-20">
        {/* HERO */}
        <section className="text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <Zap size={14} className="opacity-80" />
            Compare tools
          </p>

          <h1 className="mx-auto mt-7 max-w-4xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Start a comprehensive <span className="text-white">head to head</span> product comparison
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            Select 2–4 products. We’ll take you to a structured comparison with pricing, features, and decision guidance.
          </p>

          {/* Builder */}
          <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                What products would you like to compare?
              </p>
              <p className="mt-2 text-sm text-white/60">Select 2 to 4 products</p>

              {/* Search + counter */}
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-3">
                    <Search size={18} className="text-white/45" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search products"
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                    />
                  </div>

                  {/* Dropdown results */}
                  {query.trim() && filtered.length ? (
                    <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-(--bg)/95 backdrop-blur">
                      {filtered.map((t) => {
                        const disabled = selectedIds.has(t.id) || !canAddMore;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => addTool(t)}
                            disabled={disabled}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <span className="flex items-center gap-3 min-w-0">
                              <MiniLogo name={t.name} />
                              <span className="min-w-0">
                                <span className="block truncate font-medium text-white">{t.name}</span>
                                <span className="block truncate text-xs text-white/50">
                                  {t.primaryCategory} • {t.pricingModel}
                                </span>
                              </span>
                            </span>

                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                              <Plus size={16} className="opacity-70" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 md:w-[260px]">
                  <div className="text-sm text-white/70">Your comparison</div>
                  <div className="text-sm font-semibold tabular-nums text-white/85">{selected.length}/4 selected</div>
                </div>
              </div>

              {/* Selected tools */}
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {selected.length ? (
                    selected.map((t) => (
                      <div
                        key={t.id}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85"
                      >
                        <span className="font-medium">{t.name}</span>
                        <button
                          type="button"
                          onClick={() => removeTool(t.id)}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:border-white/20"
                          aria-label={`Remove ${t.name}`}
                        >
                          <X size={14} className="opacity-70" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-white/55">No tools selected yet.</div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-sm text-white/60 hover:text-white disabled:opacity-40"
                    disabled={!selected.length}
                  >
                    Clear all
                  </button>

                  {compareHref ? (
                    <Link
                      href={compareHref}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-[rgba(255,255,255,0.08)] px-5 py-3 text-sm font-medium text-white transition hover:border-white/25 hover:bg-[rgba(255,255,255,0.10)]"
                    >
                      Compare now <ArrowUpRight size={16} className="opacity-70" />
                    </Link>
                  ) : (
                    <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/55">
                      Select at least 2 tools <Boxes size={16} className="opacity-70" />
                    </div>
                  )}
                </div>
              </div>

              {/* Featured products */}
              {featuredUnique.length ? (
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Featured products</p>
                    <p className="text-xs text-white/45">Quick add</p>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredUnique.map((t) => {
                      const disabled = selectedIds.has(t.id) || !canAddMore;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => addTool(t)}
                          disabled={disabled}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <MiniLogo name={t.name} />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-white/90">{t.name}</span>
                              <span className="block truncate text-xs text-white/50">
                                {t.primaryCategory} • {t.pricingModel}
                              </span>
                            </span>
                          </span>

                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                            <Plus size={16} className="opacity-70" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Popular comparisons */}
        {popularComparisons.length ? (
          <section className="mt-14">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Popular comparisons</p>
                <h2 className="mt-2 text-lg font-semibold tracking-tight text-white md:text-xl">Fast starting points</h2>
              </div>
              <Link
                href="/compare"
                className="hidden items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white md:inline-flex no-underline"
              >
                Browse all <ArrowUpRight size={16} className="opacity-70" />
              </Link>
            </div>

            <div className="mt-5 -mx-6 px-6">
              <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {popularComparisons.slice(0, 14).map((c) => {
                  const { a, b } = splitVs(c.label);
                  return (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="snap-start shrink-0 w-[360px] rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/7 no-underline"
                      title={c.category}
                    >
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

                      <div className="mt-5 flex items-center justify-center rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-3 text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white">
                        View full comparison →
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 text-xs text-white/45">Tip: scroll sideways.</div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
