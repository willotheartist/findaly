// app/my-listings/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentProfile } from "@/lib/auth/profile";
import MyListingsClient from "./MyListingsClient";

export const metadata = {
  title: "My Listings | Findaly",
  description: "Manage your boat listings on Findaly",
};

export default async function MyListingsPage() {
  // Middleware ensures user has a valid session cookie before this runs.
  // getCurrentProfile() fetches the profile for the authenticated user.
  const profile = await getCurrentProfile();
  
  // User is authenticated but has no profile - send to settings to create one
  if (!profile) {
    redirect("/settings?setup=profile");
  }

  const listings = await prisma.listing.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
    include: {
      media: {
        orderBy: { sort: "asc" },
        take: 1,
      },
      _count: {
        select: { conversations: true },
      },
    },
  });

  const stats = {
    total: listings.length,
    live: listings.filter((l) => l.status === "LIVE").length,
    draft: listings.filter((l) => l.status === "DRAFT").length,
    paused: listings.filter((l) => l.status === "PAUSED").length,
    sold: listings.filter((l) => l.status === "SOLD").length,
    featured: listings.filter((l) => l.featured).length,
    totalInquiries: listings.reduce((sum, l) => sum + l._count.conversations, 0),
  };

  const transformedListings = listings.map((listing) => ({
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    kind: listing.kind,
    intent: listing.intent,
    status: listing.status,
    currency: listing.currency,
    priceCents: listing.priceCents,
    priceType: listing.priceType,
    location: listing.location,
    country: listing.country,
    year: listing.year,
    lengthM: listing.lengthM,
    brand: listing.brand,
    model: listing.model,
    boatCategory: listing.boatCategory,
    featured: listing.featured,
    urgent: listing.urgent,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
    thumbnailUrl: listing.media[0]?.url || null,
    inquiriesCount: listing._count.conversations,
  }));

  return (
    <MyListingsClient
      listings={transformedListings}
      stats={stats}
      profileSlug={profile.slug}
    />
  );
}