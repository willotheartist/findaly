import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

function siteUrl() {
  const u = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
  return u.replace(/\/$/, "");
}

function buildComparePairs(slugs: string[]) {
  const top = slugs.slice(0, 6);
  const pairs: Array<[string, string]> = [];
  const idxPairs: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];
  for (const [i, j] of idxPairs) {
    if (!top[i] || !top[j]) continue;
    pairs.push([top[i], top[j]]);
  }
  return pairs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const tools = await prisma.tool.findMany({
    where: { status: "ACTIVE" },
    select: {
      slug: true,
      isFeatured: true,
      name: true,
      primaryCategory: { select: { slug: true } },
      useCases: { select: { slug: true } },
    },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });

  const useCasesAll = await prisma.useCase.findMany({
    select: { slug: true },
    orderBy: { slug: "asc" },
  });

  const categoryToToolSlugs = new Map<string, string[]>();
  const categoryToUseCases = new Map<string, Set<string>>();

  for (const t of tools) {
    const catSlug = t.primaryCategory?.slug ?? "tools";

    const arr = categoryToToolSlugs.get(catSlug) ?? [];
    arr.push(t.slug);
    categoryToToolSlugs.set(catSlug, arr);

    const set = categoryToUseCases.get(catSlug) ?? new Set<string>();
    for (const uc of t.useCases ?? []) set.add(uc.slug);
    categoryToUseCases.set(catSlug, set);
  }

  const MAX_COMPARE_URLS = 4000;
  let compareCount = 0;

  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: "daily", priority: 0.9 },

    // important index pages
    { url: `${base}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/alternatives`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },

    { url: `${base}/use-cases`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/best`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  for (const uc of useCasesAll) {
    urls.push({
      url: `${base}/use-cases/${uc.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const t of tools) {
    urls.push({
      url: `${base}/tools/${t.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    urls.push({
      url: `${base}/alternatives/${t.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const [catSlug, slugs] of categoryToToolSlugs.entries()) {
    urls.push({
      url: `${base}/tools/category/${catSlug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });

    const pairs = buildComparePairs(slugs).slice(0, 12);
    for (const [a, b] of pairs) {
      if (compareCount >= MAX_COMPARE_URLS) break;
      urls.push({
        url: `${base}/compare/${a}-vs-${b}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
      compareCount++;
    }

    const useCases = Array.from(categoryToUseCases.get(catSlug) ?? []);
    for (const ucSlug of useCases.slice(0, 60)) {
      urls.push({
        url: `${base}/best/${catSlug}-tools-for-${ucSlug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.65,
      });
    }
  }

  // ✅ Deduplicate urls (Google prefers no duplicates)
  const seen = new Set<string>();
  const deduped: MetadataRoute.Sitemap = [];
  for (const entry of urls) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    deduped.push(entry);
  }

  return deduped;
}
