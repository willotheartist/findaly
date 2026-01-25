// app/my-listings/MyListingsClient.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useTransition } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Pause,
  Play,
  CheckCircle2,
  Clock,
  Ship,
  Package,
  Wrench,
  Briefcase,
  Sailboat,
  MapPin,
  MessageCircle,
  TrendingUp,
  Star,
  AlertCircle,
  ChevronDown,
  ExternalLink,
  Copy,
  Sparkles,
  Archive,
  RotateCcw,
  Loader2,
  Calendar,
  DollarSign,
  BarChart3,
  Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ListingKind = "VESSEL" | "PARTS" | "SERVICES" | "JOBS";
type ListingStatus = "DRAFT" | "LIVE" | "PAUSED" | "SOLD";
type ListingIntent = "SALE" | "CHARTER";

type ListingDTO = {
  id: string;
  slug: string;
  title: string;
  kind: ListingKind;
  intent: ListingIntent;
  status: ListingStatus;
  currency: string;
  priceCents: number | null;
  priceType: string;
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

type Props = {
  listings: ListingDTO[];
  stats: Stats;
  profileSlug: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ListingStatus,
  { label: string; color: string; bg: string; icon: typeof Play }
> = {
  DRAFT: { label: "Draft", color: "text-slate-600", bg: "bg-slate-100", icon: Clock },
  LIVE: { label: "Live", color: "text-emerald-700", bg: "bg-emerald-50", icon: Play },
  PAUSED: { label: "Paused", color: "text-amber-700", bg: "bg-amber-50", icon: Pause },
  SOLD: { label: "Sold", color: "text-sky-700", bg: "bg-sky-50", icon: CheckCircle2 },
};

const KIND_CONFIG: Record<ListingKind, { label: string; icon: typeof Ship }> = {
  VESSEL: { label: "Vessel", icon: Ship },
  PARTS: { label: "Parts", icon: Package },
  SERVICES: { label: "Service", icon: Wrench },
  JOBS: { label: "Job", icon: Briefcase },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatPrice(cents: number | null, currency: string = "EUR"): string {
  if (cents === null || cents <= 0) return "POA";
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateStr);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  accent = false,
}: {
  icon: typeof Ship;
  label: string;
  value: number | string;
  trend?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-2xl border p-5",
        accent
          ? "border-[#ff6a00]/20 bg-linear-to-br from-orange-50 to-white"
          : "border-slate-200/80 bg-white"
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cx(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            accent ? "bg-[#ff6a00]/10" : "bg-slate-100"
          )}
        >
          <Icon className={cx("h-5 w-5", accent ? "text-[#ff6a00]" : "text-slate-600")} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className={cx("text-2xl font-bold", accent ? "text-[#ff6a00]" : "text-slate-900")}>
          {value}
        </div>
        <div className="mt-0.5 text-sm text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ListingStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        config.bg,
        config.color
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function ListingCard({
  listing,
  onStatusChange,
  onDelete,
  isUpdating,
}: {
  listing: ListingDTO;
  onStatusChange: (id: string, status: ListingStatus) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const KindIcon = KIND_CONFIG[listing.kind].icon;

  const statusActions = useMemo(() => {
    const actions: { status: ListingStatus; label: string; icon: typeof Play }[] = [];

    if (listing.status === "DRAFT") {
      actions.push({ status: "LIVE", label: "Publish", icon: Play });
    }
    if (listing.status === "LIVE") {
      actions.push({ status: "PAUSED", label: "Pause", icon: Pause });
      actions.push({ status: "SOLD", label: "Mark as Sold", icon: CheckCircle2 });
    }
    if (listing.status === "PAUSED") {
      actions.push({ status: "LIVE", label: "Reactivate", icon: Play });
      actions.push({ status: "SOLD", label: "Mark as Sold", icon: CheckCircle2 });
    }
    if (listing.status === "SOLD") {
      actions.push({ status: "LIVE", label: "Relist", icon: RotateCcw });
    }

    return actions;
  }, [listing.status]);

  return (
    <div className="group relative flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-slate-100 to-slate-50 sm:h-28 sm:w-40">
        {listing.thumbnailUrl ? (
          <img
            src={listing.thumbnailUrl}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Sailboat className="h-10 w-10 text-slate-200" />
          </div>
        )}

        {/* Kind badge */}
        <div className="absolute bottom-2 left-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-700 backdrop-blur-sm">
            <KindIcon className="h-3 w-3" />
            {KIND_CONFIG[listing.kind].label}
          </span>
        </div>

        {/* Featured badge */}
        {listing.featured && (
          <div className="absolute right-2 top-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
              <Star className="h-3 w-3" />
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                {listing.title}
              </h3>
              <StatusBadge status={listing.status} />
            </div>

            <div className="mt-1 text-base font-bold text-[#ff6a00] sm:text-lg">
              {formatPrice(listing.priceCents, listing.currency)}
            </div>
          </div>

          {/* Actions menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                  <Link
                    href={`/buy/${listing.slug}`}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 no-underline hover:bg-slate-50"
                  >
                    <Eye className="h-4 w-4" />
                    View listing
                  </Link>
                  <Link
                    href={`/my-listings/${listing.id}/edit`}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 no-underline hover:bg-slate-50"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/buy/${listing.slug}`
                      );
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Copy className="h-4 w-4" />
                    Copy link
                  </button>

                  {statusActions.length > 0 && (
                    <>
                      <div className="my-1 border-t border-slate-100" />
                      {statusActions.map((action) => (
                        <button
                          key={action.status}
                          type="button"
                          onClick={() => {
                            onStatusChange(listing.id, action.status);
                            setShowMenu(false);
                          }}
                          disabled={isUpdating}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                          <action.icon className="h-4 w-4" />
                          {action.label}
                        </button>
                      ))}
                    </>
                  )}

                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this listing?")) {
                        onDelete(listing.id);
                      }
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          {listing.year && <span>{listing.year}</span>}
          {listing.lengthM && <span>{listing.lengthM}m</span>}
          {listing.brand && <span>{listing.brand}</span>}
          {listing.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-4 pt-3">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {listing.inquiriesCount} {listing.inquiriesCount === 1 ? "inquiry" : "inquiries"}
            </span>
            <span>Updated {getRelativeTime(listing.updatedAt)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/my-listings/${listing.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 no-underline transition-colors hover:bg-slate-200"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Link>
            <Link
              href={`/buy/${listing.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#ff6a00] px-3 py-1.5 text-xs font-medium text-white no-underline transition-colors hover:brightness-110"
            >
              <ExternalLink className="h-3 w-3" />
              View
            </Link>
          </div>
        </div>
      </div>

      {/* Updating overlay */}
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
          <Loader2 className="h-6 w-6 animate-spin text-[#ff6a00]" />
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <Ship className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">No listings yet</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Create your first listing and start selling on Findaly.
      </p>
      <Link
        href="/add-listing"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ff6a00] px-6 py-3 text-sm font-semibold text-white no-underline transition-all hover:brightness-110"
      >
        <Plus className="h-4 w-4" />
        Create your first listing
      </Link>
    </div>
  );
}

function FilteredEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Search className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-slate-900">No matching listings</h3>
      <p className="mt-1 text-sm text-slate-500">Try adjusting your filters.</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 text-sm font-medium text-[#ff6a00] hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

type FilterStatus = "all" | ListingStatus;
type FilterKind = "all" | ListingKind;

export default function MyListingsClient({ listings, stats, profileSlug }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [kindFilter, setKindFilter] = useState<FilterKind>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          listing.title.toLowerCase().includes(q) ||
          listing.brand?.toLowerCase().includes(q) ||
          listing.model?.toLowerCase().includes(q) ||
          listing.location?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Status
      if (statusFilter !== "all" && listing.status !== statusFilter) {
        return false;
      }

      // Kind
      if (kindFilter !== "all" && listing.kind !== kindFilter) {
        return false;
      }

      return true;
    });
  }, [listings, search, statusFilter, kindFilter]);

  const hasFilters = search || statusFilter !== "all" || kindFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setKindFilter("all");
  };

  // Status change handler
  const handleStatusChange = async (listingId: string, newStatus: ListingStatus) => {
    setUpdatingId(listingId);

    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      // Refresh the page data
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Error updating listing status:", error);
      alert("Failed to update listing status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete handler
  const handleDelete = async (listingId: string) => {
    setUpdatingId(listingId);

    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete listing");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete listing. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-50">
      {/* Header */}
      <section className="relative w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-orange-50/30">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#ff6a00]/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-sky-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="no-underline hover:text-slate-900">
              Home
            </Link>
            <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
            <span className="font-medium text-slate-900">My Listings</span>
          </nav>

          {/* Title row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                My Listings
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage, edit, and track your listings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/profile/${profileSlug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 no-underline shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                <Eye className="h-4 w-4" />
                View profile
              </Link>
              <Link
                href="/add-listing"
                className="inline-flex items-center gap-2 rounded-xl bg-[#ff6a00] px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-sm transition-all hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                New listing
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Ship}
              label="Active listings"
              value={stats.live}
              accent
            />
            <StatCard
              icon={MessageCircle}
              label="Total inquiries"
              value={stats.totalInquiries}
            />
            <StatCard
              icon={Clock}
              label="Drafts"
              value={stats.draft}
            />
            <StatCard
              icon={CheckCircle2}
              label="Sold"
              value={stats.sold}
            />
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          {listings.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Filters bar */}
              <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search listings..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-colors focus:border-slate-300 focus:bg-white"
                  />
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Status:</span>
                  <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
                    {(["all", "LIVE", "DRAFT", "PAUSED", "SOLD"] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={cx(
                          "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                          statusFilter === status
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        )}
                      >
                        {status === "all" ? "All" : STATUS_CONFIG[status].label}
                        {status !== "all" && (
                          <span className="ml-1 text-slate-400">
                            ({listings.filter((l) => l.status === status).length})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kind filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Type:</span>
                  <select
                    value={kindFilter}
                    onChange={(e) => setKindFilter(e.target.value as FilterKind)}
                    className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition-colors focus:border-slate-300"
                  >
                    <option value="all">All types</option>
                    <option value="VESSEL">Vessels</option>
                    <option value="PARTS">Parts</option>
                    <option value="SERVICES">Services</option>
                    <option value="JOBS">Jobs</option>
                  </select>
                </div>
              </div>

              {/* Results count */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Showing{" "}
                  <span className="font-semibold text-slate-900">{filteredListings.length}</span> of{" "}
                  <span className="font-semibold text-slate-900">{listings.length}</span> listings
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-medium text-[#ff6a00] hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* Listings */}
              {filteredListings.length > 0 ? (
                <div className="space-y-4">
                  {filteredListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                      isUpdating={updatingId === listing.id || isPending}
                    />
                  ))}
                </div>
              ) : (
                <FilteredEmptyState onClear={clearFilters} />
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}