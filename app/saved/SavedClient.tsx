// app/saved/SavedClient.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Heart, LogIn, Trash2 } from "lucide-react";

type ListingMedia = {
  id: string;
  url: string;
  sort: number;
};

type ListingProfile = {
  slug: string;
  name: string;
  isVerified: boolean;
  location: string | null;
};

type Listing = {
  id: string;
  slug: string;
  title: string;
  intent: string;
  status: string;
  priceCents: number | null;
  currency: string;
  year: number | null;
  lengthM: number | null;
  country: string | null;
  location: string | null;
  brand: string | null;
  model: string | null;
  media: ListingMedia[];
  profile: ListingProfile;
};

type SavedRow = {
  id: string;
  createdAt: string;
  listingId: string;
  listing: Listing;
};

function formatPrice(priceCents: number | null, currency: string) {
  if (priceCents == null) return "Price on application";
  const amount = priceCents / 100;

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency === "OTHER" ? "EUR" : currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${Math.round(amount).toLocaleString()} ${currency}`;
  }
}

function metaLine(l: Listing) {
  const bits: string[] = [];
  if (l.year) bits.push(String(l.year));
  if (l.lengthM) bits.push(`${l.lengthM.toFixed(1)} m`);
  if (l.brand) bits.push(l.brand);
  if (l.model) bits.push(l.model);
  return bits.join(" • ");
}

export default function SavedClient() {
  const [loading, setLoading] = useState(true);
  const [unauth, setUnauth] = useState(false);
  const [rows, setRows] = useState<SavedRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load(signal?: AbortSignal) {
    setLoading(true);
    setError(null);
    setUnauth(false);

    const res = await fetch("/api/saved", { method: "GET", signal }).catch((e) => {
      if (e instanceof DOMException && e.name === "AbortError") return null;
      throw e;
    });

    if (!res) return;

    if (res.status === 401) {
      setUnauth(true);
      setRows([]);
      setLoading(false);
      return;
    }

    const data: unknown = await res.json().catch(() => ({}));
    const obj = data && typeof data === "object" ? (data as Record<string, unknown>) : {};

    if (!res.ok) {
      setError(String(obj?.error ?? "FAILED_TO_LOAD"));
      setRows([]);
      setLoading(false);
      return;
    }

    const saved = Array.isArray(obj?.saved) ? (obj.saved as SavedRow[]) : [];
    setRows(saved);
    setLoading(false);
  }

  useEffect(() => {
    const controller = new AbortController();
    const t = window.setTimeout(() => {
      void load(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(t);
      controller.abort();
    };
  }, []);

  const hasRows = rows.length > 0;

  const emptyState = useMemo(() => {
    if (unauth) {
      return {
        title: "Sign in to view saved listings",
        desc: "Saved listings are tied to your account, so they sync across devices.",
        ctaHref: "/login",
        ctaLabel: "Sign in",
        ctaIcon: LogIn,
      };
    }
    return {
      title: "No saved listings yet",
      desc: "Browse boats and tap the heart to save your favourites.",
      ctaHref: "/buy",
      ctaLabel: "Browse boats",
      ctaIcon: ArrowRight,
    };
  }, [unauth]);

  async function onRemove(listingId: string) {
    // toggle off
    const res = await fetch("/api/saved", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listingId }),
    });

    if (!res.ok) {
      const data: unknown = await res.json().catch(() => ({}));
      const obj = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
      alert(String(obj?.error ?? "REMOVE_FAILED"));
      return;
    }

    setRows((prev) => prev.filter((r) => r.listingId !== listingId));
  }

  return (
    <main className="w-full bg-white">
      <section className="relative w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-rose-50/30">
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-4 text-sm text-slate-600">
            <Link href="/" className="no-underline hover:text-slate-900">
              Home
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-semibold text-slate-900">Saved</span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Saved listings
              </h1>
              <div className="mt-2 text-sm text-slate-600">
                {unauth
                  ? "Sign in to access your saved listings."
                  : hasRows
                    ? `${rows.length} saved listing${rows.length === 1 ? "" : "s"}`
                    : "Save boats you like so you can compare later."}
              </div>
            </div>

            <Link
              href="/buy"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff6a00] px-5 py-3 text-sm font-semibold text-white no-underline hover:brightness-110"
            >
              <Heart className="h-4 w-4" />
              Browse boats
            </Link>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                Loading…
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700">
                {error}
              </div>
            ) : !hasRows ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <div className="text-lg font-bold text-slate-900">{emptyState.title}</div>
                <div className="mt-2 text-sm text-slate-600">{emptyState.desc}</div>

                <Link
                  href={emptyState.ctaHref}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:brightness-110"
                >
                  <emptyState.ctaIcon className="h-4 w-4" />
                  {emptyState.ctaLabel}
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((r) => {
                  const l = r.listing;
                  const img = l.media?.[0]?.url || "/hero-buy.jpg";
                  const href = `/buy/${l.slug}`;

                  return (
                    <div
                      key={r.id}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                    >
                      <Link href={href} className="block no-underline">
                        <div className="relative aspect-16/10 w-full bg-slate-100">
                          <Image
                            src={img}
                            alt={l.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      </Link>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={href}
                              className="block truncate text-base font-bold text-slate-900 no-underline hover:text-slate-950"
                            >
                              {l.title}
                            </Link>
                            <div className="mt-1 truncate text-sm text-slate-600">
                              {metaLine(l) || (l.country ?? l.location ?? "—")}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemove(l.id)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
                            aria-label="Remove from saved"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4 text-slate-500" />
                          </button>
                        </div>

                        <div className="mt-3 text-sm font-semibold text-slate-900">
                          {formatPrice(l.priceCents, l.currency)}
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-2">
                          <div className="truncate text-xs text-slate-600">
                            {l.profile?.name ? (
                              <span>
                                Listed by{" "}
                                <Link
                                  href={`/profile/${l.profile.slug}`}
                                  className="font-semibold text-slate-900 no-underline hover:underline"
                                >
                                  {l.profile.name}
                                </Link>
                                {l.profile.isVerified ? (
                                  <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                    Verified
                                  </span>
                                ) : null}
                              </span>
                            ) : null}
                          </div>

                          <Link
                            href={href}
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white no-underline hover:brightness-110"
                          >
                            View
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}