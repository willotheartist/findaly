export const INTERNAL_LINKING = {
  cacheSeconds: 60 * 60 * 12, // 12h

  tool: {
    altTools: 5,
    comparisons: 3,
    best: 4,
  },

  alternatives: {
    topAlternatives: 8,
    comparisons: 5,
  },

  category: {
    tools: 24,
    topToolsForPairs: 6,
    best: 8,
    useCases: 10,
    comparisons: 8,
    alternatives: 6,
  },

  best: {
    tools: 8,
    comparisons: 6,
    alternatives: 6,
  },
} as const;

export type LinkKind = "tool" | "category" | "alternatives" | "compare" | "best" | "use-case";

export function uniqByHref<T extends { href: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((x) => {
    if (seen.has(x.href)) return false;
    seen.add(x.href);
    return true;
  });
}

export function clamp<T>(arr: T[], n: number) {
  return arr.slice(0, n);
}

export function titleFromSlug(slug: string) {
  return String(slug ?? "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}
