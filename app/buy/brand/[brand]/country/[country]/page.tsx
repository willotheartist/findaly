// app/buy/brand/[brand]/country/[country]/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { absoluteUrl, getSiteUrl, truncate } from "@/lib/site";

type PageProps = {
  params: Promise<{ brand: string; country: string }>;
};

type JsonLdObject = Record<string, unknown>;

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

function titleCaseWords(input: string) {
  return (input || "")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
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

function countryFromParam(param: string) {
  const raw = decodeParam(param).trim();
  const spaced = raw.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return {
    raw,
    spaced,
    display: titleCaseWords(spaced),
    upper: spaced.toUpperCase(),
  };
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

function buildWhere(
  b: ReturnType<typeof brandFromParam>,
  c: ReturnType<typeof countryFromParam>
): Prisma.ListingWhereInput {
  return {
    status: "LIVE",
    kind: "VESSEL",
    intent: "SALE",
    OR: [
      {
        AND: [
          {
            OR: [
              { brand: { equals: b.spaced, mode: "insensitive" } },
              { brand: { equals: b.raw, mode: "insensitive" } },
            ],
          },
          {
            OR: [
              { country: { equals: c.spaced, mode: "insensitive" } },
              { country: { equals: c.raw, mode: "insensitive" } },
              { country: { equals: c.display, mode: "insensitive" } },
              { country: { equals: c.upper, mode: "insensitive" } },
            ],
          },
        ],
      },
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

function buildSeoIntro(opts: {
  brandDisplay: string;
  countryDisplay: string;
  total: number;
  modelsTop?: string[];
  yearsTop?: number[];
}) {
  const { brandDisplay, countryDisplay, total, modelsTop = [], yearsTop = [] } =
    opts;

  const m = modelsTop.slice(0, 3).filter(Boolean);
  const y = yearsTop
    .slice(0, 3)
    .filter((n) => typeof n === "number" && !Number.isNaN(n));

  const bits: string[] = [];
  bits.push(
    `Browse ${total.toLocaleString()} ${brandDisplay} boat${
      total === 1 ? "" : "s"
    } for sale in ${countryDisplay} on Findaly — updated regularly from trusted sellers and brokers.`
  );
  if (m.length) bits.push(`Popular models include ${m.map((x) => `${brandDisplay} ${x}`).join(", ")}.`);
  if (y.length) bits.push(`Popular years include ${y.join(", ")}.`);
  bits.push(
    `Compare specs, pricing, and location — then enquire directly with sellers and brokers.`
  );

  return bits.join(" ");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { brand, country } = await params;
  const b = brandFromParam(brand);
  const c = countryFromParam(country);

  const where = buildWhere(b, c);
  const total = await prisma.listing.count({ where });

  const title =
    total > 0
      ? `${b.display} Boats for Sale in ${c.display}`
      : `${b.display} Boats in ${c.display}`;

  const description =
    total > 0
      ? truncate(
          `Browse ${total.toLocaleString()} ${b.display} boats for sale in ${c.display}. Compare specs, prices, and locations — then enquire directly with sellers and brokers on Findaly.`,
          160
        )
      : truncate(
          `Explore ${b.display} boats in ${c.display} on Findaly. New inventory is added regularly.`,
          160
        );

  const canonical = `/buy/brand/${slugifyLoose(b.spaced)}/country/${slugifyLoose(
    c.spaced
  )}`;

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

export default async function BrandCountryHubPage({ params }: PageProps) {
  const { brand, country } = await params;
  const b = brandFromParam(brand);
  const c = countryFromParam(country);

  const safeBrandSlug = slugifyLoose(b.spaced);
  const safeCountrySlug = slugifyLoose(c.spaced);

  const where = buildWhere(b, c);

  const [total, listings, topModels, topYears] = await Promise.all([
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
      by: ["year"],
      where: { ...where, year: { not: null } },
      _count: { year: true },
      orderBy: { _count: { year: "desc" } },
      take: 12,
    }),
  ]);

  const modelsTop = topModels.map((x) => x.model).filter((x): x is string => !!x);
  const yearsTop = topYears.map((x) => x.year).filter((x): x is number => typeof x === "number");

  const intro = buildSeoIntro({
    brandDisplay: b.display,
    countryDisplay: c.display,
    total,
    modelsTop,
    yearsTop,
  });

  const base = getSiteUrl();
  const pageUrl = `${base}/buy/brand/${safeBrandSlug}/country/${safeCountrySlug}`;

  const breadcrumb: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Findaly", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Buy", item: `${base}/buy` },
      { "@type": "ListItem", position: 3, name: `Brand: ${b.display}`, item: `${base}/buy/brand/${safeBrandSlug}` },
      { "@type": "ListItem", position: 4, name: `Country: ${c.display}`, item: pageUrl },
    ],
  };

  const itemList: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${b.display} Boats for Sale in ${c.display}`,
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
                Buy • Brand • Country
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {b.display} boats for sale in {c.display}
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
                    <span className="font-semibold text-slate-700">{b.display}</span>{" "}
                    in{" "}
                    <span className="font-semibold text-slate-700">{c.display}</span>{" "}
                    right now.
                  </>
                )}
              </div>
            </div>

            {(modelsTop.length > 0 || yearsTop.length > 0) && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                  <div className="text-sm font-semibold text-slate-900">
                    Popular models
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {modelsTop.slice(0, 10).map((m) => (
                      <Link
                        key={m}
                        href={`/buy/brand/${safeBrandSlug}/model/${slugifyLoose(m)}`}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                      >
                        {b.display} {m}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                  <div className="text-sm font-semibold text-slate-900">
                    Popular years
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {yearsTop.slice(0, 10).map((y) => (
                      <Link
                        key={y}
                        href={`/buy/brand/${safeBrandSlug}/year/${y}`}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                      >
                        {y}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    (We already built /buy/brand/[brand]/year/[year].)
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
                No {b.display} listings live in {c.display} yet.
              </div>
              <p className="mt-2 text-slate-600">
                Try browsing all {b.display} listings, or check back soon —
                inventory updates regularly.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/buy/brand/${safeBrandSlug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-95"
                >
                  Browse {b.display}
                </Link>
                <Link
                  href={`/buy/country/${safeCountrySlug}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
                >
                  Browse {c.display}
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
                  l.model ? `${l.model}` : null,
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
