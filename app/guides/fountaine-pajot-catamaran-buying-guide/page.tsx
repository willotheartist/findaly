// app/guides/fountaine-pajot-catamaran-buying-guide/page.tsx
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
  { id: "why", label: "Why Fountaine Pajot" },
  { id: "lineup", label: "Lineup & best-fit" },
  { id: "pricing", label: "Price ranges" },
  { id: "comparison", label: "Model comparison" },
  { id: "ownership", label: "Ownership reality" },
  { id: "inspection", label: "Inspection checklist" },
  { id: "sea-trial", label: "Sea trial focus" },
  { id: "paperwork", label: "Paperwork & VAT" },
  { id: "charter", label: "Charter vs private" },
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
   CONTENT (deep + structured)
   ─────────────────────────────────────────── */

const stats = [
  { value: "Liveable", label: "Layouts designed for real weeks onboard" },
  { value: "Efficient", label: "Comfortable speed + range per litre" },
  { value: "Proven", label: "Strong global fleet + service familiarity" },
  { value: "Liquid", label: "Healthy resale when spec + condition are right" },
]

const quickTopics = [
  "Fountaine Pajot catamaran",
  "Isla 40",
  "Astrea 42",
  "Lucia 40",
  "Saona 47",
  "Elba 45",
  "Used catamaran checklist",
  "Catamaran sea trial guide",
  "VAT & registration",
]

type RangeRow = {
  segment: string
  range: string
  whatDrivesIt: string
  bestFor: string
}

const rangeTable: RangeRow[] = [
  {
    segment: "Older / early generation used (smaller platforms)",
    range: "Often ~€250k–€550k",
    whatDrivesIt: "Charter history, rig/sails age, engines & saildrives, leaks, electronics, safety inventory",
    bestFor: "Value buyers who inspect hard and budget for refit/rigging",
  },
  {
    segment: "Mid generation used (popular 40–45ft band)",
    range: "Often ~€550k–€1.1m",
    whatDrivesIt: "Owner vs charter use, lithium/solar, nav suite, sail wardrobe, watermaker, condition + records",
    bestFor: "Most balanced: comfort + manageable complexity + easier resale",
  },
  {
    segment: "Late-model / high spec / larger platforms",
    range: "Often ~€1.0m–€2.0m+",
    whatDrivesIt: "Spec completeness (watermaker/AC/genset), upgrades, survey quality, inventory, marina location",
    bestFor: "Owners planning serious time aboard with predictable ownership",
  },
]

type ModelCard = {
  name: string
  slug: string
  bestFor: string
  watchOut: string
  valueDrivers: string[]
}

const models: ModelCard[] = [
  {
    name: "Lucia 40",
    slug: "lucia-40",
    bestFor: "Smaller crew wanting a proven 40ft platform with straightforward handling",
    watchOut: "Charter wear, saildrive seals, rigging age, water ingress around windows/hatches",
    valueDrivers: ["Owner-use history", "Rig/sails age + receipts", "Dry bilges + clean survey"],
  },
  {
    name: "Isla 40",
    slug: "isla-40",
    bestFor: "Modern 40ft sweet spot: comfort + volume without massive operating burden",
    watchOut: "Systems density for size (AC/genset), battery health, plumbing odours/leaks, electrics quality",
    valueDrivers: ["Solar/lithium done properly", "Watermaker health", "Up-to-date nav + clean records"],
  },
  {
    name: "Astrea 42",
    slug: "astrea-42",
    bestFor: "Families & frequent cruising: extra volume and range of layouts",
    watchOut: "Overloaded inventory (too much gear), light build issues if neglected, deck hardware bedding",
    valueDrivers: ["Clean sail wardrobe", "Engines + saildrives documented", "Dry core + no leaks"],
  },
  {
    name: "Elba 45",
    slug: "elba-45",
    bestFor: "More comfort + payload for longer seasons and liveaboard-style use",
    watchOut: "Increased systems complexity: watermaker, genset, AC, electrical, steering + autopilot",
    valueDrivers: ["Spec completeness", "Systems tested under load", "Well-run maintenance schedule"],
  },
  {
    name: "Saona 47",
    slug: "saona-47",
    bestFor: "Bigger crew / guests / charter-friendly size with strong onboard living",
    watchOut: "Charter wear, soft goods, engine hours, rigging fatigue, cosmetic masking of deeper issues",
    valueDrivers: ["Professional refit evidence", "Inventory list + logs", "Sea trial performance + survey"],
  },
]

type ComparisonRow = {
  model: string
  bestFor: string
  ownershipFeel: string
  keyChecks: string
  linkSlug: string
}

const comparisonRows: ComparisonRow[] = [
  {
    model: "Lucia 40",
    bestFor: "Entry to FP ecosystem with manageable size",
    ownershipFeel: "Simpler ownership if charter wear is low",
    keyChecks: "Rig age, saildrives, window leaks, engine hours vs servicing",
    linkSlug: "lucia-40",
  },
  {
    model: "Isla 40",
    bestFor: "Modern all-rounder with strong demand",
    ownershipFeel: "Comfort vs complexity sweet spot",
    keyChecks: "Electrical quality, batteries, watermaker, AC under load",
    linkSlug: "isla-40",
  },
  {
    model: "Astrea 42",
    bestFor: "Families who cruise often and host guests",
    ownershipFeel: "More volume, slightly more systems burden",
    keyChecks: "Deck hardware bedding, saildrive seals, payload habits",
    linkSlug: "astrea-42",
  },
  {
    model: "Elba 45",
    bestFor: "Longer seasons + liveaboard comfort",
    ownershipFeel: "Systems platform: amazing when maintained",
    keyChecks: "Genset/AC, steering/autopilot, electrical load stability",
    linkSlug: "elba-45",
  },
  {
    model: "Saona 47",
    bestFor: "Bigger crew / charterable platform",
    ownershipFeel: "High comfort; history matters massively",
    keyChecks: "Charter wear, rigging fatigue, surveys, inventory truth",
    linkSlug: "saona-47",
  },
]

const inspectionChecklist = [
  "Full rig inspection: standing rigging age, chainplates, mast base, corrosion evidence, tuning history",
  "Sails: age + condition (UV, shape), sail inventory completeness vs your use-case",
  "Engines + diagnostics + service history; verify hours and compare to invoices (not stories)",
  "Saildrives: seals, oil condition, corrosion, maintenance intervals, any history of water ingress",
  "Electrical system: batteries (type/age), chargers, inverters, wiring standards, load testing",
  "Generator + air-conditioning (if fitted) under load — sustained run, not “it turns on”",
  "Watermaker output + maintenance history (membranes, pre-filters, flushing routine)",
  "Hull/deck moisture and core checks, especially around hatches, windows, deck fittings",
  "Steering, rudders, bearings, autopilot function, sail handling hardware and winches",
  "Plumbing: odours, leaks, tank condition, bilge pumps/alarms, through-hulls and seacocks",
  "Bridge deck + slamming indicators (not always bad, but you want evidence of proper use)",
  "Documentation: VAT/tax status, ownership chain, registration, CE compliance where relevant, liens",
]

const seaTrialFocus = [
  "Cold start + idle stability; any smoke, alarms, vibrations, or odd noises",
  "Steering feel and tracking under power; autopilot engagement test",
  "Acceleration and cruising RPM: temps and pressure trends, not just speed",
  "Sail trial if possible: hoist/reef, traveller behaviour, winch loads, sail shape realities",
  "Genset + AC running during trial: voltage stability and load behaviour",
  "Watermaker running (if fitted): output consistency and filter condition",
  "Post-trial checks: engine rooms dry, no new leaks, belt dust, coolant residue, smell clues",
]

const faqs = [
  {
    q: "Are Fountaine Pajot catamarans good boats?",
    a: "Generally, yes — especially for buyers prioritising comfort and liveability. The smart buy is condition + history: owner-use examples with clear records tend to be the strongest value.",
  },
  {
    q: "How much does a used Fountaine Pajot catamaran cost?",
    a: "Used pricing varies by size, year, region, and specification. As a broad guide, buyers often see mid-six figures for older platforms, rising into seven figures for late-model, high-spec 40–50ft boats.",
  },
  {
    q: "Is the Isla 40 a good choice?",
    a: "For many buyers, yes — it’s in the modern sweet spot: enough volume to feel luxurious without the operating burden of a much larger platform. Electrical quality and systems condition matter most.",
  },
  {
    q: "What’s the biggest risk when buying a used catamaran?",
    a: "History mismatch. Charter wear, tired rigging/saildrives, electrical issues, and hidden water ingress can make a boat look “cheap” but cost you heavily later. Survey + load testing protects you.",
  },
  {
    q: "Do Fountaine Pajot catamarans hold value?",
    a: "Liquidity is usually strongest for popular models in the 40–45ft band with good spec and clean maintenance records. Boats with weak history or tired systems typically trade at a discount and take longer to sell.",
  },
]

export default function FountainePajotCatamaranBuyingGuidePage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const schemas = useMemo(() => {
    const base = "https://www.findaly.co"
    const url = `${base}/guides/fountaine-pajot-catamaran-buying-guide`

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
      headline: "Fountaine Pajot catamaran buying guide (2026): models, prices, and what to inspect",
      description:
        "A practical buying guide to Fountaine Pajot catamarans: realistic price bands, model comparison, inspection checklist, sea trial priorities, paperwork/VAT and resale considerations.",
      author: { "@type": "Organization", name: "Findaly" },
      publisher: {
        "@type": "Organization",
        name: "Findaly",
        logo: { "@type": "ImageObject", url: `${base}/logo.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      image: [`${base}/hero-buy.jpg`],
      datePublished: "2026-02-21",
      dateModified: "2026-02-21",
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${base}/guides` },
        { "@type": "ListItem", position: 3, name: "Fountaine Pajot catamaran buying guide", item: url },
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
          <Image src="/hero-buy.jpg" alt="Fountaine Pajot catamaran buying guide — Findaly" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/70 via-[#0a211f]/35 to-[#f5f2eb]" />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#fff86c] mb-4" variants={fadeUp}>
              Buying Guide • Catamarans • Fountaine Pajot
            </motion.p>

            <motion.h1
              className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl"
              variants={fadeUp}
            >
              Fountaine Pajot catamaran buying guide:{" "}
              <span className="text-[#fff86c]">prices, models</span> & what to inspect (2026).
            </motion.h1>

            <motion.p className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed" variants={fadeUp}>
              The practical guide serious buyers use: real-world price bands, best-fit model comparisons,
              survey priorities, sea-trial stress tests, paperwork/VAT and resale logic.
            </motion.p>

            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href="/buy/brand/fountaine-pajot"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Browse Fountaine Pajot listings
              </Link>
              <Link
                href="/guides/catamaran-buying-guide"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                Catamaran basics first
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
                      Start at the brand hub, then filter by model, year, country, cabins, and budget.
                      This guide is written to strengthen Findaly’s internal linking.
                    </p>
                    <Link
                      href="/buy/brand/fountaine-pajot"
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#fff86c] text-[13.5px] font-semibold text-[#0a211f]"
                    >
                      Browse Fountaine Pajot →
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                    Hubs
                  </p>
                  <Link href="/buy/brand/fountaine-pajot" className="pillar-link">
                    <span>🏷️</span> Fountaine Pajot brand hub
                  </Link>
                  <Link href="/buy" className="pillar-link">
                    <span>🛥️</span> Browse all yachts
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
                    Model shortcuts
                  </p>
                  <div className="space-y-2">
                    {[
                      { title: "Lucia 40 listings", slug: "lucia-40", icon: "⛵" },
                      { title: "Isla 40 listings", slug: "isla-40", icon: "⭐" },
                      { title: "Astrea 42 listings", slug: "astrea-42", icon: "🧭" },
                      { title: "Elba 45 listings", slug: "elba-45", icon: "🏝️" },
                      { title: "Saona 47 listings", slug: "saona-47", icon: "🛟" },
                    ].map((x) => (
                      <Link key={x.slug} href={`/buy/brand/fountaine-pajot/model/${x.slug}`} className="pillar-link">
                        <span>{x.icon}</span> {x.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <article className="article-body min-w-0">
              <section id="overview" className="scroll-mt-28">
                <p className="section-label">Overview</p>
                <h2 className="section-heading">A catamaran isn’t a purchase — it’s a systems decision.</h2>
                <p>
                  Buyers searching for a <strong>Fountaine Pajot catamaran</strong> usually want the same outcome:
                  <strong> comfortable cruising with predictable ownership</strong>. That means you should think less about
                  brochure promises and more about the real stack: rigging, saildrives, electrical, water systems, and maintenance history.
                </p>
                <p>
                  This guide is designed to work with Findaly’s internal structure:{" "}
                  <strong>Fountaine Pajot → model hubs → (later) year + country hubs</strong>. If you want to browse inventory
                  while reading, start at the{" "}
                  <Link
                    href="/buy/brand/fountaine-pajot"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Fountaine Pajot brand hub
                  </Link>{" "}
                  then click through to model hubs like Isla 40 and Astrea 42.
                </p>
                <div className="pull-quote">
                  “The best catamaran deal isn’t the cheapest one — it’s the one with the cleanest history and the fewest hidden systems problems.”
                </div>
              </section>

              <section id="why" className="mt-20 scroll-mt-28">
                <p className="section-label">Why Fountaine Pajot</p>
                <h2 className="section-heading">Why buyers keep coming back (and what to be strict about).</h2>
                <p>
                  Fountaine Pajot sits in a buyer-friendly lane: liveable layouts, proven fleet size, familiar systems,
                  and strong demand in the 40–45ft band. But catamarans punish sloppy buying: history matters more than cosmetics.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">What it gets right</div>
                    <div className="text-[12px] text-[#0a211f]/45">And where you must be sharp</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">Strengths</div>
                      <ul className="mt-3">
                        <li>Comfort-first layouts that work for real weeks aboard</li>
                        <li>Global fleet means yards/surveyors know what to check</li>
                        <li>Strong demand in popular models (condition dependent)</li>
                        <li>Good platform variety: 40ft all-rounders to 47ft guest-friendly</li>
                        <li>Resale tends to be healthy when spec + history are clean</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Watch-outs</div>
                      <ul className="mt-3">
                        <li>Charter history can hide tired systems and cosmetic masking</li>
                        <li>Rigging + saildrives are “quiet” costs that hit hard later</li>
                        <li>Electrical upgrades are great… unless done badly</li>
                        <li>Leaks and water ingress must be hunted aggressively</li>
                        <li>Sea trial under load exposes the truth fast</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="lineup" className="mt-20 scroll-mt-28">
                <p className="section-label">Lineup & best-fit</p>
                <h2 className="section-heading">Pick by use-case: crew, payload, and your maintenance tolerance.</h2>
                <p>
                  The smart way to choose a Fountaine Pajot model is not “the nicest photos”.
                  Define your reality: number of people onboard, how often you cruise, how much gear you carry,
                  and whether you want simple ownership or a full systems platform.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Key models (best-fit + what to watch)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Links go to Findaly’s model hubs</div>
                  </div>

                  <div>
                    {models.map((m) => (
                      <div key={m.slug} className="row">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <div className="row-title">
                              <Link
                                href={`/buy/brand/fountaine-pajot/model/${m.slug}`}
                                className="text-[#0a211f] no-underline hover:underline decoration-[#fff86c] underline-offset-4"
                              >
                                Fountaine Pajot {m.name}
                              </Link>
                            </div>
                            <div className="row-meta">
                              <strong className="text-[#0a211f]">Best for:</strong> {m.bestFor}
                            </div>
                          </div>

                          <Link
                            href={`/buy/brand/fountaine-pajot/model/${m.slug}`}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0a211f] px-4 text-[13px] font-semibold text-[#fff86c]"
                          >
                            View listings →
                          </Link>
                        </div>

                        <p className="row-note">
                          <strong>Watch-out:</strong> {m.watchOut}
                        </p>

                        <p className="row-note mb-0!">
                          <strong>Value drivers:</strong> {m.valueDrivers.join(" • ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-8">
                  Fastest path to inventory: open the{" "}
                  <Link
                    href="/buy/brand/fountaine-pajot"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Fountaine Pajot brand hub
                  </Link>{" "}
                  and filter down. That keeps the guide tightly connected to Findaly’s marketplace pages.
                </p>
              </section>

              <section id="pricing" className="mt-20 scroll-mt-28">
                <p className="section-label">Price ranges</p>
                <h2 className="section-heading">Real pricing is driven by history, spec, and systems health.</h2>
                <p>
                  Two catamarans can look identical online and be separated by huge ownership risk.
                  The biggest pricing swings come from <strong>rig/sail condition</strong>, <strong>saildrive health</strong>,
                  <strong>electrical quality</strong>, and whether the boat’s story is clean.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Typical price bands (global)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Directional context, not a promise</div>
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
                            <td className="td">
                              <strong>{r.segment}</strong>
                            </td>
                            <td className="td">{r.range}</td>
                            <td className="td">{r.whatDrivesIt}</td>
                            <td className="td">{r.bestFor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re financing the purchase, stay realistic about running costs: berth, insurance, servicing, sails/rigging, safety gear.
                  Basics here:{" "}
                  <Link
                    href="/finance"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    yacht finance on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="comparison" className="mt-20 scroll-mt-28">
                <p className="section-label">Model comparison</p>
                <h2 className="section-heading">Model comparison: choose by ownership feel, not just size.</h2>
                <p>
                  Catamaran buyers get stuck comparing length and cabin counts. A better lens is:
                  <strong> complexity + payload + maintenance rhythm</strong>.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">At-a-glance comparison</div>
                    <div className="text-[12px] text-[#0a211f]/45">Click through to model hubs</div>
                  </div>

                  <div className="row p-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="th">Model</th>
                          <th className="th">Best for</th>
                          <th className="th">Ownership feel</th>
                          <th className="th">Key checks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonRows.map((r) => (
                          <tr key={r.model}>
                            <td className="td">
                              <Link
                                href={`/buy/brand/fountaine-pajot/model/${r.linkSlug}`}
                                className="text-[#0a211f] font-semibold no-underline hover:underline decoration-[#fff86c] underline-offset-4"
                              >
                                {r.model}
                              </Link>
                            </td>
                            <td className="td">{r.bestFor}</td>
                            <td className="td">{r.ownershipFeel}</td>
                            <td className="td">{r.keyChecks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-8">
                  One rule that keeps catamaran buyers safe: <strong>buy the survey results, then buy the boat</strong>.
                  If the seller won’t let you test systems under load, treat that as information.
                </p>
              </section>

              <section id="ownership" className="mt-20 scroll-mt-28">
                <p className="section-label">Ownership reality</p>
                <h2 className="section-heading">Ownership success is electrical + rigging discipline.</h2>
                <p>
                  Catamarans are brilliant when their systems are healthy. They become expensive when buyers ignore the real stack:
                  batteries, charging, inverters, water systems, saildrives, rigging, steering/autopilot. Your comfort is built on that foundation.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Where your money really goes</div>
                    <div className="text-[12px] text-[#0a211f]/45">The “quiet” costs buyers miss</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">High-impact items</div>
                      <ul className="mt-3">
                        <li>Standing rigging + chainplates (age is everything)</li>
                        <li>Saildrives and seals (preventative maintenance beats panic)</li>
                        <li>Batteries, chargers, inverters, wiring quality</li>
                        <li>Watermaker and plumbing integrity (odours and leaks matter)</li>
                        <li>Genset/AC (if fitted): load-tested reliability</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Owner mindset</div>
                      <ul className="mt-3">
                        <li>Prioritise records and condition over “newer” aesthetics</li>
                        <li>Assume you’ll upgrade something — budget early</li>
                        <li>Keep logs and receipts from day one (resale weapon)</li>
                        <li>Don’t overload payload: it impacts performance and wear</li>
                        <li>Sea trial is your truth serum</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re buying internationally, broker support reduces risk. Find one here:{" "}
                  <Link href="/brokers" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    yacht brokers on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="inspection" className="mt-20 scroll-mt-28">
                <p className="section-label">Inspection checklist</p>
                <h2 className="section-heading">Inspection checklist for a used Fountaine Pajot catamaran.</h2>
                <p>
                  You’re buying the previous owner’s maintenance habits. This checklist is designed to surface expensive truths early.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Buyer checklist</div>
                    <div className="text-[12px] text-[#0a211f]/45">Use for survey + your own walk-through</div>
                  </div>
                  <div className="row">
                    <ul className="mt-0">
                      {inspectionChecklist.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-8">
                  Strong tactic: list every defect and put a number next to it. You’ll either negotiate better, or you’ll walk away early — both are wins.
                </p>
              </section>

              <section id="sea-trial" className="mt-20 scroll-mt-28">
                <p className="section-label">Sea trial focus</p>
                <h2 className="section-heading">Sea trial checklist: test systems under load or don’t buy.</h2>
                <p>
                  Treat the sea trial like a stress test. Comfort is built on reliability, and reliability shows itself under sustained load.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">What to check during sea trial</div>
                    <div className="text-[12px] text-[#0a211f]/45">Bring a notebook; don’t rely on memory</div>
                  </div>
                  <div className="row">
                    <ul className="mt-0">
                      {seaTrialFocus.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-8">
                  If the seller resists proper load testing (genset/AC/watermaker), assume the boat is hiding fatigue.
                </p>
              </section>

              <section id="paperwork" className="mt-20 scroll-mt-28">
                <p className="section-label">Paperwork & VAT</p>
                <h2 className="section-heading">Paperwork isn’t admin — it’s the transaction.</h2>
                <p>
                  Catamarans are often bought/sold internationally. Your paperwork stack should include ownership chain, registration,
                  VAT/tax status, CE compliance (where relevant), and any finance liens. Your survey protects the boat. Your paperwork protects the deal.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/brokers"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]"
                  >
                    Find a broker →
                  </Link>
                  <Link
                    href="/buy/brand/fountaine-pajot"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-[#0a211f]/15 px-7 text-[14.5px] font-medium text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors"
                  >
                    Back to Fountaine Pajot inventory →
                  </Link>
                </div>
              </section>

              <section id="charter" className="mt-20 scroll-mt-28">
                <p className="section-label">Charter vs private</p>
                <h2 className="section-heading">Charter boats can be great — if you buy the reality, not the dream.</h2>
                <p>
                  Many Fountaine Pajot cats come from charter fleets. That isn’t automatically bad.
                  The key is whether maintenance was disciplined and documented, and whether refits were real (not cosmetic).
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">How to judge charter history</div>
                    <div className="text-[12px] text-[#0a211f]/45">This is where deals are made or destroyed</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">Green flags</div>
                      <ul className="mt-3">
                        <li>Full service logs with dates, yards, invoices</li>
                        <li>Rigging and saildrive maintenance documented</li>
                        <li>Systems replaced on schedule (not “when broken”)</li>
                        <li>Survey results clean + transparent defect list</li>
                        <li>Inventory list matches what’s actually onboard</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Red flags</div>
                      <ul className="mt-3">
                        <li>Fresh cosmetics with missing technical history</li>
                        <li>Leaks/odours/bilge issues that are “normal”</li>
                        <li>Unclear ownership chain or paperwork gaps</li>
                        <li>Electrical upgrades with messy workmanship</li>
                        <li>Seller reluctance to load-test systems</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="mt-8">
                  If you want charter-friendly inventory too, browse the wider catamaran category here:{" "}
                  <Link href="/buy" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    browse all yachts
                  </Link>
                  .
                </p>
              </section>

              <section id="resale" className="mt-20 scroll-mt-28">
                <p className="section-label">Resale & liquidity</p>
                <h2 className="section-heading">Resale is strongest when spec + history are clean and easy to explain.</h2>
                <p>
                  The catamaran market rewards “clean stories”: consistent servicing, proof of upgrades, systems that work under load,
                  and a spec that matches how most buyers actually use the boat.
                </p>
                <p>
                  If resale matters to you, target popular models in the 40–45ft band, keep your receipts, and maintain proactively.
                  Liquidity is earned.
                </p>

                <div className="pull-quote">“The best resale strategy is boring maintenance, documented obsessively.”</div>
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
                    Find your next{" "}
                    <span className="text-[#fff86c]">Fountaine Pajot</span> with confidence.
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                    Explore real listings, compare models, and keep the buying process clean — from shortlist to survey day.
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                    <Link
                      href="/buy/brand/fountaine-pajot"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                    >
                      Browse Fountaine Pajot listings
                    </Link>
                    <Link
                      href="/guides/catamaran-buying-guide"
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                    >
                      Catamaran buying basics
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
                    <span className="text-[#0a211f]/60">Fountaine Pajot catamaran buying guide</span>
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