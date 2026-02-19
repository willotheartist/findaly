// app/buy/brand/[brand]/model/[model]/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { absoluteUrl, getSiteUrl, truncate } from "@/lib/site";

type PageProps = {
  params: Promise<{ brand: string; model: string }>;
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
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqStrings(arr: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of arr) {
    const k = (s || "").trim();
    if (!k) continue;
    const key = k.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(k);
  }
  return out;
}

function brandFromParam(param: string) {
  const raw = decodeParam(param).trim();
  const spaced = raw.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return {
    raw,
    spaced,
    display: titleCaseWords(spaced),
  };
}

/**
 * Model parsing (route is already scoped by brand).
 * Still supports "oceanis-51-1" vs "Oceanis 51.1" by generating variants.
 */
function modelFromParam(param: string) {
  const raw = decodeParam(param).trim();
  const spaced = raw.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

  // Create common variants:
  // - "51 1" -> "51.1"
  // - keep original spaced
  // - display title-case
  const dotted = spaced
    .replace(/\b(\d+)\s+(\d+)\b/g, "$1.$2")
    .replace(/\s+/g, " ")
    .trim();

  const candidates = uniqStrings([
    spaced,
    dotted,
    titleCaseWords(spaced),
    titleCaseWords(dotted),
  ]);

  return {
    raw,
    spaced,
    display: titleCaseWords(spaced),
    candidates,
  };
}

function buildSeoIntro(opts: {
  brandDisplay: string;
  modelDisplay: string;
  total: number;
  countriesTop?: string[];
  yearsTop?: number[];
}) {
  const {
    brandDisplay,
    modelDisplay,
    total,
    countriesTop = [],
    yearsTop = [],
  } = opts;
  const c = countriesTop.slice(0, 3).filter(Boolean);
  const y = yearsTop
    .slice(0, 3)
    .filter((n) => typeof n === "number" && !Number.isNaN(n));

  const bits: string[] = [];

  bits.push(
    `Browse ${total.toLocaleString()} ${brandDisplay} ${modelDisplay} boat${
      total === 1 ? "" : "s"
    } for sale on Findaly — updated regularly from trusted sellers and brokers.`
  );

  if (y.length) bits.push(`Popular years include ${y.join(", ")}.`);

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

function countrySlugFromValue(value: string) {
  return slugifyLoose((value || "").replace(/\s+/g, " ").trim());
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand, model } = await params;
  const b = brandFromParam(brand);
  const m = modelFromParam(model);

  const where = {
    status: "LIVE" as const,
    kind: "VESSEL" as const,
    intent: "SALE" as const,
    AND: [
      {
        OR: [
          { brand: { equals: b.spaced, mode: "insensitive" as const } },
          { brand: { equals: b.raw, mode: "insensitive" as const } },
          { brand: { equals: b.display, mode: "insensitive" as const } },
        ],
      },
      {
        model: { not: null },
      },
      {
        OR: m.candidates.map((cand) => ({
          model: { equals: cand, mode: "insensitive" as const },
        })),
      },
    ],
  };

  const total = await prisma.listing.count({ where });

  const title =
    total > 0
      ? `${b.display} ${m.display} Boats for Sale`
      : `${b.display} ${m.display} Boats`;

  const description =
    total > 0
      ? truncate(
          `Browse ${total.toLocaleString()} ${b.display} ${m.display} boats for sale worldwide. Compare specs, prices, and locations — then enquire directly with sellers and brokers on Findaly.`,
          160
        )
      : truncate(
          `Explore ${b.display} ${m.display} boats and listings on Findaly. New inventory is added regularly.`,
          160
        );

  const canonical = `/buy/brand/${slugifyLoose(b.spaced)}/model/${slugifyLoose(
    m.spaced
  )}`;

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

export default async function BrandModelHubPage({ params }: PageProps) {
  const { brand, model } = await params;
  const b = brandFromParam(brand);
  const m = modelFromParam(model);

  const where = {
    status: "LIVE" as const,
    kind: "VESSEL" as const,
    intent: "SALE" as const,
    AND: [
      {
        OR: [
          { brand: { equals: b.spaced, mode: "insensitive" as const } },
          { brand: { equals: b.raw, mode: "insensitive" as const } },
          { brand: { equals: b.display, mode: "insensitive" as const } },
        ],
      },
      { model: { not: null } },
      {
        OR: m.candidates.map((cand) => ({
          model: { equals: cand, mode: "insensitive" as const },
        })),
      },
    ],
  };

  const [total, listings, topCountries, topYears] = await Promise.all([
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
      by: ["country"],
      where: { ...where, country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
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

  const countriesTop = topCountries
    .map((x) => x.country)
    .filter((x): x is string => !!x);

  const yearsTop = topYears
    .map((x) => x.year)
    .filter((x): x is number => typeof x === "number" && !Number.isNaN(x));

  const intro = buildSeoIntro({
    brandDisplay: b.display,
    modelDisplay: m.display,
    total,
    countriesTop,
    yearsTop,
  });

  const base = getSiteUrl();
  const safeBrandSlug = slugifyLoose(b.spaced);
  const safeModelSlug = slugifyLoose(m.spaced);
  const pageUrl = `${base}/buy/brand/${safeBrandSlug}/model/${safeModelSlug}`;

  const isBeneteau = safeBrandSlug === "beneteau";

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Findaly", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Buy", item: `${base}/buy` },
      {
        "@type": "ListItem",
        position: 3,
        name: `Brand: ${b.display}`,
        item: `${base}/buy/brand/${safeBrandSlug}`,
      },
      { "@type": "ListItem", position: 4, name: `Model: ${m.display}`, item: pageUrl },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${b.display} ${m.display} Boats for Sale`,
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
                Buy • Brand • Model
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {b.display} {m.display} boats for sale
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
                      {b.display} {m.display}
                    </span>{" "}
                    right now.
                  </>
                )}
              </div>

              {/* ✅ Authority layer: Beneteau model → guides backlink */}
              {isBeneteau ? (
                <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Buyer guide
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        Research this model properly — pricing, what to check,
                        and common buying mistakes.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                          href="/guides/buying-a-beneteau"
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                        >
                          Buying a Beneteau
                        </Link>
                        <Link
                          href="/guides/beneteau-price-guide"
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                        >
                          Price guide
                        </Link>
                        <Link
                          href="/guides/buying-a-used-beneteau"
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                        >
                          Used checklist
                        </Link>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">→</div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Quick links */}
            {(countriesTop.length > 0 || yearsTop.length > 0) && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                  <div className="text-sm font-semibold text-slate-900">
                    Top countries
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {countriesTop.slice(0, 10).map((c) => {
                      const cSlug = countrySlugFromValue(c);
                      return (
                        <Link
                          key={c}
                          href={`/buy/brand/${safeBrandSlug}/country/${cSlug}`}
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                        >
                          {c}
                        </Link>
                      );
                    })}
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
                        href={`/buy?year=${y}`}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                      >
                        {y}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    (Later: we’ll add clean URL{" "}
                    <span className="font-mono">/buy/year/[year]</span>.)
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/buy/brand/${safeBrandSlug}`}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-95"
              >
                All {b.display} boats
              </Link>
              <Link
                href={`/buy/model/${safeModelSlug}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
              >
                All {m.display} boats
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          {total === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="text-lg font-semibold text-slate-900">
                No {b.display} {m.display} listings live yet.
              </div>
              <p className="mt-2 text-slate-600">
                Try the brand page or model page — or check back soon. Inventory
                updates regularly.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/buy/brand/${safeBrandSlug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-95"
                >
                  Browse {b.display}
                </Link>
                <Link
                  href={`/buy/model/${safeModelSlug}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
                >
                  Browse {m.display}
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
