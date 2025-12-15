import { prisma } from "@/lib/db";

function jaccard(a: string[], b: string[]) {
  const A = new Set(a.map(s => s.toLowerCase().trim()).filter(Boolean));
  const B = new Set(b.map(s => s.toLowerCase().trim()).filter(Boolean));
  if (A.size === 0 && B.size === 0) return 0;

  let intersection = 0;
  for (const x of A) if (B.has(x)) intersection++;

  const union = A.size + B.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function overlapCount(a: string[], b: string[]) {
  const A = new Set(a.map(s => s.toLowerCase().trim()).filter(Boolean));
  const B = new Set(b.map(s => s.toLowerCase().trim()).filter(Boolean));
  let c = 0;
  for (const x of A) if (B.has(x)) c++;
  return c;
}

export async function getAlternatives(toolSlug: string) {
  const tool = await prisma.tool.findUnique({
    where: { slug: toolSlug },
    include: {
      primaryCategory: true,
      useCases: true,
    },
  });

  if (!tool) return null;

  // Fetch candidates: same primary category, active, not itself
  const candidates = await prisma.tool.findMany({
    where: {
      id: { not: tool.id },
      status: "ACTIVE",
      primaryCategoryId: tool.primaryCategoryId,
    },
    include: {
      useCases: true,
    },
  });

  const toolUseCaseSlugs = tool.useCases.map(u => u.slug);

  const scored = candidates.map((alt) => {
    const altUseCaseSlugs = alt.useCases.map(u => u.slug);

    const useCaseScore = jaccard(toolUseCaseSlugs, altUseCaseSlugs); // 0..1

    const audienceScore = jaccard(tool.targetAudience ?? [], alt.targetAudience ?? []); // 0..1
    const featuresScore = jaccard(tool.keyFeatures ?? [], alt.keyFeatures ?? []); // 0..1

    const integrationsOverlap = overlapCount(tool.integrations ?? [], alt.integrations ?? []);

    // Weighted score (tweak later)
    let score =
      useCaseScore * 50 +
      audienceScore * 20 +
      featuresScore * 25 +
      Math.min(integrationsOverlap, 5) * 1; // small bonus

    if (alt.isFeatured) score += 2;

    return {
      ...alt,
      _score: Math.round(score * 10) / 10,
      _signals: {
        useCaseOverlap: overlapCount(toolUseCaseSlugs, altUseCaseSlugs),
        integrationsOverlap,
      },
    };
  });

  const alternativesRanked = scored
    .sort((a, b) => b._score - a._score)
    .slice(0, 12); // keep a nice pool

  return { tool, alternatives: alternativesRanked };
}
