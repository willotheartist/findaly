import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ListingPageClient from "./ListingPageClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BoatListingPage({ params }: PageProps) {
  const { slug } = await params;

  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      profile: {
        select: {
          id: true,
          name: true,
          slug: true,
          location: true,
          phone: true,
          website: true,
          isVerified: true,
          createdAt: true,
          _count: {
            select: { listings: true },
          },
        },
      },
      media: {
        orderBy: { sort: "asc" },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  const transformedListing = {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    price: listing.priceCents ? listing.priceCents / 100 : 0,
    priceNegotiable: listing.priceType === "NEGOTIABLE",
    currency: listing.currency,
    location: listing.location || "",
    country: listing.country || "",

    year: listing.year || 0,
    length: listing.lengthFt || 0,
    lengthM: listing.lengthM || 0,
    beam: listing.beamFt || 0,
    beamM: listing.beamM || 0,
    draft: listing.draftFt || 0,
    draftM: listing.draftM || 0,
    displacement: listing.displacement || undefined,

    type: listing.kind,
    category: listing.boatCategory || "",
    brand: listing.brand || "",
    model: listing.model || "",
    hullMaterial: listing.hullMaterial || "",
    hullType: listing.hullType || "",
    hullColor: listing.hullColor || undefined,

    engineMake: listing.engineMake || undefined,
    engineModel: listing.engineModel || undefined,
    enginePower: listing.enginePower ? parseInt(listing.enginePower) : undefined,
    engineHours: listing.engineHours || undefined,
    fuelType: listing.fuelType || "",
    fuelCapacity: listing.fuelCapacity ? parseInt(listing.fuelCapacity) : undefined,

    cabins: listing.cabins || undefined,
    berths: listing.berths || undefined,
    heads: listing.heads || undefined,

    features: (listing.features as string[]) || [],
    electronics: (listing.electronics as string[]) || [],
    safetyEquipment: (listing.safetyEquipment as string[]) || [],

    images: listing.media.map((m) => m.url),
    videoUrl: listing.videoUrl || undefined,

    description: listing.description || "",
    condition: listing.vesselCondition || "USED",
    taxStatus: listing.taxStatus || undefined,
    lying: listing.lying || undefined,

    badge: listing.featured ? ("featured" as const) : undefined,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),

    seller: {
      id: listing.profile.id,
      name: listing.sellerName || listing.profile.name,
      type: listing.sellerType === "PROFESSIONAL" ? ("pro" as const) : ("private" as const),
      company: listing.sellerCompany || undefined,
      location: listing.sellerLocation || listing.profile.location || "",
      phone: listing.sellerPhone || listing.profile.phone || undefined,
      responseTime: "Usually responds within 24 hours",
      memberSince: listing.profile.createdAt.getFullYear().toString(),
      listingsCount: listing.profile._count.listings,
      verified: listing.profile.isVerified,
      website: listing.sellerWebsite || listing.profile.website || undefined,
    },
  };

  return <ListingPageClient listing={transformedListing} />;
}