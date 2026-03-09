// app/buy/model/[model]/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { absoluteUrl, getSiteUrl, truncate } from "@/lib/site";

import { getMarketStats } from "@/lib/seo/marketStats";
import MarketOverview from "@/components/seo/MarketOverview";
import RelatedSearches from "@/components/seo/RelatedSearches";

import AnswerTarget from "@/components/seo/AnswerTarget";
import FaqJsonLd from "@/components/seo/FaqJsonLd";

import { modelFromParam, modelSlugFromValue, titleCaseWords } from "@/lib/seoParam";

type PageProps = {
  params: Promise<{ model: string }>;
};

type JsonLdObject = Record<string, unknown>;
type MarketStats = Awaited<ReturnType<typeof getMarketStats>>;

function buildSeoIntro(opts: {
  modelDisplay: string;
  total: number;
  brandsTop?: string[];
  countriesTop?: string[];
  yearsTop?: number[];
}) {
  const { modelDisplay, total, brandsTop = [], countriesTop = [], yearsTop = [] } = opts;

  const b = brandsTop.slice(0, 3).filter(Boolean);
  const c = countriesTop.slice(0, 3).filter(Boolean);
  const y = yearsTop.slice(0, 3).filter((n) => typeof n === "number" && !Number.isNaN(n));

  const bits: string[] = [];

  bits.push(
    `Browse ${total.toLocaleString()} ${modelDisplay} boat${total === 1 ? "" : "s"} for sale on Findaly — updated regularly from trusted sellers and brokers.`
  );

  if (b.length) bits.push(`Top brands include ${b.join(", ")}.`);
  if (y.length) bits.push(`Popular years include ${y.join(", ")}.`);

  if (c.length) {
    bits.push(`Explore listings in ${c.join(", ")} and beyond — with photos, specs, and direct enquiries.`);
  } else {
    bits.push(`Compare specs, pricing, and location — then enquire directly with sellers and brokers.`);
  }

  return bits.join(" ");
}

function jsonLd(obj: JsonLdObject) {
  return (
    <script
      type="application/ld+json"
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

function fmtMoneyFromCentsEUR(cents: number | null | undefined) {
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

function fmtAvgLength(stats: MarketStats | null | undefined) {
  const m = stats?.avgLengthM;
  const ft = stats?.avgLengthFt;

  if (typeof m === "number" && m > 0) return `${Math.round(m)}m`;
  if (typeof ft === "number" && ft > 0) return `${Math.round(ft)}ft`;
  return "—";
}

/**
 * Robust matching:
 * - keep strict equals candidates (good when DB is clean)
 * - add a contains fallback for the canonical string (good when DB stores extra suffixes)
 */
function buildWhere(m: ReturnType<typeof modelFromParam>): Prisma.ListingWhereInput {
  const canonical = m.canonicalSpaced;
  const canonicalTC = titleCaseWords(canonical);
  const modelOnly = (m.modelCandidateRaw || "").trim();

  const equalsModelClauses = m.candidates.map((cand) => ({
    model: { equals: cand, mode: "insensitive" as const },
  }));

  const modelOnlyClauses =
    modelOnly.length > 0
      ? [
          { model: { equals: modelOnly, mode: "insensitive" as const } },
          { model: { equals: modelOnly.toUpperCase(), mode: "insensitive" as const } },
          { model: { equals: modelOnly.toLowerCase(), mode: "insensitive" as const } },
        ]
      : [];

  const containsFallbackClauses =
    canonicalTC && canonicalTC.length >= 4
      ? [
          { title: { contains: canonicalTC, mode: "insensitive" as const } },
          { brand: { contains: canonicalTC, mode: "insensitive" as const } },
        ]
      : [];

  return {
    status: "LIVE",
    kind: "VESSEL",
    intent: "SALE",
    OR: [...equalsModelClauses, ...modelOnlyClauses, ...containsFallbackClauses],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { model } = await params;
  const m = modelFromParam(model);

  const modelDisplay = titleCaseWords(m.canonicalSpaced);
  const where = buildWhere(m);
  const total = await prisma.listing.count({ where });

  const title = total > 0 ? `${modelDisplay} Boats for Sale` : `${modelDisplay} Boats`;
  const description =
    total > 0
      ? truncate(
          `Browse ${total.toLocaleString()} ${modelDisplay} boats for sale worldwide. Compare specs, prices, and locations — then enquire directly with sellers and brokers on Findaly.`,
          160
        )
      : truncate(`Explore ${modelDisplay} boats and listings on Findaly. New inventory is added regularly.`, 160);

  const requestedSlug = modelSlugFromValue(m.canonicalSpaced);
  const canonical = `/buy/model/${requestedSlug}`;

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

export default async function ModelHubPage({ params }: PageProps) {
  const { model } = await params;
  const m = modelFromParam(model);

  const modelDisplay = titleCaseWords(m.canonicalSpaced);
  const where = buildWhere(m);

  const [total, listings, topBrands, topCountries, topYears, stats] = await Promise.all([
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
    prisma.listing.groupBy({
      by: ["year"],
      where: { ...where, year: { not: null } },
      _count: { year: true },
      orderBy: { _count: { year: "desc" } },
      take: 12,
    }),
    getMarketStats(where),
  ]);

  const brandsTop = topBrands.map((x) => x.brand).filter((x): x is string => !!x);
  const countriesTop = topCountries.map((x) => x.country).filter((x): x is string => !!x);

  const yearsTop = topYears
    .map((x) => x.year)
    .filter((x): x is number => typeof x === "number" && !Number.isNaN(x))
    .sort((a, b2) => b2 - a);

  const intro = buildSeoIntro({
    modelDisplay,
    total,
    brandsTop,
    countriesTop,
    yearsTop,
  });

  const base = getSiteUrl();
  const safeModelSlug = modelSlugFromValue(m.canonicalSpaced);
  const pageUrl = `${base}/buy/model/${safeModelSlug}`;

  const breadcrumb: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Findaly", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Buy", item: `${base}/buy` },
      { "@type": "ListItem", position: 3, name: `Model: ${modelDisplay}`, item: pageUrl },
    ],
  };

  const itemList: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${modelDisplay} Boats for Sale`,
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

  const faqs = [
    {
      q: `How do I compare ${modelDisplay} listings properly?`,
      a: "Use like-for-like comparisons: year, condition, inventory (electronics/sails/systems), and documented service history. Photos help, but invoices and survey outcomes usually explain the real value difference.",
    },
    {
      q: `Why do prices vary so much for the same model?`,
      a: "Because listings differ in maintenance discipline and what expensive components are due soon. Condition, history, and inventory age typically matter more than brochure specs.",
    },
    {
      q: `What should I check before making an offer?`,
      a: "Prioritise paperwork, service records, and a survey/sea trial plan. Ask for recent invoices, confirm ownership/VAT status where relevant, and treat missing documentation as real risk.",
    },
    {
      q: `How do I enquire on Findaly?`,
      a: "Open a listing and send a direct enquiry to the seller or broker. Include your timeline, preferred location, and any must-have requirements so the conversation is efficient from the first message.",
    },
  ];

  const factPriceRange =
    stats?.minPriceCents && stats?.maxPriceCents
      ? `${fmtMoneyFromCentsEUR(stats.minPriceCents)} – ${fmtMoneyFromCentsEUR(stats.maxPriceCents)}`
      : "—";

  return (
    <main className="w-full bg-white">
      {jsonLd(breadcrumb)}
      {jsonLd(itemList)}
      <FaqJsonLd faqs={faqs} />

      <section className="w-full border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
            Buy • Model
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {modelDisplay} boats for sale
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
            {intro}
          </p>

          <div className="mt-6">
            <AnswerTarget
              eyebrow="AI-ready summary"
              title={`Browse ${modelDisplay} listings with context, not guesswork.`}
              summary="Use this hub to shortlist by brand, location, and year — then validate value with condition, inventory age, and documented history. Pricing differences usually come from maintenance discipline and expensive components that are due."
              bullets={[
                "Compare year + condition first, then inventory (electronics/sails/systems) and service history.",
                "Use market overview for reality checks; treat surveys and invoices as the source of truth.",
                "Enquire directly with sellers and brokers — include your timeline and must-haves.",
              ]}
              facts={[
                { label: "Live listings", value: total.toLocaleString() },
                { label: "Avg price", value: fmtMoneyFromCentsEUR(stats?.avgPriceCents) },
                { label: "Price range", value: factPriceRange },
                { label: "Avg length", value: fmtAvgLength(stats) },
              ]}
              ctas={[{ label: "Browse all Buy listings →", href: "/buy" }]}
            />
          </div>

          <div className="mt-4 text-sm text-slate-500">
            {total > 0 ? (
              <>
                Showing <span className="font-semibold text-slate-700">{Math.min(36, total)}</span> of{" "}
                <span className="font-semibold text-slate-700">{total.toLocaleString()}</span> listings.
              </>
            ) : (
              <>
                No live listings found for <span className="font-semibold text-slate-700">{modelDisplay}</span>.
              </>
            )}
          </div>

          {stats ? (
            <div className="mt-8">
              <MarketOverview stats={stats} />
            </div>
          ) : null}
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
                    {(l.location || l.country || "—")}{l.year ? ` • ${l.year}` : ""}
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
              kind="model"
              modelDisplay={modelDisplay}
              modelSlug={safeModelSlug}
              brands={brandsTop}
              countries={countriesTop}
              years={yearsTop}
              maxPills={10}
            />
          </div>

          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <div className="text-sm font-semibold text-slate-900">Quick answers</div>
            <div className="mt-4 space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="rounded-xl border border-slate-200 p-4">
                  <summary className="cursor-pointer text-[15px] font-medium text-slate-900">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-slate-600">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}