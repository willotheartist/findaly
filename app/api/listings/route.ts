// app/api/listings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { ListingKind, ListingIntent, Currency, VesselCondition, SellerType, PriceType, CharterPricePeriod, PartsCondition } from "@prisma/client";

function generateSlug(title: string, brand?: string, model?: string): string {
  const base = title || `${brand || ""} ${model || ""}`.trim() || "listing";
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return `${slug}-${uniqueSuffix}`;
}

function mapListingKind(listingType: string | null): ListingKind {
  switch (listingType) {
    case "service":
      return ListingKind.SERVICES;
    case "parts":
      return ListingKind.PARTS;
    default:
      return ListingKind.VESSEL;
  }
}

function mapListingIntent(listingType: string | null): ListingIntent {
  return listingType === "charter" ? ListingIntent.CHARTER : ListingIntent.SALE;
}

function mapCurrency(currency: string): Currency {
  switch (currency?.toUpperCase()) {
    case "EUR":
      return Currency.EUR;
    case "GBP":
      return Currency.GBP;
    case "USD":
      return Currency.USD;
    case "AED":
      return Currency.AED;
    default:
      return Currency.EUR;
  }
}

function mapVesselCondition(condition: string): VesselCondition | null {
  switch (condition?.toLowerCase()) {
    case "new":
      return VesselCondition.NEW;
    case "used":
      return VesselCondition.USED;
    default:
      return null;
  }
}

function mapSellerType(sellerType: string | null): SellerType {
  return sellerType === "professional" ? SellerType.PROFESSIONAL : SellerType.PRIVATE;
}

function mapPriceType(priceType: string): PriceType {
  switch (priceType?.toLowerCase()) {
    case "fixed":
      return PriceType.FIXED;
    case "poa":
      return PriceType.POA;
    case "auction":
      return PriceType.AUCTION;
    default:
      return PriceType.NEGOTIABLE;
  }
}

function mapCharterPricePeriod(period: string): CharterPricePeriod | null {
  switch (period?.toLowerCase()) {
    case "hour":
      return CharterPricePeriod.HOUR;
    case "day":
      return CharterPricePeriod.DAY;
    case "week":
      return CharterPricePeriod.WEEK;
    default:
      return null;
  }
}

function mapPartsCondition(condition: string): PartsCondition | null {
  switch (condition?.toLowerCase()) {
    case "new":
      return PartsCondition.NEW;
    case "used":
      return PartsCondition.USED;
    case "refurbished":
      return PartsCondition.REFURBISHED;
    default:
      return null;
  }
}

function parseIntOrNull(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

function parseFloatOrNull(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

function parseDateOrNull(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

function priceToCents(price: string | number | null | undefined): number | null {
  const parsed = parseFloatOrNull(price);
  if (parsed === null) return null;
  return Math.round(parsed * 100);
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to create a listing" },
        { status: 401 }
      );
    }

    // Get user's profile (create one if doesn't exist)
    let profile = await prisma.profile.findFirst({
      where: { userId: user.id },
    });

    if (!profile) {
      // Auto-create a profile for the user
      const profileSlug = `user-${user.id.slice(0, 8)}-${Date.now().toString(36)}`;
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          slug: profileSlug,
          name: user.email.split("@")[0], // Use email prefix as default name
        },
      });
    }

    // Parse the form data
    const formData = await request.json();

    // Generate title if not provided
    const title =
      formData.title ||
      (formData.listingType === "service"
        ? formData.serviceName
        : `${formData.brand || ""} ${formData.model || ""}`.trim()) ||
      "Untitled Listing";

    // Generate unique slug
    const slug = generateSlug(title, formData.brand, formData.model);

    // Create the listing
    const listing = await prisma.listing.create({
      data: {
        profileId: profile.id,
        
        // Core fields
        kind: mapListingKind(formData.listingType),
        intent: mapListingIntent(formData.listingType),
        status: "LIVE", // Publish immediately
        
        title,
        slug,
        description: formData.description || null,
        
        // Location
        location: formData.location || null,
        country: formData.country || null,
        marina: formData.marina || null,
        lying: formData.lying || null,
        
        // Pricing
        currency: mapCurrency(formData.currency),
        priceCents: priceToCents(formData.price),
        priceType: mapPriceType(formData.priceType),
        taxStatus: formData.taxStatus || null,
        
        // Listing options
        featured: formData.featured || false,
        urgent: formData.urgent || false,
        acceptOffers: formData.acceptOffers ?? true,
        
        // Vessel specific
        boatCategory: formData.boatCategory || null,
        charterType: formData.charterType || null,
        vesselCondition: mapVesselCondition(formData.condition),
        
        brand: formData.brand || null,
        model: formData.model || null,
        year: parseIntOrNull(formData.year),
        
        // Dimensions
        lengthFt: parseFloatOrNull(formData.lengthFt),
        lengthM: parseFloatOrNull(formData.lengthM),
        beamFt: parseFloatOrNull(formData.beamFt),
        beamM: parseFloatOrNull(formData.beamM),
        draftFt: parseFloatOrNull(formData.draftFt),
        draftM: parseFloatOrNull(formData.draftM),
        displacement: formData.displacement || null,
        
        // Hull
        hullMaterial: formData.hullMaterial || null,
        hullType: formData.hullType || null,
        hullColor: formData.hullColor || null,
        
        // Engine
        engineMake: formData.engineMake || null,
        engineModel: formData.engineModel || null,
        enginePower: formData.enginePower || null,
        engineCount: parseIntOrNull(formData.engineCount),
        engineHours: parseIntOrNull(formData.engineHours),
        fuelType: formData.fuelType || null,
        fuelCapacity: formData.fuelCapacity || null,
        
        // Accommodation
        cabins: parseIntOrNull(formData.cabins),
        berths: parseIntOrNull(formData.berths),
        heads: parseIntOrNull(formData.heads),
        
        // Features (JSON arrays)
        features: formData.features || [],
        electronics: formData.electronics || [],
        safetyEquipment: formData.safetyEquipment || [],
        customFeatures: formData.customFeatures || null,
        
        // Charter specific
        charterGuests: parseIntOrNull(formData.charterGuests),
        charterCrew: parseIntOrNull(formData.charterCrew),
        charterPricePeriod: mapCharterPricePeriod(formData.charterPricePeriod),
        charterAvailableFrom: parseDateOrNull(formData.charterAvailableFrom),
        charterAvailableTo: parseDateOrNull(formData.charterAvailableTo),
        charterIncluded: formData.charterIncluded || [],
        
        // Recent works & media
        recentWorks: formData.recentWorks || null,
        videoUrl: formData.videoUrl || null,
        virtualTourUrl: formData.virtualTourUrl || null,
        
        // Service specific
        serviceCategory: formData.serviceCategory || null,
        serviceName: formData.serviceName || null,
        serviceDescription: formData.serviceDescription || null,
        serviceExperience: formData.serviceExperience || null,
        serviceAreas: formData.serviceAreas || [],
        
        // Parts specific
        partsCategory: formData.partsCategory || null,
        partsCondition: mapPartsCondition(formData.partsCondition),
        partsCompatibility: formData.partsCompatibility || null,
        
        // Seller info (denormalized for display)
        sellerType: mapSellerType(formData.sellerType),
        sellerName: formData.sellerName || null,
        sellerCompany: formData.sellerCompany || null,
        sellerEmail: formData.sellerEmail || null,
        sellerPhone: formData.sellerPhone || null,
        sellerWhatsapp: formData.sellerWhatsapp || false,
        sellerLocation: formData.sellerLocation || null,
        sellerWebsite: formData.sellerWebsite || null,
      },
    });

    // Create media records if photoUrls provided
    // Note: In production, you'd upload actual files and get real URLs
    // For now, we store the placeholder URLs
    if (formData.photoUrls && formData.photoUrls.length > 0) {
      const mediaData = formData.photoUrls
        .filter((url: string) => url && url !== "placeholder")
        .map((url: string, index: number) => ({
          listingId: listing.id,
          url,
          sort: index,
        }));

      if (mediaData.length > 0) {
        await prisma.listingMedia.createMany({
          data: mediaData,
        });
      }
    }

    return NextResponse.json({
      success: true,
      id: listing.id,
      slug: listing.slug,
    });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kind = searchParams.get("kind");
    const intent = searchParams.get("intent");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const where: Record<string, unknown> = {
      status: "LIVE",
    };

    if (kind) {
      where.kind = kind.toUpperCase();
    }

    if (intent) {
      where.intent = intent.toUpperCase();
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          profile: {
            select: {
              id: true,
              name: true,
              slug: true,
              isVerified: true,
            },
          },
          media: {
            orderBy: { sort: "asc" },
            take: 1,
          },
        },
        orderBy: [
          { featured: "desc" },
          { createdAt: "desc" },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}