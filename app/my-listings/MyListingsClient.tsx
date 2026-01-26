// app/my-listings/MyListingsClient.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Eye,
  BadgeCheck,
  Flame,
  MapPin,
  MessageCircle,
} from "lucide-react";

type ListingRow = {
  id: string;
  slug: string | null;
  title: string | null;
  kind: string;
  intent: string;
  status: "DRAFT" | "LIVE" | "PAUSED" | "SOLD" | string;
  currency: string | null;
  priceCents: number | null;
  priceType: string | null;
  location: string | null;
  country: string | null;
  year: number | null;
  lengthM: number | null;
  brand: string | null;
  model: string | null;
  boatCategory: string | null;
  featured: boolean;
  urgent: boolean;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl: string | null;
  inquiriesCount: number;
};

type Stats = {
  total: number;
  live: number;
  draft: number;
  paused: number;
  sold: number;
  featured: number;
  totalInquiries: number;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatPrice(currency: string | null, priceCents: number | null) {
  if (!priceCents || priceCents <= 0) return "POA";
  const value = priceCents / 100;

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency || "EUR"} ${Math.round(value).toLocaleString()}`;
  }
}

function statusPill(status: string) {
  const s = String(status).toUpperCase();
  if (s === "LIVE") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "DRAFT") return "bg-slate-50 text-slate-700 border-slate-200";
  if (s === "PAUSED") return "bg-amber-50 text-amber-800 border-amber-200";
  if (s === "SOLD") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export default function MyListingsClient({
  listings,
  stats,
  profileSlug,
}: {
  listings: ListingRow[];
  stats: Stats;
  profileSlug: string;
}) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<
    "ALL" | "LIVE" | "DRAFT" | "PAUSED" | "SOLD"
  >("ALL");

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();

    return listings.filter((l) => {
      if (filter !== "ALL" && String(l.status).toUpperCase() !== filter) return false;

      if (!query) return true;
      const hay = [
        l.title,
        l.brand,
        l.model,
        l.location,
        l.country,
        l.boatCategory,
        l.kind,
        l.intent,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(query);
    });
  }, [listings, q, filter]);

  return (
    <main className="min-h-screen w-full bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              My listings
            </h1>
            <p className="mt-0.5 text-sm text-slate-600">
              Manage your listings, edit details, and track inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/add-listing"
              className="inline-flex items-center gap-2 rounded-xl bg-[#ff6a00] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              Add listing
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Stats */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500">Total</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500">Live</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.live}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500">Draft</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.draft}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500">Paused</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.paused}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500">Sold</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.sold}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500">Inquiries</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {stats.totalInquiries}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, brand, location..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#ff6a00] sm:w-80"
            />

            <div className="flex flex-wrap gap-2">
              {(["ALL", "LIVE", "DRAFT", "PAUSED", "SOLD"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(k)}
                  className={cx(
                    "rounded-full border px-3 py-1.5 text-sm font-semibold transition-all",
                    filter === k
                      ? "border-[#ff6a00] bg-orange-50 text-[#ff6a00]"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
            <div className="col-span-6">Listing</div>
            <div className="col-span-2 hidden sm:block">Status</div>
            <div className="col-span-2 hidden sm:block">Price</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="text-sm font-semibold text-slate-900">No listings found</div>
              <div className="mt-1 text-sm text-slate-600">
                Try a different search or create a new listing.
              </div>
              <div className="mt-4">
                <Link
                  href="/add-listing"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#ff6a00] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110"
                >
                  <Plus className="h-4 w-4" />
                  Add listing
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filtered.map((l) => {
                const viewHref = l.slug ? `/buy/${l.slug}` : null;
                const editHref = `/my-listings/${l.id}/edit`;

                return (
                  <div key={l.id} className="grid grid-cols-12 items-center gap-3 px-4 py-4">
                    {/* Listing cell */}
                    <div className="col-span-10 sm:col-span-6">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                          {l.thumbnailUrl ? (
                            <Image
                              src={l.thumbnailUrl}
                              alt={l.title || "Listing photo"}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-400">
                              No photo
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="truncate text-sm font-bold text-slate-900">
                              {l.title || "Untitled listing"}
                            </div>
                            {l.featured && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                <BadgeCheck className="h-3.5 w-3.5" />
                                Featured
                              </span>
                            )}
                            {l.urgent && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                                <Flame className="h-3.5 w-3.5" />
                                Urgent
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                            {(l.brand || l.model) && (
                              <span className="truncate">
                                {[l.brand, l.model].filter(Boolean).join(" ")}
                              </span>
                            )}
                            {(l.year || l.lengthM) && (
                              <span className="truncate">
                                {[l.year ? String(l.year) : null, l.lengthM ? `${l.lengthM}m` : null]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                            )}
                            {(l.location || l.country) && (
                              <span className="inline-flex items-center gap-1 truncate">
                                <MapPin className="h-3.5 w-3.5" />
                                {[l.location, l.country].filter(Boolean).join(", ")}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <MessageCircle className="h-3.5 w-3.5" />
                              {l.inquiriesCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-5 hidden sm:col-span-2 sm:block">
                      <span
                        className={cx(
                          "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                          statusPill(l.status)
                        )}
                      >
                        {String(l.status).toUpperCase()}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="col-span-3 hidden sm:col-span-2 sm:block">
                      <div className="text-sm font-bold text-slate-900">
                        {formatPrice(l.currency, l.priceCents)}
                      </div>
                      <div className="text-xs text-slate-600">
                        {l.intent === "CHARTER" ? "Charter" : "Sale"}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex justify-end gap-2">
                      {viewHref ? (
                        <Link
                          href={viewHref}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">View</span>
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-400">
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">View</span>
                        </span>
                      )}

                      <Link
                        href={editHref}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#ff6a00] px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Small footer note */}
        <div className="mt-4 text-xs text-slate-500">
          Signed in as <span className="font-semibold text-slate-700">{profileSlug}</span>
        </div>
      </div>
    </main>
  );
}
