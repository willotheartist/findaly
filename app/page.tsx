// app/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  MapPin,
  Sailboat,
  Sparkles,
  Tag,
  Anchor,
  Users,
  Compass,
  ChevronRight,
  Play,
  Search,
} from "lucide-react";

type Tile = { title: string; href: string; subtitle?: string; emoji?: string };
type Card = {
  title: string;
  href: string;
  meta: string;
  price?: string;
  badge?: string;
  image?: string;
};

const HERO_MODES = [
  {
    id: "buy",
    label: "Buy",
    headline: "Find your dream yacht",
    sub: "10,000+ boats from trusted brokers & private sellers worldwide",
    cta: "Browse boats for sale",
    ctaHref: "/buy",
    accent: "#ff6a00",
    bgGradient: "from-orange-50 via-white to-amber-50/30",
    icon: Anchor,
  },
  {
    id: "sell",
    label: "Sell",
    headline: "List your yacht",
    sub: "Reach millions of buyers. Simple listing, powerful exposure.",
    cta: "Create a listing",
    ctaHref: "/add-listing",
    accent: "#0ea5e9",
    bgGradient: "from-sky-50 via-white to-cyan-50/30",
    icon: Tag,
  },
  {
    id: "charter",
    label: "Charter",
    headline: "Charter a yacht",
    sub: "Day trips to week-long adventures. Crewed or bareboat.",
    cta: "Explore charters",
    ctaHref: "/charter",
    accent: "#10b981",
    bgGradient: "from-emerald-50 via-white to-teal-50/30",
    icon: Compass,
  },
  {
    id: "pros",
    label: "Professionals",
    headline: "Find marine pros",
    sub: "Brokers, surveyors, captains, finance & insurance specialists.",
    cta: "Browse professionals",
    ctaHref: "/services",
    accent: "#8b5cf6",
    bgGradient: "from-violet-50 via-white to-purple-50/30",
    icon: Users,
  },
];

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

const DESTINATIONS: Tile[] = [
  { title: "French Riviera", subtitle: "Cannes • Antibes • Monaco", href: "/destinations/french-riviera" },
  { title: "Balearics", subtitle: "Ibiza • Mallorca", href: "/destinations/balearics" },
  { title: "Amalfi Coast", subtitle: "Capri • Positano", href: "/destinations/amalfi-coast" },
  { title: "Greece", subtitle: "Cyclades • Ionian", href: "/destinations/greece" },
  { title: "Croatia", subtitle: "Split • Hvar", href: "/destinations/croatia" },
  { title: "Caribbean", subtitle: "BVI • St Barths", href: "/destinations/caribbean" },
  { title: "Dubai", subtitle: "Marina • Palm", href: "/destinations/dubai" },
  { title: "Turkey", subtitle: "Bodrum • Göcek", href: "/destinations/turkey" },
];

const STATS = [
  { value: "12,450+", label: "Boats listed" },
  { value: "850+", label: "Charter yachts" },
  { value: "45", label: "Countries" },
  { value: "2,100+", label: "Professionals" },
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
        {subtitle ? (
          <p className="mt-1.5 text-base text-slate-500">{subtitle}</p>
        ) : null}
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
            {it.price ? (
              <div className="mt-3 text-base font-bold text-slate-900">{it.price}</div>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  const [activeMode, setActiveMode] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const mode = HERO_MODES[activeMode];
  const IconComponent = mode.icon;

  const handleModeChange = (index: number) => {
    if (index === activeMode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveMode(index);
      setIsTransitioning(false);
    }, 150);
  };

  // Auto-rotate hero modes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveMode((prev) => (prev + 1) % HERO_MODES.length);
        setIsTransitioning(false);
      }, 150);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="w-full bg-white">
      {/* HERO — Full-width dynamic */}
      <section className={`relative w-full overflow-hidden bg-linear-to-br ${mode.bgGradient} transition-all duration-500`}>
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full opacity-30 blur-3xl transition-all duration-700"
            style={{ backgroundColor: mode.accent }}
          />
          <div
            className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl transition-all duration-700"
            style={{ backgroundColor: mode.accent }}
          />
          {/* Grid pattern */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
          {/* Mode tabs */}
          <div className="mb-10 flex flex-wrap justify-center gap-2 sm:mb-12 sm:gap-3">
            {HERO_MODES.map((m, i) => {
              const Icon = m.icon;
              const isActive = i === activeMode;
              return (
                <button
                  key={m.id}
                  onClick={() => handleModeChange(i)}
                  className={`group relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-white text-slate-900 shadow-lg shadow-slate-200/50"
                      : "bg-white/60 text-slate-600 hover:bg-white/80 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-colors ${isActive ? "" : "text-slate-400 group-hover:text-slate-600"}`}
                    style={{ color: isActive ? m.accent : undefined }}
                  />
                  {m.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full"
                      style={{ backgroundColor: m.accent }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Main hero content */}
          <div
            className={`text-center transition-all duration-300 ${
              isTransitioning ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200/50 sm:h-20 sm:w-20">
              <IconComponent
                className="h-8 w-8 sm:h-10 sm:w-10 transition-colors duration-300"
                style={{ color: mode.accent }}
              />
            </div>

            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {mode.headline}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 sm:text-xl">
              {mode.sub}
            </p>

            {/* Search bar */}
            <div className="mx-auto mt-8 max-w-2xl sm:mt-10">
              <form action="/search" className="relative">
                <div className="flex overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/80">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      name="q"
                      placeholder="Search brand, model, location…"
                      className="h-14 w-full border-0 bg-transparent pl-12 pr-4 text-base text-slate-900 outline-none placeholder:text-slate-400 sm:h-16 sm:text-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="m-2 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 sm:px-8 sm:text-base"
                    style={{ backgroundColor: mode.accent }}
                  >
                    Search
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>

              {/* Quick filters */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link
                  href="/buy/sailboats"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm text-slate-600 no-underline ring-1 ring-slate-200/50 transition-all hover:bg-white hover:text-slate-900 hover:ring-slate-300"
                >
                  ⛵️ Sailboats
                </Link>
                <Link
                  href="/buy/motor-yachts"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm text-slate-600 no-underline ring-1 ring-slate-200/50 transition-all hover:bg-white hover:text-slate-900 hover:ring-slate-300"
                >
                  🛥️ Motor yachts
                </Link>
                <Link
                  href="/buy/catamarans"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm text-slate-600 no-underline ring-1 ring-slate-200/50 transition-all hover:bg-white hover:text-slate-900 hover:ring-slate-300"
                >
                  🌊 Catamarans
                </Link>
                <Link
                  href="/destinations/french-riviera"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm text-slate-600 no-underline ring-1 ring-slate-200/50 transition-all hover:bg-white hover:text-slate-900 hover:ring-slate-300"
                >
                  <MapPin className="h-3.5 w-3.5" /> French Riviera
                </Link>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={mode.ctaHref}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white no-underline transition-all hover:brightness-110 sm:text-base"
                style={{ backgroundColor: mode.accent }}
              >
                {mode.cta}
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 no-underline ring-1 ring-slate-200 transition-all hover:ring-slate-300 sm:text-base"
              >
                <Play className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-600" />
                How it works
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 sm:mt-20 sm:grid-cols-4 sm:gap-8">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-2xl font-bold text-slate-900 sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* Boats for sale */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader
            title="Boats for sale"
            subtitle="Fresh listings from brokers and private sellers"
            href="/buy"
          />
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
          <SectionHeader
            title="Charter boats available"
            subtitle="Day charters, weekly charters, crewed options"
            href="/charter"
          />
          <CardRail items={CHARTER} />
        </div>
      </section>

      {/* Featured yachts — larger cards */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader
            title="Featured yachts"
            subtitle="Hand-picked highlights"
            href="/featured"
          />
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
                  {it.price ? (
                    <div className="mt-4 text-lg font-bold text-slate-900">{it.price}</div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="w-full bg-linear-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader
            title="Popular destinations"
            subtitle="Where people are boating right now"
            href="/destinations"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((d, idx) => (
              <Link
                key={d.href}
                href={d.href}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white no-underline transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="relative h-32 overflow-hidden bg-linear-to-br from-orange-100/50 via-slate-50 to-sky-50/50">
                  <div className="absolute inset-0 bg-[radial-gradient(300px_150px_at_50%_80%,rgba(255,106,0,0.2),transparent)] transition-opacity duration-300 group-hover:opacity-70" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-10 w-10 text-slate-200 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold text-slate-900">{d.title}</div>
                  {d.subtitle ? (
                    <div className="mt-1 text-sm text-slate-500">{d.subtitle}</div>
                  ) : null}
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition-colors group-hover:text-[#ff6a00]">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-12">
            {/* Background decoration */}
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