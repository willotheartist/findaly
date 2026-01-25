"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Flag,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Ruler,
  Anchor,
  Bed,
  Gauge,
  Ship,
  Shield,
  MessageCircle,
  Phone,
  Building2,
  User,
  Clock,
  Check,
  ChevronDown,
  Sailboat,
  Navigation,
  Settings,
  Info,
  FileText,
  Camera,
  Star,
  BadgeCheck,
  CircleDot,
} from "lucide-react";

type BoatListing = {
  id: string;
  slug: string;
  title: string;
  price: number;
  priceNegotiable?: boolean;
  currency: string;
  location: string;
  country: string;

  year: number;
  length: number;
  lengthM: number;
  beam: number;
  beamM: number;
  draft: number;
  draftM: number;
  displacement?: string;

  type: string;
  category: string;
  brand: string;
  model: string;
  hullMaterial: string;
  hullType: string;
  hullColor?: string;

  engineMake?: string;
  engineModel?: string;
  enginePower?: number;
  engineHours?: number;
  fuelType: string;
  fuelCapacity?: number;

  cabins?: number;
  berths?: number;
  heads?: number;

  features: string[];
  electronics: string[];
  safetyEquipment: string[];

  images: string[];
  videoUrl?: string;

  seller: {
    id: string;
    name: string;
    type: "pro" | "private";
    company?: string;
    location: string;
    phone?: string;
    responseTime?: string;
    memberSince: string;
    listingsCount?: number;
    verified?: boolean;
    website?: string;
  };

  description: string;
  condition: string;
  taxStatus?: string;
  lying?: string;

  badge?: "featured" | "verified" | "hot" | "new" | "price-drop";
  createdAt: string;
  updatedAt: string;
};

function formatPrice(price: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function Badge({ type }: { type: BoatListing["badge"] }) {
  if (!type) return null;

  const config = {
    featured: { label: "Featured", bg: "bg-amber-500", Icon: Star },
    verified: { label: "Verified", bg: "bg-emerald-500", Icon: Shield },
    hot: { label: "Hot", bg: "bg-rose-500", Icon: Star },
    new: { label: "New", bg: "bg-sky-500", Icon: Star },
    "price-drop": { label: "Price drop", bg: "bg-violet-500", Icon: Star },
  };

  const c = config[type];
  const IconComponent = c.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${c.bg} px-3 py-1.5 text-sm font-semibold text-white`}
    >
      <IconComponent className="h-3.5 w-3.5" />
      {c.label}
    </span>
  );
}

function SpecItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
        <Icon className="h-5 w-5 text-slate-600" />
      </div>
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="font-semibold text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function FeatureList({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: typeof Anchor;
}) {
  const [expanded, setExpanded] = useState(false);
  const displayItems = expanded ? items : items.slice(0, 6);
  const hasMore = items.length > 6;

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-slate-600" />
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <span className="ml-auto text-sm text-slate-500">{items.length} items</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {displayItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
            <Check className="h-4 w-4 shrink-0 text-emerald-500" />
            {item}
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#ff6a00] hover:underline"
        >
          {expanded ? "Show less" : `Show all ${items.length}`}
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}

function ImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [""];

  const prev = () => setCurrentIndex((i) => (i === 0 ? displayImages.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === displayImages.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-linear-to-br from-slate-100 to-slate-50">
        {displayImages[currentIndex] ? (
          <img
            src={displayImages[currentIndex]}
            alt="Listing photo"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sailboat className="h-24 w-24 text-slate-200" />
          </div>
        )}

        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5 text-slate-700" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
            >
              <ChevronRight className="h-5 w-5 text-slate-700" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
          <Camera className="h-4 w-4" />
          {currentIndex + 1} / {displayImages.length}
        </div>
      </div>

      {displayImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((img, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-slate-100 to-slate-50 transition-all ${
                i === currentIndex ? "ring-2 ring-[#ff6a00] ring-offset-2" : "opacity-70 hover:opacity-100"
              }`}
            >
              {img ? (
                <img src={img} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sailboat className="h-6 w-6 text-slate-300" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function SellerCard({ seller, listing }: { seller: BoatListing["seller"]; listing: BoatListing }) {
  const [showPhone, setShowPhone] = useState(false);
  const [messageText, setMessageText] = useState(
    `Hi, I'm interested in the ${listing.title} listed at ${formatPrice(listing.price, listing.currency)}. Is it still available?`
  );

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    const msg = messageText.trim();
    if (!msg || sending) return;

    setSending(true);
    setSent(false);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 600));
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            {seller.type === "pro" ? (
              <Building2 className="h-6 w-6 text-slate-600" />
            ) : (
              <User className="h-6 w-6 text-slate-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{seller.company || seller.name}</span>
              {seller.verified && <BadgeCheck className="h-5 w-5 text-sky-500" />}
            </div>
            {seller.company && <div className="text-sm text-slate-500">{seller.name}</div>}
            <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {seller.location}
            </div>
          </div>
          {seller.type === "pro" && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">Pro</span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm">
          {seller.listingsCount !== undefined && seller.listingsCount > 0 && (
            <div className="text-slate-500">
              <span className="font-medium text-slate-700">{seller.listingsCount}</span> listings
            </div>
          )}
        </div>

        {seller.responseTime && (
          <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
            <Clock className="h-4 w-4" />
            {seller.responseTime}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Your message</label>
          <textarea
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              if (sent) setSent(false);
              if (error) setError(null);
            }}
            id="contact-message"
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-slate-300 focus:bg-white"
          />
        </div>

        <button
          type="button"
          disabled={sending || !messageText.trim()}
          onClick={handleSend}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all ${
            sending || !messageText.trim()
              ? "cursor-not-allowed bg-[#ff6a00]/60"
              : "bg-[#ff6a00] hover:brightness-110"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          {sending ? "Sending…" : sent ? "Sent ✓" : "Send message"}
        </button>

        {error && <div className="mt-3 text-sm text-rose-600">{error}</div>}

        {seller.phone && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowPhone(!showPhone)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
            >
              <Phone className="h-4 w-4" />
              {showPhone ? seller.phone : "Show phone"}
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-slate-500">
          Member since {seller.memberSince} ·{" "}
          <Link href={`/profile/${seller.id}`} className="text-[#ff6a00] hover:underline">
            View profile
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ListingPageClient({ listing }: { listing: BoatListing }) {
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "features">("description");

  return (
    <main className="min-h-screen w-full bg-slate-50">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 text-sm">
            <Link href="/buy" className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to results</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500">{listing.type}</span>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-900">{listing.brand}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                isSaved
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <ImageGallery images={listing.images} />

            <div className="lg:hidden">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {listing.badge && (
                    <div className="mb-2">
                      <Badge type={listing.badge} />
                    </div>
                  )}
                  <h1 className="text-2xl font-bold text-slate-900">{listing.title}</h1>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {listing.location}, {listing.country}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-[#ff6a00]">
                  {formatPrice(listing.price, listing.currency)}
                </div>
                {listing.priceNegotiable && <div className="mt-1 text-sm text-slate-500">Price negotiable</div>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SpecItem icon={Calendar} label="Year" value={listing.year || "—"} />
              <SpecItem icon={Ruler} label="Length" value={listing.length ? `${listing.length} ft` : "—"} />
              <SpecItem icon={Bed} label="Cabins" value={listing.cabins || "—"} />
              <SpecItem icon={Gauge} label="Engine hours" value={listing.engineHours ? `${listing.engineHours} hrs` : "—"} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white">
              <div className="flex border-b border-slate-200">
                {[
                  { id: "description", label: "Description", icon: FileText },
                  { id: "specs", label: "Specifications", icon: Settings },
                  { id: "features", label: "Features", icon: Check },
                ].map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "border-[#ff6a00] text-[#ff6a00]"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5 sm:p-6">
                {activeTab === "description" && (
                  <div className="prose prose-slate max-w-none">
                    {listing.description ? (
                      listing.description.split("\n\n").map((paragraph, i) => (
                        <p key={i} className="whitespace-pre-wrap">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="text-slate-500">No description provided.</p>
                    )}
                  </div>
                )}

                {activeTab === "specs" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                        <Ruler className="h-5 w-5 text-slate-400" />
                        Dimensions
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {listing.length > 0 && (
                          <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                            <span className="text-sm text-slate-500">Length</span>
                            <span className="text-sm font-medium text-slate-900">
                              {listing.length} ft {listing.lengthM > 0 && `(${listing.lengthM}m)`}
                            </span>
                          </div>
                        )}
                        {listing.beam > 0 && (
                          <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                            <span className="text-sm text-slate-500">Beam</span>
                            <span className="text-sm font-medium text-slate-900">
                              {listing.beam} ft {listing.beamM > 0 && `(${listing.beamM}m)`}
                            </span>
                          </div>
                        )}
                        {listing.draft > 0 && (
                          <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                            <span className="text-sm text-slate-500">Draft</span>
                            <span className="text-sm font-medium text-slate-900">
                              {listing.draft} ft {listing.draftM > 0 && `(${listing.draftM}m)`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {(listing.hullMaterial || listing.hullType) && (
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                          <Ship className="h-5 w-5 text-slate-400" />
                          Hull & Construction
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {listing.hullMaterial && (
                            <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                              <span className="text-sm text-slate-500">Material</span>
                              <span className="text-sm font-medium text-slate-900">{listing.hullMaterial}</span>
                            </div>
                          )}
                          {listing.hullType && (
                            <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                              <span className="text-sm text-slate-500">Hull type</span>
                              <span className="text-sm font-medium text-slate-900">{listing.hullType}</span>
                            </div>
                          )}
                          {listing.hullColor && (
                            <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                              <span className="text-sm text-slate-500">Colour</span>
                              <span className="text-sm font-medium text-slate-900">{listing.hullColor}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {(listing.engineMake || listing.enginePower) && (
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                          <Navigation className="h-5 w-5 text-slate-400" />
                          Propulsion
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {listing.engineMake && (
                            <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                              <span className="text-sm text-slate-500">Engine</span>
                              <span className="text-sm font-medium text-slate-900">
                                {listing.engineMake} {listing.engineModel}
                              </span>
                            </div>
                          )}
                          {listing.enginePower && (
                            <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                              <span className="text-sm text-slate-500">Power</span>
                              <span className="text-sm font-medium text-slate-900">{listing.enginePower} HP</span>
                            </div>
                          )}
                          {listing.engineHours && (
                            <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                              <span className="text-sm text-slate-500">Engine hours</span>
                              <span className="text-sm font-medium text-slate-900">{listing.engineHours} hrs</span>
                            </div>
                          )}
                          {listing.fuelType && (
                            <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                              <span className="text-sm text-slate-500">Fuel</span>
                              <span className="text-sm font-medium text-slate-900">{listing.fuelType}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {(listing.cabins || listing.berths || listing.heads) && (
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                          <Bed className="h-5 w-5 text-slate-400" />
                          Accommodation
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {listing.cabins && (
                            <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                              <span className="text-sm text-slate-500">Cabins</span>
                              <span className="text-sm font-medium text-slate-900">{listing.cabins}</span>
                            </div>
                          )}
                          {listing.berths && (
                            <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                              <span className="text-sm text-slate-500">Berths</span>
                              <span className="text-sm font-medium text-slate-900">{listing.berths}</span>
                            </div>
                          )}
                          {listing.heads && (
                            <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                              <span className="text-sm text-slate-500">Heads</span>
                              <span className="text-sm font-medium text-slate-900">{listing.heads}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "features" && (
                  <div className="space-y-4">
                    <FeatureList title="Equipment & Features" items={listing.features} icon={Anchor} />
                    <FeatureList title="Electronics & Navigation" items={listing.electronics} icon={Navigation} />
                    <FeatureList title="Safety Equipment" items={listing.safetyEquipment} icon={Shield} />
                    {listing.features.length === 0 &&
                      listing.electronics.length === 0 &&
                      listing.safetyEquipment.length === 0 && (
                        <p className="text-slate-500">No features listed.</p>
                      )}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                <Info className="h-5 w-5 text-slate-400" />
                Listing details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Condition</span>
                  <span className="text-sm font-medium text-slate-900">{listing.condition || "—"}</span>
                </div>
                {listing.taxStatus && (
                  <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-500">Tax status</span>
                    <span className="text-sm font-medium text-emerald-600">{listing.taxStatus}</span>
                  </div>
                )}
                {listing.lying && (
                  <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-500">Lying</span>
                    <span className="text-sm font-medium text-slate-900">{listing.lying}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Listed{" "}
                  {new Date(listing.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  Location
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {listing.location}, {listing.country}
                </p>
              </div>
              <div className="relative h-64 bg-linear-to-br from-sky-50 to-slate-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto h-10 w-10 text-[#ff6a00]" />
                    <p className="mt-2 text-sm font-medium text-slate-700">
                      {listing.location}, {listing.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="hidden rounded-2xl border border-slate-200 bg-white p-5 lg:block">
              {listing.badge && (
                <div className="mb-3">
                  <Badge type={listing.badge} />
                </div>
              )}
              <h1 className="text-xl font-bold text-slate-900">{listing.title}</h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {listing.location}, {listing.country}
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="text-3xl font-bold text-[#ff6a00]">
                  {formatPrice(listing.price, listing.currency)}
                </div>
                {listing.priceNegotiable && <div className="mt-1 text-sm text-slate-500">Price negotiable</div>}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
                <div className="rounded-lg bg-slate-50 py-2">
                  <div className="font-semibold text-slate-900">{listing.year || "—"}</div>
                  <div className="text-slate-500">Year</div>
                </div>
                <div className="rounded-lg bg-slate-50 py-2">
                  <div className="font-semibold text-slate-900">{listing.length ? `${listing.length} ft` : "—"}</div>
                  <div className="text-slate-500">Length</div>
                </div>
              </div>
            </div>

            <SellerCard seller={listing.seller} listing={listing} />

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all ${
                    isSaved
                      ? "border-rose-200 bg-rose-50 text-rose-600"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                  {isSaved ? "Saved to favorites" : "Save to favorites"}
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Share2 className="h-4 w-4" />
                  Share this listing
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h4 className="flex items-center gap-2 font-semibold text-amber-900">
                <Shield className="h-5 w-5" />
                Safety tips
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <CircleDot className="mt-0.5 h-4 w-4 shrink-0" />
                  Always inspect the boat in person before purchase
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="mt-0.5 h-4 w-4 shrink-0" />
                  Use a marine surveyor for pre-purchase inspection
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="mt-0.5 h-4 w-4 shrink-0" />
                  Never transfer money before seeing documentation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white p-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xl font-bold text-[#ff6a00]">{formatPrice(listing.price, listing.currency)}</div>
            <div className="text-sm text-slate-500">{listing.title}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("contact-message") as HTMLTextAreaElement | null;
              if (!el) return;
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              el.focus();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ff6a00] px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" />
            Contact
          </button>
        </div>
      </div>
    </main>
  );
}