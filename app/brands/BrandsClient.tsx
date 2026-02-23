//·app/brands/BrandsClient.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BrandItem = {
  name: string;
  display: string;
  slug: string;
  count: number;
};

export default function BrandsClient({ brands }: { brands: BrandItem[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return brands;

    return brands.filter((b) => {
      const hay = `${b.name} ${b.display} ${b.slug}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q, brands]);

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">Brand directory</div>
          <p className="mt-1 text-sm text-slate-600">
            Search and jump into a brand hub (live inventory + future model/country/year depth).
          </p>
        </div>

        <div className="w-full sm:w-[340px]">
          <label className="sr-only" htmlFor="brand-search">
            Search brands
          </label>
          <input
            id="brand-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search brands…"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => (
          <Link
            key={b.slug}
            href={`/buy/brand/${b.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 no-underline hover:border-slate-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900 group-hover:underline">
                  {b.display}
                </div>
                <div className="mt-1 text-xs tracking-[0.14em] uppercase text-slate-500">
                  Brand hub
                </div>
              </div>

              <div className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                {b.count > 0 ? `${b.count} live` : "Explore"}
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Browse listings and filter by model, year, and country.
            </p>

            <div className="mt-4 text-sm font-semibold text-slate-900">
              View listings →
            </div>
          </Link>
        ))}
      </div>

      {!filtered.length ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold text-slate-900">No matches</div>
          <p className="mt-2 text-sm text-slate-600">
            Try a different spelling — or clear the search to see all brands.
          </p>
          <button
            type="button"
            onClick={() => setQ("")}
            className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
          >
            Clear search
          </button>
        </div>
      ) : null}
    </section>
  );
}