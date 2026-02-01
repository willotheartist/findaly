export type DestinationPageData = {
  slug: string;
  title: string;
  country: string;
  region: string;
  heroImage: string; // /public path
  subtitle: string; // short editorial descriptor
  vibeTags: string[];

  quickFacts: {
    bestTime: string;
    idealStay: string;
    budget: "€" | "€€" | "€€€";
    vibe: string;
    gettingAround: string;
  };

  // "Where next?" cards (Airbnb-ish)
  links: Array<{
    title: string;
    description: string;
    href: string;
    badge?: string;
    emoji?: string;
  }>;

  // Highlight bullets / feature list
  highlights: Array<{
    title: string;
    description: string;
    emoji?: string;
  }>;

  tips?: string[];
};

export const DESTINATION_PAGES: DestinationPageData[] = [
  {
    slug: "french-riviera",
    title: "French Riviera",
    country: "France",
    region: "Côte d’Azur",
    heroImage: "/destinations/FrenchRiviera.png",
    subtitle: "Glam marinas, blue water, and iconic coastal towns.",
    vibeTags: ["Luxury", "Iconic", "Coastal"],

    quickFacts: {
      bestTime: "May–September (shoulder months are calmer)",
      idealStay: "3–5 days",
      budget: "€€€",
      vibe: "Glam, social, high-end",
      gettingAround: "Train + taxis (or rent a scooter/car)",
    },

    links: [
      {
        title: "Things to do",
        description: "Harbours, viewpoints, beach clubs, day trips.",
        href: "/destinations/french-riviera/things-to-do",
        badge: "Start here",
        emoji: "✨",
      },
      {
        title: "Anchor spots",
        description: "Calm bays + swim stops worth saving.",
        href: "/destinations/french-riviera/things-to-do#anchor-spots",
        emoji: "⚓️",
      },
      {
        title: "Marinas & ports",
        description: "Docking, fuel, provisioning — the essentials.",
        href: "/destinations/french-riviera/things-to-do#marinas",
        emoji: "🛟",
      },
    ],

    highlights: [
      { title: "Iconic coastline", description: "Cannes, Antibes, Monaco — all in one stretch.", emoji: "🌊" },
      { title: "High-end charter scene", description: "Crewed options, premium marinas, big summer energy.", emoji: "💎" },
      { title: "Perfect day trips", description: "Short hops between towns make planning easy.", emoji: "🗺️" },
    ],

    tips: [
      "Book berths early for peak season weekends.",
      "Sunset viewpoints hit different — plan one evening just for that.",
      "If you’re chartering, keep your itinerary flexible for wind/sea conditions.",
    ],
  },

  {
    slug: "balearics",
    title: "Balearics",
    country: "Spain",
    region: "Balearic Islands",
    heroImage: "/destinations/Balearics.png",
    subtitle: "Ibiza energy, Mallorca coves, Menorca calm.",
    vibeTags: ["Islands", "Summer", "Nightlife"],

    quickFacts: {
      bestTime: "June–September (May/October are quieter)",
      idealStay: "4–7 days",
      budget: "€€",
      vibe: "Fun, beachy, social",
      gettingAround: "Scooter/car (or boat hops between bays)",
    },

    links: [
      {
        title: "Things to do",
        description: "Coves, cliff views, markets, iconic beach days.",
        href: "/destinations/balearics/things-to-do",
        badge: "Start here",
        emoji: "🏝️",
      },
      {
        title: "Best coves",
        description: "Swim stops and postcard beaches.",
        href: "/destinations/balearics/things-to-do#coves",
        emoji: "🌊",
      },
      {
        title: "Day itineraries",
        description: "Half-day and full-day routes that actually work.",
        href: "/destinations/balearics/things-to-do#itineraries",
        emoji: "🗺️",
      },
    ],

    highlights: [
      { title: "Cove culture", description: "Short hops between bays = maximum swim time.", emoji: "🌊" },
      { title: "Summer vibe", description: "Easy to do chilled mornings + lively nights.", emoji: "🌅" },
      { title: "Charter-friendly", description: "Great mix of weekly and day-charter options.", emoji: "⛵️" },
    ],
  },

  {
    slug: "amalfi-coast",
    title: "Amalfi Coast",
    country: "Italy",
    region: "Campania",
    heroImage: "/destinations/Amalfi Coast.png",
    subtitle: "Cliffside villages, gelato stops, and sea views for days.",
    vibeTags: ["Romantic", "Iconic", "Coastal"],

    quickFacts: {
      bestTime: "May–June or September (July/August are packed)",
      idealStay: "2–4 days",
      budget: "€€€",
      vibe: "Romantic, scenic, premium",
      gettingAround: "Ferries + taxis (parking is chaos)",
    },

    links: [
      {
        title: "Things to do",
        description: "Views, villages, hikes, boat days.",
        href: "/destinations/amalfi-coast/things-to-do",
        badge: "Start here",
        emoji: "🍋",
      },
      {
        title: "Capri day trip",
        description: "Grottos, swim stops, and the best viewpoints.",
        href: "/destinations/amalfi-coast/things-to-do#capri",
        emoji: "⛵️",
      },
      {
        title: "Viewpoints",
        description: "Spots that make your camera earn its keep.",
        href: "/destinations/amalfi-coast/things-to-do#viewpoints",
        emoji: "📸",
      },
    ],

    highlights: [
      { title: "Postcard scenery", description: "Cliffs, colour, and sea — every angle works.", emoji: "📸" },
      { title: "Boat day heaven", description: "Short distances, dramatic coastline, iconic stops.", emoji: "⛵️" },
      { title: "Romantic energy", description: "Perfect for couples, weekends, and special trips.", emoji: "❤️" },
    ],
  },

  {
    slug: "greece",
    title: "Greece",
    country: "Greece",
    region: "Aegean & Ionian",
    heroImage: "/destinations/Greece.png",
    subtitle: "Island hopping, warm water, and unreal sunsets.",
    vibeTags: ["Islands", "Blue Water", "Summer"],

    quickFacts: {
      bestTime: "June–September (April/May are lovely too)",
      idealStay: "5–10 days",
      budget: "€€",
      vibe: "Chilled, sunny, social",
      gettingAround: "Ferries + scooters; yachts for island hops",
    },

    links: [
      {
        title: "Things to do",
        description: "Island stops, hikes, tavernas, beach days.",
        href: "/destinations/greece/things-to-do",
        badge: "Start here",
        emoji: "🇬🇷",
      },
      {
        title: "Cyclades route",
        description: "A simple itinerary that makes sense.",
        href: "/destinations/greece/things-to-do#cyclades",
        emoji: "🗺️",
      },
      {
        title: "Quiet islands",
        description: "Less crowds, more magic.",
        href: "/destinations/greece/things-to-do#quiet",
        emoji: "🤫",
      },
    ],

    highlights: [
      { title: "Island variety", description: "Party, calm, rugged, luxe — it’s all here.", emoji: "🏝️" },
      { title: "Sailing classic", description: "Routes are well-known and beginner friendly.", emoji: "🧭" },
      { title: "Food + sunsets", description: "Simple pleasures done perfectly.", emoji: "🌅" },
    ],
  },

  {
    slug: "croatia",
    title: "Croatia",
    country: "Croatia",
    region: "Dalmatian Coast",
    heroImage: "/destinations/Croatia.png",
    subtitle: "Clear water, historic towns, and easy sailing days.",
    vibeTags: ["Sailing", "Scenic", "Islands"],

    quickFacts: {
      bestTime: "June–September (late summer is warmest)",
      idealStay: "5–8 days",
      budget: "€€",
      vibe: "Relaxed, scenic, social",
      gettingAround: "Ferries + taxis; scooters on islands",
    },

    links: [
      {
        title: "Things to do",
        description: "Old towns, swim spots, island routes.",
        href: "/destinations/croatia/things-to-do",
        badge: "Start here",
        emoji: "🌊",
      },
      {
        title: "Split & Hvar",
        description: "Classic route, perfect first timer plan.",
        href: "/destinations/croatia/things-to-do#split-hvar",
        emoji: "🧭",
      },
      {
        title: "Hidden bays",
        description: "Peaceful anchorage shortlist.",
        href: "/destinations/croatia/things-to-do#bays",
        emoji: "⚓️",
      },
    ],

    highlights: [
      { title: "Easy routing", description: "Short hops between islands = less stress.", emoji: "🗺️" },
      { title: "Historic towns", description: "Beautiful old streets + harbour dinners.", emoji: "🏛️" },
      { title: "Swim-first days", description: "Clear water and endless bays.", emoji: "🌊" },
    ],
  },

  {
    slug: "caribbean",
    title: "Caribbean",
    country: "Caribbean",
    region: "Islands",
    heroImage: "/destinations/Caribbean.png",
    subtitle: "Warm water, trade winds, and bucket-list anchorages.",
    vibeTags: ["Charter", "Islands", "Warm"],

    quickFacts: {
      bestTime: "December–April (dry season)",
      idealStay: "7–14 days",
      budget: "€€€",
      vibe: "Tropical, laid-back, adventurous",
      gettingAround: "Flights + inter-island hops",
    },

    links: [
      {
        title: "Things to do",
        description: "BVI routes, beach bars, snorkel spots.",
        href: "/destinations/caribbean/things-to-do",
        badge: "Start here",
        emoji: "🏝️",
      },
      {
        title: "BVI itinerary",
        description: "A proven week-long route.",
        href: "/destinations/caribbean/things-to-do#bvi",
        emoji: "🗺️",
      },
      {
        title: "Snorkel spots",
        description: "Where it’s actually worth jumping in.",
        href: "/destinations/caribbean/things-to-do#snorkel",
        emoji: "🤿",
      },
    ],

    highlights: [
      { title: "Tropical charter heaven", description: "Warm sea, steady winds, easy island hops.", emoji: "🌬️" },
      { title: "Swim + snorkel", description: "Every day has a ‘jump in now’ moment.", emoji: "🤿" },
      { title: "Bucket-list energy", description: "The kind of trip you talk about for years.", emoji: "✨" },
    ],
  },

  {
    slug: "dubai",
    title: "Dubai",
    country: "UAE",
    region: "Dubai",
    heroImage: "/destinations/Dubai.png",
    subtitle: "Modern skyline boating with big marina energy.",
    vibeTags: ["Luxury", "Modern", "Big City"],

    quickFacts: {
      bestTime: "November–March (best weather)",
      idealStay: "2–5 days",
      budget: "€€€",
      vibe: "Modern, flashy, high-end",
      gettingAround: "Taxis + metro (easy), marinas by car",
    },

    links: [
      {
        title: "Things to do",
        description: "Marina days, skyline views, desert side quests.",
        href: "/destinations/dubai/things-to-do",
        badge: "Start here",
        emoji: "🌆",
      },
      {
        title: "Best viewpoints",
        description: "Skyline angles and sunset spots.",
        href: "/destinations/dubai/things-to-do#viewpoints",
        emoji: "📸",
      },
      {
        title: "Marinas",
        description: "Where to dock, fuel, and meet crews.",
        href: "/destinations/dubai/things-to-do#marinas",
        emoji: "🛟",
      },
    ],

    highlights: [
      { title: "Skyline boating", description: "Few places look this futuristic from the water.", emoji: "🌆" },
      { title: "Winter-perfect", description: "Best season aligns with peak yachting weather.", emoji: "☀️" },
      { title: "High-end scene", description: "Premium marinas, crewed charters, big days out.", emoji: "💎" },
    ],
  },

  {
    slug: "turkey",
    title: "Turkey",
    country: "Turkey",
    region: "Turquoise Coast",
    heroImage: "/destinations/Turkey.png",
    subtitle: "Bodrum to Göcek — bays, ruins, and great value.",
    vibeTags: ["Value", "Coastal", "Culture"],

    quickFacts: {
      bestTime: "May–October (June/September are sweet spots)",
      idealStay: "5–10 days",
      budget: "€€",
      vibe: "Relaxed, cultural, scenic",
      gettingAround: "Taxis + boat hops; coastal driving is beautiful",
    },

    links: [
      {
        title: "Things to do",
        description: "Bays, markets, ruins, beach days.",
        href: "/destinations/turkey/things-to-do",
        badge: "Start here",
        emoji: "🧿",
      },
      {
        title: "Bodrum guide",
        description: "The iconic start point.",
        href: "/destinations/turkey/things-to-do#bodrum",
        emoji: "🧭",
      },
      {
        title: "Göcek bays",
        description: "Calm water and easy anchor days.",
        href: "/destinations/turkey/things-to-do#gocek",
        emoji: "⚓️",
      },
    ],

    highlights: [
      { title: "Amazing value", description: "Big itinerary potential without Riviera pricing.", emoji: "💸" },
      { title: "Culture built-in", description: "Markets, food, ruins, and coastline all together.", emoji: "🏛️" },
      { title: "Bay hopping", description: "Relaxed days with lots of swim stops.", emoji: "🌊" },
    ],
  },
];

export function getDestinationBySlug(slug: string): DestinationPageData | null {
  return DESTINATION_PAGES.find((d) => d.slug === slug) ?? null;
}
