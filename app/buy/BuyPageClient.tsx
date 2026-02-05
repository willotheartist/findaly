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
    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
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
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
        active || hasValue
          ? "border-[#ff6a00] bg-orange-50 text-[#ff6a00]"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      {label}
      <ChevronDown className={cx("h-4 w-4 transition-transform", active && "rotate-180")} />
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
          "absolute left-0 top-full z-50 mt-2 rounded-xl border border-slate-200 bg-white p-4 shadow-xl",
          width
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          <button type="button" onClick={onClose} className="rounded-md p-1 hover:bg-slate-100">
            <X className="h-4 w-4 text-slate-500" />
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
        className="group overflow-hidden rounded-xl border border-slate-200 bg-white no-underline transition-all hover:border-slate-300 hover:shadow-lg"
      >
        <div className="relative aspect-4/3 bg-linear-to-br from-slate-100 to-slate-50">
          {listing.thumbnailUrl ? (
            <img
              src={listing.thumbnailUrl}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sailboat className="h-12 w-12 text-slate-200" />
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
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
          >
            <Heart
              className={cx("h-4 w-4", isSaved ? "fill-rose-500 text-rose-500" : "text-slate-600")}
            />
          </button>
        </div>
        <div className="p-4">
          <div className="line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-[#ff6a00]">
            {listing.title}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {listing.lengthFt ? `${listing.lengthFt} ft` : ""}{" "}
            {listing.year ? `• ${listing.year}` : ""}{" "}
            {listing.location ? `• ${listing.location}` : ""}
          </div>
          <div className="mt-3 text-lg font-bold text-slate-900">
            {formatPrice(listing.priceCents, listing.currency)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            {isPro ? <Building2 className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
            <span className="truncate">{listing.seller.name}</span>
            {listing.seller.isVerified && <Shield className="h-3.5 w-3.5 text-emerald-500" />}
          </div>
        </div>
      </Link>
    );
  }

  // List view
  return (
    <Link
      href={`/buy/${listing.slug}`}
      className="group flex gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 no-underline transition-all hover:border-slate-300 hover:shadow-lg sm:gap-5 sm:p-4"
    >
      {/* Image */}
      <div className="relative h-32 w-44 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-slate-100 to-slate-50 sm:h-40 sm:w-56">
        {listing.thumbnailUrl ? (
          <img
            src={listing.thumbnailUrl}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sailboat className="h-12 w-12 text-slate-200" />
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
          className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
        >
          <Heart
            className={cx("h-4 w-4", isSaved ? "fill-rose-500 text-rose-500" : "text-slate-600")}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col py-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-base font-semibold text-slate-900 group-hover:text-[#ff6a00] sm:text-lg">
              {listing.title}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-base font-bold text-[#ff6a00] sm:text-lg">
              {formatPrice(listing.priceCents, listing.currency)}
              {listing.priceType === "NEGOTIABLE" && (
                <span className="ml-2 text-xs font-medium text-slate-500">Negotiable</span>
              )}
            </div>
          </div>
          <span className="shrink-0 text-xs text-slate-400">{getRelativeTime(listing.createdAt)}</span>
        </div>

        {/* Specs row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          {listing.year && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Year</span>
              <span className="font-medium text-slate-900">{listing.year}</span>
            </div>
          )}
          {listing.lengthFt && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Length</span>
              <span className="font-medium text-slate-900">{listing.lengthFt} ft</span>
            </div>
          )}
          {listing.boatCategory && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Type</span>
              <span className="font-medium text-slate-900">{listing.boatCategory}</span>
            </div>
          )}
          {listing.cabins && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Cabins</span>
              <span className="font-medium text-slate-900">{listing.cabins}</span>
            </div>
          )}
          {listing.engineHours && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Engine</span>
              <span className="font-medium text-slate-900">{listing.engineHours} hrs</span>
            </div>
          )}
        </div>

        {/* Location */}
        {listing.location && (
          <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {listing.location}
            {listing.country && `, ${listing.country}`}
          </div>
        )}

        {/* Seller info */}
        <div className="mt-auto flex items-center gap-3 pt-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
            {isPro ? (
              <Building2 className="h-4 w-4 text-slate-600" />
            ) : (
              <User className="h-4 w-4 text-slate-600" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium text-slate-900">
                {listing.seller.name}
              </span>
              {isPro && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                  Pro
                </span>
              )}
              {listing.seller.isVerified && <Shield className="h-3.5 w-3.5 text-emerald-500" />}
            </div>
            {listing.seller.location && (
              <div className="text-xs text-slate-500">{listing.seller.location}</div>
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
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-slate-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cx(
              "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
              page === currentPage
                ? "bg-[#ff6a00] text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <Sailboat className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">No boats found</h3>
      <p className="mt-1 text-sm text-slate-500">
        {hasFilters
          ? "Try adjusting your filters to see more results."
          : "There are no boats listed at the moment."}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#ff6a00] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
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
  const buildUrl = useCallback((newFilters: Partial<FilterValues>, resetPage = true) => {
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
  }, [localFilters, currentPage]);

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

  // Toggle fuel type
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

  const brandOptions =
    aggregations.brands.length > 0
      ? aggregations.brands
      : [];

  const countryOptions = aggregations.countries;

  return (
    <main className="min-h-screen w-full bg-slate-50">
      {/* Loading overlay */}
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-xl">
            <Loader2 className="h-5 w-5 animate-spin text-[#ff6a00]" />
            <span className="text-sm font-medium text-slate-700">Loading...</span>
          </div>
        </div>
      )}

      {/* Sticky filter bar */}
      <div className="sticky top-[var(--site-header-h)] z-30 w-full border-b border-slate-200 bg-white">
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
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={localFilters.q}
                placeholder="Search boats, brands, models..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition-colors focus:border-slate-300 focus:bg-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#ff6a00] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filter pills row */}
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
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search location..."
                      value={localFilters.location}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({ ...prev, location: e.target.value }))
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-slate-300"
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
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      <span className="text-slate-900">{loc.label}</span>
                      <span className="text-slate-400">{loc.count.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    applyFilters({ location: localFilters.location });
                    setActiveDropdown(null);
                  }}
                  className="mt-3 w-full rounded-lg bg-[#ff6a00] py-2 text-sm font-semibold text-white hover:brightness-110"
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
                    <label className="mb-1 block text-xs text-slate-500">Min (€)</label>
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
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-300"
                    />
                  </div>
                  <span className="mt-5 text-slate-300">—</span>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-slate-500">Max (€)</label>
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
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-300"
                    />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[50000, 100000, 250000, 500000, 1000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setLocalFilters((prev) => ({ ...prev, priceMax: val }))}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                    >
                      &lt; €{val.toLocaleString()}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    applyFilters({
                      priceMin: localFilters.priceMin,
                      priceMax: localFilters.priceMax,
                    });
                    setActiveDropdown(null);
                  }}
                  className="mt-4 w-full rounded-lg bg-[#ff6a00] py-2 text-sm font-semibold text-white hover:brightness-110"
                >
                  Apply
                </button>
              </FilterDropdown>
            </div>

            {/* Boat Type */}
            <div className="relative">
              <FilterPill
                label={
                  localFilters.categories.length
                    ? `Type (${localFilters.categories.length})`
                    : "Boat type"
                }
                active={activeDropdown === "type"}
                onClick={() => toggleDropdown("type")}
                hasValue={localFilters.categories.length > 0}
              />
              <FilterDropdown
                title="Boat type"
                isOpen={activeDropdown === "type"}
                onClose={() => setActiveDropdown(null)}
              >
                <div className="space-y-1">
                  {categoryOptions.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleCategory(type.id)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cx(
                            "flex h-5 w-5 items-center justify-center rounded border",
                            localFilters.categories.includes(type.id)
                              ? "border-[#ff6a00] bg-[#ff6a00]"
                              : "border-slate-300"
                          )}
                        >
                          {localFilters.categories.includes(type.id) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="text-slate-900">{type.label}</span>
                      </div>
                      <span className="text-slate-400">{type.count.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </FilterDropdown>
            </div>

            {/* Brand */}
            {brandOptions.length > 0 && (
              <div className="relative hidden sm:block">
                <FilterPill
                  label={
                    localFilters.brands.length ? `Brand (${localFilters.brands.length})` : "Brand"
                  }
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
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-50"
                      >
                        <div
                          className={cx(
                            "flex h-4 w-4 items-center justify-center rounded border",
                            localFilters.brands.includes(brand.id)
                              ? "border-[#ff6a00] bg-[#ff6a00]"
                              : "border-slate-300"
                          )}
                        >
                          {localFilters.brands.includes(brand.id) && (
                            <Check className="h-2.5 w-2.5 text-white" />
                          )}
                        </div>
                        <span className="truncate text-slate-900">{brand.label}</span>
                        <span className="ml-auto text-xs text-slate-400">{brand.count}</span>
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
                className={cx(
                  "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
                  activeFiltersCount > 0
                    ? "border-[#ff6a00] bg-orange-50 text-[#ff6a00]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                More filters
                {activeFiltersCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff6a00] text-xs text-white">
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
                    <label className="mb-2 block text-sm font-medium text-slate-900">
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
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                      <span className="text-slate-300">—</span>
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
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">Year</label>
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
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                      <span className="text-slate-300">—</span>
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
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>
                  </div>

                  {/* Cabins */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Minimum cabins
                    </label>
                    <div className="flex gap-2">
                      {["1", "2", "3", "4", "5"].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() =>
                            setLocalFilters((prev) => ({
                              ...prev,
                              cabinsMin:
                                prev.cabinsMin === parseInt(val) ? undefined : parseInt(val),
                            }))
                          }
                          className={cx(
                            "flex-1 rounded-lg border py-2 text-sm font-medium transition-all",
                            localFilters.cabinsMin === parseInt(val)
                              ? "border-[#ff6a00] bg-orange-50 text-[#ff6a00]"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          )}
                        >
                          {val}+
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Fuel type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FUEL_TYPES.map((fuel) => (
                        <button
                          key={fuel.id}
                          type="button"
                          onClick={() => toggleFuelType(fuel.id)}
                          className={cx(
                            "rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
                            localFilters.fuelTypes.includes(fuel.id)
                              ? "border-[#ff6a00] bg-orange-50 text-[#ff6a00]"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          )}
                        >
                          {fuel.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Condition
                    </label>
                    <div className="flex gap-2">
                      {[
                        { id: "", label: "All" },
                        { id: "new", label: "New" },
                        { id: "used", label: "Used" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setLocalFilters((prev) => ({ ...prev, condition: opt.id }))
                          }
                          className={cx(
                            "flex-1 rounded-lg border py-2 text-sm font-medium transition-all",
                            localFilters.condition === opt.id
                              ? "border-[#ff6a00] bg-orange-50 text-[#ff6a00]"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seller Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">
                      Seller type
                    </label>
                    <div className="flex gap-2">
                      {[
                        { id: "", label: "All" },
                        { id: "pro", label: "Professional" },
                        { id: "private", label: "Private" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setLocalFilters((prev) => ({ ...prev, sellerType: opt.id }))
                          }
                          className={cx(
                            "flex-1 rounded-lg border py-2 text-sm font-medium transition-all",
                            localFilters.sellerType === opt.id
                              ? "border-[#ff6a00] bg-orange-50 text-[#ff6a00]"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Clear all
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      applyFilters(localFilters);
                      setActiveDropdown(null);
                    }}
                    className="flex-1 rounded-lg bg-[#ff6a00] py-2.5 text-sm font-semibold text-white hover:brightness-110"
                  >
                    Show results
                  </button>
                </div>
              </FilterDropdown>
            </div>
          </div>

          {/* Sort & View row */}
          <div className="mt-3 flex items-center justify-between gap-4">
            {/* Category quick links */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Link
                href="/buy"
                className={cx(
                  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium no-underline",
                  localFilters.categories.length === 0
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                All boats
              </Link>
              {BOAT_CATEGORIES.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    applyFilters({ categories: [cat.id] });
                  }}
                  className={cx(
                    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    localFilters.categories.includes(cat.id)
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort & View */}
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => toggleDropdown("sort")}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  {SORT_OPTIONS.find((s) => s.id === localFilters.sort)?.label || "Sort"}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {activeDropdown === "sort" && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                    <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            applyFilters({ sort: option.id });
                            setActiveDropdown(null);
                          }}
                          className={cx(
                            "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50",
                            localFilters.sort === option.id ? "text-[#ff6a00]" : "text-slate-700"
                          )}
                        >
                          {option.label}
                          {localFilters.sort === option.id && <Check className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 sm:flex">
                <button
                  type="button"
                  onClick={() => applyFilters({ view: "list" }, false)}
                  className={cx(
                    "rounded-md p-1.5",
                    localFilters.view === "list"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFilters({ view: "grid" }, false)}
                  className={cx(
                    "rounded-md p-1.5",
                    localFilters.view === "grid"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  )}
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
            <h1 className="text-2xl font-bold text-slate-900">Boats for sale</h1>
            <p className="mt-1 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{totalCount.toLocaleString()}</span>{" "}
              boats available
            </p>
          </div>

          <Link
            href={`/searches/save?${searchParams.toString()}`}
            className="hidden items-center gap-2 rounded-lg bg-[#ff6a00] px-4 py-2.5 text-sm font-semibold text-white no-underline hover:brightness-110 sm:inline-flex"
          >
            <Bell className="h-4 w-4" />
            Save search
          </Link>
        </div>

        {/* Active filters chips */}
        {hasFilters && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">Active filters:</span>

            {localFilters.q && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#ff6a00]">
                &quot;{localFilters.q}&quot;
                <button
                  type="button"
                  onClick={() => applyFilters({ q: "" })}
                  className="ml-1 rounded-full hover:bg-orange-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}

            {localFilters.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#ff6a00]">
                <MapPin className="h-3.5 w-3.5" />
                {localFilters.location}
                <button
                  type="button"
                  onClick={() => applyFilters({ location: "" })}
                  className="ml-1 rounded-full hover:bg-orange-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}

            {(localFilters.priceMin || localFilters.priceMax) && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#ff6a00]">
                €{localFilters.priceMin?.toLocaleString() || "0"} - €
                {localFilters.priceMax?.toLocaleString() || "∞"}
                <button
                  type="button"
                  onClick={() => applyFilters({ priceMin: undefined, priceMax: undefined })}
                  className="ml-1 rounded-full hover:bg-orange-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}

            {localFilters.categories.map((catId) => {
              const cat = BOAT_CATEGORIES.find((c) => c.id === catId);
              return (
                <span
                  key={catId}
                  className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#ff6a00]"
                >
                  {cat?.label || catId}
                  <button
                    type="button"
                    onClick={() => toggleCategory(catId)}
                    className="ml-1 rounded-full hover:bg-orange-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              );
            })}

            {localFilters.brands.map((brandId) => {
              const brand = brandOptions.find((b) => b.id === brandId);
              return (
                <span
                  key={brandId}
                  className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#ff6a00]"
                >
                  {brand?.label || brandId}
                  <button
                    type="button"
                    onClick={() => toggleBrand(brandId)}
                    className="ml-1 rounded-full hover:bg-orange-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              );
            })}

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <div className="mt-4 text-center text-sm text-slate-500">
              Page {currentPage} of {totalPages} • {totalCount.toLocaleString()} boats total
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Floating save search button */}
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 sm:hidden">
        <Link
          href={`/searches/save?${searchParams.toString()}`}
          className="inline-flex items-center gap-2 rounded-full bg-[#ff6a00] px-6 py-3 text-sm font-semibold text-white shadow-lg no-underline hover:brightness-110"
        >
          <Bell className="h-4 w-4" />
          Save search
        </Link>
      </div>
    </main>
  );
}