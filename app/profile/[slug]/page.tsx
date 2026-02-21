// app/profile/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import ProfilePageClient from "./ProfilePageClient";
import { absoluteUrl, truncate } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function PublicProfilePage({ params }: PageProps) {
  const { slug } = await Promise.resolve(params);

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

  // ✅ Guard: profiles can exist without a linked user (or relation may be null in prod data)
  const linkedUserId = profile.user?.id ?? null;
  const accountType = profile.user?.accountType ?? "UNKNOWN";

  const currentUser = await getCurrentUser().catch(() => null);
  const isOwner = !!currentUser?.id && !!profile.userId && currentUser.id === profile.userId;

  const liveListings = profile.listings.filter((l) => l.status === "LIVE");
  const soldListings = profile.listings.filter((l) => l.status === "SOLD");

  const responseRate = profile.isVerified ? 95 : 75;
  const avgResponseTime = profile.isVerified ? "Within 2 hours" : "Within 24 hours";

  // ✅ Transform safely (avoid any runtime throws from unexpected nulls)
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
    createdAt: listing.createdAt ? listing.createdAt.toISOString() : new Date(0).toISOString(),
    thumbnailUrl: listing.media?.[0]?.url ?? null,
  }));

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

    avatarUrl: profile.avatarUrl ?? null,
    companyLogoUrl: profile.companyLogoUrl ?? null,

    isVerified: profile.isVerified,
    createdAt: profile.createdAt.toISOString(),

    // ✅ do NOT assume user relation exists
    accountType,
    user: {
      id: linkedUserId,
    },

    stats: {
      totalListings: profile.listings.length,
      liveListings: liveListings.length,
      soldListings: soldListings.length,
      totalViews: 0,
      responseRate,
      avgResponseTime,
    },
    listings: transformedListings,
  };

  return <ProfilePageClient profile={profileData} isOwner={isOwner} />;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  const profile = await prisma.profile.findUnique({
    where: { slug },
    select: {
      name: true,
      tagline: true,
      location: true,
      avatarUrl: true,
      companyLogoUrl: true,
      _count: { select: { listings: true } },
    },
  });

  if (!profile) {
    return { title: "Profile Not Found | Findaly" };
  }

  const title = `${profile.name}`;
  const description = truncate(
    profile.tagline
      ? `${profile.tagline} · ${profile.location || "Yacht broker"} · ${profile._count.listings} listings on Findaly.`
      : `${profile.name} · ${profile.location || "Yacht broker"} · ${profile._count.listings} listings on Findaly.`,
    160
  );

  const image = profile.companyLogoUrl || profile.avatarUrl || "/hero-pros.jpg";
  const ogImage = absoluteUrl(image);

  const canonicalPath = `/profile/${slug}`;
  const canonical = absoluteUrl(canonicalPath);

  return {
    title: `${title} | Findaly`,
    description,
    alternates: { canonical },
    openGraph: {
      type: "profile",
      title: `${title} | Findaly`,
      description,
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Findaly`,
      description,
      images: [ogImage],
    },
  };
}