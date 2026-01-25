// app/buy/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MapPin,
  ChevronDown,
  ChevronRight,
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
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

type Boat = {
  id: string;
  title: string;
  price: number;
  priceLabel?: string;
  location: string;
  country: string;
  year: number;
  length: number; // in feet
  lengthM: number; // in meters
  type: string;
  brand: string;
  model: string;
  fuelType?: string;
  cabins?: number;
  berths?: number;
  engineHours?: number;
  images: string[];
  badge?: "featured" | "verified" | "hot" | "new" | "price-drop";
  isPro?: boolean;
  sellerName?: string;
  sellerLocation?: string;
  createdAt: string;
};

type FilterState = {
  search: string;
  location: string;
  priceMin: string;
  priceMax: string;
  lengthMin: string;
  lengthMax: string;
  yearMin: string;
  yearMax: string;
  types: string[];
  brands: string[];
  fuelTypes: string[];
  cabinsMin: string;
  sellerType: "all" | "pro" | "private";
};

// ============================================================================
// MOCK DATA
// ============================================================================

const BOAT_TYPES = [
  { id: "sailboat", label: "Sailboats", count: 3420 },
  { id: "motor-yacht", label: "Motor Yachts", count: 4850 },
  { id: "catamaran", label: "Catamarans", count: 1230 },
  { id: "rib", label: "RIBs & Tenders", count: 890 },
  { id: "superyacht", label: "Superyachts", count: 156 },
  { id: "fishing", label: "Fishing Boats", count: 720 },
  { id: "dinghy", label: "Dinghies", count: 340 },
  { id: "jetski", label: "Jet Skis & PWC", count: 280 },
];

const BRANDS = [
  { id: "beneteau", label: "Beneteau", count: 1240 },
  { id: "jeanneau", label: "Jeanneau", count: 980 },
  { id: "sunseeker", label: "Sunseeker", count: 420 },
  { id: "princess", label: "Princess", count: 380 },
  { id: "lagoon", label: "Lagoon", count: 560 },
  { id: "azimut", label: "Azimut", count: 290 },
  { id: "ferretti", label: "Ferretti", count: 180 },
  { id: "bavaria", label: "Bavaria", count: 870 },
  { id: "dufour", label: "Dufour", count: 620 },
  { id: "hanse", label: "Hanse", count: 540 },
  { id: "fountaine-pajot", label: "Fountaine Pajot", count: 320 },
  { id: "axopar", label: "Axopar", count: 180 },
];

const LOCATIONS = [
  { id: "french-riviera", label: "French Riviera", count: 1840 },
  { id: "balearics", label: "Balearics", count: 1420 },
  { id: "croatia", label: "Croatia", count: 980 },
  { id: "greece", label: "Greece", count: 1120 },
  { id: "italy", label: "Italy", count: 1560 },
  { id: "uk", label: "United Kingdom", count: 2100 },
  { id: "netherlands", label: "Netherlands", count: 890 },
  { id: "turkey", label: "Turkey", count: 620 },
];

const FUEL_TYPES = [
  { id: "diesel", label: "Diesel", count: 5200 },
  { id: "petrol", label: "Petrol", count: 2100 },
  { id: "electric", label: "Electric", count: 180 },
  { id: "hybrid", label: "Hybrid", count: 90 },
  { id: "sail", label: "Sail only", count: 2400 },
];

const MOCK_BOATS: Boat[] = [
  {
    id: "1",
    title: "Beneteau Oceanis 46.1",
    price: 285000,
    location: "Palma de Mallorca",
    country: "ES",
    year: 2019,
    length: 46,
    lengthM: 14.0,
    type: "Sailboat",
    brand: "Beneteau",
    model: "Oceanis 46.1",
    cabins: 4,
    berths: 8,
    fuelType: "Diesel",
    images: [],
    badge: "verified",
    isPro: true,
    sellerName: "Mediterranean Yachts",
    sellerLocation: "Palma, ES",
    createdAt: "2025-01-20",
  },
  {
    id: "2",
    title: "Sunseeker Predator 50",
    price: 590000,
    location: "Cannes",
    country: "FR",
    year: 2016,
    length: 50,
    lengthM: 15.2,
    type: "Motor Yacht",
    brand: "Sunseeker",
    model: "Predator 50",
    cabins: 3,
    berths: 6,
    fuelType: "Diesel",
    engineHours: 420,
    images: [],
    badge: "featured",
    isPro: true,
    sellerName: "Riviera Boats",
    sellerLocation: "Cannes, FR",
    createdAt: "2025-01-18",
  },
  {
    id: "3",
    title: "Lagoon 42 Catamaran",
    price: 420000,
    location: "Split",
    country: "HR",
    year: 2020,
    length: 42,
    lengthM: 12.8,
    type: "Catamaran",
    brand: "Lagoon",
    model: "42",
    cabins: 4,
    berths: 10,
    fuelType: "Diesel",
    images: [],
    badge: "hot",
    isPro: false,
    sellerName: "Ivan M.",
    sellerLocation: "Split, HR",
    createdAt: "2025-01-19",
  },
  {
    id: "4",
    title: "Princess V40",
    price: 345000,
    location: "Antibes",
    country: "FR",
    year: 2018,
    length: 40,
    lengthM: 12.2,
    type: "Motor Yacht",
    brand: "Princess",
    model: "V40",
    cabins: 2,
    berths: 4,
    fuelType: "Diesel",
    engineHours: 280,
    images: [],
    isPro: true,
    sellerName: "Antibes Yacht Sales",
    sellerLocation: "Antibes, FR",
    createdAt: "2025-01-17",
  },
  {
    id: "5",
    title: "Jeanneau Sun Odyssey 409",
    price: 165000,
    location: "Athens",
    country: "GR",
    year: 2015,
    length: 41,
    lengthM: 12.5,
    type: "Sailboat",
    brand: "Jeanneau",
    model: "Sun Odyssey 409",
    cabins: 3,
    berths: 6,
    fuelType: "Diesel",
    images: [],
    isPro: false,
    sellerName: "Nikos P.",
    sellerLocation: "Athens, GR",
    createdAt: "2025-01-16",
  },
  {
    id: "6",
    title: "Azimut 55",
    price: 780000,
    location: "Ibiza",
    country: "ES",
    year: 2017,
    length: 55,
    lengthM: 16.8,
    type: "Motor Yacht",
    brand: "Azimut",
    model: "55",
    cabins: 3,
    berths: 6,
    fuelType: "Diesel",
    engineHours: 520,
    images: [],
    badge: "featured",
    isPro: true,
    sellerName: "Ibiza Luxury Yachts",
    sellerLocation: "Ibiza, ES",
    createdAt: "2025-01-21",
  },
  {
    id: "7",
    title: "Bavaria Cruiser 46",
    price: 195000,
    location: "Trogir",
    country: "HR",
    year: 2017,
    length: 46,
    lengthM: 14.0,
    type: "Sailboat",
    brand: "Bavaria",
    model: "Cruiser 46",
    cabins: 4,
    berths: 8,
    fuelType: "Diesel",
    images: [],
    isPro: true,
    sellerName: "Croatia Yachting",
    sellerLocation: "Trogir, HR",
    createdAt: "2025-01-15",
  },
  {
    id: "8",
    title: "Axopar 37 Sun Top",
    price: 245000,
    priceLabel: "New",
    location: "Southampton",
    country: "UK",
    year: 2024,
    length: 37,
    lengthM: 11.3,
    type: "Motor Yacht",
    brand: "Axopar",
    model: "37 Sun Top",
    cabins: 1,
    berths: 2,
    fuelType: "Petrol",
    images: [],
    badge: "new",
    isPro: true,
    sellerName: "Axopar UK",
    sellerLocation: "Southampton, UK",
    createdAt: "2025-01-22",
  },
  {
    id: "9",
    title: "Fountaine Pajot Isla 40",
    price: 495000,
    location: "La Rochelle",
    country: "FR",
    year: 2022,
    length: 40,
    lengthM: 12.2,
    type: "Catamaran",
    brand: "Fountaine Pajot",
    model: "Isla 40",
    cabins: 4,
    berths: 8,
    fuelType: "Diesel",
    images: [],
    badge: "verified",
    isPro: true,
    sellerName: "FP Dealer France",
    sellerLocation: "La Rochelle, FR",
    createdAt: "2025-01-14",
  },
  {
    id: "10",
    title: "Ferretti 550",
    price: 890000,
    priceLabel: "Price drop",
    location: "Monaco",
    country: "MC",
    year: 2018,
    length: 55,
    lengthM: 16.8,
    type: "Motor Yacht",
    brand: "Ferretti",
    model: "550",
    cabins: 3,
    berths: 6,
    fuelType: "Diesel",
    engineHours: 380,
    images: [],
    badge: "price-drop",
    isPro: true,
    sellerName: "Monaco Yacht Partners",
    sellerLocation: "Monaco, MC",
    createdAt: "2025-01-13",
  },
];

const SORT_OPTIONS = [
  { id: "relevance", label: "Relevance" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
  { id: "year-desc", label: "Year: Newest" },
  { id: "year-asc", label: "Year: Oldest" },
  { id: "length-desc", label: "Length: Longest" },
  { id: "length-asc", label: "Length: Shortest" },
];

// ============================================================================
// COMPONENTS
// ============================================================================

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function Badge({ type }: { type: Boat["badge"] }) {
  const config = {
    featured: { label: "Featured", bg: "bg-amber-50", text: "text-amber-700", icon: Sparkles },
    verified: { label: "Verified", bg: "bg-emerald-50", text: "text-emerald-700", icon: Shield },
    hot: { label: "Hot", bg: "bg-rose-50", text: "text-rose-700", icon: Sparkles },
    new: { label: "New", bg: "bg-sky-50", text: "text-sky-700", icon: Sparkles },
    "price-drop": { label: "Price drop", bg: "bg-violet-50", text: "text-violet-700", icon: Sparkles },
  };

  if (!type) return null;
  const c = config[type];
  const Icon = c.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${c.bg} ${c.text}`}>
      <Icon className="h-3 w-3" />
      {c.label}
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
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
        active || hasValue
          ? "border-[#ff6a00] bg-orange-50 text-[#ff6a00]"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {label}
      <ChevronDown className={`h-4 w-4 transition-transform ${active ? "rotate-180" : ""}`} />
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
        className={`absolute left-0 top-full z-50 mt-2 ${width} rounded-xl border border-slate-200 bg-white p-4 shadow-xl`}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-slate-100">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

function BoatCard({ boat, view }: { boat: Boat; view: "list" | "grid" }) {
  const [isSaved, setIsSaved] = useState(false);

  if (view === "grid") {
    return (
      <Link
        href={`/buy/${boat.id}`}
        className="group overflow-hidden rounded-xl border border-slate-200 bg-white no-underline transition-all hover:border-slate-300 hover:shadow-lg"
      >
        <div className="relative aspect-4/3 bg-linear-to-br from-slate-100 to-slate-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <Sailboat className="h-12 w-12 text-slate-200" />
          </div>
          {boat.badge && (
            <div className="absolute left-3 top-0">
              <Badge type={boat.badge} />
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : "text-slate-600"}`} />
          </button>
        </div>
        <div className="p-4">
          <div className="text-base font-semibold text-slate-900 group-hover:text-[#ff6a00]">{boat.title}</div>
          <div className="mt-1 text-sm text-slate-500">
            {boat.length} ft • {boat.year} • {boat.location}
          </div>
          <div className="mt-3 text-lg font-bold text-slate-900">{formatPrice(boat.price)}</div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            {boat.isPro ? <Building2 className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
            {boat.sellerName}
          </div>
        </div>
      </Link>
    );
  }

  // List view (Leboncoin-style horizontal)
  return (
    <Link
      href={`/buy/${boat.id}`}
      className="group flex gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 no-underline transition-all hover:border-slate-300 hover:shadow-lg sm:gap-5 sm:p-4"
    >
      {/* Image */}
      <div className="relative h-32 w-44 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-slate-100 to-slate-50 sm:h-40 sm:w-56">
        <div className="absolute inset-0 flex items-center justify-center">
          <Sailboat className="h-12 w-12 text-slate-200" />
        </div>
        {boat.badge && (
          <div className="absolute left-2 top-2">
            <Badge type={boat.badge} />
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
          className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : "text-slate-600"}`} />
        </button>
        {/* Image dots indicator */}
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === 1 ? "bg-white" : "bg-white/50"}`} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col py-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-[#ff6a00] sm:text-lg">
              {boat.title}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-base font-bold text-[#ff6a00] sm:text-lg">
              {formatPrice(boat.price)}
              {boat.priceLabel && (
                <span className="ml-2 text-xs font-medium text-slate-500">{boat.priceLabel}</span>
              )}
            </div>
          </div>
        </div>

        {/* Specs row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Year</span>
            <span className="font-medium text-slate-900">{boat.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Length</span>
            <span className="font-medium text-slate-900">{boat.length} ft</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Type</span>
            <span className="font-medium text-slate-900">{boat.type}</span>
          </div>
          {boat.cabins && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Cabins</span>
              <span className="font-medium text-slate-900">{boat.cabins}</span>
            </div>
          )}
          {boat.engineHours && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Engine</span>
              <span className="font-medium text-slate-900">{boat.engineHours} hrs</span>
            </div>
          )}
        </div>

        {/* Seller info */}
        <div className="mt-auto flex items-center gap-3 pt-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
            {boat.isPro ? (
              <Building2 className="h-4 w-4 text-slate-600" />
            ) : (
              <User className="h-4 w-4 text-slate-600" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium text-slate-900">{boat.sellerName}</span>
              {boat.isPro && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">Pro</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" />
              {boat.sellerLocation}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function BuyPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    location: "",
    priceMin: "",
    priceMax: "",
    lengthMin: "",
    lengthMax: "",
    yearMin: "",
    yearMax: "",
    types: [],
    brands: [],
    fuelTypes: [],
    cabinsMin: "",
    sellerType: "all",
  });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [view, setView] = useState<"list" | "grid">("list");
  const [] = useState(false);

  const totalResults = 12450;

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const toggleType = (typeId: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(typeId)
        ? prev.types.filter((t) => t !== typeId)
        : [...prev.types, typeId],
    }));
  };

  const toggleBrand = (brandId: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter((b) => b !== brandId)
        : [...prev.brands, brandId],
    }));
  };

  const activeFiltersCount =
    (filters.priceMin || filters.priceMax ? 1 : 0) +
    (filters.lengthMin || filters.lengthMax ? 1 : 0) +
    (filters.yearMin || filters.yearMax ? 1 : 0) +
    filters.types.length +
    filters.brands.length +
    filters.fuelTypes.length +
    (filters.cabinsMin ? 1 : 0) +
    (filters.sellerType !== "all" ? 1 : 0) +
    (filters.location ? 1 : 0);

  return (
    <main className="min-h-screen w-full bg-slate-50">
      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 w-full border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          {/* Top row: Main filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Location */}
            <div className="relative">
              <FilterPill
                label={filters.location || "Location"}
                active={activeDropdown === "location"}
                onClick={() => toggleDropdown("location")}
                hasValue={!!filters.location}
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
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-slate-300"
                    />
                  </div>
                </div>
                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, location: loc.label }));
                        setActiveDropdown(null);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      <span className="text-slate-900">{loc.label}</span>
                      <span className="text-slate-400">{loc.count.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </FilterDropdown>
            </div>

            {/* Price */}
            <div className="relative">
              <FilterPill
                label={
                  filters.priceMin || filters.priceMax
                    ? `€${filters.priceMin || "0"} - €${filters.priceMax || "∞"}`
                    : "Price"
                }
                active={activeDropdown === "price"}
                onClick={() => toggleDropdown("price")}
                hasValue={!!(filters.priceMin || filters.priceMax)}
              />
              <FilterDropdown
                title="Price range"
                isOpen={activeDropdown === "price"}
                onClose={() => setActiveDropdown(null)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-slate-500">Min</label>
                    <input
                      type="text"
                      placeholder="€0"
                      value={filters.priceMin}
                      onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-300"
                    />
                  </div>
                  <span className="mt-5 text-slate-300">—</span>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-slate-500">Max</label>
                    <input
                      type="text"
                      placeholder="No max"
                      value={filters.priceMax}
                      onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-300"
                    />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["50000", "100000", "250000", "500000", "1000000"].map((val) => (
                    <button
                      key={val}
                      onClick={() => setFilters((prev) => ({ ...prev, priceMax: val }))}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                    >
                      &lt; €{parseInt(val).toLocaleString()}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setActiveDropdown(null)}
                  className="mt-4 w-full rounded-lg bg-[#ff6a00] py-2 text-sm font-semibold text-white hover:brightness-110"
                >
                  Apply
                </button>
              </FilterDropdown>
            </div>

            {/* Boat Type */}
            <div className="relative">
              <FilterPill
                label={filters.types.length ? `Type (${filters.types.length})` : "Boat type"}
                active={activeDropdown === "type"}
                onClick={() => toggleDropdown("type")}
                hasValue={filters.types.length > 0}
              />
              <FilterDropdown
                title="Boat type"
                isOpen={activeDropdown === "type"}
                onClose={() => setActiveDropdown(null)}
              >
                <div className="space-y-1">
                  {BOAT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => toggleType(type.id)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            filters.types.includes(type.id)
                              ? "border-[#ff6a00] bg-[#ff6a00]"
                              : "border-slate-300"
                          }`}
                        >
                          {filters.types.includes(type.id) && <Check className="h-3 w-3 text-white" />}
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
            <div className="relative hidden sm:block">
              <FilterPill
                label={filters.brands.length ? `Brand (${filters.brands.length})` : "Brand"}
                active={activeDropdown === "brand"}
                onClick={() => toggleDropdown("brand")}
                hasValue={filters.brands.length > 0}
              />
              <FilterDropdown
                title="Brand"
                isOpen={activeDropdown === "brand"}
                onClose={() => setActiveDropdown(null)}
                width="w-96"
              >
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search brands..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-300"
                  />
                </div>
                <div className="grid max-h-64 grid-cols-2 gap-1 overflow-y-auto">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => toggleBrand(brand.id)}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-50"
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          filters.brands.includes(brand.id)
                            ? "border-[#ff6a00] bg-[#ff6a00]"
                            : "border-slate-300"
                        }`}
                      >
                        {filters.brands.includes(brand.id) && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                      <span className="truncate text-slate-900">{brand.label}</span>
                      <span className="ml-auto text-xs text-slate-400">{brand.count}</span>
                    </button>
                  ))}
                </div>
              </FilterDropdown>
            </div>

            {/* More Filters */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("more")}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                  activeFiltersCount > 0
                    ? "border-[#ff6a00] bg-orange-50 text-[#ff6a00]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
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
                    <label className="mb-2 block text-sm font-medium text-slate-900">Length (ft)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Min"
                        value={filters.lengthMin}
                        onChange={(e) => setFilters((prev) => ({ ...prev, lengthMin: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                      <span className="text-slate-300">—</span>
                      <input
                        type="text"
                        placeholder="Max"
                        value={filters.lengthMax}
                        onChange={(e) => setFilters((prev) => ({ ...prev, lengthMax: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">Year</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="From"
                        value={filters.yearMin}
                        onChange={(e) => setFilters((prev) => ({ ...prev, yearMin: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                      <span className="text-slate-300">—</span>
                      <input
                        type="text"
                        placeholder="To"
                        value={filters.yearMax}
                        onChange={(e) => setFilters((prev) => ({ ...prev, yearMax: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>
                  </div>

                  {/* Cabins */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">Minimum cabins</label>
                    <div className="flex gap-2">
                      {["1", "2", "3", "4", "5+"].map((val) => (
                        <button
                          key={val}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              cabinsMin: prev.cabinsMin === val ? "" : val,
                            }))
                          }
                          className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-all ${
                            filters.cabinsMin === val
                              ? "border-[#ff6a00] bg-orange-50 text-[#ff6a00]"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">Fuel type</label>
                    <div className="flex flex-wrap gap-2">
                      {FUEL_TYPES.map((fuel) => (
                        <button
                          key={fuel.id}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              fuelTypes: prev.fuelTypes.includes(fuel.id)
                                ? prev.fuelTypes.filter((f) => f !== fuel.id)
                                : [...prev.fuelTypes, fuel.id],
                            }))
                          }
                          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                            filters.fuelTypes.includes(fuel.id)
                              ? "border-[#ff6a00] bg-orange-50 text-[#ff6a00]"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {fuel.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seller Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">Seller type</label>
                    <div className="flex gap-2">
                      {[
                        { id: "all", label: "All" },
                        { id: "pro", label: "Professional" },
                        { id: "private", label: "Private" },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              sellerType: option.id as FilterState["sellerType"],
                            }))
                          }
                          className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-all ${
                            filters.sellerType === option.id
                              ? "border-[#ff6a00] bg-orange-50 text-[#ff6a00]"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() =>
                      setFilters({
                        search: "",
                        location: "",
                        priceMin: "",
                        priceMax: "",
                        lengthMin: "",
                        lengthMax: "",
                        yearMin: "",
                        yearMax: "",
                        types: [],
                        brands: [],
                        fuelTypes: [],
                        cabinsMin: "",
                        sellerType: "all",
                      })
                    }
                    className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setActiveDropdown(null)}
                    className="flex-1 rounded-lg bg-[#ff6a00] py-2.5 text-sm font-semibold text-white hover:brightness-110"
                  >
                    Show results
                  </button>
                </div>
              </FilterDropdown>
            </div>
          </div>

          {/* Second row: Category pills & Sort */}
          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Link
                href="/buy"
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white no-underline"
              >
                All boats
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              {BOAT_TYPES.slice(0, 5).map((type) => (
                <Link
                  key={type.id}
                  href={`/buy/${type.id}`}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 no-underline hover:border-slate-300 hover:bg-slate-50"
                >
                  {type.label}
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              ))}
            </div>

            {/* Sort & View toggle */}
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <button
                  onClick={() => toggleDropdown("sort")}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {activeDropdown === "sort" && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                    <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSortBy(option.id);
                            setActiveDropdown(null);
                          }}
                          className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                            sortBy === option.id ? "text-[#ff6a00]" : "text-slate-700"
                          }`}
                        >
                          {option.label}
                          {sortBy === option.id && <Check className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 sm:flex">
                <button
                  onClick={() => setView("list")}
                  className={`rounded-md p-1.5 ${view === "list" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={`rounded-md p-1.5 ${view === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
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
              <span className="font-semibold text-slate-700">{totalResults.toLocaleString()}</span> boats available
            </p>
          </div>

          {/* Save search button */}
          <button className="hidden items-center gap-2 rounded-lg bg-[#ff6a00] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 sm:inline-flex">
            <Bell className="h-4 w-4" />
            Save search
          </button>
        </div>

        {/* Active filters chips */}
        {activeFiltersCount > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">Active filters:</span>
            {filters.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#ff6a00]">
                <MapPin className="h-3.5 w-3.5" />
                {filters.location}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, location: "" }))}
                  className="ml-1 rounded-full hover:bg-orange-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            {(filters.priceMin || filters.priceMax) && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#ff6a00]">
                €{filters.priceMin || "0"} - €{filters.priceMax || "∞"}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, priceMin: "", priceMax: "" }))}
                  className="ml-1 rounded-full hover:bg-orange-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            {filters.types.map((typeId) => {
              const type = BOAT_TYPES.find((t) => t.id === typeId);
              return (
                <span
                  key={typeId}
                  className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#ff6a00]"
                >
                  {type?.label}
                  <button onClick={() => toggleType(typeId)} className="ml-1 rounded-full hover:bg-orange-200">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              );
            })}
            {filters.brands.map((brandId) => {
              const brand = BRANDS.find((b) => b.id === brandId);
              return (
                <span
                  key={brandId}
                  className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#ff6a00]"
                >
                  {brand?.label}
                  <button onClick={() => toggleBrand(brandId)} className="ml-1 rounded-full hover:bg-orange-200">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              );
            })}
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  location: "",
                  priceMin: "",
                  priceMax: "",
                  lengthMin: "",
                  lengthMax: "",
                  yearMin: "",
                  yearMax: "",
                  types: [],
                  brands: [],
                  fuelTypes: [],
                  cabinsMin: "",
                  sellerType: "all",
                })
              }
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results grid/list */}
        <div
          className={
            view === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "flex flex-col gap-4"
          }
        >
          {MOCK_BOATS.map((boat) => (
            <BoatCard key={boat.id} boat={boat} view={view} />
          ))}
        </div>

        {/* Load more */}
        <div className="mt-8 flex justify-center">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-900 hover:border-slate-300 hover:bg-slate-50">
            Load more boats
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Pagination info */}
        <div className="mt-4 text-center text-sm text-slate-500">
          Showing 1-10 of {totalResults.toLocaleString()} boats
        </div>
      </div>

      {/* Mobile: Floating save search button */}
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 sm:hidden">
        <button className="inline-flex items-center gap-2 rounded-full bg-[#ff6a00] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:brightness-110">
          <Bell className="h-4 w-4" />
          Save search
        </button>
      </div>
    </main>
  );
}