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

function nonEmpty(v: unknown) {
  return typeof v === "string" && v.trim().length > 0;
}

function hasAnyContact(sellerEmail: unknown, sellerPhone: unknown) {
  return nonEmpty(sellerEmail) || nonEmpty(sellerPhone);
}

/**
 * Validate listing required fields for publishing (status LIVE).
 * Returns array of "missing keys" used by client modal.
 */
function validateForPublish(effective: {
  kind: "VESSEL" | "PARTS" | "SERVICES";
  intent: "SALE" | "CHARTER";
  title: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  boatCategory: string | null;
  serviceCategory: string | null;
  serviceName: string | null;
  partsCategory: string | null;

  location: string | null;
  country: string | null;

  priceType: PriceType;
  priceCents: number | null;
  charterPricePeriod: CharterPricePeriod | null;

  sellerType: SellerType;
  sellerName: string | null;
  sellerCompany: string | null;
  sellerEmail: string | null;
  sellerPhone: string | null;

  photoCount: number;
  description: string | null;
}): string[] {
  const missing: string[] = [];

  // Common
  if (!effective.kind) missing.push("listingType");

  const hasTitleOrBrandModel =
    nonEmpty(effective.title) || (nonEmpty(effective.brand) && nonEmpty(effective.model));

  // Type-specific requireds
  if (effective.kind === "VESSEL") {
    if (!nonEmpty(effective.boatCategory)) missing.push("boatCategory");
    if (!hasTitleOrBrandModel) missing.push("title");
    if (!effective.year) missing.push("year");
    // For vessel, require description
    if (!nonEmpty(effective.description)) missing.push("description");
  }

  if (effective.kind === "SERVICES") {
    if (!nonEmpty(effective.serviceCategory)) missing.push("serviceCategory");
    if (!nonEmpty(effective.serviceName)) missing.push("serviceName");
    // price optional for services
  }

  if (effective.kind === "PARTS") {
    if (!nonEmpty(effective.partsCategory)) missing.push("partsCategory");
    if (!hasTitleOrBrandModel) missing.push("title");
    // price required unless POA
    if (effective.priceType !== "POA" && !effective.priceCents) missing.push("price");
  }

  // Location
  if (!nonEmpty(effective.location)) missing.push("location");
  if (!nonEmpty(effective.country)) missing.push("country");

  // Photos
  if (!effective.photoCount || effective.photoCount < 1) missing.push("photos");

  // Pricing rules for vessels
  if (effective.kind === "VESSEL") {
    if (effective.priceType !== "POA" && !effective.priceCents) {
      // Charter may come via priceCents too, but if it's not POA, require some price
      missing.push(effective.intent === "CHARTER" ? "charterBasePrice" : "price");
    }
    if (effective.intent === "CHARTER") {
      if (!effective.charterPricePeriod) missing.push("charterPricePeriod");
    }
  }

  // Seller/contact
  if (!effective.sellerType) missing.push("sellerType");
  if (effective.sellerType === "PROFESSIONAL") {
    if (!nonEmpty(effective.sellerCompany)) missing.push("sellerCompany");
  } else {
    if (!nonEmpty(effective.sellerName)) missing.push("sellerName");
  }
  if (!hasAnyContact(effective.sellerEmail, effective.sellerPhone)) missing.push("sellerContact");

  // Dedupe
  return Array.from(new Set(missing));
}

/**
 * Build an "effective" view of the listing after applying PATCH body,
 * without writing to DB first. This lets us block publishing before update.
 */
function effectiveValue<T>(body: Incoming, key: string, fallback: T): T {
  if (Object.prototype.hasOwnProperty.call(body, key)) return body[key] as T;
  return fallback;
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

    // 🔒 Block publishing unless required fields are present
    if (newStatus === "LIVE") {
      const missing = validateForPublish({
        kind: listing.kind as "VESSEL" | "PARTS" | "SERVICES",
        intent: listing.intent as "SALE" | "CHARTER",
        title: listing.title,
        brand: listing.brand,
        model: listing.model,
        year: listing.year,
        boatCategory: listing.boatCategory,
        serviceCategory: listing.serviceCategory,
        serviceName: listing.serviceName,
        partsCategory: listing.partsCategory,
        location: listing.location,
        country: listing.country,
        priceType: listing.priceType,
        priceCents: listing.priceCents,
        charterPricePeriod: listing.charterPricePeriod,
        sellerType: listing.sellerType,
        sellerName: listing.sellerName,
        sellerCompany: listing.sellerCompany,
        sellerEmail: listing.sellerEmail,
        sellerPhone: listing.sellerPhone,
        photoCount: listing.media?.length ?? 0,
        description: listing.description,
      });

      if (missing.length > 0) {
        return NextResponse.json(
          { error: "LISTING_INCOMPLETE", missing },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json({ ok: true, status: updated.status });
  }

  const { kind, intent } = mapListingTypeToKindIntent(body.listingType);

  const nextCurrency = currencyOrNull(body.currency) ?? listing.currency;
  const nextPriceType = priceTypeOrNull(body.priceType) ?? listing.priceType;

  const requestedStatus = body.status !== undefined ? statusOrNull(body.status) : null;

  // If trying to publish as part of the full payload, validate first.
  if (requestedStatus === "LIVE") {
    const hasPhotoUrls = Object.prototype.hasOwnProperty.call(body, "photoUrls");
    const desiredUrls = hasPhotoUrls
      ? stringArray(body.photoUrls).filter((url) => url && !isBlobOrDataUrl(url))
      : [];

    const effectivePhotoCount = hasPhotoUrls ? desiredUrls.length : (listing.media?.length ?? 0);

    const effective = {
      kind,
      intent,

      title: nonEmpty(effectiveValue(body, "title", listing.title)) ? s(effectiveValue(body, "title", listing.title)) : s(effectiveValue(body, "title", listing.title)),
      brand: nonEmpty(effectiveValue(body, "brand", listing.brand ?? "")) ? s(effectiveValue(body, "brand", listing.brand ?? "")) : (listing.brand ?? null),
      model: nonEmpty(effectiveValue(body, "model", listing.model ?? "")) ? s(effectiveValue(body, "model", listing.model ?? "")) : (listing.model ?? null),
      year: intOrNull(effectiveValue(body, "year", listing.year ?? null)) ?? listing.year ?? null,

      boatCategory: s(effectiveValue(body, "boatCategory", listing.boatCategory ?? "")) || listing.boatCategory || null,
      serviceCategory: s(effectiveValue(body, "serviceCategory", listing.serviceCategory ?? "")) || listing.serviceCategory || null,
      serviceName: s(effectiveValue(body, "serviceName", listing.serviceName ?? "")) || listing.serviceName || null,
      partsCategory: s(effectiveValue(body, "partsCategory", listing.partsCategory ?? "")) || listing.partsCategory || null,

      location: s(effectiveValue(body, "location", listing.location ?? "")) || listing.location || null,
      country: s(effectiveValue(body, "country", listing.country ?? "")) || listing.country || null,

      priceType: nextPriceType,
      priceCents: (() => {
        const priceCandidate = (() => {
          const raw = s(body.price);
          if (raw) return body.price;
          const rawCharterBase = s(body.charterBasePrice);
          if (rawCharterBase) return body.charterBasePrice;
          return undefined;
        })();
        const computed = priceCandidate !== undefined ? priceCentsFromPriceString(priceCandidate) : null;
        return computed ?? listing.priceCents ?? null;
      })(),

      charterPricePeriod:
        charterPricePeriodOrNull(effectiveValue(body, "charterPricePeriod", listing.charterPricePeriod ?? null)) ??
        listing.charterPricePeriod ??
        null,

      sellerType: sellerTypeOrNull(effectiveValue(body, "sellerType", listing.sellerType ?? "PRIVATE")) ?? listing.sellerType,
      sellerName: s(effectiveValue(body, "sellerName", listing.sellerName ?? "")) || listing.sellerName || null,
      sellerCompany: s(effectiveValue(body, "sellerCompany", listing.sellerCompany ?? "")) || listing.sellerCompany || null,
      sellerEmail: s(effectiveValue(body, "sellerEmail", listing.sellerEmail ?? "")) || listing.sellerEmail || null,
      sellerPhone: s(effectiveValue(body, "sellerPhone", listing.sellerPhone ?? "")) || listing.sellerPhone || null,

      photoCount: effectivePhotoCount,
      description: s(effectiveValue(body, "description", listing.description ?? "")) || listing.description || null,
    };

    const missing = validateForPublish(effective);
    if (missing.length > 0) {
      return NextResponse.json({ error: "LISTING_INCOMPLETE", missing }, { status: 400 });
    }
  }

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

  // Allow status change in full payload
  if (requestedStatus) {
    data.status = requestedStatus;
  }

  // ✅ CRITICAL FIX:
  // Only sync media if the client explicitly sent photoUrls.
  // Otherwise, do NOT touch existing media (prevents accidental wipe).
  const hasPhotoUrls = Object.prototype.hasOwnProperty.call(body, "photoUrls");

  await prisma.$transaction(async (tx) => {
    await tx.listing.update({ where: { id: listing.id }, data });

    if (hasPhotoUrls) {
      const desiredUrls = stringArray(body.photoUrls).filter((url) => url && !isBlobOrDataUrl(url));

      const existingMedia = await tx.listingMedia.findMany({
        where: { listingId: listing.id },
      });

      const existingByUrl = new Map(existingMedia.map((m) => [m.url, m]));
      const desiredSet = new Set(desiredUrls);

      const toDeleteIds = existingMedia.filter((m) => !desiredSet.has(m.url)).map((m) => m.id);

      if (toDeleteIds.length) {
        await tx.listingMedia.deleteMany({ where: { id: { in: toDeleteIds } } });
      }

      const toCreate: Array<{ url: string; sort: number }> = [];
      for (let i = 0; i < desiredUrls.length; i++) {
        const url = desiredUrls[i];
        if (!existingByUrl.has(url)) toCreate.push({ url, sort: i });
      }

      if (toCreate.length) {
        await tx.listingMedia.createMany({
          data: toCreate.map((x) => ({
            listingId: listing.id,
            url: x.url,
            sort: x.sort,
          })),
        });
      }

      // Re-sort existing ones
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
    }
  });

  const updated = await prisma.listing.findUnique({
    where: { id: listing.id },
    select: { slug: true, status: true },
  });

  return NextResponse.json({ ok: true, slug: updated?.slug ?? null, status: updated?.status ?? null });
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