// app/services/page.tsx
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";
import { absoluteUrl, truncate } from "@/lib/site";

type SearchParams = {
  q?: string;
  category?: string;
  country?: string;
  sort?: string;
  page?: string;
};

type PageProps = {
  searchParams: Promise<SearchParams> | SearchParams;
};

const ITEMS_PER_PAGE = 24;

function hasAnyFilters(params: SearchParams) {
  const q = (params.q || "").trim();
  const category = (params.category || "").trim();
  const country = (params.country || "").trim();
  const sort = (params.sort || "").trim();
  const page = (params.page || "").trim();

  const pageNum = page ? parseInt(page, 10) : 1;
  const pageIsFiltered = Number.isFinite(pageNum) && pageNum > 1;
  const sortIsFiltered = !!sort && sort !== "newest";

  return Boolean(q || category || country || sortIsFiltered || pageIsFiltered);
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const params = await Promise.resolve(searchParams);

  const filters = {
    q: params.q || "",
    categories: params.category?.split(",").filter(Boolean) || [],
    country: params.country || "",
    sort: params.sort || "newest",
    page: params.page ? parseInt(params.page, 10) : 1,
  };

  const where: Prisma.ListingWhereInput = {
    kind: "SERVICES",
    status: "LIVE",
  };

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { serviceName: { contains: filters.q, mode: "insensitive" } },
      { serviceCategory: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
      { location: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  if (filters.categories.length > 0) {
    where.serviceCategory = { in: filters.categories, mode: "insensitive" };
  }

  if (filters.country) {
    where.country = { equals: filters.country, mode: "insensitive" };
  }

  let orderBy: Prisma.ListingOrderByWithRelationInput = { createdAt: "desc" };
  switch (filters.sort) {
    case "name-asc":
      orderBy = { serviceName: "asc" };
      break;
    case "name-desc":
      orderBy = { serviceName: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
  }

  const skip = (filters.page - 1) * ITEMS_PER_PAGE;

  const [listings, totalCount] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: [{ featured: "desc" }, orderBy],
      skip,
      take: ITEMS_PER_PAGE,
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            slug: true,
            isVerified: true,
            location: true,
            about: true,
            companyLogoUrl: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  const [categoryAggs, countryAggs] = await Promise.all([
    prisma.listing.groupBy({
      by: ["serviceCategory"],
      where: { kind: "SERVICES", status: "LIVE" },
      _count: true,
      orderBy: { _count: { serviceCategory: "desc" } },
    }),
    prisma.listing.groupBy({
      by: ["country"],
      where: { kind: "SERVICES", status: "LIVE" },
      _count: true,
      orderBy: { _count: { country: "desc" } },
    }),
  ]);

  const transformedListings = listings.map((listing) => ({
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    description: listing.description,
    serviceName: listing.serviceName,
    serviceCategory: listing.serviceCategory,
    serviceDescription: listing.serviceDescription,
    serviceExperience: listing.serviceExperience,
    serviceAreas: listing.serviceAreas, // Prisma Json
    location: listing.location,
    country: listing.country,
    featured: listing.featured,
    createdAt: listing.createdAt.toISOString(),
    profile: {
      id: listing.profile.id,
      name: listing.profile.name,
      slug: listing.profile.slug,
      isVerified: listing.profile.isVerified,
      location: listing.profile.location,
      about: listing.profile.about,
      companyLogoUrl: listing.profile.companyLogoUrl,
      avatarUrl: listing.profile.avatarUrl,
    },
  }));

  const categoryCounts = categoryAggs
    .filter((c) => c.serviceCategory)
    .map((c) => ({
      id: c.serviceCategory!,
      label: c.serviceCategory!,
      count: c._count,
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
    <ServicesPageClient
      listings={transformedListings}
      totalCount={totalCount}
      currentPage={filters.page}
      totalPages={totalPages}
      filters={{
        q: filters.q,
        categories: filters.categories,
        country: filters.country,
        sort: filters.sort,
      }}
      aggregations={{
        categories: categoryCounts,
        countries: countryCounts,
      }}
    />
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}): Promise<Metadata> {
  const params = await Promise.resolve(searchParams);
  const filtered = hasAnyFilters(params);

  const title = "Marine Services Directory | Findaly";
  const description = truncate(
    "Find yacht surveyors, marine insurance, yacht finance, boatyards, marine lawyers, crew agencies and more across the Mediterranean. The complete marine services directory.",
    160
  );

  const canonical = absoluteUrl("/services");

  return {
    title,
    description,
    alternates: { canonical },
    robots: filtered ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: absoluteUrl("/hero-pros.jpg") }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/hero-pros.jpg")],
    },
  };
}