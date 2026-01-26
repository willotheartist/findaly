// app/my-listings/MyListingsClient.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Eye,
  BadgeCheck,
  Flame,
  MapPin,
  MessageCircle,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Clock,
  Archive,
  CheckCircle2,
  Sailboat,
  Trash2,
  Copy,
  Pause,
  Play,
  ExternalLink,
  Calendar,
  Anchor,
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
  if (!priceCents || priceCents <= 0) return "Price on request";
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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

const STATUS_CONFIG = {
  LIVE: {
    label: "Live",
    bg: "bg-emerald-500",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    lightBg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  DRAFT: {
    label: "Draft",
    bg: "bg-slate-400",
    dot: "bg-slate-400",
    text: "text-slate-600",
    lightBg: "bg-slate-50",
    border: "border-slate-200",
    icon: Clock,
  },
  PAUSED: {
    label: "Paused",
    bg: "bg-amber-500",
    dot: "bg-amber-500",
    text: "text-amber-700",
    lightBg: "bg-amber-50",
    border: "border-amber-200",
    icon: Pause,
  },
  SOLD: {
    label: "Sold",
    bg: "bg-rose-500",
    dot: "bg-rose-500",
    text: "text-rose-700",
    lightBg: "bg-rose-50",
    border: "border-rose-200",
    icon: Archive,
  },
} as const;

function getStatusConfig(status: string) {
  const s = String(status).toUpperCase() as keyof typeof STATUS_CONFIG;
  return STATUS_CONFIG[s] || STATUS_CONFIG.DRAFT;
}

// Dropdown menu component
function ListingMenu({
  listing,
  onClose,
}: {
  listing: ListingRow;
  onClose: () => void;
}) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const viewHref = listing.slug ? `/buy/${listing.slug}` : null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full z-50 mt-1 w-48 origin-top-right animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-200/50">
        {viewHref && (
          <Link
            href={viewHref}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            onClick={onClose}
          >
            <ExternalLink className="h-4 w-4 text-slate-400" />
            View listing
          </Link>
        )}
        <Link
          href={`/my-listings/${listing.id}/edit`}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
          onClick={onClose}
        >
          <Pencil className="h-4 w-4 text-slate-400" />
          Edit listing
        </Link>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
          onClick={onClose}
        >
          <Copy className="h-4 w-4 text-slate-400" />
          Duplicate
        </button>
        <div className="my-1.5 h-px bg-slate-100" />
        {listing.status === "LIVE" ? (
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-amber-600 transition-colors hover:bg-amber-50"
            onClick={onClose}
          >
            <Pause className="h-4 w-4" />
            Pause listing
          </button>
        ) : listing.status === "PAUSED" ? (
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-emerald-600 transition-colors hover:bg-emerald-50"
            onClick={onClose}
          >
            <Play className="h-4 w-4" />
            Reactivate
          </button>
        ) : null}
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50"
          onClick={onClose}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}

// Single listing card component
function ListingCard({
  listing,
  viewMode,
}: {
  listing: ListingRow;
  viewMode: "grid" | "list";
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const statusConfig = getStatusConfig(listing.status);
  const StatusIcon = statusConfig.icon;
  const viewHref = listing.slug ? `/buy/${listing.slug}` : null;
  const editHref = `/my-listings/${listing.id}/edit`;

  if (viewMode === "grid") {
    return (
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50">
        {/* Image */}
        <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-slate-100 to-slate-50">
          {listing.thumbnailUrl ? (
            <Image
              src={listing.thumbnailUrl}
              alt={listing.title || "Listing"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Sailboat className="h-10 w-10 text-slate-300" />
              <span className="text-xs font-medium text-slate-400">No photo</span>
            </div>
          )}

          {/* Status badge overlay */}
          <div className="absolute left-3 top-3">
            <div
              className={cx(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm",
                statusConfig.lightBg,
                statusConfig.text,
                "border",
                statusConfig.border
              )}
            >
              <span
                className={cx("h-1.5 w-1.5 rounded-full", statusConfig.dot)}
              />
              {statusConfig.label}
            </div>
          </div>

          {/* Badges */}
          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            {listing.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#ff6a00]/20 bg-[#ff6a00] px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
                <BadgeCheck className="h-3 w-3" />
                Featured
              </span>
            )}
            {listing.urgent && (
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-500 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
                <Flame className="h-3 w-3" />
                Urgent
              </span>
            )}
          </div>

          {/* Quick actions overlay */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-linear-to-t from-black/60 via-black/30 to-transparent p-4 pt-10 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            {viewHref && (
              <Link
                href={viewHref}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2 text-xs font-semibold text-slate-900 backdrop-blur-sm transition-colors hover:bg-white"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </Link>
            )}
            <Link
              href={editHref}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#ff6a00] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#e55f00]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & menu */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">
              {listing.title || "Untitled listing"}
            </h3>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {menuOpen && (
                <ListingMenu listing={listing} onClose={() => setMenuOpen(false)} />
              )}
            </div>
          </div>

          {/* Brand/Model */}
          {(listing.brand || listing.model) && (
            <p className="mt-1 line-clamp-1 text-xs text-slate-500">
              {[listing.brand, listing.model].filter(Boolean).join(" ")}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            {listing.year && <span>{listing.year}</span>}
            {listing.lengthM && <span>{listing.lengthM}m</span>}
            {(listing.location || listing.country) && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {[listing.location, listing.country].filter(Boolean).join(", ")}
              </span>
            )}
          </div>

          {/* Price & inquiries */}
          <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
            <div>
              <div className="text-lg font-bold text-slate-900">
                {formatPrice(listing.currency, listing.priceCents)}
              </div>
              <div className="text-xs text-slate-500">
                {listing.intent === "CHARTER" ? "Charter" : "For sale"}
              </div>
            </div>
            {listing.inquiriesCount > 0 && (
              <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                <MessageCircle className="h-3.5 w-3.5" />
                {listing.inquiriesCount}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100">
      {/* Thumbnail */}
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-slate-100 to-slate-50">
        {listing.thumbnailUrl ? (
          <Image
            src={listing.thumbnailUrl}
            alt={listing.title || "Listing"}
            fill
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sailboat className="h-8 w-8 text-slate-300" />
          </div>
        )}
        {/* Status dot */}
        <div className="absolute bottom-2 left-2">
          <span
            className={cx(
              "inline-flex h-5 w-5 items-center justify-center rounded-full",
              statusConfig.bg
            )}
          >
            <StatusIcon className="h-3 w-3 text-white" />
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {listing.title || "Untitled listing"}
              </h3>
              {listing.featured && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ff6a00] px-2 py-0.5 text-[10px] font-semibold text-white">
                  <BadgeCheck className="h-3 w-3" />
                  Featured
                </span>
              )}
              {listing.urgent && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                  <Flame className="h-3 w-3" />
                  Urgent
                </span>
              )}
            </div>
            {(listing.brand || listing.model) && (
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {[listing.brand, listing.model].filter(Boolean).join(" ")}
              </p>
            )}
          </div>

          {/* Status pill */}
          <div
            className={cx(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
              statusConfig.lightBg,
              statusConfig.text,
              "border",
              statusConfig.border
            )}
          >
            <span className={cx("h-1.5 w-1.5 rounded-full", statusConfig.dot)} />
            {statusConfig.label}
          </div>
        </div>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          {(listing.year || listing.lengthM) && (
            <span className="inline-flex items-center gap-1">
              <Anchor className="h-3 w-3" />
              {[listing.year, listing.lengthM ? `${listing.lengthM}m` : null]
                .filter(Boolean)
                .join(" · ")}
            </span>
          )}
          {(listing.location || listing.country) && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {[listing.location, listing.country].filter(Boolean).join(", ")}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {listing.inquiriesCount} inquiries
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Updated {formatDate(listing.updatedAt)}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right">
        <div className="text-base font-bold text-slate-900">
          {formatPrice(listing.currency, listing.priceCents)}
        </div>
        <div className="text-xs text-slate-500">
          {listing.intent === "CHARTER" ? "Charter" : "For sale"}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {viewHref && (
          <Link
            href={viewHref}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Link>
        )}
        <Link
          href={editHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#ff6a00] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#e55f00]"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <ListingMenu listing={listing} onClose={() => setMenuOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
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
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<
    "ALL" | "LIVE" | "DRAFT" | "PAUSED" | "SOLD"
  >("ALL");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();

    return listings.filter((l) => {
      if (filter !== "ALL" && String(l.status).toUpperCase() !== filter)
        return false;

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

  const filterCounts = React.useMemo(
    () => ({
      ALL: listings.length,
      LIVE: stats.live,
      DRAFT: stats.draft,
      PAUSED: stats.paused,
      SOLD: stats.sold,
    }),
    [listings.length, stats]
  );

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Header section */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                My listings
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your listings, track performance, and respond to inquiries
              </p>
            </div>
            <Link
              href="/add-listing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6a00] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition-all hover:bg-[#e55f00] hover:shadow-md hover:shadow-orange-200"
            >
              <Plus className="h-4 w-4" />
              Create listing
            </Link>
          </div>

          {/* Stats cards */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Sailboat className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats.total}
                  </div>
                  <div className="text-xs font-medium text-slate-500">Total</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats.live}
                  </div>
                  <div className="text-xs font-medium text-emerald-600">Live</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Clock className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats.draft}
                  </div>
                  <div className="text-xs font-medium text-slate-500">Drafts</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <Pause className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats.paused}
                  </div>
                  <div className="text-xs font-medium text-slate-500">Paused</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                  <Archive className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats.sold}
                  </div>
                  <div className="text-xs font-medium text-slate-500">Sold</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ff6a00]/20 bg-orange-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff6a00]/10">
                  <MessageCircle className="h-5 w-5 text-[#ff6a00]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats.totalInquiries}
                  </div>
                  <div className="text-xs font-medium text-[#ff6a00]">
                    Inquiries
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search your listings..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#ff6a00] focus:ring-2 focus:ring-[#ff6a00]/10"
              />
            </div>

            {/* Filter tabs & view toggle */}
            <div className="flex items-center gap-3">
              {/* Status filters */}
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                {(["ALL", "LIVE", "DRAFT", "PAUSED", "SOLD"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setFilter(k)}
                    className={cx(
                      "relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                      filter === k
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {k === "ALL" ? "All" : k.charAt(0) + k.slice(1).toLowerCase()}
                    <span
                      className={cx(
                        "ml-1.5 tabular-nums",
                        filter === k ? "text-slate-500" : "text-slate-400"
                      )}
                    >
                      {filterCounts[k]}
                    </span>
                  </button>
                ))}
              </div>

              {/* View toggle */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cx(
                    "rounded-lg p-2 transition-all",
                    viewMode === "grid"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                  title="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={cx(
                    "rounded-lg p-2 transition-all",
                    viewMode === "list"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Sailboat className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">
              No listings found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {q
                ? "Try adjusting your search or filters"
                : "Get started by creating your first listing"}
            </p>
            <Link
              href="/add-listing"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ff6a00] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#e55f00]"
            >
              <Plus className="h-4 w-4" />
              Create listing
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} viewMode="list" />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            Showing {filtered.length} of {listings.length} listings
          </p>
          <p className="text-xs text-slate-400">
            Signed in as{" "}
            <Link
              href={`/profile/${profileSlug}`}
              className="font-medium text-slate-600 hover:text-[#ff6a00]"
            >
              {profileSlug}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}