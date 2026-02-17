// app/buy/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import ListingPageClient from "./ListingPageClient";
import { absoluteUrl, getSiteUrl } from "@/lib/site";
import type { Prisma } from "@prisma/client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type JsonLdObject = Record<string, unknown>;

function jsonLd(obj: JsonLdObject) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
    />
  );
}

export default async function BoatListingPage({ params }: PageProps) {
  const { slug } = await params;

  const [user, listing] = await Promise.all([
    getCurrentUser(),
    prisma.listing.findUnique({
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
    }),
  ]);

  if (!listing) notFound();

  const isAdmin = user?.role === "ADMIN";

  // ─────────────────────────────────────────────────────────────
  // Similar boats (Green-Acres style: exactly 4, curated)
  // ─────────────────────────────────────────────────────────────
  const take = 4;

  const baseWhere: Prisma.ListingWhereInput = {
    kind: "VESSEL",
    intent: "SALE",
    status: "LIVE",
    id: { not: listing.id },
  };

  const orClauses: Prisma.ListingWhereInput[] = [];
  if (listing.brand) orClauses.push({ brand: listing.brand });
  if (listing.boatCategory) orClauses.push({ boatCategory: listing.boatCategory });
  if (listing.model) orClauses.push({ model: listing.model });

  const primaryWhere: Prisma.ListingWhereInput =
    orClauses.length > 0 ? { ...baseWhere, OR: orClauses } : baseWhere;

  const primary = await prisma.listing.findMany({
    where: primaryWhere,
    include: {
      profile: { select: { id: true, name: true, isVerified: true } },
      media: { orderBy: { sort: "asc" }, take: 1 },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take,
  });

  const primaryIds = new Set(primary.map((x) => x.id));
  const remaining = Math.max(0, take - primary.length);

  const fallback =
    remaining > 0
      ? await prisma.listing.findMany({
          where: {
            ...baseWhere,
            id: { notIn: [listing.id, ...Array.from(primaryIds)] },
            ...(listing.country ? { country: listing.country } : {}),
          },
          include: {
            profile: { select: { id: true, name: true, isVerified: true } },
            media: { orderBy: { sort: "asc" }, take: 1 },
          },
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          take: remaining,
        })
      : [];

  const similar = [...primary, ...fallback].slice(0, take);

  const transformedSimilar = similar.map((l) => {
    const price = l.priceCents ? l.priceCents / 100 : 0;
    const img = l.media?.[0]?.url || "";

    const badge =
      l.featured
        ? ("Featured" as const)
        : l.profile?.isVerified
          ? ("Verified" as const)
          : l.urgent
            ? ("Hot" as const)
            : undefined;

    return {
      id: l.id,
      slug: l.slug,
      title: l.title,
      price,
      currency: l.currency,
      location: l.location || "",
      country: l.country || "",
      year: l.year || 0,
      lengthFt: l.lengthFt || 0,
      image: img,
      badge,
      sellerName: l.profile?.name || "Findaly",
    };
  });

  const features =
    Array.isArray(listing.features) ? listing.features.filter((x): x is string => typeof x === "string") : [];
  const electronics =
    Array.isArray(listing.electronics) ? listing.electronics.filter((x): x is string => typeof x === "string") : [];
  const safetyEquipment =
    Array.isArray(listing.safetyEquipment)
      ? listing.safetyEquipment.filter((x): x is string => typeof x === "string")
      : [];

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
    enginePower: listing.enginePower ? parseInt(listing.enginePower, 10) : undefined,
    engineHours: listing.engineHours || undefined,
    fuelType: listing.fuelType || "",
    fuelCapacity: listing.fuelCapacity ? parseInt(listing.fuelCapacity, 10) : undefined,

    cabins: listing.cabins || undefined,
    berths: listing.berths || undefined,
    heads: listing.heads || undefined,

    features,
    electronics,
    safetyEquipment,

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
      slug: listing.profile.slug,
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

  // ─────────────────────────────────────────────────────────────
  // ✅ Structured Data for /buy/[slug]
  // ─────────────────────────────────────────────────────────────
  const base = getSiteUrl();
  const url = `${base}/buy/${transformedListing.slug}`;
  const primaryImage = transformedListing.images?.[0]
    ? absoluteUrl(transformedListing.images[0])
    : absoluteUrl("/hero-buy.jpg");

  const breadcrumb: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Findaly", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Buy", item: `${base}/buy` },
      { "@type": "ListItem", position: 3, name: transformedListing.title, item: url },
    ],
  };

  const hasPrice = !!listing.priceCents && listing.priceType !== "POA";

  const offer: JsonLdObject = {
    "@type": "Offer",
    url,
    priceCurrency: String(transformedListing.currency),
    availability: "https://schema.org/InStock",
    itemCondition:
      transformedListing.condition === "NEW"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    ...(hasPrice ? { price: Number(transformedListing.price) } : {}),
  };

  const product: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: transformedListing.title,
    url,
    image: [primaryImage],
    description: transformedListing.description
      ? transformedListing.description.slice(0, 500)
      : undefined,
    brand: transformedListing.brand
      ? { "@type": "Brand", name: transformedListing.brand }
      : undefined,
    offers: offer,
    seller: transformedListing.seller?.name
      ? {
          "@type": "Organization",
          name: transformedListing.seller.name,
          url: transformedListing.seller.website ? transformedListing.seller.website : undefined,
          telephone: transformedListing.seller.phone ? transformedListing.seller.phone : undefined,
        }
      : undefined,
  };

  return (
    <>
      {jsonLd(breadcrumb)}
      {jsonLd(product)}

      <ListingPageClient
        listing={transformedListing}
        isAdmin={isAdmin}
        similar={transformedSimilar}
      />
    </>
  );
}
