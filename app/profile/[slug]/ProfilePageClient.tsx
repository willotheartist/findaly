// app/profile/[slug]/ProfilePageClient.tsx
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
  Heart,
  Share2,
  Flag,
  Shield,
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
  Camera,
  Sparkles,
} from "lucide-react";

/* ─── palette (match BuyPageClient / ListingPageClient) ─── */
const P = {
  dark: "#0a211f",
  accent: "#fff86c",
  text: "#1a1a1a",
  sub: "#555",
  muted: "#999",
  light: "#ccc",
  line: "#e5e5e5",
  faint: "#f5f5f4",
  white: "#fff",
  green: "#1a7a5c",
  rose: "#d94059",
  blue: "#2196F3",
} as const;

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
  if (cents === null) return "POA";
  return new Intl.NumberFormat("en-GB", {
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
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

function getMemberDuration(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears >= 1) return `${diffYears} year${diffYears > 1 ? "s" : ""}`;
  if (diffMonths >= 1) return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
  return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
}

const kindLabels: Record<ListingKind, string> = {
  VESSEL: "Vessels",
  PARTS: "Parts & Equipment",
  SERVICES: "Services",
  JOBS: "Jobs",
};

const kindIcons: Record<ListingKind, typeof Ship> = {
  VESSEL: Ship,
  PARTS: Package,
  SERVICES: Wrench,
  JOBS: Briefcase,
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
  icon: typeof Ship;
  label: string;
  value: string | number;
  subtext?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl border p-5"
      style={{
        borderColor: accent ? "rgba(26,122,92,.20)" : "rgba(0,0,0,.10)",
        backgroundColor: accent ? "rgba(26,122,92,.03)" : P.white,
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          backgroundColor: accent ? "rgba(26,122,92,.08)" : "rgba(0,0,0,.04)",
        }}
      >
        <Icon
          className="h-5 w-5"
          style={{ color: accent ? P.green : "rgba(0,0,0,.55)" }}
        />
      </div>
      <div className="mt-3">
        <div
          className="text-2xl"
          style={{ color: accent ? P.green : P.text, fontWeight: 600 }}
        >
          {value}
        </div>
        <div className="mt-0.5 text-sm" style={{ color: "rgba(0,0,0,.55)", fontWeight: 500 }}>
          {label}
        </div>
        {subtext && (
          <div className="mt-1 text-xs" style={{ color: "rgba(0,0,0,.35)" }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}

function ListingCard({ listing, isOwner }: { listing: ListingDTO; isOwner: boolean }) {
  const Icon = kindIcons[listing.kind];

  const statusStyles: Record<ListingStatus, { bg: string; text: string }> = {
    DRAFT: { bg: "rgba(0,0,0,.06)", text: "rgba(0,0,0,.55)" },
    LIVE: { bg: "rgba(26,122,92,.08)", text: P.green },
    PAUSED: { bg: "rgba(217,64,89,.08)", text: P.rose },
    SOLD: { bg: "rgba(33,150,243,.08)", text: P.blue },
  };

  const st = statusStyles[listing.status];

  return (
    <Link
      href={`/buy/${listing.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white no-underline"
      style={{ border: "1px solid rgba(0,0,0,.08)" }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "4 / 3",
          background: `linear-gradient(135deg, ${P.faint} 0%, rgba(245,245,244,.6) 100%)`,
        }}
      >
        {listing.thumbnailUrl ? (
          <img
            src={listing.thumbnailUrl}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Sailboat className="h-12 w-12" style={{ color: "rgba(0,0,0,.12)" }} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {listing.featured && (
            <span
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs"
              style={{ backgroundColor: P.accent, color: P.dark, fontWeight: 600 }}
            >
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          )}
          {isOwner && (
            <span
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs"
              style={{ backgroundColor: st.bg, color: st.text, fontWeight: 600 }}
            >
              {listing.status.charAt(0) + listing.status.slice(1).toLowerCase()}
            </span>
          )}
        </div>

        {/* Kind badge */}
        {listing.kind !== "VESSEL" && (
          <div className="absolute bottom-3 left-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(255,255,255,.90)",
                color: P.text,
                fontWeight: 500,
              }}
            >
              <Icon className="h-3 w-3" />
              {listing.kind.charAt(0) + listing.kind.slice(1).toLowerCase()}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="text-lg" style={{ color: P.text, fontWeight: 600 }}>
          {formatPrice(listing.priceCents, listing.currency)}
        </div>

        {/* Title */}
        <h3
          className="mt-1 line-clamp-2 text-sm"
          style={{ color: P.text, fontWeight: 500 }}
        >
          {listing.title}
        </h3>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: "rgba(0,0,0,.55)" }}>
          {listing.year && <span>{listing.year}</span>}
          {listing.lengthM && <span>{listing.lengthM}m</span>}
          {listing.brand && <span>{listing.brand}</span>}
        </div>

        {/* Location */}
        {listing.location && (
          <div className="mt-2 flex items-center gap-1 text-xs" style={{ color: "rgba(0,0,0,.45)" }}>
            <MapPin className="h-3 w-3" />
            <span className="truncate">
              {listing.location}
              {listing.country && `, ${listing.country}`}
            </span>
          </div>
        )}

        {/* Date */}
        <div className="mt-3 text-xs" style={{ color: "rgba(0,0,0,.35)" }}>
          {getRelativeTime(listing.createdAt)}
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ kind, isOwner }: { kind: string | null; isOwner: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center"
      style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.faint }}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(0,0,0,.04)", border: "1px solid rgba(0,0,0,.10)" }}
      >
        <Ship className="h-8 w-8" style={{ color: "rgba(0,0,0,.20)" }} />
      </div>
      <h3 className="mt-4 text-lg" style={{ color: P.text, fontWeight: 600 }}>
        {kind ? `No ${kindLabels[kind as ListingKind]?.toLowerCase() || "listings"}` : "No listings"} yet
      </h3>
      <p className="mt-1 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
        {isOwner
          ? "Start selling by creating your first listing."
          : "This seller hasn't listed anything in this category yet."}
      </p>
      {isOwner && (
        <Link
          href="/add-listing"
          className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm no-underline transition-all"
          style={{ backgroundColor: P.dark, color: P.accent, fontWeight: 600 }}
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
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: "rgba(0,0,0,.10)", backgroundColor: P.white }}
    >
      <div
        className="border-b px-5 py-4"
        style={{ borderColor: "rgba(0,0,0,.06)", backgroundColor: P.faint }}
      >
        <h3 className="text-sm" style={{ color: P.text, fontWeight: 600 }}>
          Contact {profile.name}
        </h3>
      </div>

      <div className="space-y-3 p-5">
        {profile.phone && (
          <button
            type="button"
            onClick={() => setShowPhone(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm transition-all"
            style={{
              borderColor: "rgba(0,0,0,.14)",
              backgroundColor: P.white,
              color: P.text,
              fontWeight: 500,
            }}
          >
            <Phone className="h-4 w-4" style={{ color: "rgba(0,0,0,.55)" }} />
            {showPhone ? profile.phone : "Show phone number"}
          </button>
        )}

        {profile.email && (
          <a
            href={`mailto:${profile.email}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm no-underline transition-all"
            style={{
              borderColor: "rgba(0,0,0,.14)",
              backgroundColor: P.white,
              color: P.text,
              fontWeight: 500,
            }}
          >
            <Mail className="h-4 w-4" style={{ color: "rgba(0,0,0,.55)" }} />
            Send email
          </a>
        )}

        <button
          type="button"
          onClick={() => setMessageSent(true)}
          disabled={messageSent}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm transition-all"
          style={{
            backgroundColor: messageSent ? P.green : P.dark,
            color: messageSent ? P.white : P.accent,
            fontWeight: 600,
          }}
        >
          <MessageCircle className="h-4 w-4" />
          {messageSent ? "Message sent!" : "Send message"}
        </button>

        {profile.website && (
          <a
            href={profile.website}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center justify-center gap-2 text-sm no-underline"
            style={{ color: "rgba(0,0,0,.55)" }}
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
    { icon: BadgeCheck, label: "Identity verified", active: profile.isVerified },
    { icon: Mail, label: "Email verified", active: !!profile.email },
    { icon: Phone, label: "Phone verified", active: !!profile.phone },
    { icon: Clock, label: "Active seller", active: profile.stats.liveListings > 0 },
  ];

  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: "rgba(0,0,0,.10)", backgroundColor: P.white }}
    >
      <div
        className="flex items-center gap-2 border-b px-5 py-4"
        style={{ borderColor: "rgba(0,0,0,.06)", backgroundColor: P.faint }}
      >
        <Shield className="h-4 w-4" style={{ color: "rgba(0,0,0,.45)" }} />
        <h3 className="text-sm" style={{ color: P.text, fontWeight: 600 }}>
          Trust & Safety
        </h3>
      </div>

      <div>
        {indicators.map((item, i) => (
          <div
            key={item.label}
            className="flex items-center gap-3 px-5 py-3"
            style={{
              borderTop: i > 0 ? "1px solid rgba(0,0,0,.06)" : undefined,
            }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                backgroundColor: item.active ? "rgba(26,122,92,.06)" : "rgba(0,0,0,.04)",
              }}
            >
              {item.active ? (
                <CheckCircle2 className="h-4 w-4" style={{ color: P.green }} />
              ) : (
                <XCircle className="h-4 w-4" style={{ color: "rgba(0,0,0,.25)" }} />
              )}
            </div>
            <span
              className="text-sm"
              style={{
                color: item.active ? P.text : "rgba(0,0,0,.35)",
                fontWeight: item.active ? 500 : 400,
              }}
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

  const displayedListings = useMemo(() => {
    let list: ListingDTO[];
    if (activeTab === "all") {
      list = profile.listings.filter((l) => l.status === "LIVE" || isOwner);
    } else if (activeTab === "sold") {
      list = listingsByKind.sold;
    } else {
      list = listingsByKind[activeTab];
    }
    return [...list].sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "price-asc") return (a.priceCents ?? 0) - (b.priceCents ?? 0);
      if (sortBy === "price-desc") return (b.priceCents ?? 0) - (a.priceCents ?? 0);
      return 0;
    });
  }, [profile.listings, activeTab, sortBy, listingsByKind, isOwner]);

  const tabCounts = useMemo(() => ({
    all: profile.listings.filter((l) => l.status === "LIVE" || isOwner).length,
    VESSEL: listingsByKind.VESSEL.length,
    PARTS: listingsByKind.PARTS.length,
    SERVICES: listingsByKind.SERVICES.length,
    JOBS: listingsByKind.JOBS.length,
    sold: listingsByKind.sold.length,
  }), [profile.listings, listingsByKind, isOwner]);

  const tabs: { id: TabId; label: string; icon: typeof Ship }[] = [
    { id: "all", label: "All listings", icon: Grid3X3 },
    { id: "VESSEL", label: "Vessels", icon: Ship },
    { id: "PARTS", label: "Parts", icon: Package },
    { id: "SERVICES", label: "Services", icon: Wrench },
    { id: "JOBS", label: "Jobs", icon: Briefcase },
    { id: "sold", label: "Sold", icon: CheckCircle2 },
  ];

  const isPro = profile.accountType !== "PRIVATE";
  const primaryAvatarUrl = isPro ? profile.companyLogoUrl || profile.avatarUrl : profile.avatarUrl;

  return (
    <main className="min-h-screen w-full" style={{ backgroundColor: P.faint }}>
      {/* Hero */}
      <section className="w-full" style={{ backgroundColor: P.white, borderBottom: "1px solid rgba(0,0,0,.08)" }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm" style={{ color: "rgba(0,0,0,.45)" }}>
            <Link href="/" className="no-underline transition-colors" style={{ color: "rgba(0,0,0,.45)" }}>
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/buy" className="no-underline transition-colors" style={{ color: "rgba(0,0,0,.45)" }}>
              Marketplace
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span style={{ color: P.text, fontWeight: 500 }}>{profile.name}</span>
          </nav>

          {/* Profile header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Left: Avatar + Info */}
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="relative">
                <div
                  className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl sm:h-24 sm:w-24"
                  style={{
                    backgroundColor: primaryAvatarUrl ? P.faint : P.dark,
                    border: primaryAvatarUrl ? "1px solid rgba(0,0,0,.10)" : "none",
                  }}
                >
                  {primaryAvatarUrl ? (
                    <img
                      src={primaryAvatarUrl}
                      alt={isPro ? `${profile.name} logo` : `${profile.name}`}
                      className={cx(
                        "h-full w-full",
                        isPro && profile.companyLogoUrl ? "object-contain p-3" : "object-cover"
                      )}
                    />
                  ) : isPro ? (
                    <Building2 className="h-10 w-10 sm:h-12 sm:w-12" style={{ color: P.accent }} />
                  ) : (
                    <User className="h-10 w-10 sm:h-12 sm:w-12" style={{ color: P.accent }} />
                  )}
                </div>

                {isPro && profile.companyLogoUrl && profile.avatarUrl && (
                  <div
                    className="absolute -bottom-2 -right-2 h-10 w-10 overflow-hidden rounded-xl border-2 bg-white"
                    style={{ borderColor: P.white }}
                  >
                    <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                )}

                {profile.isVerified && (
                  <div
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2"
                    style={{ borderColor: P.white, backgroundColor: P.green }}
                  >
                    <BadgeCheck className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl tracking-tight sm:text-3xl" style={{ color: P.text, fontWeight: 700 }}>
                    {profile.name}
                  </h1>
                  {isPro && (
                    <span
                      className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs"
                      style={{ backgroundColor: P.dark, color: P.accent, fontWeight: 700 }}
                    >
                      PRO
                    </span>
                  )}
                </div>

                {profile.tagline && (
                  <p className="mt-1 text-sm" style={{ color: "rgba(0,0,0,.55)", fontWeight: 500 }}>
                    {profile.tagline}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" style={{ color: "rgba(0,0,0,.50)" }}>
                  {profile.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" style={{ color: "rgba(0,0,0,.35)" }} />
                      {profile.location}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" style={{ color: "rgba(0,0,0,.35)" }} />
                    Member for {getMemberDuration(profile.createdAt)}
                  </span>
                  {profile.stats.responseRate > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4" style={{ color: "rgba(0,0,0,.35)" }} />
                      {profile.stats.responseRate}% response rate
                    </span>
                  )}
                </div>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs"
                    style={{
                      backgroundColor: profile.isVerified ? "rgba(26,122,92,.06)" : "rgba(0,0,0,.04)",
                      color: profile.isVerified ? P.green : "rgba(0,0,0,.55)",
                      fontWeight: 600,
                    }}
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {profile.isVerified ? "Verified" : "Not verified"}
                  </span>
                  {profile.stats.avgResponseTime && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs"
                      style={{ backgroundColor: "rgba(0,0,0,.04)", color: "rgba(0,0,0,.55)", fontWeight: 600 }}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {profile.stats.avgResponseTime}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
              {isOwner ? (
                <>
                  <Link
                    href={`/settings?profile=${encodeURIComponent(profile.slug)}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm no-underline transition-all"
                    style={{ backgroundColor: P.dark, color: P.accent, fontWeight: 600 }}
                  >
                    Edit profile
                  </Link>
                  <Link
                    href="/add-listing"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm no-underline transition-all"
                    style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text, fontWeight: 500 }}
                  >
                    <Zap className="h-4 w-4" />
                    New listing
                  </Link>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm transition-all"
                    style={{ backgroundColor: P.dark, color: P.accent, fontWeight: 600 }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact seller
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all"
                      style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text, fontWeight: 500 }}
                    >
                      <Heart className="h-4 w-4" />
                      Follow
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border px-3 py-2.5 transition-all"
                      style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: "rgba(0,0,0,.55)" }}
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* About */}
          {profile.about && (
            <div className="mt-6 rounded-2xl p-5" style={{ backgroundColor: P.faint }}>
              <h3 className="mb-2 text-sm" style={{ color: P.text, fontWeight: 600 }}>About</h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "rgba(0,0,0,.55)" }}>
                {profile.about}
              </p>
            </div>
          )}

          {/* Stats bar */}
          <div
            className="mt-6 grid grid-cols-2 divide-x rounded-2xl border sm:grid-cols-4"
            style={{ borderColor: "rgba(0,0,0,.10)" }}
          >
            {[
              { label: "Active listings", value: profile.stats.liveListings },
              { label: "Items sold", value: profile.stats.soldListings },
              { label: "Response rate", value: `${profile.stats.responseRate}%` },
              { label: "On Findaly", value: getMemberDuration(profile.createdAt) },
            ].map((stat) => (
              <div key={stat.label} className="p-4 text-center sm:p-5" style={{ backgroundColor: P.white }}>
                <div className="text-xl" style={{ color: P.text, fontWeight: 700 }}>
                  {stat.value}
                </div>
                <div className="mt-0.5 text-xs" style={{ color: "rgba(0,0,0,.45)", fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Left: Listings */}
            <div className="space-y-6">
              {/* Mobile stats */}
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

              {/* Tabs + Listings */}
              <div
                className="overflow-hidden rounded-2xl border"
                style={{ borderColor: "rgba(0,0,0,.10)", backgroundColor: P.white }}
              >
                {/* Tab row */}
                <div className="-mb-px flex overflow-x-auto" style={{ borderBottom: "1px solid rgba(0,0,0,.08)" }}>
                  {tabs.map((tab) => {
                    const count = tabCounts[tab.id];
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    if (count === 0 && tab.id !== "all") return null;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className="flex shrink-0 items-center gap-2 border-b-2 px-5 py-4 text-sm transition-colors"
                        style={{
                          borderBottomColor: isActive ? P.dark : "transparent",
                          color: isActive ? P.text : "rgba(0,0,0,.45)",
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                        {count > 0 && (
                          <span
                            className="rounded-md px-2 py-0.5 text-xs"
                            style={{
                              backgroundColor: isActive ? "rgba(0,0,0,.06)" : "rgba(0,0,0,.04)",
                              color: isActive ? P.text : "rgba(0,0,0,.45)",
                              fontWeight: 600,
                            }}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Toolbar */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: "1px solid rgba(0,0,0,.06)", backgroundColor: P.faint }}
                >
                  <div className="text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
                    <span style={{ color: P.text, fontWeight: 600 }}>{displayedListings.length}</span>{" "}
                    {displayedListings.length === 1 ? "listing" : "listings"}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="appearance-none rounded-md border bg-white py-2 pl-3 pr-8 text-sm outline-none"
                        style={{ borderColor: "rgba(0,0,0,.14)", color: P.text }}
                      >
                        <option value="newest">Newest first</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                      <SortAsc
                        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2"
                        style={{ color: "rgba(0,0,0,.35)" }}
                      />
                    </div>

                    <div
                      className="hidden items-center gap-1 rounded-md border p-1 sm:flex"
                      style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white }}
                    >
                      <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className="rounded-md p-1.5 transition-colors"
                        style={
                          viewMode === "grid"
                            ? { backgroundColor: "rgba(0,0,0,.06)", color: P.text }
                            : { color: "rgba(0,0,0,.35)" }
                        }
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className="rounded-md p-1.5 transition-colors"
                        style={
                          viewMode === "list"
                            ? { backgroundColor: "rgba(0,0,0,.06)", color: P.text }
                            : { color: "rgba(0,0,0,.35)" }
                        }
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Listings grid */}
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

            {/* Right: Sidebar */}
            <div className="space-y-6">
              {/* Desktop stats */}
              <div className="hidden space-y-4 lg:block">
                <StatCard icon={Ship} label="Active listings" value={profile.stats.liveListings} subtext="Currently for sale" accent />
                <StatCard icon={CheckCircle2} label="Sold items" value={profile.stats.soldListings} subtext="Successfully completed" />
                <StatCard icon={ThumbsUp} label="Response rate" value={`${profile.stats.responseRate}%`} subtext="Based on last 30 days" />
              </div>

              {!isOwner && <ContactCard profile={profile} />}

              <TrustIndicators profile={profile} />

              {!isOwner && (
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm transition-all"
                  style={{
                    borderColor: "rgba(0,0,0,.10)",
                    backgroundColor: P.white,
                    color: "rgba(0,0,0,.45)",
                    fontWeight: 500,
                  }}
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