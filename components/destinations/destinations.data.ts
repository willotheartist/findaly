export type Destination = {
  slug: string;
  name: string;
  country: string;
  region: string;
  image: string; // path in /public
  vibeTags: string[];
  featured?: boolean;
};

export const DESTINATIONS: Destination[] = [
  {
    slug: "amalfi-coast",
    name: "Amalfi Coast",
    country: "Italy",
    region: "Campania",
    image: "/destinations/Amalfi Coast.png",
    vibeTags: ["Coastal", "Iconic", "Romantic"],
    featured: true,
  },
  {
    slug: "french-riviera",
    name: "French Riviera",
    country: "France",
    region: "Côte d’Azur",
    image: "/destinations/FrenchRiviera.png",
    vibeTags: ["Luxury", "Coastal", "Iconic"],
    featured: true,
  },
  {
    slug: "croatia",
    name: "Croatia",
    country: "Croatia",
    region: "Dalmatian Coast",
    image: "/destinations/Croatia.png",
    vibeTags: ["Islands", "Sailing", "Scenic"],
    featured: true,
  },
  {
    slug: "greece",
    name: "Greece",
    country: "Greece",
    region: "Aegean",
    image: "/destinations/Greece.png",
    vibeTags: ["Islands", "Blue Water", "Summer"],
    featured: true,
  },
  {
    slug: "balearics",
    name: "Balearics",
    country: "Spain",
    region: "Balearic Islands",
    image: "/destinations/Balearics.png",
    vibeTags: ["Islands", "Nightlife", "Summer"],
    featured: true,
  },
  {
    slug: "turkey",
    name: "Turkey",
    country: "Turkey",
    region: "Turquoise Coast",
    image: "/destinations/Turkey.png",
    vibeTags: ["Value", "Coastal", "Culture"],
  },
  {
    slug: "dubai",
    name: "Dubai",
    country: "UAE",
    region: "Dubai",
    image: "/destinations/Dubai.png",
    vibeTags: ["Luxury", "Modern", "Big City"],
  },
  {
    slug: "caribbean",
    name: "Caribbean",
    country: "Caribbean",
    region: "Islands",
    image: "/destinations/Caribbean.png",
    vibeTags: ["Islands", "Warm", "Charter"],
  },
];

export const DESTINATION_STYLES = [
  { key: "coastal", label: "Coastal escapes", emoji: "🌊", hint: "beaches + harbours" },
  { key: "islands", label: "Island hopping", emoji: "🏝️", hint: "anchor + explore" },
  { key: "luxury", label: "Luxury", emoji: "💎", hint: "marinas + glam" },
  { key: "romantic", label: "Romantic", emoji: "❤️", hint: "sunsets + views" },
  { key: "adventure", label: "Adventure", emoji: "🥾", hint: "hikes + coves" },
  { key: "value", label: "Best value", emoji: "💸", hint: "more for less" },
] as const;
