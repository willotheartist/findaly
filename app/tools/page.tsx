// app/tools/page.tsx
import { prisma } from "@/lib/db";
import ToolsPageClient from "@/components/ToolsPageClient";

type ToolLite = {
  id: string;
  name: string;
  slug: string;
  primaryCategory: string;
  primaryCategorySlug: string;
  pricingModel: string;
  shortDescription: string;
  startingPrice: string | null;
  keyFeatures: string[];
  isFeatured: boolean;
};

function buildPopularComparisons(tools: ToolLite[]) {
  const byCategory = new Map<string, ToolLite[]>();
  for (const t of tools) {
    const key = t.primaryCategory || "Tools";
    const arr = byCategory.get(key) ?? [];
    arr.push(t);
    byCategory.set(key, arr);
  }

  for (const [k, arr] of byCategory.entries()) {
    arr.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    byCategory.set(k, arr);
  }

  const categories = Array.from(byCategory.entries()).sort((a, b) => {
    if (b[1].length !== a[1].length) return b[1].length - a[1].length;
    return a[0].localeCompare(b[0]);
  });

  const comparisons: Array<{ href: string; label: string; category: string }> = [];

  for (const [category, arr] of categories) {
    const top = arr.slice(0, 4);
    const pairs: Array<[ToolLite, ToolLite]> = [];
    if (top[0] && top[1]) pairs.push([top[0], top[1]]);
    if (top[0] && top[2]) pairs.push([top[0], top[2]]);
    if (top[1] && top[2]) pairs.push([top[1], top[2]]);

    for (const [a, b] of pairs) {
      comparisons.push({
        href: `/compare/${a.slug}-vs-${b.slug}`,
        label: `${a.name} vs ${b.name}`,
        category,
      });
      if (comparisons.length >= 10) return comparisons;
    }
  }

  return comparisons;
}

export default async function ToolsPage() {
  const tools = await prisma.tool.findMany({
    where: { status: "ACTIVE" },
    include: { primaryCategory: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });

  const lite: ToolLite[] = tools.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    primaryCategory: t.primaryCategory?.name ?? "Tools",
    primaryCategorySlug: t.primaryCategory?.slug ?? "tools",
    pricingModel: String(t.pricingModel),
    shortDescription: t.shortDescription,
    startingPrice: t.startingPrice ?? null,
    keyFeatures: t.keyFeatures ?? [],
    isFeatured: t.isFeatured,
  }));

  const categoryPairs = Array.from(
    new Map(lite.map((t) => [t.primaryCategorySlug, t.primaryCategory])).entries(),
  )
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const popularComparisons = buildPopularComparisons(lite);

  return (
    <ToolsPageClient
      tools={lite}
      categories={categoryPairs}
      popularComparisons={popularComparisons}
      totalTools={lite.length}
      totalCategories={categoryPairs.length}
    />
  );
}
