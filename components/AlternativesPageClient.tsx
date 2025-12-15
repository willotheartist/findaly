"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search, Sparkles } from "lucide-react";

type ToolLite = {
  id: string;
  name: string;
  slug: string;
  primaryCategory: string;
  primaryCategorySlug: string;
  pricingModel: string;
  shortDescription: string;
  startingPrice: string | null;
  isFeatured: boolean;
};

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function initials(name: string) {
  const words = (name || "").split(" ").filter(Boolean);
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

function matchesQuery(t: ToolLite, q: string) {
  if (!q) return true;
  const hay = [
    t.name,
    t.primaryCategory,
    t.pricingModel,
    t.shortDescription,
    t.startingPrice ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export default function AlternativesPageClient({
  tools,
  totalTools,
}: {
  tools: ToolLite[];
  totalTools: number;
}) {
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const q = normalize(query);
    const arr = tools.filter((t) => matchesQuery(t, q));
    // featured first, then name
    return [...arr].sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [tools, query]);

  const featured = useMemo(() => tools.filter((t) => t.isFeatured).slice(0, 8), [tools]);

  function scrollToList() {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const inputWrap =
    "flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-3";

  const buttonPrimary =
    "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-[rgba(255,255,255,0.08)] px-5 py-3 text-sm font-medium text-white transition hover:border-white/25 hover:bg-[rgba(255,255,255,0.10)] md:flex-none";

  const pill =
    "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70";

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      <div className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[760px] bg-[radial-gradient(1000px_380px_at_50%_0%,rgba(255,255,255,0.10),rgba(0,0,0,0))]" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-20">
        {/* HERO */}
        <section className="text-center">
          <p className={pill}>
            <Sparkles size={14} className="opacity-80" />
            Find alternatives fast
          </p>

          <h1 className="mx-auto mt-7 max-w-4xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Alternatives for any tool — in one search.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            Type a product name, open its alternatives page, then jump into comparisons and best-for pages.
          </p>

          {/* Search */}
          <div className="mx-auto mt-9 max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className={inputWrap}>
                <Search size={18} className="text-white/45" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") scrollToList();
                  }}
                  placeholder="Search for a tool (e.g. ClickUp, Notion, Figma)…"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                />
              </div>

              <button type="button" onClick={scrollToList} className={buttonPrimary}>
                Browse matches <ArrowUpRight size={16} className="opacity-70" />
              </button>
            </div>

            <div className="mt-3 text-xs text-white/55">
              {totalTools} tools indexed
              {featured.length ? (
                <>
                  {" "}
                  • Featured:{" "}
                  {featured.slice(0, 4).map((t, i) => (
                    <span key={t.slug}>
                      <Link
                        href={`/alternatives/${t.slug}`}
                        className="text-white/70 hover:text-white no-underline"
                      >
                        {t.name}
                      </Link>
                      {i < Math.min(4, featured.length) - 1 ? ", " : ""}
                    </span>
                  ))}
                </>
              ) : null}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mt-12 md:mt-14" ref={listRef}>
          <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 md:p-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Results
                </p>
                <div className="mt-2 text-sm text-white/70">
                  <span className="text-white">{filtered.length}</span> shown{" "}
                  <span className="opacity-50">/</span> {tools.length}
                </div>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              {filtered.slice(0, 60).map((t, idx) => (
                <Link
                  key={t.id}
                  href={`/alternatives/${t.slug}`}
                  className={[
                    "block px-5 py-4 transition hover:bg-[rgba(255,255,255,0.04)] no-underline",
                    idx !== 0 ? "border-t border-white/10" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <MiniLogo name={t.name} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="truncate text-sm font-semibold text-white">{t.name}</div>
                          {t.isFeatured ? (
                            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                              Featured
                            </span>
                          ) : null}
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                            {t.pricingModel}
                          </span>
                          {t.startingPrice ? (
                            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                              {t.startingPrice}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-1 text-sm text-white/60 line-clamp-2">
                          {t.shortDescription}
                        </div>

                        <div className="mt-2 text-xs text-white/50">
                          {t.primaryCategory}
                        </div>
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

            {filtered.length > 60 ? (
              <div className="mt-4 text-xs text-white/45">
                Showing the first 60 matches — refine your search to narrow it down.
              </div>
            ) : null}
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Findaly. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
