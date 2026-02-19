// app/buy/brand/[brand]/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { absoluteUrl, getSiteUrl, truncate } from "@/lib/site";
import {
  brandFromParam,
  slugifyLoose,
  countrySlugFromValue,
  modelSlugFromValue,
} from "@/lib/seoParam";

type PageProps = {
  params: Promise<{ brand: string }>;
};

type JsonLdObject = Record<string, unknown>;

function jsonLd(obj: JsonLdObject) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
    />
  );
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
      { brand: { equals: b.display, mode: "insensitive" } },
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

function fmtMoneyEURFromCents(cents: number | null | undefined) {
  if (!cents || cents <= 0) return "—";
  const v = cents / 100;
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `${Math.round(v).toLocaleString()} EUR`;
  }
}

function fmtNumber(n: number | null | undefined, suffix = "") {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  if (!Number.isFinite(n)) return "—";
  const rounded = Math.round(n);
  return `${rounded.toLocaleString()}${suffix}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { brand } = await params;
  const b = brandFromParam(brand);

  const where = buildBrandWhere(b);
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
        : { index: false, follow: true },
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

  const [
    total,
    listings,
    modelsGrouped,
    countriesGrouped,
    agg,
    distinctCountries,
  ] = await Promise.all([
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

    prisma.listing.aggregate({
      where,
      _avg: { priceCents: true, lengthM: true, lengthFt: true },
      _min: { priceCents: true, lengthM: true, lengthFt: true },
      _max: { priceCents: true, lengthM: true, lengthFt: true },
    }),

    prisma.listing.findMany({
      where: { ...where, country: { not: null } },
      distinct: ["country"],
      select: { country: true },
    }),
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

  const modelsTop = topModels.map((x) => x.key);
  const countriesTop = topCountries.map((x) => x.key);

  const intro = buildSeoIntro({
    brandDisplay: b.display,
    total,
    modelsTop,
    countriesTop,
  });

  const base = getSiteUrl();
  const pageUrl = `${base}/buy/brand/${slugifyLoose(b.spaced)}`;

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

  const safeBrandSlug = slugifyLoose(b.spaced);
  const isBeneteau = safeBrandSlug === "beneteau";

  const beneteauGuides: Array<{
    title: string;
    desc: string;
    href: string;
  }> = [
    {
      title: "Buying a Beneteau",
      desc: "The complete buyer guide — models, prices, common mistakes, and what to check.",
      href: "/guides/buying-a-beneteau",
    },
    {
      title: "Beneteau Price Guide",
      desc: "Realistic price ranges by size, condition, year, and region — plus what moves value.",
      href: "/guides/beneteau-price-guide",
    },
    {
      title: "Beneteau vs Jeanneau",
      desc: "Which brand fits your use case? Layouts, build, resale, maintenance, and buyer profiles.",
      href: "/guides/beneteau-vs-jeanneau",
    },
    {
      title: "Buying a Used Beneteau",
      desc: "A checklist-style guide for viewings, surveys, red flags, and negotiation angles.",
      href: "/guides/buying-a-used-beneteau",
    },
  ];

  const countriesListed = distinctCountries
    .map((x) => x.country)
    .filter((x): x is string => Boolean(x)).length;

  const avgPriceCents = agg._avg.priceCents
    ? Math.round(agg._avg.priceCents)
    : null;
  const minPriceCents = agg._min.priceCents
    ? Math.round(agg._min.priceCents)
    : null;
  const maxPriceCents = agg._max.priceCents
    ? Math.round(agg._max.priceCents)
    : null;

  const avgLengthM =
    typeof agg._avg.lengthM === "number" ? agg._avg.lengthM : null;
  const avgLengthFt =
    typeof agg._avg.lengthFt === "number" ? agg._avg.lengthFt : null;

  const marketAvgLengthText =
    avgLengthM && avgLengthM > 0
      ? `${fmtNumber(avgLengthM, "m")}`
      : avgLengthFt && avgLengthFt > 0
      ? `${fmtNumber(avgLengthFt, "ft")}`
      : "—";

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
                <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900">
                      Market overview
                    </div>
                    <div className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
                      Live listings
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                      <div className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
                        Average price
                      </div>
                      <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                        {fmtMoneyEURFromCents(avgPriceCents)}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Based on listings with prices
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                      <div className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
                        Price range
                      </div>
                      <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                        {minPriceCents && maxPriceCents
                          ? `${fmtMoneyEURFromCents(
                              minPriceCents
                            )} – ${fmtMoneyEURFromCents(maxPriceCents)}`
                          : "—"}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Min–max of priced listings
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                      <div className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
                        Average length
                      </div>
                      <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                        {marketAvgLengthText}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Uses metres when available
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                      <div className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
                        Countries listed
                      </div>
                      <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                        {fmtNumber(countriesListed)}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Distinct listing countries
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* ✅ Authority layer: Beneteau guide cluster */}
              {isBeneteau ? (
                <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Beneteau buying guides
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        Research the brand, understand pricing, and learn what to
                        check before you view a boat.
                      </div>
                    </div>
                    <div className="hidden sm:block text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
                      Authority
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {beneteauGuides.map((g) => (
                      <Link
                        key={g.href}
                        href={g.href}
                        className="group rounded-2xl border border-slate-200/80 bg-white p-4 no-underline hover:border-slate-300"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-[15px] font-semibold tracking-tight text-slate-900">
                            {g.title}
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            →
                          </div>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                          {g.desc}
                        </p>
                        <div className="mt-3 text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
                          Read guide
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/finance"
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                    >
                      Yacht finance
                    </Link>
                    <Link
                      href="/brokers"
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                    >
                      Find a broker
                    </Link>
                    <Link
                      href="/buy"
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                    >
                      Browse all boats
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Quick links */}
            {(modelsTop.length > 0 || countriesTop.length > 0) && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                  <div className="text-sm font-semibold text-slate-900">
                    Popular models
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {modelsTop.slice(0, 10).map((m) => (
                      <Link
                        key={m}
                        href={`/buy/model/${modelSlugFromValue(
                          `${b.spaced} ${m}`
                        )}`}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                      >
                        {b.display} {m}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                  <div className="text-sm font-semibold text-slate-900">
                    Top countries
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {countriesTop.slice(0, 10).map((c) => (
                      <Link
                        key={c}
                        href={`/buy/brand/${safeBrandSlug}/country/${countrySlugFromValue(
                          c
                        )}`}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
