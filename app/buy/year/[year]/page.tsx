// app/buy/brand/[brand]/year/[year]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { absoluteUrl, getSiteUrl, truncate } from "@/lib/site";

type PageProps = {
  params: Promise<{ brand: string; year: string }>;
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

function brandFromParam(param: string) {
  const raw = decodeParam(param).trim();
  const spaced = raw.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return {
    raw,
    spaced,
    display: titleCaseWords(spaced),
  };
}

function parseYearParam(param: string) {
  const raw = decodeParam(param).trim();
  const y = Number.parseInt(raw, 10);
  const max = new Date().getFullYear() + 1;
  if (!Number.isFinite(y) || Number.isNaN(y) || y < 1900 || y > max) return null;
  return y;
}

function buildSeoIntro(opts: {
  brandDisplay: string;
  year: number;
  total: number;
  modelsTop?: string[];
  countriesTop?: string[];
}) {
  const { brandDisplay, year, total, modelsTop = [], countriesTop = [] } = opts;
  const m = modelsTop.slice(0, 4).filter(Boolean);
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand, year } = await params;
  const b = brandFromParam(brand);
  const y = parseYearParam(year);
  if (!y) return { title: `${b.display} Boats by Year` };

  const where = {
    status: "LIVE" as const,
    kind: "VESSEL" as const,
    intent: "SALE" as const,
    year: y,
    OR: [
      { brand: { equals: b.spaced, mode: "insensitive" as const } },
      { brand: { equals: b.raw, mode: "insensitive" as const } },
    ],
  };

  const total = await prisma.listing.count({ where });

  const title = total > 0 ? `${b.display} ${y} Boats for Sale` : `${b.display} ${y} Boats`;
  const description =
    total > 0
      ? truncate(
          `Browse ${total.toLocaleString()} ${b.display} boats from ${y} for sale worldwide. Compare specs, prices, and locations — then enquire directly with sellers and brokers on Findaly.`,
          160
        )
      : truncate(`Explore ${b.display} boats from ${y} on Findaly. New inventory is added regularly.`, 160);

  const canonical = `/buy/brand/${slugifyLoose(b.spaced)}/year/${y}`;

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

export default async function BrandYearHubPage({ params }: PageProps) {
  const { brand, year } = await params;
  const b = brandFromParam(brand);
  const y = parseYearParam(year);
  if (!y) notFound();

  const where = {
    status: "LIVE" as const,
    kind: "VESSEL" as const,
    intent: "SALE" as const,
    year: y,
    OR: [
      { brand: { equals: b.spaced, mode: "insensitive" as const } },
      { brand: { equals: b.raw, mode: "insensitive" as const } },
    ],
  };

  const [total, listings, topModels, topCountries] = await Promise.all([
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
  ]);

  const modelsTop = topModels.map((x) => x.model).filter((x): x is string => !!x);
  const countriesTop = topCountries.map((x) => x.country).filter((x): x is string => !!x);

  const intro = buildSeoIntro({
    brandDisplay: b.display,
    year: y,
    total,
    modelsTop,
    countriesTop,
  });

  const base = getSiteUrl();
  const safeBrandSlug = slugifyLoose(b.spaced);
  const pageUrl = `${base}/buy/brand/${safeBrandSlug}/year/${y}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Findaly", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Buy", item: `${base}/buy` },
      { "@type": "ListItem", position: 3, name: `Brand: ${b.display}`, item: `${base}/buy/brand/${safeBrandSlug}` },
      { "@type": "ListItem", position: 4, name: `Year: ${y}`, item: pageUrl },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${b.display} ${y} Boats for Sale`,
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
          <div className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">Buy • Brand • Year</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {b.display} boats from {y}
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
                No live listings found for <span className="font-semibold text-slate-700">{b.display}</span> in {y}.
              </>
            )}
          </div>

          {(modelsTop.length > 0 || countriesTop.length > 0) && (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Popular models</div>
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
                <div className="text-sm font-semibold text-slate-900">Top countries</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {countriesTop.slice(0, 10).map((c) => (
                    <Link
                      key={c}
                      href={`/buy/brand/${safeBrandSlug}/country/${slugifyLoose(c)}`}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 no-underline hover:border-slate-300 hover:text-slate-900"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/buy/brand/${safeBrandSlug}`}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-95"
            >
              All {b.display} boats
            </Link>
            <Link
              href={`/buy/year/${y}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
            >
              All boats from {y}
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          {total === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="text-lg font-semibold text-slate-900">
                No {b.display} listings live for {y} yet.
              </div>
              <p className="mt-2 text-slate-600">Try the brand page, or check back soon — inventory updates regularly.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/buy/brand/${safeBrandSlug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline hover:opacity-95"
                >
                  Browse {b.display}
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
