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

    // ✅ service pillars (pages exist)
    { url: `${base}/services/yacht-surveyors`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/services/marine-insurance`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/services/yacht-finance`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/services/marine-lawyers`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },

    { url: `${base}/add-listing`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const destinationRoutes: MetadataRoute.Sitemap = DESTINATION_PAGES.map((d) => ({
    url: `${base}/destinations/${d.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  // ✅ Use your real GUIDES list (single source of truth)
  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${base}/guides/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.72,
  }));

  // ─────────────────────────────────────────────────────────────
  // Listings (quality-gated, early-stage relaxed)
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

      // relaxed early-stage
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
  // Profiles
  // ─────────────────────────────────────────────────────────────
  const profiles = await prisma.profile.findMany({
    select: { slug: true, updatedAt: true, isVerified: true },
    orderBy: [{ isVerified: "desc" }, { updatedAt: "desc" }],
    take: 50000,
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
  // Programmatic SEO routes
  // ─────────────────────────────────────────────────────────────
  const MAX_BRANDS = 20000;
  const MAX_MODELS = 20000;
  const MAX_COUNTRIES = 5000;

  const MAX_BRAND_COUNTRY_COMBOS = 50000;
  const MAX_BRAND_MODEL_COMBOS = 100000;
  const MAX_MODEL_YEAR_COMBOS = 100000;
  const MAX_BRAND_YEAR_COMBOS = 100000;

  const MAX_BRAND_MODEL_COUNTRY_COMBOS = 150000;
  const MAX_BRAND_MODEL_YEAR_COMBOS = 150000;
  const MAX_BRAND_COUNTRY_YEAR_COMBOS = 150000;

  const MAX_BRAND_MODEL_COUNTRY_YEAR_COMBOS = 250000;

  // impressions-first, avoid doorway spam
  const MIN_COUNT_TO_INDEX = 1;
  const MIN_COUNT_FOR_COMBOS = 3;
  const MIN_COUNT_FOR_DEEP_COMBOS = 8;

  const [
    brandAgg,
    modelAgg,
    countryAgg,
    brandCountryAgg,
    brandModelAgg,
    modelYearAgg,
    brandYearAgg,
    brandModelCountryAgg,
    brandModelYearAgg,
    brandCountryYearAgg,
    brandModelCountryYearAgg,
  ] = await Promise.all([
    prisma.listing.groupBy({
      by: ["brand"],
      where: { status: "LIVE", kind: "VESSEL", intent: "SALE", brand: { not: null } },
      _count: { brand: true },
      orderBy: { _count: { brand: "desc" } },
      take: MAX_BRANDS,
    }),
    prisma.listing.groupBy({
      by: ["model"],
      where: { status: "LIVE", kind: "VESSEL", intent: "SALE", model: { not: null } },
      _count: { model: true },
      orderBy: { _count: { model: "desc" } },
      take: MAX_MODELS,
    }),
    prisma.listing.groupBy({
      by: ["country"],
      where: { status: "LIVE", kind: "VESSEL", intent: "SALE", country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: MAX_COUNTRIES,
    }),
    prisma.listing.groupBy({
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
      take: MAX_BRAND_COUNTRY_COMBOS,
    }),
    prisma.listing.groupBy({
      by: ["brand", "model"],
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        brand: { not: null },
        model: { not: null },
      },
      _count: { brand: true },
      orderBy: { _count: { brand: "desc" } },
      take: MAX_BRAND_MODEL_COMBOS,
    }),
    prisma.listing.groupBy({
      by: ["model", "year"],
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        model: { not: null },
        year: { not: null },
      },
      _count: { model: true },
      orderBy: { _count: { model: "desc" } },
      take: MAX_MODEL_YEAR_COMBOS,
    }),
    prisma.listing.groupBy({
      by: ["brand", "year"],
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        brand: { not: null },
        year: { not: null },
      },
      _count: { brand: true },
      orderBy: { _count: { brand: "desc" } },
      take: MAX_BRAND_YEAR_COMBOS,
    }),
    prisma.listing.groupBy({
      by: ["brand", "model", "country"],
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        brand: { not: null },
        model: { not: null },
        country: { not: null },
      },
      _count: { brand: true },
      orderBy: { _count: { brand: "desc" } },
      take: MAX_BRAND_MODEL_COUNTRY_COMBOS,
    }),
    prisma.listing.groupBy({
      by: ["brand", "model", "year"],
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        brand: { not: null },
        model: { not: null },
        year: { not: null },
      },
      _count: { brand: true },
      orderBy: { _count: { brand: "desc" } },
      take: MAX_BRAND_MODEL_YEAR_COMBOS,
    }),
    prisma.listing.groupBy({
      by: ["brand", "country", "year"],
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        brand: { not: null },
        country: { not: null },
        year: { not: null },
      },
      _count: { brand: true },
      orderBy: { _count: { brand: "desc" } },
      take: MAX_BRAND_COUNTRY_YEAR_COMBOS,
    }),
    prisma.listing.groupBy({
      by: ["brand", "model", "country", "year"],
      where: {
        status: "LIVE",
        kind: "VESSEL",
        intent: "SALE",
        brand: { not: null },
        model: { not: null },
        country: { not: null },
        year: { not: null },
      },
      _count: { brand: true },
      orderBy: { _count: { brand: "desc" } },
      take: MAX_BRAND_MODEL_COUNTRY_YEAR_COMBOS,
    }),
  ]);

  const brandRoutes: MetadataRoute.Sitemap = brandAgg
    .filter((x) => (x._count?.brand ?? 0) >= MIN_COUNT_TO_INDEX)
    .map((x) => {
      const slug = slugifyLoose((x.brand || "").trim());
      return { url: `${base}/buy/brand/${slug}`, lastModified: now, changeFrequency: "daily", priority: 0.75 };
    });

  const modelRoutes: MetadataRoute.Sitemap = modelAgg
    .filter((x) => (x._count?.model ?? 0) >= MIN_COUNT_TO_INDEX)
    .map((x) => {
      const slug = slugifyLoose((x.model || "").trim());
      return { url: `${base}/buy/model/${slug}`, lastModified: now, changeFrequency: "daily", priority: 0.72 };
    });

  const countryRoutes: MetadataRoute.Sitemap = countryAgg
    .filter((x) => (x._count?.country ?? 0) >= MIN_COUNT_TO_INDEX)
    .map((x) => {
      const slug = slugifyLoose((x.country || "").trim());
      return { url: `${base}/buy/country/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 };
    });

  const brandCountryRoutes: MetadataRoute.Sitemap = brandCountryAgg
    .filter((x) => (x._count?.brand ?? 0) >= MIN_COUNT_FOR_COMBOS)
    .map((x) => {
      const b = slugifyLoose((x.brand || "").trim());
      const c = slugifyLoose((x.country || "").trim());
      return { url: `${base}/buy/brand/${b}/country/${c}`, lastModified: now, changeFrequency: "weekly", priority: 0.74 };
    });

  const brandModelRoutes: MetadataRoute.Sitemap = brandModelAgg
    .filter((x) => (x._count?.brand ?? 0) >= MIN_COUNT_FOR_COMBOS)
    .map((x) => {
      const b = slugifyLoose((x.brand || "").trim());
      const m = slugifyLoose((x.model || "").trim());
      return { url: `${base}/buy/brand/${b}/model/${m}`, lastModified: now, changeFrequency: "daily", priority: 0.78 };
    });

  const modelYearRoutes: MetadataRoute.Sitemap = modelYearAgg
    .filter((x) => (x._count?.model ?? 0) >= MIN_COUNT_FOR_COMBOS)
    .filter((x) => isValidYear(x.year))
    .map((x) => {
      const m = slugifyLoose((x.model || "").trim());
      const year = x.year as number;
      return { url: `${base}/buy/model/${m}/year/${year}`, lastModified: now, changeFrequency: "weekly", priority: 0.68 };
    });

  const brandYearRoutes: MetadataRoute.Sitemap = brandYearAgg
    .filter((x) => (x._count?.brand ?? 0) >= MIN_COUNT_FOR_COMBOS)
    .filter((x) => isValidYear(x.year))
    .map((x) => {
      const b = slugifyLoose((x.brand || "").trim());
      const year = x.year as number;
      return { url: `${base}/buy/brand/${b}/year/${year}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 };
    });

  const brandModelCountryRoutes: MetadataRoute.Sitemap = brandModelCountryAgg
    .filter((x) => (x._count?.brand ?? 0) >= MIN_COUNT_FOR_DEEP_COMBOS)
    .map((x) => {
      const b = slugifyLoose((x.brand || "").trim());
      const m = slugifyLoose((x.model || "").trim());
      const c = slugifyLoose((x.country || "").trim());
      return { url: `${base}/buy/brand/${b}/model/${m}/country/${c}`, lastModified: now, changeFrequency: "weekly", priority: 0.66 };
    });

  const brandModelYearRoutes: MetadataRoute.Sitemap = brandModelYearAgg
    .filter((x) => (x._count?.brand ?? 0) >= MIN_COUNT_FOR_DEEP_COMBOS)
    .filter((x) => isValidYear(x.year))
    .map((x) => {
      const b = slugifyLoose((x.brand || "").trim());
      const m = slugifyLoose((x.model || "").trim());
      const year = x.year as number;
      return { url: `${base}/buy/brand/${b}/model/${m}/year/${year}`, lastModified: now, changeFrequency: "weekly", priority: 0.67 };
    });

  const brandCountryYearRoutes: MetadataRoute.Sitemap = brandCountryYearAgg
    .filter((x) => (x._count?.brand ?? 0) >= MIN_COUNT_FOR_DEEP_COMBOS)
    .filter((x) => isValidYear(x.year))
    .map((x) => {
      const b = slugifyLoose((x.brand || "").trim());
      const c = slugifyLoose((x.country || "").trim());
      const year = x.year as number;
      return { url: `${base}/buy/brand/${b}/country/${c}/year/${year}`, lastModified: now, changeFrequency: "weekly", priority: 0.66 };
    });

  const brandModelCountryYearRoutes: MetadataRoute.Sitemap = brandModelCountryYearAgg
    .filter((x) => (x._count?.brand ?? 0) >= MIN_COUNT_FOR_DEEP_COMBOS)
    .filter((x) => isValidYear(x.year))
    .map((x) => {
      const b = slugifyLoose((x.brand || "").trim());
      const m = slugifyLoose((x.model || "").trim());
      const c = slugifyLoose((x.country || "").trim());
      const year = x.year as number;
      return { url: `${base}/buy/brand/${b}/model/${m}/country/${c}/year/${year}`, lastModified: now, changeFrequency: "weekly", priority: 0.64 };
    });

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
    ...brandModelRoutes,
    ...modelYearRoutes,
    ...brandYearRoutes,
    ...brandModelCountryRoutes,
    ...brandModelYearRoutes,
    ...brandCountryYearRoutes,
    ...brandModelCountryYearRoutes,
  ];
}