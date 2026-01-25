// /app/profile/[slug]/ProfilePageClient.tsx
"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  BadgeCheck,
  MapPin,
  Globe,
  Mail,
  Phone,
  Calendar,
  Clock,
  MessageCircle,
  Ship,
  Wrench,
  Briefcase,
  Package,
  ChevronRight,
  Star,
  Heart,
  Share2,
  Flag,
  Shield,
  Award,
  CheckCircle2,
  XCircle,
  Grid3X3,
  List,
  SortAsc,
  Sailboat,
  Building2,
  User,
  ExternalLink,
  Zap,
  ThumbsUp,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ListingKind = "VESSEL" | "PARTS" | "SERVICES" | "JOBS";
type ListingStatus = "DRAFT" | "LIVE" | "PAUSED" | "SOLD";

type ListingDTO = {
  id: string;
  slug: string;
  title: string;
  kind: ListingKind;
  status: ListingStatus;
  priceCents: number | null;
  currency: string;
  location: string | null;
  country: string | null;
  year: number | null;
  lengthM: number | null;
  brand: string | null;
  model: string | null;
  boatCategory: string | null;
  featured: boolean;
  createdAt: string;
  thumbnailUrl: string | null;
};

type ProfileData = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  location: string | null;
  about: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;

  // ✅ NEW (from Prisma)
  avatarUrl: string | null;
  companyLogoUrl: string | null;

  isVerified: boolean;
  createdAt: string;
  accountType: string;
  stats: {
    totalListings: number;
    liveListings: number;
    soldListings: number;
    totalViews: number;
    responseRate: number;
    avgResponseTime: string;
  };
  listings: ListingDTO[];
};

type Props = {
  profile: ProfileData;
  isOwner: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatPrice(cents: number | null, currency: string = "EUR"): string {
  if (cents === null) return "Price on request";
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
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
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function getMemberDuration(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears >= 1) {
    return `${diffYears} year${diffYears > 1 ? "s" : ""}`;
  }
  if (diffMonths >= 1) {
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
  }
  return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
}

const kindIcons: Record<ListingKind, typeof Ship> = {
  VESSEL: Ship,
  PARTS: Package,
  SERVICES: Wrench,
  JOBS: Briefcase,
};

const kindLabels: Record<ListingKind, string> = {
  VESSEL: "Vessels",
  PARTS: "Parts & Equipment",
  SERVICES: "Services",
  JOBS: "Jobs",
};

const statusColors: Record<ListingStatus, { bg: string; text: string; dot: string }> = {
  DRAFT: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  LIVE: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  PAUSED: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  SOLD: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  accent = false,
}: {
  icon: typeof Star;
  label: string;
  value: string | number;
  subtext?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-md",
        accent
          ? "border-[#ff6a00]/20 bg-linear-to-br from-orange-50 to-white"
          : "border-slate-200/80 bg-white"
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cx(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            accent ? "bg-[#ff6a00]/10" : "bg-slate-100"
          )}
        >
          <Icon className={cx("h-5 w-5", accent ? "text-[#ff6a00]" : "text-slate-600")} />
        </div>
      </div>
      <div className="mt-4">
        <div className={cx("text-2xl font-bold", accent ? "text-[#ff6a00]" : "text-slate-900")}>
          {value}
        </div>
        <div className="mt-0.5 text-sm font-medium text-slate-600">{label}</div>
        {subtext && <div className="mt-1 text-xs text-slate-400">{subtext}</div>}
      </div>
    </div>
  );
}

function ListingCard({ listing, isOwner }: { listing: ListingDTO; isOwner: boolean }) {
  const Icon = kindIcons[listing.kind];
  const statusStyle = statusColors[listing.status];

  return (
    <Link
      href={`/buy/${listing.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white no-underline transition-all hover:border-slate-300 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-slate-100 to-slate-50">
        {listing.thumbnailUrl ? (
          <img
            src={listing.thumbnailUrl}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Sailboat className="h-16 w-16 text-slate-200" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {listing.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              <Star className="h-3 w-3" />
              Featured
            </span>
          )}
          {isOwner && (
            <span
              className={cx(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
                statusStyle.bg,
                statusStyle.text
              )}
            >
              <span className={cx("h-1.5 w-1.5 rounded-full", statusStyle.dot)} />
              {listing.status.charAt(0) + listing.status.slice(1).toLowerCase()}
            </span>
          )}
        </div>

        {/* Kind badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm">
            <Icon className="h-3 w-3" />
            {listing.kind.charAt(0) + listing.kind.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-[#ff6a00]">
          {listing.title}
        </h3>

        {/* Meta info */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          {listing.year && <span>{listing.year}</span>}
          {listing.lengthM && <span>{listing.lengthM}m</span>}
          {listing.brand && <span>{listing.brand}</span>}
        </div>

        {listing.location && (
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3 w-3" />
            <span className="truncate">
              {listing.location}
              {listing.country && `, ${listing.country}`}
            </span>
          </div>
        )}

        {/* Price + date */}
        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between">
            <span className="text-lg font-bold text-[#ff6a00]">
              {formatPrice(listing.priceCents, listing.currency)}
            </span>
            <span className="text-xs text-slate-400">{getRelativeTime(listing.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ kind, isOwner }: { kind: string | null; isOwner: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <Ship className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        {kind ? `No ${kindLabels[kind as ListingKind]?.toLowerCase() || "listings"}` : "No listings"}{" "}
        yet
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {isOwner
          ? "Start selling by creating your first listing."
          : "This seller hasn't listed anything in this category yet."}
      </p>
      {isOwner && (
        <Link
          href="/add-listing"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#ff6a00] px-5 py-2.5 text-sm font-semibold text-white no-underline transition-all hover:brightness-110"
        >
          <Zap className="h-4 w-4" />
          Create listing
        </Link>
      )}
    </div>
  );
}

function ContactCard({ profile }: { profile: ProfileData }) {
  const [showPhone, setShowPhone] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-5 py-4">
        <h3 className="font-semibold text-slate-900">Contact {profile.name}</h3>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          {profile.phone && (
            <button
              type="button"
              onClick={() => setShowPhone(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              <Phone className="h-4 w-4" />
              {showPhone ? profile.phone : "Show phone number"}
            </button>
          )}

          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 no-underline transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              <Mail className="h-4 w-4" />
              Send email
            </a>
          )}

          <button
            type="button"
            onClick={() => setMessageSent(true)}
            disabled={messageSent}
            className={cx(
              "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all",
              messageSent ? "bg-emerald-500" : "bg-[#ff6a00] hover:brightness-110"
            )}
          >
            <MessageCircle className="h-4 w-4" />
            {messageSent ? "Message sent!" : "Send message"}
          </button>
        </div>

        {profile.website && (
          <a
            href={profile.website}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 no-underline hover:text-[#ff6a00]"
          >
            <Globe className="h-4 w-4" />
            <span className="truncate">{profile.website.replace(/^https?:\/\//, "")}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function TrustIndicators({ profile }: { profile: ProfileData }) {
  const indicators = [
    {
      icon: BadgeCheck,
      label: "Identity verified",
      active: profile.isVerified,
    },
    {
      icon: Mail,
      label: "Email verified",
      active: !!profile.email,
    },
    {
      icon: Phone,
      label: "Phone verified",
      active: !!profile.phone,
    },
    {
      icon: Clock,
      label: "Active seller",
      active: profile.stats.liveListings > 0,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-5 py-4">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900">
          <Shield className="h-4 w-4 text-slate-400" />
          Trust & Safety
        </h3>
      </div>

      <div className="divide-y divide-slate-100">
        {indicators.map((item) => (
          <div key={item.label} className="flex items-center gap-3 px-5 py-3">
            <div
              className={cx(
                "flex h-8 w-8 items-center justify-center rounded-full",
                item.active ? "bg-emerald-50" : "bg-slate-100"
              )}
            >
              {item.active ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 text-slate-400" />
              )}
            </div>
            <span
              className={cx(
                "text-sm font-medium",
                item.active ? "text-slate-900" : "text-slate-400"
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

type TabId = "all" | "VESSEL" | "PARTS" | "SERVICES" | "JOBS" | "sold";
type ViewMode = "grid" | "list";
type SortOption = "newest" | "price-asc" | "price-desc";

export default function ProfilePageClient({ profile, isOwner }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Compute listings by category
  const listingsByKind = useMemo(() => {
    const result: Record<ListingKind | "sold", ListingDTO[]> = {
      VESSEL: [],
      PARTS: [],
      SERVICES: [],
      JOBS: [],
      sold: [],
    };

    for (const listing of profile.listings) {
      if (listing.status === "SOLD") {
        result.sold.push(listing);
      } else if (listing.status === "LIVE" || isOwner) {
        result[listing.kind].push(listing);
      }
    }

    return result;
  }, [profile.listings, isOwner]);

  // Filtered and sorted listings
  const displayedListings = useMemo(() => {
    let list: ListingDTO[];

    if (activeTab === "all") {
      list = profile.listings.filter((l) => l.status === "LIVE" || isOwner);
    } else if (activeTab === "sold") {
      list = listingsByKind.sold;
    } else {
      list = listingsByKind[activeTab];
    }

    // Sort
    return [...list].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "price-asc") {
        return (a.priceCents ?? 0) - (b.priceCents ?? 0);
      }
      if (sortBy === "price-desc") {
        return (b.priceCents ?? 0) - (a.priceCents ?? 0);
      }
      return 0;
    });
  }, [profile.listings, activeTab, sortBy, listingsByKind, isOwner]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: profile.listings.filter((l) => l.status === "LIVE" || isOwner).length,
      VESSEL: listingsByKind.VESSEL.length,
      PARTS: listingsByKind.PARTS.length,
      SERVICES: listingsByKind.SERVICES.length,
      JOBS: listingsByKind.JOBS.length,
      sold: listingsByKind.sold.length,
    };
  }, [profile.listings, listingsByKind, isOwner]);

  const tabs: { id: TabId; label: string; icon: typeof Ship }[] = [
    { id: "all", label: "All listings", icon: Grid3X3 },
    { id: "VESSEL", label: "Vessels", icon: Ship },
    { id: "PARTS", label: "Parts", icon: Package },
    { id: "SERVICES", label: "Services", icon: Wrench },
    { id: "JOBS", label: "Jobs", icon: Briefcase },
    { id: "sold", label: "Sold", icon: CheckCircle2 },
  ];

  const isPro = profile.accountType !== "PRIVATE";

  // ✅ display priority: pro logo > avatar (pro) OR avatar (private)
  const primaryAvatarUrl = isPro ? profile.companyLogoUrl || profile.avatarUrl : profile.avatarUrl;

  return (
    <main className="min-h-screen w-full bg-slate-50">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-orange-50/30">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#ff6a00]/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-3xl" />
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.02]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="profile-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#profile-dots)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="no-underline hover:text-slate-900">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/buy" className="no-underline hover:text-slate-900">
              Marketplace
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-slate-900">{profile.name}</span>
          </nav>

          {/* Profile Header Card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                {/* Left side: Avatar + Info */}
                <div className="flex items-start gap-5">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className={cx(
                        "relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl sm:h-24 sm:w-24",
                        primaryAvatarUrl
                          ? "bg-slate-100"
                          : isPro
                          ? "bg-linear-to-br from-[#ff6a00] to-orange-600"
                          : "bg-linear-to-br from-slate-600 to-slate-800"
                      )}
                    >
                      {primaryAvatarUrl ? (
                        <img
                          src={primaryAvatarUrl}
                          alt={isPro ? `${profile.name} logo` : `${profile.name} avatar`}
                          className={cx(
                            "h-full w-full",
                            isPro && profile.companyLogoUrl ? "object-contain p-3" : "object-cover"
                          )}
                        />
                      ) : isPro ? (
                        <Building2 className="h-10 w-10 text-white sm:h-12 sm:w-12" />
                      ) : (
                        <User className="h-10 w-10 text-white sm:h-12 sm:w-12" />
                      )}
                    </div>

                    {/* If pro + has both, show avatar as a small badge */}
                    {isPro && profile.companyLogoUrl && profile.avatarUrl && (
                      <div className="absolute -bottom-2 -right-2 h-10 w-10 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-sm">
                        <img
                          src={profile.avatarUrl}
                          alt={`${profile.name} avatar`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    {profile.isVerified && (
                      <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#ff6a00]">
                        <BadgeCheck className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Name + Meta */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        {profile.name}
                      </h1>
                      {isPro && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-[#ff6a00] to-orange-500 px-3 py-1 text-xs font-bold text-white">
                          <Award className="h-3 w-3" />
                          PRO
                        </span>
                      )}
                    </div>

                    {profile.tagline && (
                      <p className="mt-1 text-sm font-medium text-slate-600">{profile.tagline}</p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                      {profile.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {profile.location}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        Member for {getMemberDuration(profile.createdAt)}
                      </span>
                      {profile.stats.responseRate > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <MessageCircle className="h-4 w-4 text-slate-400" />
                          {profile.stats.responseRate}% response rate
                        </span>
                      )}
                    </div>

                    {/* Verification badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className={cx(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
                          profile.isVerified
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        )}
                      >
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {profile.isVerified ? "Verified" : "Not verified"}
                      </span>
                      {profile.stats.avgResponseTime && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                          <Clock className="h-3.5 w-3.5" />
                          {profile.stats.avgResponseTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Actions */}
                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                  {isOwner ? (
                    <>
                      <Link
                        href={`/settings?profile=${encodeURIComponent(profile.slug)}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6a00] px-5 py-2.5 text-sm font-semibold text-white no-underline transition-all hover:brightness-110"
                      >
                        Edit profile
                      </Link>
                      <Link
                        href="/add-listing"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 no-underline transition-all hover:border-slate-300 hover:bg-slate-50"
                      >
                        <Zap className="h-4 w-4" />
                        New listing
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6a00] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Contact seller
                      </button>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                        >
                          <Heart className="h-4 w-4" />
                          Follow
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* About section (if exists) */}
              {profile.about && (
                <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">About</h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                    {profile.about}
                  </p>
                </div>
              )}
            </div>

            {/* Stats bar */}
            <div className="border-t border-slate-100 bg-linear-to-r from-slate-50 to-white">
              <div className="grid grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4">
                <div className="p-4 text-center sm:p-5">
                  <div className="text-2xl font-bold text-slate-900">
                    {profile.stats.liveListings}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-slate-500">Active listings</div>
                </div>
                <div className="p-4 text-center sm:p-5">
                  <div className="text-2xl font-bold text-slate-900">
                    {profile.stats.soldListings}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-slate-500">Items sold</div>
                </div>
                <div className="p-4 text-center sm:p-5">
                  <div className="text-2xl font-bold text-slate-900">
                    {profile.stats.responseRate}%
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-slate-500">Response rate</div>
                </div>
                <div className="p-4 text-center sm:p-5">
                  <div className="text-2xl font-bold text-slate-900">
                    {getMemberDuration(profile.createdAt)}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-slate-500">On Findaly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Left Column: Listings */}
            <div className="space-y-6">
              {/* Stats Cards (Mobile: horizontal scroll, Desktop: grid) */}
              <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:hidden">
                <div className="flex gap-3 sm:grid sm:grid-cols-2 md:grid-cols-4">
                  <div className="w-40 shrink-0 sm:w-auto">
                    <StatCard icon={Ship} label="Active listings" value={profile.stats.liveListings} accent />
                  </div>
                  <div className="w-40 shrink-0 sm:w-auto">
                    <StatCard icon={CheckCircle2} label="Items sold" value={profile.stats.soldListings} />
                  </div>
                  <div className="w-40 shrink-0 sm:w-auto">
                    <StatCard icon={ThumbsUp} label="Response rate" value={`${profile.stats.responseRate}%`} />
                  </div>
                  <div className="w-40 shrink-0 sm:w-auto">
                    <StatCard icon={Clock} label="Avg. response" value={profile.stats.avgResponseTime || "—"} />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="-mb-px flex overflow-x-auto border-b border-slate-200">
                  {tabs.map((tab) => {
                    const count = tabCounts[tab.id];
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;

                    // Hide empty tabs (except 'all')
                    if (count === 0 && tab.id !== "all") return null;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={cx(
                          "flex shrink-0 items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium transition-colors",
                          isActive
                            ? "border-[#ff6a00] text-[#ff6a00]"
                            : "border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-700"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                        {count > 0 && (
                          <span
                            className={cx(
                              "rounded-full px-2 py-0.5 text-xs font-semibold",
                              isActive
                                ? "bg-[#ff6a00]/10 text-[#ff6a00]"
                                : "bg-slate-100 text-slate-600"
                            )}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3">
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{displayedListings.length}</span>{" "}
                    {displayedListings.length === 1 ? "listing" : "listings"}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Sort */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-[#ff6a00]"
                      >
                        <option value="newest">Newest first</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                      <SortAsc className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>

                    {/* View toggle */}
                    <div className="hidden items-center rounded-lg border border-slate-200 bg-white p-1 sm:flex">
                      <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={cx(
                          "rounded-md p-1.5 transition-colors",
                          viewMode === "grid"
                            ? "bg-slate-900 text-white"
                            : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={cx(
                          "rounded-md p-1.5 transition-colors",
                          viewMode === "list"
                            ? "bg-slate-900 text-white"
                            : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Listings Grid */}
                <div className="p-4 sm:p-6">
                  {displayedListings.length > 0 ? (
                    <div
                      className={cx(
                        "grid gap-4",
                        viewMode === "grid"
                          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                          : "grid-cols-1"
                      )}
                    >
                      {displayedListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} isOwner={isOwner} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState kind={activeTab === "all" ? null : activeTab} isOwner={isOwner} />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-6">
              {/* Stats Cards (Desktop only) */}
              <div className="hidden space-y-4 lg:block">
                <StatCard
                  icon={Ship}
                  label="Active listings"
                  value={profile.stats.liveListings}
                  subtext="Currently for sale"
                  accent
                />
                <StatCard
                  icon={CheckCircle2}
                  label="Sold items"
                  value={profile.stats.soldListings}
                  subtext="Successfully completed"
                />
                <StatCard
                  icon={ThumbsUp}
                  label="Response rate"
                  value={`${profile.stats.responseRate}%`}
                  subtext="Based on last 30 days"
                />
              </div>

              {/* Contact Card (non-owner only) */}
              {!isOwner && <ContactCard profile={profile} />}

              {/* Trust Indicators */}
              <TrustIndicators profile={profile} />

              {/* Report */}
              {!isOwner && (
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                >
                  <Flag className="h-4 w-4" />
                  Report this seller
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
