//·/app/profile/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import ProfilePageClient from "./ProfilePageClient";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function PublicProfilePage({ params }: PageProps) {
  const { slug } = await Promise.resolve(params);

  // Fetch the profile with all related data
  const profile = await prisma.profile.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          id: true,
          accountType: true,
        },
      },
      listings: {
        orderBy: { createdAt: "desc" },
        include: {
          media: {
            orderBy: { sort: "asc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!profile) return notFound();

  // Check if current user is the owner
  const currentUser = await getCurrentUser().catch(() => null);
  const isOwner = currentUser?.id === profile.userId;

  // Calculate stats
  const liveListings = profile.listings.filter((l) => l.status === "LIVE");
  const soldListings = profile.listings.filter((l) => l.status === "SOLD");

  // For response rate and time, we'd ideally track this in the DB
  // For now, we'll use placeholder values that make sense
  const responseRate = profile.isVerified ? 95 : 75;
  const avgResponseTime = profile.isVerified ? "Within 2 hours" : "Within 24 hours";

  // Transform listings for the client
  const transformedListings = profile.listings.map((listing) => ({
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    kind: listing.kind,
    status: listing.status,
    priceCents: listing.priceCents,
    currency: listing.currency,
    location: listing.location,
    country: listing.country,
    year: listing.year,
    lengthM: listing.lengthM,
    brand: listing.brand,
    model: listing.model,
    boatCategory: listing.boatCategory,
    featured: listing.featured,
    createdAt: listing.createdAt.toISOString(),
    thumbnailUrl: listing.media[0]?.url ?? null,
  }));

  // Build the profile data object
  const profileData = {
    id: profile.id,
    slug: profile.slug,
    name: profile.name,
    tagline: profile.tagline,
    location: profile.location,
    about: profile.about,
    website: profile.website,
    email: profile.email,
    phone: profile.phone,
    isVerified: profile.isVerified,
    createdAt: profile.createdAt.toISOString(),
    accountType: profile.user.accountType,
    stats: {
      totalListings: profile.listings.length,
      liveListings: liveListings.length,
      soldListings: soldListings.length,
      totalViews: 0, // Would need to track this in DB
      responseRate,
      avgResponseTime,
    },
    listings: transformedListings,
  };

  return <ProfilePageClient profile={profileData} isOwner={isOwner} />;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await Promise.resolve(params);

  const profile = await prisma.profile.findUnique({
    where: { slug },
    select: {
      name: true,
      tagline: true,
      location: true,
      _count: {
        select: { listings: true },
      },
    },
  });

  if (!profile) {
    return {
      title: "Profile Not Found | Findaly",
    };
  }

  const description = profile.tagline
    ? `${profile.name} - ${profile.tagline}. Browse ${profile._count.listings} listings on Findaly.`
    : `${profile.name} on Findaly. Browse ${profile._count.listings} maritime listings.`;

  return {
    title: `${profile.name} | Findaly`,
    description,
    openGraph: {
      title: `${profile.name} | Findaly`,
      description,
      type: "profile",
    },
  };
}