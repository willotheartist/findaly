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
    robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    openGraph: { title: `${title} | Findaly`, description, url: absoluteUrl(canonicalPath), type: "website" },
  twitter: {
    card: "summary_large_image",
    title: "Sailboats for Sale | Findaly",
    description: "Browse sailboats for sale on Findaly. Find monohulls, performance sailboats and cruising yachts.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
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
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Sailboats for Sale — Find Your Next Sailing Yacht</h1>
        <p>Browse sailboats for sale on Findaly. Find monohulls, performance sailboats and cruising yachts from private sellers and brokers.</p>
        <nav>
          <a href="/">Home</a>
          <a href="/buy">Boats for Sale</a>
          <a href="/buy/sailboats">Sailboats for Sale</a>
          <a href="/buy/motor-yachts">Motor Yachts for Sale</a>
          <a href="/buy/catamarans">Catamarans for Sale</a>
          <a href="/buy/superyachts">Superyachts for Sale</a>
          <a href="/sell">Sell Your Boat</a>
          <a href="/charter">Charter</a>
          <a href="/brokers">Brokers</a>
          <a href="/guides">Buying Guides</a>
          <a href="/finance">Yacht Finance</a>
          <a href="/about">About</a>
          <a href="/faq">FAQ</a>
        </nav>
      </div>
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
    </>
  );
}
