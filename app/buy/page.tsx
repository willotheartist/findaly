// app/buy/page.tsx
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import BuyPageClient from "./BuyPageClient";

type SearchParams = {
  q?: string;
  location?: string;
  country?: string;
  category?: string;
  brand?: string;
  priceMin?: string;
  priceMax?: string;
  yearMin?: string;
  yearMax?: string;
  lengthMin?: string;
  lengthMax?: string;
  cabins?: string;
  fuel?: string;
  condition?: string;
  seller?: string;
  sort?: string;
  page?: string;
  view?: string;
};

type PageProps = {
  searchParams: Promise<SearchParams> | SearchParams;
};

const ITEMS_PER_PAGE = 24;

export default async function BuyPage({ searchParams }: PageProps) {
  const params = await Promise.resolve(searchParams);

  // Parse filters from URL
  const filters = {
    q: params.q || "",
    location: params.location || "",
    country: params.country || "",
    categories: params.category?.split(",").filter(Boolean) || [],
    brands: params.brand?.split(",").filter(Boolean) || [],
    priceMin: params.priceMin ? parseInt(params.priceMin) * 100 : undefined,
    priceMax: params.priceMax ? parseInt(params.priceMax) * 100 : undefined,
    yearMin: params.yearMin ? parseInt(params.yearMin) : undefined,
    yearMax: params.yearMax ? parseInt(params.yearMax) : undefined,
    lengthMin: params.lengthMin ? parseFloat(params.lengthMin) : undefined,
    lengthMax: params.lengthMax ? parseFloat(params.lengthMax) : undefined,
    cabinsMin: params.cabins ? parseInt(params.cabins) : undefined,
    fuelTypes: params.fuel?.split(",").filter(Boolean) || [],
    condition: params.condition || "",
    sellerType: params.seller || "",
    sort: params.sort || "newest",
    page: params.page ? parseInt(params.page) : 1,
    view: (params.view as "grid" | "list") || "list",
  };

  // Build Prisma where clause
  const where: Prisma.ListingWhereInput = {
    kind: "VESSEL",
    status: "LIVE",
  };

  // Text search
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { brand: { contains: filters.q, mode: "insensitive" } },
      { model: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  // Location
  if (filters.location) {
    where.OR = [
      ...(where.OR || []),
      { location: { contains: filters.location, mode: "insensitive" } },
      { country: { contains: filters.location, mode: "insensitive" } },
      { marina: { contains: filters.location, mode: "insensitive" } },
    ];
  }

  // Country
  if (filters.country) {
    where.country = { equals: filters.country, mode: "insensitive" };
  }

  // Categories
  if (filters.categories.length > 0) {
    where.boatCategory = { in: filters.categories, mode: "insensitive" };
  }

  // Brands
  if (filters.brands.length > 0) {
    where.brand = { in: filters.brands, mode: "insensitive" };
  }

  // Price range
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    where.priceCents = {};
    if (filters.priceMin !== undefined) {
      where.priceCents.gte = filters.priceMin;
    }
    if (filters.priceMax !== undefined) {
      where.priceCents.lte = filters.priceMax;
    }
  }

  // Year range
  if (filters.yearMin !== undefined || filters.yearMax !== undefined) {
    where.year = {};
    if (filters.yearMin !== undefined) {
      where.year.gte = filters.yearMin;
    }
    if (filters.yearMax !== undefined) {
      where.year.lte = filters.yearMax;
    }
  }

  // Length range (in meters)
  if (filters.lengthMin !== undefined || filters.lengthMax !== undefined) {
    where.lengthM = {};
    if (filters.lengthMin !== undefined) {
      where.lengthM.gte = filters.lengthMin;
    }
    if (filters.lengthMax !== undefined) {
      where.lengthM.lte = filters.lengthMax;
    }
  }

  // Cabins
  if (filters.cabinsMin !== undefined) {
    where.cabins = { gte: filters.cabinsMin };
  }

  // Fuel types
  if (filters.fuelTypes.length > 0) {
    where.fuelType = { in: filters.fuelTypes, mode: "insensitive" };
  }

  // Condition
  if (filters.condition === "new") {
    where.vesselCondition = "NEW";
  } else if (filters.condition === "used") {
    where.vesselCondition = "USED";
  }

  // Seller type
  if (filters.sellerType === "pro") {
    where.sellerType = "PROFESSIONAL";
  } else if (filters.sellerType === "private") {
    where.sellerType = "PRIVATE";
  }

  // Build orderBy
  let orderBy: Prisma.ListingOrderByWithRelationInput = { createdAt: "desc" };
  switch (filters.sort) {
    case "price-asc":
      orderBy = { priceCents: "asc" };
      break;
    case "price-desc":
      orderBy = { priceCents: "desc" };
      break;
    case "year-desc":
      orderBy = { year: "desc" };
      break;
    case "year-asc":
      orderBy = { year: "asc" };
      break;
    case "length-desc":
      orderBy = { lengthM: "desc" };
      break;
    case "length-asc":
      orderBy = { lengthM: "asc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
  }

  // Pagination
  const skip = (filters.page - 1) * ITEMS_PER_PAGE;

  // Fetch listings with count
  const [listings, totalCount] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: [{ featured: "desc" }, orderBy],
      skip,
      take: ITEMS_PER_PAGE,
      include: {
        // ✅ we need a handful of images to enable mini scrolling gallery
        media: {
          orderBy: { sort: "asc" },
          take: 8,
        },
        // ✅ get true total count of images (even if we only take 8)
        _count: {
          select: { media: true },
        },
        profile: {
          select: {
            id: true,
            name: true,
            slug: true,
            isVerified: true,
            location: true,
          },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  // Get aggregations for filter counts
  const [categoryAggs, brandAggs, countryAggs] = await Promise.all([
    prisma.listing.groupBy({
      by: ["boatCategory"],
      where: { kind: "VESSEL", status: "LIVE" },
      _count: true,
    }),
    prisma.listing.groupBy({
      by: ["brand"],
      where: { kind: "VESSEL", status: "LIVE" },
      _count: true,
      orderBy: { _count: { brand: "desc" } },
      take: 20,
    }),
    prisma.listing.groupBy({
      by: ["country"],
      where: { kind: "VESSEL", status: "LIVE" },
      _count: true,
      orderBy: { _count: { country: "desc" } },
    }),
  ]);

  // Transform listings for client
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

    // ✅ new: gallery support
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

  // Transform aggregations
  const categoryCounts = categoryAggs
    .filter((c) => c.boatCategory)
    .map((c) => ({
      id: c.boatCategory!.toLowerCase(),
      label: formatCategoryLabel(c.boatCategory!),
      count: c._count,
    }))
    .sort((a, b) => b.count - a.count);

  const brandCounts = brandAggs
    .filter((b) => b.brand)
    .map((b) => ({
      id: b.brand!.toLowerCase().replace(/\s+/g, "-"),
      label: b.brand!,
      count: b._count,
    }));

  const countryCounts = countryAggs
    .filter((c) => c.country)
    .map((c) => ({
      id: c.country!.toLowerCase().replace(/\s+/g, "-"),
      label: c.country!,
      count: c._count,
    }));

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <BuyPageClient
      listings={transformedListings}
      totalCount={totalCount}
      currentPage={filters.page}
      totalPages={totalPages}
      filters={{
        q: filters.q,
        location: filters.location,
        country: filters.country,
        categories: filters.categories,
        brands: filters.brands,
        priceMin: filters.priceMin ? filters.priceMin / 100 : undefined,
        priceMax: filters.priceMax ? filters.priceMax / 100 : undefined,
        yearMin: filters.yearMin,
        yearMax: filters.yearMax,
        lengthMin: filters.lengthMin,
        lengthMax: filters.lengthMax,
        cabinsMin: filters.cabinsMin,
        fuelTypes: filters.fuelTypes,
        condition: filters.condition,
        sellerType: filters.sellerType,
        sort: filters.sort,
        view: filters.view,
      }}
      aggregations={{
        categories: categoryCounts,
        brands: brandCounts,
        countries: countryCounts,
      }}
    />
  );
}

function formatCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    sailboat: "Sailboats",
    "motor-yacht": "Motor Yachts",
    catamaran: "Catamarans",
    rib: "RIBs & Tenders",
    superyacht: "Superyachts",
    fishing: "Fishing Boats",
    dinghy: "Dinghies",
    jetski: "Jet Skis & PWC",
    other: "Other",
  };
  return labels[category.toLowerCase()] || category;
}

export function generateMetadata() {
  return {
    title: "Boats for Sale | Findaly",
    description:
      "Browse thousands of boats for sale. Find sailboats, motor yachts, catamarans and more on Findaly - the maritime marketplace.",
  };
}