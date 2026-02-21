// app/guides/astrea-42-buying-guide/page.tsx
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
  { id: "why", label: "Why Astrea 42" },
  { id: "layouts", label: "Layouts & versions" },
  { id: "pricing", label: "Real price ranges" },
  { id: "comparison", label: "Astrea 42 vs alternatives" },
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
  { value: "42ft", label: "Extra volume without jumping to 45–50ft burden" },
  { value: "Guest-ready", label: "Popular layouts for family + hosting" },
  { value: "Spec-led", label: "Pricing moves with autonomy systems" },
  { value: "Liquid", label: "Strong demand when history is clean" },
]

const quickTopics = [
  "Fountaine Pajot Astrea 42",
  "Astrea 42 price",
  "Astrea 42 vs Isla 40",
  "Astrea 42 vs Lagoon 42",
  "Used Astrea 42 checklist",
  "Catamaran survey checklist",
  "Saildrive seals",
  "Rigging replacement cost",
  "Lithium solar upgrade",
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
    range: "Often ~€650k–€950k",
    whatDrivesIt:
      "Charter history, engine hours, saildrive service, sail age, nav suite age, plumbing wear, cosmetic fatigue",
    bestFor: "Value buyers who can survey hard and budget a technical refit",
  },
  {
    segment: "Owner-use / balanced spec / clean documentation",
    range: "Often ~€950k–€1.35m",
    whatDrivesIt:
      "Service records, electrical condition, watermaker/genset/AC health, sail wardrobe, rigging age and history",
    bestFor: "The sweet spot for most buyers: comfort + manageable ownership + easier resale",
  },
  {
    segment: "Late-model / high-spec / autonomy upgrades done properly",
    range: "Often ~€1.3m–€1.8m+",
    whatDrivesIt:
      "Lithium + solar installation quality, modern nav, premium inventory, systems load-tested, location and tax status",
    bestFor: "Owners planning long seasons aboard with predictable systems",
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
    bestFor: "Couples cruising long seasons who want a real owner suite + storage",
    watchOut: "Don’t assume autonomy spec — verify power and water systems match your plan",
    valueNotes: ["Strong owner-buyer demand", "Often cleaner histories", "Great resale when documented"],
  },
  {
    title: "4-cabin / 4-head (guest focus)",
    bestFor: "Families and hosting-heavy owners",
    watchOut: "Plumbing and heads take the most wear; odours/leaks are the tell",
    valueNotes: ["Broad market demand", "Charter crossover", "Inspect plumbing hard"],
  },
  {
    title: "Charter-optimised inventory",
    bestFor: "Buyers hunting value and willing to refit",
    watchOut: "Cosmetic refresh can hide tired rigging, saildrives, electrics, pumps",
    valueNotes: ["Often cheaper entry point", "History must be real", "Load-test everything"],
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
    model: "Astrea 42",
    bestFor: "More space for guests while staying (relatively) manageable",
    whyPeopleChooseIt: "A modern 42ft platform with great liveability; popular with families",
    whatToWatch: "Payload creep, electrical quality, saildrive history, leaks and plumbing wear",
    primaryLink: { href: "/buy/brand/fountaine-pajot/model/astrea-42", label: "Astrea 42 listings" },
  },
  {
    model: "Isla 40",
    bestFor: "Modern 40ft sweet spot for couples + manageable complexity",
    whyPeopleChooseIt: "Often calmer ownership; great value when spec and history are clean",
    whatToWatch: "Electrical installs, water systems, saildrive seals, ingress and damp",
    primaryLink: { href: "/guides/isla-40-buying-guide", label: "Isla 40 guide" },
  },
  {
    model: "Lagoon 42",
    bestFor: "Deep global market benchmark (owner + charter)",
    whyPeopleChooseIt: "Huge supply and liquidity; lots of service familiarity",
    whatToWatch: "Charter wear, systems fatigue, cosmetic masking, rigging age",
    primaryLink: { href: "/guides/lagoon-42-buying-guide", label: "Lagoon 42 guide" },
  },
  {
    model: "Lagoon 40",
    bestFor: "Lots of used supply in a popular size band",
    whyPeopleChooseIt: "Inventory depth can create bargains if you buy carefully",
    whatToWatch: "Spec variance is massive; verify autonomy upgrades and maintenance",
  },
]

const inspectionChecklist = [
  "Rig + standing rigging age (invoices matter), chainplates, corrosion, tuning history",
  "Sails: age/shape/UV damage; inventory completeness vs your cruising plans",
  "Engines: diagnostics + service history; verify hours against invoices",
  "Saildrives: seals, corrosion, oil condition; check maintenance intervals and any water ingress history",
  "Electrical: batteries (type/age), chargers, inverter, shore power, wiring quality and fusing",
  "Lithium/solar (if present): install quality, BMS config, ventilation, documentation and safety",
  "Generator + air-conditioning (if fitted) under sustained load — not just a quick demo",
  "Watermaker output + maintenance discipline (membranes, flushing, filter changes)",
  "Leaks/water ingress: deck fittings, windows, hatches, moisture readings where relevant",
  "Steering/autopilot, rudder bearings, sail-handling hardware and winches",
  "Plumbing: odours, leaks, seacocks/through-hulls, pumps, bilge alarms",
  "Bridge-deck slamming/stress clues and structural integrity signals (use-pattern matters)",
  "Documentation: VAT/tax status, registration, ownership chain, CE compliance, liens",
]

const seaTrialFocus = [
  "Cold start + idle stability; alarms, smoke, unusual vibration",
  "Steering feel + tracking; autopilot engagement test",
  "Cruising RPM: temp/pressure trends and any drivetrain vibration",
  "Sail handling if possible: hoist/reef, traveller loads, winch behaviour, sail shape",
  "Genset + AC running during trial: voltage stability and real load behaviour",
  "Watermaker running (if fitted): output stability, noise/vibration, filter condition",
  "Post-trial engine rooms: dry, no new leaks, belt dust, coolant residue, smells",
]

const faqs = [
  {
    q: "Is the Fountaine Pajot Astrea 42 a good catamaran?",
    a: "For many buyers, yes. The Astrea 42 is popular because it offers a meaningful jump in space and hosting comfort while staying more manageable than larger 45–50ft platforms. Condition and systems history matter more than brand reputation.",
  },
  {
    q: "How much does a used Astrea 42 cost?",
    a: "Pricing varies by year, region, and specification. Many used boats cluster from around the high six figures into the mid seven figures. Electrical autonomy upgrades and documented systems health are major price drivers.",
  },
  {
    q: "Astrea 42 vs Isla 40 — which should I choose?",
    a: "Choose Astrea 42 if you prioritise extra volume, hosting comfort, and longer stays with more people. Choose Isla 40 if you prefer slightly simpler ownership and a modern 40ft sweet spot. In both, buy records first, then buy the boat.",
  },
  {
    q: "What should I prioritise during survey?",
    a: "Rigging age, saildrive health, electrical system quality (especially lithium/solar installs), and load-testing generator/AC/watermaker. Leaks and plumbing health are also key, especially in guest-heavy layouts.",
  },
  {
    q: "Do Astrea 42s hold their value?",
    a: "Typically, yes — clean examples with strong documentation and sensible autonomy spec tend to sell well. Liquidity improves when the history is clear and systems are proven under load.",
  },
]

export default function Astrea42BuyingGuidePage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const schemas = useMemo(() => {
    const base = "https://www.findaly.co"
    const url = `${base}/guides/astrea-42-buying-guide`

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
      headline: "Fountaine Pajot Astrea 42 buying guide (2026): prices, layouts, what to inspect",
      description:
        "A practical buying guide to the Fountaine Pajot Astrea 42: real-world price bands, layouts and versions, comparison vs Isla 40 and Lagoon alternatives, inspection checklist, sea trial priorities, paperwork/VAT and resale.",
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
        { "@type": "ListItem", position: 3, name: "Astrea 42 buying guide", item: url },
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
          <Image src="/hero-buy.jpg" alt="Fountaine Pajot Astrea 42 buying guide — Findaly" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/70 via-[#0a211f]/35 to-[#f5f2eb]" />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#fff86c] mb-4" variants={fadeUp}>
              Buying Guide • Fountaine Pajot • Astrea 42
            </motion.p>

            <motion.h1
              className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl"
              variants={fadeUp}
            >
              Astrea 42 buying guide:{" "}
              <span className="text-[#fff86c]">prices, layouts</span> & what to inspect (2026).
            </motion.h1>

            <motion.p className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed" variants={fadeUp}>
              A practical guide for serious buyers: real-world pricing bands, layout choices, comparison vs Isla 40 and Lagoon
              alternatives, inspection priorities, sea-trial stress tests, and resale logic.
            </motion.p>

            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href="/buy/brand/fountaine-pajot/model/astrea-42"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Browse Astrea 42 listings
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
                      Filter Astrea 42 listings by year, country, cabins, and spec. Then cross-check what you see
                      against the inspection + sea-trial sections below.
                    </p>
                    <Link
                      href="/buy/brand/fountaine-pajot/model/astrea-42"
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#fff86c] text-[13.5px] font-semibold text-[#0a211f]"
                    >
                      Browse Astrea 42 →
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                    Related guides
                  </p>
                  <Link href="/guides/isla-40-buying-guide" className="pillar-link">
                    <span>🧠</span> Isla 40 buying guide
                  </Link>
                  <Link href="/guides/lagoon-42-buying-guide" className="pillar-link">
                    <span>⭐</span> Lagoon 42 buying guide
                  </Link>
                  <Link href="/guides/catamaran-buying-guide" className="pillar-link">
                    <span>🌊</span> Catamaran buying basics
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
                    Fountaine Pajot shortcuts
                  </p>
                  <div className="space-y-2">
                    <Link href="/buy/brand/fountaine-pajot" className="pillar-link">
                      <span>🏷️</span> FP brand hub
                    </Link>
                    <Link href="/buy/brand/fountaine-pajot/model/isla-40" className="pillar-link">
                      <span>🚤</span> Isla 40 listings
                    </Link>
                    <Link href="/buy/brand/fountaine-pajot/model/astrea-42" className="pillar-link">
                      <span>🧭</span> Astrea 42 listings
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            <article className="article-body min-w-0">
              <section id="overview" className="scroll-mt-28">
                <p className="section-label">Overview</p>
                <h2 className="section-heading">Astrea 42: the “more space” upgrade — without becoming a 50ft project.</h2>
                <p>
                  The <strong>Fountaine Pajot Astrea 42</strong> is popular because it delivers a real jump in space and hosting comfort
                  while staying closer to “manageable ownership” than larger 45–50ft platforms.
                  It’s a family-friendly 42ft catamaran that works for long seasons — as long as the systems story is clean.
                </p>
                <p>
                  This guide supports Findaly’s internal structure:{" "}
                  <strong>Fountaine Pajot → Astrea 42 model hub → (later) year + country hubs</strong>.
                  Browse inventory while reading here:{" "}
                  <Link
                    href="/buy/brand/fountaine-pajot/model/astrea-42"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Astrea 42 listings on Findaly
                  </Link>
                  .
                </p>
                <div className="pull-quote">
                  “The jump from 40ft to 42ft isn’t just space — it’s payload, systems, and how disciplined you must be.”
                </div>
              </section>

              <section id="why" className="mt-20 scroll-mt-28">
                <p className="section-label">Why Astrea 42</p>
                <h2 className="section-heading">Why buyers choose it (and what separates a gem from a headache).</h2>
                <p>
                  Buyers move into the Astrea 42 because they want to host comfortably and stay aboard longer without feeling cramped.
                  But the bigger the platform, the more your life depends on systems: electrics, plumbing, and drivetrain history.
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
                        <li>Noticeable comfort upgrade vs 40ft class for guests</li>
                        <li>Popular platform with good global demand</li>
                        <li>Flexible layouts for owner-use or guest-heavy use</li>
                        <li>Strong “family catamaran” reputation in the market</li>
                        <li>Autonomy upgrades can create truly independent cruising</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Watch-outs</div>
                      <ul className="mt-3">
                        <li>Payload creep can quietly ruin performance and wear systems</li>
                        <li>Electrical installs (especially lithium) must be proven + documented</li>
                        <li>Saildrive maintenance history is a major risk control</li>
                        <li>Leaks/plumbing issues scale with cabins/heads</li>
                        <li>Charter cosmetics can disguise systems fatigue</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="layouts" className="mt-20 scroll-mt-28">
                <p className="section-label">Layouts & versions</p>
                <h2 className="section-heading">Pick a layout that matches your real use-case.</h2>
                <p>
                  A layout isn’t just sleeping capacity — it’s how much plumbing you maintain, how you store gear, and how you live day-to-day.
                  The right choice depends on whether you cruise as a couple or host frequently.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Common Astrea 42 layouts</div>
                    <div className="text-[12px] text-[#0a211f]/45">Best-fit + watch-outs</div>
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
                  If you want the tighter 40ft alternative, read:{" "}
                  <Link
                    href="/guides/isla-40-buying-guide"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Isla 40 buying guide
                  </Link>
                  .
                </p>
              </section>

              <section id="pricing" className="mt-20 scroll-mt-28">
                <p className="section-label">Real price ranges</p>
                <h2 className="section-heading">Astrea 42 pricing is a premium for clean systems + clean history.</h2>
                <p>
                  Two Astrea 42s that “look identical” can be separated by a massive real cost difference.
                  The premium is usually paid for: documented rigging/saildrive servicing, stable electrics,
                  reliable water systems, and boats that pass load tests.
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
                  Financing lens: the “cheap” boat can be the most expensive if it needs rigging + saildrives + electrical work.
                  If you want the basics:{" "}
                  <Link href="/finance" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    yacht finance on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="comparison" className="mt-20 scroll-mt-28">
                <p className="section-label">Astrea 42 vs alternatives</p>
                <h2 className="section-heading">Comparison: choose by maintenance rhythm + payload reality.</h2>
                <p>
                  A 42ft catamaran can feel like a dream — or feel like a systems job. Choose based on how disciplined you want to be.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">At-a-glance comparison</div>
                    <div className="text-[12px] text-[#0a211f]/45">Ownership feel wins</div>
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
                  Want the category foundation page? Read:{" "}
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
                <h2 className="section-heading">Ownership success is mostly about discipline (and weight).</h2>
                <p>
                  The Astrea 42 can be a “set it and enjoy it” boat when maintained proactively.
                  But payload creep (extra gear, extra toys, extra water) adds stress everywhere: sails, engines, rigs, and systems.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">What actually matters</div>
                    <div className="text-[12px] text-[#0a211f]/45">For long-term happiness</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">High-impact habits</div>
                      <ul className="mt-3">
                        <li>Keep service logs (engines, saildrives, rig)</li>
                        <li>Load-test systems regularly (genset/AC/watermaker)</li>
                        <li>Keep wiring tidy, documented, and safe</li>
                        <li>Stay on top of leaks early (small leaks become big)</li>
                        <li>Control payload and be honest about what you carry</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Ownership pitfalls</div>
                      <ul className="mt-3">
                        <li>Undocumented “upgrades” and DIY electrics</li>
                        <li>Ignoring saildrive seals and corrosion until it’s a problem</li>
                        <li>Letting plumbing and odours become “normal”</li>
                        <li>Buying based on photos and vibes</li>
                        <li>Not budgeting for sails/rigging as consumables</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re buying internationally, a broker reduces risk. Start here:{" "}
                  <Link href="/brokers" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    find a broker on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="inspection" className="mt-20 scroll-mt-28">
                <p className="section-label">Inspection checklist</p>
                <h2 className="section-heading">Inspection checklist for a used Astrea 42.</h2>
                <p>
                  Use this as your walk-through list and to brief your surveyor. It’s designed to surface the expensive truths early.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Buyer checklist</div>
                    <div className="text-[12px] text-[#0a211f]/45">Survey + your checks</div>
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
                  Negotiation method: price every defect. Then decide whether you’re negotiating or walking.
                </p>
              </section>

              <section id="sea-trial" className="mt-20 scroll-mt-28">
                <p className="section-label">Sea trial focus</p>
                <h2 className="section-heading">Sea trial checklist: test the boat under real load.</h2>
                <p>
                  You’re not there to “feel the vibe”. You’re there to confirm stability, temps, and system behaviour under sustained use.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">What to test during sea trial</div>
                    <div className="text-[12px] text-[#0a211f]/45">Don’t rely on memory</div>
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
                  If the seller resists a proper trial under load, treat it as information.
                </p>
              </section>

              <section id="paperwork" className="mt-20 scroll-mt-28">
                <p className="section-label">Paperwork & VAT</p>
                <h2 className="section-heading">Paperwork is the transaction.</h2>
                <p>
                  Make sure the ownership chain is clean, VAT/tax status is clear, registration is correct, and any liens are cleared.
                  Your survey protects the boat — your paperwork protects the deal.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/buy/brand/fountaine-pajot/model/astrea-42"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]"
                  >
                    Browse Astrea 42 listings →
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
                <h2 className="section-heading">Charter Astrea 42s can be bargains — if you buy the technical truth.</h2>
                <p>
                  Charter history isn’t automatically bad. The question is whether the documentation is real and whether
                  the refit was technical — not only cosmetic.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">How to judge charter history</div>
                    <div className="text-[12px] text-[#0a211f]/45">Green vs red flags</div>
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
                        <li>Messy wiring / undocumented lithium upgrades</li>
                        <li>Persistent odours, damp lockers, recurring leaks</li>
                        <li>Seller reluctance to load-test systems</li>
                        <li>Unclear VAT status or paperwork gaps</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="resale" className="mt-20 scroll-mt-28">
                <p className="section-label">Resale & liquidity</p>
                <h2 className="section-heading">Resale is strongest when you buy the right history.</h2>
                <p>
                  Astrea 42 liquidity tends to be strong for clean, well-documented boats — especially owner-use examples with
                  sensible autonomy spec and honest histories. Buyers pay for predictable ownership.
                </p>

                <div className="pull-quote">“Resale day starts on purchase day: keep logs, keep receipts, keep it honest.”</div>
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
                    <span className="text-[#fff86c]">Astrea 42</span> with confidence.
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                    Explore real listings, compare spec, and keep the buying process disciplined — from shortlist to survey day.
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                    <Link
                      href="/buy/brand/fountaine-pajot/model/astrea-42"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                    >
                      Browse Astrea 42 listings
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
                    <span className="text-[#0a211f]/60">Astrea 42 buying guide</span>
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