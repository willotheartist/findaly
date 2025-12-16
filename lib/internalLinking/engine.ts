import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { getAlternatives } from "@/lib/decision/alternatives";
import { INTERNAL_LINKING, uniqByHref, clamp, titleFromSlug } from "@/lib/internalLinking/rules";

export type LinkItem = {
  href: string;
  label: string;
  kind: "tool" | "category" | "alternatives" | "compare" | "best" | "use-case";
  score?: number;
};

type RankedToolLite = { slug: string; name: string; _score?: number };

/**
 * RULES: Tool page must link to:
 * - its category hub
 * - its alternatives hub
 * - 3–5 alternative tool pages (ranked)
 * - 2–3 comparisons (vs top alts)
 * - 2–4 best pages (category + top use cases)
 */
async function _toolLinks(slug: string) {
  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: { primaryCategory: true, useCases: true },
  });

  if (!tool) {
    return {
      category: [] as LinkItem[],
      alternatives: [] as LinkItem[],
      comparisons: [] as LinkItem[],
      best: [] as LinkItem[],
    };
  }

  const category: LinkItem[] = [
    {
      href: `/tools/category/${tool.primaryCategory.slug}`,
      label: `${tool.primaryCategory.name} tools`,
      kind: "category",
      score: 10,
    },
  ];

  // Reuse your existing alternatives scoring engine
  const pack = await getAlternatives(tool.slug);
  const ranked = pack?.alternatives ?? [];

  const altToolLinks: LinkItem[] = ranked
    .slice(0, INTERNAL_LINKING.tool.altTools)
    .map((t: { slug: string; name: string; _score?: number }) => ({
      href: `/tools/${t.slug}`,
      label: t.name,
      kind: "tool",
      score: t._score ?? undefined,
    }));

  const alternatives: LinkItem[] = [
    {
      href: `/alternatives/${tool.slug}`,
      label: `${tool.name} alternatives`,
      kind: "alternatives",
      score: 9,
    },
    ...altToolLinks,
  ];

  const comparisons: LinkItem[] = ranked
    .slice(0, INTERNAL_LINKING.tool.comparisons)
    .map((t: { slug: string; name: string }) => ({
      href: `/compare/${tool.slug}-vs-${t.slug}`,
      label: `${tool.name} vs ${t.name}`,
      kind: "compare",
      score: 8,
    }));

  // Best pages: /best/[slug] exists in your app structure
  // Convention: `${categorySlug}-tools-for-${useCaseSlug}`
  const best: LinkItem[] = clamp(
    (tool.useCases ?? []).map((u) => ({
      href: `/best/${tool.primaryCategory.slug}-tools-for-${u.slug}`,
      label: `Best ${tool.primaryCategory.name} tools for ${titleFromSlug(u.slug)}`,
      kind: "best" as const,
      score: 6,
    })),
    INTERNAL_LINKING.tool.best
  );

  return {
    category: uniqByHref(category),
    alternatives: uniqByHref(alternatives),
    comparisons: uniqByHref(comparisons),
    best: uniqByHref(best),
  };
}

/**
 * RULES: Alternatives page must link to:
 * - tool page
 * - category hub
 * - top alternative tool pages
 * - comparisons for top alts
 */
async function _alternativesLinks(slug: string) {
  const pack = await getAlternatives(slug);
  if (!pack) {
    return {
      primary: [] as LinkItem[],
      topAlternatives: [] as LinkItem[],
      comparisons: [] as LinkItem[],
    };
  }

  const { tool, alternatives } = pack;

  const primary: LinkItem[] = [
    { href: `/tools/${tool.slug}`, label: tool.name, kind: "tool", score: 10 },
    {
      href: `/tools/category/${tool.primaryCategory.slug}`,
      label: `${tool.primaryCategory.name} tools`,
      kind: "category",
      score: 8,
    },
  ];

  const topAlternatives: LinkItem[] = (alternatives ?? [])
    .slice(0, INTERNAL_LINKING.alternatives.topAlternatives)
    .map((t: RankedToolLite) => ({
      href: `/tools/${t.slug}`,
      label: t.name,
      kind: "tool",
      score: t._score ?? undefined,
    }));

  const comparisons: LinkItem[] = (alternatives ?? [])
    .slice(0, INTERNAL_LINKING.alternatives.comparisons)
    .map((t: RankedToolLite) => ({
      href: `/compare/${tool.slug}-vs-${t.slug}`,
      label: `${tool.name} vs ${t.name}`,
      kind: "compare",
      score: 7,
    }));

  return {
    primary: uniqByHref(primary),
    topAlternatives: uniqByHref(topAlternatives),
    comparisons: uniqByHref(comparisons),
  };
}

// Cached exports (fast + stable)
export const getToolInternalLinks = unstable_cache(
  async (slug: string) => _toolLinks(slug),
  ["tool-internal-links"],
  { revalidate: INTERNAL_LINKING.cacheSeconds }
);

export const getAlternativesInternalLinks = unstable_cache(
  async (slug: string) => _alternativesLinks(slug),
  ["alternatives-internal-links"],
  { revalidate: INTERNAL_LINKING.cacheSeconds }
);

/**
 * RULES: Compare page must link to:
 * - both tool pages
 * - both alternatives pages
 * - category hubs (A + B)
 * - 2–4 best pages derived from shared use-cases
 */
function parsePair(pair: string) {
  const decoded = String(pair ?? "").trim();
  const parts = decoded.split("-vs-").filter(Boolean);
  if (parts.length !== 2) return null;
  return { left: parts[0]!.trim(), right: parts[1]!.trim() };
}

async function _compareLinks(pair: string) {
  const parsed = parsePair(pair);
  if (!parsed) {
    return { primary: [] as LinkItem[], categories: [] as LinkItem[], best: [] as LinkItem[] };
  }

  const [a, b] = await Promise.all([
    prisma.tool.findUnique({
      where: { slug: parsed.left },
      include: { primaryCategory: true, useCases: true },
    }),
    prisma.tool.findUnique({
      where: { slug: parsed.right },
      include: { primaryCategory: true, useCases: true },
    }),
  ]);

  if (!a || !b) {
    return { primary: [] as LinkItem[], categories: [] as LinkItem[], best: [] as LinkItem[] };
  }

  const primary: LinkItem[] = [
    { href: `/tools/${a.slug}`, label: a.name, kind: "tool", score: 10 },
    { href: `/alternatives/${a.slug}`, label: `${a.name} alternatives`, kind: "alternatives", score: 9 },
    { href: `/tools/${b.slug}`, label: b.name, kind: "tool", score: 10 },
    { href: `/alternatives/${b.slug}`, label: `${b.name} alternatives`, kind: "alternatives", score: 9 },
  ];

  const categories: LinkItem[] = uniqByHref([
    {
      href: `/tools/category/${a.primaryCategory.slug}`,
      label: `${a.primaryCategory.name} tools`,
      kind: "category",
      score: 8,
    },
    {
      href: `/tools/category/${b.primaryCategory.slug}`,
      label: `${b.primaryCategory.name} tools`,
      kind: "category",
      score: 8,
    },
  ]);

  const aUse = new Set((a.useCases ?? []).map((u: { slug: string }) => u.slug));
  const bUse = new Set((b.useCases ?? []).map((u: { slug: string }) => u.slug));
  const common = Array.from(aUse)
    .filter((x) => bUse.has(x))
    .slice(0, INTERNAL_LINKING.tool.best);

  const best: LinkItem[] = common.map((ucSlug) => ({
    href: `/best/${a.primaryCategory.slug}-tools-for-${ucSlug}`,
    label: `Best ${a.primaryCategory.name} tools for ${titleFromSlug(ucSlug)}`,
    kind: "best",
    score: 6,
  }));

  return {
    primary: uniqByHref(primary),
    categories,
    best: uniqByHref(best),
  };
}

export const getCompareInternalLinks = unstable_cache(
  async (pair: string) => _compareLinks(pair),
  ["compare-internal-links"],
  { revalidate: INTERNAL_LINKING.cacheSeconds }
);

/**
 * RULES: Category hub should link to:
 * - Top /best pages for the category (from use-case frequency)
 * - Top /use-cases pages (same source)
 * - A handful of comparisons between top tools
 * - A few alternatives pages for top tools
 */
async function _categoryLinks(categorySlug: string) {
  const slug = String(categorySlug ?? "").trim();
  if (!slug) {
    return {
      best: [] as LinkItem[],
      useCases: [] as LinkItem[],
      comparisons: [] as LinkItem[],
      alternatives: [] as LinkItem[],
    };
  }

  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) {
    return {
      best: [] as LinkItem[],
      useCases: [] as LinkItem[],
      comparisons: [] as LinkItem[],
      alternatives: [] as LinkItem[],
    };
  }

  const tools = await prisma.tool.findMany({
    where: { status: "ACTIVE", primaryCategoryId: cat.id },
    include: { useCases: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    take: INTERNAL_LINKING.category.tools,
  });

  // Use-case frequency
  const counts = new Map<string, { name: string; slug: string; count: number }>();
  for (const t of tools) {
    for (const u of t.useCases ?? []) {
      const cur = counts.get(u.slug);
      if (!cur) counts.set(u.slug, { name: u.name, slug: u.slug, count: 1 });
      else cur.count += 1;
    }
  }

  const topUC = Array.from(counts.values())
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, INTERNAL_LINKING.category.useCases);

  const best: LinkItem[] = topUC.slice(0, INTERNAL_LINKING.category.best).map((u) => ({
    href: `/best/${cat.slug}-tools-for-${u.slug}`,
    label: `${cat.name} tools for ${u.name}`,
    kind: "best",
    score: 10,
  }));

  const useCases: LinkItem[] = topUC.slice(0, INTERNAL_LINKING.category.useCases).map((u) => ({
    href: `/use-cases/${u.slug}`,
    label: u.name,
    kind: "use-case",
    score: 8,
  }));

  // Comparisons between first N tools
  const top = tools.slice(0, INTERNAL_LINKING.category.topToolsForPairs).map((t) => ({ slug: t.slug, name: t.name }));
  const idxPairs: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];

  const comparisons: LinkItem[] = [];
  for (const [i, j] of idxPairs) {
    const a = top[i],
      b = top[j];
    if (!a || !b) continue;
    comparisons.push({
      href: `/compare/${a.slug}-vs-${b.slug}`,
      label: `${a.name} vs ${b.name}`,
      kind: "compare",
      score: 6,
    });
    if (comparisons.length >= INTERNAL_LINKING.category.comparisons) break;
  }

  // Alternatives pages for top tools
  const alternatives: LinkItem[] = tools.slice(0, INTERNAL_LINKING.category.alternatives).map((t) => ({
    href: `/alternatives/${t.slug}`,
    label: `${t.name} alternatives`,
    kind: "alternatives",
    score: 7,
  }));

  return {
    best: uniqByHref(best),
    useCases: uniqByHref(useCases),
    comparisons: uniqByHref(comparisons),
    alternatives: uniqByHref(alternatives),
  };
}

export const getCategoryInternalLinks = unstable_cache(
  async (categorySlug: string) => _categoryLinks(categorySlug),
  ["category-internal-links"],
  { revalidate: INTERNAL_LINKING.cacheSeconds }
);

/**
 * RULES: Best page should link to:
 * - Category hub
 * - Use case page
 * - Top tools on the list (tool pages)
 * - 3–6 comparisons between adjacent top tools
 * - Alternatives pages for top tools
 */
function parseBestSlug(bestSlug: string) {
  const s = String(bestSlug ?? "").trim();
  const marker = "-tools-for-";
  const idx = s.indexOf(marker);
  if (idx === -1) return null;
  const categorySlug = s.slice(0, idx).trim();
  const useCaseSlug = s.slice(idx + marker.length).trim();
  if (!categorySlug || !useCaseSlug) return null;
  return { categorySlug, useCaseSlug };
}

async function _bestLinks(bestSlug: string) {
  const parsed = parseBestSlug(bestSlug);
  if (!parsed) {
    return {
      primary: [] as LinkItem[],
      tools: [] as LinkItem[],
      comparisons: [] as LinkItem[],
      alternatives: [] as LinkItem[],
    };
  }

  const { categorySlug, useCaseSlug } = parsed;

  const [cat, uc] = await Promise.all([
    prisma.category.findUnique({ where: { slug: categorySlug } }),
    prisma.useCase.findUnique({ where: { slug: useCaseSlug } }),
  ]);

  if (!cat || !uc) {
    return {
      primary: [] as LinkItem[],
      tools: [] as LinkItem[],
      comparisons: [] as LinkItem[],
      alternatives: [] as LinkItem[],
    };
  }

  // Top tools for this best page
  const tools = await prisma.tool.findMany({
    where: {
      status: "ACTIVE",
      primaryCategoryId: cat.id,
      useCases: { some: { id: uc.id } },
    },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    take: 12,
  });

  const primary: LinkItem[] = [
    { href: `/tools/category/${cat.slug}`, label: `Browse ${cat.name}`, kind: "category", score: 10 },
    { href: `/use-cases/${uc.slug}`, label: uc.name, kind: "use-case", score: 9 },
    { href: `/best/${cat.slug}-tools-for-${uc.slug}`, label: `Best ${cat.name} tools for ${uc.name}`, kind: "best", score: 8 },
  ];

  const toolLinks: LinkItem[] = tools.slice(0, INTERNAL_LINKING.best.tools).map((t) => ({
    href: `/tools/${t.slug}`,
    label: t.name,
    kind: "tool",
    score: 7,
  }));

  // Adjacent comparisons (top N)
  const top = tools.slice(0, INTERNAL_LINKING.best.comparisons);
  const comparisons: LinkItem[] = [];
  for (let i = 0; i < top.length - 1; i++) {
    const a = top[i],
      b = top[i + 1];
    if (!a || !b) continue;
    comparisons.push({
      href: `/compare/${a.slug}-vs-${b.slug}`,
      label: `${a.name} vs ${b.name}`,
      kind: "compare",
      score: 6,
    });
    if (comparisons.length >= INTERNAL_LINKING.best.comparisons) break;
  }

  const alternatives: LinkItem[] = tools.slice(0, INTERNAL_LINKING.best.alternatives).map((t) => ({
    href: `/alternatives/${t.slug}`,
    label: `${t.name} alternatives`,
    kind: "alternatives",
    score: 6,
  }));

  return {
    primary: uniqByHref(primary),
    tools: uniqByHref(toolLinks),
    comparisons: uniqByHref(comparisons),
    alternatives: uniqByHref(alternatives),
  };
}

export const getBestInternalLinks = unstable_cache(
  async (bestSlug: string) => _bestLinks(bestSlug),
  ["best-internal-links"],
  { revalidate: INTERNAL_LINKING.cacheSeconds }
);
