// app/sitemap.ts
import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site";
import { DESTINATION_PAGES } from "@/app/destinations/[slug]/_data";
import { GUIDES } from "@/app/guides/_data";

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

function isValidYear(y: unknown) {
  if (typeof y !== "number") return false;
  if (!Number.isFinite(y) || Number.isNaN(y)) return false;
  const max = new Date().getFullYear() + 1;
  return y >= 1900 && y <= max;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  // ─────────────────────────────────────────────────────────────
  // 1. Static pages (always submit — these are your core pages)
  // ─────────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/buy`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/sell`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/charter`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/brokers`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/finance`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/destinations`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/brands`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },

    // Service pillars
    { url: `${base}/services/yacht-surveyors`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/services/marine-insurance`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/services/yacht-finance`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/services/marine-lawyers`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },

    // Category pages
    { url: `${base}/buy/sailboats`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/buy/motor-yachts`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/buy/catamarans`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/buy/ribs`, lastModified: now, changeFrequency: "daily", priority: 0.75 },
    { url: `${base}/buy/superyachts`, lastModified: now, changeFrequency: "daily", priority: 0.75 },
    { url: `${base}/buy/new`, lastModified: now, changeFrequency: "daily", priority: 0.75 },

    // Broker pages
    { url: `${base}/brokers/join`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/brokers/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/brokers/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // ─────────────────────────────────────────────────────────────
  // 2. Destinations + Guides (hand-crafted content — always submit)
  // ─────────────────────────────────────────────────────────────
  const destinationRoutes: MetadataRoute.Sitemap = DESTINATION_PAGES.map((d) => ({
    url: `${base}/destinations/${d.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${base}/guides/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.72,
  }));

  // ─────────────────────────────────────────────────────────────
  // 3. Individual listings (quality-gated)
  // ─────────────────────────────────────────────────────────────
  const listings = await prisma.listing.findMany({
    where: {
      status: "LIVE",
      kind: "VESSEL",
    },
    select: {
      slug: true,
      updatedAt: true,
      intent: true,
      featured: true,
      description: true,
      title: true,
      _count: { select: { media: true } },
    },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    take: 50000,
  });

  const listingRoutes: MetadataRoute.Sitemap = listings
    .filter((l) => {
      if (!l.slug) return false;
      if (!l._count?.media || l._count.media < 1) return false;
      const desc = (l.description || "").trim();
      if (desc.length < 40) return false;
      const title = (l.title || "").trim();
      if (title.length < 8) return false;
      return true;
    })
    .map((l) => ({
      url: `${base}/buy/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "daily",
      priority: l.featured ? 0.95 : l.intent === "CHARTER" ? 0.85 : 0.8,
    }));

  // ─────────────────────────────────────────────────────────────
  // 4. Profiles (only ones with content)
  // ─────────────────────────────────────────────────────────────
  const profiles = await prisma.profile.findMany({
    where: {
      listings: { some: { status: "LIVE" } },
    },
    select: { slug: true, updatedAt: true, isVerified: true },
    orderBy: [{ isVerified: "desc" }, { updatedAt: "desc" }],
    take: 5000,
  });

  const profileRoutes: MetadataRoute.Sitemap = profiles
    .filter((p) => !!p.slug)
    .map((p) => ({
      url: `${base}/profile/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: p.isVerified ? 0.6 : 0.45,
    }));

  // ─────────────────────────────────────────────────────────────
  // 5. Programmatic SEO — STRICT thresholds
  //
  // At ~200 listings, most combos will have 1-2 results.
  // Only submit pages with enough listings to be useful.
  //
  // Single dimension: 5+ listings (brands/models/countries)
  // Two dimensions: 8+ listings (brand+country, brand+model)
  // Three+ dimensions: SKIP entirely until 1000+ listings
  // ─────────────────────────────────────────────────────────────

  const MIN_FOR_SINGLE = 5;
  const MIN_FOR_COMBO = 8;

  const [brandAgg, modelAgg, countryAgg] = await Promise.all([
    prisma.listing.groupBy({
      by: ["brand"],
      where: { status: "LIVE", kind: "VESSEL", intent: "SALE", brand: { not: null } },
      _count: { brand: true },
      orderBy: { _count: { brand: "desc" } },
      take: 100,
    }),
    prisma.listing.groupBy({
      by: ["model"],
      where: { status: "LIVE", kind: "VESSEL", intent: "SALE", model: { not: null } },
      _count: { model: true },
      orderBy: { _count: { model: "desc" } },
      take: 100,
    }),
    prisma.listing.groupBy({
      by: ["country"],
      where: { status: "LIVE", kind: "VESSEL", intent: "SALE", country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 50,
    }),
  ]);

  const brandRoutes: MetadataRoute.Sitemap = brandAgg
    .filter((x) => (x._count?.brand ?? 0) >= MIN_FOR_SINGLE)
    .map((x) => ({
      url: `${base}/buy/brand/${slugifyLoose(x.brand!)}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.75,
    }));

  const modelRoutes: MetadataRoute.Sitemap = modelAgg
    .filter((x) => (x._count?.model ?? 0) >= MIN_FOR_SINGLE)
    .map((x) => ({
      url: `${base}/buy/model/${slugifyLoose(x.model!)}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.72,
    }));

  const countryRoutes: MetadataRoute.Sitemap = countryAgg
    .filter((x) => (x._count?.country ?? 0) >= MIN_FOR_SINGLE)
    .map((x) => ({
      url: `${base}/buy/country/${slugifyLoose(x.country!)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  // Only brand+country combos with 8+ listings — skip everything deeper
  const brandCountryAgg = await prisma.listing.groupBy({
    by: ["brand", "country"],
    where: {
      status: "LIVE",
      kind: "VESSEL",
      intent: "SALE",
      brand: { not: null },
      country: { not: null },
    },
    _count: { brand: true },
    orderBy: { _count: { brand: "desc" } },
    take: 200,
  });

  const brandCountryRoutes: MetadataRoute.Sitemap = brandCountryAgg
    .filter((x) => (x._count?.brand ?? 0) >= MIN_FOR_COMBO)
    .map((x) => ({
      url: `${base}/buy/brand/${slugifyLoose(x.brand!)}/country/${slugifyLoose(x.country!)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.68,
    }));

  // NO 3-way or 4-way combos in sitemap until you have 1000+ listings.
  // They create hundreds of thin pages that hurt indexing.

  return [
    ...staticRoutes,
    ...destinationRoutes,
    ...guideRoutes,
    ...listingRoutes,
    ...profileRoutes,
    ...brandRoutes,
    ...modelRoutes,
    ...countryRoutes,
    ...brandCountryRoutes,
  ];
}