// app/explore/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Explore Boats for Sale | Findaly",
  description:
    "Browse the latest boats for sale on Findaly. Explore listings, brands, models, and countries — updated regularly.",
  alternates: { canonical: "/explore" },
  openGraph: {
    title: "Explore Boats for Sale | Findaly",
    description:
      "Browse the latest boats for sale on Findaly. Explore listings, brands, models, and countries — updated regularly.",
    url: `${siteUrl}/explore`,
    siteName: "Findaly",
    type: "website",
  },
};

type ExploreListing = {
  id: string;
  slug: string;
  title: string | null;
  year: number | null;
  brand: string | null;
  model: string | null;
  country: string | null;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-10 md:px-10">
      <h2 className="text-[20px] font-semibold tracking-[-0.02em] md:text-[22px]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Pill({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-[13px] transition hover:bg-white"
    >
      {children}
    </Link>
  );
}

function listingLabel(listing: ExploreListing) {
  const fallback =
    `${listing.brand ?? ""} ${listing.model ?? ""}`.trim() ||
    listing.slug ||
    "View listing";

  return listing.title || fallback;
}

function listingMeta(listing: ExploreListing) {
  const bits: string[] = [];

  if (listing.year) bits.push(String(listing.year));
  if (listing.country) bits.push(listing.country);

  const brandModel = `${listing.brand ?? ""} ${listing.model ?? ""}`.trim();
  if (brandModel) bits.push(brandModel);

  return bits.join(" · ");
}

export default async function ExplorePage() {
  const [listingsRaw, brands, models, countries] = await Promise.all([
    prisma.listing.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        year: true,
        brand: true,
        model: true,
        country: true,
      },
      orderBy: { createdAt: "desc" },
      take: 300,
    }),
    prisma.listing.groupBy({
      by: ["brand"],
      where: { brand: { not: null } },
      _count: { brand: true },
      orderBy: { _count: { brand: "desc" } },
      take: 60,
    }),
    prisma.listing.groupBy({
      by: ["model"],
      where: { model: { not: null } },
      _count: { model: true },
      orderBy: { _count: { model: "desc" } },
      take: 60,
    }),
    prisma.listing.groupBy({
      by: ["country"],
      where: { country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 50,
    }),
  ]);

  const listings: ExploreListing[] = listingsRaw;

  return (
    <main className="pt-24">
      <header className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-black/10 bg-white/60 p-6 md:p-10">
          <h1 className="text-[28px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[38px]">
            Explore Findaly
          </h1>
          <p className="mt-3 max-w-[70ch] text-[14px] text-black/70 md:text-[15px]">
            A crawl-friendly directory of real listing URLs, plus the most
            browsed brands, models, and countries.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Pill href="/buy">Browse all boats</Pill>
            <Pill href="/brands">Browse brands</Pill>
            <Pill href="/guides">Read guides</Pill>
          </div>
        </div>
      </header>

      <Section title="Latest listings">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/buy/${listing.slug}`}
              className="rounded-2xl border border-black/10 bg-white/60 p-4 transition hover:bg-white"
            >
              <div className="text-[14px] font-medium">{listingLabel(listing)}</div>
              <div className="mt-1 text-[12px] text-black/65">
                {listingMeta(listing)}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Top brands">
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) =>
            brand.brand ? (
              <Pill
                key={brand.brand}
                href={`/buy/brand/${encodeURIComponent(brand.brand)}`}
              >
                {brand.brand}
                <span className="ml-2 text-black/50">({brand._count.brand})</span>
              </Pill>
            ) : null
          )}
        </div>
      </Section>

      <Section title="Top models">
        <div className="flex flex-wrap gap-2">
          {models.map((model) =>
            model.model ? (
              <Pill
                key={model.model}
                href={`/buy/model/${encodeURIComponent(model.model)}`}
              >
                {model.model}
                <span className="ml-2 text-black/50">({model._count.model})</span>
              </Pill>
            ) : null
          )}
        </div>
      </Section>

      <Section title="Top countries">
        <div className="flex flex-wrap gap-2">
          {countries.map((country) =>
            country.country ? (
              <Pill
                key={country.country}
                href={`/buy/country/${encodeURIComponent(country.country)}`}
              >
                {country.country}
                <span className="ml-2 text-black/50">({country._count.country})</span>
              </Pill>
            ) : null
          )}
        </div>
      </Section>

      <div className="h-14" />
    </main>
  );
}