// lib/seo/thinPageGuard.ts
//
// Use this in generateMetadata() for programmatic pages
// (brand, model, country, year hubs) to noindex pages
// that don't have enough listings to be worth indexing.
//
// Usage in any hub page:
//
//   import { shouldNoindex } from "@/lib/seo/thinPageGuard";
//
//   export async function generateMetadata(...) {
//     const count = await prisma.listing.count({ where: { ... } });
//     return {
//       title: "...",
//       robots: shouldNoindex(count) ? { index: false, follow: true } : { index: true, follow: true },
//     };
//   }

const MIN_LISTINGS_TO_INDEX = 3;

/**
 * Returns true if a programmatic page should be noindexed.
 * Pages with fewer than MIN_LISTINGS_TO_INDEX are considered thin.
 */
export function shouldNoindex(listingCount: number): boolean {
  return listingCount < MIN_LISTINGS_TO_INDEX;
}

/**
 * Returns the robots metadata object for a programmatic page.
 */
export function hubPageRobots(listingCount: number) {
  if (listingCount < MIN_LISTINGS_TO_INDEX) {
    return { index: false, follow: true };
  }
  return { index: true, follow: true };
}