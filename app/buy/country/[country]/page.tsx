// app/buy/country/[country]/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { absoluteUrl, getSiteUrl, truncate } from "@/lib/site";

import { getMarketStats } from "@/lib/seo/marketStats";
import MarketOverview from "@/components/seo/MarketOverview";
import RelatedSearches from "@/components/seo/RelatedSearches";

import { countryFromParam, slugifyLoose } from "@/lib/seoParam";

type PageProps = {
  params: Promise<{ country: string }>;
};

function buildSeoIntro(opts: {
  countryDisplay: string;
  total: number;
  brandsTop?: string[];
  modelsTop?: string[];
}) {
  const { countryDisplay, total, brandsTop = [], modelsTop = [] } = opts;
  const b = brandsTop.slice(0, 3).filter(Boolean);
  const m = modelsTop.slice(0, 3).filter(Boolean);

  const bits: string[] = [];
  bits.push(
    `Browse ${total.toLocaleString()} boat${
      total === 1 ? "" : "s"
    } for sale in ${countryDisplay} on Findaly — updated regularly from trusted sellers and brokers.`
  );
  if (b.length) bits.push(`Popular brands include ${b.join(", ")}.`);
  if (m.length) bits.push(`Common models include ${m.join(", ")}.`);
  bits.push(
    `Compare specs, prices, and location — then enquire directly with sellers and brokers.`
  );
  return bits.join(" ");
}

function jsonLd(obj: unknown) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
    />
  );
}

function fmtPrice(cents: number | null, cur: string) {
  if (!cents || cents <= 0) return "POA";
  const v = cents / 100;
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `${Math.round(v).toLocaleString()} ${cur}`;
  }
}

function buildWhere(c: ReturnType<typeof countryFromParam>): Prisma.ListingWhereInput {
  return {
    status: "LIVE",
    kind: "VESSEL",
    intent: "SALE",
    OR: [
      { country: { equals: c.spaced, mode: "insensitive" } },
      { country: { equals: c.raw, mode: "insensitive" } },
      { country: { equals: c.display, mode: "insensitive" } },
      { country: { equals: c.upper, mode: "insensitive" } },
    ],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const c = countryFromParam(country);

  const where = buildWhere(c);
  const total = await prisma.listing.count({ where });

  const title =
    total > 0 ? `Boats for Sale in ${c.display}` : `Boats in ${c.display}`;

  const description =
    total > 0
      ? truncate(
          `Browse ${total.toLocaleString()} boats for sale in ${c.display}. Compare specs, prices, and locations — then enquire directly with sellers and brokers on Findaly.`,
          160
        )
      : truncate(
          `Explore boats and listings in ${c.display} on Findaly. New inventory is added regularly.`,
          160
        );

  const canonical = `/buy/country/${slugifyLoose(c.spaced)}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: total > 0 ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: `${title} | Findaly`,
      description,
      url: canonical,
      type: "website",
      images: [{ url: absoluteUrl("/hero-buy.jpg") }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Findaly`,
      description,
      images: [absoluteUrl("/hero-buy.jpg")],
    },
  };
}

export default async function CountryHubPage({ params }: PageProps) {
  const { country } = await params;
  const c = countryFromParam(country);

  const where = buildWhere(c);

  const [total, listings, topBrands, topModels, topYears, stats] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        priceCents: true,
        currency: true,
        location: true,
        country: true,
        year: true,
        lengthFt: true,
        lengthM: true,
        brand: true,
        model: true,
        updatedAt: true,
        featured: true,
        media: { orderBy: { sort: "asc" }, take: 1, select: { url: true } },
      },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
      take: 36,
    }),
    prisma.listing.groupBy({
      by: ["brand"],
      where: { ...where, brand: { not: null } },
      _count: { brand: true },
      orderBy: { _count: { brand: "desc" } },
      take: 12,
    }),
    prisma.listing.groupBy({
      by: ["model"],
      where: { ...where, model: { not: null } },
      _count: { model: true },
      orderBy: { _count: { model: "desc" } },
      take: 12,
    }),
    prisma.listing.groupBy({
      by: ["year"],
      where: { ...where, year: { not: null } },
      _count: { year: true },
      orderBy: { _count: { year: "desc" } },
      take: 12,
    }),
    getMarketStats(where),
  ]);

  const brandsTop = topBrands
    .map((x) => x.brand)
    .filter((x): x is string => !!x);

  const modelsTop = topModels
    .map((x) => x.model)
    .filter((x): x is string => !!x);

  const yearsTop = topYears
    .map((x) => x.year)
    .filter((x): x is number => typeof x === "number" && !Number.isNaN(x))
    .sort((a, b2) => b2 - a);

  const intro = buildSeoIntro({
    countryDisplay: c.display,
    total,
    brandsTop,
    modelsTop,
  });

  const base = getSiteUrl();
  const safeCountrySlug = slugifyLoose(c.spaced);
  const pageUrl = `${base}/buy/country/${safeCountrySlug}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Findaly", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Buy", item: `${base}/buy` },
      { "@type": "ListItem", position: 3, name: `Country: ${c.display}`, item: pageUrl },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Boats for Sale in ${c.display}`,
    url: pageUrl,
    description: intro,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: listings.map((l, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${base}/buy/${l.slug}`,
        name: l.title,
      })),
    },
  };

  return (
    <main className="w-full bg-white">
      {jsonLd(breadcrumb)}
      {jsonLd(itemList)}

      <section className="w-full border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
                Buy • Country
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Boats for sale in {c.display}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
                {intro}
              </p>

              <div className="mt-4 text-sm text-slate-500">
                {total > 0 ? (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-slate-700">
                      {Math.min(36, total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-700">
                      {total.toLocaleString()}
                    </span>{" "}
                    listings.
                  </>
                ) : (
                  <>
                    No live listings found in{" "}
                    <span className="font-semibold text-slate-700">
                      {c.display}
                    </span>{" "}
                    right now.
                  </>
                )}
              </div>

              {/* Market Overview */}
              {total > 0 ? (
                <div className="mt-8">
                  <MarketOverview stats={stats} />
                </div>
              ) : null}
            </div>

            {/* Related searches */}
            {total > 0 ? (
              <RelatedSearches
                kind="country"
                countryDisplay={c.display}
                countrySlug={safeCountrySlug}
                brands={brandsTop}
                models={modelsTop}
                years={yearsTop}
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          {total === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="text-lg font-semibold text-slate-900">
                No listings live in {c.display} yet.
              </div>
              <p className="mt-2 text-slate-600">
                Try browsing all boats, or check back soon — inventory updates regularly.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/buy"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-95"
                >
                  Browse all boats
                </Link>
                <Link
                  href="/add-listing"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
                >
                  List a boat
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => {
                const img = l.media?.[0]?.url || "";
                const price = fmtPrice(l.priceCents, l.currency);
                const specs = [
                  l.brand || null,
                  l.year ? `${l.year}` : null,
                  l.lengthM
                    ? `${Math.round(l.lengthM)}m`
                    : l.lengthFt
                      ? `${Math.round(l.lengthFt)}ft`
                      : null,
                  l.location || l.country || null,
                ].filter(Boolean) as string[];

                return (
                  <Link
                    key={l.id}
                    href={`/buy/${l.slug}`}
                    className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white no-underline hover:border-slate-300"
                  >
                    <div className="relative aspect-16/10 bg-slate-100">
                      {img ? (
                        <Image
                          src={img}
                          alt={l.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-lg font-semibold tracking-tight text-slate-900">
                          {price}
                        </div>
                        {l.featured ? (
                          <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            Featured
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-1 text-sm text-slate-600">
                        {specs.join(" • ")}
                      </div>

                      <div className="mt-2 line-clamp-2 text-[15px] font-medium text-slate-900">
                        {l.title}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <div className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
                          Findaly
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                          View →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
