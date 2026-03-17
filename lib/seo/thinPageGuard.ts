import type { Metadata } from "next";

export const PROGRAMMATIC_INDEX_THRESHOLDS = {
  single: 5,
  combo: 8,
} as const;

type ProgrammaticRobotsArgs = {
  listingCount: number;
  dimensions: 1 | 2 | 3 | 4;
  hasYear?: boolean;
};

export function shouldNoindex(
  listingCount: number,
  args?: Omit<ProgrammaticRobotsArgs, "listingCount">
): boolean {
  return !programmaticShouldIndex({
    listingCount,
    dimensions: args?.dimensions ?? 1,
    hasYear: args?.hasYear ?? false,
  });
}

export function hubPageRobots(listingCount: number): Metadata["robots"] {
  return programmaticPageRobots({
    listingCount,
    dimensions: 1,
    hasYear: false,
  });
}

export function programmaticShouldIndex({
  listingCount,
  dimensions,
  hasYear = false,
}: ProgrammaticRobotsArgs): boolean {
  if (!Number.isFinite(listingCount) || listingCount <= 0) return false;

  if (dimensions >= 3) return false;

  if (hasYear) {
    if (dimensions === 1) return listingCount >= PROGRAMMATIC_INDEX_THRESHOLDS.combo;
    return false;
  }

  if (dimensions === 1) {
    return listingCount >= PROGRAMMATIC_INDEX_THRESHOLDS.single;
  }

  if (dimensions === 2) {
    return listingCount >= PROGRAMMATIC_INDEX_THRESHOLDS.combo;
  }

  return false;
}

export function programmaticPageRobots({
  listingCount,
  dimensions,
  hasYear = false,
}: ProgrammaticRobotsArgs): Metadata["robots"] {
  const shouldIndex = programmaticShouldIndex({ listingCount, dimensions, hasYear });
  return shouldIndex
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
    : { index: false, follow: true };
}
