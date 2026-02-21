export type GuideCard = {
  slug: string
  title: string
  subtitle: string
  excerpt: string
  tag: string
  image: string
  primaryCtaHref: string
  primaryCtaLabel: string
  secondaryCtaHref?: string
  secondaryCtaLabel?: string
}

export const GUIDES: GuideCard[] = [
  {
    slug: "buying-a-beneteau",
    title: "Buying a Beneteau",
    subtitle: "How to pick the right model, year, and spec",
    excerpt:
      "A practical buyer’s guide to Beneteau ownership: how to shortlist models, assess condition, negotiate, and buy clean.",
    tag: "Brand guide",
    image: "/hero-buy.jpg",
    primaryCtaHref: "/guides/buying-a-beneteau",
    primaryCtaLabel: "Open guide",
    secondaryCtaHref: "/buy/brand/beneteau",
    secondaryCtaLabel: "Browse Beneteau listings",
  },
  {
    slug: "beneteau-swift-trawler-buying-guide",
    title: "Beneteau Swift Trawler buying guide",
    subtitle: "Pricing, model comparison, and what to inspect",
    excerpt:
      "Real-world pricing bands, model comparisons, inspection checklist, sea-trial focus, paperwork, and resale logic.",
    tag: "Model range",
    image: "/hero-buy.jpg",
    primaryCtaHref: "/guides/beneteau-swift-trawler-buying-guide",
    primaryCtaLabel: "Open guide",
    secondaryCtaHref: "/buy/brand/beneteau",
    secondaryCtaLabel: "Browse Beneteau listings",
  },
  {
    slug: "beneteau-price-guide",
    title: "Beneteau price guide",
    subtitle: "What affects value, pricing bands, and negotiation",
    excerpt:
      "How Beneteau pricing actually works: spec, year, region, condition, and which upgrades move the needle.",
    tag: "Pricing",
    image: "/hero-buy.jpg",
    primaryCtaHref: "/guides/beneteau-price-guide",
    primaryCtaLabel: "Open guide",
    secondaryCtaHref: "/buy/brand/beneteau",
    secondaryCtaLabel: "Browse Beneteau listings",
  },
  {
    slug: "beneteau-oceanis-vs-first",
    title: "Beneteau Oceanis vs First",
    subtitle: "Cruising vs performance — which fits your lifestyle",
    excerpt:
      "A decision guide for buyers choosing between Oceanis comfort cruising and First performance DNA.",
    tag: "Comparison",
    image: "/hero-buy.jpg",
    primaryCtaHref: "/guides/beneteau-oceanis-vs-first",
    primaryCtaLabel: "Open guide",
    secondaryCtaHref: "/buy/brand/beneteau",
    secondaryCtaLabel: "Browse Beneteau listings",
  },
  {
    slug: "used-beneteau-checklist",
    title: "Used Beneteau checklist",
    subtitle: "Inspection checklist + survey priorities",
    excerpt:
      "A practical checklist to surface expensive truths early: engines, electrics, deck hardware, hull, paperwork.",
    tag: "Checklist",
    image: "/hero-buy.jpg",
    primaryCtaHref: "/guides/used-beneteau-checklist",
    primaryCtaLabel: "Open checklist",
    secondaryCtaHref: "/buy/brand/beneteau",
    secondaryCtaLabel: "Browse Beneteau listings",
  },

  // ✅ Page 3 we just created
  {
    slug: "catamaran-buying-guide",
    title: "Catamaran buying guide",
    subtitle: "Sailing vs power, layouts, costs, and inspection",
    excerpt:
      "Beam planning, marina reality, ownership costs, price bands, inspection checklist, and resale considerations.",
    tag: "Boat type",
    image: "/hero-buy.jpg",
    primaryCtaHref: "/guides/catamaran-buying-guide",
    primaryCtaLabel: "Open guide",
    secondaryCtaHref: "/buy",
    secondaryCtaLabel: "Browse yachts",
  },
]