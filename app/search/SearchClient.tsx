"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";

type ListingHit = {
  id: string;
  slug: string;
  title: string;
  country?: string | null;
  location?: string | null;
  currency?: string | null;
  priceCents?: number | null;
  year?: number | null;
  lengthM?: number | null;
  image?: string | null;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

function fmtPrice(priceCents?: number | null, cur?: string | null) {
  if (!priceCents || priceCents <= 0) return "POA";
  const c = (cur || "EUR").toUpperCase();
  const sym = c === "GBP" ? "£" : c === "USD" ? "$" : c === "AED" ? "AED " : "€";
  const n = Math.round(priceCents / 100);
  return `${sym}${n.toLocaleString("en")}`;
}

export default function SearchClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const initialQ = (sp.get("q") || "").trim();

  const [q, setQ] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ListingHit[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canSearch = q.trim().length >= 2;

  async function runSearch(query: string, signal?: AbortSignal) {
    const qq = query.trim();
    if (qq.length < 2) {
      setRows([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const url = `/api/listings?q=${encodeURIComponent(qq)}&take=24`;

    const res = await fetch(url, { method: "GET", signal }).catch((e) => {
      if (e instanceof DOMException && e.name === "AbortError") return null;
      throw e;
    });

    if (!res) return;

    const data: unknown = await res.json().catch(() => ({}));
    const obj = isRecord(data) ? data : {};

    if (!res.ok) {
      setError(String(obj.error ?? "SEARCH_FAILED"));
      setRows([]);
      setLoading(false);
      return;
    }

    // Accept either { listings: [...] } or { items: [...] }
    const raw = (obj.listings ?? obj.items) as unknown;
    const items = Array.isArray(raw) ? (raw as ListingHit[]) : [];

    setRows(items);
    setLoading(false);
  }

  // initial load from URL
  useEffect(() => {
    const controller = new AbortController();
    const t = window.setTimeout(() => void runSearch(initialQ, controller.signal), 0);

    return () => {
      window.clearTimeout(t);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce when typing
  useEffect(() => {
    const controller = new AbortController();
    const t = window.setTimeout(() => {
      void runSearch(q, controller.signal);
      // keep URL in sync
      const qq = q.trim();
      const next = qq ? `/search?q=${encodeURIComponent(qq)}` : "/search";
      router.replace(next);
    }, 300);

    return () => {
      window.clearTimeout(t);
      controller.abort();
    };
  }, [q, router]);

  const title = useMemo(() => {
    if (!canSearch) return "Search";
    if (loading) return "Searching…";
    return `${rows.length} result${rows.length === 1 ? "" : "s"}`;
  }, [canSearch, loading, rows.length]);

  return (
    <main className="w-full bg-white">
      <section className="relative w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-orange-50/30">
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-4 text-sm text-slate-600">
            <Link href="/" className="no-underline hover:text-slate-900">
              Home
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-semibold text-slate-900">Search</span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {title}
              </h1>
              <div className="mt-2 text-sm text-slate-600">
                Type at least 2 characters to search listings.
              </div>
            </div>

            <Link
              href="/buy"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:brightness-110"
            >
              Browse
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-200">
                <Search className="h-4 w-4" />
              </div>

              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by brand, model, location…"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-slate-300"
              />

              {q.trim().length > 0 ? (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:border-slate-300"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              ) : null}
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                {error}
              </div>
            ) : null}

            {!canSearch ? (
              <div className="mt-4 text-sm text-slate-600">
                Try: <span className="font-semibold">Beneteau</span>,{" "}
                <span className="font-semibold">Lagoon 42</span>,{" "}
                <span className="font-semibold">Croatia</span>
              </div>
            ) : loading ? (
              <div className="mt-4 text-sm text-slate-600">Loading…</div>
            ) : rows.length === 0 ? (
              <div className="mt-4 text-sm text-slate-600">No results.</div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((it) => (
                  <Link
                    key={it.id}
                    href={`/buy/${it.slug}`}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white no-underline shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={it.image || "/hero-buy.jpg"}
                        alt={it.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="p-5">
                      <div className="text-lg font-bold tracking-tight text-slate-900">
                        {fmtPrice(it.priceCents, it.currency)}
                      </div>

                      <div className="mt-1 text-sm text-slate-600">
                        {[it.location, it.country].filter(Boolean).join(", ") || "—"}
                      </div>

                      <div className="mt-2 line-clamp-2 text-[15px] font-semibold text-slate-900">
                        {it.title}
                      </div>

                      <div className="mt-3 text-xs text-slate-500">
                        {[it.year ? String(it.year) : null, it.lengthM ? `${it.lengthM}m` : null]
                          .filter(Boolean)
                          .join(" • ") || " "}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}