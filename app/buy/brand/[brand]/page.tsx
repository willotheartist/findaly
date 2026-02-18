// app/buy/brand/[brand]/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { absoluteUrl, getSiteUrl, truncate } from "@/lib/site";
import type { Prisma } from "@prisma/client";

import { getMarketStats } from "@/lib/seo/marketStats";
import MarketOverview from "@/components/seo/MarketOverview";
import RelatedSearches from "@/components/seo/RelatedSearches";

type PageProps = {
  params: Promise<{ brand: string }>;
};

type JsonLdObject = Record<string, unknown>;

function decodeParam(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function brandFromParam(param: string) {
  const raw = decodeParam(param).trim();
  // url-friendly -> human-ish
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
  brandDisplay: string;
  total: number;
  countriesTop?: string[];
  modelsTop?: string[];
}) {
  const { brandDisplay, total, countriesTop = [], modelsTop = [] } = opts;

  const c = countriesTop.slice(0, 3).filter(Boolean);
  const m = modelsTop.slice(0, 3).filter(Boolean);

  const bits: string[] = [];

  bits.push(
    `Browse ${total.toLocaleString()} ${brandDisplay} boat${
      total === 1 ? "" : "s"
    } for sale on Findaly — updated regularly from trusted sellers and brokers.`
  );

  if (m.length) {
    bits.push(
      `Popular models include ${m.map((x) => `${brandDisplay} ${x}`).join(", ")}.`
    );
  }

  if (c.length) {
    bits.push(
      `Explore listings in ${c.join(
        ", "
      )} and beyond — with transparent details, photos, and direct enquiries.`
    );
  } else {
    bits.push(
      `Compare specs, pricing, and location — then enquire directly with sellers and brokers.`
    );
  }

  return bits.join(" ");
}

function slugifyLoose(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function jsonLd(obj: JsonLdObject) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
    />
  );
}

function buildBrandWhere(
  b: ReturnType<typeof brandFromParam>
): Prisma.ListingWhereInput {
  return {
    status: "LIVE",
    kind: "VESSEL",
    intent: "SALE",
    OR: [
      { brand: { equals: b.spaced, mode: "insensitive" } },
      { brand: { equals: b.raw, mode: "insensitive" } },
    ],
  };
}

function fmtPrice(cents: number | null | undefined, cur: string) {
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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { brand } = await params;
  const b = brandFromParam(brand);

  const where = buildBrandWhere(b);

  // We do a tiny count to decide whether to noindex
  const total = await prisma.listing.count({ where });

  const title = total > 0 ? `${b.display} Boats for Sale` : `${b.display} Boats`;

  const description =
    total > 0
      ? truncate(
          `Browse ${total.toLocaleString()} ${b.display} boats for sale worldwide. Compare specs, prices, and locations — then enquire directly with sellers and brokers on Findaly.`,
          160
        )
      : truncate(
          `Explore ${b.display} boats and listings on Findaly. New inventory is added regularly.`,
          160
        );

  const canonical = `/buy/brand/${slugifyLoose(b.spaced)}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots:
      total > 0
        ? { index: true, follow: true }
        : { index: false, follow: true }, // avoid thin index pages
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

export default async function BrandHubPage({ params }: PageProps) {
  const { brand } = await params;
  const b = brandFromParam(brand);

  const where = buildBrandWhere(b);

  const [total, listings, modelsGrouped, countriesGrouped, yearsGrouped, stats] =
    await Promise.all([
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
      }),

      prisma.listing.groupBy({
        by: ["country"],
        where: { ...where, country: { not: null } },
        _count: { country: true },
      }),

      prisma.listing.groupBy({
        by: ["year"],
        where: { ...where, year: { not: null } },
        _count: { year: true },
      }),

      getMarketStats(where),
    ]);

  const topModels = modelsGrouped
    .filter(
      (x): x is { model: string; _count: { model: number } } => Boolean(x.model)
    )
    .map((x) => ({ key: x.model, count: x._count.model ?? 0 }))
    .sort((a, b2) => b2.count - a.count)
    .slice(0, 12);

  const topCountries = countriesGrouped
    .filter(
      (x): x is { country: string; _count: { country: number } } =>
        Boolean(x.country)
    )
    .map((x) => ({ key: x.country, count: x._count.country ?? 0 }))
    .sort((a, b2) => b2.count - a.count)
    .slice(0, 12);

  const topYears = yearsGrouped
    .filter((x): x is { year: number; _count: { year: number } } => typeof x.year === "number")
    .map((x) => ({ year: x.year, count: x._count.year ?? 0 }))
    .sort((a, b2) => b2.count - a.count)
    .slice(0, 12)
    .map((x) => x.year)
    .sort((a, b2) => b2 - a); // show newest first

  const modelsTop = topModels.map((x) => x.key);
  const countriesTop = topCountries.map((x) => x.key);

  const intro = buildSeoIntro({
    brandDisplay: b.display,
    total,
    modelsTop,
    countriesTop,
  });

  const base = getSiteUrl();
  const safeBrandSlug = slugifyLoose(b.spaced);
  const pageUrl = `${base}/buy/brand/${safeBrandSlug}`;

  const breadcrumb: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Findaly", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Buy", item: `${base}/buy` },
      {
        "@type": "ListItem",
        position: 3,
        name: `Brand: ${b.display}`,
        item: pageUrl,
      },
    ],
  };

  const itemList: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${b.display} Boats for Sale`,
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

      {/* Hero */}
      <section className="w-full border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
                Buy • Brand
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {b.display} boats for sale
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
                    No live listings found for{" "}
                    <span className="font-semibold text-slate-700">
                      {b.display}
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
            {(modelsTop.length > 0 ||
              countriesTop.length > 0 ||
              topYears.length > 0) && total > 0 ? (
              <RelatedSearches
                kind="brand"
                brandDisplay={b.display}
                brandSlug={safeBrandSlug}
                models={modelsTop}
                countries={countriesTop}
                years={topYears}
              />
            ) : null}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          {total === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="text-lg font-semibold text-slate-900">
                No {b.display} listings live yet.
              </div>
              <p className="mt-2 text-slate-600">
                Try browsing all boats, or check back soon — inventory updates
                regularly.
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
                  l.year ? `${l.year}` : null,
                  l.lengthM
                    ? `${Math.round(l.lengthM)}m`
                    : l.lengthFt
                      ? `${Math.round(l.lengthFt)}ft`
                      : null,
                  l.country || l.location || null,
                ].filter((x): x is string => Boolean(x));

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
