export type ListingType = "sale" | "charter" | "service" | "parts" | null;

export type BoatCategory =
  | "sailboat"
  | "motor-yacht"
  | "catamaran"
  | "rib"
  | "superyacht"
  | "fishing"
  | "dinghy"
  | "jetski"
  | "other";

export type ServiceCategory =
  | "broker"
  | "surveyor"
  | "captain"
  | "crew"
  | "maintenance"
  | "transport"
  | "insurance"
  | "finance"
  | "legal"
  | "other";

export type CharterType = "bareboat" | "crewed" | "day-charter" | "corporate";

export type SellerType = "private" | "professional";

export type FormData = {
  listingType: ListingType;

  boatCategory: BoatCategory | null;
  charterType: CharterType | null;
  serviceCategory: ServiceCategory | null;

  title: string;
  brand: string;
  model: string;
  year: string;
  condition: "new" | "used" | "";

  lengthFt: string;
  lengthM: string;
  beamFt: string;
  beamM: string;
  draftFt: string;
  draftM: string;
  displacement: string;

  hullMaterial: string;
  hullType: string;
  hullColor: string;

  engineMake: string;
  engineModel: string;
  enginePower: string;
  engineCount: string;
  engineHours: string;
  fuelType: string;
  fuelCapacity: string;

  cabins: string;
  berths: string;
  heads: string;

  charterGuests: string;
  charterCrew: string;
  charterBasePrice: string;
  charterPricePeriod: "day" | "week" | "hour";
  charterAvailableFrom: string;
  charterAvailableTo: string;
  charterIncluded: string[];
  charterExtras: { name: string; price: string }[];

  serviceName: string;
  serviceDescription: string;
  serviceAreas: string[];
  serviceExperience: string;
  serviceCertifications: string[];

  partsCategory: string;
  partsCondition: "new" | "used" | "refurbished" | "";
  partsCompatibility: string;

  features: string[];
  electronics: string[];
  safetyEquipment: string[];
  customFeatures: string;

  location: string;
  country: string;
  marina: string;
  lying: "afloat" | "ashore" | "";
  price: string;
  currency: string;
  priceType: "fixed" | "negotiable" | "poa" | "auction";
  taxStatus: string;

  photos: File[];
  photoUrls: string[];
  videoUrl: string;
  virtualTourUrl: string;

  description: string;
  highlights: string[];
  recentWorks: string;

  sellerType: SellerType | null;
  sellerName: string;
  sellerCompany: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerWhatsapp: boolean;
  sellerLocation: string;
  sellerWebsite: string;

  featured: boolean;
  urgent: boolean;
  acceptOffers: boolean;
};

export const initialFormData: FormData = {
  listingType: null,
  boatCategory: null,
  charterType: null,
  serviceCategory: null,

  title: "",
  brand: "",
  model: "",
  year: "",
  condition: "",

  lengthFt: "",
  lengthM: "",
  beamFt: "",
  beamM: "",
  draftFt: "",
  draftM: "",
  displacement: "",

  hullMaterial: "",
  hullType: "",
  hullColor: "",

  engineMake: "",
  engineModel: "",
  enginePower: "",
  engineCount: "1",
  engineHours: "",
  fuelType: "",
  fuelCapacity: "",

  cabins: "",
  berths: "",
  heads: "",

  charterGuests: "",
  charterCrew: "",
  charterBasePrice: "",
  charterPricePeriod: "week",
  charterAvailableFrom: "",
  charterAvailableTo: "",
  charterIncluded: [],
  charterExtras: [],

  serviceName: "",
  serviceDescription: "",
  serviceAreas: [],
  serviceExperience: "",
  serviceCertifications: [],

  partsCategory: "",
  partsCondition: "",
  partsCompatibility: "",

  features: [],
  electronics: [],
  safetyEquipment: [],
  customFeatures: "",

  location: "",
  country: "",
  marina: "",
  lying: "",
  price: "",
  currency: "EUR",
  priceType: "negotiable",
  taxStatus: "",

  photos: [],
  photoUrls: [],
  videoUrl: "",
  virtualTourUrl: "",

  description: "",
  highlights: [],
  recentWorks: "",

  sellerType: null,
  sellerName: "",
  sellerCompany: "",
  sellerEmail: "",
  sellerPhone: "",
  sellerWhatsapp: false,
  sellerLocation: "",
  sellerWebsite: "",

  featured: false,
  urgent: false,
  acceptOffers: true,
};
