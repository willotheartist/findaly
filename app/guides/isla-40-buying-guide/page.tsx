// app/guides/isla-40-buying-guide/page.tsx
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
  { id: "why", label: "Why Isla 40" },
  { id: "versions", label: "Layouts & versions" },
  { id: "pricing", label: "Real price ranges" },
  { id: "comparison", label: "Isla 40 vs alternatives" },
  { id: "ownership", label: "Ownership reality" },
  { id: "inspection", label: "Inspection checklist" },
  { id: "sea-trial", label: "Sea trial focus" },
  { id: "paperwork", label: "Paperwork & VAT" },
  { id: "charter", label: "Charter boats" },
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
  { value: "40ft", label: "Sweet spot for comfort + manageable systems" },
  { value: "Liveable", label: "Bridge-deck + saloon flow built for weeks aboard" },
  { value: "Spec-led", label: "Price moves with electrical + water systems" },
  { value: "Liquid", label: "Strong demand when history is clean" },
]

const quickTopics = [
  "Fountaine Pajot Isla 40",
  "Isla 40 price",
  "Isla 40 vs Astrea 42",
  "Isla 40 vs Lagoon 40",
  "Isla 40 charter version",
  "Used Isla 40 checklist",
  "Catamaran survey checklist",
  "Saildrive seals",
  "Lithium battery upgrade",
]

type RangeRow = {
  segment: string
  range: string
  whatDrivesIt: string
  bestFor: string
}

const rangeTable: RangeRow[] = [
  {
    segment: "Early builds / base spec / higher-hours (often charter)",
    range: "Often ~€550k–€800k",
    whatDrivesIt:
      "Charter history, engine hours, saildrive service, sails age, leaks, tired upholstery, nav suite age",
    bestFor: "Value buyers who can survey hard and budget for refit/rigging",
  },
  {
    segment: "Owner-use / balanced spec / clean history",
    range: "Often ~€800k–€1.15m",
    whatDrivesIt:
      "Records quality, electrical condition, watermaker/genset/AC health, sail wardrobe, overall care",
    bestFor: "Best all-round value: comfort + manageable ownership + easier resale",
  },
  {
    segment: "Late-model / high spec / upgraded electrical",
    range: "Often ~€1.1m–€1.5m+",
    whatDrivesIt:
      "Lithium + solar done properly, modern nav, premium inventory, systems tested under load, location",
    bestFor: "Owners planning serious time aboard with predictable systems",
  },
]

type LayoutCard = {
  title: string
  bestFor: string
  watchOut: string
  valueNotes: string[]
}

const layouts: LayoutCard[] = [
  {
    title: "Owner’s version (3-cabin)",
    bestFor: "Couples who cruise long seasons and want a proper owner suite",
    watchOut: "Condition can be great — but ensure spec matches your autonomy goals (power/water)",
    valueNotes: ["Typically strongest owner-buyer demand", "Often better cared for", "Check payload habits"],
  },
  {
    title: "4-cabin (family / guest focus)",
    bestFor: "Families hosting friends or owners who want flexible sleeping",
    watchOut: "Bathrooms and plumbing take a beating; leaks/odours show up here first",
    valueNotes: ["Broad market demand", "Great charter crossover", "Inspect plumbing thoroughly"],
  },
  {
    title: "Charter-optimised inventory",
    bestFor: "Buyers targeting value with an acceptance of wear and refit plans",
    watchOut: "Cosmetic refreshes can hide tired systems (rigging, saildrives, electrical)",
    valueNotes: ["Price can be attractive", "History must be documented", "Load-test everything"],
  },
]

type ComparisonRow = {
  model: string
  bestFor: string
  whyPeopleChooseIt: string
  whatToWatch: string
  primaryLink?: { href: string; label: string }
}

const comparisonRows: ComparisonRow[] = [
  {
    model: "Isla 40",
    bestFor: "Modern 40ft all-rounder: comfort + manageable ownership",
    whyPeopleChooseIt: "Great liveability for size; strong used demand; simple-to-love platform",
    whatToWatch: "Electrical quality, water systems, saildrive/rig history, leak discipline",
    primaryLink: { href: "/buy/brand/fountaine-pajot/model/isla-40", label: "Isla 40 listings" },
  },
  {
    model: "Astrea 42",
    bestFor: "More volume and guest comfort, slightly higher systems burden",
    whyPeopleChooseIt: "Extra space matters for families; popular in the same buyer set",
    whatToWatch: "Payload creep, deck hardware bedding, saildrive seals, systems complexity",
    primaryLink: { href: "/buy/brand/fountaine-pajot/model/astrea-42", label: "Astrea 42 listings" },
  },
  {
    model: "Lagoon 42",
    bestFor: "Market benchmark for 42ft charter + owner demand",
    whyPeopleChooseIt: "Very deep global market; broad service familiarity; strong resale liquidity",
    whatToWatch: "Charter wear, systems fatigue, rigging age, cosmetic masking",
    primaryLink: { href: "/guides/lagoon-42-buying-guide", label: "Lagoon 42 guide" },
  },
  {
    model: "Lagoon 40",
    bestFor: "Popular 40ft category; lots of used supply",
    whyPeopleChooseIt: "More inventory to choose from; often competitive pricing",
    whatToWatch: "Spec variance is huge; verify autonomy upgrades and maintenance history",
  },
]

const inspectionChecklist = [
  "Rig + standing rigging age (invoices matter), chainplates, corrosion, tuning history",
  "Sails: age/shape/UV degradation; inventory completeness vs your cruising plans",
  "Engines: diagnostics + service history; verify hours against invoices",
  "Saildrives: seals, oil condition, corrosion; maintenance intervals and any water ingress history",
  "Electrical system: batteries (type/age), chargers, inverter, shore power, wiring quality",
  "Solar/lithium (if present): install quality, fusing, ventilation, BMS configuration, documentation",
  "Generator + air-conditioning (if fitted) under sustained load — not just “it turns on”",
  "Watermaker output + maintenance routine (membranes, flushing, filter changes)",
  "Leaks/water ingress: windows, hatches, deck fittings, core/moisture readings where relevant",
  "Steering/autopilot function, rudder bearings, sail-handling hardware and winches",
  "Plumbing: odours, leaks, seacocks/through-hulls, pumps, bilge alarms",
  "Bridge-deck slamming indicators and structural stress clues (use-pattern matters)",
  "Documentation: VAT/tax status, registration, ownership chain, CE compliance, liens",
]

const seaTrialFocus = [
  "Cold start + idle stability; any smoke, alarms, abnormal vibration",
  "Steering feel + tracking; autopilot engagement test",
  "Cruising RPM for temps/pressure trends (not just speed claims)",
  "Sail handling test if possible: hoist/reef, traveller loads, winch behaviour, sail shape",
  "Genset + AC running during trial: voltage stability and load behaviour",
  "Watermaker running (if fitted): output stability, filter condition, noise/vibration",
  "Post-trial engine rooms: dry, no new leaks, belt dust, coolant residue, smells",
]

const faqs = [
  {
    q: "Is the Fountaine Pajot Isla 40 a good catamaran?",
    a: "For many buyers, yes. The Isla 40 sits in the modern 40ft sweet spot: strong liveability without the operating burden of a much larger platform. Condition and electrical quality are the main differentiators in used boats.",
  },
  {
    q: "How much does a used Isla 40 cost?",
    a: "Prices vary by year, region, and specification. Many used Isla 40 listings cluster from the high six figures into the low seven figures. Electrical upgrades, watermaker/genset/AC condition, and clean maintenance records drive the premium.",
  },
  {
    q: "Isla 40 vs Astrea 42 — which should I choose?",
    a: "Choose Isla 40 if you want a modern all-rounder with manageable complexity. Choose Astrea 42 if you prioritise extra volume and hosting comfort. In both, buy based on history + systems health, not photos.",
  },
  {
    q: "What should I prioritise during survey?",
    a: "Rigging age, saildrive health, electrical system quality (especially lithium/solar installs), and load-testing generator/AC/watermaker. Leaks and water ingress checks are also critical.",
  },
  {
    q: "Do Isla 40 catamarans hold value?",
    a: "Typically, yes — especially clean, well-documented boats with good autonomy spec and honest histories. Liquidity is strongest for owner-use examples and popular layouts in good condition.",
  },
]

export default function Isla40BuyingGuidePage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const schemas = useMemo(() => {
    const base = "https://www.findaly.co"
    const url = `${base}/guides/isla-40-buying-guide`

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
      headline: "Fountaine Pajot Isla 40 buying guide (2026): prices, layouts, what to inspect",
      description:
        "A practical buying guide to the Fountaine Pajot Isla 40: real-world price bands, layouts and versions, comparison vs Astrea 42 and Lagoon alternatives, inspection checklist, sea trial priorities, paperwork/VAT and resale.",
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
        { "@type": "ListItem", position: 3, name: "Isla 40 buying guide", item: url },
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
          <Image src="/hero-buy.jpg" alt="Fountaine Pajot Isla 40 buying guide — Findaly" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/70 via-[#0a211f]/35 to-[#f5f2eb]" />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#fff86c] mb-4" variants={fadeUp}>
              Buying Guide • Fountaine Pajot • Isla 40
            </motion.p>

            <motion.h1
              className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl"
              variants={fadeUp}
            >
              Isla 40 buying guide:{" "}
              <span className="text-[#fff86c]">prices, layouts</span> & what to inspect (2026).
            </motion.h1>

            <motion.p className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed" variants={fadeUp}>
              A practical guide for serious buyers: real-world pricing bands, layout choices, comparison vs Astrea 42
              and Lagoon alternatives, inspection priorities, sea-trial stress tests, and resale logic.
            </motion.p>

            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href="/buy/brand/fountaine-pajot/model/isla-40"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Browse Isla 40 listings
              </Link>
              <Link
                href="/buy/brand/fountaine-pajot"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                Fountaine Pajot brand hub
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
                      Filter Isla 40 listings by year, country, cabins, and spec. Then cross-check what you see
                      against the inspection + sea-trial sections below.
                    </p>
                    <Link
                      href="/buy/brand/fountaine-pajot/model/isla-40"
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#fff86c] text-[13.5px] font-semibold text-[#0a211f]"
                    >
                      Browse Isla 40 →
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                    Fountaine Pajot hubs
                  </p>
                  <Link href="/buy/brand/fountaine-pajot" className="pillar-link">
                    <span>🏷️</span> Fountaine Pajot brand hub
                  </Link>
                  <Link href="/guides/fountaine-pajot-catamaran-buying-guide" className="pillar-link">
                    <span>📘</span> FP catamaran buying guide
                  </Link>
                  <Link href="/guides/catamaran-buying-guide" className="pillar-link">
                    <span>🧠</span> Catamaran buying basics
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
                    Quick comparisons
                  </p>
                  <div className="space-y-2">
                    <Link href="/buy/brand/fountaine-pajot/model/astrea-42" className="pillar-link">
                      <span>🧭</span> Astrea 42 listings
                    </Link>
                    <Link href="/guides/lagoon-42-buying-guide" className="pillar-link">
                      <span>⭐</span> Lagoon 42 guide
                    </Link>
                    <Link href="/guides/lagoon-catamaran-buying-guide" className="pillar-link">
                      <span>🌊</span> Lagoon catamaran guide
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            <article className="article-body min-w-0">
              <section id="overview" className="scroll-mt-28">
                <p className="section-label">Overview</p>
                <h2 className="section-heading">The Isla 40 is popular because it’s calm to own — when bought correctly.</h2>
                <p>
                  The <strong>Fountaine Pajot Isla 40</strong> sits in the modern 40ft sweet spot:
                  enough volume to feel genuinely liveable, without the operating burden of stepping into 45–50ft territory.
                  It’s a platform people buy to actually use — weekends that become weeks, summers that become seasons.
                </p>
                <p>
                  This guide is designed to reinforce Findaly’s internal structure:{" "}
                  <strong>Fountaine Pajot → Isla 40 model hub → (later) year + country hubs</strong>. Browse while reading here:{" "}
                  <Link
                    href="/buy/brand/fountaine-pajot/model/isla-40"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Isla 40 listings on Findaly
                  </Link>
                  .
                </p>
                <div className="pull-quote">
                  “You’re not buying a 40ft catamaran. You’re buying a power system, a water system, and the previous owner’s maintenance habits.”
                </div>
              </section>

              <section id="why" className="mt-20 scroll-mt-28">
                <p className="section-label">Why Isla 40</p>
                <h2 className="section-heading">Why buyers love it (and why bad ones become expensive).</h2>
                <p>
                  The Isla 40 is widely liked because it delivers modern liveability without feeling like a complicated project.
                  But used catamarans punish casual buying: if the electrical, water, or drivetrain story is weak,
                  the ownership experience turns from “effortless” into “constant small problems”.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Strengths vs watch-outs</div>
                    <div className="text-[12px] text-[#0a211f]/45">Where to focus as a buyer</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">Strengths</div>
                      <ul className="mt-3">
                        <li>Excellent liveability for a 40ft platform</li>
                        <li>Strong demand in a core market size band</li>
                        <li>Good service familiarity and global yard support</li>
                        <li>Works for both owner-use and charter-style layouts</li>
                        <li>Spec upgrades (solar/lithium) can genuinely transform autonomy</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Watch-outs</div>
                      <ul className="mt-3">
                        <li>Electrical upgrades done badly are a risk multiplier</li>
                        <li>Watermaker/AC/genset condition must be load-tested</li>
                        <li>Saildrive seal history matters more than most buyers realise</li>
                        <li>Leaks and water ingress must be hunted aggressively</li>
                        <li>Charter cosmetics can hide tired systems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="versions" className="mt-20 scroll-mt-28">
                <p className="section-label">Layouts & versions</p>
                <h2 className="section-heading">Choose the layout that matches how you actually live onboard.</h2>
                <p>
                  Many Isla 40 buying mistakes happen because buyers choose by sleeping capacity, then realise they want
                  a different day-to-day life. Decide how you’ll actually use the boat: long seasons for two, or guest-heavy summers?
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Common Isla 40 layouts</div>
                    <div className="text-[12px] text-[#0a211f]/45">How to choose fast</div>
                  </div>

                  <div>
                    {layouts.map((l) => (
                      <div key={l.title} className="row">
                        <div className="row-title">{l.title}</div>
                        <div className="row-meta">
                          <strong className="text-[#0a211f]">Best for:</strong> {l.bestFor}
                        </div>
                        <p className="row-note">
                          <strong>Watch-out:</strong> {l.watchOut}
                        </p>
                        <p className="row-note mb-0!">
                          <strong>Value notes:</strong> {l.valueNotes.join(" • ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-8">
                  If you want to compare against the slightly larger sibling, open:{" "}
                  <Link
                    href="/buy/brand/fountaine-pajot/model/astrea-42"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Astrea 42 listings
                  </Link>
                  .
                </p>
              </section>

              <section id="pricing" className="mt-20 scroll-mt-28">
                <p className="section-label">Real price ranges</p>
                <h2 className="section-heading">Isla 40 pricing is mostly a “systems integrity” premium.</h2>
                <p>
                  A used Isla 40’s price is driven less by looks and more by the invisible stuff: rigging age, saildrive health,
                  electrical quality, and whether autonomy systems (solar/lithium/watermaker) are correctly installed and documented.
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
                  Financing lens: buy a boat you can comfortably own (berth, insurance, servicing, sails/rigging). If you want the basics:{" "}
                  <Link href="/finance" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    yacht finance on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="comparison" className="mt-20 scroll-mt-28">
                <p className="section-label">Isla 40 vs alternatives</p>
                <h2 className="section-heading">Comparison: choose by ownership feel, not brochure features.</h2>
                <p>
                  When buyers get stuck, it’s usually because they’re comparing photos and cabin counts.
                  A more useful comparison is: <strong>complexity + payload + maintenance rhythm</strong>.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">At-a-glance comparison</div>
                    <div className="text-[12px] text-[#0a211f]/45">Pick the platform that fits your life</div>
                  </div>

                  <div className="row p-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="th">Model</th>
                          <th className="th">Best for</th>
                          <th className="th">Why people choose it</th>
                          <th className="th">What to watch</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonRows.map((r) => (
                          <tr key={r.model}>
                            <td className="td">
                              {r.primaryLink ? (
                                <Link
                                  href={r.primaryLink.href}
                                  className="text-[#0a211f] font-semibold no-underline hover:underline decoration-[#fff86c] underline-offset-4"
                                >
                                  {r.model}
                                </Link>
                              ) : (
                                <strong>{r.model}</strong>
                              )}
                            </td>
                            <td className="td">{r.bestFor}</td>
                            <td className="td">{r.whyPeopleChooseIt}</td>
                            <td className="td">{r.whatToWatch}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-8">
                  Want the benchmark category page? Read:{" "}
                  <Link
                    href="/guides/catamaran-buying-guide"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Catamaran buying guide
                  </Link>
                  .
                </p>
              </section>

              <section id="ownership" className="mt-20 scroll-mt-28">
                <p className="section-label">Ownership reality</p>
                <h2 className="section-heading">Ownership is easy when electrical + water systems are healthy.</h2>
                <p>
                  Most Isla 40 “bad experiences” are not about the boat — they’re about neglected systems.
                  A good Isla 40 feels calm: power is stable, water is reliable, and the boat doesn’t constantly ask for attention.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">What makes ownership calm</div>
                    <div className="text-[12px] text-[#0a211f]/45">And what makes it noisy</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">Calm ownership signals</div>
                      <ul className="mt-3">
                        <li>Clean service history for engines + saildrives</li>
                        <li>Electrical upgrades documented and well-installed</li>
                        <li>Watermaker/genset/AC proven under load</li>
                        <li>Dry bilges and leak discipline</li>
                        <li>Receipts + logs kept consistently</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Noisy ownership signals</div>
                      <ul className="mt-3">
                        <li>“We don’t have invoices but it was serviced”</li>
                        <li>Messy wiring, unclear fusing, undocumented lithium installs</li>
                        <li>Systems that “work sometimes”</li>
                        <li>Persistent odours, damp lockers, recurring leaks</li>
                        <li>Seller resistance to load-testing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re buying abroad, a good broker reduces risk. Start here:{" "}
                  <Link href="/brokers" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    find a broker on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="inspection" className="mt-20 scroll-mt-28">
                <p className="section-label">Inspection checklist</p>
                <h2 className="section-heading">Inspection checklist for a used Isla 40.</h2>
                <p>
                  Use this list to guide your walk-through and to brief your surveyor. It’s built to surface the expensive truths early.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Buyer checklist</div>
                    <div className="text-[12px] text-[#0a211f]/45">Survey + your own checks</div>
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
                  Practical negotiating method: turn the defect list into a priced spreadsheet. You’ll negotiate cleanly — or walk away quickly.
                </p>
              </section>

              <section id="sea-trial" className="mt-20 scroll-mt-28">
                <p className="section-label">Sea trial focus</p>
                <h2 className="section-heading">Sea trial checklist: test under load or don’t buy.</h2>
                <p>
                  A sea trial is not a vibe check. It’s a stress test: temperature trends, steering/autopilot behaviour, and system stability under sustained load.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">What to test during sea trial</div>
                    <div className="text-[12px] text-[#0a211f]/45">Bring a notebook</div>
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
                  A good seller welcomes a proper trial. A defensive seller is telling you something — listen.
                </p>
              </section>

              <section id="paperwork" className="mt-20 scroll-mt-28">
                <p className="section-label">Paperwork & VAT</p>
                <h2 className="section-heading">Paperwork isn’t admin — it’s the deal.</h2>
                <p>
                  Isla 40s are often bought/sold internationally. Make sure the ownership chain is clean, VAT/tax status is clear,
                  registration is correct, CE compliance is understood where relevant, and any liens are removed before completion.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/buy/brand/fountaine-pajot/model/isla-40"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]"
                  >
                    Browse Isla 40 listings →
                  </Link>
                  <Link
                    href="/buy/brand/fountaine-pajot"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-[#0a211f]/15 px-7 text-[14.5px] font-medium text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors"
                  >
                    Back to FP brand hub →
                  </Link>
                </div>
              </section>

              <section id="charter" className="mt-20 scroll-mt-28">
                <p className="section-label">Charter boats</p>
                <h2 className="section-heading">Charter Isla 40s can be deals — if you buy the reality.</h2>
                <p>
                  Many Isla 40s come out of charter fleets. That’s not automatically bad.
                  The question is whether the maintenance discipline and documentation are real, and whether the refit was technical — not just cosmetic.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">How to judge charter history</div>
                    <div className="text-[12px] text-[#0a211f]/45">Green flags vs red flags</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">Green flags</div>
                      <ul className="mt-3">
                        <li>Full service logs with invoices and yard names</li>
                        <li>Rigging and saildrive maintenance documented</li>
                        <li>Systems replaced on schedule, not only when broken</li>
                        <li>Transparent survey results and defect list</li>
                        <li>Inventory list matches what’s onboard</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Red flags</div>
                      <ul className="mt-3">
                        <li>Fresh cosmetics with weak technical history</li>
                        <li>“Normal” leaks, damp lockers, persistent odours</li>
                        <li>Messy wiring / undocumented lithium upgrades</li>
                        <li>Seller reluctance to load-test systems</li>
                        <li>Unclear paperwork or VAT status</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="resale" className="mt-20 scroll-mt-28">
                <p className="section-label">Resale & liquidity</p>
                <h2 className="section-heading">Resale is strongest when you buy a clean story.</h2>
                <p>
                  Isla 40 liquidity tends to be strong when the boat is well-documented, sensibly specced, and honestly presented.
                  Buyers pay a premium for predictable ownership: stable electrics, reliable water systems, and clean maintenance records.
                </p>

                <div className="pull-quote">“Liquidity is earned. Maintenance discipline is the price of resale.”</div>
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
                    <span className="text-[#fff86c]">Isla 40</span> with confidence.
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                    Explore real listings, compare spec, and keep the buying process disciplined — from shortlist to survey day.
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                    <Link
                      href="/buy/brand/fountaine-pajot/model/isla-40"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                    >
                      Browse Isla 40 listings
                    </Link>
                    <Link
                      href="/buy/brand/fountaine-pajot"
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                    >
                      Fountaine Pajot brand hub
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
                    <span className="text-[#0a211f]/60">Isla 40 buying guide</span>
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