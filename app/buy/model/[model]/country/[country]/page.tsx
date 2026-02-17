// app/buy/model/[model]/country/[country]/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { absoluteUrl, getSiteUrl, truncate } from "@/lib/site";
import type { Prisma } from "@prisma/client";

type PageProps = {
  params: Promise<{ model: string; country: string }>;
};

function decodeParam(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function titleCaseWords(input: string) {
  return input
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
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

function modelFromParam(param: string) {
  const raw = decodeParam(param).trim();
  const spaced = raw.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

  const parts = spaced.split(" ").filter(Boolean);
  const brandCandidate = parts.length >= 2 ? parts[0] : null;
  const modelCandidate = parts.length >= 2 ? parts.slice(1).join(" ") : null;

  return {
    raw,
    spaced,
    display: titleCaseWords(spaced),
    brandCandidate: brandCandidate ? titleCaseWords(brandCandidate) : null,
    modelCandidate: modelCandidate ? titleCaseWords(modelCandidate) : null,
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

function buildSeoIntro(opts: {
  modelDisplay: string;
  countryDisplay: string;
  total: number;
  brandsTop?: string[];
  yearsTop?: number[];
}) {
  const { modelDisplay, countryDisplay, total, brandsTop = [], yearsTop = [] } = opts;

  const b = brandsTop.slice(0, 3).filter(Boolean);
  const y = yearsTop.slice(0, 3).filter((n) => typeof n === "number" && !Number.isNaN(n));

  const bits: string[] = [];
  bits.push(
    `Browse ${total.toLocaleString()} ${modelDisplay} boat${
      total === 1 ? "" : "s"
    } for sale in ${countryDisplay} on Findaly — updated regularly from trusted sellers and brokers.`
  );
  if (b.length) bits.push(`Top brands include ${b.join(", ")}.`);
  if (y.length) bits.push(`Popular years include ${y.join(", ")}.`);
  bits.push(`Compare specs, pricing, and location — then enquire directly with sellers and brokers.`);
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
  if (!cents) return "POA";
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

function buildWhere(m: ReturnType<typeof modelFromParam>, c: ReturnType<typeof countryFromParam>): Prisma.ListingWhereInput {
  const modelOr: Prisma.ListingWhereInput[] = [
    { model: { equals: m.spaced, mode: "insensitive" } },
  ];

  if (m.modelCandidate && m.brandCandidate) {
    modelOr.push({
      AND: [
        { brand: { equals: m.brandCandidate, mode: "insensitive" } },
        { model: { equals: m.modelCandidate, mode: "insensitive" } },
      ],
    });
  }

  const countryOr: Prisma.ListingWhereInput[] = [
    { country: { equals: c.spaced, mode: "insensitive" } },
    { country: { equals: c.raw, mode: "insensitive" } },
    { country: { equals: c.display, mode: "insensitive" } },
    { country: { equals: c.upper, mode: "insensitive" } },
  ];

  const where: Prisma.ListingWhereInput = {
    status: "LIVE",
    kind: "VESSEL",
    intent: "SALE",
    AND: [
      { model: { not: null } },
      { OR: modelOr },
      { OR: countryOr },
    ],
  };

  return where;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { model, country } = await params;
  const m = modelFromParam(model);
  const c = countryFromParam(country);

  const where = buildWhere(m, c);
  const total = await prisma.listing.count({ where });

  const title = total > 0 ? `${m.display} Boats for Sale in ${c.display}` : `${m.display} Boats in ${c.display}`;
  const description =
    total > 0
      ? truncate(
          `Browse ${total.toLocaleString()} ${m.display} boats for sale in ${c.display}. Compare specs, prices, and locations — then enquire directly with sellers and brokers on Findaly.`,
          160
        )
      : truncate(`Explore ${m.display} boats in ${c.display} on Findaly. New inventory is added regularly.`, 160);

  const canonical = `/buy/model/${slugifyLoose(m.spaced)}/country/${slugifyLoose(c.spaced)}`;

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

export default async function ModelCountryHubPage({ params }: PageProps) {
  const { model, country } = await params;
  const m = modelFromParam(model);
  const c = countryFromParam(country);

  const where = buildWhere(m, c);

  const [total, listings, topBrands, topYears] = await Promise.all([
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
      by: ["year"],
      where: { ...where, year: { not: null } },
      _count: { year: true },
      orderBy: { _count: { year: "desc" } },
      take: 12,
    }),
  ]);

  const brandsTop = topBrands.map((x) => x.brand).filter((x): x is string => !!x);
  const yearsTop = topYears.map((x) => x.year).filter((x): x is number => typeof x === "number");

  const intro = buildSeoIntro({
    modelDisplay: m.display,
    countryDisplay: c.display,
    total,
    brandsTop,
    yearsTop,
  });

  const base = getSiteUrl();
  const safeModelSlug = slugifyLoose(m.spaced);
  const safeCountrySlug = slugifyLoose(c.spaced);
  const pageUrl = `${base}/buy/model/${safeModelSlug}/country/${safeCountrySlug}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Findaly", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Buy", item: `${base}/buy` },
      { "@type": "ListItem", position: 3, name: `Model: ${m.display}`, item: `${base}/buy/model/${safeModelSlug}` },
      { "@type": "ListItem", position: 4, name: `Country: ${c.display}`, item: pageUrl },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${m.display} Boats for Sale in ${c.display}`,
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
          <div className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">Buy • Model • Country</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {m.display} boats for sale in {c.display}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">{intro}</p>

          <div className="mt-4 text-sm text-slate-500">
            {total > 0 ? (
              <>
                Showing <span className="font-semibold text-slate-700">{Math.min(36, total)}</span> of{" "}
                <span className="font-semibold text-slate-700">{total.toLocaleString()}</span> listings.
              </>
            ) : (
              <>
                No live listings found for <span className="font-semibold text-slate-700">{m.display}</span> in{" "}
                <span className="font-semibold text-slate-700">{c.display}</span> right now.
              </>
            )}
          </div>

          {(brandsTop.length > 0 || yearsTop.length > 0) && (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Popular brands</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {brandsTop.slice(0, 10).map((b) => (
                    <Link
                      key={b}
                      href={`/buy/brand/${slugifyLoose(b)}/model/${safeModelSlug}`}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                    >
                      {b} {m.display}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Popular years</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {yearsTop.slice(0, 10).map((yy) => (
                    <Link
                      key={yy}
                      href={`/buy/model/${safeModelSlug}/year/${yy}`}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                    >
                      {yy}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/buy/model/${safeModelSlug}`}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-95"
            >
              All {m.display} boats
            </Link>
            <Link
              href={`/buy/country/${safeCountrySlug}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
            >
              All boats in {c.display}
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          {total === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="text-lg font-semibold text-slate-900">
                No {m.display} listings live in {c.display} yet.
              </div>
              <p className="mt-2 text-slate-600">Try the model page or the country page — or check back soon.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/buy/model/${safeModelSlug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-95"
                >
                  Browse {m.display}
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
                  l.brand || null,
                  l.year ? `${l.year}` : null,
                  l.lengthM ? `${Math.round(l.lengthM)}m` : l.lengthFt ? `${Math.round(l.lengthFt)}ft` : null,
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
