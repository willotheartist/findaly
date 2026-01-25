// app/my-listings/[id]/edit/page.tsx
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentProfile } from "@/lib/auth/profile";
import EditListingClient from "./EditListingClient";
import type {
  BoatCategory,
  CharterType,
  FormData,
  ListingType,
  ServiceCategory,
} from "@/app/add-listing/_types/listing";

function mapKindIntentToListingType(
  kind: string,
  intent: string
): Exclude<ListingType, null> {
  if (kind === "PARTS") return "parts";
  if (kind === "SERVICES") return "service";
  return intent === "CHARTER" ? "charter" : "sale";
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function numToStr(v: unknown): string {
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return "";
}

function jsonArr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function toDateInput(d: Date | null | undefined): string {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

type PageProps = {
  // Next 16 can pass params as a Promise in RSC. Awaiting handles both cases.
  params: { id: string } | Promise<{ id: string }>;
};

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params;

  const profile = await getCurrentProfile();
  if (!profile) {
    redirect(`/login?redirect=${encodeURIComponent(`/my-listings/${id}/edit`)}`);
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { media: { orderBy: { sort: "asc" } } },
  });

  if (!listing) return notFound();
  if (listing.profileId !== profile.id) return notFound();

  const initial: Partial<FormData> = {
    listingType: mapKindIntentToListingType(listing.kind, listing.intent),

    boatCategory: (listing.boatCategory as BoatCategory | null) ?? null,
    charterType: (listing.charterType as CharterType | null) ?? null,
    serviceCategory: (listing.serviceCategory as ServiceCategory | null) ?? null,

    title: str(listing.title),
    brand: str(listing.brand),
    model: str(listing.model),
    year: listing.year ? String(listing.year) : "",
    condition:
      listing.vesselCondition === "NEW"
        ? "new"
        : listing.vesselCondition === "USED"
        ? "used"
        : "",

    lengthFt: numToStr(listing.lengthFt),
    lengthM: numToStr(listing.lengthM),
    beamFt: numToStr(listing.beamFt),
    beamM: numToStr(listing.beamM),
    draftFt: numToStr(listing.draftFt),
    draftM: numToStr(listing.draftM),
    displacement: str(listing.displacement),

    hullMaterial: str(listing.hullMaterial),
    hullType: str(listing.hullType),
    hullColor: str(listing.hullColor),

    engineMake: str(listing.engineMake),
    engineModel: str(listing.engineModel),
    enginePower: str(listing.enginePower),
    engineCount: listing.engineCount ? String(listing.engineCount) : "1",
    engineHours: listing.engineHours != null ? String(listing.engineHours) : "",
    fuelType: str(listing.fuelType),
    fuelCapacity: str(listing.fuelCapacity),

    cabins: listing.cabins != null ? String(listing.cabins) : "",
    berths: listing.berths != null ? String(listing.berths) : "",
    heads: listing.heads != null ? String(listing.heads) : "",

    charterGuests: listing.charterGuests != null ? String(listing.charterGuests) : "",
    charterCrew: listing.charterCrew != null ? String(listing.charterCrew) : "",
    charterBasePrice: listing.priceCents != null ? String(listing.priceCents / 100) : "",
    charterPricePeriod:
      listing.charterPricePeriod === "DAY"
        ? "day"
        : listing.charterPricePeriod === "HOUR"
        ? "hour"
        : "week",
    charterAvailableFrom: toDateInput(listing.charterAvailableFrom),
    charterAvailableTo: toDateInput(listing.charterAvailableTo),
    charterIncluded: jsonArr(listing.charterIncluded),
    charterExtras: [],

    serviceName: str(listing.serviceName),
    serviceDescription: str(listing.serviceDescription),
    serviceAreas: jsonArr(listing.serviceAreas),
    serviceExperience: str(listing.serviceExperience),
    serviceCertifications: [],

    partsCategory: str(listing.partsCategory),
    partsCondition:
      listing.partsCondition === "NEW"
        ? "new"
        : listing.partsCondition === "USED"
        ? "used"
        : listing.partsCondition === "REFURBISHED"
        ? "refurbished"
        : "",
    partsCompatibility: str(listing.partsCompatibility),

    features: jsonArr(listing.features),
    electronics: jsonArr(listing.electronics),
    safetyEquipment: jsonArr(listing.safetyEquipment),
    customFeatures: str(listing.customFeatures),

    location: str(listing.location),
    country: str(listing.country),
    marina: str(listing.marina),
    lying: listing.lying === "afloat" || listing.lying === "ashore" ? listing.lying : "",
    price: listing.priceCents != null ? String(listing.priceCents / 100) : "",
    currency: listing.currency ?? "EUR",
    priceType:
      listing.priceType === "FIXED"
        ? "fixed"
        : listing.priceType === "NEGOTIABLE"
        ? "negotiable"
        : listing.priceType === "POA"
        ? "poa"
        : listing.priceType === "AUCTION"
        ? "auction"
        : "negotiable",
    taxStatus: str(listing.taxStatus),

    photoUrls: listing.media.map((m) => m.url),
    photos: [],

    videoUrl: str(listing.videoUrl),
    virtualTourUrl: str(listing.virtualTourUrl),

    description: str(listing.description),
    highlights: [],
    recentWorks: str(listing.recentWorks),

    sellerType: listing.sellerType === "PROFESSIONAL" ? "professional" : "private",
    sellerName: str(listing.sellerName),
    sellerCompany: str(listing.sellerCompany),
    sellerEmail: str(listing.sellerEmail),
    sellerPhone: str(listing.sellerPhone),
    sellerWhatsapp: !!listing.sellerWhatsapp,
    sellerLocation: str(listing.sellerLocation),
    sellerWebsite: str(listing.sellerWebsite),

    featured: !!listing.featured,
    urgent: !!listing.urgent,
    acceptOffers: !!listing.acceptOffers,
  };

  return <EditListingClient listingId={listing.id} initial={initial} />;
}
