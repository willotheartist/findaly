"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease },
  },
}

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
}

const tocSections = [
  { id: "overview", label: "Overview" },
  { id: "big-families", label: "The big families" },
  { id: "hulls", label: "Hull types explained" },
  { id: "use-cases", label: "Use-case matching" },
  { id: "size-bands", label: "Size bands & reality" },
  { id: "budget", label: "Budget bands" },
  { id: "ownership", label: "Ownership reality" },
  { id: "buy-vs-charter", label: "Buy vs charter" },
  { id: "shortlist", label: "Shortlisting checklist" },
  { id: "faq", label: "FAQ" },
]

function useTocTracker() {
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) setActiveId((visible[0].target as HTMLElement).id)
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    )

    tocSections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return activeId
}

/* ───────────────────────────────────────────
   CONTENT
   ─────────────────────────────────────────── */

const stats = [
  { value: "Clarity", label: "Choose by use-case, not aesthetics" },
  { value: "Reality", label: "Hull + systems decide comfort & cost" },
  { value: "Range", label: "Speed is expensive; efficiency is freedom" },
  { value: "Resale", label: "Liquidity follows popular platforms + records" },
]

const quickTopics = [
  "Types of yachts",
  "Motor yacht vs sailing yacht",
  "Trawler vs planing yacht",
  "Catamaran vs monohull",
  "Center console boats",
  "Superyacht categories",
  "Yacht size classes",
  "Best yacht type for beginners",
]

type FamilyCard = {
  title: string
  subtitle: string
  bestFor: string
  watchOut: string
  links: { label: string; href: string }[]
}

const families: FamilyCard[] = [
  {
    title: "Motor yachts",
    subtitle: "Planing, semi-displacement, and displacement cruisers",
    bestFor: "Comfort, easy entertaining, faster passages, coastal cruising",
    watchOut: "Fuel burn, systems complexity, maintenance discipline",
    links: [
      { label: "Motor yacht buying guide", href: "/guides/motor-yacht-buying-guide" },
      { label: "Browse yachts for sale", href: "/buy" },
    ],
  },
  {
    title: "Sailing yachts",
    subtitle: "Monohull sailboats for passagemaking + lifestyle sailing",
    bestFor: "Efficiency, long-range cruising, sailing lifestyle",
    watchOut: "Rigging condition, sail inventory, deck leaks, rigging replacement cycles",
    links: [{ label: "Browse yachts for sale", href: "/buy" }],
  },
  {
    title: "Catamarans",
    subtitle: "Sailing cats + power cats (space + stability)",
    bestFor: "Liveaboard comfort, charter-style layouts, shallow draft cruising",
    watchOut: "Bridge-deck slamming, daggerboards, load sensitivity, dockage costs (beam)",
    links: [
      { label: "Catamaran buying guide", href: "/guides/catamaran-buying-guide" },
      { label: "Browse yachts for sale", href: "/buy" },
    ],
  },
  {
    title: "Trawlers",
    subtitle: "Displacement cruisers built for economy + range",
    bestFor: "Comfortable cruising, long seasons, predictable passages",
    watchOut: "Stabiliser maintenance, corrosion/through-hulls, heavy systems stacks",
    links: [
      { label: "Beneteau Swift Trawler guide", href: "/guides/beneteau-swift-trawler-buying-guide" },
      { label: "Browse yachts for sale", href: "/buy" },
    ],
  },
  {
    title: "Center consoles",
    subtitle: "Day boats for speed, fishing, and easy use",
    bestFor: "Day trips, fishing, minimal interior maintenance",
    watchOut: "Weather exposure, storage limits, high-speed wear, trailer/transport realities",
    links: [{ label: "Browse yachts for sale", href: "/buy" }],
  },
  {
    title: "Superyachts",
    subtitle: "Large yachts, crewed operations, global cruising",
    bestFor: "Luxury, extended cruising, full-service ownership experience",
    watchOut: "Crew costs, compliance, refit cycles, operational overhead",
    links: [{ label: "Find a broker", href: "/brokers" }],
  },
]

type HullRow = {
  hull: string
  whatItIs: string
  feelsLike: string
  typicalTradeoff: string
}

const hullTable: HullRow[] = [
  {
    hull: "Planing",
    whatItIs: "Hull designed to rise and skim at speed.",
    feelsLike: "Fast, exciting, great for quick coastal hops.",
    typicalTradeoff: "Fuel burn climbs fast; comfort depends on sea state and stabilisation.",
  },
  {
    hull: "Semi-displacement",
    whatItIs: "Hybrid approach: efficient at moderate speeds, capable in more conditions.",
    feelsLike: "Balanced cruising; comfortable and practical.",
    typicalTradeoff: "Not the fastest, not the cheapest—best for owners who actually cruise.",
  },
  {
    hull: "Displacement (trawler-style)",
    whatItIs: "Designed to push water efficiently rather than climb on top of it.",
    feelsLike: "Calm, steady, long-range cruising comfort.",
    typicalTradeoff: "Lower top speed; systems and weight make maintenance discipline essential.",
  },
  {
    hull: "Catamaran (twin hull)",
    whatItIs: "Two hulls create wide beam, stability, and space.",
    feelsLike: "Stable at anchor; huge living space; shallow draft options.",
    typicalTradeoff: "Beam affects marina costs; performance depends heavily on loading.",
  },
]

type SizeBand = {
  band: string
  typicalUse: string
  reality: string
  bestFor: string
}

const sizeBands: SizeBand[] = [
  {
    band: "25–35ft",
    typicalUse: "Day + weekend cruising",
    reality: "Most owners use it often because it’s easy to handle and berth.",
    bestFor: "First-time owners, simple ownership, frequent use.",
  },
  {
    band: "35–45ft",
    typicalUse: "Serious weekends, short trips, light liveaboard",
    reality: "The “sweet spot” for comfort vs complexity in many markets.",
    bestFor: "Couples/families who cruise regularly and want real comfort.",
  },
  {
    band: "45–60ft",
    typicalUse: "Longer seasons, more guests, higher comfort",
    reality: "Systems stacks grow (generator/AC/stabilisers). Costs scale quickly.",
    bestFor: "Owners who want extended time onboard and can maintain properly.",
  },
  {
    band: "60ft+",
    typicalUse: "Luxury + crewed operations",
    reality: "Operational overhead matters more than purchase price.",
    bestFor: "Owners using brokers/management and prioritising experience.",
  },
]

type BudgetRow = {
  band: string
  whatYouActuallyGet: string
  biggestRisk: string
  bestMove: string
}

const budgetTable: BudgetRow[] = [
  {
    band: "€50k–€150k",
    whatYouActuallyGet: "Older boats: great value if maintained, risky if neglected.",
    biggestRisk: "Deferred maintenance (rigging, engines, electrics, osmosis, leaks).",
    bestMove: "Buy the survey + records. Walk quickly if the story is messy.",
  },
  {
    band: "€150k–€500k",
    whatYouActuallyGet: "More options across sail + smaller motor yachts; better inventory.",
    biggestRisk: "Systems upgrades coming due (batteries, nav, HVAC, sails/rigging).",
    bestMove: "Prioritise clean history and a boat you’ll actually use often.",
  },
  {
    band: "€500k–€1.5m",
    whatYouActuallyGet: "Modern platforms, better comfort, stronger resale if cared for.",
    biggestRisk: "Complexity: generator/AC/stabilisers become non-negotiable maintenance.",
    bestMove: "Model selection matters. Choose a platform with broad demand.",
  },
  {
    band: "€1.5m+",
    whatYouActuallyGet: "Premium ownership experience—if operated properly.",
    biggestRisk: "Operating cost shock (crew, refit cycles, compliance).",
    bestMove: "Use professional brokers and treat it like a managed asset.",
  },
]

const shortlistChecklist = [
  "Define your real use-case: day trips, weekends, seasons, or passagemaking",
  "Choose your hull type first (planing vs semi-displacement vs displacement / cat)",
  "Set a realistic ownership budget (berth, insurance, servicing, upgrades)",
  "Shortlist 3–5 proven platforms (popular models sell easier later)",
  "Inspect systems before cosmetics: engines, generator, AC, electrics, corrosion",
  "Sea trial under load + professional survey (non-negotiable)",
  "If cross-border: VAT/tax status, registration, liens, clear closing timeline",
]

const faqs = [
  {
    q: "What are the main types of yachts?",
    a: "Most yachts fall into a few families: motor yachts (planing/semi-displacement), sailing yachts (monohull), catamarans (sailing or power), trawlers (displacement), center consoles (day boats), and superyachts (crewed operations). The right choice depends on use-case, comfort expectations, and maintenance appetite.",
  },
  {
    q: "Which yacht type is best for beginners?",
    a: "Many first-time buyers succeed with manageable platforms that encourage frequent use: smaller motor yachts or sailing yachts in the 25–45ft range. The key is choosing a boat that’s easy to berth, easy to handle, and backed by a clear service history.",
  },
  {
    q: "What’s the difference between a trawler and a motor yacht?",
    a: "A trawler is typically displacement-focused: efficient at lower speeds with a range-first mindset. Many “motor yachts” are planing or semi-displacement and prioritise higher speed. The difference shows up in fuel burn, comfort profile, and operating rhythm.",
  },
  {
    q: "Are catamarans safer or more stable?",
    a: "Catamarans are often more stable at anchor and offer huge space, but stability underway depends on design and loading. They also introduce different considerations: beam affects marinas, performance is load-sensitive, and some designs can slam in chop.",
  },
  {
    q: "Should I buy or charter first?",
    a: "Chartering can be a smart way to test layouts and liveability before buying—especially for catamarans and larger motor yachts. If you’re unsure about size or hull type, chartering first often saves money and prevents “wrong boat” regret.",
  },
]

export default function YachtTypesExplainedPage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const schemas = useMemo(() => {
    const base = "https://www.findaly.co"
    const url = `${base}/guides/yacht-types-explained`

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Types of yachts explained (2026): hulls, categories, and how to choose",
      description:
        "A practical guide to yacht types: motor yachts, sailing yachts, catamarans, trawlers, center consoles and superyachts — with hull explanations, size bands, budget reality, and a shortlisting checklist.",
      author: { "@type": "Organization", name: "Findaly" },
      publisher: {
        "@type": "Organization",
        name: "Findaly",
        logo: { "@type": "ImageObject", url: `${base}/logo.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      image: [`${base}/hero-buy.jpg`],
      datePublished: "2026-02-20",
      dateModified: "2026-02-20",
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${base}/guides` },
        { "@type": "ListItem", position: 3, name: "Types of yachts explained", item: url },
      ],
    }

    return { faqSchema, articleSchema, breadcrumbSchema }
  }, [])

  return (
    <>
      <style>{`
        .pillar-page { background-color: #f5f2eb; color: #1a1a1a; }
        .article-body p { font-size: 17px; line-height: 1.75; color: rgba(10,33,31,0.7); margin-bottom: 1.5rem; }
        .article-body strong { color: #0a211f; font-weight: 600; }
        .article-body ul { margin: 0 0 1.25rem 1.25rem; color: rgba(10,33,31,0.7); }
        .article-body li { margin: 0.55rem 0; line-height: 1.65; font-size: 16px; }
        .section-label { font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #0a211f; opacity: 0.4; margin-bottom: 0.75rem; }
        .section-heading { font-size: clamp(28px, 3.5vw, 40px); line-height: 1.15; letter-spacing: -0.02em; color: #0a211f; margin-bottom: 1.75rem; font-weight: 600; }
        .pull-quote { font-size: clamp(22px, 2.8vw, 32px); line-height: 1.4; color: #0a211f; border-left: 3px solid #fff86c; padding-left: 1.5rem; margin: 2.5rem 0; font-style: italic; opacity: 0.85; }
        .toc-link { display: block; padding: 6px 0; font-size: 13.5px; color: rgba(10,33,31,0.35); transition: color 0.2s; text-decoration: none; }
        .toc-link:hover { color: rgba(10,33,31,0.7); }
        .toc-link-active { color: #0a211f !important; font-weight: 600; }
        .toc-link-active::before { content: '—'; margin-right: 8px; color: #fff86c; }
        .stat-card { padding: 28px 24px; background: rgba(10,33,31,0.04); border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.08); }
        .pillar-link { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.1); font-size: 14px; font-weight: 500; color: #0a211f; text-decoration: none; transition: all 0.2s; background: rgba(10,33,31,0.02); }
        .pillar-link:hover { background: rgba(10,33,31,0.06); border-color: rgba(10,33,31,0.2); }
        .topic-chip { display: inline-flex; align-items: center; padding: 7px 10px; border-radius: 999px; border: 1px solid rgba(10,33,31,0.12); background: rgba(10,33,31,0.02); font-size: 12.5px; color: rgba(10,33,31,0.65); }
        .card { border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.08); background: rgba(10,33,31,0.03); overflow: hidden; }
        .card-head { background: rgba(10,33,31,0.06); padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .card-title { font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(10,33,31,0.55); }
        .row { padding: 18px; border-top: 1px solid rgba(10,33,31,0.06); }
        .row:first-child { border-top: none; }
        .row-title { font-size: 17px; font-weight: 700; color: #0a211f; letter-spacing: -0.01em; }
        .row-meta { font-size: 13px; color: rgba(10,33,31,0.55); margin-top: 6px; }
        .row-note { margin-top: 10px; font-size: 15px; line-height: 1.7; color: rgba(10,33,31,0.65); }
        .table { width: 100%; border-collapse: collapse; }
        .th, .td { padding: 14px 14px; border-top: 1px solid rgba(10,33,31,0.06); vertical-align: top; }
        .th { font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(10,33,31,0.55); background: rgba(10,33,31,0.03); }
        .td { font-size: 14.5px; line-height: 1.65; color: rgba(10,33,31,0.7); }
        .td strong { color: #0a211f; font-weight: 650; }
        .faq-item { border-bottom: 1px solid rgba(10,33,31,0.08); }
        .faq-question { width: 100%; text-align: left; padding: 20px 0; font-size: 16px; font-weight: 500; color: #0a211f; display: flex; justify-content: space-between; align-items: center; background: none; border: none; cursor: pointer; gap: 16px; }
        .faq-answer { font-size: 15px; line-height: 1.7; color: rgba(10,33,31,0.6); padding-bottom: 20px; }
      `}</style>

      <div className="pillar-page min-h-screen pb-0">
        {/* HERO */}
        <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
          <Image src="/hero-buy.jpg" alt="Types of yachts explained — Findaly" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/70 via-[#0a211f]/35 to-[#f5f2eb]" />

          <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" variants={stagger} initial="hidden" animate="show">
            <motion.p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#fff86c] mb-4" variants={fadeUp}>
              Guide • Yacht Types • Buying Research
            </motion.p>

            <motion.h1 className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl" variants={fadeUp}>
              Types of yachts explained:{" "}
              <span className="text-[#fff86c]">hulls, categories</span> & how to choose (2026).
            </motion.h1>

            <motion.p className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed" variants={fadeUp}>
              A practical overview — motor vs sail, trawlers, catamarans, size bands, budget reality, and the shortlist checklist that prevents “wrong boat” regret.
            </motion.p>

            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link href="/buy" className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90">
                Browse yachts for sale
              </Link>
              <Link href="/charter" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors">
                Explore charters
              </Link>
            </motion.div>

            <motion.div className="mt-8 flex flex-wrap gap-2 justify-center max-w-3xl" variants={fadeUp}>
              {quickTopics.map((t) => (
                <span key={t} className="topic-chip">{t}</span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* STATS */}
        <motion.div className="mx-auto max-w-6xl px-6 -mt-2 relative z-10" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <motion.div key={s.label} className="stat-card" variants={fadeUp}>
                <div className="text-[22px] font-bold tracking-tight text-[#0a211f]">{s.value}</div>
                <div className="mt-2 text-[13px] leading-snug text-[#0a211f]/50">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* BODY */}
        <div className="mx-auto mt-20 max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-5">
                <div className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/3 p-6">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-4">On this guide</p>
                  <nav>
                    {tocSections.map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className={`toc-link ${activeId === s.id ? "toc-link-active" : ""}`}
                        onClick={(e) => {
                          e.preventDefault()
                          document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })
                        }}
                      >
                        {s.label}
                      </a>
                    ))}
                  </nav>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#0a211f]/10">
                  <div className="relative h-44">
                    <Image src="/list-boat-cta.jpg" alt="Findaly — browse listings" fill sizes="280px" className="object-cover" />
                  </div>
                  <div className="bg-[#0a211f] p-5">
                    <p className="text-[15px] font-semibold text-white">Jump into live inventory</p>
                    <p className="mt-1.5 text-[13px] text-white/50 leading-relaxed">
                      Start with broad browsing, then narrow by brand, model, country and year as you learn what fits.
                    </p>
                    <Link href="/buy" className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#fff86c] text-[13.5px] font-semibold text-[#0a211f]">
                      Browse yachts →
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">Findaly shortcuts</p>
                  <Link href="/buy" className="pillar-link"><span>🛥️</span> Browse all yachts</Link>
                  <Link href="/charter" className="pillar-link"><span>🌊</span> Explore charters</Link>
                  <Link href="/finance" className="pillar-link"><span>💰</span> Yacht finance</Link>
                  <Link href="/brokers" className="pillar-link"><span>🤝</span> Find a broker</Link>
                  <Link href="/buy/brand/beneteau" className="pillar-link"><span>🏷️</span> Example: Beneteau hub</Link>
                </div>
              </div>
            </aside>

            <article className="article-body min-w-0">
              <section id="overview" className="scroll-mt-28">
                <p className="section-label">Overview</p>
                <h2 className="section-heading">Choosing a yacht is a use-case decision — not a style decision.</h2>
                <p>
                  Most buyers get stuck because they try to choose based on photos and vibes. The better approach is simple:
                  decide what you’ll actually do. Day trips? Weekends? Seasons onboard? Long-range cruising? Chartering?
                </p>
                <p>
                  This guide explains the main <strong>types of yachts</strong>, the hull styles that change comfort and cost,
                  and how to match a category to your lifestyle. Then you can browse inventory with clarity:
                  {" "}
                  <Link href="/buy" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    yachts for sale on Findaly
                  </Link>.
                </p>
                <div className="pull-quote">
                  “The best yacht is the one you’ll actually use — and can maintain without resenting it.”
                </div>
              </section>

              <section id="big-families" className="mt-20 scroll-mt-28">
                <p className="section-label">The big families</p>
                <h2 className="section-heading">The main yacht categories buyers compare.</h2>
                <p>
                  Nearly every buyer journey ends up inside a small set of families. Pick the family first, then size, then specific models.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Categories (best-fit + watch-outs)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Use these as decision anchors</div>
                  </div>

                  <div>
                    {families.map((f) => (
                      <div key={f.title} className="row">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <div className="row-title">{f.title}</div>
                            <div className="row-meta">{f.subtitle}</div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {f.links.map((l) => (
                              <Link key={l.href} href={l.href} className="inline-flex h-10 items-center justify-center rounded-xl border border-[#0a211f]/15 px-4 text-[13px] font-semibold text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors">
                                {l.label} →
                              </Link>
                            ))}
                          </div>
                        </div>

                        <p className="row-note"><strong>Best for:</strong> {f.bestFor}</p>
                        <p className="row-note mb-0!"><strong>Watch-out:</strong> {f.watchOut}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="hulls" className="mt-20 scroll-mt-28">
                <p className="section-label">Hull types explained</p>
                <h2 className="section-heading">Hull type is the hidden decision that shapes everything.</h2>
                <p>
                  Hull form changes fuel burn, comfort, range, and how stressful a passage feels. It’s also one of the best predictors of ownership satisfaction.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Hull styles (what they mean)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Practical, not theoretical</div>
                  </div>

                  <div className="row p-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="th">Hull type</th>
                          <th className="th">What it is</th>
                          <th className="th">Feels like</th>
                          <th className="th">Typical tradeoff</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hullTable.map((r) => (
                          <tr key={r.hull}>
                            <td className="td"><strong>{r.hull}</strong></td>
                            <td className="td">{r.whatItIs}</td>
                            <td className="td">{r.feelsLike}</td>
                            <td className="td">{r.typicalTradeoff}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re leaning motor, go deeper here:{" "}
                  <Link href="/guides/motor-yacht-buying-guide" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    motor yacht buying guide
                  </Link>.
                </p>
              </section>

              <section id="use-cases" className="mt-20 scroll-mt-28">
                <p className="section-label">Use-case matching</p>
                <h2 className="section-heading">Match the yacht type to how you’ll actually live.</h2>
                <p>
                  The cleanest way to choose: define your <strong>time horizon</strong> (day / weekend / season), your <strong>crew</strong>,
                  and whether you prioritise speed, range, or comfort at anchor.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Simple mapping</div>
                    <div className="text-[12px] text-[#0a211f]/45">A buyer-friendly shortcut</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">If you want speed + day trips</div>
                      <ul className="mt-3">
                        <li>Center consoles / day boats</li>
                        <li>Planing motor yachts</li>
                        <li>Short hops, marina-based ownership</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">If you want comfort + longer time aboard</div>
                      <ul className="mt-3">
                        <li>Catamarans (space + stability)</li>
                        <li>Semi-displacement motor yachts</li>
                        <li>Trawlers (range + calm passages)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re unsure, chartering first can save you a bad purchase:
                  {" "}
                  <Link href="/charter" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    explore yacht charters
                  </Link>.
                </p>
              </section>

              <section id="size-bands" className="mt-20 scroll-mt-28">
                <p className="section-label">Size bands & reality</p>
                <h2 className="section-heading">Size is not just comfort — it’s complexity.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Common yacht size bands</div>
                    <div className="text-[12px] text-[#0a211f]/45">What changes as you scale</div>
                  </div>

                  <div className="row p-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="th">Band</th>
                          <th className="th">Typical use</th>
                          <th className="th">Reality</th>
                          <th className="th">Best for</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeBands.map((r) => (
                          <tr key={r.band}>
                            <td className="td"><strong>{r.band}</strong></td>
                            <td className="td">{r.typicalUse}</td>
                            <td className="td">{r.reality}</td>
                            <td className="td">{r.bestFor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section id="budget" className="mt-20 scroll-mt-28">
                <p className="section-label">Budget bands</p>
                <h2 className="section-heading">Budget is a story about maintenance, not purchase price.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Budget reality (directional)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Use as context, not a promise</div>
                  </div>

                  <div className="row p-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="th">Band</th>
                          <th className="th">What you actually get</th>
                          <th className="th">Biggest risk</th>
                          <th className="th">Best move</th>
                        </tr>
                      </thead>
                      <tbody>
                        {budgetTable.map((r) => (
                          <tr key={r.band}>
                            <td className="td"><strong>{r.band}</strong></td>
                            <td className="td">{r.whatYouActuallyGet}</td>
                            <td className="td">{r.biggestRisk}</td>
                            <td className="td">{r.bestMove}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re financing, keep it sane:{" "}
                  <Link href="/finance" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    yacht finance on Findaly
                  </Link>.
                </p>
              </section>

              <section id="ownership" className="mt-20 scroll-mt-28">
                <p className="section-label">Ownership reality</p>
                <h2 className="section-heading">Ownership is a systems stack — and it scales with size.</h2>
                <p>
                  Bigger yachts aren’t just “more”. They’re more generators, more pumps, more batteries, more plumbing, more maintenance decisions.
                  The happiest owners choose a size they can maintain proactively.
                </p>

                <div className="pull-quote">
                  “If you want a calm yachting life, optimise for predictable systems — not peak Instagram.”
                </div>
              </section>

              <section id="buy-vs-charter" className="mt-20 scroll-mt-28">
                <p className="section-label">Buy vs charter</p>
                <h2 className="section-heading">Charter is the world’s best test drive.</h2>
                <p>
                  If you’re unsure about layout, beam, or whether you truly want a catamaran vs monohull — chartering first is often the smartest move.
                  It turns “I think” into “I know”.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/charter" className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]">
                    Explore charters →
                  </Link>
                  <Link href="/buy" className="inline-flex h-12 items-center justify-center rounded-xl border border-[#0a211f]/15 px-7 text-[14.5px] font-medium text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors">
                    Browse yachts for sale →
                  </Link>
                </div>
              </section>

              <section id="shortlist" className="mt-20 scroll-mt-28">
                <p className="section-label">Shortlisting checklist</p>
                <h2 className="section-heading">A shortlisting checklist that saves you months.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Buyer checklist</div>
                    <div className="text-[12px] text-[#0a211f]/45">Keep it simple and strict</div>
                  </div>
                  <div className="row">
                    <ul className="mt-0">
                      {shortlistChecklist.map((c) => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                </div>
              </section>

              <section id="faq" className="mt-20 scroll-mt-28">
                <p className="section-label">FAQ</p>
                <h2 className="section-heading">Quick answers buyers search for.</h2>

                <div className="mt-2 border-t border-[#0a211f]/8">
                  {faqs.map((faq, i) => (
                    <div key={i} className="faq-item">
                      <button
                        className="faq-question"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        aria-expanded={openFaq === i}
                      >
                        <span>{faq.q}</span>
                        <span className="text-[#0a211f]/30 text-xl shrink-0">{openFaq === i ? "−" : "+"}</span>
                      </button>
                      {openFaq === i && <p className="faq-answer">{faq.a}</p>}
                    </div>
                  ))}
                </div>

                <div className="mt-14 rounded-2xl bg-[#0a211f] p-10 md:p-14 text-center">
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#fff86c]/70 mb-4">Next step</p>
                  <h3 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.1] text-white tracking-tight">
                    Browse listings with a clearer shortlist.
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                    Use the guide, then compare real inventory — brand hubs, model pages, and country/year filters.
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                    <Link href="/buy" className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]">
                      Browse yachts
                    </Link>
                    <Link href="/finance" className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors">
                      Yacht finance
                    </Link>
                  </div>
                </div>
              </section>

              <div className="mt-16 mb-8">
                <div className="border-t border-[#0a211f]/8 pt-6">
                  <nav className="flex items-center gap-2 text-[13px] text-[#0a211f]/35">
                    <Link href="/" className="hover:text-[#0a211f]/60 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-[#0a211f]/60">Guides</span>
                    <span>/</span>
                    <span className="text-[#0a211f]/60">Types of yachts explained</span>
                  </nav>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* SCHEMAS */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }} />
      </div>
    </>
  )
}