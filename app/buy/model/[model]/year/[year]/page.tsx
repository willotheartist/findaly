// app/buy/model/[model]/year/[year]/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { absoluteUrl, getSiteUrl, truncate } from "@/lib/site";

type PageProps = {
  params: Promise<{ model: string; year: string }>;
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

/**
 * Accepts:
 * - "oceanis-51-1"
 * - "beneteau-oceanis-51-1" (brand + model combined)
 *
 * We keep model hubs cross-brand-safe, and canonicalize to model-only.
 */
function modelFromParam(param: string) {
  const raw = decodeParam(param).trim();
  const spaced = raw.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

  const parts = spaced.split(" ").filter(Boolean);
  const modelCandidateRaw = parts.length >= 2 ? parts.slice(1).join(" ") : null;

  const canonicalSpaced = modelCandidateRaw || spaced;

  return {
    raw,
    spaced,
    canonicalSpaced,
    display: titleCaseWords(canonicalSpaced),
    modelCandidateRaw,
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
  m: ReturnType<typeof modelFromParam>,
  year: number
): Prisma.ListingWhereInput {
  const modelOr: Prisma.ListingWhereInput[] = [
    { model: { equals: m.canonicalSpaced, mode: "insensitive" } },
    { model: { equals: m.spaced, mode: "insensitive" } },
  ];

  if (m.modelCandidateRaw) {
    modelOr.push({
      model: { equals: m.modelCandidateRaw, mode: "insensitive" },
    });
  }

  return {
    status: "LIVE",
    kind: "VESSEL",
    intent: "SALE",
    year,
    model: { not: null },
    OR: modelOr,
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
  modelDisplay: string;
  year: number;
  total: number;
  brandsTop?: string[];
  countriesTop?: string[];
}) {
  const { modelDisplay, year, total, brandsTop = [], countriesTop = [] } = opts;

  const b = brandsTop.slice(0, 3).filter(Boolean);
  const c = countriesTop.slice(0, 3).filter(Boolean);

  const bits: string[] = [];
  bits.push(
    `Browse ${total.toLocaleString()} ${modelDisplay} boat${
      total === 1 ? "" : "s"
    } from ${year} for sale on Findaly — updated regularly from trusted sellers and brokers.`
  );

  if (b.length) bits.push(`Top brands include ${b.join(", ")}.`);

  if (c.length) {
    bits.push(
      `Explore listings in ${c.join(
        ", "
      )} and beyond — with photos, specs, and direct enquiries.`
    );
  } else {
    bits.push(
      `Compare specs, pricing, and location — then enquire directly with sellers and brokers.`
    );
  }

  return bits.join(" ");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { model, year: yearParam } = await params;
  const m = modelFromParam(model);
  const y = parseYear(yearParam);

  const validYear = Number.isFinite(y.year) && y.year >= 1900 && y.year <= 2100;

  if (!validYear) {
    return {
      title: `${m.display} Boats by Year`,
      description: truncate(`Explore ${m.display} boats by year on Findaly.`, 160),
      robots: { index: false, follow: true },
    };
  }

  const where = buildWhere(m, y.year);
  const total = await prisma.listing.count({ where });

  const title =
    total > 0
      ? `${m.display} Boats from ${y.year} for Sale`
      : `${m.display} Boats from ${y.year}`;

  const description =
    total > 0
      ? truncate(
          `Browse ${total.toLocaleString()} ${m.display} boats from ${y.year} for sale worldwide. Compare specs, prices, and locations — then enquire directly with sellers and brokers on Findaly.`,
          160
        )
      : truncate(
          `Explore ${m.display} boats from ${y.year} on Findaly. New inventory is added regularly.`,
          160
        );

  const canonical = `/buy/model/${slugifyLoose(m.canonicalSpaced)}/year/${y.year}`;

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

export default async function ModelYearHubPage({ params }: PageProps) {
  const { model, year: yearParam } = await params;
  const m = modelFromParam(model);
  const y = parseYear(yearParam);

  const validYear = Number.isFinite(y.year) && y.year >= 1900 && y.year <= 2100;
  const safeModelSlug = slugifyLoose(m.canonicalSpaced);

  const where: Prisma.ListingWhereInput = validYear
    ? buildWhere(m, y.year)
    : { status: "LIVE", kind: "VESSEL", intent: "SALE", year: -1 };

  const [total, listings, topBrands, topCountries] = await Promise.all([
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
      by: ["country"],
      where: { ...where, country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 12,
    }),
  ]);

  const brandsTop = topBrands.map((x) => x.brand).filter((x): x is string => !!x);
  const countriesTop = topCountries.map((x) => x.country).filter((x): x is string => !!x);

  const intro =
    validYear && total > 0
      ? buildSeoIntro({
          modelDisplay: m.display,
          year: y.year,
          total,
          brandsTop,
          countriesTop,
        })
      : validYear
        ? `Explore ${m.display} boats from ${y.year} on Findaly. New inventory is added regularly.`
        : "This page expects a valid year like /buy/model/oceanis-51-1/year/2020.";

  const base = getSiteUrl();
  const pageUrl = `${base}/buy/model/${safeModelSlug}/year/${validYear ? y.year : ""}`;

  const breadcrumb: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Findaly", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Buy", item: `${base}/buy` },
      { "@type": "ListItem", position: 3, name: `Model: ${m.display}`, item: `${base}/buy/model/${safeModelSlug}` },
      { "@type": "ListItem", position: 4, name: `Year: ${validYear ? y.year : "—"}`, item: pageUrl },
    ],
  };

  const itemList: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: validYear ? `${m.display} Boats from ${y.year} for Sale` : `${m.display} Boats by Year`,
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
                Buy • Model • Year
              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {m.display} boats from {validYear ? y.year : "—"}
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
                      No live listings found for{" "}
                      <span className="font-semibold text-slate-700">{m.display}</span>{" "}
                      from{" "}
                      <span className="font-semibold text-slate-700">{y.year}</span>{" "}
                      right now.
                    </>
                  )
                ) : (
                  <>Invalid year.</>
                )}
              </div>
            </div>

            {(brandsTop.length > 0 || countriesTop.length > 0) && validYear ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                  <div className="text-sm font-semibold text-slate-900">
                    Top brands
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {brandsTop.slice(0, 10).map((b) => (
                      <Link
                        key={b}
                        href={`/buy/brand/${slugifyLoose(b)}/model/${safeModelSlug}`}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                      >
                        {b}
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
                        href={`/buy/model/${safeModelSlug}/country/${slugifyLoose(c)}`}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          {!validYear ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="text-lg font-semibold text-slate-900">
                Invalid year.
              </div>
              <p className="mt-2 text-slate-600">
                Try a URL like{" "}
                <span className="font-mono">/buy/model/{safeModelSlug}/year/2020</span>.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/buy/model/${safeModelSlug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-95"
                >
                  Browse {m.display}
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
                No {m.display} listings live from {y.year} yet.
              </div>
              <p className="mt-2 text-slate-600">
                Try browsing all boats, or check back soon — inventory updates
                regularly.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/buy/model/${safeModelSlug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-95"
                >
                  Browse {m.display}
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
