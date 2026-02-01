"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Destination } from "@/components/destinations/destinations.data";

export default function DestinationSearchClient({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const results = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return destinations
      .filter((d) => {
        const hay = `${d.name} ${d.country} ${d.region} ${d.vibeTags.join(" ")}`.toLowerCase();
        return hay.includes(query);
      })
      .slice(0, 8);
  }, [q, destinations]);

  return (
    <div className="relative">
      <div className="relative w-full">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // small delay so clicks register
            window.setTimeout(() => setOpen(false), 120);
          }}
          placeholder="Search city, country, vibe…"
          className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-slate-300"
        />
        <div className="absolute right-1.5 top-1.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#F56462] text-white">
          <Search className="h-4 w-4" />
        </div>
      </div>

      {open && q.trim() && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_30px_90px_rgba(2,6,23,0.14)]">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-600">
              No matches. Try “Italy”, “Islands”, “Luxury”…
            </div>
          ) : (
            <div className="grid">
              {results.map((d) => (
                <Link
                  key={d.slug}
                  href={`/destinations/${d.slug}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-slate-800 no-underline hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-900">{d.name}</div>
                    <div className="truncate text-xs text-slate-600">
                      {d.country} • {d.region}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">
                    View
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
