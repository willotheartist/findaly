// lib/seo/marketStats.ts
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type MarketStats = {
  total: number;

  pricedCount: number;
  avgPriceCents: number | null;
  minPriceCents: number | null;
  maxPriceCents: number | null;

  avgLengthM: number | null;
  avgLengthFt: number | null;

  countriesListed: number; // distinct countries (non-null)
};

export async function getMarketStats(where: Prisma.ListingWhereInput) {
  const [total, pricedAgg, lengthAgg, distinctCountries] = await Promise.all([
    prisma.listing.count({ where }),

    prisma.listing.aggregate({
      where: {
        ...where,
        priceCents: { not: null, gt: 0 },
      },
      _count: { _all: true },
      _avg: { priceCents: true },
      _min: { priceCents: true },
      _max: { priceCents: true },
    }),

    prisma.listing.aggregate({
      where,
      _avg: { lengthM: true, lengthFt: true },
    }),

    prisma.listing.findMany({
      where: { ...where, country: { not: null } },
      distinct: ["country"],
      select: { country: true },
    }),
  ]);

  const pricedCount = Number(pricedAgg._count?._all ?? 0);

  const avgPriceCents =
    typeof pricedAgg._avg.priceCents === "number"
      ? Math.round(pricedAgg._avg.priceCents)
      : null;

  const minPriceCents =
    typeof pricedAgg._min.priceCents === "number"
      ? Math.round(pricedAgg._min.priceCents)
      : null;

  const maxPriceCents =
    typeof pricedAgg._max.priceCents === "number"
      ? Math.round(pricedAgg._max.priceCents)
      : null;

  const avgLengthM =
    typeof lengthAgg._avg.lengthM === "number" ? lengthAgg._avg.lengthM : null;

  const avgLengthFt =
    typeof lengthAgg._avg.lengthFt === "number"
      ? lengthAgg._avg.lengthFt
      : null;

  const countriesListed = distinctCountries
    .map((x) => x.country)
    .filter((x): x is string => Boolean(x)).length;

  const stats: MarketStats = {
    total,
    pricedCount,
    avgPriceCents,
    minPriceCents,
    maxPriceCents,
    avgLengthM,
    avgLengthFt,
    countriesListed,
  };

  return stats;
}
