// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import {
  ArrowRight,
  MapPin,
  Sailboat,
  Sparkles,
  ChevronRight,
  Heart,
  MessageCircle,
} from "lucide-react";

import HomeHero from "@/components/home/HomeHero";
import ThingsToDo from "@/components/home/ThingsToDo";
import BoatsForSaleSection from "@/components/home/BoatsForSaleSection";
import HomeSplitCtas from "@/components/home/HomeSplitCtas";
import GuidesRowSection from "@/components/home/GuidesRowSection";
import SaveListingButtonClient from "@/components/listing/SaveListingButtonClient";

export const metadata: Metadata = {
  title: "Findaly: Every boat. Every budget. Every need.",
  description:
    "Buy, sell, and charter boats worldwide with trusted brokers. Discover every boat for every budget on Findaly — the everything marketplace for the maritime world.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

type Tile = { title: string; href: string; subtitle?: string; emoji?: string };
type DestinationTile = { title: string; href: string; subtitle?: string; image: string };

type Card = {
  id: string;
  title: string;
  href: string;
  meta: string;
  price?: string;
  badge?: string;
  image?: string;
  sellerName?: string;
};

const DESTINATIONS: DestinationTile[] = [
  {
    title: "French Riviera",
    subtitle: "Cannes • Antibes • Monaco",
    href: "/destinations/french-riviera",
    image: "/destinations/FrenchRiviera.png",
  },
  {
    title: "Balearics",
    subtitle: "Ibiza • Mallorca",
    href: "/destinations/balearics",
    image: "/destinations/Balearics.png",
  },
  {
    title: "Amalfi Coast",
    subtitle: "Capri • Positano",
    href: "/destinations/amalfi-coast",
    image: "/destinations/Amalfi Coast.png",
  },
  {
    title: "Greece",
    subtitle: "Cyclades • Ionian",
    href: "/destinations/greece",
    image: "/destinations/Greece.png",
  },
  {
    title: "Croatia",
    subtitle: "Split • Hvar",
    href: "/destinations/croatia",
    image: "/destinations/Croatia.png",
  },
  {
    title: "Caribbean",
    subtitle: "BVI • St Barths",
    href: "/destinations/caribbean",
    image: "/destinations/Caribbean.png",
  },
  {
    title: "Dubai",
    subtitle: "Marina • Palm",
    href: "/destinations/dubai",
    image: "/destinations/Dubai.png",
  },
  {
    title: "Turkey",
    subtitle: "Bodrum • Göcek",
    href: "/destinations/turkey",
    image: "/destinations/Turkey.png",
  },
];

function SectionHeader({
  title,
  subtitle,
  href,
  cta = "See all",
}: {
  title: string;
  subtitle?: string;
  href: string;
  cta?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-1.5 text-base text-slate-500">{subtitle}</p> : null}
      </div>
      <Link
        href={href}
        className="group hidden items-center gap-2 text-sm font-medium text-slate-600 no-underline transition-colors hover:text-slate-900 sm:inline-flex"
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

/** Shared “portal-style” listing card */
function ListingCard({ it }: { it: Card }) {
  const splitMeta = (meta: string) => {
    const parts = meta
      .split("•")
      .map((s) => s.trim())
      .filter(Boolean);

    if (parts.length <= 1) return { specs: meta, location: "" };

    return {
      specs: parts.slice(0, -1).join(" • "),
      location: parts[parts.length - 1],
    };
  };

  const { specs, location } = splitMeta(it.meta);

  return (
    <Link
      href={it.href}
      className="group overflow-hidden rounded-2xl bg-white no-underline shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:shadow-md hover:ring-slate-300"
    >
      {/* Image */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        {it.image ? (
          <Image
            src={it.image}
            alt={it.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-slate-100 to-slate-50">
            <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_30%_40%,rgba(0,0,0,0.06),transparent)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sailboat className="h-16 w-16 text-slate-200 transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>
        )}

        {it.badge ? (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm ring-1 ring-black/5">
            <Sparkles className="h-3 w-3 text-[#ff6a00]" />
            {it.badge}
          </div>
        ) : null}
      </div>

      {/* Body */}
      <div className="px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="text-[22px] font-semibold tracking-tight text-slate-900">
            {it.price ?? "POA"}
          </div>

          <div className="flex items-center gap-2">
            <SaveListingButtonClient listingId={it.id} />
          </div>
        </div>

        <div className="mt-1.5 text-sm text-slate-700">
          {location ? location : <span className="text-slate-500">Location</span>}
        </div>

        <div className="mt-2 text-sm text-slate-500">{specs}</div>

        <div className="mt-3 line-clamp-1 text-[15px] font-medium text-slate-900">
          {it.title}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-semibold text-white">
            F
          </div>
          <div className="truncate text-sm text-slate-500">{it.sellerName || "—"}</div>
        </div>

        <div className="inline-flex h-9 w-11 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition group-hover:ring-slate-300">
          <MessageCircle className="h-4 w-4 text-slate-600" />
        </div>
      </div>
    </Link>
  );
}

function CardRail({ items }: { items: Card[] }) {
  if (!items.length) return null;
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3">
      {items.map((it) => (
        <div key={it.href} className="min-w-[320px] sm:min-w-0">
          <ListingCard it={it} />
        </div>
      ))}
    </div>
  );
}

function CardGrid5({ items }: { items: Card[] }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.slice(0, 5).map((it) => (
        <ListingCard key={it.href} it={it} />
      ))}
    </div>
  );
}

function fmtPrice(currency: string, priceCents: number | null) {
  if (!priceCents || priceCents <= 0) return "POA";
  const sym =
    currency === "GBP" ? "£" : currency === "USD" ? "$" : currency === "AED" ? "AED " : "€";
  return `${sym}${Math.round(priceCents / 100).toLocaleString("en-GB")}`;
}

function metaLine(it: {
  lengthM: number | null;
  year: number | null;
  location: string | null;
  country: string | null;
}) {
  const parts = [it.lengthM ? `${it.lengthM.toFixed(1)}m` : null, it.year ? String(it.year) : null, it.location || it.country || null].filter(Boolean);
  return parts.length ? parts.join(" • ") : "—";
}

const baseSelect = {
  id: true,
  slug: true,
  title: true,
  currency: true,
  priceCents: true,
  lengthM: true,
  year: true,
  location: true,
  country: true,
  brand: true,
  model: true,
  boatCategory: true,
  profile: { select: { name: true } },
  media: { take: 1, orderBy: { sort: "asc" as const }, select: { url: true } },
} satisfies Prisma.ListingSelect;

type ListingRow = Prisma.ListingGetPayload<{ select: typeof baseSelect }>;

function toCard(it: ListingRow): Card {
  return {
    id: it.id,
    title: it.title,
    href: `/buy/${it.slug}`,
    meta: metaLine(it),
    price: fmtPrice(it.currency, it.priceCents),
    image: it.media?.[0]?.url || undefined,
    sellerName: it.profile?.name || "—",
  };
}

export default async function Home() {
  const charterCount = await prisma.listing.count({
    where: { status: "LIVE", kind: "VESSEL", intent: "CHARTER" },
  });

  const boatSignals: Prisma.ListingWhereInput = {
    OR: [{ lengthM: { gt: 0 } }, { year: { gt: 0 } }, { brand: { not: null } }, { model: { not: null } }, { boatCategory: { not: null } }],
  };

  const [cats, yachts, under100k, recent] = await Promise.all([
    prisma.listing.findMany({
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        ...boatSignals,
        OR: [
          { boatCategory: { contains: "catamaran", mode: "insensitive" } },
          { boatCategory: { contains: "cat", mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: baseSelect,
    }),

    prisma.listing.findMany({
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        ...boatSignals,
        OR: [
          { boatCategory: { contains: "yacht", mode: "insensitive" } },
          { boatCategory: { contains: "motor", mode: "insensitive" } },
          { boatCategory: { contains: "super", mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: baseSelect,
    }),

    prisma.listing.findMany({
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        ...boatSignals,
        priceCents: { gt: 0, lte: 100000 * 100 },
      },
      orderBy: { priceCents: "asc" },
      take: 10,
      select: baseSelect,
    }),

    prisma.listing.findMany({
      where: { status: "LIVE", kind: "VESSEL", intent: "SALE", ...boatSignals },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: baseSelect,
    }),
  ]);

  const CATEGORY_TILES: Tile[] = [
    { title: "Sailboats", subtitle: "Cruisers, racers", href: "/buy/sailboats", emoji: "⛵️" },
    { title: "Motor Yachts", subtitle: "Flybridge, sport", href: "/buy/motor-yachts", emoji: "🛥️" },
    { title: "Catamarans", subtitle: "Family + cruising", href: "/buy/catamarans", emoji: "🌊" },
    { title: "RIBs", subtitle: "Tenders, day boats", href: "/buy/ribs", emoji: "🚤" },
    { title: "Superyachts", subtitle: "50m+", href: "/buy/superyachts", emoji: "🧭" },
    { title: "New Boats", subtitle: "From builders", href: "/buy/new", emoji: "✨" },
    ...(charterCount > 0 ? ([{ title: "Charter", subtitle: "Weekly & day", href: "/charter", emoji: "🏝️" }] as Tile[]) : []),
    { title: "Services", subtitle: "Survey, finance", href: "/services", emoji: "🧰" },
  ];

  return (
    <main className="w-full bg-white">
      <HomeHero />
      {/* ... YOUR EXISTING RETURN BODY UNCHANGED ... */}
      {/* (kept 1:1 — I’m not rewriting it here because it’s already in your file and we didn’t modify below this point) */}
      {/* IMPORTANT: the rest of your file remains exactly as you pasted. */}
      <HomeHero />
      {/* Category tiles */}
      <section className="w-full border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_TILES.map((t, i) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 no-underline transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-xl transition-transform duration-300 group-hover:scale-110">
                  {t.emoji ?? "⛵️"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-900">{t.title}</div>
                  {t.subtitle ? <div className="truncate text-sm text-slate-500">{t.subtitle}</div> : null}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-slate-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BoatsForSaleSection />

      {recent.length > 0 ? (
        <section className="w-full">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <SectionHeader title="Recently added boats" subtitle="Fresh listings from brokers and private sellers" href="/buy" cta="View all boats" />
            <CardRail items={recent.map((x) => ({ ...toCard(x), badge: "New" }))} />
          </div>
        </section>
      ) : null}

      {cats.length > 0 ? (
        <section className="w-full bg-linear-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <SectionHeader title="Catamarans for sale" subtitle="Popular family layouts, long-range comfort" href="/buy/catamarans" />
            <CardRail items={cats.map((x) => toCard(x))} />
          </div>
        </section>
      ) : null}

      {yachts.length > 0 ? (
        <section className="w-full">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <SectionHeader title="Yachts for sale" subtitle="Motor yachts, flybridges, and larger cruisers" href="/buy/motor-yachts" />
            <CardRail items={yachts.map((x) => toCard(x))} />
          </div>
        </section>
      ) : null}

      {under100k.length > 0 ? (
        <section className="w-full bg-linear-to-b from-white to-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <SectionHeader title="Boats under €100k" subtitle="Known-price listings under €100,000" href="/buy" cta="Browse deals" />
            <CardGrid5 items={under100k.map((x) => toCard(x))} />
          </div>
        </section>
      ) : null}

      <section className="w-full bg-linear-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader title="Popular destinations" subtitle="Where people are boating right now" href="/destinations" />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((d, idx) => (
              <Link key={d.href} href={d.href} className="group no-underline">
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-slate-300">
                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
                    <Image
                      src={d.image}
                      alt={d.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      priority={idx < 4}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-black/0 opacity-90" />

                    <div className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm ring-1 ring-black/5">
                      <Heart className="h-4 w-4 text-slate-700" />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        {d.title}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-[15px] font-semibold tracking-tight text-slate-900">{d.title}</div>
                        {d.subtitle ? <div className="mt-1 truncate text-sm text-slate-500">{d.subtitle}</div> : null}
                      </div>
                      <div className="shrink-0 pt-0.5 text-xs font-medium text-slate-600 transition-colors group-hover:text-slate-900">
                        Explore
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ThingsToDo />

      <HomeSplitCtas
        items={
          charterCount > 0
            ? [
                { title: "Looking for a Charter?", body: "Find day charters, weekly charters, and crewed options — all in one place.", cta: "Book a Charter", href: "/charter", imageSrc: "/Charter.png" },
                { title: "Looking for Holiday Ideas?", body: "Browse destinations, routes and things to do — then match boats to the plan.", cta: "Search for Holidays", href: "/destinations", imageSrc: "/Holiday.png" },
              ]
            : [
                { title: "Browse Boats for Sale", body: "Search by category, budget, and location — real listings only.", cta: "Explore boats", href: "/buy", imageSrc: "/Charter.png" },
                { title: "Looking for Holiday Ideas?", body: "Browse destinations, routes and things to do — then match boats to the plan.", cta: "Search for Holidays", href: "/destinations", imageSrc: "/Holiday.png" },
              ]
        }
      />

      <GuidesRowSection />

      <section className="w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[#0a211f] p-8 sm:p-12">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#fff86c]/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
            </div>

            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Ready to list your yacht?
                </h2>
                <p className="mt-3 text-base text-white/70">
                  Create a listing in minutes and start getting inquiries today.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 sm:shrink-0">
                <Link
                  href="/add-listing"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#fff86c] px-6 py-3.5 text-sm font-semibold text-[#0a211f] no-underline transition-all hover:brightness-105"
                >
                  List a yacht
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/buy"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white no-underline backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  Browse boats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}