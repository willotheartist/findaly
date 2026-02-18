// app/buy/country/[country]/year/[year]/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { absoluteUrl, getSiteUrl, truncate } from "@/lib/site";

type PageProps = {
  params: Promise<{ country: string; year: string }>;
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

function parseYear(param: string) {
  const raw = decodeParam(param).trim();
  const n = Number(raw);
  const year = Number.isFinite(n) ? Math.trunc(n) : NaN;
  return { raw, year };
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
  c: ReturnType<typeof countryFromParam>,
  year: number
): Prisma.ListingWhereInput {
  return {
    status: "LIVE",
    kind: "VESSEL",
    intent: "SALE",
    year,
    OR: [
      { country: { equals: c.spaced, mode: "insensitive" } },
      { country: { equals: c.raw, mode: "insensitive" } },
      { country: { equals: c.display, mode: "insensitive" } },
      { country: { equals: c.upper, mode: "insensitive" } },
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
  countryDisplay: string;
  year: number;
  total: number;
  brandsTop?: string[];
  modelsTop?: string[];
}) {
  const { countryDisplay, year, total, brandsTop = [], modelsTop = [] } = opts;

  const b = brandsTop.slice(0, 3).filter(Boolean);
  const m = modelsTop.slice(0, 3).filter(Boolean);

  const bits: string[] = [];
  bits.push(
    `Browse ${total.toLocaleString()} boat${total === 1 ? "" : "s"} from ${year} for sale in ${countryDisplay} on Findaly — updated regularly from trusted sellers and brokers.`
  );

  if (b.length) bits.push(`Popular brands include ${b.join(", ")}.`);
  if (m.length) bits.push(`Common models include ${m.join(", ")}.`);

  bits.push(
    `Compare specs, prices, and location — then enquire directly with sellers and brokers.`
  );

  return bits.join(" ");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { country, year: yearParam } = await params;
  const c = countryFromParam(country);
  const y = parseYear(yearParam);

  const validYear = Number.isFinite(y.year) && y.year >= 1900 && y.year <= 2100;

  if (!validYear) {
    return {
      title: `Boats in ${c.display} by Year`,
      description: truncate(`Explore boats for sale in ${c.display} by year on Findaly.`, 160),
      robots: { index: false, follow: true },
    };
  }

  const where = buildWhere(c, y.year);
  const total = await prisma.listing.count({ where });

  const title =
    total > 0
      ? `Boats from ${y.year} for Sale in ${c.display}`
      : `Boats from ${y.year} in ${c.display}`;

  const description =
    total > 0
      ? truncate(
          `Browse ${total.toLocaleString()} boats from ${y.year} for sale in ${c.display}. Compare specs, prices, and locations — then enquire directly with sellers and brokers on Findaly.`,
          160
        )
      : truncate(
          `Explore boats from ${y.year} in ${c.display} on Findaly. New inventory is added regularly.`,
          160
        );

  const canonical = `/buy/country/${slugifyLoose(c.spaced)}/year/${y.year}`;

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

export default async function CountryYearHubPage({ params }: PageProps) {
  const { country, year: yearParam } = await params;
  const c = countryFromParam(country);
  const y = parseYear(yearParam);

  const validYear = Number.isFinite(y.year) && y.year >= 1900 && y.year <= 2100;
  const safeCountrySlug = slugifyLoose(c.spaced);

  const where: Prisma.ListingWhereInput = validYear
    ? buildWhere(c, y.year)
    : { status: "LIVE", kind: "VESSEL", intent: "SALE", year: -1 };

  const [total, listings, topBrands, topModels] = await Promise.all([
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
  ]);

  const brandsTop = topBrands.map((x) => x.brand).filter((x): x is string => !!x);
  const modelsTop = topModels.map((x) => x.model).filter((x): x is string => !!x);

  const intro =
    validYear && total > 0
      ? buildSeoIntro({
          countryDisplay: c.display,
          year: y.year,
          total,
          brandsTop,
          modelsTop,
        })
      : validYear
        ? `Explore boats from ${y.year} in ${c.display} on Findaly. New inventory is added regularly.`
        : "This page expects a valid year like /buy/country/france/year/2020.";

  const base = getSiteUrl();
  const pageUrl = `${base}/buy/country/${safeCountrySlug}/year/${validYear ? y.year : ""}`;

  const breadcrumb: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Findaly", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Buy", item: `${base}/buy` },
      { "@type": "ListItem", position: 3, name: `Country: ${c.display}`, item: `${base}/buy/country/${safeCountrySlug}` },
      { "@type": "ListItem", position: 4, name: `Year: ${validYear ? y.year : "—"}`, item: pageUrl },
    ],
  };

  const itemList: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: validYear
      ? `Boats from ${y.year} for Sale in ${c.display}`
      : `Boats in ${c.display} by Year`,
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
                Buy • Country • Year
              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Boats from {validYear ? y.year : "—"} in {c.display}
              </h1>

              <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
                {intro}
              </p>

              <div className="mt-4 text-sm text-slate-500">
                {validYear ? (
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
                    <>
                      No live listings found in{" "}
                      <span className="font-semibold text-slate-700">{c.display}</span>{" "}
                      for{" "}
                      <span className="font-semibold text-slate-700">{y.year}</span>{" "}
                      right now.
                    </>
                  )
                ) : (
                  <>Invalid year.</>
                )}
              </div>
            </div>

            {(brandsTop.length > 0 || modelsTop.length > 0) && validYear ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                  <div className="text-sm font-semibold text-slate-900">
                    Popular brands
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {brandsTop.slice(0, 10).map((b) => (
                      <Link
                        key={b}
                        href={`/buy/brand/${slugifyLoose(b)}/country/${safeCountrySlug}`}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                      >
                        {b}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                  <div className="text-sm font-semibold text-slate-900">
                    Popular models
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {modelsTop.slice(0, 10).map((m) => (
                      <Link
                        key={m}
                        href={`/buy/model/${slugifyLoose(m)}/country/${safeCountrySlug}`}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                      >
                        {m}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          {!validYear ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="text-lg font-semibold text-slate-900">
                Invalid year.
              </div>
              <p className="mt-2 text-slate-600">
                Try a URL like{" "}
                <span className="font-mono">/buy/country/{safeCountrySlug}/year/2020</span>.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/buy/country/${safeCountrySlug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-95"
                >
                  Browse {c.display}
                </Link>
                <Link
                  href="/buy"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
                >
                  Browse all boats
                </Link>
              </div>
            </div>
          ) : total === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="text-lg font-semibold text-slate-900">
                No listings live in {c.display} from {y.year} yet.
              </div>
              <p className="mt-2 text-slate-600">
                Try browsing all boats, or check back soon — inventory updates
                regularly.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/buy/country/${safeCountrySlug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-95"
                >
                  Browse {c.display}
                </Link>
                <Link
                  href={`/buy/year/${y.year}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
                >
                  Browse {y.year}
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
