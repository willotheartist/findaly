// app/buy/year/[year]/brand/[brand]/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { absoluteUrl, getSiteUrl, truncate } from "@/lib/site";

import { getMarketStats } from "@/lib/seo/marketStats";
import MarketOverview from "@/components/seo/MarketOverview";
import RelatedSearches from "@/components/seo/RelatedSearches";

type PageProps = {
  params: Promise<{ year: string; brand: string }>;
};

function decodeParam(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function slugifyLoose(input: string) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseYear(param: string) {
  const raw = (param || "").trim();
  const n = Number(raw);
  const year = Number.isFinite(n) ? Math.trunc(n) : NaN;
  return { raw, year };
}

function brandFromParam(param: string) {
  const raw = decodeParam(param).trim();
  const spaced = raw.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return {
    raw,
    spaced,
    display: spaced
      .split(" ")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" "),
  };
}

function buildSeoIntro(opts: {
  year: number;
  brandDisplay: string;
  total: number;
  modelsTop?: string[];
  countriesTop?: string[];
}) {
  const { year, brandDisplay, total, modelsTop = [], countriesTop = [] } = opts;
  const m = modelsTop.slice(0, 3).filter(Boolean);
  const c = countriesTop.slice(0, 3).filter(Boolean);

  const bits: string[] = [];
  bits.push(
    `Browse ${total.toLocaleString()} ${brandDisplay} boat${total === 1 ? "" : "s"} from ${year} for sale on Findaly — updated regularly from trusted sellers and brokers.`
  );
  if (m.length) bits.push(`Popular models include ${m.map((x) => `${brandDisplay} ${x}`).join(", ")}.`);
  if (c.length) bits.push(`Explore listings in ${c.join(", ")} and beyond — with photos, specs, and direct enquiries.`);
  else bits.push(`Compare specs, pricing, and location — then enquire directly with sellers and brokers.`);

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year: yearParam, brand } = await params;
  const y = parseYear(yearParam);
  const b = brandFromParam(brand);

  if (!y.year || Number.isNaN(y.year) || y.year < 1900 || y.year > 2100) {
    return { title: "Boats by Year", robots: { index: false, follow: true } };
  }

  const where: Prisma.ListingWhereInput = {
    status: "LIVE",
    kind: "VESSEL",
    intent: "SALE",
    year: y.year,
    OR: [
      { brand: { equals: b.spaced, mode: "insensitive" } },
      { brand: { equals: b.raw, mode: "insensitive" } },
    ],
  };

  const total = await prisma.listing.count({ where });

  const title =
    total > 0 ? `${b.display} Boats from ${y.year} for Sale` : `${b.display} Boats from ${y.year}`;

  const description =
    total > 0
      ? truncate(
          `Browse ${total.toLocaleString()} ${b.display} boats from ${y.year} for sale worldwide. Compare specs, prices, and locations — then enquire directly with sellers and brokers on Findaly.`,
          160
        )
      : truncate(
          `Explore ${b.display} boats from ${y.year} on Findaly. New inventory is added regularly.`,
          160
        );

  const canonical = `/buy/year/${y.year}/brand/${slugifyLoose(b.spaced)}`;

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

export default async function YearBrandHubPage({ params }: PageProps) {
  const { year: yearParam, brand } = await params;
  const y = parseYear(yearParam);
  const b = brandFromParam(brand);

  const valid = y.year && !Number.isNaN(y.year) && y.year >= 1900 && y.year <= 2100;
  const year = valid ? y.year : NaN;

  const where: Prisma.ListingWhereInput = valid
    ? {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        year,
        OR: [
          { brand: { equals: b.spaced, mode: "insensitive" } },
          { brand: { equals: b.raw, mode: "insensitive" } },
        ],
      }
    : { status: "LIVE", kind: "VESSEL", intent: "SALE", year: -1 };

  const [total, listings, topModels, topCountries, stats] = await Promise.all([
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
      by: ["model"],
      where: { ...where, model: { not: null } },
      _count: { model: true },
      orderBy: { _count: { model: "desc" } },
      take: 12,
    }),
    prisma.listing.groupBy({
      by: ["country"],
      where: { ...where, country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 12,
    }),
    getMarketStats(where),
  ]);

  const modelsTop = topModels.map((x) => x.model).filter((x): x is string => !!x);
  const countriesTop = topCountries.map((x) => x.country).filter((x): x is string => !!x);

  const intro = valid
    ? buildSeoIntro({ year, brandDisplay: b.display, total, modelsTop, countriesTop })
    : "Invalid year.";

  const base = getSiteUrl();
  const safeBrandSlug = slugifyLoose(b.spaced);
  const pageUrl = valid ? `${base}/buy/year/${year}/brand/${safeBrandSlug}` : `${base}/buy/year`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Findaly", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Buy", item: `${base}/buy` },
      { "@type": "ListItem", position: 3, name: `Year: ${valid ? year : "—"}`, item: `${base}/buy/year/${valid ? year : ""}` },
      { "@type": "ListItem", position: 4, name: `Brand: ${b.display}`, item: pageUrl },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: valid ? `${b.display} Boats from ${year} for Sale` : "Boats by Year",
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
                Buy • Year • Brand
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {b.display} boats from {valid ? year : "—"}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
                {valid ? intro : "Invalid year."}
              </p>

              <div className="mt-4 text-sm text-slate-500">
                {valid ? (
                  total > 0 ? (
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
                    <>No live listings found for <span className="font-semibold text-slate-700">{b.display}</span> from <span className="font-semibold text-slate-700">{year}</span> right now.</>
                  )
                ) : (
                  <>Invalid year.</>
                )}
              </div>

              {valid && total > 0 ? (
                <div className="mt-8">
                  <MarketOverview stats={stats} />
                </div>
              ) : null}
            </div>

            {valid && total > 0 ? (
              <RelatedSearches
                kind="brand"
                brandDisplay={b.display}
                brandSlug={safeBrandSlug}
                models={modelsTop}
                countries={countriesTop}
                years={[year]}
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
                No listings live for {b.display} from {valid ? year : "—"} yet.
              </div>
              <p className="mt-2 text-slate-600">Try browsing all boats, or check back soon — inventory updates regularly.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/buy/year/${valid ? year : ""}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-95"
                >
                  Browse {valid ? year : "year"} listings
                </Link>
                <Link
                  href="/buy"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
                >
                  Browse all boats
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => {
                const img = l.media?.[0]?.url || "";
                const price = fmtPrice(l.priceCents, l.currency);
                const specs = [
                  l.model || null,
                  l.year ? `${l.year}` : null,
                  l.lengthM ? `${Math.round(l.lengthM)}m` : l.lengthFt ? `${Math.round(l.lengthFt)}ft` : null,
                  l.country || l.location || null,
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
                        <div className="text-lg font-semibold tracking-tight text-slate-900">{price}</div>
                        {l.featured ? (
                          <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            Featured
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-1 text-sm text-slate-600">{specs.join(" • ")}</div>
                      <div className="mt-2 line-clamp-2 text-[15px] font-medium text-slate-900">{l.title}</div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <div className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">Findaly</div>
                        <div className="text-sm font-semibold text-slate-900">View →</div>
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
