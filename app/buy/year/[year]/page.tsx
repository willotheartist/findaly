// app/buy/year/[year]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { absoluteUrl, getSiteUrl, truncate } from "@/lib/site";

import RelatedSearches from "@/components/seo/RelatedSearches";
import { decodeParam, slugifyLoose } from "@/lib/seoParam";

type PageProps = {
  params: Promise<{ year: string }>;
};

type JsonLdObject = Record<string, unknown>;

const MIN_YEAR = 1950;
const MAX_YEAR = new Date().getFullYear() + 1;

function parseYearParam(param: string) {
  const raw = decodeParam(param).trim();
  const y = Number.parseInt(raw, 10);
  if (!Number.isFinite(y) || Number.isNaN(y) || y < MIN_YEAR || y > MAX_YEAR) return null;
  return y;
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

function buildWhere(year: number): Prisma.ListingWhereInput {
  return {
    status: "LIVE",
    kind: "VESSEL",
    intent: "SALE",
    year,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  const y = parseYearParam(year);
  if (!y) return { title: "Boats by Year | Findaly" };

  const where = buildWhere(y);
  const total = await prisma.listing.count({ where });

  const title = total > 0 ? `${y} Boats for Sale` : `${y} Boats`;
  const description =
    total > 0
      ? truncate(
          `Browse ${total.toLocaleString()} boats from ${y} for sale worldwide. Compare specs, prices, and locations — then enquire directly with sellers and brokers on Findaly.`,
          160
        )
      : truncate(`Explore boats from ${y} on Findaly. New inventory is added regularly.`, 160);

  const canonical = `/buy/year/${y}`;

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

export default async function YearHubPage({ params }: PageProps) {
  const { year } = await params;
  const y = parseYearParam(year);
  if (!y) notFound();

  const where = buildWhere(y);

  const [total, listings, topBrands, topModels, topCountries] = await Promise.all([
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
      by: ["country"],
      where: { ...where, country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 12,
    }),
  ]);

  const brandsTop = topBrands.map((x) => x.brand).filter((x): x is string => !!x);
  const modelsTop = topModels.map((x) => x.model).filter((x): x is string => !!x);
  const countriesTop = topCountries.map((x) => x.country).filter((x): x is string => !!x);

  const intro =
    total > 0
      ? `Browse ${total.toLocaleString()} boats from ${y} for sale on Findaly — updated regularly from trusted sellers and brokers. Compare specs, pricing, and location, then enquire directly.`
      : `Explore boats from ${y} on Findaly. New inventory is added regularly.`;

  const base = getSiteUrl();
  const pageUrl = `${base}/buy/year/${y}`;

  const breadcrumb: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Findaly", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Buy", item: `${base}/buy` },
      { "@type": "ListItem", position: 3, name: `Year: ${y}`, item: pageUrl },
    ],
  };

  const itemList: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${y} Boats for Sale`,
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
          <div className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
            Buy • Year
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Boats from {y}
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
            {intro}
          </p>

          <div className="mt-4 text-sm text-slate-500">
            {total > 0 ? (
              <>
                Showing <span className="font-semibold text-slate-700">{Math.min(36, total)}</span> of{" "}
                <span className="font-semibold text-slate-700">{total.toLocaleString()}</span> listings.
              </>
            ) : (
              <>No live listings found for {y}.</>
            )}
          </div>

          {(brandsTop.length > 0 || modelsTop.length > 0 || countriesTop.length > 0) && (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Popular brands</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {brandsTop.slice(0, 10).map((b) => (
                    <Link
                      key={b}
                      href={`/buy/year/${y}/brand/${slugifyLoose(b)}`}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                    >
                      {b}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Popular models</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {modelsTop.slice(0, 10).map((m) => (
                    <Link
                      key={m}
                      href={`/buy/year/${y}/model/${slugifyLoose(m)}`}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                    >
                      {m}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Top countries</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {countriesTop.slice(0, 10).map((c) => (
                    <Link
                      key={c}
                      href={`/buy/year/${y}/country/${slugifyLoose(c)}`}
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
      </section>

      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <Link
                key={l.id}
                href={`/buy/${l.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white no-underline transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  {l.media?.[0]?.url ? (
                    <Image
                      src={l.media[0].url}
                      alt={l.title}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                </div>

                <div className="p-4">
                  <div className="text-sm font-semibold text-slate-900">
                    {fmtPrice(l.priceCents ?? null, l.currency || "EUR")}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {(l.location || l.country || "—")}
                    {l.brand ? ` • ${l.brand}` : ""}
                    {l.model ? ` • ${l.model}` : ""}
                  </div>
                  <div className="mt-2 line-clamp-2 text-[15px] font-medium text-slate-900">
                    {l.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <RelatedSearches
              kind="year"
              year={y}
              brands={brandsTop}
              models={modelsTop}
              countries={countriesTop}
              maxPills={10}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
