import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  MapPinned,
  Palmtree,
  Sailboat,
  Sparkles,
  Sun,
  Waves,
} from "lucide-react";

import DestinationSearchClient from "@/components/destinations/DestinationSearchClient";
import DestinationCard from "@/components/destinations/DestinationCard";
import DestinationSection from "@/components/destinations/DestinationSection";
import {
  DESTINATIONS,
  DESTINATION_STYLES,
} from "@/components/destinations/destinations.data";

export const metadata: Metadata = {
  title: "Yacht Destinations | Findaly",
  description:
    "Explore yacht destinations around the world — from the French Riviera and Amalfi Coast to Greece, Croatia, Dubai, the Caribbean and beyond.",
  alternates: { canonical: "/destinations" },
  openGraph: {
    title: "Yacht Destinations | Findaly",
    description:
      "Explore yacht destinations around the world — coastlines, islands, iconic harbours, marinas and charter-worthy routes.",
    url: "/destinations",
    images: [{ url: "/og-findaly.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yacht Destinations | Findaly",
    description:
      "Explore yacht destinations around the world — coastlines, islands, iconic harbours, marinas and charter-worthy routes.",
    images: ["/og-findaly.jpg"],
  },
};

const editorialBuckets = [
  {
    title: "For iconic summer energy",
    description:
      "Big-name coastlines, polished marinas, beach clubs and day routes that feel instantly cinematic.",
    icon: Sparkles,
    slugs: ["french-riviera", "amalfi-coast", "balearics"],
  },
  {
    title: "For island-hopping itineraries",
    description:
      "Places where the joy is in the movement — short hops, blue water, swim stops and one more bay before sunset.",
    icon: Sailboat,
    slugs: ["greece", "croatia", "caribbean"],
  },
  {
    title: "For contrast and discovery",
    description:
      "A sharper mix of skyline, culture, value and scenery — ideal when you want more than one mood in a single trip.",
    icon: Compass,
    slugs: ["dubai", "turkey"],
  },
];

const quickStartLinks = [
  {
    href: "/charter",
    label: "Browse charter options",
    note: "Jump from inspiration into live charter discovery.",
    icon: Waves,
  },
  {
    href: "/buy",
    label: "Browse boats for sale",
    note: "Move from destination dreaming into ownership research.",
    icon: Palmtree,
  },
  {
    href: "/guides/charter-guide",
    label: "Read the charter guide",
    note: "Useful if you're comparing skippered, crewed, or bareboat trips.",
    icon: Sun,
  },
  {
    href: "/services",
    label: "Explore marine services",
    note: "Finance, surveyors, insurance and supporting services.",
    icon: MapPinned,
  },
];

export default function DestinationsPage() {
  const featured = DESTINATIONS.filter((d) => d.featured);

  const byCountry = DESTINATIONS.reduce<Record<string, typeof DESTINATIONS>>(
    (acc, d) => {
      acc[d.country] = acc[d.country] || [];
      acc[d.country].push(d);
      return acc;
    },
    {}
  );

  const countryKeys = Object.keys(byCountry).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#FAFAFA] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,100,98,0.09),transparent_35%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.06),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                Findaly destinations
              </span>

              <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                The world’s most charter-worthy yacht destinations
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
                Explore iconic coastlines, island chains, marinas, anchorages,
                and places actually worth arriving by water. These pages are
                built to help you compare destinations faster — from the French
                Riviera and Amalfi Coast to Greece, Croatia, Dubai, Türkiye and
                the Caribbean.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/charter"
                  className="inline-flex items-center rounded-xl bg-[#F56462] px-5 py-3 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
                >
                  Start with charter
                </Link>
                <Link
                  href="/guides/charter-guide"
                  className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 no-underline transition-colors hover:border-slate-400 hover:bg-slate-50"
                >
                  Read charter guide
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:p-5">
              <div className="mb-3">
                <p className="text-sm font-semibold text-slate-900">
                  Search destinations
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Jump straight to a coastline, island group, or harbour region.
                </p>
              </div>
              <DestinationSearchClient destinations={DESTINATIONS} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <DestinationSection
          title="Featured destinations"
          subtitle="Big-hitting places with strong intent, recognisable names, and high-quality supporting content potential."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        </DestinationSection>

        <DestinationSection
          title="Browse by travel mood"
          subtitle="A faster editorial route in when someone knows the kind of trip they want, but not the exact place yet."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            {editorialBuckets.map((bucket) => {
              const Icon = bucket.icon;
              const cards = DESTINATIONS.filter((d) =>
                bucket.slugs.includes(d.slug)
              );

              return (
                <section
                  key={bucket.title}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F56462]/10 text-[#F56462]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950">
                        {bucket.title}
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {bucket.description}
                  </p>

                  <div className="mt-5 grid gap-3">
                    {cards.map((d) => (
                      <Link
                        key={d.slug}
                        href={`/destinations/${d.slug}`}
                        className="group rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 no-underline transition-colors hover:border-slate-300 hover:bg-white"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#F56462]">
                              {d.name}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {d.country} · {d.region}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-slate-400">
                            View
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </DestinationSection>

        <DestinationSection
          title="Plan the trip around the destination"
          subtitle="Useful commercial paths that make these pages better for users and more valuable for Findaly."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickStartLinks.map(({ href, label, note, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-3xl border border-slate-200 bg-white p-5 no-underline shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-base font-semibold text-slate-950 group-hover:text-[#F56462]">
                  {label}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{note}</p>
              </Link>
            ))}
          </div>
        </DestinationSection>

        <DestinationSection
          title="Browse by country"
          subtitle="Useful for both people and search engines — a cleaner index of destination clusters by geography."
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {countryKeys.map((country) => {
              const items = byCountry[country]
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name));

              return (
                <section
                  key={country}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {country}
                    </h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {items.length}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2">
                    {items.map((d) => (
                      <Link
                        key={d.slug}
                        href={`/destinations/${d.slug}`}
                        className="group flex items-center justify-between rounded-2xl px-3 py-3 text-sm no-underline transition-colors hover:bg-slate-50"
                      >
                        <span className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-[#F56462]" />
                          <span className="font-medium text-slate-900 group-hover:text-[#F56462]">
                            {d.name}
                          </span>
                        </span>
                        <span className="text-xs text-slate-500">
                          {d.region}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </DestinationSection>

        <DestinationSection
          title="Travel styles"
          subtitle="A simple top-level intent layer. Later these can grow into dedicated SEO pages."
        >
          <div className="flex flex-wrap gap-2.5">
            {DESTINATION_STYLES.map((s) => (
              <Link
                key={s.key}
                href={`/destinations?style=${encodeURIComponent(s.key)}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 no-underline transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <span className="text-base">{s.emoji}</span>
                <span className="font-medium">{s.label}</span>
                <span className="text-xs text-slate-500">{s.hint}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-slate-950">
              Where this can expand next
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              The best long-term play is to turn the strongest styles into their
              own indexable pages with unique intros, destination picks, route
              logic, internal linking, and service cross-sells — for example
              /destinations/luxury-yacht-destinations or /destinations/best-
              island-hopping-destinations.
            </p>
          </div>
        </DestinationSection>

        <DestinationSection
          title="All destinations"
          subtitle="A complete index — useful for exploration, crawling, and future filtering."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {DESTINATIONS.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        </DestinationSection>
      </div>
    </main>
  );
}
