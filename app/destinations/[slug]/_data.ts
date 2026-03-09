export type DestinationPageData = {
  slug: string;
  title: string;
  country: string;
  region: string;
  heroImage: string;
  subtitle: string;
  vibeTags: string[];

  quickFacts: {
    bestTime: string;
    idealStay: string;
    budget: "€" | "€€" | "€€€";
    vibe: string;
    gettingAround: string;
  };

  overview: string;
  whyItWorks: string;
  signatureExperiences: string[];
  bestFor: string[];
  localTips: string[];

  links: Array<{
    title: string;
    description: string;
    href: string;
    badge?: string;
    emoji?: string;
  }>;

  internalLinks: Array<{
    title: string;
    description: string;
    href: string;
  }>;

  localResources: Array<{
    title: string;
    description: string;
    href: string;
    type: "Official" | "Guide" | "Travel";
  }>;

  highlights: Array<{
    title: string;
    description: string;
    emoji?: string;
  }>;

  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

function makeInternalLinks(): DestinationPageData["internalLinks"] {
  return [
    {
      title: "Browse yachts for charter",
      description: "Move from destination research into live charter discovery.",
      href: "/charter",
    },
    {
      title: "Read the charter guide",
      description:
        "Useful if you are comparing crewed, skippered, or bareboat options.",
      href: "/guides/charter-guide",
    },
    {
      title: "Explore marine services",
      description:
        "Finance, insurance, surveyors and supporting services in one place.",
      href: "/services",
    },
  ];
}

function makeFaqs(title: string, region: string): DestinationPageData["faqs"] {
  return [
    {
      question: `Is ${title} good for a yacht trip?`,
      answer: `${title} works well if you want a destination with a strong visual identity, practical access to the water, and enough nearby coastal interest to make the boating side feel worthwhile.`,
    },
    {
      question: `When is the best time to visit ${title} by boat?`,
      answer: `The best time depends on the wider ${region} season, but late spring through early autumn is often the strongest period, with shoulder months usually offering better balance between weather and crowd levels.`,
    },
    {
      question: `What kind of yacht experience suits ${title} best?`,
      answer: `${title} is usually strongest when planned around the natural pace of the coastline — whether that means a polished day charter, a slower multi-stop route, or using the boat as the easiest way to access the best parts of the area.`,
    },
  ];
}

function makeLinks(
  slug: string,
  thingsDesc: string,
  routesDesc: string,
  marinasDesc: string,
  emoji = "✨"
): DestinationPageData["links"] {
  return [
    {
      title: "Things to do",
      description: thingsDesc,
      href: `/destinations/${slug}/things-to-do`,
      badge: "Start here",
      emoji,
    },
    {
      title: "Route ideas",
      description: routesDesc,
      href: `/destinations/${slug}/things-to-do#itineraries`,
      emoji: "🗺️",
    },
    {
      title: "Marinas & anchor spots",
      description: marinasDesc,
      href: `/destinations/${slug}/things-to-do#marinas`,
      emoji: "⚓️",
    },
  ];
}

function destination(
  data: DestinationPageData
): DestinationPageData {
  return data;
}

export const DESTINATION_PAGES: DestinationPageData[] = [
  destination({
    slug: "french-riviera",
    title: "French Riviera",
    country: "France",
    region: "Côte d’Azur",
    heroImage: "/destinations/FrenchRiviera.png",
    subtitle: "Glam marinas, blue water, and iconic coastal towns.",
    vibeTags: ["Luxury", "Iconic", "Coastal"],
    quickFacts: {
      bestTime:
        "May–September, with shoulder months calmer and easier for berths",
      idealStay: "3–5 days",
      budget: "€€€",
      vibe: "Glam, social, high-end",
      gettingAround: "Train + taxis inland, tender or day hops by boat",
    },
    overview:
      "The French Riviera is one of the most recognisable boating and yachting destinations in the world. Between Cannes, Antibes, Nice, Saint-Jean-Cap-Ferrat and Monaco, it compresses marinas, beach clubs, polished towns and cinematic coastal scenery into one tight cruising zone.",
    whyItWorks:
      "It works brilliantly for travellers who want premium marinas, short glamorous route legs, strong hospitality and a destination that feels alive both on land and from the water.",
    signatureExperiences: [
      "A golden-hour run past Cap d’Antibes and Cap Ferrat",
      "Lunch ashore in one harbour, sunset drinks in another",
      "Short charter-friendly day routes between famous Riviera towns",
      "Mixing beach clubs, old towns, viewpoints and marina life in one trip",
    ],
    bestFor: [
      "Luxury charters",
      "First-time Mediterranean charter clients",
      "Day charters from a recognisable base",
      "High-end summer escapes",
    ],
    localTips: [
      "Book marina berths early for peak weekends and major summer events.",
      "Use shoulder season if you want the Riviera feel without the sharpest crowds.",
      "Keep one afternoon flexible for weather, traffic and berth timing.",
    ],
    links: makeLinks(
      "french-riviera",
      "Harbours, viewpoints, beach clubs and day trips.",
      "Short coastal hops and standout Riviera moments.",
      "Docking, provisioning and practical Riviera bases."
    ),
    internalLinks: [
      {
        title: "Browse yachts for charter",
        description: "Move from destination research into live charter discovery.",
        href: "/charter",
      },
      {
        title: "Read the charter guide",
        description:
          "Useful if you're comparing crewed, skippered, or bareboat options.",
        href: "/guides/charter-guide",
      },
      {
        title: "Explore yacht finance",
        description: "Relevant if this trip is part of a wider ownership journey.",
        href: "/services/yacht-finance",
      },
    ],
    localResources: [
      {
        title: "Côte d’Azur official tourism site",
        description: "Official destination information and planning inspiration.",
        href: "https://cotedazurfrance.fr/en/home/",
        type: "Official",
      },
      {
        title: "Things to do on the Côte d’Azur",
        description: "Official tourism ideas spanning culture, nature and activities.",
        href: "https://cotedazurfrance.fr/en/to-do/",
        type: "Guide",
      },
      {
        title: "Natural sites on the French Riviera",
        description: "Useful for route planning beyond the glossier marina circuit.",
        href: "https://cotedazurfrance.fr/en/discover/the-most-beautiful-natural-sites/",
        type: "Guide",
      },
    ],
    highlights: [
      {
        title: "Iconic coastline",
        description:
          "Cannes, Antibes, Nice and Monaco create instant-name-recognition value.",
        emoji: "🌊",
      },
      {
        title: "Premium charter scene",
        description:
          "A strong market for polished day charters, week charters and crewed experiences.",
        emoji: "💎",
      },
      {
        title: "Simple day-route logic",
        description:
          "Short, photogenic coastal hops make planning easy for clients and crews.",
        emoji: "🗺️",
      },
    ],
    faqs: [
      {
        question: "Is the French Riviera good for a first yacht charter?",
        answer:
          "Yes. It is one of the easiest premium Mediterranean destinations to understand because the coastline is famous, route legs are manageable and support infrastructure is strong.",
      },
      {
        question: "When is the best time to visit the French Riviera by boat?",
        answer:
          "Late spring through early autumn works well, but May, June and September are often the sweet spot for weather, atmosphere and slightly less pressure on marinas.",
      },
      {
        question:
          "What makes the French Riviera different from Greece or Croatia?",
        answer:
          "It is generally more polished, more luxury-oriented and more about iconic names, beach clubs and premium marina culture than low-key island-hopping.",
      },
    ],
  }),

  destination({
    slug: "balearics",
    title: "Balearics",
    country: "Spain",
    region: "Balearic Islands",
    heroImage: "/destinations/Balearics.png",
    subtitle: "Ibiza energy, Mallorca coves, Menorca calm.",
    vibeTags: ["Islands", "Summer", "Nightlife"],
    quickFacts: {
      bestTime: "May–October, with June and September especially strong",
      idealStay: "4–7 days",
      budget: "€€",
      vibe: "Fun, beachy, social",
      gettingAround: "Boat hops between bays, plus car or scooter ashore",
    },
    overview:
      "The Balearics are one of the cleanest answers to the question: where should I go for a Mediterranean yacht trip? Mallorca, Menorca, Ibiza and Formentera each bring a different rhythm, which makes the islands ideal for both short stylish escapes and longer route-based charters.",
    whyItWorks:
      "It works because the destination can flex. You can do nightlife and scene, or quiet coves and slower days, or a balanced mix of both.",
    signatureExperiences: [
      "A cove-hopping day with easy swim stops and beach lunches",
      "Combining Ibiza energy with Formentera calm",
      "Using Mallorca as a stronger all-round planning base",
      "Leaning into Menorca for a softer, quieter island feel",
    ],
    bestFor: [
      "Summer yacht holidays",
      "Friends trips",
      "Day charters and weekend extensions",
      "Island-hopping with mixed moods",
    ],
    localTips: [
      "Do not treat all four islands as interchangeable; the mood changes a lot.",
      "May, June and September often feel better value than peak midsummer.",
      "Plan around wind, not just beach photos, if you want calmer anchor stops.",
    ],
    links: makeLinks(
      "balearics",
      "Coves, cliff views, markets and iconic beach days.",
      "Half-day and full-day routes that actually work.",
      "Useful practical bases and calmer swim-led stops.",
      "🏝️"
    ),
    internalLinks: [
      {
        title: "Search charter boats",
        description: "See boats and operators suited to a Balearics trip.",
        href: "/charter",
      },
      {
        title: "Compare buying vs chartering",
        description:
          "Useful if this destination has you thinking bigger long term.",
        href: "/buy",
      },
      {
        title: "Read marine insurance options",
        description:
          "Helpful if you're comparing ownership or longer trips.",
        href: "/services/marine-insurance",
      },
    ],
    localResources: [
      {
        title: "Official Balearic Islands tourism site",
        description:
          "The main planning resource for Mallorca, Menorca, Ibiza and Formentera.",
        href: "https://www.illesbalears.travel/en",
        type: "Official",
      },
      {
        title: "Balearic tourist offices",
        description: "Useful practical resource for local visitor information.",
        href: "https://www.illesbalears.travel/en/illes-balears/useful-information-tourist-offices",
        type: "Travel",
      },
      {
        title: "Mallorca guide",
        description: "A good starting point if Mallorca is your core base.",
        href: "https://www.illesbalears.travel/en/mallorca",
        type: "Guide",
      },
    ],
    highlights: [
      {
        title: "Cove culture",
        description:
          "The islands are built for short hops, blue water and swim-led days.",
        emoji: "🌊",
      },
      {
        title: "Mood variety",
        description:
          "You can combine nightlife, calm, family-friendly and scenic days in one destination cluster.",
        emoji: "🌅",
      },
      {
        title: "Charter-friendly",
        description:
          "A very natural fit for week charters, weekend charters and day experiences.",
        emoji: "⛵️",
      },
    ],
    faqs: [
      {
        question: "Which Balearic island is best for a yacht holiday?",
        answer:
          "It depends on the mood. Ibiza and Formentera suit more social or scene-led trips, Mallorca is the strongest all-rounder, and Menorca is often the calmer pick.",
      },
      {
        question: "Are the Balearics good for day charters?",
        answer:
          "Yes. The bay and cove structure makes them especially strong for day trips and shorter coastal runs.",
      },
      {
        question: "When should I avoid the Balearics?",
        answer:
          "Peak midsummer can be crowded and more expensive, especially in the most in-demand areas.",
      },
    ],
  }),

  destination({
    slug: "amalfi-coast",
    title: "Amalfi Coast",
    country: "Italy",
    region: "Campania",
    heroImage: "/destinations/Amalfi Coast.png",
    subtitle:
      "Cliffside villages, sea-view lunches, and one of Europe’s great coastal backdrops.",
    vibeTags: ["Romantic", "Iconic", "Scenic"],
    quickFacts: {
      bestTime:
        "May–June or September, when weather is strong and summer pressure is softer",
      idealStay: "2–4 days",
      budget: "€€€",
      vibe: "Romantic, scenic, premium",
      gettingAround: "Boat, ferries and taxis; road traffic can be slow in peak season",
    },
    overview:
      "The Amalfi Coast is a high-impact destination. It is less about big-distance cruising and more about dramatic scenery, iconic towns, polished hospitality and strong day-trip logic from the water.",
    whyItWorks:
      "It works for people who care about beauty per mile. Even short boat time feels visually rich here, which is why it performs so well for couples, milestone trips and premium Mediterranean itineraries.",
    signatureExperiences: [
      "Coastal cruising with cliffside villages stacked above the sea",
      "Linking Positano, Amalfi and Capri in one tight itinerary",
      "Using the boat to reduce road fatigue and access better viewpoints",
      "Turning lunch stops and swim breaks into the whole point of the day",
    ],
    bestFor: [
      "Romantic yacht escapes",
      "Luxury day charters",
      "Honeymoons and celebration trips",
      "Clients who want maximum scenery in minimal time",
    ],
    localTips: [
      "Avoid overstuffing the itinerary; the coast rewards slower pacing.",
      "Treat Capri as a strategic add-on, not an afterthought.",
      "Peak summer is beautiful but logistically heavier than shoulder months.",
    ],
    links: makeLinks(
      "amalfi-coast",
      "Villages, viewpoints, hikes, boat days and classic stops.",
      "Standout stops, scenic legs and polished day-trip logic.",
      "Practical bases, calmer moments and useful coastal stops.",
      "🍋"
    ),
    internalLinks: [
      {
        title: "Find charter inspiration",
        description:
          "See how this destination fits broader yacht charter discovery.",
        href: "/charter",
      },
      {
        title: "Read the buying-a-yacht guide",
        description:
          "Useful for visitors turning from chartering into ownership research.",
        href: "/guides/buying-a-yacht",
      },
      {
        title: "Explore yacht surveyors",
        description:
          "Relevant if you're moving from destination dreams into purchase due diligence.",
        href: "/services/yacht-surveyors",
      },
    ],
    localResources: [
      {
        title: "Official Amalfi Coast page",
        description: "Italy’s official destination page for the Amalfi Coast.",
        href: "https://www.italia.it/en/campania/costiera-amalfitana",
        type: "Official",
      },
      {
        title: "What to see on the Amalfi Coast",
        description: "Official planning resource for key places and experiences.",
        href: "https://www.italia.it/en/campania/things-to-do/the-amalfi-coast",
        type: "Guide",
      },
      {
        title: "Positano on Italia.it",
        description: "Useful for one of the coast’s most searched places.",
        href: "https://www.italia.it/en/campania/salerno/positano",
        type: "Guide",
      },
    ],
    highlights: [
      {
        title: "Postcard scenery",
        description:
          "Very few destinations can match the density of beautiful visual moments on this stretch of coast.",
        emoji: "📸",
      },
      {
        title: "Boat-day heaven",
        description:
          "The boat makes the destination feel easier, cleaner and more elevated.",
        emoji: "⛵️",
      },
      {
        title: "Premium romance factor",
        description:
          "An especially strong fit for couples and milestone travel.",
        emoji: "❤️",
      },
    ],
    faqs: [
      {
        question: "Is the Amalfi Coast better by boat?",
        answer:
          "For many people, yes. It reduces some of the friction of road travel and lets the coastline do what it does best: look spectacular from the water.",
      },
      {
        question: "How many days do you need on the Amalfi Coast?",
        answer:
          "A focused 2–4 day trip can work very well if planned carefully, especially if you are using the boat to connect key places efficiently.",
      },
      {
        question: "Is Amalfi Coast good for island-hopping?",
        answer:
          "Not in the same way as Greece or Croatia. It is more about high-impact coastal cruising and selective extensions like Capri.",
      },
    ],
  }),

  destination({
    slug: "greece",
    title: "Greece",
    country: "Greece",
    region: "Aegean & Ionian",
    heroImage: "/destinations/Greece.png",
    subtitle:
      "Island hopping, warm water, long lunches, and sunset-led routes.",
    vibeTags: ["Islands", "Blue Water", "Summer"],
    quickFacts: {
      bestTime: "June–September, with May and early autumn also excellent",
      idealStay: "5–10 days",
      budget: "€€",
      vibe: "Chilled, sunny, social",
      gettingAround: "Ferries, scooters, and yachts for proper island-hopping",
    },
    overview:
      "Greece is one of the classic answers for a Mediterranean sailing or yachting trip. The appeal is not just the islands themselves, but the rhythm between them: tavernas, harbours, swim stops, small routes and warm evenings that make a whole itinerary feel naturally easy.",
    whyItWorks:
      "It works because it offers scale and variety. You can go iconic or quiet, Cyclades or Ionian, social or slower, all inside a destination family people already understand.",
    signatureExperiences: [
      "Following an island-hopping route that actually feels fluid",
      "Mixing beach days, village walks and taverna nights",
      "Building a trip around warm water and late sunsets rather than rigid schedules",
      "Choosing between big-name islands and more peaceful alternatives",
    ],
    bestFor: [
      "Classic summer sailing trips",
      "Island-hopping holidays",
      "Mixed-age friend and family groups",
      "People who want a flexible Mediterranean classic",
    ],
    localTips: [
      "Pick a region first, not just 'Greece' as a whole.",
      "Do fewer islands better rather than chasing too many names.",
      "Wind patterns matter more here than many first-timers expect.",
    ],
    links: makeLinks(
      "greece",
      "Island stops, beaches, tavernas and classic route ideas.",
      "A simple route layer that makes early planning easier.",
      "Practical bases and calmer stopovers across island groups.",
      "🇬🇷"
    ),
    internalLinks: [
      {
        title: "Browse yacht charter options",
        description: "A natural next click from destination planning.",
        href: "/charter",
      },
      {
        title: "Read yacht types explained",
        description:
          "Helpful when choosing between sailing yacht, catamaran, or motor yacht.",
        href: "/guides/yacht-types-explained",
      },
      {
        title: "Explore marine lawyers",
        description:
          "Useful for people moving from charter into transaction territory.",
        href: "/services/marine-lawyers",
      },
    ],
    localResources: [
      {
        title: "Visit Greece official site",
        description: "The official Greek tourism planning hub.",
        href: "https://www.visitgreece.gr/",
        type: "Official",
      },
      {
        title: "Greek islands overview",
        description:
          "Useful when narrowing from Greece into an island family.",
        href: "https://www.visitgreece.gr/islands/",
        type: "Guide",
      },
      {
        title: "Travel tips for Greece",
        description:
          "Practical visitor information from the official tourism board.",
        href: "https://www.visitgreece.gr/before-travelling-to-greece/travel-tips/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Huge island variety",
        description:
          "Party, calm, family-friendly, rugged and premium versions all exist within the same national destination.",
        emoji: "🏝️",
      },
      {
        title: "Sailing classic",
        description:
          "The destination is deeply associated with multi-stop summer routes.",
        emoji: "🧭",
      },
      {
        title: "Simple pleasures done well",
        description:
          "Food, sunsets, water and villages carry the trip without much forcing.",
        emoji: "🌅",
      },
    ],
    faqs: [
      {
        question: "Is Greece good for first-time island-hopping?",
        answer:
          "Yes, provided you choose the right region and do not try to overbuild the route. It is one of the most natural island-hopping destinations in Europe.",
      },
      {
        question: "What is the best Greek region for a yacht trip?",
        answer:
          "That depends on the mood and boat style. The key is to choose a region first rather than mixing distant islands into one unrealistic itinerary.",
      },
      {
        question: "Is Greece better than Croatia for sailing?",
        answer:
          "They are both strong. Greece usually leans more into island identity and big-name Mediterranean atmosphere, while Croatia often feels more compact and route-efficient.",
      },
    ],
  }),

  destination({
    slug: "croatia",
    title: "Croatia",
    country: "Croatia",
    region: "Dalmatian Coast",
    heroImage: "/destinations/Croatia.png",
    subtitle: "Clear water, old towns, easy routing, and proper island rhythm.",
    vibeTags: ["Sailing", "Scenic", "Islands"],
    quickFacts: {
      bestTime:
        "June–September, especially late spring through early autumn",
      idealStay: "5–8 days",
      budget: "€€",
      vibe: "Relaxed, scenic, social",
      gettingAround: "Boat, ferries, short transfers and scooters on islands",
    },
    overview:
      "Croatia is one of the cleanest sailing and yachting destinations in Europe because the route logic is so intuitive. Historic harbour towns, many islands, clear water and manageable legs create a destination that works well for both first-timers and repeat charter clients.",
    whyItWorks:
      "It works because it is easy to understand on paper and easy to enjoy in practice. The coastline gives you enough movement to feel adventurous without every day becoming a logistical puzzle.",
    signatureExperiences: [
      "Stringing together short island hops without losing the day to transit",
      "Arriving into old towns by water rather than by road",
      "Building swim-first days around calm bays and lunch stops",
      "Using Split, Hvar and the wider Dalmatian coastline as a clear route frame",
    ],
    bestFor: [
      "First-time sailing holidays",
      "Social group trips",
      "Week-long summer charters",
      "Mediterranean routes with easy structure",
    ],
    localTips: [
      "Keep distances sensible; Croatia rewards compact routes.",
      "Historic towns deserve evening time, not just daytime stopovers.",
      "The clearest itineraries are often better than the longest itineraries.",
    ],
    links: makeLinks(
      "croatia",
      "Old towns, swim spots and island route ideas.",
      "Classic planning logic for first routes.",
      "Practical bases and calmer anchor-friendly stops.",
      "🌊"
    ),
    internalLinks: [
      {
        title: "Browse charter inventory",
        description: "Turn destination intent into live charter browsing.",
        href: "/charter",
      },
      {
        title: "Read motor yacht guide",
        description:
          "Useful if you're comparing pace, comfort and route style.",
        href: "/guides/motor-yacht-buying-guide",
      },
      {
        title: "Explore marine insurance",
        description: "A strong support page for ownership-minded traffic.",
        href: "/services/marine-insurance",
      },
    ],
    localResources: [
      {
        title: "Croatia official tourism site",
        description: "The national tourism portal for planning and inspiration.",
        href: "https://croatia.hr/en-gb",
        type: "Official",
      },
      {
        title: "Croatia nautical tourism",
        description:
          "Official sailing and charter-focused destination overview.",
        href: "https://croatia.hr/en-gb/nautical",
        type: "Guide",
      },
      {
        title: "Croatian islands overview",
        description:
          "A useful resource for understanding the island landscape.",
        href: "https://croatia.hr/en-gb/islands",
        type: "Guide",
      },
    ],
    highlights: [
      {
        title: "Easy routing",
        description:
          "Shorter legs make the destination forgiving and efficient.",
        emoji: "🗺️",
      },
      {
        title: "Historic harbour towns",
        description:
          "Old stone towns and waterfront dinners add land value to the trip.",
        emoji: "🏛️",
      },
      {
        title: "Clear-water appeal",
        description:
          "The swimming side of the destination is a major part of the product.",
        emoji: "🌊",
      },
    ],
    faqs: [
      {
        question: "Why is Croatia so popular for yacht charters?",
        answer:
          "Because it combines clear route logic, plenty of islands, strong scenery and good infrastructure in a way that feels accessible.",
      },
      {
        question: "Is Croatia good for first-time charter clients?",
        answer:
          "Yes. It is one of the most approachable European destinations for learning what kind of yachting trip you actually enjoy.",
      },
      {
        question: "How long should a Croatia yacht trip be?",
        answer:
          "A well-planned 5–8 day trip is often ideal because it gives enough movement without forcing rushed route decisions.",
      },
    ],
  }),

  destination({
    slug: "caribbean",
    title: "Caribbean",
    country: "Caribbean",
    region: "British Virgin Islands & beyond",
    heroImage: "/destinations/Caribbean.png",
    subtitle: "Warm water, trade winds, and bucket-list anchorages.",
    vibeTags: ["Charter", "Islands", "Warm"],
    quickFacts: {
      bestTime: "December–April for classic dry-season demand",
      idealStay: "7–14 days",
      budget: "€€€",
      vibe: "Tropical, laid-back, adventurous",
      gettingAround: "Flights into the region, then inter-island or charter movement",
    },
    overview:
      "The Caribbean is a broad label, but for yacht and charter planning the British Virgin Islands often function as the most useful shorthand. Warm water, anchor-led itineraries, easy island movement and proper tropical energy make it one of the world’s classic charter regions.",
    whyItWorks:
      "It works because the weather, water and island layout produce a destination that feels immediately rewarding. It is less about urban or cultural density and more about movement, anchoring, swimming, and living outside.",
    signatureExperiences: [
      "A week-long island-hopping route with proper tropical payoff",
      "Trade-wind sailing with swim and snorkel stops baked into the itinerary",
      "Dropping anchor in bays that feel built for charter brochures",
      "Using the BVI as a classic first Caribbean frame",
    ],
    bestFor: [
      "Winter sun yacht trips",
      "Bucket-list charter weeks",
      "Warm-water sailing",
      "Island-led itineraries with strong leisure focus",
    ],
    localTips: [
      "Treat the Caribbean as a region, then choose a specific island cluster.",
      "A strong week-long route usually beats trying to cover too much.",
      "Entry and travel logistics matter more here than in compact Mediterranean trips.",
    ],
    links: makeLinks(
      "caribbean",
      "BVI-style routes, beach bars and snorkel-led days.",
      "Classic route patterns for first planning.",
      "Useful practical bases and calmer anchorage logic.",
      "🏝️"
    ),
    internalLinks: [
      {
        title: "Browse charter options",
        description:
          "The natural commercial next step from destination research.",
        href: "/charter",
      },
      {
        title: "Read catamaran guide",
        description:
          "Highly relevant for Caribbean charter decision-making.",
        href: "/guides/catamaran-buying-guide",
      },
      {
        title: "Explore finance options",
        description:
          "Useful for users whose charter interest becomes ownership interest.",
        href: "/services/yacht-finance",
      },
    ],
    localResources: [
      {
        title: "British Virgin Islands tourism",
        description:
          "Official BVI tourism site and one of the strongest Caribbean charter planning resources.",
        href: "https://www.bvitourism.com/",
        type: "Official",
      },
      {
        title: "Arriving by air to the BVI",
        description: "Helpful logistics reference for planning access.",
        href: "https://www.bvitourism.com/travel/arriving-by-air",
        type: "Travel",
      },
      {
        title: "Arriving by sea to the BVI",
        description: "Useful official entry guidance for sea arrivals.",
        href: "https://www.bvitourism.com/travel/arriving-by-sea",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Tropical charter classic",
        description:
          "Warm weather and island structure make it one of the archetypal charter destinations.",
        emoji: "🌬️",
      },
      {
        title: "Swim and snorkel payoff",
        description:
          "The in-water side of the trip is not an extra; it is central to the experience.",
        emoji: "🤿",
      },
      {
        title: "Winter-sun magnet",
        description:
          "Especially strong when Mediterranean demand goes quiet.",
        emoji: "✨",
      },
    ],
    faqs: [
      {
        question: "What is the best Caribbean destination for a yacht charter?",
        answer:
          "Many travellers start with the British Virgin Islands because the route logic is established, the charter culture is mature and the on-water experience is very strong.",
      },
      {
        question: "How many days do you need in the Caribbean?",
        answer:
          "A week is a strong minimum for a proper charter rhythm, though two weeks allows a much more relaxed tropical pace.",
      },
      {
        question: "Is the Caribbean better than the Mediterranean for chartering?",
        answer:
          "That depends on season and taste. The Caribbean is stronger for tropical winter-sun energy, while the Mediterranean often brings more urban, culinary and cultural variety.",
      },
    ],
  }),

  destination({
    slug: "dubai",
    title: "Dubai",
    country: "UAE",
    region: "Dubai",
    heroImage: "/destinations/Dubai.png",
    subtitle: "Modern skyline boating with premium marina energy.",
    vibeTags: ["Luxury", "Modern", "Big City"],
    quickFacts: {
      bestTime: "November–March when conditions are most comfortable",
      idealStay: "2–5 days",
      budget: "€€€",
      vibe: "Modern, polished, high-end",
      gettingAround: "Taxis, car transfers and marina-based movement",
    },
    overview:
      "Dubai is a very different kind of yachting destination from the Mediterranean classics. It is less about rustic coastal charm and more about skyline views, short premium experiences, marina-led day trips and a clean luxury-city proposition.",
    whyItWorks:
      "It works for travellers who want a sharp modern visual identity and a destination that pairs yachting with restaurants, hotels, nightlife and high-end urban infrastructure.",
    signatureExperiences: [
      "Skyline-led day charters rather than long coastal itineraries",
      "Sunset cruising framed by towers, beach clubs and premium marinas",
      "Combining the water with big-city hospitality and short-stay energy",
      "Using Dubai Marina and the Palm as anchor visual references",
    ],
    bestFor: [
      "Luxury day charters",
      "Short premium trips",
      "Corporate or celebration outings",
      "Winter-season yachting",
    ],
    localTips: [
      "Think in terms of premium day experiences, not classic island-hopping.",
      "Dubai is strongest when paired with a broader luxury-city itinerary.",
      "Winter is the obvious sweet spot for comfortable on-water days.",
    ],
    links: makeLinks(
      "dubai",
      "Marina days, skyline views and sharp city-side add-ons.",
      "Best visual runs and standout boating moments.",
      "The practical and visual bases for boating in Dubai.",
      "🌆"
    ),
    internalLinks: [
      {
        title: "Search charter trips",
        description: "Explore live charter-led commercial paths.",
        href: "/charter",
      },
      {
        title: "Explore services",
        description:
          "A broader Findaly route into marine support categories.",
        href: "/services",
      },
      {
        title: "Read yacht types explained",
        description:
          "Helpful for choosing the right style of boat for a city-day experience.",
        href: "/guides/yacht-types-explained",
      },
    ],
    localResources: [
      {
        title: "Visit Dubai Marina guide",
        description: "Official Dubai tourism overview of Dubai Marina.",
        href: "https://www.visitdubai.com/en/explore-dubai/dubai-neighbourhoods/dubai-marina",
        type: "Official",
      },
      {
        title: "Dubai Marina article",
        description:
          "A more editorial official guide to what the area offers.",
        href: "https://www.visitdubai.com/en/articles/a-guide-to-dubai-marina",
        type: "Guide",
      },
      {
        title: "Dubai Marina Walk",
        description:
          "Official place page for one of Dubai’s best-known waterfront stretches.",
        href: "https://www.visitdubai.com/en/places-to-visit/marina-walk",
        type: "Guide",
      },
    ],
    highlights: [
      {
        title: "Skyline boating",
        description:
          "Few destinations look this futuristic and polished from the water.",
        emoji: "🌆",
      },
      {
        title: "Winter-ready",
        description:
          "Dubai aligns extremely well with cool-season yachting demand.",
        emoji: "☀️",
      },
      {
        title: "Luxury short-trip fit",
        description:
          "A strong destination for high-end day experiences and short stays.",
        emoji: "💎",
      },
    ],
    faqs: [
      {
        question: "Is Dubai good for yacht charters?",
        answer:
          "Yes, especially for premium day charters, celebrations and short luxury outings rather than long route-based sailing holidays.",
      },
      {
        question: "When is the best time for yachting in Dubai?",
        answer:
          "The cooler months are usually best, especially from late autumn into early spring.",
      },
      {
        question: "Is Dubai more of a marina destination than a cruising destination?",
        answer:
          "Generally yes. The appeal is concentrated around skyline cruising, premium marinas and polished urban leisure rather than island chains or multi-day anchorage routes.",
      },
    ],
  }),

  destination({
    slug: "turkey",
    title: "Turkey",
    country: "Türkiye",
    region: "Turquoise Coast",
    heroImage: "/destinations/Turkey.png",
    subtitle:
      "Bodrum to Göcek — bays, ruins, warm water, and excellent value.",
    vibeTags: ["Value", "Coastal", "Culture"],
    quickFacts: {
      bestTime: "May–October, with June and September especially attractive",
      idealStay: "5–10 days",
      budget: "€€",
      vibe: "Relaxed, cultural, scenic",
      gettingAround: "Boat hops, coastal drives and local transfers",
    },
    overview:
      "Türkiye’s Turquoise Coast is one of the strongest value-for-beauty destinations in the wider Mediterranean world. It combines warm water, sheltered bays, ancient sites, polished resort towns and a yachting culture that can feel both luxurious and more attainable than the Riviera’s top tier.",
    whyItWorks:
      "It works because it gives you scenery, history and proper coastal rhythm without demanding Riviera-level spending for every part of the experience.",
    signatureExperiences: [
      "Blue-cruise style days built around bays, lunches and swim stops",
      "Blending Bodrum polish with quieter stretches like Göcek",
      "Pairing warm-water relaxation with ruins and cultural texture",
      "Getting a more spacious-feeling trip for the same budget class",
    ],
    bestFor: [
      "Mediterranean value seekers",
      "Culture-meets-coast itineraries",
      "Longer relaxed yacht trips",
      "Travellers who want scenic bays without only big-name marina culture",
    ],
    localTips: [
      "Use Bodrum if you want energy and recognisable polish.",
      "Use Göcek if you want softer pacing and easier bay days.",
      "Türkiye is strongest when the trip has room to breathe.",
    ],
    links: makeLinks(
      "turkey",
      "Bays, markets, ruins and beach-led days.",
      "Coastal route ideas and standout experiences.",
      "Calmer practical bases and easy-going stopovers.",
      "🧿"
    ),
    internalLinks: [
      {
        title: "Browse charter opportunities",
        description: "A clean route from inspiration to inventory.",
        href: "/charter",
      },
      {
        title: "Read catamaran buying guide",
        description:
          "A relevant support page for tropical-style comfort seekers.",
        href: "/guides/lagoon-catamaran-buying-guide",
      },
      {
        title: "Explore marine lawyers",
        description:
          "Useful for ownership-related decision journeys.",
        href: "/services/marine-lawyers",
      },
    ],
    localResources: [
      {
        title: "Turkish Riviera official site",
        description: "GoTürkiye’s destination portal for the Turkish Riviera.",
        href: "https://turkishriviera.goturkiye.com/",
        type: "Official",
      },
      {
        title: "Turquoise waters guide",
        description:
          "Official inspiration for key natural highlights on the coast.",
        href: "https://turkishriviera.goturkiye.com/turquoise-waters",
        type: "Guide",
      },
      {
        title: "Sail the enchanted coast",
        description:
          "Official Aegean Türkiye yachting-focused inspiration.",
        href: "https://goaegeanturkiye.com/sail-the-enchanted-coast",
        type: "Guide",
      },
    ],
    highlights: [
      {
        title: "Excellent value",
        description:
          "The destination can deliver a lot of visual and experiential payoff for the spend.",
        emoji: "💸",
      },
      {
        title: "Culture built in",
        description:
          "Ruins, food and town life give the coast extra texture.",
        emoji: "🏛️",
      },
      {
        title: "Bay-hopping beauty",
        description:
          "A strong fit for relaxed days and swim-led itineraries.",
        emoji: "🌊",
      },
    ],
    faqs: [
      {
        question: "Is Türkiye good for a yacht holiday?",
        answer:
          "Yes. It is one of the Mediterranean’s strongest combinations of scenery, value and cultural depth.",
      },
      {
        question: "What is the Turquoise Coast best known for?",
        answer:
          "Warm water, blue-cruise style routes, beautiful bays, and a blend of resort polish with ancient history.",
      },
      {
        question:
          "Is Türkiye cheaper than the French Riviera for yachting?",
        answer:
          "In many cases it offers a stronger value profile, especially when you compare total trip feel rather than just marina names.",
      },
    ],
  }),

  destination({
    slug: "monaco",
    title: "Monaco",
    country: "Monaco",
    region: "French Riviera",
    heroImage: "/destinations/FrenchRiviera.png",
    subtitle: "Superyachts, polished marinas, and one of the most recognisable waterfronts in Europe.",
    vibeTags: ["Luxury", "Marina", "Iconic"],
    quickFacts: {
      bestTime: "May–September, with event periods booked up fastest",
      idealStay: "1–3 days",
      budget: "€€€",
      vibe: "Glossy, high-end, compact",
      gettingAround: "Walkable centre, short transfers, easy marina access",
    },
    overview:
      "Monaco is less about long cruising distance and more about concentration. It compresses prestige, marina spectacle, luxury hospitality and instant visual recognition into one tiny waterfront state.",
    whyItWorks:
      "It works best as a polished focal point on a Riviera itinerary or as a sharp day-charter base for clients who want maximum prestige in minimal distance.",
    signatureExperiences: [
      "Cruising in against one of the Mediterranean’s most recognisable skylines",
      "Using Monaco as a statement stop on a wider Riviera route",
      "Pairing marina spectacle with high-end lunch and evening plans",
      "Building a short charter around visual impact and status-led appeal",
    ],
    bestFor: [
      "Luxury day charters",
      "Statement itineraries",
      "Riviera add-on stops",
      "Clients who want prestige fast",
    ],
    localTips: [
      "Availability tightens quickly around major events and peak dates.",
      "Treat Monaco as a high-impact stop, not a long relaxed cruising zone.",
      "It works especially well when paired with nearby Riviera towns.",
    ],
    links: makeLinks(
      "monaco",
      "Marinas, viewpoints, polished stops and Monaco-by-boat essentials.",
      "Short glamorous route ideas around Monaco and the wider Riviera.",
      "Prestige marinas, practical bases and smooth day-stop logic.",
      "✨"
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "VisitMonaco",
        description: "Official tourism site for Monaco.",
        href: "https://www.visitmonaco.com/en",
        type: "Official",
      },
      {
        title: "Port Hercule overview",
        description: "Useful reference for Monaco’s best-known port setting.",
        href: "https://www.visitmonaco.com/en/place/ports-and-cruises/91/port-hercule",
        type: "Guide",
      },
      {
        title: "What to do in Monaco",
        description: "Official planning ideas for key areas and attractions.",
        href: "https://www.visitmonaco.com/en",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Prestige density",
        description:
          "Few places compress so much luxury signalling into such a small harbour area.",
        emoji: "💎",
      },
      {
        title: "Perfect Riviera add-on",
        description:
          "Monaco works brilliantly as a focused stop inside a broader Côte d’Azur itinerary.",
        emoji: "🛥️",
      },
      {
        title: "Instant recognition",
        description:
          "For clients, crews and content alike, Monaco needs almost no explanation.",
        emoji: "📸",
      },
    ],
    faqs: makeFaqs("Monaco", "French Riviera"),
  }),

  destination({
    slug: "nice",
    title: "Nice",
    country: "France",
    region: "French Riviera",
    heroImage: "/destinations/FrenchRiviera.png",
    subtitle: "A practical Riviera base with city energy, seafront character, and easy coastal access.",
    vibeTags: ["City", "Coastal", "Practical"],
    quickFacts: {
      bestTime: "May–September",
      idealStay: "2–4 days",
      budget: "€€€",
      vibe: "Urban, coastal, lively",
      gettingAround: "Walkable centre, trams, taxis and easy coastal links",
    },
    overview:
      "Nice is one of the Riviera’s most useful mixed destinations because it combines airport convenience, real city life, promenade energy and easy access to the wider coast.",
    whyItWorks:
      "It works as a practical base for charter guests who want both a functioning city and quick access to premium Riviera boating territory.",
    signatureExperiences: [
      "Using Nice as a clean arrival and departure point",
      "Day-charter runs west and east along the Côte d’Azur",
      "Mixing seafront promenades with old-town evenings",
      "Building a trip around convenience without losing Riviera appeal",
    ],
    bestFor: [
      "Convenient Riviera bases",
      "City-meets-coast trips",
      "Short breaks",
      "Day-charter clients",
    ],
    localTips: [
      "Nice is especially strong when logistics matter as much as style.",
      "Use it as a base if you want easier airport access than smaller towns.",
      "Pair it with Antibes, Villefranche or Monaco for better route texture.",
    ],
    links: makeLinks(
      "nice",
      "Seafront highlights, city-side boating ideas and easy day plans.",
      "Short Riviera route ideas starting from Nice.",
      "Practical bases, marina logic and calmer stops nearby."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Explore Nice Côte d’Azur",
        description: "Official tourism guide for Nice and its wider region.",
        href: "https://www.explorenicecotedazur.com/en/",
        type: "Official",
      },
      {
        title: "Nice overview",
        description: "Official city planning inspiration.",
        href: "https://www.explorenicecotedazur.com/en/discover/nice/",
        type: "Guide",
      },
      {
        title: "Practical travel information",
        description: "Useful planning support for visitors.",
        href: "https://www.explorenicecotedazur.com/en/practical-information/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Excellent access",
        description:
          "Nice is one of the easiest Riviera entry points for international travellers.",
        emoji: "✈️",
      },
      {
        title: "Real city layer",
        description:
          "It has enough urban life to support longer stays better than smaller resort stops.",
        emoji: "🌆",
      },
      {
        title: "Strong base value",
        description:
          "As a charter base, Nice makes logistics feel simpler.",
        emoji: "🧭",
      },
    ],
    faqs: makeFaqs("Nice", "French Riviera"),
  }),

  destination({
    slug: "cannes",
    title: "Cannes",
    country: "France",
    region: "French Riviera",
    heroImage: "/destinations/FrenchRiviera.png",
    subtitle: "Festival glamour, beach clubs, and polished coastal energy on the Riviera.",
    vibeTags: ["Luxury", "Beach Clubs", "Riviera"],
    quickFacts: {
      bestTime: "May–September",
      idealStay: "1–3 days",
      budget: "€€€",
      vibe: "Glossy, social, polished",
      gettingAround: "Walkable seafront, short transfers, easy coastal hops",
    },
    overview:
      "Cannes is one of the Riviera’s best-known names and remains a high-value stop for clients who want immediate glamour, beach-club culture and easy coastal visibility.",
    whyItWorks:
      "It works because it is both famous and functional. Cannes can anchor a day charter, a short luxury stay or a wider Riviera itinerary without much explanation.",
    signatureExperiences: [
      "A stylish arrival into one of the Riviera’s most recognisable harbour settings",
      "Beach-club and promenade energy wrapped into a short trip",
      "Using Cannes as a statement stop on a wider route",
      "Building a high-impact day charter around recognisable scenery",
    ],
    bestFor: [
      "Luxury day charters",
      "Social Riviera trips",
      "Short glamorous stays",
      "Event-led itineraries",
    ],
    localTips: [
      "Cannes gets tighter around event periods and peak summer weekends.",
      "It is strongest when you lean into its polish rather than searching for quiet seclusion.",
      "Pair with Antibes or Saint-Tropez for stronger route contrast.",
    ],
    links: makeLinks(
      "cannes",
      "Promenade highlights, beach clubs and Cannes-by-boat essentials.",
      "Short Riviera route ideas and standout day-charter moments.",
      "Harbour logic, practical bases and calmer nearby stops."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Cannes destination site",
        description: "Official tourism information for Cannes.",
        href: "https://www.cannes-france.com/",
        type: "Official",
      },
      {
        title: "Discover Cannes",
        description: "Official city guide and planning inspiration.",
        href: "https://www.cannes-france.com/discover-cannes/",
        type: "Guide",
      },
      {
        title: "Practical information",
        description: "Useful visitor and travel details.",
        href: "https://www.cannes-france.com/prepare-your-stay/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Instant glamour",
        description:
          "Cannes delivers Riviera luxury cues very quickly and very clearly.",
        emoji: "✨",
      },
      {
        title: "Event energy",
        description:
          "It works especially well for trips tied to culture, events or social calendars.",
        emoji: "🎬",
      },
      {
        title: "Day-charter friendly",
        description:
          "Cannes makes it easy to design short high-impact experiences.",
        emoji: "🛥️",
      },
    ],
    faqs: makeFaqs("Cannes", "French Riviera"),
  }),

  destination({
    slug: "antibes",
    title: "Antibes",
    country: "France",
    region: "French Riviera",
    heroImage: "/destinations/FrenchRiviera.png",
    subtitle: "A classic Riviera harbour town with serious marina credentials and easier pacing.",
    vibeTags: ["Harbour", "Marina", "Riviera"],
    quickFacts: {
      bestTime: "May–September",
      idealStay: "2–4 days",
      budget: "€€€",
      vibe: "Polished, maritime, slightly calmer",
      gettingAround: "Walkable old town with easy coastal connections",
    },
    overview:
      "Antibes combines one of the Riviera’s strongest marina identities with an old-town feel that is more grounded than the flashiest luxury stops nearby.",
    whyItWorks:
      "It works for yacht users because it feels genuinely maritime, not just scenic. Antibes has practical credibility as well as Riviera beauty.",
    signatureExperiences: [
      "Walking from a serious marina environment into a compact old town",
      "Using Antibes as a base for nearby Riviera day routes",
      "Building a calmer luxury trip around harbour culture",
      "Combining maritime utility with polished seaside dining",
    ],
    bestFor: [
      "Marina-focused stays",
      "Riviera bases",
      "Clients who want polish without maximum flash",
      "Short coastal itineraries",
    ],
    localTips: [
      "Antibes is one of the strongest practical bases on this coastline.",
      "It is often a smarter overnight choice than louder nearby stops.",
      "Use it as a base if marina access matters as much as atmosphere.",
    ],
    links: makeLinks(
      "antibes",
      "Harbour life, old-town moments and Antibes boating essentials.",
      "Easy Riviera route ideas from a marina-heavy base.",
      "Practical bases, provisioning logic and calmer stopovers."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Antibes Juan-les-Pins tourism",
        description: "Official tourism site for Antibes and Juan-les-Pins.",
        href: "https://www.antibesjuanlespins.com/en/",
        type: "Official",
      },
      {
        title: "Discover Antibes",
        description: "Official local inspiration and trip planning.",
        href: "https://www.antibesjuanlespins.com/en/discover/",
        type: "Guide",
      },
      {
        title: "Prepare your stay",
        description: "Useful visitor information for planning.",
        href: "https://www.antibesjuanlespins.com/en/practical-information/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Real marina identity",
        description:
          "Antibes feels built around boating rather than merely posed for it.",
        emoji: "⚓️",
      },
      {
        title: "Balanced Riviera mood",
        description:
          "It is polished but a touch calmer than the flashiest nearby names.",
        emoji: "🌊",
      },
      {
        title: "Excellent base choice",
        description:
          "For many itineraries, Antibes is one of the most practical Riviera anchors.",
        emoji: "🧭",
      },
    ],
    faqs: makeFaqs("Antibes", "French Riviera"),
  }),

  destination({
    slug: "saint-tropez",
    title: "Saint-Tropez",
    country: "France",
    region: "French Riviera",
    heroImage: "/destinations/FrenchRiviera.png",
    subtitle: "Legendary marina glamour, beach-club culture, and one of the Riviera’s strongest names.",
    vibeTags: ["Luxury", "Beach Clubs", "Iconic"],
    quickFacts: {
      bestTime: "June–September",
      idealStay: "1–3 days",
      budget: "€€€",
      vibe: "Flashy, social, high-end",
      gettingAround: "Tender, short transfers and local road movement",
    },
    overview:
      "Saint-Tropez remains one of the strongest luxury marina names in the Mediterranean. It is part harbour spectacle, part lifestyle myth, and part practical Riviera stop for high-end summer itineraries.",
    whyItWorks:
      "It works because the name itself carries weight. For many travellers, Saint-Tropez is not just a destination but a category of mood.",
    signatureExperiences: [
      "Arriving by boat into one of the world’s most recognisable marina scenes",
      "Pairing beach-club days with polished harbour evenings",
      "Using Saint-Tropez as a prestige stop in a wider Riviera route",
      "Designing a social luxury trip around one core iconic name",
    ],
    bestFor: [
      "Luxury charters",
      "Social summer itineraries",
      "Beach-club trips",
      "Prestige-led Riviera planning",
    ],
    localTips: [
      "Peak dates get crowded fast, so keep marina and dining plans tight.",
      "The appeal is strongest when you embrace the social energy rather than resist it.",
      "Pair it with quieter water time elsewhere for better trip balance.",
    ],
    links: makeLinks(
      "saint-tropez",
      "Harbour glamour, beach clubs and Saint-Tropez-by-boat essentials.",
      "Short high-impact route ideas around Saint-Tropez.",
      "Marina planning, practical stops and calmer nearby moments."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Saint-Tropez tourism",
        description: "Official tourism site for Saint-Tropez.",
        href: "https://www.sainttropeztourisme.com/en/",
        type: "Official",
      },
      {
        title: "Discover Saint-Tropez",
        description: "Official inspiration for the town and surrounding area.",
        href: "https://www.sainttropeztourisme.com/en/discover/",
        type: "Guide",
      },
      {
        title: "Prepare your stay",
        description: "Useful practical travel information.",
        href: "https://www.sainttropeztourisme.com/en/prepare-your-stay/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Legendary brand value",
        description:
          "Saint-Tropez carries one of the strongest luxury associations in European boating.",
        emoji: "💎",
      },
      {
        title: "Social energy",
        description:
          "It suits clients who want the lively, seen-and-be-seen end of the Riviera.",
        emoji: "🥂",
      },
      {
        title: "Instant itinerary anchor",
        description:
          "One Saint-Tropez stop can frame the mood of an entire charter.",
        emoji: "🛥️",
      },
    ],
    faqs: makeFaqs("Saint-Tropez", "French Riviera"),
  }),

  destination({
    slug: "sanremo",
    title: "Sanremo",
    country: "Italy",
    region: "Liguria",
    heroImage: "/destinations/FrenchRiviera.png",
    subtitle: "Italian Riviera atmosphere with an easier pace and smart western Liguria positioning.",
    vibeTags: ["Italian Riviera", "Harbour", "Relaxed"],
    quickFacts: {
      bestTime: "May–September",
      idealStay: "2–3 days",
      budget: "€€",
      vibe: "Relaxed, elegant, practical",
      gettingAround: "Walkable centre and easy local transfers",
    },
    overview:
      "Sanremo sits at an interesting point between Italian Riviera identity and western Mediterranean route logic. It can work as a softer, easier alternative to flashier nearby names.",
    whyItWorks:
      "It works for travellers who want coastal atmosphere, marina utility and Italian character without maximum hype.",
    signatureExperiences: [
      "Using Sanremo as a practical coastal stop in western Liguria",
      "Mixing marina movement with a more relaxed town rhythm",
      "Pairing Riviera cruising with a less overexposed land experience",
      "Building a quieter luxury route with easier pacing",
    ],
    bestFor: [
      "Italian Riviera alternatives",
      "Relaxed coastal stays",
      "Practical stopovers",
      "Slower-paced itineraries",
    ],
    localTips: [
      "Sanremo works best as part of a broader coastal route rather than as a stand-alone headline.",
      "It is useful when you want style without heavy crowd pressure.",
      "Use it to soften a more glam-heavy itinerary.",
    ],
    links: makeLinks(
      "sanremo",
      "Coastal highlights, marina logic and easy Ligurian stop ideas.",
      "Practical western Liguria route ideas.",
      "Harbour use, calmer bases and useful stopovers."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Sanremo tourism",
        description: "Official tourism information for Sanremo.",
        href: "https://www.sanremotour.it/en/",
        type: "Official",
      },
      {
        title: "Discover Sanremo",
        description: "Local tourism inspiration and planning.",
        href: "https://www.sanremotour.it/en/discover-sanremo/",
        type: "Guide",
      },
      {
        title: "Plan your stay",
        description: "Practical visitor information.",
        href: "https://www.sanremotour.it/en/useful-information/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Softer Riviera option",
        description:
          "Sanremo is useful when you want coastal quality without maximum flash.",
        emoji: "🌊",
      },
      {
        title: "Good route utility",
        description:
          "It fits well inside broader western Mediterranean planning.",
        emoji: "🧭",
      },
      {
        title: "Italian character",
        description:
          "It brings more local Italian rhythm than purely prestige-led stops.",
        emoji: "🇮🇹",
      },
    ],
    faqs: makeFaqs("Sanremo", "Liguria"),
  }),

  destination({
    slug: "genoa",
    title: "Genoa",
    country: "Italy",
    region: "Liguria",
    heroImage: "/destinations/FrenchRiviera.png",
    subtitle: "A major historic port city with serious maritime identity and strategic Ligurian positioning.",
    vibeTags: ["Port City", "Maritime", "Historic"],
    quickFacts: {
      bestTime: "May–September",
      idealStay: "2–4 days",
      budget: "€€",
      vibe: "Urban, maritime, historic",
      gettingAround: "City transit, taxis and harbour access",
    },
    overview:
      "Genoa is first and foremost a real port city. It has scale, maritime history and serious working-waterfront credibility that separates it from purely leisure-driven coastal towns.",
    whyItWorks:
      "It works when the trip benefits from a deeper maritime context, stronger city substance and a more grounded Ligurian urban experience.",
    signatureExperiences: [
      "Approaching a city that feels genuinely tied to the sea",
      "Using Genoa as a strategic Ligurian anchor",
      "Blending maritime heritage with city-side exploration",
      "Adding urban depth to a coast-only itinerary",
    ],
    bestFor: [
      "Maritime-minded travellers",
      "Urban coastal trips",
      "Strategic Ligurian bases",
      "Historic port interest",
    ],
    localTips: [
      "Genoa is stronger for depth and utility than for resort glamour.",
      "Use it when the trip benefits from city substance and transport reach.",
      "It pairs well with softer coastal stops elsewhere in Liguria.",
    ],
    links: makeLinks(
      "genoa",
      "Historic port highlights and city-meets-sea planning ideas.",
      "Ligurian route logic starting from a real maritime city.",
      "Useful harbour bases and practical stop layers."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Visit Genoa",
        description: "Official tourism site for Genoa.",
        href: "https://www.visitgenoa.it/en",
        type: "Official",
      },
      {
        title: "Discover Genoa",
        description: "Official city highlights and planning inspiration.",
        href: "https://www.visitgenoa.it/en/discover-genoa",
        type: "Guide",
      },
      {
        title: "Useful information",
        description: "Travel planning and practical local support.",
        href: "https://www.visitgenoa.it/en/useful-information",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Real port-city identity",
        description:
          "Genoa feels maritime in substance, not just style.",
        emoji: "⚓️",
      },
      {
        title: "Strategic position",
        description:
          "It is useful for Ligurian route planning and wider access.",
        emoji: "🧭",
      },
      {
        title: "Historic depth",
        description:
          "It adds city weight to a coastal itinerary.",
        emoji: "🏛️",
      },
    ],
    faqs: makeFaqs("Genoa", "Liguria"),
  }),

  destination({
    slug: "portofino",
    title: "Portofino",
    country: "Italy",
    region: "Liguria",
    heroImage: "/destinations/FrenchRiviera.png",
    subtitle: "A postcard harbour with luxury pull, short-stop appeal, and powerful visual identity.",
    vibeTags: ["Luxury", "Harbour", "Iconic"],
    quickFacts: {
      bestTime: "May–September",
      idealStay: "1–2 days",
      budget: "€€€",
      vibe: "Elegant, compact, polished",
      gettingAround: "Tender, short local transfers and walkable centre",
    },
    overview:
      "Portofino is one of those names that works almost entirely on recognition and image quality. The harbour is compact, the appeal is immediate, and the stop feels special even when the time on land is short.",
    whyItWorks:
      "It works because it delivers a disproportionate amount of visual and brand value for a very small footprint.",
    signatureExperiences: [
      "Arriving into one of Italy’s most recognisable harbour scenes",
      "Using Portofino as a polished highlight rather than a long base",
      "Building a Ligurian route around one short high-value stop",
      "Pairing harbour beauty with a slower scenic coastal day",
    ],
    bestFor: [
      "Luxury stopovers",
      "Italian Riviera icons",
      "Short glamorous visits",
      "Photo-led itineraries",
    ],
    localTips: [
      "Portofino is strongest as a focused stop, not an overextended stay.",
      "Treat it as a visual and lifestyle highlight inside a wider route.",
      "Peak periods can feel tight, so keep timing realistic.",
    ],
    links: makeLinks(
      "portofino",
      "Harbour highlights and polished Portofino-by-boat ideas.",
      "Short scenic route ideas around Portofino.",
      "Practical approach, harbour logic and calmer nearby moments."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Portofino tourism",
        description: "Official tourism information for Portofino.",
        href: "https://www.portofinocoast.it/en/",
        type: "Official",
      },
      {
        title: "Portofino Coast guide",
        description: "Useful wider destination context for the area.",
        href: "https://www.portofinocoast.it/en/territorio/portofino/",
        type: "Guide",
      },
      {
        title: "Travel information",
        description: "Practical details for visiting the area.",
        href: "https://www.portofinocoast.it/en/come-arrivare/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Huge visual payoff",
        description:
          "Portofino looks special almost instantly from the water.",
        emoji: "📸",
      },
      {
        title: "Luxury shorthand",
        description:
          "The name carries strong upscale Mediterranean associations.",
        emoji: "💎",
      },
      {
        title: "Perfect short stop",
        description:
          "It shines brightest as a precise, elegant itinerary moment.",
        emoji: "⛵️",
      },
    ],
    faqs: makeFaqs("Portofino", "Liguria"),
  }),

  destination({
    slug: "la-spezia",
    title: "La Spezia",
    country: "Italy",
    region: "Liguria",
    heroImage: "/destinations/FrenchRiviera.png",
    subtitle: "A practical Ligurian base with strong route utility and access to nearby coastal highlights.",
    vibeTags: ["Practical", "Base", "Coastal"],
    quickFacts: {
      bestTime: "May–September",
      idealStay: "2–4 days",
      budget: "€€",
      vibe: "Useful, understated, coastal",
      gettingAround: "Train, local transfers and easy harbour access",
    },
    overview:
      "La Spezia often matters more as a strategic base than as a glamour destination. That does not make it less valuable. In itinerary design, practical strength can be a major advantage.",
    whyItWorks:
      "It works for travellers who care about clean logistics, better regional access and using the harbour as a gateway to stronger nearby coastal experiences.",
    signatureExperiences: [
      "Using La Spezia as a route base rather than a headline stop",
      "Adding efficiency to a Ligurian itinerary",
      "Mixing harbour practicality with nearby scenic coastal movement",
      "Building a trip around what is easiest to execute well",
    ],
    bestFor: [
      "Practical charter bases",
      "Route efficiency",
      "Liguria logistics",
      "Gateway planning",
    ],
    localTips: [
      "Treat La Spezia as a smart base, not a prestige-led stop.",
      "Its strength is often in what it unlocks nearby.",
      "It works well for users who prioritise smoother logistics.",
    ],
    links: makeLinks(
      "la-spezia",
      "Useful local planning ideas and harbour-side essentials.",
      "Practical route ideas from a strategic base.",
      "Marina logic, harbour use and efficient stop planning."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Visit La Spezia",
        description: "Official tourism information for La Spezia.",
        href: "https://www.visitspezia.it/en/",
        type: "Official",
      },
      {
        title: "Discover the territory",
        description: "Useful regional planning and local inspiration.",
        href: "https://www.visitspezia.it/en/discover/",
        type: "Guide",
      },
      {
        title: "Useful information",
        description: "Practical travel and visitor details.",
        href: "https://www.visitspezia.it/en/useful-information/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Route efficiency",
        description:
          "La Spezia gives itineraries practical backbone.",
        emoji: "🧭",
      },
      {
        title: "Gateway value",
        description:
          "Its real strength is often what it helps you reach.",
        emoji: "🚪",
      },
      {
        title: "Less hype, more utility",
        description:
          "For some trips, that is exactly the right trade.",
        emoji: "⚓️",
      },
    ],
    faqs: makeFaqs("La Spezia", "Liguria"),
  }),

  destination({
    slug: "naples",
    title: "Naples",
    country: "Italy",
    region: "Campania",
    heroImage: "/destinations/Amalfi Coast.png",
    subtitle: "A big southern port city with huge character and strong access to iconic boating territory.",
    vibeTags: ["Port City", "Campania", "Character"],
    quickFacts: {
      bestTime: "May–September",
      idealStay: "2–4 days",
      budget: "€€",
      vibe: "Energetic, gritty, memorable",
      gettingAround: "City transit, taxis and port access",
    },
    overview:
      "Naples brings scale, history and unmistakable energy to a yachting journey. It is less refined than the Amalfi Coast, but often more substantial and strategically useful.",
    whyItWorks:
      "It works when a trip benefits from city depth, strong onward access and a more vivid southern Italian backdrop.",
    signatureExperiences: [
      "Using Naples as a strong practical anchor before coastal cruising",
      "Adding city character to an otherwise scenery-led route",
      "Building a Campania trip with better transport logic",
      "Using the port as a gateway to iconic nearby water territory",
    ],
    bestFor: [
      "Campania access",
      "Port-city travellers",
      "Practical south Italy bases",
      "Trips that benefit from real urban energy",
    ],
    localTips: [
      "Naples is a stronger strategic base than a purely polished marina fantasy.",
      "It pairs well with islands and coastlines nearby for contrast.",
      "Expect more city texture and noise than on softer resort stops.",
    ],
    links: makeLinks(
      "naples",
      "Port-city boating context and strong Naples planning ideas.",
      "Gateway-style route planning around Naples and Campania.",
      "Harbour logic, city access and practical stopovers."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Napoli official tourism",
        description: "Official tourism site for Naples.",
        href: "https://www.comune.napoli.it/flex/cm/pages/ServeBLOB.php/L/EN/IDPagina/39552",
        type: "Official",
      },
      {
        title: "Campania tourism",
        description: "Regional tourism planning and destination context.",
        href: "https://www.incampania.com/en/",
        type: "Guide",
      },
      {
        title: "Visit Naples practical info",
        description: "Helpful local visitor information.",
        href: "https://www.comune.napoli.it/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Real city intensity",
        description:
          "Naples adds emotion and weight to a coastal itinerary.",
        emoji: "🌋",
      },
      {
        title: "Strong strategic access",
        description:
          "It is a powerful transport and port anchor for Campania trips.",
        emoji: "🧭",
      },
      {
        title: "Great contrast value",
        description:
          "It pairs especially well with more polished nearby coastal stops.",
        emoji: "🌊",
      },
    ],
    faqs: makeFaqs("Naples", "Campania"),
  }),

  destination({
    slug: "valencia",
    title: "Valencia",
    country: "Spain",
    region: "Valencian Community",
    heroImage: "/destinations/Balearics.png",
    subtitle: "A modern Spanish coastal city with marina utility and easier big-city balance.",
    vibeTags: ["City", "Spain", "Practical"],
    quickFacts: {
      bestTime: "April–October",
      idealStay: "2–4 days",
      budget: "€€",
      vibe: "Modern, coastal, easy-going",
      gettingAround: "City transit, taxis and marina access",
    },
    overview:
      "Valencia offers a cleaner balance between city scale and coastal ease than many bigger Mediterranean names. It can work well as a practical boating base or a city-meets-water destination.",
    whyItWorks:
      "It works when travellers want Spain, marina access and city convenience without the pressure or pricing of the most obvious luxury names.",
    signatureExperiences: [
      "Using Valencia as a modern marina-led city base",
      "Combining architecture, food and smoother boating logistics",
      "Building a trip around practicality without losing style",
      "Using the city as a stepping stone toward wider coastal movement",
    ],
    bestFor: [
      "City-meets-coast trips",
      "Practical Spanish bases",
      "Modern marina stays",
      "Short easy-going escapes",
    ],
    localTips: [
      "Valencia is often strongest as a smart base rather than a fantasy-driven icon stop.",
      "It gives good value when city infrastructure matters.",
      "It can work well before or after island-focused plans.",
    ],
    links: makeLinks(
      "valencia",
      "Coastal city highlights and marina-friendly planning ideas.",
      "Spanish east-coast route logic and easy boating moments.",
      "Practical bases, harbour use and smoother stop planning."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Visit Valencia",
        description: "Official tourism site for Valencia.",
        href: "https://www.visitvalencia.com/en",
        type: "Official",
      },
      {
        title: "Things to do in Valencia",
        description: "Official inspiration and planning ideas.",
        href: "https://www.visitvalencia.com/en/what-to-do-valencia",
        type: "Guide",
      },
      {
        title: "Practical information",
        description: "Useful local planning details.",
        href: "https://www.visitvalencia.com/en/practical-information",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Balanced city energy",
        description:
          "Valencia gives you a usable city without overwhelming the trip.",
        emoji: "🌆",
      },
      {
        title: "Good practical value",
        description:
          "It often feels easier and cleaner than more over-saturated names.",
        emoji: "🧭",
      },
      {
        title: "Strong marina logic",
        description:
          "It works well when access and execution matter.",
        emoji: "⚓️",
      },
    ],
    faqs: makeFaqs("Valencia", "Valencian Community"),
  }),

  destination({
    slug: "barcelona",
    title: "Barcelona",
    country: "Spain",
    region: "Catalonia",
    heroImage: "/destinations/Balearics.png",
    subtitle: "A major Mediterranean city with strong marina access, culture, and big-name appeal.",
    vibeTags: ["City", "Culture", "Mediterranean"],
    quickFacts: {
      bestTime: "April–October",
      idealStay: "2–5 days",
      budget: "€€€",
      vibe: "Urban, energetic, internationally known",
      gettingAround: "City transit, taxis and port access",
    },
    overview:
      "Barcelona is a major city first and a yachting destination second, but that does not reduce its value. For many travellers, it is one of the easiest Mediterranean places to combine water access with real city depth.",
    whyItWorks:
      "It works because the brand is huge, the city is easy to understand, and the boating element adds another layer rather than carrying the whole destination alone.",
    signatureExperiences: [
      "Using Barcelona as a pre- or post-charter city anchor",
      "Combining marina access with major cultural depth",
      "Building a Mediterranean trip around one globally familiar city",
      "Adding a boating layer to a city-heavy itinerary",
    ],
    bestFor: [
      "City-plus-yacht trips",
      "International first-time visitors",
      "Culture-led itineraries",
      "Practical pre/post charter stays",
    ],
    localTips: [
      "Barcelona works best when treated as a hybrid city-and-water destination.",
      "It is stronger for broad appeal than for secluded boating mood.",
      "Use it when cultural depth matters alongside the coast.",
    ],
    links: makeLinks(
      "barcelona",
      "Waterfront highlights and city-meets-boat planning ideas.",
      "Mediterranean route logic around Barcelona.",
      "Port access, marina use and practical coastal movement."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Barcelona official tourism",
        description: "Official tourism site for Barcelona.",
        href: "https://www.barcelonaturisme.com/wv3/en/",
        type: "Official",
      },
      {
        title: "What to do in Barcelona",
        description: "Official city highlights and planning inspiration.",
        href: "https://www.barcelonaturisme.com/wv3/en/page/1/what-to-do-in-barcelona.html",
        type: "Guide",
      },
      {
        title: "Practical information",
        description: "Useful planning and visitor support.",
        href: "https://www.barcelonaturisme.com/wv3/en/page/73/practical-information.html",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Huge recognisability",
        description:
          "Barcelona sells itself quickly to international users.",
        emoji: "🌍",
      },
      {
        title: "Strong city depth",
        description:
          "It adds real substance before or after time on the water.",
        emoji: "🏙️",
      },
      {
        title: "Hybrid trip strength",
        description:
          "It works well for travellers who do not want a pure marina holiday.",
        emoji: "🛥️",
      },
    ],
    faqs: makeFaqs("Barcelona", "Catalonia"),
  }),

  destination({
    slug: "palma",
    title: "Palma",
    country: "Spain",
    region: "Mallorca",
    heroImage: "/destinations/Balearics.png",
    subtitle: "The strongest urban gateway into Mallorca’s boating and charter scene.",
    vibeTags: ["Mallorca", "Gateway", "Marina"],
    quickFacts: {
      bestTime: "May–October",
      idealStay: "2–5 days",
      budget: "€€",
      vibe: "Polished, practical, coastal-city",
      gettingAround: "City movement is easy; island travel usually needs a car or boat",
    },
    overview:
      "Palma is one of the most useful charter gateways in the western Mediterranean. It combines marina infrastructure, an attractive old city and Mallorca’s broader cruising logic in one place.",
    whyItWorks:
      "It works because it is both appealing and efficient. For many users, Palma is the easiest entry into the Balearic boating world.",
    signatureExperiences: [
      "Starting a Mallorca charter from a city that already works well on its own",
      "Mixing marina culture with old-town and dining value",
      "Using Palma as a clean launch point for coves and coastal routes",
      "Building a Balearic trip around one strong practical anchor",
    ],
    bestFor: [
      "Mallorca charters",
      "Practical Balearic bases",
      "City-plus-coast trips",
      "First-time island planning",
    ],
    localTips: [
      "Palma is often the smartest starting point for Mallorca-based boating.",
      "It helps keep arrivals and departures smoother than more remote island bases.",
      "Use it for structure, then move outward for calmer coastal mood.",
    ],
    links: makeLinks(
      "palma",
      "Mallorca gateway ideas and Palma boating essentials.",
      "Easy route logic from Palma into wider island cruising.",
      "Marina access, practical bases and calmer island stopovers."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Visit Palma",
        description: "Official tourism site for Palma.",
        href: "https://www.visitpalma.com/en/",
        type: "Official",
      },
      {
        title: "Discover Palma",
        description: "Official local inspiration and highlights.",
        href: "https://www.visitpalma.com/en/discover-palma/",
        type: "Guide",
      },
      {
        title: "Practical information",
        description: "Useful visitor planning details.",
        href: "https://www.visitpalma.com/en/practical-information/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Gateway strength",
        description:
          "Palma is one of the clearest launch points into Mallorca boating.",
        emoji: "🧭",
      },
      {
        title: "Good city layer",
        description:
          "It gives trips more substance than a marina-only starting point.",
        emoji: "🏛️",
      },
      {
        title: "Execution-friendly",
        description:
          "It helps arrivals, departures and charter logistics feel cleaner.",
        emoji: "⚓️",
      },
    ],
    faqs: makeFaqs("Palma", "Mallorca"),
  }),

  destination({
    slug: "ibiza",
    title: "Ibiza",
    country: "Spain",
    region: "Balearic Islands",
    heroImage: "/destinations/Balearics.png",
    subtitle: "Beach clubs, blue water, and one of the Mediterranean’s strongest social yacht names.",
    vibeTags: ["Nightlife", "Luxury", "Island"],
    quickFacts: {
      bestTime: "May–October",
      idealStay: "2–5 days",
      budget: "€€€",
      vibe: "Social, beachy, high-energy",
      gettingAround: "Boat plus local road transfers",
    },
    overview:
      "Ibiza is one of the Mediterranean’s most powerful lifestyle destinations. It combines beach-club culture, boating appeal and instantly recognisable summer energy.",
    whyItWorks:
      "It works because the island has a clear identity. Clients generally know what Ibiza means before they arrive.",
    signatureExperiences: [
      "A day built around coves, music and beach-club energy",
      "Pairing social afternoons with calmer water time elsewhere",
      "Using Ibiza as the high-energy side of a Balearic route",
      "Building a charter around recognisable summer mood",
    ],
    bestFor: [
      "Social charters",
      "Friends trips",
      "Luxury summer stays",
      "Balearic island combinations",
    ],
    localTips: [
      "Balance Ibiza with calmer anchor time if you want a better rhythm.",
      "Peak summer dates move fast across marinas and dining.",
      "It works especially well when paired with Formentera or Mallorca.",
    ],
    links: makeLinks(
      "ibiza",
      "Coves, club culture and Ibiza-by-boat essentials.",
      "Strong summer route ideas around Ibiza.",
      "Marina planning and calmer nearby water moments."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Ibiza travel",
        description: "Official tourism guide for Ibiza.",
        href: "https://www.ibiza.travel/en/",
        type: "Official",
      },
      {
        title: "What to do in Ibiza",
        description: "Official planning inspiration for the island.",
        href: "https://www.ibiza.travel/en/what-to-do/",
        type: "Guide",
      },
      {
        title: "Practical info",
        description: "Useful visitor information and local planning.",
        href: "https://www.ibiza.travel/en/practical-info/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Huge social pull",
        description:
          "Ibiza remains one of the strongest boating-adjacent lifestyle names in Europe.",
        emoji: "🎶",
      },
      {
        title: "Blue-water payoff",
        description:
          "The island still delivers genuine swim and cove value beyond the nightlife image.",
        emoji: "🌊",
      },
      {
        title: "Perfect route contrast",
        description:
          "It pairs especially well with quieter Balearic stops.",
        emoji: "🗺️",
      },
    ],
    faqs: makeFaqs("Ibiza", "Balearic Islands"),
  }),

  destination({
    slug: "mahon",
    title: "Mahón",
    country: "Spain",
    region: "Menorca",
    heroImage: "/destinations/Balearics.png",
    subtitle: "A calmer Balearic harbour base with softer pace and strong Menorca access.",
    vibeTags: ["Harbour", "Calm", "Menorca"],
    quickFacts: {
      bestTime: "May–October",
      idealStay: "2–4 days",
      budget: "€€",
      vibe: "Relaxed, understated, harbour-led",
      gettingAround: "Harbour and local island transfers",
    },
    overview:
      "Mahón is one of the Balearics’ calmer practical bases. It is less about scene and more about harbour logic, slower rhythm and easy access to Menorca’s softer appeal.",
    whyItWorks:
      "It works for users who want Balearic boating without having to buy into the highest-energy version of the islands.",
    signatureExperiences: [
      "Using Mahón as a quieter island base",
      "Building Menorca days around calmer anchor time",
      "Pairing harbour practicality with softer island atmosphere",
      "Choosing depth of pace over maximum hype",
    ],
    bestFor: [
      "Calmer Balearic itineraries",
      "Menorca trips",
      "Harbour-led stays",
      "Users avoiding peak-scene islands",
    ],
    localTips: [
      "Mahón is strongest when you want calm and structure.",
      "It is a good counterpoint to Ibiza-led planning.",
      "Menorca rewards slower pacing more than overstuffed routes.",
    ],
    links: makeLinks(
      "mahon",
      "Harbour planning, Menorca access and calmer island ideas.",
      "Softer Balearic route logic around Mahón.",
      "Practical bases and easy harbour-side movement."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Menorca tourism",
        description: "Official tourism guide for Menorca.",
        href: "https://www.menorca.es/publicacions/menorca/en/",
        type: "Official",
      },
      {
        title: "Visit Mahón",
        description: "Local destination context within Menorca.",
        href: "https://www.menorca.es/publicacions/menorca/en/municipios/mahon/",
        type: "Guide",
      },
      {
        title: "Practical information",
        description: "Useful travel support for planning a Menorca trip.",
        href: "https://www.menorca.es/publicacions/menorca/en/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Calmer Balearic mood",
        description:
          "Mahón helps travellers access the islands without maximum noise.",
        emoji: "🤍",
      },
      {
        title: "Good practical base",
        description:
          "It supports easier Menorca planning and harbour use.",
        emoji: "⚓️",
      },
      {
        title: "Soft pacing",
        description:
          "It suits trips that want elegance without scene pressure.",
        emoji: "🌅",
      },
    ],
    faqs: makeFaqs("Mahón", "Menorca"),
  }),

  destination({
    slug: "split",
    title: "Split",
    country: "Croatia",
    region: "Dalmatian Coast",
    heroImage: "/destinations/Croatia.png",
    subtitle: "A major Croatian charter gateway with strong route logic into the islands.",
    vibeTags: ["Gateway", "Croatia", "Charter"],
    quickFacts: {
      bestTime: "May–September",
      idealStay: "3–5 days",
      budget: "€€",
      vibe: "Practical, lively, coastal-city",
      gettingAround: "Walkable core plus harbour and ferry connections",
    },
    overview:
      "Split is one of the clearest gateways into Croatia’s sailing and charter world. It combines usable infrastructure, urban life and direct access to island-rich route planning.",
    whyItWorks:
      "It works because it helps a trip start cleanly. Split gives users structure without draining the coastal mood out of the journey.",
    signatureExperiences: [
      "Launching a Croatian island route from a functional city base",
      "Combining old-city energy with harbour movement",
      "Using Split for cleaner arrivals and departures",
      "Building an easy first-time Croatia itinerary",
    ],
    bestFor: [
      "Croatia charters",
      "Gateway city stays",
      "First-time island planning",
      "Practical route design",
    ],
    localTips: [
      "Split is often the smartest first step into Dalmatian sailing.",
      "Use it for structure, then move out into the islands.",
      "It is stronger as a launch point than as a secluded coastal fantasy.",
    ],
    links: makeLinks(
      "split",
      "City-and-harbour essentials plus charter planning ideas.",
      "Easy Croatia route logic from Split.",
      "Practical bases and useful harbour movement."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Split tourism",
        description: "Official tourism site for Split.",
        href: "https://visitsplit.com/en/1/welcome-to-split",
        type: "Official",
      },
      {
        title: "Things to do in Split",
        description: "Official local inspiration and planning.",
        href: "https://visitsplit.com/en/2/discover-split",
        type: "Guide",
      },
      {
        title: "Useful information",
        description: "Visitor planning and practical details.",
        href: "https://visitsplit.com/en/10/plan-your-trip",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Excellent gateway value",
        description:
          "Split makes Dalmatian charter trips easier to execute well.",
        emoji: "🧭",
      },
      {
        title: "Good city balance",
        description:
          "It adds enough city life without overpowering the sea element.",
        emoji: "🏙️",
      },
      {
        title: "Route-friendly",
        description:
          "The islands feel naturally reachable from here.",
        emoji: "🌊",
      },
    ],
    faqs: makeFaqs("Split", "Dalmatian Coast"),
  }),

  destination({
    slug: "dubrovnik",
    title: "Dubrovnik",
    country: "Croatia",
    region: "Dalmatian Coast",
    heroImage: "/destinations/Croatia.png",
    subtitle: "A dramatic walled city with huge visual recognition and strong coastal prestige.",
    vibeTags: ["Historic", "Iconic", "Croatia"],
    quickFacts: {
      bestTime: "May–September",
      idealStay: "2–4 days",
      budget: "€€€",
      vibe: "Historic, scenic, polished",
      gettingAround: "Walkable old city, local transfers and harbour access",
    },
    overview:
      "Dubrovnik is one of Croatia’s biggest visual assets. It combines fortified-city drama with coastal prestige and creates a very different kind of Croatian stop from lighter island rhythm destinations.",
    whyItWorks:
      "It works because the arrival feels memorable even before the boating begins. Dubrovnik is a destination with narrative built in.",
    signatureExperiences: [
      "Approaching one of the Adriatic’s most visually striking cities",
      "Using Dubrovnik as a prestige stop on a wider route",
      "Adding old-city drama to a swim-led itinerary",
      "Building a trip around one major high-recognition anchor",
    ],
    bestFor: [
      "Historic coastal stays",
      "Prestige Croatia stops",
      "Photo-led itineraries",
      "Short high-impact visits",
    ],
    localTips: [
      "Dubrovnik works especially well as a strong anchor point rather than an ultra-slow base.",
      "Its visual intensity is part of the appeal, so time arrival well.",
      "Pair it with calmer island days for better rhythm.",
    ],
    links: makeLinks(
      "dubrovnik",
      "Harbour approaches, city highlights and Dubrovnik-by-boat ideas.",
      "High-impact route planning around Dubrovnik.",
      "Practical harbour access and calmer nearby stopovers."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Dubrovnik tourism",
        description: "Official tourism site for Dubrovnik.",
        href: "https://www.tzdubrovnik.hr/lang/en/index.html",
        type: "Official",
      },
      {
        title: "What to see in Dubrovnik",
        description: "Official destination inspiration and local highlights.",
        href: "https://www.tzdubrovnik.hr/lang/en/get/dubrovnik/6227/what_to_see.html",
        type: "Guide",
      },
      {
        title: "Useful information",
        description: "Practical visitor details and planning support.",
        href: "https://www.tzdubrovnik.hr/lang/en/get/planning_your_trip/6206/useful_information.html",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Huge visual impact",
        description:
          "Dubrovnik makes a strong impression before you even step ashore.",
        emoji: "🏰",
      },
      {
        title: "Prestige stop value",
        description:
          "It can elevate the perceived quality of a wider Croatia itinerary.",
        emoji: "✨",
      },
      {
        title: "Historic drama",
        description:
          "It adds a different emotional tone from island-only planning.",
        emoji: "📸",
      },
    ],
    faqs: makeFaqs("Dubrovnik", "Dalmatian Coast"),
  }),

  destination({
    slug: "hvar",
    title: "Hvar",
    country: "Croatia",
    region: "Dalmatian Coast",
    heroImage: "/destinations/Croatia.png",
    subtitle: "One of Croatia’s best-known island names for social energy, boating appeal and easy glamour.",
    vibeTags: ["Island", "Social", "Croatia"],
    quickFacts: {
      bestTime: "May–September",
      idealStay: "2–4 days",
      budget: "€€€",
      vibe: "Social, sunny, polished",
      gettingAround: "Boat plus local island transfers",
    },
    overview:
      "Hvar is one of Croatia’s strongest lifestyle boating names. It blends island beauty, social energy and recognisable Adriatic charm in a way that has broad appeal.",
    whyItWorks:
      "It works because it sits in the sweet spot between island relaxation and social visibility.",
    signatureExperiences: [
      "Using Hvar as the lively centrepiece of a Croatia route",
      "Balancing harbour energy with swim-led days nearby",
      "Building a trip around one of the Adriatic’s best-known island names",
      "Mixing social evenings with easy coastal movement",
    ],
    bestFor: [
      "Social island trips",
      "Friends charters",
      "Croatia first-timers",
      "Recognisable Adriatic planning",
    ],
    localTips: [
      "Hvar works best when balanced with calmer nearby stopovers.",
      "It is a good social anchor in an otherwise scenic route.",
      "Peak summer can feel busy, so route timing matters.",
    ],
    links: makeLinks(
      "hvar",
      "Harbour life, island highlights and Hvar-by-boat essentials.",
      "Easy Adriatic route ideas around Hvar.",
      "Practical harbour use and calmer nearby anchorage logic."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Hvar tourism",
        description: "Official tourism information for Hvar.",
        href: "https://visithvar.hr/",
        type: "Official",
      },
      {
        title: "Explore Hvar",
        description: "Official local inspiration and destination highlights.",
        href: "https://visithvar.hr/explore-hvar/",
        type: "Guide",
      },
      {
        title: "Plan your visit",
        description: "Useful practical information for travellers.",
        href: "https://visithvar.hr/plan-your-visit/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Strong social pull",
        description:
          "Hvar is one of Croatia’s clearest lifestyle names.",
        emoji: "🥂",
      },
      {
        title: "Island-beauty balance",
        description:
          "It gives both visual payoff and usable route logic.",
        emoji: "🌊",
      },
      {
        title: "Easy recognisability",
        description:
          "Many users already understand what Hvar represents.",
        emoji: "🗺️",
      },
    ],
    faqs: makeFaqs("Hvar", "Dalmatian Coast"),
  }),

  destination({
    slug: "kotor",
    title: "Kotor",
    country: "Montenegro",
    region: "Bay of Kotor",
    heroImage: "/destinations/Croatia.png",
    subtitle: "A dramatic enclosed-bay setting with mountain-backed harbour scenery and strong visual identity.",
    vibeTags: ["Bay", "Scenic", "Historic"],
    quickFacts: {
      bestTime: "May–September",
      idealStay: "2–4 days",
      budget: "€€",
      vibe: "Dramatic, scenic, historic",
      gettingAround: "Local transfers and bay-based movement",
    },
    overview:
      "Kotor stands apart because the bay itself creates the drama. The boating experience is shaped less by island-hopping and more by enclosed-water scenery, vertical landscapes and historic-town atmosphere.",
    whyItWorks:
      "It works for travellers who want a more unusual Adriatic mood than the standard island route pattern.",
    signatureExperiences: [
      "Cruising through a bay landscape that feels visually enclosed and cinematic",
      "Using Kotor as a scenic contrast to open-coast Adriatic planning",
      "Blending fortified-town atmosphere with dramatic mountain backdrop",
      "Building a trip around one distinct geographic mood",
    ],
    bestFor: [
      "Scenic Adriatic alternatives",
      "Historic bay settings",
      "Users wanting something different from standard island-hopping",
      "Photo-led itineraries",
    ],
    localTips: [
      "Kotor shines because it feels geographically different from the wider coast.",
      "Use it when you want atmospheric contrast in an Adriatic route.",
      "It is especially strong for visually memorable arrivals.",
    ],
    links: makeLinks(
      "kotor",
      "Bay highlights, harbour approaches and Kotor-by-boat planning.",
      "Scenic bay-route ideas and distinctive stop logic.",
      "Harbour use, practical bay stops and calmer moments."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Kotor tourism",
        description: "Official tourism information for Kotor.",
        href: "https://www.tokotor.me/en",
        type: "Official",
      },
      {
        title: "Explore Kotor",
        description: "Official local highlights and destination context.",
        href: "https://www.tokotor.me/en/explore-kotor",
        type: "Guide",
      },
      {
        title: "Useful info",
        description: "Practical planning support for visitors.",
        href: "https://www.tokotor.me/en/useful-information",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Distinctive geography",
        description:
          "Kotor looks and feels different from open-coast Adriatic stops.",
        emoji: "⛰️",
      },
      {
        title: "Memorable arrivals",
        description:
          "The bay itself creates a stronger sense of place.",
        emoji: "📸",
      },
      {
        title: "Great contrast stop",
        description:
          "It adds visual and emotional variation to wider regional routes.",
        emoji: "🌊",
      },
    ],
    faqs: makeFaqs("Kotor", "Bay of Kotor"),
  }),

  destination({
    slug: "corfu",
    title: "Corfu",
    country: "Greece",
    region: "Ionian Islands",
    heroImage: "/destinations/Greece.png",
    subtitle: "A greener Greek island with easy Ionian appeal and softer island-hopping energy.",
    vibeTags: ["Ionian", "Island", "Relaxed"],
    quickFacts: {
      bestTime: "May–September",
      idealStay: "3–5 days",
      budget: "€€",
      vibe: "Green, relaxed, classic",
      gettingAround: "Boat plus island road transfers",
    },
    overview:
      "Corfu offers a different flavour of Greece from the Cycladic postcard image. It feels greener, softer and often easier-going, which can be a major strength depending on the trip.",
    whyItWorks:
      "It works for users who want Greek island value without needing the most famous or busiest island names.",
    signatureExperiences: [
      "Using Corfu as an Ionian base with softer rhythm",
      "Blending island scenery with easier day pacing",
      "Building a Greek trip around greener landscapes and calmer mood",
      "Choosing a more relaxed island identity within Greece",
    ],
    bestFor: [
      "Ionian island-hopping",
      "Relaxed Greek trips",
      "Family-friendly planning",
      "Users wanting softer Greek mood",
    ],
    localTips: [
      "Corfu works well when you want Greece without maximum Cycladic pressure.",
      "It is a strong option for easier-paced island itineraries.",
      "The Ionian feel is different enough that region choice really matters.",
    ],
    links: makeLinks(
      "corfu",
      "Ionian highlights, island planning and Corfu boating essentials.",
      "Relaxed Greek route ideas around Corfu.",
      "Practical bases and calmer island stopovers."
    ),
    internalLinks: makeInternalLinks(),
    localResources: [
      {
        title: "Visit Greece Corfu",
        description: "Official tourism context for Corfu.",
        href: "https://www.visitgreece.gr/islands/ionian-islands/corfu/",
        type: "Official",
      },
      {
        title: "Ionian Islands overview",
        description: "Useful wider region context for route planning.",
        href: "https://www.visitgreece.gr/islands/ionian-islands/",
        type: "Guide",
      },
      {
        title: "Travel tips for Greece",
        description: "Practical visitor information from the official tourism board.",
        href: "https://www.visitgreece.gr/before-travelling-to-greece/travel-tips/",
        type: "Travel",
      },
    ],
    highlights: [
      {
        title: "Softer Greek mood",
        description:
          "Corfu gives a more relaxed feel than Greece’s most pressured island names.",
        emoji: "🌿",
      },
      {
        title: "Good Ionian access",
        description:
          "It works well as a base for easier-going route planning.",
        emoji: "🧭",
      },
      {
        title: "Broad appeal",
        description:
          "It suits couples, families and relaxed island-hopping alike.",
        emoji: "🌅",
      },
    ],
    faqs: makeFaqs("Corfu", "Ionian Islands"),
  }),
];

export function getDestinationBySlug(slug: string): DestinationPageData | null {
  return DESTINATION_PAGES.find((d) => d.slug === slug) ?? null;
}

export function getRelatedDestinations(
  slug: string,
  limit = 3
): DestinationPageData[] {
  const current = getDestinationBySlug(slug);
  if (!current) return DESTINATION_PAGES.slice(0, limit);

  const scored = DESTINATION_PAGES.filter((d) => d.slug !== slug).map((d) => {
    let score = 0;
    if (d.country === current.country) score += 3;
    if (d.region === current.region) score += 3;
    if (d.vibeTags.some((tag) => current.vibeTags.includes(tag))) score += 2;
    return { d, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .map((x) => x.d)
    .slice(0, limit);
}