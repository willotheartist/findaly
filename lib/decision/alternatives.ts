// lib/decision/alternatives.ts
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

function jaccard(a: string[], b: string[]) {
  const A = new Set(a.map((s) => s.toLowerCase().trim()).filter(Boolean));
  const B = new Set(b.map((s) => s.toLowerCase().trim()).filter(Boolean));
  if (A.size === 0 && B.size === 0) return 0;

  let intersection = 0;
  for (const x of A) if (B.has(x)) intersection++;

  const union = A.size + B.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function overlapCount(a: string[], b: string[]) {
  const A = new Set(a.map((s) => s.toLowerCase().trim()).filter(Boolean));
  const B = new Set(b.map((s) => s.toLowerCase().trim()).filter(Boolean));
  let c = 0;
  for (const x of A) if (B.has(x)) c++;
  return c;
}

/**
 * Tool fields needed by /app/tools/[slug]/page.tsx
 * Keep this in sync with your tool page.
 */
const toolSelect = Prisma.validator<Prisma.ToolSelect>()({
  id: true,
  name: true,
  slug: true,
  status: true,

  // copy
  tagline: true,
  shortDescription: true,
  longDescription: true,

  // urls/assets
  websiteUrl: true,
  pricingUrl: true,
  logoUrl: true,

  // pricing
  pricingModel: true,
  startingPrice: true,
  pricingNotes: true,
  startingPriceCents: true,
  startingPricePeriod: true,
  hasFreePlan: true,
  hasFreeTrial: true,
  trialDays: true,

  // decision layer
  bestFor: true,
  notFor: true,
  pros: true,
  cons: true,
  switchReasons: true,

  // arrays
  targetAudience: true,
  keyFeatures: true,
  integrations: true,

  // comparisons
  featureFlags: true,

  // trust
  lastVerifiedAt: true,
  dataConfidence: true,

  primaryCategoryId: true,
  primaryCategory: {
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      description: true,
      parentId: true,
    },
  },
  useCases: {
    select: { id: true, name: true, slug: true, description: true, createdAt: true, updatedAt: true },
  },
});

type ToolForPage = Prisma.ToolGetPayload<{ select: typeof toolSelect }>;

/**
 * Candidates used to render /alternatives pages.
 * IMPORTANT: Include any fields the alternatives page accesses (like startingPrice).
 */
const candidateSelect = Prisma.validator<Prisma.ToolSelect>()({
  id: true,
  name: true,
  slug: true,
  status: true,
  isFeatured: true,

  pricingModel: true,
  startingPrice: true, // ✅ FIX: alternatives page reads this
  shortDescription: true,

  // scoring signals
  targetAudience: true,
  keyFeatures: true,
  integrations: true,
  useCases: { select: { slug: true } },

  primaryCategoryId: true,
});

type Candidate = Prisma.ToolGetPayload<{ select: typeof candidateSelect }>;

export async function getAlternatives(
  toolSlug: string,
): Promise<
  | null
  | {
      tool: ToolForPage;
      alternatives: Array<
        Candidate & {
          _score: number;
          _signals: { useCaseOverlap: number; integrationsOverlap: number };
        }
      >;
    }
> {
  const tool = await prisma.tool.findUnique({
    where: { slug: toolSlug },
    select: toolSelect,
  });

  if (!tool) return null;

  // Fetch candidates: same primary category, active, not itself
  const candidates = await prisma.tool.findMany({
    where: {
      id: { not: tool.id },
      status: "ACTIVE",
      primaryCategoryId: tool.primaryCategoryId,
    },
    select: candidateSelect,
  });

  const toolUseCaseSlugs = tool.useCases.map((u) => u.slug);

  const scored = candidates.map((alt) => {
    const altUseCaseSlugs = alt.useCases.map((u) => u.slug);

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

  const alternativesRanked = scored.sort((a, b) => b._score - a._score).slice(0, 12);

  return { tool, alternatives: alternativesRanked };
}
