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
  { id: "why", label: "Why Swift Trawler" },
  { id: "lineup", label: "Lineup & best-fit" },
  { id: "pricing", label: "Price ranges" },
  { id: "comparison", label: "Model comparison" },
  { id: "ownership", label: "Ownership reality" },
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
   CONTENT (deep + structured)
   ─────────────────────────────────────────── */

const stats = [
  { value: "Cruising", label: "Built for comfortable coastal + extended trips" },
  { value: "Efficient", label: "Trawler-style economy vs planing cruisers" },
  { value: "Stable", label: "Stabilisers + hull form matter more than hype" },
  { value: "Liquid", label: "Strong global resale demand for clean examples" },
]

const quickTopics = [
  "Beneteau Swift Trawler",
  "Swift Trawler 35",
  "Swift Trawler 41",
  "Swift Trawler 44",
  "Swift Trawler 48",
  "Swift Trawler 50",
  "Used trawler checklist",
  "Sea trial guide",
]

type RangeRow = {
  segment: string
  range: string
  whatDrivesIt: string
  bestFor: string
}

const rangeTable: RangeRow[] = [
  {
    segment: "Older generations / earlier builds",
    range: "Often ~€300k–€650k",
    whatDrivesIt: "Hours, maintenance records, generator/AC health, refits, stabilisers",
    bestFor: "Value buyers who want range + volume and can inspect hard",
  },
  {
    segment: "Mid generations / late-model used",
    range: "Often ~€650k–€1.2m",
    whatDrivesIt: "Spec packages, navigation suite, stabilisers, tender garage/handling gear",
    bestFor: "Most balanced: comfort, modern systems, easier resale",
  },
  {
    segment: "Recent / high-spec / larger platforms",
    range: "Often ~€1.0m–€1.8m+",
    whatDrivesIt: "Stabilisation, premium nav, climate systems, condition, inventory completeness",
    bestFor: "Owners planning real time aboard and predictable ownership",
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
    name: "Swift Trawler 35",
    slug: "swift-trawler-35",
    bestFor: "Smaller crew, marina-friendly length, efficient cruising with modern comfort",
    watchOut: "Systems density for size: generator/AC, corrosion checks, service access",
    valueDrivers: ["Low-stress handling", "Well-kept service history", "Clean electrical + bilge"],
  },
  {
    name: "Swift Trawler 41",
    slug: "swift-trawler-41",
    bestFor: "Best all-rounder for couples/families who cruise often",
    watchOut: "Stabiliser service history, HVAC under load, drivetrain vibration notes",
    valueDrivers: ["Stabilisers (and records)", "Electronics age", "Engine hours vs servicing"],
  },
  {
    name: "Swift Trawler 44",
    slug: "swift-trawler-44",
    bestFor: "The liquidity sweet spot: space + comfort + broad resale demand",
    watchOut: "Deferred maintenance: cooling systems, generator, through-hulls, corrosion in ER",
    valueDrivers: ["Stabilisation", "Full logs", "Clean sea-trial performance"],
  },
  {
    name: "Swift Trawler 48",
    slug: "swift-trawler-48",
    bestFor: "More volume + longer stays onboard, better for liveaboard-style cruising",
    watchOut: "Systems complexity grows: electrics, plumbing, thrusters, stabiliser calibration",
    valueDrivers: ["Spec completeness", "Engine room condition", "Tender/handling gear"],
  },
  {
    name: "Swift Trawler 50",
    slug: "swift-trawler-50",
    bestFor: "Owners prioritising comfort, stability, and long time aboard",
    watchOut: "Maintenance discipline is everything: you’re buying a systems platform",
    valueDrivers: ["Stabilisers + records", "Generator/AC health", "Professional care history"],
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
    model: "Swift Trawler 35",
    bestFor: "Couples, shorter passages, easy handling",
    ownershipFeel: "Simpler, lighter systems burden (if well kept)",
    keyChecks: "Cooling, electrical, corrosion, access for servicing",
    linkSlug: "swift-trawler-35",
  },
  {
    model: "Swift Trawler 41",
    bestFor: "All-round cruising + frequent weekends away",
    ownershipFeel: "Balanced comfort and operating cost",
    keyChecks: "Stabilisers, generator, HVAC under load, drivetrain vibration",
    linkSlug: "swift-trawler-41",
  },
  {
    model: "Swift Trawler 44",
    bestFor: "Most demanded used-platform in many markets",
    ownershipFeel: "Comfortable + predictable when maintained",
    keyChecks: "Service logs, through-hulls, engine room corrosion, sea trial",
    linkSlug: "swift-trawler-44",
  },
  {
    model: "Swift Trawler 48",
    bestFor: "Longer stays onboard and more guests",
    ownershipFeel: "More comfort, more systems",
    keyChecks: "Systems integrity, stabiliser records, electrics/plumbing",
    linkSlug: "swift-trawler-48",
  },
  {
    model: "Swift Trawler 50",
    bestFor: "Serious cruising lifestyle and longer seasons",
    ownershipFeel: "Premium comfort; maintenance discipline required",
    keyChecks: "Generator/AC, stabilisers, full history, professional upkeep",
    linkSlug: "swift-trawler-50",
  },
]

const inspectionChecklist = [
  "Full engine survey + diagnostics, including cooling system inspection and service intervals",
  "Generator + air-conditioning under load (not just “it turns on”)",
  "Stabilisation system operation + service history (if fitted)",
  "Drivetrain condition (shaft/IPS where relevant), seals, alignment, vibration notes",
  "Fuel system: filters, evidence of water contamination, tank condition, smells/leaks",
  "Corrosion checks in engine room, around through-hulls, seacocks, clamps, bonding",
  "Electrical system: batteries, charging, inverters, shore power, wiring quality",
  "Bilge management: pumps, alarms, float switches, ingress clues",
  "Hull + deck: moisture readings, gelcoat cracks, hardware bedding, window seals",
  "Documentation: ownership chain, VAT/tax status, registration, CE compliance where relevant",
]

const seaTrialFocus = [
  "Cold start behaviour + smoke, idle stability, engine temps and pressure trends",
  "Acceleration to cruising RPM: note any hesitation, vibration, or unusual noises",
  "Steering feel + tracking, thruster behaviour, docking responsiveness",
  "WOT (if appropriate) to confirm engines reach rated RPM without overheating",
  "Stabilisers engaged (if fitted): confirm effect and any warning codes",
  "Generator + AC running during trial: verify electrical stability under load",
  "Post-trial engine room check: leaks, smells, heat, belt dust, coolant residue",
]

const faqs = [
  {
    q: "What is the Beneteau Swift Trawler range best known for?",
    a: "Swift Trawlers are known for efficient coastal and extended cruising, strong onboard comfort, and a design philosophy focused on practical ownership rather than pure speed.",
  },
  {
    q: "How much does a used Swift Trawler cost?",
    a: "Pricing varies by model, year, and specification, but used Swift Trawlers often range from the mid-six figures to well into seven figures. Stabilisation, service history, and systems condition are major value drivers.",
  },
  {
    q: "Which Swift Trawler model is the best all-rounder?",
    a: "Many buyers see the Swift Trawler 41–44 zone as the sweet spot: enough volume for real comfort, manageable operating complexity, and strong resale demand when maintained properly.",
  },
  {
    q: "What should I prioritise when buying used?",
    a: "Mechanical and systems health comes first: engines, generator, AC, electrical systems, stabilisers, and corrosion checks. A sea trial and professional survey are essential.",
  },
  {
    q: "Do Swift Trawlers hold their value?",
    a: "Generally, yes—especially well-maintained examples with clear service records and clean histories. Liquidity is strongest for popular models in good condition.",
  },
]

export default function BeneteauSwiftTrawlerBuyingGuidePage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const schemas = useMemo(() => {
    const base = "https://www.findaly.co" // purely used for schema strings; page still works without it
    const url = `${base}/guides/beneteau-swift-trawler-buying-guide`

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
      headline: "Beneteau Swift Trawler buying guide (2026): models, prices, and what to inspect",
      description:
        "A practical, global buying guide to the Beneteau Swift Trawler range: realistic pricing, model comparison, inspection checklist, sea trial focus, and resale considerations.",
      author: { "@type": "Organization", name: "Findaly" },
      publisher: {
        "@type": "Organization",
        name: "Findaly",
        logo: { "@type": "ImageObject", url: `${base}/logo.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      image: [`${base}/hero-buy.jpg`],
      datePublished: "2026-02-19",
      dateModified: "2026-02-19",
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${base}/guides` },
        { "@type": "ListItem", position: 3, name: "Swift Trawler buying guide", item: url },
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
          <Image src="/hero-buy.jpg" alt="Beneteau Swift Trawler buying guide — Findaly" fill className="object-cover" priority />
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
              Buying Guide • Beneteau • Swift Trawler
            </motion.p>

            <motion.h1
              className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl"
              variants={fadeUp}
            >
              Beneteau Swift Trawler buying guide:{" "}
              <span className="text-[#fff86c]">pricing, models</span> & what to inspect (2026).
            </motion.h1>

            <motion.p
              className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed"
              variants={fadeUp}
            >
              A practical, global guide for serious buyers — with real-world pricing bands,
              model comparisons, inspection priorities, and the sea-trial checklist that protects your downside.
            </motion.p>

            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href="/buy/brand/beneteau"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Browse Beneteau listings
              </Link>
              <Link
                href="/buy/brand/beneteau/model/swift-trawler-44"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                Swift Trawler 44 listings
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
                      Use the Beneteau brand hub, then filter for Swift Trawler models by year, country, length, and budget.
                    </p>
                    <Link
                      href="/buy/brand/beneteau"
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#fff86c] text-[13.5px] font-semibold text-[#0a211f]"
                    >
                      Browse Beneteau →
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                    Beneteau hubs
                  </p>
                  <Link href="/buy/brand/beneteau" className="pillar-link">
                    <span>🏷️</span> Beneteau brand hub
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
                    Swift Trawler shortcuts
                  </p>
                  <div className="space-y-2">
                    {[
                      { title: "Swift Trawler 35 listings", slug: "swift-trawler-35", icon: "🚤" },
                      { title: "Swift Trawler 41 listings", slug: "swift-trawler-41", icon: "🧭" },
                      { title: "Swift Trawler 44 listings", slug: "swift-trawler-44", icon: "⭐" },
                      { title: "Swift Trawler 48 listings", slug: "swift-trawler-48", icon: "🛟" },
                      { title: "Swift Trawler 50 listings", slug: "swift-trawler-50", icon: "🏝️" },
                    ].map((x) => (
                      <Link key={x.slug} href={`/buy/brand/beneteau/model/${x.slug}`} className="pillar-link">
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
                <h2 className="section-heading">A trawler isn’t a vibe — it’s an ownership strategy.</h2>
                <p>
                  Buyers searching for a <strong>Beneteau Swift Trawler</strong> typically want one thing:
                  <strong> comfortable, efficient cruising</strong> without the maintenance chaos of
                  chasing “performance” for its own sake. The Swift Trawler range is built around predictable
                  ownership — efficient hull form, liveable layouts, and systems designed for real time onboard.
                </p>
                <p>
                  This guide is designed to support the entire Findaly internal structure:{" "}
                  <strong>Beneteau → Swift Trawler models → (eventually) year + country hubs</strong>.
                  If you want to browse inventory while reading, start at the{" "}
                  <Link
                    href="/buy/brand/beneteau"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Beneteau brand hub
                  </Link>{" "}
                  then filter into your target Swift Trawler model.
                </p>
                <div className="pull-quote">
                  “You don’t buy a Swift Trawler to go fast. You buy it to go far — comfortably — and sell cleanly later.”
                </div>
              </section>

              <section id="why" className="mt-20 scroll-mt-28">
                <p className="section-label">Why Swift Trawler</p>
                <h2 className="section-heading">Why the Swift Trawler range wins (and where buyers should be sharp).</h2>
                <p>
                  Swift Trawlers are popular because they solve the real-world use case: weekends that become weeks,
                  coastal passages that become seasons. They prioritise <strong>comfort underway</strong>,
                  <strong> stability at anchor</strong>, and <strong>habitable living</strong>.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">What it gets right</div>
                    <div className="text-[12px] text-[#0a211f]/45">And where buyers should focus</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">Strengths</div>
                      <ul className="mt-3">
                        <li>Efficient cruising profile vs many planing motor yachts</li>
                        <li>Comfortable interiors designed for longer stays</li>
                        <li>Good liquidity in popular used models (condition dependent)</li>
                        <li>Broad service familiarity: mechanics, yards, surveyors know the platforms</li>
                        <li>Owner community + known ownership patterns</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Watch-outs</div>
                      <ul className="mt-3">
                        <li>Systems health matters more than cosmetics (generator/AC/electrics)</li>
                        <li>Stabiliser maintenance is non-negotiable if fitted</li>
                        <li>Corrosion and through-hull discipline separates “good” from “expensive”</li>
                        <li>Service records are a pricing weapon — for you or against you</li>
                        <li>Sea trial under load exposes the truth</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="lineup" className="mt-20 scroll-mt-28">
                <p className="section-label">Lineup & best-fit</p>
                <h2 className="section-heading">Pick the platform that fits your cruising style, not your ego.</h2>
                <p>
                  “Swift Trawler” isn’t one thing — it’s a family. The smart way to choose is to define your use:
                  how many people aboard, how often you cruise, and how much complexity you’re willing to maintain.
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
                                href={`/buy/brand/beneteau/model/${m.slug}`}
                                className="text-[#0a211f] no-underline hover:underline decoration-[#fff86c] underline-offset-4"
                              >
                                Beneteau {m.name}
                              </Link>
                            </div>
                            <div className="row-meta">
                              <strong className="text-[#0a211f]">Best for:</strong> {m.bestFor}
                            </div>
                          </div>

                          <Link
                            href={`/buy/brand/beneteau/model/${m.slug}`}
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
                  If you want the fastest path to inventory: open the{" "}
                  <Link
                    href="/buy/brand/beneteau"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Beneteau brand hub
                  </Link>{" "}
                  and filter to Swift Trawler models. That route helps reinforce Findaly’s internal linking layer
                  and keeps this guide connected to live listings.
                </p>
              </section>

              <section id="pricing" className="mt-20 scroll-mt-28">
                <p className="section-label">Price ranges</p>
                <h2 className="section-heading">Real-world pricing is a systems conversation, not a brochure one.</h2>
                <p>
                  Swift Trawler prices vary by model, year, region, and specification — but the biggest swings come from
                  <strong> maintenance discipline</strong> and <strong>systems integrity</strong>.
                  Two boats that “look the same” can be separated by a six-figure gap if one has tired generators, weak AC,
                  neglected stabilisers, or corrosion issues.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Typical price bands (global)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Use as directional context, not a promise</div>
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
                  If you’re financing the purchase, keep it practical: the smartest buyers finance a boat they can still
                  comfortably own (berth, insurance, servicing, upgrades). Explore the basics here:{" "}
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
                <h2 className="section-heading">Swift Trawler model comparison: choose by use-case.</h2>
                <p>
                  When buyers get stuck, it’s usually because they’re comparing length and photos. The more useful lens is:
                  <strong> how it feels to own</strong> — systems, complexity, and the maintenance rhythm.
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
                                href={`/buy/brand/beneteau/model/${r.linkSlug}`}
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
                  A simple rule that keeps buyers safe: <strong>buy the records, then buy the boat</strong>.
                  A clean Swift Trawler with consistent servicing will usually beat a “cheaper” boat with missing history.
                </p>
              </section>

              <section id="ownership" className="mt-20 scroll-mt-28">
                <p className="section-label">Ownership reality</p>
                <h2 className="section-heading">What ownership really costs: systems, servicing, and discipline.</h2>
                <p>
                  Swift Trawler ownership success is less about the badge and more about the system stack:
                  engines, generator, climate, electrics, stabilisers, thrusters, pumps. If these are healthy,
                  the experience is calm. If they’re tired, it becomes expensive — fast.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Where your money actually goes</div>
                    <div className="text-[12px] text-[#0a211f]/45">The “silent” costs buyers miss</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">High-impact items</div>
                      <ul className="mt-3">
                        <li>Engine cooling systems + scheduled servicing</li>
                        <li>Generator and air-conditioning under load</li>
                        <li>Stabilisers (service intervals + calibration)</li>
                        <li>Batteries, charging, inverter, shore power integrity</li>
                        <li>Corrosion management + through-hull discipline</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Owner mindset</div>
                      <ul className="mt-3">
                        <li>Prioritise records and condition over “newer” aesthetics</li>
                        <li>Sea trial + survey are not optional — they’re your protection</li>
                        <li>Budget upgrades early: nav, batteries, safety equipment</li>
                        <li>Pay attention to engine room cleanliness (it signals care)</li>
                        <li>Plan resale day from purchase day (keep logs, keep receipts)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re buying internationally, broker support can reduce risk. Find one here:{" "}
                  <Link
                    href="/brokers"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    yacht brokers on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="inspection" className="mt-20 scroll-mt-28">
                <p className="section-label">Inspection checklist</p>
                <h2 className="section-heading">Inspection checklist for a used Swift Trawler.</h2>
                <p>
                  You’re not buying a boat. You’re buying the next few years of maintenance decisions made by the previous
                  owner. This checklist is designed to surface the expensive truths early.
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
                  A smart buyer habit: write down <strong>every</strong> item you discover during inspection and price it.
                  You’ll either negotiate better, or you’ll walk away early — both outcomes are wins.
                </p>
              </section>

              <section id="sea-trial" className="mt-20 scroll-mt-28">
                <p className="section-label">Sea trial focus</p>
                <h2 className="section-heading">Sea trial checklist: the fastest way to reveal risk.</h2>
                <p>
                  A sea trial should be treated like a stress test. You’re not there to “feel the vibe”.
                  You’re there to confirm performance, temps, load behaviour, stability, and any red flags under real use.
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
                  If the broker or seller resists a proper trial under load, treat it as information.
                  The best boats welcome scrutiny because the truth is on their side.
                </p>
              </section>

              <section id="paperwork" className="mt-20 scroll-mt-28">
                <p className="section-label">Paperwork & VAT</p>
                <h2 className="section-heading">Paperwork isn’t admin — it’s the transaction.</h2>
                <p>
                  Swift Trawlers are often bought and sold internationally. That means your checklist must include the
                  paperwork stack: ownership chain, registration, tax/VAT status, CE compliance (where relevant), and
                  any finance liens. Your survey protects the boat. Your paperwork protects the transaction.
                </p>
                <p>
                  If you’re unsure how to structure a cross-border purchase, work with a reputable broker and keep
                  the process disciplined: written offer, deposit terms, survey contingencies, and clear closing timeline.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/brokers"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]"
                  >
                    Find a broker →
                  </Link>
                  <Link
                    href="/buy/brand/beneteau"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-[#0a211f]/15 px-7 text-[14.5px] font-medium text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors"
                  >
                    Back to Beneteau inventory →
                  </Link>
                </div>
              </section>

              <section id="resale" className="mt-20 scroll-mt-28">
                <p className="section-label">Resale & liquidity</p>
                <h2 className="section-heading">Resale is strongest when you buy the right history.</h2>
                <p>
                  Swift Trawlers tend to sell well when they are maintained properly, documented clearly, and presented
                  honestly. The single biggest resale lever is a clean story: consistent servicing, evidence of care,
                  and systems that work under load.
                </p>
                <p>
                  If resale matters to you, choose a model with broad demand (often the 41–44 zone), keep your logs,
                  and maintain proactively — not reactively. When you decide to sell later, you’ll thank yourself.
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
                    Find your next{" "}
                    <span className="text-[#fff86c]">Swift Trawler</span> with confidence.
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                    Explore real listings, compare models, and keep the buying process clean — from first shortlist
                    to survey day.
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                    <Link
                      href="/buy/brand/beneteau"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                    >
                      Browse Beneteau listings
                    </Link>
                    <Link
                      href="/buy/brand/beneteau/model/swift-trawler-44"
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                    >
                      Swift Trawler 44 listings
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
                    <span className="text-[#0a211f]/60">Beneteau Swift Trawler buying guide</span>
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
