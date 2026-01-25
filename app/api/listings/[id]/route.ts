// app/api/listings/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentProfile } from "@/lib/auth/profile";
import type { Prisma } from "@prisma/client";
import {
  CharterPricePeriod,
  Currency,
  ListingStatus,
  PartsCondition,
  PriceType,
  SellerType,
  VesselCondition,
} from "@prisma/client";

type Incoming = Record<string, unknown>;

function mapListingTypeToKindIntent(listingType: unknown): {
  kind: "VESSEL" | "PARTS" | "SERVICES";
  intent: "SALE" | "CHARTER";
} {
  if (listingType === "parts") return { kind: "PARTS", intent: "SALE" };
  if (listingType === "service") return { kind: "SERVICES", intent: "SALE" };
  if (listingType === "charter") return { kind: "VESSEL", intent: "CHARTER" };
  return { kind: "VESSEL", intent: "SALE" };
}

function s(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function b(v: unknown): boolean {
  return v === true;
}

function intOrNull(v: unknown): number | null {
  const n =
    typeof v === "string"
      ? parseInt(v, 10)
      : typeof v === "number"
        ? Math.trunc(v)
        : NaN;
  return Number.isFinite(n) ? n : null;
}

function floatOrNull(v: unknown): number | null {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : null;
}

function priceCentsFromPriceString(v: unknown): number | null {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

function stringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function currencyOrNull(v: unknown): Currency | null {
  const val = s(v).toUpperCase();
  if (val === "EUR" || val === "GBP" || val === "USD" || val === "AED" || val === "OTHER")
    return val as Currency;
  return null;
}

function priceTypeOrNull(v: unknown): PriceType | null {
  const val = s(v).toLowerCase();
  if (val === "fixed") return "FIXED";
  if (val === "negotiable") return "NEGOTIABLE";
  if (val === "poa") return "POA";
  if (val === "auction") return "AUCTION";
  return null;
}

function vesselConditionOrNull(v: unknown): VesselCondition | null {
  const val = s(v).toLowerCase();
  if (val === "new") return "NEW";
  if (val === "used") return "USED";
  return null;
}

function partsConditionOrNull(v: unknown): PartsCondition | null {
  const val = s(v).toLowerCase();
  if (val === "new") return "NEW";
  if (val === "used") return "USED";
  if (val === "refurbished") return "REFURBISHED";
  return null;
}

function sellerTypeOrNull(v: unknown): SellerType | null {
  const val = s(v).toLowerCase();
  if (val === "professional") return "PROFESSIONAL";
  if (val === "private") return "PRIVATE";
  return null;
}

function charterPricePeriodOrNull(v: unknown): CharterPricePeriod | null {
  const val = s(v).toLowerCase();
  if (val === "hour") return "HOUR";
  if (val === "day") return "DAY";
  if (val === "week") return "WEEK";
  return null;
}

function dateOrNull(v: unknown): Date | null {
  const str = s(v);
  if (!str) return null;
  const d = new Date(str);
  return Number.isNaN(d.getTime()) ? null : d;
}

function statusOrNull(v: unknown): ListingStatus | null {
  const val = s(v).toUpperCase();
  if (val === "DRAFT" || val === "LIVE" || val === "PAUSED" || val === "SOLD")
    return val as ListingStatus;
  return null;
}

function isBlobOrDataUrl(url: string) {
  return url.startsWith("blob:") || url.startsWith("data:image/");
}

// ─────────────────────────────────────────────────────────────────────────────
// GET - Fetch a single listing
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        media: { orderBy: { sort: "asc" } },
        profile: {
          select: { id: true, name: true, slug: true, isVerified: true },
        },
      },
    });

    if (!listing)
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH - Update a listing (full edit or simple status change)
// ─────────────────────────────────────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { media: true },
  });

  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (listing.profileId !== profile.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body: Incoming = await request.json().catch(() => ({}));

  // Status-only update
  if (body.status !== undefined && Object.keys(body).length === 1) {
    const newStatus = statusOrNull(body.status);
    if (!newStatus) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    const updated = await prisma.listing.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json({ ok: true, status: updated.status });
  }

  const { kind, intent } = mapListingTypeToKindIntent(body.listingType);

  const nextCurrency = currencyOrNull(body.currency) ?? listing.currency;
  const nextPriceType = priceTypeOrNull(body.priceType) ?? listing.priceType;

  const priceCandidate = (() => {
    const raw = s(body.price);
    if (raw) return body.price;
    const rawCharterBase = s(body.charterBasePrice);
    if (rawCharterBase) return body.charterBasePrice;
    return body.price;
  })();

  const data: Prisma.ListingUpdateInput = {
    kind,
    intent,

    title: s(body.title),
    description: s(body.description) || null,

    location: s(body.location) || null,
    country: s(body.country) || null,
    marina: s(body.marina) || null,
    lying: s(body.lying) || null,

    currency: nextCurrency,
    priceType: nextPriceType,
    taxStatus: s(body.taxStatus) || null,
    priceCents: priceCentsFromPriceString(priceCandidate),

    boatCategory: s(body.boatCategory) || null,
    charterType: s(body.charterType) || null,
    vesselCondition: vesselConditionOrNull(body.condition),

    brand: s(body.brand) || null,
    model: s(body.model) || null,
    year: intOrNull(body.year),

    lengthFt: floatOrNull(body.lengthFt),
    lengthM: floatOrNull(body.lengthM),
    beamFt: floatOrNull(body.beamFt),
    beamM: floatOrNull(body.beamM),
    draftFt: floatOrNull(body.draftFt),
    draftM: floatOrNull(body.draftM),
    displacement: s(body.displacement) || null,

    hullMaterial: s(body.hullMaterial) || null,
    hullType: s(body.hullType) || null,
    hullColor: s(body.hullColor) || null,

    engineMake: s(body.engineMake) || null,
    engineModel: s(body.engineModel) || null,
    enginePower: s(body.enginePower) || null,
    engineCount: intOrNull(body.engineCount),
    engineHours: intOrNull(body.engineHours),
    fuelType: s(body.fuelType) || null,
    fuelCapacity: s(body.fuelCapacity) || null,

    cabins: intOrNull(body.cabins),
    berths: intOrNull(body.berths),
    heads: intOrNull(body.heads),

    features: stringArray(body.features) as unknown as Prisma.InputJsonValue,
    electronics: stringArray(body.electronics) as unknown as Prisma.InputJsonValue,
    safetyEquipment: stringArray(body.safetyEquipment) as unknown as Prisma.InputJsonValue,
    customFeatures: s(body.customFeatures) || null,

    charterGuests: intOrNull(body.charterGuests),
    charterCrew: intOrNull(body.charterCrew),
    charterPricePeriod: charterPricePeriodOrNull(body.charterPricePeriod),
    charterAvailableFrom: dateOrNull(body.charterAvailableFrom),
    charterAvailableTo: dateOrNull(body.charterAvailableTo),
    charterIncluded: stringArray(body.charterIncluded) as unknown as Prisma.InputJsonValue,

    serviceCategory: s(body.serviceCategory) || null,
    serviceName: s(body.serviceName) || null,
    serviceDescription: s(body.serviceDescription) || null,
    serviceExperience: s(body.serviceExperience) || null,
    serviceAreas: stringArray(body.serviceAreas) as unknown as Prisma.InputJsonValue,

    partsCategory: s(body.partsCategory) || null,
    partsCondition: partsConditionOrNull(body.partsCondition),
    partsCompatibility: s(body.partsCompatibility) || null,

    sellerType: sellerTypeOrNull(body.sellerType) ?? listing.sellerType,
    sellerName: s(body.sellerName) || null,
    sellerCompany: s(body.sellerCompany) || null,
    sellerEmail: s(body.sellerEmail) || null,
    sellerPhone: s(body.sellerPhone) || null,
    sellerWhatsapp: b(body.sellerWhatsapp),
    sellerLocation: s(body.sellerLocation) || null,
    sellerWebsite: s(body.sellerWebsite) || null,

    featured: b(body.featured),
    urgent: b(body.urgent),
    acceptOffers: body.acceptOffers === undefined ? listing.acceptOffers : b(body.acceptOffers),

    videoUrl: s(body.videoUrl) || null,
    virtualTourUrl: s(body.virtualTourUrl) || null,

    recentWorks: s(body.recentWorks) || null,
  };

  // Media sync (photoUrls is the truth) ✅ filter out blob/data
  const desiredUrls = stringArray(body.photoUrls).filter(
    (url) => url && !isBlobOrDataUrl(url)
  );
  const existingMedia = listing.media;

  const existingByUrl = new Map(existingMedia.map((m) => [m.url, m]));
  const desiredSet = new Set(desiredUrls);

  const toDeleteIds = existingMedia
    .filter((m) => !desiredSet.has(m.url))
    .map((m) => m.id);

  const toCreate = desiredUrls.filter((url) => !existingByUrl.has(url));

  await prisma.$transaction(async (tx) => {
    await tx.listing.update({ where: { id: listing.id }, data });

    if (toDeleteIds.length) {
      await tx.listingMedia.deleteMany({ where: { id: { in: toDeleteIds } } });
    }

    if (toCreate.length) {
      await tx.listingMedia.createMany({
        data: toCreate.map((url) => ({
          listingId: listing.id,
          url,
          sort: desiredUrls.indexOf(url),
        })),
      });
    }

    for (let i = 0; i < desiredUrls.length; i++) {
      const url = desiredUrls[i];
      const existing = existingByUrl.get(url);
      if (existing) {
        await tx.listingMedia.update({
          where: { id: existing.id },
          data: { sort: i },
        });
      }
    }
  });

  const updated = await prisma.listing.findUnique({
    where: { id: listing.id },
    select: { slug: true },
  });

  return NextResponse.json({ ok: true, slug: updated?.slug ?? null });
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE - Delete a listing
// ─────────────────────────────────────────────────────────────────────────────

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { profileId: true },
    });

    if (!listing)
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    if (listing.profileId !== profile.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
  }
}
