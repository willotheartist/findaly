"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";

export default function UseCasesExplorer({
  useCases = [],
}: {
  useCases?: Array<{ id: string; name: string; slug: string }>;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return useCases;
    return useCases.filter((u) => u.name.toLowerCase().includes(q));
  }, [useCases, query]);

  return (
    <div>
      {/* Controls */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              Browse
            </p>
            <div className="mt-2 text-sm text-white/70">
              <span className="text-white">{filtered.length}</span> shown{" "}
              <span className="opacity-50">/</span> {useCases.length}
            </div>
          </div>

          <div className="md:min-w-[520px]">
            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-3">
              <div className="flex items-center gap-2">
                <Search size={18} className="text-white/45" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search use cases…"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((u) => (
          <Link
            key={u.id}
            href={`/use-cases/${u.slug}`}
            className="group block rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/15 hover:bg-white/7 no-underline"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-tight text-white">
                  {u.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Browse categories where this use case matters — best lists + alternatives.
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70">
                Use case
              </span>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition group-hover:text-white">
              Explore <ArrowUpRight size={16} className="opacity-70" />
            </div>
          </Link>
        ))}
      </div>

      {!filtered.length ? (
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-white/60">
          No use cases match that search.
        </div>
      ) : null}
    </div>
  );
}
