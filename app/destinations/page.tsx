import type { Metadata } from "next";
import DestinationSearchClient from "@/components/destinations/DestinationSearchClient";
import DestinationCard from "@/components/destinations/DestinationCard";
import DestinationSection from "@/components/destinations/DestinationSection";
import { DESTINATIONS, DESTINATION_STYLES } from "@/components/destinations/destinations.data";

export const metadata: Metadata = {
  title: "Destinations | Findaly",
  description: "Explore yacht destinations around the world — coastlines, islands, and iconic harbours.",
};

export default function DestinationsPage() {
  const featured = DESTINATIONS.filter((d) => d.featured);

  // Build a country -> destinations map for Browse by country
  const byCountry = DESTINATIONS.reduce<Record<string, typeof DESTINATIONS>>((acc, d) => {
    acc[d.country] = acc[d.country] || [];
    acc[d.country].push(d);
    return acc;
  }, {});

  const countryKeys = Object.keys(byCountry).sort((a, b) => a.localeCompare(b));

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Destinations
            </h1>
            <p className="mt-2 text-base leading-relaxed text-slate-700">
              Explore coastlines, islands, and iconic harbours — curated places worth sailing for.
            </p>
          </div>

          <div className="w-full md:w-[460px]">
            <DestinationSearchClient destinations={DESTINATIONS} />
          </div>
        </div>

        {/* Featured */}
        <DestinationSection
          title="Featured destinations"
          subtitle="Editor’s picks — iconic, beautiful, and content-rich."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        </DestinationSection>

        {/* Browse by country */}
        <DestinationSection
          title="Browse by country"
          subtitle="Jump straight to a region and start exploring."
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {countryKeys.map((country) => {
              const items = byCountry[country].slice().sort((a, b) => a.name.localeCompare(b.name));
              return (
                <div
                  key={country}
                  className="rounded-md border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{country}</h3>
                    <span className="text-xs text-slate-500">{items.length}</span>
                  </div>

                  <div className="mt-3 grid gap-2">
                    {items.map((d) => (
                      <a
                        key={d.slug}
                        href={`/destinations/${d.slug}`}
                        className="group flex items-center justify-between rounded-md px-2 py-2 text-sm text-slate-700 no-underline hover:bg-slate-50"
                      >
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#F56462]" />
                          <span className="text-slate-900 group-hover:underline">{d.name}</span>
                        </span>
                        <span className="text-xs text-slate-500">{d.region}</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </DestinationSection>

        {/* Travel styles */}
        <DestinationSection
          title="Travel styles"
          subtitle="Not sure where to start? Pick a vibe."
        >
          <div className="flex flex-wrap gap-2">
            {DESTINATION_STYLES.map((s) => (
              <a
                key={s.key}
                href={`/destinations?style=${encodeURIComponent(s.key)}`}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 no-underline hover:bg-slate-50"
              >
                <span className="text-base">{s.emoji}</span>
                <span className="font-medium">{s.label}</span>
                <span className="text-xs text-slate-500">{s.hint}</span>
              </a>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">
              Tip: later we can make these links filter the same dataset (server-side) for SEO-friendly pages like{" "}
              <span className="font-semibold text-slate-900">/destinations/coastal</span>.
            </p>
          </div>
        </DestinationSection>

        {/* All destinations */}
        <DestinationSection
          title="All destinations"
          subtitle="A complete index — use search to narrow it down."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINATIONS.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        </DestinationSection>
      </div>
    </main>
  );
}
