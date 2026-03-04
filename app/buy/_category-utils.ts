import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const ITEMS_PER_PAGE = 24;

export function categoryWhere(category: "sailboats" | "motor-yachts" | "catamarans" | "ribs" | "superyachts" | "new"): Prisma.ListingWhereInput {
  const base: Prisma.ListingWhereInput = { kind: "VESSEL", status: "LIVE" };

  if (category === "new") {
    return { ...base, vesselCondition: "NEW" };
  }

  // Robust matching (since boatCategory strings can vary)
  if (category === "sailboats") {
    return { ...base, boatCategory: { contains: "sail", mode: "insensitive" } };
  }

  if (category === "motor-yachts") {
    return {
      ...base,
      OR: [
        { boatCategory: { contains: "motor", mode: "insensitive" } },
        { boatCategory: { contains: "yacht", mode: "insensitive" } },
      ],
    };
  }

  if (category === "catamarans") {
    return {
      ...base,
      OR: [
        { boatCategory: { contains: "catamaran", mode: "insensitive" } },
        { boatCategory: { contains: "cat", mode: "insensitive" } },
      ],
    };
  }

  if (category === "ribs") {
    return {
      ...base,
      OR: [
        { boatCategory: { contains: "rib", mode: "insensitive" } },
        { boatCategory: { contains: "tender", mode: "insensitive" } },
      ],
    };
  }

  // superyachts
  return { ...base, boatCategory: { contains: "super", mode: "insensitive" } };
}

export function orderByFromSort(sort?: string): Prisma.ListingOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { priceCents: "asc" };
    case "price-desc":
      return { priceCents: "desc" };
    case "year-desc":
      return { year: "desc" };
    case "year-asc":
      return { year: "asc" };
    case "length-desc":
      return { lengthM: "desc" };
    case "length-asc":
      return { lengthM: "asc" };
    case "oldest":
      return { createdAt: "asc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

export async function fetchBuyPagePayload(args: {
  where: Prisma.ListingWhereInput;
  page: number;
  sort?: string;
}) {
  const page = Math.max(1, args.page || 1);
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [listings, totalCount] = await Promise.all([
    prisma.listing.findMany({
      where: args.where,
      orderBy: [{ featured: "desc" }, orderByFromSort(args.sort)],
      skip,
      take: ITEMS_PER_PAGE,
      include: {
        media: { orderBy: { sort: "asc" }, take: 8 },
        _count: { select: { media: true } },
        profile: { select: { id: true, name: true, slug: true, isVerified: true, location: true } },
      },
    }),
    prisma.listing.count({ where: args.where }),
  ]);

  const transformedListings = listings.map((listing) => ({
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    priceCents: listing.priceCents ? Number(listing.priceCents) : null,
    currency: listing.currency,
    priceType: listing.priceType,
    location: listing.location,
    country: listing.country,
    year: listing.year,
    lengthFt: listing.lengthFt,
    lengthM: listing.lengthM,
    brand: listing.brand,
    model: listing.model,
    boatCategory: listing.boatCategory,
    cabins: listing.cabins,
    engineHours: listing.engineHours,
    fuelType: listing.fuelType,
    vesselCondition: listing.vesselCondition,
    featured: listing.featured,
    createdAt: listing.createdAt.toISOString(),
    thumbnailUrl: listing.media[0]?.url || null,
    mediaUrls: listing.media.map((m) => m.url),
    mediaCount: listing._count.media,
    seller: {
      id: listing.profile.id,
      name: listing.sellerName || listing.profile.name,
      slug: listing.profile.slug,
      type: listing.sellerType,
      company: listing.sellerCompany,
      location: listing.sellerLocation || listing.profile.location,
      isVerified: listing.profile.isVerified,
    },
  }));

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return { transformedListings, totalCount, totalPages, page };
}
