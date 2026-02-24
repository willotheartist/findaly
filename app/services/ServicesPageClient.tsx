// app/services/ServicesPageClient.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useTransition } from "react";
import {
  MapPin,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Search,
  Loader2,
  Shield,
  Sparkles,
  Anchor,
  Wrench,
  Scale,
  Banknote,
  Ship,
  Users,
  Building2,
  Compass,
  PenTool,
  ShieldCheck,
  ArrowUpDown,
  MessageCircle,
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

type ServiceDTO = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  serviceName: string | null;
  serviceCategory: string | null;
  serviceDescription: string | null;
  serviceExperience?: string | null;

  // Prisma Json comes through as unknown at the edge
  serviceAreas?: unknown;

  location: string | null;
  country: string | null;
  featured: boolean;
  createdAt: string;
  profile: {
    id: string;
    name: string;
    slug: string;
    isVerified: boolean;
    location: string | null;
    about: string | null;
    companyLogoUrl: string | null;
    avatarUrl: string | null;
  };
};

type FilterValues = {
  q: string;
  categories: string[];
  country: string;
  sort: string;
};

type Aggregation = {
  id: string;
  label: string;
  count: number;
};

type Props = {
  listings: ServiceDTO[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: FilterValues;
  aggregations: {
    categories: Aggregation[];
    countries: Aggregation[];
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, typeof Anchor> = {
  "Yacht Surveyor": Compass,
  "Marine Insurance": ShieldCheck,
  "Yacht Finance": Banknote,
  "Yacht Delivery": Ship,
  "Crew Agency": Users,
  "Yacht Management": Building2,
  "Boatyard": Wrench,
  "Marine Lawyer": Scale,
  "Naval Architect": PenTool,
  "Charter Company": Anchor,
};

const SORT_OPTIONS = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "name-asc", label: "Name: A–Z" },
  { id: "name-desc", label: "Name: Z–A" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function toStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-1 text-xs"
      style={{
        backgroundColor: "rgba(0,0,0,.03)",
        border: "1px solid rgba(0,0,0,.10)",
        color: "rgba(0,0,0,.70)",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function Badge({ featured }: { featured: boolean }) {
  if (!featured) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: P.accent, color: P.dark }}
    >
      <Sparkles className="h-3 w-3" />
      Featured
    </span>
  );
}

function FilterPill({
  label,
  active,
  onClick,
  hasValue,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  hasValue?: boolean;
}) {
  const on = !!(active || hasValue);
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors"
      style={{
        borderColor: on ? "rgba(0,0,0,.28)" : "rgba(0,0,0,.14)",
        backgroundColor: on ? "rgba(0,0,0,.03)" : P.white,
        color: P.text,
        fontWeight: 400,
      }}
    >
      <span className="truncate">{label}</span>
      <ChevronDown
        className={cx("h-4 w-4 transition-transform", active && "rotate-180")}
        style={{ color: "rgba(0,0,0,.55)" }}
      />
    </button>
  );
}

function FilterDropdown({
  title,
  isOpen,
  onClose,
  children,
  width = "w-80",
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={cx(
          "absolute left-0 top-full z-50 mt-2 rounded-md border p-4",
          width
        )}
        style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm" style={{ color: P.text, fontWeight: 500 }}>
            {title}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 transition-colors"
            style={{ color: "rgba(0,0,0,.55)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.04)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

function ServiceCard({ listing }: { listing: ServiceDTO }) {
  const Icon = CATEGORY_ICONS[listing.serviceCategory || ""] || Anchor;

  const description =
    listing.serviceDescription || listing.description || listing.profile.about || "";

  const logoUrl =
    listing.profile.companyLogoUrl || listing.profile.avatarUrl || null;

  const areas = toStringArray(listing.serviceAreas);
  const pills: string[] = areas.slice(0, 6);

  const profileHref = `/profile/${listing.profile.slug}`;
  const enquireHref = `/profile/${listing.profile.slug}#contact`;

  return (
    <div
      className="group flex gap-5 overflow-hidden rounded-2xl border bg-white p-5 transition-all hover:shadow-lg"
      style={{ borderColor: "rgba(0,0,0,.10)" }}
    >
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: P.faint,
          border: "1px solid rgba(0,0,0,.08)",
        }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={listing.serviceName || listing.title}
            className="h-10 w-10 rounded-lg object-cover"
          />
        ) : (
          <Icon className="h-6 w-6" style={{ color: "rgba(0,0,0,.35)" }} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={profileHref} className="no-underline">
              <h3 className="line-clamp-1 text-base font-semibold" style={{ color: P.text }}>
                {listing.serviceName || listing.profile.name}
              </h3>
            </Link>

            <div className="mt-0.5 flex items-center gap-2 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
              {listing.serviceCategory && (
                <span
                  className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: "rgba(0,0,0,.04)",
                    border: "1px solid rgba(0,0,0,.10)",
                    color: P.text,
                    fontWeight: 500,
                  }}
                >
                  {listing.serviceCategory}
                </span>
              )}

              {listing.profile.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs" style={{ color: P.green, fontWeight: 600 }}>
                  <Shield className="h-3.5 w-3.5" style={{ color: P.green }} />
                  Verified
                </span>
              )}
            </div>
          </div>

          {listing.featured && <Badge featured={listing.featured} />}
        </div>

        {pills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pills.map((p, idx) => (
              <Pill key={`${p}-${idx}`}>{p}</Pill>
            ))}
          </div>
        )}

        {description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed" style={{ color: "rgba(0,0,0,.55)" }}>
            {description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">
              {listing.location || listing.profile.location || "Mediterranean"}
              {listing.country ? ` · ${listing.country}` : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={enquireHref}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs no-underline transition-colors"
              style={{
                backgroundColor: P.dark,
                color: P.accent,
                fontWeight: 600,
              }}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Enquire
            </Link>

            <Link
              href={profileHref}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs no-underline transition-colors"
              style={{
                backgroundColor: P.faint,
                border: "1px solid rgba(0,0,0,.10)",
                color: P.text,
                fontWeight: 500,
              }}
            >
              View profile
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-md border bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        style={{ borderColor: "rgba(0,0,0,.14)", color: "rgba(0,0,0,.65)" }}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2" style={{ color: "rgba(0,0,0,.35)" }}>
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-sm transition-colors"
            style={
              page === currentPage
                ? {
                    backgroundColor: "rgba(0,0,0,.06)",
                    color: P.text,
                    border: "1px solid rgba(0,0,0,.22)",
                    fontWeight: 500,
                  }
                : {
                    border: "1px solid rgba(0,0,0,.14)",
                    backgroundColor: P.white,
                    color: P.text,
                    fontWeight: 400,
                  }
            }
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-md border bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        style={{ borderColor: "rgba(0,0,0,.14)", color: "rgba(0,0,0,.65)" }}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-20 text-center"
      style={{ borderColor: "rgba(0,0,0,.16)", backgroundColor: P.faint }}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          backgroundColor: "rgba(0,0,0,.04)",
          border: "1px solid rgba(0,0,0,.10)",
        }}
      >
        <Wrench className="h-8 w-8" style={{ color: "rgba(0,0,0,.25)" }} />
      </div>
      <h3 className="mt-4 text-lg font-semibold" style={{ color: P.text }}>
        No service providers found
      </h3>
      <p className="mt-1 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
        {hasFilters
          ? "Try adjusting your filters to see more results."
          : "There are no service providers listed at the moment."}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm transition-colors"
          style={{
            backgroundColor: P.white,
            color: P.text,
            border: "1px solid rgba(0,0,0,.18)",
            fontWeight: 500,
          }}
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

export default function ServicesPageClient({
  listings,
  totalCount,
  currentPage,
  totalPages,
  filters,
  aggregations,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [localFilters, setLocalFilters] = useState(filters);

  const buildUrl = useCallback(
    (newFilters: Partial<FilterValues>, resetPage = true) => {
      const params = new URLSearchParams();
      const merged = { ...localFilters, ...newFilters };

      if (merged.q) params.set("q", merged.q);
      if (merged.categories.length) params.set("category", merged.categories.join(","));
      if (merged.country) params.set("country", merged.country);
      if (merged.sort !== "newest") params.set("sort", merged.sort);
      if (!resetPage && currentPage > 1) params.set("page", currentPage.toString());

      return `/services${params.toString() ? `?${params.toString()}` : ""}`;
    },
    [localFilters, currentPage]
  );

  const applyFilters = useCallback(
    (newFilters: Partial<FilterValues>, resetPage = true) => {
      const merged = { ...localFilters, ...newFilters };
      setLocalFilters(merged);
      startTransition(() => {
        router.push(buildUrl(newFilters, resetPage));
      });
    },
    [localFilters, buildUrl, router]
  );

  const clearFilters = useCallback(() => {
    const cleared: FilterValues = { q: "", categories: [], country: "", sort: "newest" };
    setLocalFilters(cleared);
    startTransition(() => router.push("/services"));
  }, [router]);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = localFilters.categories.includes(categoryId)
      ? localFilters.categories.filter((c) => c !== categoryId)
      : [...localFilters.categories, categoryId];
    applyFilters({ categories: newCategories });
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`/services?${params.toString()}`);
    });
  };

  const hasFilters =
    localFilters.q !== "" || localFilters.categories.length > 0 || localFilters.country !== "";

  return (
    <main className="min-h-screen w-full" style={{ backgroundColor: P.faint }}>
      {isPending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: "rgba(255,255,255,.60)" }}
        >
          <div
            className="flex items-center gap-3 rounded-md bg-white px-6 py-4"
            style={{ border: "1px solid rgba(0,0,0,.14)" }}
          >
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: "rgba(0,0,0,.55)" }} />
            <span className="text-sm" style={{ color: "rgba(0,0,0,.65)", fontWeight: 400 }}>
              Loading...
            </span>
          </div>
        </div>
      )}

      {/* Sticky filter bar */}
      <div
        className="sticky top-[var(--site-header-offset)] z-30 w-full border-b bg-white"
        style={{ borderColor: "rgba(0,0,0,.10)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          {/* Search */}
          <div className="mb-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const q = (formData.get("q") as string) || "";
                applyFilters({ q });
              }}
              className="relative"
            >
              <Search
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                style={{ color: "rgba(0,0,0,.35)" }}
              />
              <input
                type="text"
                name="q"
                defaultValue={localFilters.q}
                placeholder="Search marine services, surveyors, lawyers..."
                className="h-12 w-full rounded-md border pl-12 pr-28 text-sm outline-none transition-colors"
                style={{
                  borderColor: "rgba(0,0,0,.14)",
                  backgroundColor: P.white,
                  color: P.text,
                }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border px-4 py-2 text-sm transition-colors"
                style={{
                  backgroundColor: P.white,
                  color: P.text,
                  borderColor: "rgba(0,0,0,.18)",
                  fontWeight: 500,
                }}
              >
                Search
              </button>
            </form>
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <FilterPill
                label={
                  localFilters.categories.length
                    ? `Category (${localFilters.categories.length})`
                    : "Category"
                }
                active={activeDropdown === "category"}
                onClick={() => toggleDropdown("category")}
                hasValue={localFilters.categories.length > 0}
              />
              <FilterDropdown
                title="Service category"
                isOpen={activeDropdown === "category"}
                onClose={() => setActiveDropdown(null)}
              >
                <div className="space-y-1">
                  {aggregations.categories.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.label] || Anchor;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.03)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-5 w-5 items-center justify-center rounded border"
                            style={{
                              borderColor: "rgba(0,0,0,.22)",
                              backgroundColor: localFilters.categories.includes(cat.id)
                                ? "rgba(0,0,0,.06)"
                                : "transparent",
                            }}
                          >
                            {localFilters.categories.includes(cat.id) && (
                              <Check className="h-3 w-3" style={{ color: P.text }} />
                            )}
                          </div>
                          <Icon className="h-4 w-4" style={{ color: "rgba(0,0,0,.35)" }} />
                          <span style={{ color: P.text, fontWeight: 400 }}>{cat.label}</span>
                        </div>
                        <span style={{ color: "rgba(0,0,0,.35)" }}>{cat.count}</span>
                      </button>
                    );
                  })}
                </div>
              </FilterDropdown>
            </div>

            <div className="relative">
              <FilterPill
                label={localFilters.country || "Country"}
                active={activeDropdown === "country"}
                onClick={() => toggleDropdown("country")}
                hasValue={!!localFilters.country}
              />
              <FilterDropdown
                title="Country"
                isOpen={activeDropdown === "country"}
                onClose={() => setActiveDropdown(null)}
              >
                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {aggregations.countries.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        applyFilters({ country: c.label });
                        setActiveDropdown(null);
                      }}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm"
                      style={{ color: P.text, fontWeight: 400 }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <span>{c.label}</span>
                      <span style={{ color: "rgba(0,0,0,.35)" }}>{c.count}</span>
                    </button>
                  ))}
                </div>
              </FilterDropdown>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors"
                style={{
                  borderColor: "rgba(0,0,0,.14)",
                  backgroundColor: P.white,
                  color: "rgba(0,0,0,.55)",
                  fontWeight: 400,
                }}
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => applyFilters({ categories: [] })}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-1.5 text-sm transition-colors"
                style={
                  localFilters.categories.length === 0
                    ? {
                        backgroundColor: "rgba(0,0,0,.03)",
                        color: P.text,
                        borderColor: "rgba(0,0,0,.22)",
                        fontWeight: 500,
                      }
                    : {
                        borderColor: "rgba(0,0,0,.14)",
                        backgroundColor: P.white,
                        color: P.text,
                        fontWeight: 400,
                      }
                }
              >
                All services
              </button>

              {aggregations.categories.slice(0, 6).map((cat) => {
                const on = localFilters.categories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => applyFilters({ categories: [cat.id] })}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-1.5 text-sm transition-colors"
                    style={
                      on
                        ? {
                            backgroundColor: "rgba(0,0,0,.03)",
                            color: P.text,
                            borderColor: "rgba(0,0,0,.22)",
                            fontWeight: 500,
                          }
                        : {
                            borderColor: "rgba(0,0,0,.14)",
                            backgroundColor: P.white,
                            color: P.text,
                            fontWeight: 400,
                          }
                    }
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => toggleDropdown("sort")}
                className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm transition-colors"
                style={{
                  borderColor: "rgba(0,0,0,.14)",
                  color: P.text,
                  fontWeight: 400,
                }}
              >
                <ArrowUpDown className="h-4 w-4" style={{ color: "rgba(0,0,0,.55)" }} />
                {SORT_OPTIONS.find((s) => s.id === localFilters.sort)?.label || "Sort"}
                <ChevronDown className="h-4 w-4" style={{ color: "rgba(0,0,0,.55)" }} />
              </button>

              {activeDropdown === "sort" && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                  <div
                    className="absolute right-0 top-full z-50 mt-2 w-56 rounded-md border bg-white py-1"
                    style={{ borderColor: "rgba(0,0,0,.14)" }}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          applyFilters({ sort: option.id });
                          setActiveDropdown(null);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm"
                        style={{
                          color: P.text,
                          fontWeight: localFilters.sort === option.id ? 500 : 400,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.03)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        {option.label}
                        {localFilters.sort === option.id && (
                          <Check className="h-4 w-4" style={{ color: P.text }} />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold" style={{ color: P.text }}>
            Marine Services Directory
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
            <span className="font-semibold" style={{ color: P.text }}>
              {totalCount}
            </span>{" "}
            service providers across the Mediterranean
          </p>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {listings.map((listing) => (
              <ServiceCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
        )}

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            <div className="mt-4 text-center text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
              Page {currentPage} of {totalPages} • {totalCount} providers total
            </div>
          </div>
        )}

        <div
          className="mt-12 rounded-2xl border p-8"
          style={{ borderColor: "rgba(0,0,0,.08)", backgroundColor: P.white }}
        >
          <h2 className="text-lg font-semibold" style={{ color: P.text }}>
            Find Marine Professionals
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(0,0,0,.55)" }}>
            Findaly&apos;s marine services directory connects boat owners and buyers with professionals across the Mediterranean.
            Whether you need a pre-purchase yacht survey, marine insurance, yacht financing, legal advice, or a boatyard — find the right experts here.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {aggregations.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/services?category=${encodeURIComponent(cat.id)}`}
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs no-underline transition-colors hover:bg-gray-50"
                style={{ borderColor: "rgba(0,0,0,.10)", color: P.text, fontWeight: 400 }}
              >
                {cat.label}
                <span style={{ color: "rgba(0,0,0,.35)" }}>({cat.count})</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}