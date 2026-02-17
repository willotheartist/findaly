// app/page.tsx

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  Sailboat,
  Sparkles,
  ChevronRight,
  Heart,
  Trash2,
  MessageCircle,
} from "lucide-react";

import HomeHero from "@/components/home/HomeHero";
import ThingsToDo from "@/components/home/ThingsToDo";
import BoatsForSaleSection from "@/components/home/BoatsForSaleSection";
import HomeSplitCtas from "@/components/home/HomeSplitCtas";

type Tile = { title: string; href: string; subtitle?: string; emoji?: string };
type DestinationTile = { title: string; href: string; subtitle?: string; image: string };
type Card = {
  title: string;
  href: string;
  meta: string;
  price?: string;
  badge?: string;
  image?: string;
};

const CATEGORY_TILES: Tile[] = [
  { title: "Sailboats", subtitle: "Cruisers, racers", href: "/buy/sailboats", emoji: "⛵️" },
  { title: "Motor Yachts", subtitle: "Flybridge, sport", href: "/buy/motor-yachts", emoji: "🛥️" },
  { title: "Catamarans", subtitle: "Family + charter", href: "/buy/catamarans", emoji: "🌊" },
  { title: "RIBs", subtitle: "Tenders, day boats", href: "/buy/ribs", emoji: "🚤" },
  { title: "Superyachts", subtitle: "50m+", href: "/buy/superyachts", emoji: "🧭" },
  { title: "New Boats", subtitle: "From builders", href: "/buy/new", emoji: "✨" },
  { title: "Charter", subtitle: "Weekly & day", href: "/charter", emoji: "🏝️" },
  { title: "Services", subtitle: "Survey, finance", href: "/services", emoji: "🧰" },
];

const CHARTER: Card[] = [
  { title: "Bali 4.6 Catamaran", meta: "8 guests • 4 cabins • Sardinia", price: "From €6,200/wk", href: "/charter/bali-46-sardinia", badge: "Available now" },
  { title: "Pershing 62", meta: "10 guests • Day/Week • Monaco", price: "From €3,900/day", href: "/charter/pershing-62-monaco", badge: "Crewed" },
  { title: "Dufour 470", meta: "8 guests • 4 cabins • Lefkada", price: "From €4,100/wk", href: "/charter/dufour-470-lefkada" },
  { title: "Princess 45", meta: "12 guests • Day charter • Ibiza", price: "From €2,600/day", href: "/charter/princess-45-ibiza" },
  { title: "Lagoon 450F", meta: "10 guests • 4 cabins • Trogir", price: "From €5,300/wk", href: "/charter/lagoon-450f-croatia" },
  { title: "Sanlorenzo SL96", meta: "8 guests • 4 cabins • Côte d'Azur", price: "From €68,000/wk", href: "/charter/sanlorenzo-sl96", badge: "Luxury" },
];

const FEATURED: Card[] = [
  { title: "2024 New — Axopar 37", meta: "37 ft • New • UK delivery", price: "From £245,000", href: "/buy/axopar-37-new", badge: "New" },
  { title: "Custom Explorer 30m", meta: "98 ft • 2012 refit • Worldwide", price: "POA", href: "/buy/custom-explorer-30m", badge: "Featured" },
  { title: "Riva Rivamare 38", meta: "38 ft • 2021 • Lake Como", price: "€890,000", href: "/buy/riva-rivamare-38", badge: "Icon" },
];

const DESTINATIONS: DestinationTile[] = [
  { title: "French Riviera", subtitle: "Cannes • Antibes • Monaco", href: "/destinations/french-riviera", image: "/destinations/FrenchRiviera.png" },
  { title: "Balearics", subtitle: "Ibiza • Mallorca", href: "/destinations/balearics", image: "/destinations/Balearics.png" },
  { title: "Amalfi Coast", subtitle: "Capri • Positano", href: "/destinations/amalfi-coast", image: "/destinations/Amalfi Coast.png" },
  { title: "Greece", subtitle: "Cyclades • Ionian", href: "/destinations/greece", image: "/destinations/Greece.png" },
  { title: "Croatia", subtitle: "Split • Hvar", href: "/destinations/croatia", image: "/destinations/Croatia.png" },
  { title: "Caribbean", subtitle: "BVI • St Barths", href: "/destinations/caribbean", image: "/destinations/Caribbean.png" },
  { title: "Dubai", subtitle: "Marina • Palm", href: "/destinations/dubai", image: "/destinations/Dubai.png" },
  { title: "Turkey", subtitle: "Bodrum • Göcek", href: "/destinations/turkey", image: "/destinations/Turkey.png" },
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

/** Shared “portal-style” listing card (used in rails + featured grid) */
function ListingCard({ it }: { it: Card }) {
  const splitMeta = (meta: string) => {
    const parts = meta.split("•").map((s) => s.trim()).filter(Boolean);
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
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition group-hover:ring-slate-300">
              <Trash2 className="h-4 w-4 text-slate-500" />
            </div>
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition group-hover:ring-slate-300">
              <Heart className="h-4 w-4 text-slate-600" />
            </div>
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

      {/* Footer bar */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-semibold text-white">
            F
          </div>
          <div className="truncate text-sm text-slate-500">Findaly</div>
        </div>

        <div className="inline-flex h-9 w-11 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition group-hover:ring-slate-300">
          <MessageCircle className="h-4 w-4 text-slate-600" />
        </div>
      </div>
    </Link>
  );
}

function CardRail({ items }: { items: Card[] }) {
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

export default function Home() {
  return (
    <main className="w-full bg-white">
      {/* HERO */}
      <HomeHero />

      {/* Category tiles row */}
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
                  {t.subtitle ? (
                    <div className="truncate text-sm text-slate-500">{t.subtitle}</div>
                  ) : null}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-slate-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Boats for sale (moved into component) */}
      <BoatsForSaleSection />

      {/* Charter available */}
      <section className="w-full bg-linear-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader
            title="Charter boats available"
            subtitle="Day charters, weekly charters, crewed options"
            href="/charter"
          />
          <CardRail items={CHARTER} />
        </div>
      </section>

      {/* Featured yachts — NOW MATCHES THE SAME CARD STYLE */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader title="Featured yachts" subtitle="Hand-picked highlights" href="/featured" />
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURED.map((it) => (
              <ListingCard key={it.href} it={it} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular destinations — Airbnb-style image cards */}
      <section className="w-full bg-linear-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader
            title="Popular destinations"
            subtitle="Where people are boating right now"
            href="/destinations"
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((d, idx) => (
              <Link
                key={d.href}
                href={d.href}
                className="group no-underline"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
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
                        <div className="truncate text-[15px] font-semibold tracking-tight text-slate-900">
                          {d.title}
                        </div>
                        {d.subtitle ? (
                          <div className="mt-1 truncate text-sm text-slate-500">{d.subtitle}</div>
                        ) : null}
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

      {/* ✅ Things to do (new section) */}
      <ThingsToDo />

      {/* ✅ New split CTAs (button-only) */}
      <HomeSplitCtas
        items={[
          {
            title: "Looking for a Charter?",
            body: "Find day charters, weekly charters, and crewed options — all in one place.",
            cta: "Book a Charter",
            href: "/charter",
            imageSrc: "/Charter.png",
          },
          {
            title: "Looking for Holiday Ideas?",
            body: "Browse destinations, routes and things to do — then match boats to the plan.",
            cta: "Search for Holidays",
            href: "/destinations",
            imageSrc: "/Holiday.png",
          },
        ]}
      />

      {/* Bottom CTA */}
      <section className="w-full bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-12">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#ff6a00]/20 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-sky-500/10 blur-3xl" />
            </div>

            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Ready to list your yacht?
                </h2>
                <p className="mt-3 text-base text-slate-300">
                  Join thousands of sellers. Create a listing in minutes and start getting inquiries today.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 sm:shrink-0">
                <Link
                  href="/add-listing"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#ff6a00] px-6 py-3.5 text-sm font-semibold text-white no-underline transition-all hover:brightness-110"
                >
                  List a yacht
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/buy"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-sm font-semibold text-white no-underline backdrop-blur-sm transition-all hover:bg-white/20"
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
