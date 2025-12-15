// app/alternatives/page.tsx
import { prisma } from "@/lib/db";
import AlternativesPageClient from "@/components/AlternativesPageClient";

type ToolLite = {
  id: string;
  name: string;
  slug: string;
  primaryCategory: string;
  primaryCategorySlug: string;
  pricingModel: string;
  shortDescription: string;
  startingPrice: string | null;
  isFeatured: boolean;
};

export default async function AlternativesIndexPage() {
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
    isFeatured: t.isFeatured,
  }));

  return <AlternativesPageClient tools={lite} totalTools={lite.length} />;
}
