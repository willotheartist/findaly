// components/ToolsExplorer.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";

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

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function matchesQuery(t: ToolLite, q: string) {
  if (!q) return true;
  const hay = [
    t.name,
    t.primaryCategory,
    t.pricingModel,
    t.shortDescription,
    ...(t.keyFeatures ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export default function ToolsExplorer({
  tools,
  categories,
  query,
}: {
  tools: ToolLite[];
  categories: CategoryLite[];
  query: string; // controlled from hero (single search bar)
}) {
  const router = useRouter();

  const [category, setCategory] = useState<string>("all");
  const [pricing, setPricing] = useState<string>("all");
  const [sort, setSort] = useState<"featured" | "name" | "category">("featured");
  const [view, setView] = useState<"cards" | "compact">("cards");

  const filtered = useMemo(() => {
    const q = normalize(query);

    let arr = tools.filter((t) => matchesQuery(t, q));
    if (category !== "all") arr = arr.filter((t) => t.primaryCategorySlug === category);
    if (pricing !== "all")
      arr = arr.filter((t) => normalize(String(t.pricingModel)) === normalize(pricing));

    arr = [...arr].sort((a, b) => {
      if (sort === "featured") {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        return a.name.localeCompare(b.name);
      }
      if (sort === "category") {
        const c = a.primaryCategory.localeCompare(b.primaryCategory);
        if (c !== 0) return c;
        return a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });

    return arr;
  }, [tools, query, category, pricing, sort]);

  const pricingOptions = useMemo(() => {
    const set = new Set<string>();
    for (const t of tools) set.add(String(t.pricingModel));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [tools]);

  function goToCategory(slug: string) {
    router.push(`/tools/category/${slug}`);
  }

  function onCategoryClick(e: React.MouseEvent, slug: string) {
    e.preventDefault();
    e.stopPropagation();
    goToCategory(slug);
  }

  function onCategoryKeyDown(e: React.KeyboardEvent, slug: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      goToCategory(slug);
    }
  }

  const selectClass =
    "h-11 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-3 text-sm text-white/85 outline-none transition focus:border-white/25";

  const badge =
    "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/70";

  return (
    <div>
      {/* Controls (NO SEARCH INPUT HERE) */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              Results
            </p>
            <div className="mt-2 text-sm text-white/70">
              <span className="text-white">{filtered.length}</span> shown{" "}
              <span className="opacity-50">/</span> {tools.length}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_1fr_auto_auto] md:items-center md:min-w-[720px]">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <select value={pricing} onChange={(e) => setPricing(e.target.value)} className={selectClass}>
              <option value="all">All pricing</option>
              {pricingOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select value={sort} onChange={(e) => {
                const v = e.target.value;
                if (v === "featured" || v === "name" || v === "category") setSort(v);
              }} className={selectClass}>
              <option value="featured">Sort: Featured</option>
              <option value="name">Sort: Name</option>
              <option value="category">Sort: Category</option>
            </select>

            <button
              type="button"
              onClick={() => setView("cards")}
              className={[
                "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition",
                view === "cards"
                  ? "border-white/25 bg-white/10 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/7 hover:text-white",
              ].join(" ")}
            >
              <LayoutGrid size={16} className="opacity-80" />
              Cards
            </button>

            <button
              type="button"
              onClick={() => setView("compact")}
              className={[
                "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition",
                view === "compact"
                  ? "border-white/25 bg-white/10 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/7 hover:text-white",
              ].join(" ")}
            >
              <List size={16} className="opacity-80" />
              Compact
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {view === "compact" ? (
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          {filtered.map((t, idx) => (
            <Link
              key={t.id}
              href={`/tools/${t.slug}`}
              className={[
                "block px-5 py-4 transition hover:bg-[rgba(255,255,255,0.04)] no-underline",
                idx !== 0 ? "border-t border-white/10" : "",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    {t.isFeatured ? <span className={badge}>Featured</span> : null}
                    <span className={badge}>{t.pricingModel}</span>
                    {t.startingPrice ? <span className={badge}>{t.startingPrice}</span> : null}
                  </div>

                  <div className="mt-1 text-sm text-white/60 line-clamp-2">{t.shortDescription}</div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      role="link"
                      tabIndex={0}
                      className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 transition hover:border-white/20 hover:bg-white/7 hover:text-white"
                      onClick={(e) => onCategoryClick(e, t.primaryCategorySlug)}
                      onKeyDown={(e) => onCategoryKeyDown(e, t.primaryCategorySlug)}
                    >
                      {t.primaryCategory}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-xs text-white/55">View →</div>
              </div>
            </Link>
          ))}

          {!filtered.length ? (
            <div className="px-5 py-10 text-center text-sm text-white/60">
              No tools match that search.
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filtered.map((t) => (
              <Link
                key={t.id}
                href={`/tools/${t.slug}`}
                className="group block rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/15 hover:bg-white/7 no-underline"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold tracking-tight text-white">{t.name}</h3>
                      {t.isFeatured ? <span className={badge}>Featured</span> : null}
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-white/60 line-clamp-3">
                      {t.shortDescription}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className={badge}>{t.pricingModel}</div>
                    {t.startingPrice ? <div className="mt-2 text-xs text-white/55">{t.startingPrice}</div> : null}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    role="link"
                    tabIndex={0}
                    className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 transition hover:border-white/20 hover:bg-white/7 hover:text-white"
                    onClick={(e) => onCategoryClick(e, t.primaryCategorySlug)}
                    onKeyDown={(e) => onCategoryKeyDown(e, t.primaryCategorySlug)}
                  >
                    {t.primaryCategory}
                  </span>

                  {(t.keyFeatures ?? []).slice(0, 2).map((k) => (
                    <span
                      key={k}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/60"
                    >
                      {k}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between text-xs text-white/55">
                  <span className="transition group-hover:text-white/70">View tool</span>
                  <span className="transition group-hover:text-white/70">→</span>
                </div>
              </Link>
            ))}
          </div>

          {!filtered.length ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-white/60">
              No tools match that search.
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
