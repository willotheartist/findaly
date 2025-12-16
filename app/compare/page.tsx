// app/compare/page.tsx
import { prisma } from "@/lib/db";
import ComparePageClient from "@/components/ComparePageClient";

type ToolLite = {
  id: string;
  name: string;
  slug: string;

  websiteUrl: string | null;
  logoUrl: string | null;

  primaryCategory: string;
  primaryCategorySlug: string;

  pricingModel: string;
  startingPrice: string | null;
  shortDescription: string;

  isFeatured: boolean;
};

function buildPopularComparisons(tools: ToolLite[]) {
  const byCategory = new Map<string, ToolLite[]>();

  for (const t of tools) {
    const key = t.primaryCategory || "Tools";
    byCategory.set(key, [...(byCategory.get(key) ?? []), t]);
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
    const top = arr.slice(0, 6);

    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        const a = top[i]!;
        const b = top[j]!;
        comparisons.push({
          href: `/compare/${a.slug}-vs-${b.slug}`,
          label: `${a.name} vs ${b.name}`,
          category,
        });
        if (comparisons.length >= 18) return comparisons;
      }
    }
  }

  return comparisons;
}

export default async function ComparePage() {
  const tools = await prisma.tool.findMany({
    where: { status: "ACTIVE" },
    include: { primaryCategory: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    take: 800,
  });

  const lite: ToolLite[] = tools.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,

    websiteUrl: t.websiteUrl ?? null,
    logoUrl: t.logoUrl ?? null,

    primaryCategory: t.primaryCategory?.name ?? "Tools",
    primaryCategorySlug: t.primaryCategory?.slug ?? "tools",

    pricingModel: String(t.pricingModel),
    startingPrice: t.startingPrice ?? null,
    shortDescription: t.shortDescription ?? "",

    isFeatured: Boolean(t.isFeatured),
  }));

  const featuredTools = lite.filter((t) => t.isFeatured).slice(0, 12);
  const popularComparisons = buildPopularComparisons(lite);

  return (
    <ComparePageClient
      tools={lite}
      featuredTools={featuredTools}
      popularComparisons={popularComparisons}
    />
  );
}
