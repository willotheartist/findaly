import type { Metadata } from "next";
import BuyPageClient from "../BuyPageClient";
import { absoluteUrl } from "@/lib/site";
import { categoryWhere, fetchBuyPagePayload } from "../_category-utils";
import { prisma } from "@/lib/db";

type SearchParams = { page?: string; sort?: string; view?: string };
type PageProps = { searchParams: Promise<SearchParams> | SearchParams };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await Promise.resolve(searchParams);
  const pageNum = params.page ? Math.max(1, parseInt(params.page, 10) || 1) : 1;

  const canonicalPath = pageNum > 1 ? `/buy/sailboats?page=${pageNum}` : "/buy/sailboats";
  const title = "Sailboats for Sale | Findaly";
  const description = "Browse sailboats for sale worldwide. Compare cruisers, racers and bluewater sailboats on Findaly.";

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    robots: { index: true, follow: true },
    openGraph: { title: `${title} | Findaly`, description, url: absoluteUrl(canonicalPath), type: "website" },
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = await Promise.resolve(searchParams);
  const page = params.page ? parseInt(params.page) || 1 : 1;
  const sort = params.sort || "newest";
  const view = (params.view as "grid" | "list") || "list";

  const where = categoryWhere("sailboats");
  const { transformedListings, totalCount, totalPages } = await fetchBuyPagePayload({ where, page, sort });

  // aggregations (reuse from /buy)
  const [categoryAggs, brandAggs, countryAggs] = await Promise.all([
    prisma.listing.groupBy({ by: ["boatCategory"], where: { kind: "VESSEL", status: "LIVE" }, _count: true }),
    prisma.listing.groupBy({
      by: ["brand"], where: { kind: "VESSEL", status: "LIVE" }, _count: true,
      orderBy: { _count: { brand: "desc" } }, take: 20,
    }),
    prisma.listing.groupBy({
      by: ["country"], where: { kind: "VESSEL", status: "LIVE" }, _count: true,
      orderBy: { _count: { country: "desc" } },
    }),
  ]);

  const categories = categoryAggs.filter((c) => c.boatCategory).map((c) => ({
    id: c.boatCategory!.toLowerCase(), label: c.boatCategory!, count: c._count,
  })).sort((a, b) => b.count - a.count);

  const brands = brandAggs.filter((b) => b.brand).map((b) => ({
    id: b.brand!.toLowerCase().replace(/\s+/g, "-"), label: b.brand!, count: b._count,
  }));

  const countries = countryAggs.filter((c) => c.country).map((c) => ({
    id: c.country!.toLowerCase().replace(/\s+/g, "-"), label: c.country!, count: c._count,
  }));

  return (
    <BuyPageClient
      listings={transformedListings}
      totalCount={totalCount}
      currentPage={page}
      totalPages={totalPages}
      filters={{
        q: "",
        location: "",
        country: "",
        categories: ["sailboat"],
        brands: [],
        fuelTypes: [],
        condition: "",
        sellerType: "",
        sort,
        view,
      }}
      aggregations={{ categories, brands, countries }}
    />
  );
}
