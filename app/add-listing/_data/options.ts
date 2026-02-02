// app/add-listing/_data/options.ts
import {
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Navigation,
  Package,
  Settings,
  Shield,
  Ship,
  Users,
  Wrench,
} from "lucide-react";

export const LISTING_TYPES = [
  {
    id: "sale" as const,
    title: "Sell a boat",
    description: "List your boat, yacht, or watercraft for sale",
    icon: Ship,
    color: "bg-orange-500",
  },
  {
    id: "charter" as const,
    title: "Charter listing",
    description: "Offer your boat for charter rentals",
    icon: Calendar,
    color: "bg-sky-500",
  },
  {
    id: "service" as const,
    title: "Professional service",
    description: "Advertise your marine services",
    icon: Wrench,
    color: "bg-emerald-500",
  },
  {
    id: "parts" as const,
    title: "Parts & equipment",
    description: "Sell boat parts, gear, or accessories",
    icon: Package,
    color: "bg-violet-500",
  },
];

export const BOAT_CATEGORIES = [
  { id: "sailboat", label: "Sailboat", icon: "⛵️" },
  { id: "motor-yacht", label: "Motor Yacht", icon: "🛥️" },
  { id: "catamaran", label: "Catamaran", icon: "🌊" },
  { id: "rib", label: "RIB / Tender", icon: "🚤" },
  { id: "superyacht", label: "Superyacht", icon: "🧭" },
  { id: "fishing", label: "Fishing Boat", icon: "🎣" },
  { id: "dinghy", label: "Dinghy", icon: "🚣" },
  { id: "jetski", label: "Jet Ski / PWC", icon: "🏄" },
  { id: "other", label: "Other", icon: "⚓️" },
];

export const CHARTER_TYPES = [
  { id: "bareboat", label: "Bareboat", description: "Self-skippered charter" },
  { id: "crewed", label: "Crewed", description: "With captain and/or crew" },
  { id: "day-charter", label: "Day Charter", description: "Daily rentals" },
  { id: "corporate", label: "Corporate", description: "Events & corporate hire" },
];

export const SERVICE_CATEGORIES = [
  { id: "broker", label: "Yacht Broker", icon: Building2 },
  { id: "surveyor", label: "Marine Surveyor", icon: FileText },
  { id: "captain", label: "Captain / Skipper", icon: Navigation },
  { id: "crew", label: "Crew Services", icon: Users },
  { id: "maintenance", label: "Maintenance & Repair", icon: Wrench },
  { id: "transport", label: "Boat Transport", icon: Ship },
  { id: "insurance", label: "Marine Insurance", icon: Shield },
  { id: "finance", label: "Marine Finance", icon: DollarSign },
  { id: "legal", label: "Maritime Legal", icon: FileText },
  { id: "other", label: "Other Services", icon: Settings },
];

export const BRANDS = [
  "Beneteau",
  "Jeanneau",
  "Sunseeker",
  "Princess",
  "Lagoon",
  "Azimut",
  "Ferretti",
  "Bavaria",
  "Dufour",
  "Hanse",
  "Fountaine Pajot",
  "Axopar",
  "Riva",
  "Pershing",
  "Fairline",
  "Sealine",
  "Prestige",
  "Absolute",
  "Leopard",
  "Catana",
  "Nautitech",
  "Excess",
  "Other",
];

export const HULL_MATERIALS = [
  "GRP/Fibreglass",
  "Aluminium",
  "Steel",
  "Wood",
  "Carbon Fibre",
  "Kevlar",
  "Ferrocement",
  "Composite",
  "Other",
];

export const HULL_TYPES = [
  "Monohull",
  "Catamaran",
  "Trimaran",
  "Deep V",
  "Semi-displacement",
  "Planing",
  "Displacement",
  "Other",
];

export const FUEL_TYPES = ["Diesel", "Petrol", "Electric", "Hybrid", "Sail only", "Other"];

export const CURRENCIES = [
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "CHF", symbol: "CHF", label: "Swiss Franc" },
];

export const COUNTRIES = [
  "France",
  "Spain",
  "Italy",
  "Greece",
  "Croatia",
  "Turkey",
  "Monaco",
  "United Kingdom",
  "Netherlands",
  "Germany",
  "Portugal",
  "Malta",
  "Cyprus",
  "Montenegro",
  "United States",
  "Caribbean",
  "Other",
];

export const TAX_STATUSES = ["VAT Paid", "VAT Not Paid", "Tax Paid (non-EU)", "Duty Paid", "Unknown"];

/**
 * Equipment & Features
 * - Onboard equipment, deck hardware, comfort, sails/rigging, etc.
 */
export const FEATURE_OPTIONS = [
  // Comfort / onboard
  "Air conditioning",
  "Heating", // ✅ added
  "Oven", // ✅ added
  "Microwave", // ✅ added
  "Deep freezer", // ✅ added
  "Ice maker",
  "Dishwasher", // ✅ added (was already present; kept)
  "Washer/dryer",
  "TV set", // ✅ added
  "Watermaker",

  // Deck & handling
  "Bow thruster",
  "Stern thruster",
  "Hydraulic swim platform",
  "Electric windlass",
  "Teak cockpit",
  "Teak side decks",
  "Bimini top",
  "Cockpit cover",
  "Deck shower",
  "Gangway", // ✅ added
  "Passerelle",
  "Davits",
  "Crane",
  "Garage for tender",
  "Dinghy with outboard",
  "Underwater lights",
  "Hardtop",
  "Flybridge",

  // Power / utilities
  "Generator",
  "Solar panels",
  "Wind generator",
  "Battery charger", // ✅ added

  // Luxury / other
  "Jacuzzi",
  "Stabilizers",
  "Zero speed stabilizers",
  "Fully-battened mainsail", // ✅ added (sails section, but still “features”)
  "Genoa", // ✅ added
  "Furling genoa", // ✅ added
  "Spinnaker", // ✅ added
];

/**
 * Electronics & Navigation
 * - Helm electronics, comms, audio, cameras, etc.
 */
export const ELECTRONICS_OPTIONS = [
  "Chartplotter",
  "Radar",
  "Autopilot",
  "VHF Radio",
  "AIS",
  "Depth sounder",
  "GPS",
  "SSB Radio",
  "Weather station",
  "Fish finder",
  "Satellite TV",
  "Satellite phone",
  "WiFi booster",
  "Stereo system",
  "Cockpit speakers",
  "Bow camera",
  "Engine room camera",
  "Night vision",
  "Thermal camera",
];

/**
 * Safety Equipment
 * - Safety + pumps, emergency systems, detectors, etc.
 */
export const SAFETY_OPTIONS = [
  "Life jackets",
  "Life raft",
  "EPIRB",
  "Fire extinguishers",
  "Fire suppression system",
  "Flares",
  "First aid kit",
  "CO detector",
  "Smoke detectors",
  "MOB system",
  "AIS MOB",
  "Search light",
  "Horn",
  "Navigation lights",

  // ✅ added (split pumps)
  "Bilge pump (manual)",
  "Bilge pump (electric)",
  // Keep the existing generic one (some users expect it)
  "Bilge pumps (auto)",
];

export const CHARTER_INCLUDED_OPTIONS = [
  "Skipper",
  "Crew",
  "Fuel",
  "Cleaning",
  "Bed linen",
  "Towels",
  "Snorkeling gear",
  "Fishing equipment",
  "Water toys",
  "SUP boards",
  "Kayak",
  "Wakeboard",
  "Jet ski",
  "Tender",
  "WiFi",
  "Port fees",
];
