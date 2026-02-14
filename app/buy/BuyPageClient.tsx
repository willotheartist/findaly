// app/buy/BuyPageClient.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useTransition } from "react";
import {
  MapPin,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Heart,
  X,
  Sailboat,
  Check,
  Bell,
  Grid3X3,
  List,
  ArrowUpDown,
  Sparkles,
  Shield,
  Building2,
  User,
  Search,
  Loader2,
} from "lucide-react";

/* ─── palette (match ListingPageClient) ─── */
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

type ListingDTO = {
  id: string;
  slug: string;
  title: string;
  priceCents: number | null;
  currency: string;
  priceType: string;
  location: string | null;
  country: string | null;
  year: number | null;
  lengthFt: number | null;
  lengthM: number | null;
  brand: string | null;
  model: string | null;
  boatCategory: string | null;
  cabins: number | null;
  engineHours: number | null;
  fuelType: string | null;
  vesselCondition: string | null;
  featured: boolean;
  createdAt: string;
  thumbnailUrl: string | null;
  seller: {
    id: string;
    name: string;
    slug: string;
    type: string;
    company: string | null;
    location: string | null;
    isVerified: boolean;
  };
};

type FilterValues = {
  q: string;
  location: string;
  country: string;
  categories: string[];
  brands: string[];
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  lengthMin?: number;
  lengthMax?: number;
  cabinsMin?: number;
  fuelTypes: string[];
  condition: string;
  sellerType: string;
  sort: string;
  view: "grid" | "list";
};

type Aggregation = {
  id: string;
  label: string;
  count: number;
};

type Props = {
  listings: ListingDTO[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: FilterValues;
  aggregations: {
    categories: Aggregation[];
    brands: Aggregation[];
    countries: Aggregation[];
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const BOAT_CATEGORIES = [
  { id: "sailboat", label: "Sailboats" },
  { id: "motor-yacht", label: "Motor Yachts" },
  { id: "catamaran", label: "Catamarans" },
  { id: "rib", label: "RIBs & Tenders" },
  { id: "superyacht", label: "Superyachts" },
  { id: "fishing", label: "Fishing Boats" },
  { id: "dinghy", label: "Dinghies" },
  { id: "jetski", label: "Jet Skis & PWC" },
];

const FUEL_TYPES = [
  { id: "diesel", label: "Diesel" },
  { id: "petrol", label: "Petrol" },
  { id: "electric", label: "Electric" },
  { id: "hybrid", label: "Hybrid" },
  { id: "sail", label: "Sail only" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "year-desc", label: "Year: Newest" },
  { id: "year-asc", label: "Year: Oldest" },
  { id: "length-desc", label: "Length: Longest" },
  { id: "length-asc", label: "Length: Shortest" },
];

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
  return `${Math.floor(diffDays / 30)}mo ago`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function Badge({ featured }: { featured: boolean }) {
  if (!featured) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs font-medium"
      style={{
        borderColor: "rgba(10,33,31,.16)",
        backgroundColor: P.accent,
        color: P.dark,
      }}
    >
      <Sparkles className="h-3 w-3" />
      Featured
    </span>
  );
}

/**
 * Flat, rectangular filter button (no pills, no shadows, no green fills).
 * Light bg, dark text, simple border. Active = slightly darker border + subtle bg.
 */
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
      className={cx(
        "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors"
      )}
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
        className={cx("absolute left-0 top-full z-50 mt-2 rounded-md border p-4", width)}
        style={{
          borderColor: "rgba(0,0,0,.14)",
          backgroundColor: P.white,
        }}
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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

function BoatCard({ listing, view }: { listing: ListingDTO; view: "list" | "grid" }) {
  const [isSaved, setIsSaved] = useState(false);
  const isPro = listing.seller.type === "PROFESSIONAL";

  if (view === "grid") {
    return (
      <Link
        href={`/buy/${listing.slug}`}
        className="group overflow-hidden rounded-2xl border bg-white no-underline transition-all hover:shadow-lg"
        style={{ borderColor: "rgba(0,0,0,.10)" }}
      >
        <div
          className="relative aspect-4/3"
          style={{
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
            <div className="absolute inset-0 flex items-center justify-center">
              <Sailboat className="h-12 w-12" style={{ color: "rgba(0,0,0,.12)" }} />
            </div>
          )}

          {listing.featured && (
            <div className="absolute left-3 top-3">
              <Badge featured={listing.featured} />
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
            className="absolute right-3 top-3 rounded-full p-2 shadow-sm backdrop-blur-sm transition-all hover:scale-110"
            style={{
              backgroundColor: "rgba(255,255,255,.88)",
              border: "1px solid rgba(0,0,0,.10)",
            }}
          >
            <Heart
              className={cx("h-4 w-4", isSaved ? "fill-current" : "")}
              style={{ color: isSaved ? P.rose : "rgba(0,0,0,.55)" }}
            />
          </button>
        </div>

        <div className="p-4">
          <div className="line-clamp-2 text-base font-semibold transition-colors" style={{ color: P.text }}>
            <span className="group-hover:underline" style={{ textDecorationColor: "rgba(26,122,92,.35)" }}>
              {listing.title}
            </span>
          </div>

          <div className="mt-1 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
            {listing.lengthFt ? `${listing.lengthFt} ft` : ""}
            {listing.year ? ` • ${listing.year}` : ""}
            {listing.location ? ` • ${listing.location}` : ""}
          </div>

          <div className="mt-3 text-lg font-semibold" style={{ color: P.text }}>
            {formatPrice(listing.priceCents, listing.currency)}
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: "rgba(0,0,0,.55)" }}>
            {isPro ? <Building2 className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
            <span className="truncate">{listing.seller.name}</span>
            {listing.seller.isVerified && <Shield className="h-3.5 w-3.5" style={{ color: P.green }} />}
          </div>
        </div>
      </Link>
    );
  }

  // List view
  return (
    <Link
      href={`/buy/${listing.slug}`}
      className="group flex gap-4 overflow-hidden rounded-2xl border bg-white p-3 no-underline transition-all hover:shadow-lg sm:gap-5 sm:p-4"
      style={{ borderColor: "rgba(0,0,0,.10)" }}
    >
      {/* Image */}
      <div
        className="relative h-32 w-44 shrink-0 overflow-hidden rounded-xl sm:h-40 sm:w-56"
        style={{
          background: `linear-gradient(135deg, ${P.faint} 0%, rgba(245,245,244,.6) 100%)`,
          border: "1px solid rgba(0,0,0,.08)",
        }}
      >
        {listing.thumbnailUrl ? (
          <img
            src={listing.thumbnailUrl}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sailboat className="h-12 w-12" style={{ color: "rgba(0,0,0,.12)" }} />
          </div>
        )}

        {listing.featured && (
          <div className="absolute left-2 top-2">
            <Badge featured={listing.featured} />
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
          className="absolute right-2 top-2 rounded-full p-1.5 shadow-sm backdrop-blur-sm transition-all hover:scale-110"
          style={{
            backgroundColor: "rgba(255,255,255,.88)",
            border: "1px solid rgba(0,0,0,.10)",
          }}
        >
          <Heart
            className={cx("h-4 w-4", isSaved ? "fill-current" : "")}
            style={{ color: isSaved ? P.rose : "rgba(0,0,0,.55)" }}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col py-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-base font-semibold sm:text-lg" style={{ color: P.text }}>
              {listing.title}
            </h3>

            <div className="mt-1 flex items-center gap-2 text-base sm:text-lg">
              <span className="font-semibold" style={{ color: P.text }}>
                {formatPrice(listing.priceCents, listing.currency)}
              </span>
              {listing.priceType === "NEGOTIABLE" && (
                <span
                  className="rounded-md px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: "rgba(0,0,0,.03)",
                    color: P.text,
                    border: "1px solid rgba(0,0,0,.14)",
                    fontWeight: 400,
                  }}
                >
                  Negotiable
                </span>
              )}
            </div>
          </div>

          <span className="shrink-0 text-xs" style={{ color: "rgba(0,0,0,.35)" }}>
            {getRelativeTime(listing.createdAt)}
          </span>
        </div>

        {/* Specs row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" style={{ color: "rgba(0,0,0,.62)" }}>
          {listing.year && (
            <div className="flex items-center gap-1">
              <span style={{ color: "rgba(0,0,0,.38)" }}>Year</span>
              <span className="font-medium" style={{ color: P.text }}>
                {listing.year}
              </span>
            </div>
          )}
          {listing.lengthFt && (
            <div className="flex items-center gap-1">
              <span style={{ color: "rgba(0,0,0,.38)" }}>Length</span>
              <span className="font-medium" style={{ color: P.text }}>
                {listing.lengthFt} ft
              </span>
            </div>
          )}
          {listing.boatCategory && (
            <div className="flex items-center gap-1">
              <span style={{ color: "rgba(0,0,0,.38)" }}>Type</span>
              <span className="font-medium" style={{ color: P.text }}>
                {listing.boatCategory}
              </span>
            </div>
          )}
          {listing.cabins && (
            <div className="flex items-center gap-1">
              <span style={{ color: "rgba(0,0,0,.38)" }}>Cabins</span>
              <span className="font-medium" style={{ color: P.text }}>
                {listing.cabins}
              </span>
            </div>
          )}
          {listing.engineHours && (
            <div className="flex items-center gap-1">
              <span style={{ color: "rgba(0,0,0,.38)" }}>Engine</span>
              <span className="font-medium" style={{ color: P.text }}>
                {listing.engineHours} hrs
              </span>
            </div>
          )}
        </div>

        {/* Location */}
        {listing.location && (
          <div className="mt-2 flex items-center gap-1 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
            <MapPin className="h-3.5 w-3.5" />
            {listing.location}
            {listing.country && `, ${listing.country}`}
          </div>
        )}

        {/* Seller info */}
        <div className="mt-auto flex items-center gap-3 pt-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: P.faint, border: "1px solid rgba(0,0,0,.10)" }}
          >
            {isPro ? (
              <Building2 className="h-4 w-4" style={{ color: "rgba(0,0,0,.55)" }} />
            ) : (
              <User className="h-4 w-4" style={{ color: "rgba(0,0,0,.55)" }} />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium" style={{ color: P.text }}>
                {listing.seller.name}
              </span>
              {isPro && (
                <span
                  className="rounded-md px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: "rgba(0,0,0,.03)",
                    color: P.text,
                    border: "1px solid rgba(0,0,0,.14)",
                    fontWeight: 500,
                  }}
                >
                  PRO
                </span>
              )}
              {listing.seller.isVerified && <Shield className="h-3.5 w-3.5" style={{ color: P.green }} />}
            </div>

            {listing.seller.location && (
              <div className="text-xs" style={{ color: "rgba(0,0,0,.55)" }}>
                {listing.seller.location}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
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
                ? { backgroundColor: "rgba(0,0,0,.06)", color: P.text, border: "1px solid rgba(0,0,0,.22)", fontWeight: 500 }
                : { border: "1px solid rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text, fontWeight: 400 }
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

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-20 text-center"
      style={{ borderColor: "rgba(0,0,0,.16)", backgroundColor: P.faint }}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(0,0,0,.04)", border: "1px solid rgba(0,0,0,.10)" }}
      >
        <Sailboat className="h-8 w-8" style={{ color: "rgba(0,0,0,.25)" }} />
      </div>
      <h3 className="mt-4 text-lg font-semibold" style={{ color: P.text }}>
        No boats found
      </h3>
      <p className="mt-1 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
        {hasFilters ? "Try adjusting your filters to see more results." : "There are no boats listed at the moment."}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm transition-colors"
          style={{ backgroundColor: P.white, color: P.text, border: "1px solid rgba(0,0,0,.18)", fontWeight: 500 }}
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function BuyPageClient({
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

  // Build URL from filters
  const buildUrl = useCallback(
    (newFilters: Partial<FilterValues>, resetPage = true) => {
      const params = new URLSearchParams();
      const merged = { ...localFilters, ...newFilters };

      if (merged.q) params.set("q", merged.q);
      if (merged.location) params.set("location", merged.location);
      if (merged.country) params.set("country", merged.country);
      if (merged.categories.length) params.set("category", merged.categories.join(","));
      if (merged.brands.length) params.set("brand", merged.brands.join(","));
      if (merged.priceMin) params.set("priceMin", merged.priceMin.toString());
      if (merged.priceMax) params.set("priceMax", merged.priceMax.toString());
      if (merged.yearMin) params.set("yearMin", merged.yearMin.toString());
      if (merged.yearMax) params.set("yearMax", merged.yearMax.toString());
      if (merged.lengthMin) params.set("lengthMin", merged.lengthMin.toString());
      if (merged.lengthMax) params.set("lengthMax", merged.lengthMax.toString());
      if (merged.cabinsMin) params.set("cabins", merged.cabinsMin.toString());
      if (merged.fuelTypes.length) params.set("fuel", merged.fuelTypes.join(","));
      if (merged.condition) params.set("condition", merged.condition);
      if (merged.sellerType) params.set("seller", merged.sellerType);
      if (merged.sort !== "newest") params.set("sort", merged.sort);
      if (merged.view !== "list") params.set("view", merged.view);
      if (!resetPage && currentPage > 1) params.set("page", currentPage.toString());

      return `/buy${params.toString() ? `?${params.toString()}` : ""}`;
    },
    [localFilters, currentPage]
  );

  // Apply filters (navigate)
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

  // Clear all filters
  const clearFilters = useCallback(() => {
    const cleared: FilterValues = {
      q: "",
      location: "",
      country: "",
      categories: [],
      brands: [],
      priceMin: undefined,
      priceMax: undefined,
      yearMin: undefined,
      yearMax: undefined,
      lengthMin: undefined,
      lengthMax: undefined,
      cabinsMin: undefined,
      fuelTypes: [],
      condition: "",
      sellerType: "",
      sort: "newest",
      view: localFilters.view,
    };
    setLocalFilters(cleared);
    startTransition(() => {
      router.push("/buy");
    });
  }, [localFilters.view, router]);

  // Toggle dropdown
  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Toggle category
  const toggleCategory = (categoryId: string) => {
    const newCategories = localFilters.categories.includes(categoryId)
      ? localFilters.categories.filter((c) => c !== categoryId)
      : [...localFilters.categories, categoryId];
    applyFilters({ categories: newCategories });
  };

  // Toggle brand
  const toggleBrand = (brandId: string) => {
    const newBrands = localFilters.brands.includes(brandId)
      ? localFilters.brands.filter((b) => b !== brandId)
      : [...localFilters.brands, brandId];
    applyFilters({ brands: newBrands });
  };

  // Toggle fuel type (staged inside "More filters")
  const toggleFuelType = (fuelId: string) => {
    const newFuels = localFilters.fuelTypes.includes(fuelId)
      ? localFilters.fuelTypes.filter((f) => f !== fuelId)
      : [...localFilters.fuelTypes, fuelId];
    setLocalFilters((prev) => ({ ...prev, fuelTypes: newFuels }));
  };

  // Page change
  const handlePageChange = (page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`/buy?${params.toString()}`);
    });
  };

  // Count active filters
  const activeFiltersCount =
    (localFilters.priceMin || localFilters.priceMax ? 1 : 0) +
    (localFilters.lengthMin || localFilters.lengthMax ? 1 : 0) +
    (localFilters.yearMin || localFilters.yearMax ? 1 : 0) +
    localFilters.categories.length +
    localFilters.brands.length +
    localFilters.fuelTypes.length +
    (localFilters.cabinsMin ? 1 : 0) +
    (localFilters.sellerType ? 1 : 0) +
    (localFilters.condition ? 1 : 0) +
    (localFilters.location ? 1 : 0) +
    (localFilters.q ? 1 : 0);

  const hasFilters = activeFiltersCount > 0;

  // Use aggregations for categories/brands, fallback to static list
  const categoryOptions =
    aggregations.categories.length > 0
      ? aggregations.categories
      : BOAT_CATEGORIES.map((c) => ({ ...c, count: 0 }));

  const brandOptions = aggregations.brands.length > 0 ? aggregations.brands : [];
  const countryOptions = aggregations.countries;

  return (
    <main className="min-h-screen w-full" style={{ backgroundColor: P.white }}>
      {/* Loading overlay */}
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
          {/* Search bar */}
          <div className="mb-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const q = formData.get("q") as string;
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
                placeholder="Search boats, brands, models..."
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
            {/* Location */}
            <div className="relative">
              <FilterPill
                label={localFilters.location || "Location"}
                active={activeDropdown === "location"}
                onClick={() => toggleDropdown("location")}
                hasValue={!!localFilters.location}
              />
              <FilterDropdown
                title="Location"
                isOpen={activeDropdown === "location"}
                onClose={() => setActiveDropdown(null)}
              >
                <div className="mb-3">
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                      style={{ color: "rgba(0,0,0,.35)" }}
                    />
                    <input
                      type="text"
                      placeholder="Search location..."
                      value={localFilters.location}
                      onChange={(e) => setLocalFilters((prev) => ({ ...prev, location: e.target.value }))}
                      className="w-full rounded-md border py-2 pl-10 pr-4 text-sm outline-none"
                      style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text }}
                    />
                  </div>
                </div>
                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {countryOptions.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        applyFilters({ location: loc.label });
                        setActiveDropdown(null);
                      }}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm"
                      style={{ color: P.text, fontWeight: 400 }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <span>{loc.label}</span>
                      <span style={{ color: "rgba(0,0,0,.35)" }}>{loc.count.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    applyFilters({ location: localFilters.location });
                    setActiveDropdown(null);
                  }}
                  className="mt-3 w-full rounded-md border py-2 text-sm transition-colors"
                  style={{
                    backgroundColor: P.white,
                    color: P.text,
                    borderColor: "rgba(0,0,0,.18)",
                    fontWeight: 500,
                  }}
                >
                  Apply
                </button>
              </FilterDropdown>
            </div>

            {/* Price */}
            <div className="relative">
              <FilterPill
                label={
                  localFilters.priceMin || localFilters.priceMax
                    ? `€${localFilters.priceMin?.toLocaleString() || "0"} - €${localFilters.priceMax?.toLocaleString() || "∞"}`
                    : "Price"
                }
                active={activeDropdown === "price"}
                onClick={() => toggleDropdown("price")}
                hasValue={!!(localFilters.priceMin || localFilters.priceMax)}
              />
              <FilterDropdown
                title="Price range"
                isOpen={activeDropdown === "price"}
                onClose={() => setActiveDropdown(null)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs" style={{ color: "rgba(0,0,0,.55)" }}>
                      Min (€)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={localFilters.priceMin || ""}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          priceMin: e.target.value ? parseInt(e.target.value) : undefined,
                        }))
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                      style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text }}
                    />
                  </div>
                  <span className="mt-5" style={{ color: "rgba(0,0,0,.25)" }}>
                    —
                  </span>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs" style={{ color: "rgba(0,0,0,.55)" }}>
                      Max (€)
                    </label>
                    <input
                      type="number"
                      placeholder="No max"
                      value={localFilters.priceMax || ""}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          priceMax: e.target.value ? parseInt(e.target.value) : undefined,
                        }))
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                      style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[50000, 100000, 250000, 500000, 1000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setLocalFilters((prev) => ({ ...prev, priceMax: val }))}
                      className="rounded-md border px-3 py-1 text-xs transition-colors"
                      style={{
                        backgroundColor: P.white,
                        borderColor: "rgba(0,0,0,.14)",
                        color: P.text,
                        fontWeight: 400,
                      }}
                    >
                      &lt; €{val.toLocaleString()}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    applyFilters({ priceMin: localFilters.priceMin, priceMax: localFilters.priceMax });
                    setActiveDropdown(null);
                  }}
                  className="mt-4 w-full rounded-md border py-2 text-sm transition-colors"
                  style={{
                    backgroundColor: P.white,
                    color: P.text,
                    borderColor: "rgba(0,0,0,.18)",
                    fontWeight: 500,
                  }}
                >
                  Apply
                </button>
              </FilterDropdown>
            </div>

            {/* Boat Type */}
            <div className="relative">
              <FilterPill
                label={localFilters.categories.length ? `Type (${localFilters.categories.length})` : "Boat type"}
                active={activeDropdown === "type"}
                onClick={() => toggleDropdown("type")}
                hasValue={localFilters.categories.length > 0}
              />
              <FilterDropdown title="Boat type" isOpen={activeDropdown === "type"} onClose={() => setActiveDropdown(null)}>
                <div className="space-y-1">
                  {categoryOptions.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleCategory(type.id)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm"
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-5 w-5 items-center justify-center rounded border"
                          style={{
                            borderColor: "rgba(0,0,0,.22)",
                            backgroundColor: localFilters.categories.includes(type.id) ? "rgba(0,0,0,.06)" : "transparent",
                          }}
                        >
                          {localFilters.categories.includes(type.id) && <Check className="h-3 w-3" style={{ color: P.text }} />}
                        </div>
                        <span style={{ color: P.text, fontWeight: 400 }}>{type.label}</span>
                      </div>
                      <span style={{ color: "rgba(0,0,0,.35)" }}>{type.count.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </FilterDropdown>
            </div>

            {/* Brand */}
            {brandOptions.length > 0 && (
              <div className="relative hidden sm:block">
                <FilterPill
                  label={localFilters.brands.length ? `Brand (${localFilters.brands.length})` : "Brand"}
                  active={activeDropdown === "brand"}
                  onClick={() => toggleDropdown("brand")}
                  hasValue={localFilters.brands.length > 0}
                />
                <FilterDropdown
                  title="Brand"
                  isOpen={activeDropdown === "brand"}
                  onClose={() => setActiveDropdown(null)}
                  width="w-96"
                >
                  <div className="grid max-h-64 grid-cols-2 gap-1 overflow-y-auto">
                    {brandOptions.map((brand) => (
                      <button
                        key={brand.id}
                        type="button"
                        onClick={() => toggleBrand(brand.id)}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm"
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.03)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <div
                          className="flex h-4 w-4 items-center justify-center rounded border"
                          style={{
                            borderColor: "rgba(0,0,0,.22)",
                            backgroundColor: localFilters.brands.includes(brand.id) ? "rgba(0,0,0,.06)" : "transparent",
                          }}
                        >
                          {localFilters.brands.includes(brand.id) && <Check className="h-2.5 w-2.5" style={{ color: P.text }} />}
                        </div>
                        <span className="truncate" style={{ color: P.text, fontWeight: 400 }}>
                          {brand.label}
                        </span>
                        <span className="ml-auto text-xs" style={{ color: "rgba(0,0,0,.35)" }}>
                          {brand.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </FilterDropdown>
              </div>
            )}

            {/* More Filters */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("more")}
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors"
                style={{
                  borderColor: activeFiltersCount > 0 ? "rgba(0,0,0,.28)" : "rgba(0,0,0,.14)",
                  backgroundColor: activeFiltersCount > 0 ? "rgba(0,0,0,.03)" : P.white,
                  color: P.text,
                  fontWeight: 400,
                }}
              >
                <SlidersHorizontal className="h-4 w-4" style={{ color: "rgba(0,0,0,.55)" }} />
                More filters
                {activeFiltersCount > 0 && (
                  <span
                    className="flex h-5 min-w-[20px] items-center justify-center rounded-md border px-1 text-xs"
                    style={{ backgroundColor: P.white, color: P.text, borderColor: "rgba(0,0,0,.18)", fontWeight: 500 }}
                  >
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <FilterDropdown
                title="More filters"
                isOpen={activeDropdown === "more"}
                onClose={() => setActiveDropdown(null)}
                width="w-[420px]"
              >
                <div className="space-y-5">
                  {/* Length */}
                  <div>
                    <label className="mb-2 block text-sm" style={{ color: P.text, fontWeight: 500 }}>
                      Length (meters)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={localFilters.lengthMin || ""}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            lengthMin: e.target.value ? parseFloat(e.target.value) : undefined,
                          }))
                        }
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                        style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text }}
                      />
                      <span style={{ color: "rgba(0,0,0,.25)" }}>—</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={localFilters.lengthMax || ""}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            lengthMax: e.target.value ? parseFloat(e.target.value) : undefined,
                          }))
                        }
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                        style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text }}
                      />
                    </div>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="mb-2 block text-sm" style={{ color: P.text, fontWeight: 500 }}>
                      Year
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="From"
                        value={localFilters.yearMin || ""}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            yearMin: e.target.value ? parseInt(e.target.value) : undefined,
                          }))
                        }
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                        style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text }}
                      />
                      <span style={{ color: "rgba(0,0,0,.25)" }}>—</span>
                      <input
                        type="number"
                        placeholder="To"
                        value={localFilters.yearMax || ""}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            yearMax: e.target.value ? parseInt(e.target.value) : undefined,
                          }))
                        }
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                        style={{ borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text }}
                      />
                    </div>
                  </div>

                  {/* Cabins */}
                  <div>
                    <label className="mb-2 block text-sm" style={{ color: P.text, fontWeight: 500 }}>
                      Minimum cabins
                    </label>
                    <div className="flex gap-2">
                      {["1", "2", "3", "4", "5"].map((val) => {
                        const n = parseInt(val);
                        const on = localFilters.cabinsMin === n;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() =>
                              setLocalFilters((prev) => ({
                                ...prev,
                                cabinsMin: prev.cabinsMin === n ? undefined : n,
                              }))
                            }
                            className="flex-1 rounded-md border py-2 text-sm transition-colors"
                            style={{
                              borderColor: on ? "rgba(0,0,0,.28)" : "rgba(0,0,0,.14)",
                              backgroundColor: on ? "rgba(0,0,0,.03)" : P.white,
                              color: P.text,
                              fontWeight: 400,
                            }}
                          >
                            {val}+
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="mb-2 block text-sm" style={{ color: P.text, fontWeight: 500 }}>
                      Fuel type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FUEL_TYPES.map((fuel) => {
                        const on = localFilters.fuelTypes.includes(fuel.id);
                        return (
                          <button
                            key={fuel.id}
                            type="button"
                            onClick={() => toggleFuelType(fuel.id)}
                            className="rounded-md border px-3 py-1.5 text-sm transition-colors"
                            style={{
                              borderColor: on ? "rgba(0,0,0,.28)" : "rgba(0,0,0,.14)",
                              backgroundColor: on ? "rgba(0,0,0,.03)" : P.white,
                              color: P.text,
                              fontWeight: 400,
                            }}
                          >
                            {fuel.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="mb-2 block text-sm" style={{ color: P.text, fontWeight: 500 }}>
                      Condition
                    </label>
                    <div className="flex gap-2">
                      {[
                        { id: "", label: "All" },
                        { id: "new", label: "New" },
                        { id: "used", label: "Used" },
                      ].map((opt) => {
                        const on = localFilters.condition === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setLocalFilters((prev) => ({ ...prev, condition: opt.id }))}
                            className="flex-1 rounded-md border py-2 text-sm transition-colors"
                            style={{
                              borderColor: on ? "rgba(0,0,0,.28)" : "rgba(0,0,0,.14)",
                              backgroundColor: on ? "rgba(0,0,0,.03)" : P.white,
                              color: P.text,
                              fontWeight: 400,
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Seller Type */}
                  <div>
                    <label className="mb-2 block text-sm" style={{ color: P.text, fontWeight: 500 }}>
                      Seller type
                    </label>
                    <div className="flex gap-2">
                      {[
                        { id: "", label: "All" },
                        { id: "pro", label: "Professional" },
                        { id: "private", label: "Private" },
                      ].map((opt) => {
                        const on = localFilters.sellerType === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setLocalFilters((prev) => ({ ...prev, sellerType: opt.id }))}
                            className="flex-1 rounded-md border py-2 text-sm transition-colors"
                            style={{
                              borderColor: on ? "rgba(0,0,0,.28)" : "rgba(0,0,0,.14)",
                              backgroundColor: on ? "rgba(0,0,0,.03)" : P.white,
                              color: P.text,
                              fontWeight: 400,
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex-1 rounded-md border py-2.5 text-sm transition-colors"
                    style={{
                      borderColor: "rgba(0,0,0,.14)",
                      color: P.text,
                      backgroundColor: P.white,
                      fontWeight: 500,
                    }}
                  >
                    Clear all
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      applyFilters(localFilters);
                      setActiveDropdown(null);
                    }}
                    className="flex-1 rounded-md border py-2.5 text-sm transition-colors"
                    style={{
                      borderColor: "rgba(0,0,0,.18)",
                      backgroundColor: P.white,
                      color: P.text,
                      fontWeight: 500,
                    }}
                  >
                    Show results
                  </button>
                </div>
              </FilterDropdown>
            </div>
          </div>

          {/* Sort & View row */}
          <div className="mt-3 flex items-center justify-between gap-4">
            {/* Category quick links (rectangles, not pills) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Link
                href="/buy"
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-1.5 text-sm no-underline transition-colors"
                style={
                  localFilters.categories.length === 0
                    ? { backgroundColor: "rgba(0,0,0,.03)", color: P.text, borderColor: "rgba(0,0,0,.22)", fontWeight: 500 }
                    : { borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text, fontWeight: 400 }
                }
              >
                All boats
              </Link>

              {BOAT_CATEGORIES.slice(0, 5).map((cat) => {
                const on = localFilters.categories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => applyFilters({ categories: [cat.id] })}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-1.5 text-sm transition-colors"
                    style={
                      on
                        ? { backgroundColor: "rgba(0,0,0,.03)", color: P.text, borderColor: "rgba(0,0,0,.22)", fontWeight: 500 }
                        : { borderColor: "rgba(0,0,0,.14)", backgroundColor: P.white, color: P.text, fontWeight: 400 }
                    }
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Sort & View */}
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => toggleDropdown("sort")}
                  className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm transition-colors"
                  style={{ borderColor: "rgba(0,0,0,.14)", color: P.text, fontWeight: 400 }}
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
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.03)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          {option.label}
                          {localFilters.sort === option.id && <Check className="h-4 w-4" style={{ color: P.text }} />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="hidden items-center gap-1 rounded-md border bg-white p-1 sm:flex" style={{ borderColor: "rgba(0,0,0,.14)" }}>
                <button
                  type="button"
                  onClick={() => applyFilters({ view: "list" }, false)}
                  className="rounded-md p-1.5 transition-colors"
                  style={localFilters.view === "list" ? { backgroundColor: "rgba(0,0,0,.05)", color: P.text } : { color: "rgba(0,0,0,.55)" }}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFilters({ view: "grid" }, false)}
                  className="rounded-md p-1.5 transition-colors"
                  style={localFilters.view === "grid" ? { backgroundColor: "rgba(0,0,0,.05)", color: P.text } : { color: "rgba(0,0,0,.55)" }}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Results header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: P.text }}>
              Boats for sale
            </h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
              <span className="font-semibold" style={{ color: P.text }}>
                {totalCount.toLocaleString()}
              </span>{" "}
              boats available
            </p>
          </div>

          <Link
            href={`/searches/save?${searchParams.toString()}`}
            className="hidden items-center gap-2 rounded-md border px-4 py-2.5 text-sm no-underline transition-colors sm:inline-flex"
            style={{ backgroundColor: P.white, color: P.text, borderColor: "rgba(0,0,0,.18)", fontWeight: 500 }}
          >
            <Bell className="h-4 w-4" style={{ color: "rgba(0,0,0,.55)" }} />
            Save search
          </Link>
        </div>

        {/* Active filters (rectangles, no green) */}
        {hasFilters && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
              Active filters:
            </span>

            {localFilters.q && (
              <span
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-sm"
                style={{
                  backgroundColor: "rgba(0,0,0,.03)",
                  borderColor: "rgba(0,0,0,.18)",
                  color: P.text,
                  fontWeight: 400,
                }}
              >
                &quot;{localFilters.q}&quot;
                <button
                  type="button"
                  onClick={() => applyFilters({ q: "" })}
                  className="ml-1 rounded-md p-0.5"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <X className="h-3.5 w-3.5" style={{ color: "rgba(0,0,0,.65)" }} />
                </button>
              </span>
            )}

            {localFilters.location && (
              <span
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-sm"
                style={{
                  backgroundColor: "rgba(0,0,0,.03)",
                  borderColor: "rgba(0,0,0,.18)",
                  color: P.text,
                  fontWeight: 400,
                }}
              >
                <MapPin className="h-3.5 w-3.5" style={{ color: "rgba(0,0,0,.55)" }} />
                {localFilters.location}
                <button
                  type="button"
                  onClick={() => applyFilters({ location: "" })}
                  className="ml-1 rounded-md p-0.5"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <X className="h-3.5 w-3.5" style={{ color: "rgba(0,0,0,.65)" }} />
                </button>
              </span>
            )}

            {(localFilters.priceMin || localFilters.priceMax) && (
              <span
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-sm"
                style={{
                  backgroundColor: "rgba(0,0,0,.03)",
                  borderColor: "rgba(0,0,0,.18)",
                  color: P.text,
                  fontWeight: 400,
                }}
              >
                €{localFilters.priceMin?.toLocaleString() || "0"} - €{localFilters.priceMax?.toLocaleString() || "∞"}
                <button
                  type="button"
                  onClick={() => applyFilters({ priceMin: undefined, priceMax: undefined })}
                  className="ml-1 rounded-md p-0.5"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <X className="h-3.5 w-3.5" style={{ color: "rgba(0,0,0,.65)" }} />
                </button>
              </span>
            )}

            {localFilters.categories.map((catId) => {
              const cat = BOAT_CATEGORIES.find((c) => c.id === catId);
              return (
                <span
                  key={catId}
                  className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-sm"
                  style={{
                    backgroundColor: "rgba(0,0,0,.03)",
                    borderColor: "rgba(0,0,0,.18)",
                    color: P.text,
                    fontWeight: 400,
                  }}
                >
                  {cat?.label || catId}
                  <button
                    type="button"
                    onClick={() => toggleCategory(catId)}
                    className="ml-1 rounded-md p-0.5"
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <X className="h-3.5 w-3.5" style={{ color: "rgba(0,0,0,.65)" }} />
                  </button>
                </span>
              );
            })}

            {localFilters.brands.map((brandId) => {
              const brand = brandOptions.find((b) => b.id === brandId);
              return (
                <span
                  key={brandId}
                  className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-sm"
                  style={{
                    backgroundColor: "rgba(0,0,0,.03)",
                    borderColor: "rgba(0,0,0,.18)",
                    color: P.text,
                    fontWeight: 400,
                  }}
                >
                  {brand?.label || brandId}
                  <button
                    type="button"
                    onClick={() => toggleBrand(brandId)}
                    className="ml-1 rounded-md p-0.5"
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <X className="h-3.5 w-3.5" style={{ color: "rgba(0,0,0,.65)" }} />
                  </button>
                </span>
              );
            })}

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm transition-colors"
              style={{ color: "rgba(0,0,0,.62)", fontWeight: 500 }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results grid/list */}
        {listings.length > 0 ? (
          <div
            className={
              localFilters.view === "grid"
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-4"
            }
          >
            {listings.map((listing) => (
              <BoatCard key={listing.id} listing={listing} view={localFilters.view} />
            ))}
          </div>
        ) : (
          <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            <div className="mt-4 text-center text-sm" style={{ color: "rgba(0,0,0,.55)" }}>
              Page {currentPage} of {totalPages} • {totalCount.toLocaleString()} boats total
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Floating save search button (left as-is, not part of filter system) */}
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 sm:hidden">
        <Link
          href={`/searches/save?${searchParams.toString()}`}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg no-underline transition-all"
          style={{ backgroundColor: P.dark, color: P.accent }}
        >
          <Bell className="h-4 w-4" />
          Save search
        </Link>
      </div>
    </main>
  );
}
