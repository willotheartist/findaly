//·app/guides/catamaran-buying-guide/page.tsx
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
  { id: "why", label: "Why catamarans" },
  { id: "types", label: "Catamaran types" },
  { id: "layouts", label: "Layouts & cabins" },
  { id: "handling", label: "Handling & docking" },
  { id: "costs", label: "Ownership costs" },
  { id: "pricing", label: "Price ranges" },
  { id: "shortlist", label: "Shortlisting models" },
  { id: "inspection", label: "Inspection checklist" },
  { id: "sea-trial", label: "Sea trial focus" },
  { id: "paperwork", label: "Paperwork & VAT" },
  { id: "resale", label: "Resale & liquidity" },
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
  { value: "Space", label: "Huge volume for length — liveaboard friendly" },
  { value: "Stable", label: "Comfort at anchor is the main advantage" },
  { value: "Draft", label: "Shallow draft unlocks bays and beaches" },
  { value: "Beam", label: "Beam drives berth cost and docking constraints" },
]

const quickTopics = [
  "Catamaran buying guide",
  "Sailing catamaran vs power catamaran",
  "Catamaran docking tips",
  "Catamaran ownership costs",
  "Used catamaran checklist",
  "Catamaran survey checklist",
  "Best catamaran for liveaboard",
  "Catamaran resale value",
]

type TypeCard = {
  title: string
  subtitle: string
  bestFor: string
  watchOut: string
  links?: { label: string; href: string }[]
}

const catTypes: TypeCard[] = [
  {
    title: "Sailing catamarans",
    subtitle: "Wind-first cruising with excellent comfort at anchor",
    bestFor: "Longer seasons, liveaboard style, island hopping, efficiency",
    watchOut: "Rig and sail condition, standing rigging age, deck hardware loads",
  },
  {
    title: "Power catamarans",
    subtitle: "Motor-led stability and space, often faster in calm conditions",
    bestFor: "Comfort-first owners, day-to-week cruising, predictable passage planning",
    watchOut: "Fuel burn, propulsion wear, higher systems load, resale depends on brand",
  },
  {
    title: "Charter-oriented cats",
    subtitle: "Built for volume, cabins, and turnover — not always private-owner spec",
    bestFor: "Buyers who understand charter history and price it properly",
    watchOut: "Hard miles, cosmetic cover-ups, systems fatigue, inconsistent maintenance",
    links: [{ label: "Consider charter first", href: "/charter" }],
  },
]

type LayoutRow = {
  layout: string
  bestFor: string
  tradeoff: string
}

const layoutTable: LayoutRow[] = [
  {
    layout: "Owner version (3-cabin)",
    bestFor: "Couples / long stays onboard, more storage, better comfort",
    tradeoff: "Fewer guest cabins; often higher price and stronger demand",
  },
  {
    layout: "4-cabin (private owner + guests)",
    bestFor: "Family cruising and hosting",
    tradeoff: "Less storage per cabin; systems still need strong care",
  },
  {
    layout: "5–6 cabin (charter layout)",
    bestFor: "Charter operations, groups, high capacity",
    tradeoff: "Harder private ownership feel; wear and turnover risk",
  },
]

type HandlingRow = {
  topic: string
  whatToKnow: string
  commonMistake: string
}

const handlingTable: HandlingRow[] = [
  {
    topic: "Beam + marina planning",
    whatToKnow: "Beam is the constraint: not every marina berth fits, and pricing can jump.",
    commonMistake: "Choosing by length only; ignoring berth availability for beam.",
  },
  {
    topic: "Twin engines + close quarters",
    whatToKnow: "Many cats pivot well with twin engines — but windage is real.",
    commonMistake: "Overconfidence: wind + beam can punish slow maneuvers.",
  },
  {
    topic: "Under sail (sailing cats)",
    whatToKnow: "Different motion vs monohull; reef early; loads are higher on gear.",
    commonMistake: "Carrying too much sail; stressing rig and hardware.",
  },
  {
    topic: "Bridge deck / slamming",
    whatToKnow: "Sea state and design matter — some cats slam more in chop.",
    commonMistake: "Assuming all cats are equal; ignoring real-world ride reviews.",
  },
]

type RangeRow = {
  segment: string
  range: string
  whatDrivesIt: string
  bestFor: string
}

const rangeTable: RangeRow[] = [
  {
    segment: "Older used cats / entry point",
    range: "Often ~€150k–€400k",
    whatDrivesIt: "Rig age, engines hours, deck hardware, cosmetics vs systems truth",
    bestFor: "Value buyers who inspect hard and budget refits",
  },
  {
    segment: "Mid-market late-model used",
    range: "Often ~€400k–€1.0m",
    whatDrivesIt: "Owner version vs charter, inventory completeness, recent upgrades",
    bestFor: "Best balance: comfort + predictable ownership",
  },
  {
    segment: "Recent / premium / larger platforms",
    range: "Often ~€1.0m–€3.0m+",
    whatDrivesIt: "Brand demand, spec, watermaker, AC, lithium/electrical upgrades, condition",
    bestFor: "Long seasons aboard, high comfort, easier resale when maintained",
  },
]

const costReality = [
  "Berth costs can jump due to beam — budget for marina reality early",
  "Insurance varies by region and use; charter history changes terms",
  "Rigging, sails, and deck hardware are high-load items on sailing cats",
  "Generators/AC/watermakers are common big-ticket repairs if neglected",
  "Electrical systems (batteries/chargers/inverters) drive reliability",
  "On cats, “looks clean” can hide worn systems — buy the records",
]

const shortlistLogic = [
  "Decide sailing vs power cat first (use-case is everything)",
  "Choose layout (owner version vs charter layout) based on how you live aboard",
  "Check beam against your realistic marinas and cruising grounds",
  "Prefer boats with clear maintenance history and transparent charter records (if any)",
  "Prioritise electrical health + water systems (batteries, chargers, watermaker, pumps)",
]

const inspectionChecklist = [
  "Sailing cats: standing rigging age, mast and chainplates, sail condition, deck hardware loads",
  "Engines + diagnostics: cooling systems, service intervals, abnormal temps/pressures",
  "Generator + air-conditioning under load (not just “it turns on”)",
  "Electrical: batteries, chargers, inverters, shore power, wiring standards",
  "Water systems: watermaker condition, pumps, leaks, tanks, smells, filters",
  "Hull-to-deck joints, bridgedeck underside, signs of slamming stress (where relevant)",
  "Moisture readings on deck, around hatches/windows, and high-load hardware points",
  "Steering and rudders (where relevant), play in linkages, abnormal noises",
  "Through-hulls, seacocks, clamps, corrosion and bonding discipline",
  "Documentation: ownership chain, VAT/tax status, registration, liens, charter history",
]

const seaTrialFocus = [
  "Cold start behavior + smoke, idle stability, temps/pressure trends",
  "Acceleration and maneuvering in close quarters; thrusters if fitted",
  "Under load: generator + AC running, electrical stability",
  "Sailing cats: reefing behavior, sail handling friction, hardware load noises",
  "Ride quality in real sea state; note any bridgedeck slamming tendencies",
  "Post-trial checks: leaks, smells, heat, coolant residue, belt dust",
]

const faqs = [
  {
    q: "Are catamarans easier to live on than monohulls?",
    a: "Often, yes—catamarans offer huge volume for their length, excellent stability at anchor, and shallow draft for exploring bays. The tradeoff is beam: berthing and docking constraints can be more complex and more expensive.",
  },
  {
    q: "Sailing catamaran vs power catamaran — which is better?",
    a: "Sailing cats are typically more efficient over long seasons and can be rewarding to cruise with the wind. Power cats can be simpler for some owners and offer consistent passage planning, but fuel burn and propulsion wear matter more. Choose by your use-case and cruising style.",
  },
  {
    q: "What’s the biggest hidden cost with catamarans?",
    a: "Beam-driven marina costs and access. Many buyers choose by length, then get surprised when their preferred marinas can’t accommodate the beam or price it at a higher tier.",
  },
  {
    q: "Is it risky to buy an ex-charter catamaran?",
    a: "Not automatically, but you must price the wear correctly. Charter boats can have strong maintenance routines but heavy usage and cosmetic cover-ups. Records, systems testing under load, and a strong survey are essential.",
  },
  {
    q: "Do catamarans hold their value?",
    a: "Good ones do—especially owner versions with clean records and strong brands. Liquidity is strongest for proven platforms with transparent maintenance history and honest condition.",
  },
]

export default function CatamaranBuyingGuidePage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const schemas = useMemo(() => {
    const base = "https://www.findaly.co"
    const url = `${base}/guides/catamaran-buying-guide`

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
      headline: "Catamaran buying guide (2026): sailing vs power, costs, inspection checklist, resale",
      description:
        "A practical catamaran buying guide: sailing vs power catamarans, layouts, beam and marina planning, ownership costs, price bands, inspection checklist, sea trial focus, and resale considerations.",
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
        { "@type": "ListItem", position: 3, name: "Catamaran buying guide", item: url },
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
          <Image src="/hero-buy.jpg" alt="Catamaran buying guide — Findaly" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/70 via-[#0a211f]/35 to-[#f5f2eb]" />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.p
              className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#fff86c] mb-4"
              variants={fadeUp}
            >
              Buying Guide • Catamarans • Research
            </motion.p>

            <motion.h1
              className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl"
              variants={fadeUp}
            >
              Catamaran buying guide:{" "}
              <span className="text-[#fff86c]">sailing vs power</span> & what to inspect (2026).
            </motion.h1>

            <motion.p
              className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed"
              variants={fadeUp}
            >
              A practical guide for serious buyers — types, layouts, beam and marina planning, ownership costs,
              pricing bands, inspection priorities, sea-trial focus, and resale considerations.
            </motion.p>

            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href="/buy"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Browse catamarans
              </Link>
              <Link
                href="/charter"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                Charter first
              </Link>
            </motion.div>

            <motion.div className="mt-8 flex flex-wrap gap-2 justify-center max-w-3xl" variants={fadeUp}>
              {quickTopics.map((t) => (
                <span key={t} className="topic-chip">
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* STATS */}
        <motion.div
          className="mx-auto max-w-6xl px-6 -mt-2 relative z-10"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <motion.div key={s.label} className="stat-card" variants={fadeUp}>
                <div className="text-[22px] font-bold tracking-tight text-[#0a211f]">{s.value}</div>
                <div className="mt-2 text-[13px] leading-snug text-[#0a211f]/50">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* TWO-COLUMN BODY */}
        <div className="mx-auto mt-20 max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-5">
                <div className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/3 p-6">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-4">
                    On this guide
                  </p>
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
                      Compare real listings by size, brand, country and year — and keep beam in mind.
                    </p>
                    <Link
                      href="/buy"
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#fff86c] text-[13.5px] font-semibold text-[#0a211f]"
                    >
                      Browse yachts →
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                    Findaly hubs
                  </p>
                  <Link href="/buy" className="pillar-link">
                    <span>🛥️</span> Browse all yachts
                  </Link>
                  <Link href="/charter" className="pillar-link">
                    <span>🏝️</span> Charter
                  </Link>
                  <Link href="/finance" className="pillar-link">
                    <span>💰</span> Yacht finance
                  </Link>
                  <Link href="/brokers" className="pillar-link">
                    <span>🤝</span> Find a broker
                  </Link>
                </div>

                <div className="rounded-2xl border border-[#0a211f]/10 bg-[#0a211f]/2 p-5">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                    Related guides
                  </p>
                  <div className="space-y-2">
                    <Link href="/guides/motor-yacht-buying-guide" className="pillar-link">
                      <span>🚤</span> Motor yacht buying guide
                    </Link>
                    <Link href="/guides/yacht-types-explained" className="pillar-link">
                      <span>🧠</span> Types of yachts explained
                    </Link>
                    <Link href="/guides/beneteau-swift-trawler-buying-guide" className="pillar-link">
                      <span>🧭</span> Trawler-style ownership
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            <article className="article-body min-w-0">
              <section id="overview" className="scroll-mt-28">
                <p className="section-label">Overview</p>
                <h2 className="section-heading">Catamarans are not just “more space”. They change the whole game.</h2>
                <p>
                  Catamarans win on stability at anchor, volume for length, and shallow draft access.
                  But they also introduce a constraint that buyers underestimate: <strong>beam</strong>.
                  Beam affects where you can berth, how much it costs, and how confident you’ll feel docking in wind.
                </p>
                <p>
                  This guide is designed to help you choose the right type (sailing vs power), pick the right layout,
                  and buy used inventory without stepping on the classic landmines.
                </p>
                <div className="pull-quote">
                  “Catamaran happiness is beam planning + systems discipline.”
                </div>
              </section>

              <section id="why" className="mt-20 scroll-mt-28">
                <p className="section-label">Why catamarans</p>
                <h2 className="section-heading">Why buyers love cats — and where you must be sharp.</h2>
                <p>
                  Most buyers come for the comfort and stay for the lifestyle. The real advantages are stability at anchor,
                  huge outdoor living, and the ability to explore shallow bays. The real risks are systems fatigue (especially
                  on charter boats) and beam constraints that show up after purchase day.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Strengths vs watch-outs</div>
                    <div className="text-[12px] text-[#0a211f]/45">Practical lens</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">Strengths</div>
                      <ul className="mt-3">
                        <li>Outstanding stability at anchor</li>
                        <li>Huge interior volume for length</li>
                        <li>Shallow draft access to bays and beaches</li>
                        <li>Liveaboard-friendly layouts and storage (owner versions)</li>
                        <li>Strong demand in many cruising markets</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Watch-outs</div>
                      <ul className="mt-3">
                        <li>Beam: berth availability and marina pricing tiers</li>
                        <li>Windage in docking situations</li>
                        <li>Systems wear on ex-charter boats (generator/AC/watermaker)</li>
                        <li>Sailing cats: rig and deck hardware loads</li>
                        <li>Bridgedeck slamming is design + sea-state dependent</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="types" className="mt-20 scroll-mt-28">
                <p className="section-label">Catamaran types</p>
                <h2 className="section-heading">Sailing vs power catamarans — choose by use-case.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Types (best-fit + watch-outs)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Choose by how you cruise</div>
                  </div>

                  <div>
                    {catTypes.map((t) => (
                      <div key={t.title} className="row">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <div className="row-title">{t.title}</div>
                            <div className="row-meta">{t.subtitle}</div>
                          </div>
                          {t.links?.length ? (
                            <div className="flex gap-2 flex-wrap">
                              {t.links.map((l) => (
                                <Link
                                  key={l.href}
                                  href={l.href}
                                  className="inline-flex h-10 items-center justify-center rounded-xl border border-[#0a211f]/15 px-4 text-[13px] font-semibold text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors"
                                >
                                  {l.label} →
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        <p className="row-note">
                          <strong>Best for:</strong> {t.bestFor}
                        </p>
                        <p className="row-note mb-0!">
                          <strong>Watch-out:</strong> {t.watchOut}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="layouts" className="mt-20 scroll-mt-28">
                <p className="section-label">Layouts & cabins</p>
                <h2 className="section-heading">Owner version vs charter layout: it changes ownership.</h2>
                <p>
                  Layout selection is one of the best predictors of satisfaction. Owner versions are calmer and more
                  storage-friendly. Charter layouts can be great value, but only if you accept and price the wear.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Layout tradeoffs</div>
                    <div className="text-[12px] text-[#0a211f]/45">Choose by lifestyle</div>
                  </div>

                  <div className="row p-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="th">Layout</th>
                          <th className="th">Best for</th>
                          <th className="th">Tradeoff</th>
                        </tr>
                      </thead>
                      <tbody>
                        {layoutTable.map((r) => (
                          <tr key={r.layout}>
                            <td className="td"><strong>{r.layout}</strong></td>
                            <td className="td">{r.bestFor}</td>
                            <td className="td">{r.tradeoff}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section id="handling" className="mt-20 scroll-mt-28">
                <p className="section-label">Handling & docking</p>
                <h2 className="section-heading">Beam changes docking, and wind changes everything.</h2>
                <p>
                  Many cats maneuver well with twin engines, but windage and beam can punish slow moves. The right approach
                  is calm preparation, marina planning, and confidence with short bursts of thrust rather than hesitation.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Handling realities</div>
                    <div className="text-[12px] text-[#0a211f]/45">What buyers should learn early</div>
                  </div>

                  <div className="row p-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="th">Topic</th>
                          <th className="th">What to know</th>
                          <th className="th">Common mistake</th>
                        </tr>
                      </thead>
                      <tbody>
                        {handlingTable.map((r) => (
                          <tr key={r.topic}>
                            <td className="td"><strong>{r.topic}</strong></td>
                            <td className="td">{r.whatToKnow}</td>
                            <td className="td">{r.commonMistake}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section id="costs" className="mt-20 scroll-mt-28">
                <p className="section-label">Ownership costs</p>
                <h2 className="section-heading">The costs are predictable if you accept beam reality.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Cost reality</div>
                    <div className="text-[12px] text-[#0a211f]/45">The silent costs</div>
                  </div>
                  <div className="row">
                    <ul className="mt-0">
                      {costReality.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re financing, keep it practical:{" "}
                  <Link
                    href="/finance"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    yacht finance on Findaly
                  </Link>.
                </p>
              </section>

              <section id="pricing" className="mt-20 scroll-mt-28">
                <p className="section-label">Price ranges</p>
                <h2 className="section-heading">Pricing is mostly condition + inventory completeness.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Typical price bands (global)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Directional context</div>
                  </div>

                  <div className="row p-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="th">Segment</th>
                          <th className="th">Typical range</th>
                          <th className="th">Value drivers</th>
                          <th className="th">Best for</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rangeTable.map((r) => (
                          <tr key={r.segment}>
                            <td className="td"><strong>{r.segment}</strong></td>
                            <td className="td">{r.range}</td>
                            <td className="td">{r.whatDrivesIt}</td>
                            <td className="td">{r.bestFor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section id="shortlist" className="mt-20 scroll-mt-28">
                <p className="section-label">Shortlisting models</p>
                <h2 className="section-heading">Shortlist by use-case and layout — then buy the cleanest example.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Shortlisting logic</div>
                    <div className="text-[12px] text-[#0a211f]/45">Simple rules</div>
                  </div>
                  <div className="row">
                    <ul className="mt-0">
                      {shortlistLogic.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re buying internationally, broker support reduces risk:{" "}
                  <Link
                    href="/brokers"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    find a broker
                  </Link>.
                </p>
              </section>

              <section id="inspection" className="mt-20 scroll-mt-28">
                <p className="section-label">Inspection checklist</p>
                <h2 className="section-heading">Inspection checklist for a used catamaran.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Buyer checklist</div>
                    <div className="text-[12px] text-[#0a211f]/45">For walk-through + survey</div>
                  </div>
                  <div className="row">
                    <ul className="mt-0">
                      {inspectionChecklist.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section id="sea-trial" className="mt-20 scroll-mt-28">
                <p className="section-label">Sea trial focus</p>
                <h2 className="section-heading">Sea trial checklist: test under load, and respect sea state.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Sea trial focus</div>
                    <div className="text-[12px] text-[#0a211f]/45">Don’t rely on vibes</div>
                  </div>
                  <div className="row">
                    <ul className="mt-0">
                      {seaTrialFocus.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section id="paperwork" className="mt-20 scroll-mt-28">
                <p className="section-label">Paperwork & VAT</p>
                <h2 className="section-heading">Paperwork isn’t admin — it’s the transaction.</h2>
                <p>
                  Catamarans are often bought and sold internationally. Your paperwork checklist should include ownership chain,
                  VAT/tax status, registration, CE compliance (where relevant), and any finance liens.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/brokers"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]"
                  >
                    Find a broker →
                  </Link>
                  <Link
                    href="/buy"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-[#0a211f]/15 px-7 text-[14.5px] font-medium text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors"
                  >
                    Browse inventory →
                  </Link>
                </div>
              </section>

              <section id="resale" className="mt-20 scroll-mt-28">
                <p className="section-label">Resale & liquidity</p>
                <h2 className="section-heading">Resale is strongest when you buy the right layout + history.</h2>
                <p>
                  Owner versions with clean records tend to sell best. Ex-charter boats can still sell well if the story is
                  transparent, the systems are healthy under load, and the price makes sense.
                </p>

                <div className="pull-quote">
                  “Liquidity is earned. It’s the reward for maintenance discipline.”
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
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#fff86c]/70 mb-4">
                    Ready to browse?
                  </p>
                  <h3 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.1] text-white tracking-tight">
                    Find a catamaran with confidence.
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                    Compare real listings, choose the right layout, and protect your downside with a strong survey and sea trial.
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                    <Link
                      href="/buy"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                    >
                      Browse yachts
                    </Link>
                    <Link
                      href="/charter"
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                    >
                      Charter first
                    </Link>
                  </div>
                </div>
              </section>

              <div className="mt-16 mb-8">
                <div className="border-t border-[#0a211f]/8 pt-6">
                  <nav className="flex items-center gap-2 text-[13px] text-[#0a211f]/35">
                    <Link href="/" className="hover:text-[#0a211f]/60 transition-colors">
                      Home
                    </Link>
                    <span>/</span>
                    <span className="text-[#0a211f]/60">Guides</span>
                    <span>/</span>
                    <span className="text-[#0a211f]/60">Catamaran buying guide</span>
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