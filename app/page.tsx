"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  Sailboat,
  Sparkles,
  ChevronRight,
  Heart,
} from "lucide-react";

import HomeHero from "@/components/home/HomeHero";
import ThingsToDo from "@/components/home/ThingsToDo";

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

const FOR_SALE: Card[] = [
  { title: "Beneteau Oceanis 46.1", meta: "46 ft • 2019 • Palma, ES", price: "€285,000", href: "/buy/beneteau-oceanis-46-1", badge: "Verified" },
  { title: "Sunseeker Predator 50", meta: "50 ft • 2016 • Cannes, FR", price: "€590,000", href: "/buy/sunseeker-predator-50", badge: "Featured" },
  { title: "Lagoon 42 Catamaran", meta: "42 ft • 2020 • Split, HR", price: "€420,000", href: "/buy/lagoon-42", badge: "Hot" },
  { title: "Princess V40", meta: "40 ft • 2018 • Antibes, FR", price: "€345,000", href: "/buy/princess-v40" },
  { title: "Jeanneau Sun Odyssey 409", meta: "41 ft • 2015 • Athens, GR", price: "€165,000", href: "/buy/jeanneau-409" },
  { title: "Azimut 55", meta: "55 ft • 2017 • Ibiza, ES", price: "€780,000", href: "/buy/azimut-55", badge: "Featured" },
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

function CardRail({ items }: { items: Card[] }) {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3">
      {items.map((it, idx) => (
        <Link
          key={it.href}
          href={it.href}
          className="group min-w-[300px] flex-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white no-underline shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg sm:min-w-0"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <div className="relative h-44 overflow-hidden bg-linear-to-br from-slate-100 to-slate-50">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sailboat className="h-16 w-16 text-slate-200 transition-transform duration-500 group-hover:scale-110" />
            </div>
            {it.badge ? (
              <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-[#ff6a00]" />
                {it.badge}
              </div>
            ) : null}
          </div>

          <div className="p-4">
            <div className="text-[15px] font-semibold text-slate-900 transition-colors group-hover:text-[#ff6a00]">
              {it.title}
            </div>
            <div className="mt-1 text-sm text-slate-500">{it.meta}</div>
            {it.price ? <div className="mt-3 text-base font-bold text-slate-900">{it.price}</div> : null}
          </div>
        </Link>
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
                  {t.subtitle ? <div className="truncate text-sm text-slate-500">{t.subtitle}</div> : null}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-slate-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Boats for sale */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader title="Boats for sale" subtitle="Fresh listings from brokers and private sellers" href="/buy" />
          <CardRail items={FOR_SALE} />
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/buy"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 no-underline hover:text-slate-900"
            >
              View all boats <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Charter available */}
      <section className="w-full bg-linear-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader title="Charter boats available" subtitle="Day charters, weekly charters, crewed options" href="/charter" />
          <CardRail items={CHARTER} />
        </div>
      </section>

      {/* Featured yachts — larger cards */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader title="Featured yachts" subtitle="Hand-picked highlights" href="/featured" />
          <div className="grid gap-5 md:grid-cols-3">
            {FEATURED.map((it, idx) => (
              <Link
                key={it.href}
                href={it.href}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white no-underline shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative h-52 overflow-hidden bg-linear-to-br from-slate-100 via-slate-50 to-orange-50/30">
                  <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_30%_40%,rgba(255,106,0,0.15),transparent)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sailboat className="h-20 w-20 text-slate-200 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 text-[#ff6a00]" />
                    {it.badge ?? "Featured"}
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-base font-semibold text-slate-900 transition-colors group-hover:text-[#ff6a00]">
                    {it.title}
                  </div>
                  <div className="mt-1.5 text-sm text-slate-500">{it.meta}</div>
                  {it.price ? <div className="mt-4 text-lg font-bold text-slate-900">{it.price}</div> : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular destinations — Airbnb-style image cards */}
      <section className="w-full bg-linear-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader title="Popular destinations" subtitle="Where people are boating right now" href="/destinations" />

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
