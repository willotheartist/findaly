// app/guides/lagoon-catamaran-buying-guide/page.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { absoluteUrl } from "@/lib/site"

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
  { id: "why", label: "Why Lagoon" },
  { id: "lineup", label: "Lineup & best-fit" },
  { id: "pricing", label: "Price ranges" },
  { id: "charter", label: "Charter crossover maths" },
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
  { value: "Charterable", label: "Lagoon is a charter-world default for a reason" },
  { value: "Liveable", label: "Volume, layout, and systems built for time aboard" },
  { value: "Resalable", label: "Liquidity is strong for clean, well-documented boats" },
  { value: "Sensitive", label: "Condition + records matter more than the brochure" },
]

const quickTopics = [
  "Lagoon catamaran",
  "Lagoon 42",
  "Lagoon 46",
  "Lagoon 450",
  "Lagoon 50",
  "Used Lagoon inspection checklist",
  "Charter revenue vs ownership cost",
  "Catamaran sea trial guide",
]

type RangeRow = {
  segment: string
  range: string
  whatDrivesIt: string
  bestFor: string
}

const rangeTable: RangeRow[] = [
  {
    segment: "Older / earlier generations (pre-modern refit era)",
    range: "Often ~€250k–€650k",
    whatDrivesIt:
      "Charter history, rig/sails age, engines, generator/AC health, osmosis checks, bridge-deck slamming wear, electrical condition",
    bestFor:
      "Value buyers who inspect hard, budget refit, and want maximum cabin volume per euro",
  },
  {
    segment: "Mid-generation used (popular charter platforms)",
    range: "Often ~€650k–€1.2m",
    whatDrivesIt:
      "Layout (owner vs charter), inventory completeness, tender/outboard, sail wardrobe, lithium upgrades, watermaker, service logs",
    bestFor:
      "Most balanced: modern systems, easier resale, strong charter crossover options",
  },
  {
    segment: "Late-model / high-spec / larger platforms",
    range: "Often ~€1.0m–€2.2m+",
    whatDrivesIt:
      "Spec packages, electronics age, stabilisation/comfort systems, professional maintenance, clean history, VAT status clarity",
    bestFor:
      "Owners planning serious seasons (Med/Caribbean) and predictable ownership",
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
    name: "Lagoon 40",
    slug: "lagoon-40",
    bestFor: "Entry sweet spot: manageable size, great liveability for couples and small families",
    watchOut: "Charter wear patterns, sail/rig age, helm station exposure, generator hours vs servicing",
    valueDrivers: ["Owner layout", "Service logs", "Clean electrical + bilge", "Updated nav"],
  },
  {
    name: "Lagoon 42",
    slug: "lagoon-42",
    bestFor: "The high-demand used platform: volume + comfort + broad resale pool",
    watchOut: "Bridge-deck slamming wear, core moisture around fittings, AC/watermaker health, charter refit quality",
    valueDrivers: ["Owner version", "Rig/sails condition", "Watermaker", "Evidence of proactive maintenance"],
  },
  {
    name: "Lagoon 46",
    slug: "lagoon-46",
    bestFor: "More space and longer seasons aboard; better guest comfort and storage",
    watchOut: "Systems density grows: electrics/plumbing, battery bank, refrigeration load, dinghy/davit stress",
    valueDrivers: ["Energy system upgrades", "Generator/AC under load", "Clean deck hardware", "Full inventory"],
  },
  {
    name: "Lagoon 450 / 450F",
    slug: "lagoon-450",
    bestFor: "Proven charter platform with broad parts/yard familiarity and strong buyer demand",
    watchOut: "Charter fatigue, cosmetic refits hiding systems issues, standing rigging age, keel/hull impact history",
    valueDrivers: ["Verified refit invoices", "Rig renewal proof", "Engine room cleanliness", "Survey results"],
  },
  {
    name: "Lagoon 50",
    slug: "lagoon-50",
    bestFor: "Owners prioritising comfort, crew flow, and serious liveaboard capability",
    watchOut: "You’re buying a systems platform: refrigeration, AC, genset, batteries, watermaker, pumps",
    valueDrivers: ["Professional care history", "Upgraded energy", "Inventory completeness", "Clean title + VAT clarity"],
  },
]

type ComparisonRow = {
  model: string
  bestFor: string
  charterFit: string
  ownershipFeel: string
  keyChecks: string
  linkSlug: string
}

const comparisonRows: ComparisonRow[] = [
  {
    model: "Lagoon 40",
    bestFor: "Couples / small crews / manageable berths",
    charterFit: "Lower weekly rates, but easier utilisation in many markets",
    ownershipFeel: "Simpler, lighter systems burden (if kept clean)",
    keyChecks: "Rig/sails age, generator/AC, core moisture near fittings, electrics",
    linkSlug: "lagoon-40",
  },
  {
    model: "Lagoon 42",
    bestFor: "All-round liveaboard + broad resale demand",
    charterFit: "Very strong charter crossover demand (depending on layout)",
    ownershipFeel: "Comfortable + predictable with good records",
    keyChecks: "Bridge-deck wear, watermaker, AC, tankage, deck hardware bedding",
    linkSlug: "lagoon-42",
  },
  {
    model: "Lagoon 46",
    bestFor: "Longer seasons onboard + guest comfort",
    charterFit: "Higher rates, higher ops complexity",
    ownershipFeel: "More comfort, more systems (energy discipline matters)",
    keyChecks: "Battery system, refrigeration load, genset, davits, steering/helm exposure",
    linkSlug: "lagoon-46",
  },
  {
    model: "Lagoon 450",
    bestFor: "Proven platform with familiar market demand",
    charterFit: "Charter classic: good utilisation where condition is strong",
    ownershipFeel: "Robust, but often charter-worn — inspect harder",
    keyChecks: "Rig replacement history, engines, structural wear, plumbing/electrical refit quality",
    linkSlug: "lagoon-450",
  },
  {
    model: "Lagoon 50",
    bestFor: "Serious comfort + longer stays aboard",
    charterFit: "Premium rates; premium expectations from guests",
    ownershipFeel: "Luxury ownership rhythm — maintenance discipline required",
    keyChecks: "Genset/AC under load, watermaker, electrical system, documentation and title clarity",
    linkSlug: "lagoon-50",
  },
]

type CharterMathRow = {
  bucket: string
  gross: string
  typicalCosts: string
  reality: string
  bestFor: string
}

const charterMathTable: CharterMathRow[] = [
  {
    bucket: "Light owner-use + some charter weeks",
    gross: "Directional: moderate seasonal income",
    typicalCosts:
      "Management fee, turnaround/cleaning, maintenance spikes, insurance uplift, wear items (sails, canvas, running rigging)",
    reality:
      "This is often the smartest path: offset costs without turning the boat into a commercial asset you don’t control.",
    bestFor: "Owners who want their boat available and still want help paying the bills",
  },
  {
    bucket: "High utilisation (charter-heavy)",
    gross: "Directional: higher top line",
    typicalCosts:
      "Higher wear, higher refit frequency, higher guest damage risk, downtime risk, faster depreciation without strict maintenance",
    reality:
      "Top line looks great until you price the refits. The win is only real with disciplined operators and transparent accounting.",
    bestFor: "Operators who treat it like a business (and can handle downtime risk)",
  },
  {
    bucket: "Premium crewed / high-service positioning",
    gross: "Directional: premium weekly rates",
    typicalCosts:
      "Crew costs, higher service expectations, premium maintenance, guest experience upgrades, compliance/admin overhead",
    reality:
      "Can be strong if managed professionally — but ‘premium’ is a promise you must keep every week.",
    bestFor: "Owners who want a hands-off model and can accept professional control",
  },
]

const inspectionChecklist = [
  "Hull + deck moisture readings, especially around fittings, windows, stanchions, and hardware bedding",
  "Osmosis / blistering checks (survey + history), plus evidence of proper past treatments if any",
  "Standing rigging age + replacement proof (dates, invoices), plus mast/chainplate inspection",
  "Running rigging, sail wardrobe condition, and winch/gear servicing records",
  "Engines: diagnostics, hours vs servicing, cooling systems, mounts, vibration notes",
  "Generator + air-conditioning under load (not just “it turns on”) and service history",
  "Watermaker operation + maintenance logs (membrane age matters)",
  "Electrical system: batteries, chargers, inverters, shore power, wiring quality, corrosion, bonding",
  "Plumbing: freshwater pumps, hot water, heads, holding tanks, leaks, smells, hose condition",
  "Bridge-deck and structural wear: signs of slamming stress, cracks, repairs, impact history",
  "Dinghy + davits/handling gear stress points and mounting reinforcement",
  "Documentation: ownership chain, VAT/tax status, registration, CE compliance where relevant, lien checks",
]

const seaTrialFocus = [
  "Cold start behaviour + smoke, idle stability, temp/pressure trends across both engines",
  "Sailing test where possible: pointing, speed vs wind, rudder/helm feel, autopilot behaviour",
  "Motoring at cruise: vibration, steering response, temperature stability, any alarms under load",
  "Tacking/jibing behaviour: traveller/boom control, sheet loads, winches, rig noises",
  "Generator + AC running during trial: confirm electrical stability under real load",
  "Watermaker run + product water check (if fitted) and pressure behaviour",
  "Post-trial walkthrough: leaks, smells, belt dust, coolant residue, salt tracks, bilge clues",
]

const faqs = [
  {
    q: "Why are Lagoon catamarans so popular?",
    a: "Lagoon catamarans are popular because they optimise real-world use: volume, comfort, social layouts, and predictable ownership when maintained properly. They also sit at the centre of the charter market, which keeps demand strong.",
  },
  {
    q: "Is buying an ex-charter Lagoon a good idea?",
    a: "It can be — if you buy the records and inspect the systems hard. Ex-charter boats often have high hours and wear, but they may also have regular servicing. What matters is transparency: invoices, refit quality, and survey results.",
  },
  {
    q: "Which Lagoon model is the best all-rounder?",
    a: "Many buyers see the Lagoon 42 as a strong all-rounder: excellent liveability, broad demand, and good resale when condition and documentation are clean.",
  },
  {
    q: "What makes Lagoon pricing vary so much?",
    a: "Systems and history. Two boats can look identical in photos, but generator/AC condition, rig age, energy upgrades, watermaker health, and charter/refit quality can create a huge spread in real value.",
  },
  {
    q: "Do Lagoon catamarans hold value?",
    a: "Generally yes, especially popular models in clean condition with strong records. Liquidity is strongest for owner versions or well-maintained ex-charter boats with honest history and sorted systems.",
  },
]

export default function LagoonCatamaranBuyingGuidePage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const schemas = useMemo(() => {
    const url = absoluteUrl("/guides/lagoon-catamaran-buying-guide")

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
      headline: "Lagoon catamaran buying guide (2026): models, prices, charter maths, and what to inspect",
      description:
        "A practical buying guide to Lagoon catamarans: realistic price bands, model comparison, charter crossover economics, inspection checklist, sea trial focus, paperwork, and resale considerations.",
      author: { "@type": "Organization", name: "Findaly" },
      publisher: {
        "@type": "Organization",
        name: "Findaly",
        logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      image: [absoluteUrl("/hero-buy.jpg")],
      datePublished: "2026-02-21",
      dateModified: "2026-02-21",
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/guides") },
        { "@type": "ListItem", position: 3, name: "Lagoon catamaran buying guide", item: url },
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
          <Image
            src="/hero-buy.jpg"
            alt="Lagoon catamaran buying guide — Findaly"
            fill
            className="object-cover"
            priority
          />
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
              Buying Guide • Catamarans • Lagoon
            </motion.p>

            <motion.h1
              className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl"
              variants={fadeUp}
            >
              Lagoon catamaran buying guide:{" "}
              <span className="text-[#fff86c]">pricing, models</span>, charter maths & what to inspect (2026).
            </motion.h1>

            <motion.p
              className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed"
              variants={fadeUp}
            >
              A practical guide for serious buyers — with real-world price bands, model comparisons, the charter
              crossover reality, and the inspection + sea-trial checklist that protects your downside.
            </motion.p>

            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href="/buy/brand/lagoon"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Browse Lagoon listings
              </Link>
              <Link
                href="/buy/brand/lagoon/model/lagoon-42"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                Lagoon 42 listings
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
                    <Image
                      src="/list-boat-cta.jpg"
                      alt="Findaly — browse listings"
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-[#0a211f] p-5">
                    <p className="text-[15px] font-semibold text-white">Jump into live inventory</p>
                    <p className="mt-1.5 text-[13px] text-white/50 leading-relaxed">
                      Use the Lagoon brand hub, then filter by model, year, country, cabins, and budget.
                    </p>
                    <Link
                      href="/buy/brand/lagoon"
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#fff86c] text-[13.5px] font-semibold text-[#0a211f]"
                    >
                      Browse Lagoon →
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                    Lagoon hubs
                  </p>
                  <Link href="/buy/brand/lagoon" className="pillar-link">
                    <span>🏷️</span> Lagoon brand hub
                  </Link>
                  <Link href="/buy" className="pillar-link">
                    <span>🛥️</span> Browse all yachts
                  </Link>
                  <Link href="/charter" className="pillar-link">
                    <span>🧾</span> Charter options
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
                    Lagoon shortcuts
                  </p>
                  <div className="space-y-2">
                    {[
                      { title: "Lagoon 40 listings", slug: "lagoon-40", icon: "⛵" },
                      { title: "Lagoon 42 listings", slug: "lagoon-42", icon: "⭐" },
                      { title: "Lagoon 46 listings", slug: "lagoon-46", icon: "🧭" },
                      { title: "Lagoon 450 listings", slug: "lagoon-450", icon: "🛟" },
                      { title: "Lagoon 50 listings", slug: "lagoon-50", icon: "🏝️" },
                    ].map((x) => (
                      <Link key={x.slug} href={`/buy/brand/lagoon/model/${x.slug}`} className="pillar-link">
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
                <h2 className="section-heading">Buying a Lagoon is usually a lifestyle choice — and sometimes a business one.</h2>
                <p>
                  Buyers searching for a <strong>Lagoon catamaran</strong> usually want the same core thing:
                  <strong> space, comfort, and stability</strong> — the kind of ownership that makes a weekend become a month.
                  The twist is that Lagoon also sits at the heart of the global charter ecosystem, which changes how you
                  should think about value.
                </p>
                <p>
                  This guide is built to support Findaly’s internal structure:{" "}
                  <strong>Lagoon → model hubs → (eventually) year + country hubs</strong>.
                  If you want to browse inventory while reading, start at the{" "}
                  <Link
                    href="/buy/brand/lagoon"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Lagoon brand hub
                  </Link>{" "}
                  then filter into your target model.
                </p>
                <div className="pull-quote">
                  “A Lagoon can be a home, a holiday machine, or a small business. Your checklist changes depending on which one you’re buying.”
                </div>
              </section>

              <section id="why" className="mt-20 scroll-mt-28">
                <p className="section-label">Why Lagoon</p>
                <h2 className="section-heading">Why Lagoon wins (and where buyers should be sharp).</h2>
                <p>
                  Lagoon’s popularity is not an accident. These boats consistently deliver the “catamaran promise”:
                  <strong> volume, social layout, stability at anchor</strong>, and an ownership format that feels usable.
                  The risk is that popularity also means lots of ex-charter inventory — and ex-charter requires sharper buying.
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
                        <li>Huge liveable volume per metre compared to many monohulls</li>
                        <li>Stability at anchor and comfortable social layouts</li>
                        <li>Global yard + service familiarity (parts, surveyors, technicians)</li>
                        <li>Strong demand via the charter ecosystem</li>
                        <li>Broad resale pool for popular models in clean condition</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Watch-outs</div>
                      <ul className="mt-3">
                        <li>Charter wear can be cosmetic *and* structural — inspect harder</li>
                        <li>Rig age and sail wardrobe condition can swing value massively</li>
                        <li>Energy systems (batteries/inverters/solar) make or break liveaboard comfort</li>
                        <li>Moisture and bedding around fittings is a classic hidden cost</li>
                        <li>“Refit” sometimes means “paint over problems”</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="lineup" className="mt-20 scroll-mt-28">
                <p className="section-label">Lineup & best-fit</p>
                <h2 className="section-heading">Pick the platform that fits your cruising rhythm — and your maintenance appetite.</h2>
                <p>
                  Lagoon ownership gets better when you choose the right size for your lifestyle. Bigger isn’t always better:
                  more cabins means more plumbing, more pumps, more refrigeration load, and more systems to manage.
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
                                href={`/buy/brand/lagoon/model/${m.slug}`}
                                className="text-[#0a211f] no-underline hover:underline decoration-[#fff86c] underline-offset-4"
                              >
                                {m.name}
                              </Link>
                            </div>
                            <div className="row-meta">
                              <strong className="text-[#0a211f]">Best for:</strong> {m.bestFor}
                            </div>
                          </div>

                          <Link
                            href={`/buy/brand/lagoon/model/${m.slug}`}
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
                    href="/buy/brand/lagoon"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Lagoon brand hub
                  </Link>{" "}
                  and filter into your target model. That internal route is exactly what makes the guide cluster powerful.
                </p>
              </section>

              <section id="pricing" className="mt-20 scroll-mt-28">
                <p className="section-label">Price ranges</p>
                <h2 className="section-heading">Lagoon pricing is a systems + history conversation, not a photo one.</h2>
                <p>
                  Lagoon prices vary by model, year, region, and specification — but the biggest swing is still:
                  <strong> maintenance discipline</strong>. Charter history, rig age, energy upgrades, and moisture findings
                  can move the “real price” far away from the listing price.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Typical price bands (global)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Directional context only</div>
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
                  If you’re financing, keep it practical: finance a boat you can still comfortably own (berth, insurance,
                  servicing, refit). Start here:{" "}
                  <Link
                    href="/finance"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    yacht finance on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="charter" className="mt-20 scroll-mt-28">
                <p className="section-label">Charter crossover maths</p>
                <h2 className="section-heading">The charter crossover: what’s real, what’s fantasy, and what to ask.</h2>
                <p>
                  Lagoon sits at the centre of global charter. That’s good for demand, but it confuses buyers:
                  some people buy a Lagoon as a home, some as a holiday machine, and some as an income offset.
                </p>
                <p>
                  Here’s the honest version: <strong>charter can offset ownership</strong>, but it also accelerates wear.
                  The win depends on utilisation, operator quality, and whether the numbers are transparent.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Charter reality (directional)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Use this to ask smarter questions</div>
                  </div>

                  <div className="row p-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="th">Bucket</th>
                          <th className="th">Gross</th>
                          <th className="th">Costs that matter</th>
                          <th className="th">Reality</th>
                          <th className="th">Best for</th>
                        </tr>
                      </thead>
                      <tbody>
                        {charterMathTable.map((r) => (
                          <tr key={r.bucket}>
                            <td className="td">
                              <strong>{r.bucket}</strong>
                            </td>
                            <td className="td">{r.gross}</td>
                            <td className="td">{r.typicalCosts}</td>
                            <td className="td">{r.reality}</td>
                            <td className="td">{r.bestFor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Questions to ask any charter operator</div>
                    <div className="text-[12px] text-[#0a211f]/45">The ones that stop “hand-wave economics”</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">Numbers</div>
                      <ul className="mt-3">
                        <li>What was gross revenue, by month, with booking proof?</li>
                        <li>What are management fees and what’s included?</li>
                        <li>How are maintenance + refits accounted for (and capped)?</li>
                        <li>What is typical downtime and how is it handled?</li>
                        <li>What insurance changes under charter use?</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Wear & control</div>
                      <ul className="mt-3">
                        <li>Who approves repairs and budgets?</li>
                        <li>How are guest damages documented and recovered?</li>
                        <li>What refit work was done and where are invoices?</li>
                        <li>How are sails/rigging replaced and scheduled?</li>
                        <li>How is your personal owner-use time protected?</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="mt-8">
                  If you want to charter rather than own, start here:{" "}
                  <Link
                    href="/charter"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    charter on Findaly
                  </Link>
                  . If you want to buy, stay disciplined: buy the records, then buy the boat.
                </p>
              </section>

              <section id="comparison" className="mt-20 scroll-mt-28">
                <p className="section-label">Model comparison</p>
                <h2 className="section-heading">Lagoon model comparison: choose by use-case and operating rhythm.</h2>
                <p>
                  Buyers get stuck comparing cabin count and Instagram photos. The better lens is:
                  <strong> how it feels to own</strong> — energy discipline, systems load, and the maintenance rhythm.
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
                          <th className="th">Charter fit</th>
                          <th className="th">Ownership feel</th>
                          <th className="th">Key checks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonRows.map((r) => (
                          <tr key={r.model}>
                            <td className="td">
                              <Link
                                href={`/buy/brand/lagoon/model/${r.linkSlug}`}
                                className="text-[#0a211f] font-semibold no-underline hover:underline decoration-[#fff86c] underline-offset-4"
                              >
                                {r.model}
                              </Link>
                            </td>
                            <td className="td">{r.bestFor}</td>
                            <td className="td">{r.charterFit}</td>
                            <td className="td">{r.ownershipFeel}</td>
                            <td className="td">{r.keyChecks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-8">
                  Simple rule that keeps buyers safe: <strong>buy the systems and the history</strong>.
                  The best Lagoon you can buy is often the one with the cleanest records and the least “mystery.”
                </p>
              </section>

              <section id="ownership" className="mt-20 scroll-mt-28">
                <p className="section-label">Ownership reality</p>
                <h2 className="section-heading">What ownership really costs: energy, systems load, and discipline.</h2>
                <p>
                  Lagoon ownership gets calm when your energy system is sorted and your maintenance rhythm is predictable.
                  It gets expensive when you ignore the boring stuff: batteries, charging, pumps, refrigeration load, AC/generator health.
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
                        <li>Rig + sails replacement cadence (and proof of renewal)</li>
                        <li>Generator and AC under real load</li>
                        <li>Energy system: batteries, inverters, charging, solar, wiring quality</li>
                        <li>Watermaker and plumbing health (hoses, pumps, tanks)</li>
                        <li>Moisture and bedding around deck hardware</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Owner mindset</div>
                      <ul className="mt-3">
                        <li>Prioritise records and systems over “newer” cosmetics</li>
                        <li>Survey + sea trial are not optional — they’re your protection</li>
                        <li>Energy discipline = comfort (especially liveaboard)</li>
                        <li>Keep logs and invoices from day one (resale day starts now)</li>
                        <li>Don’t let “refit” replace inspection</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re buying internationally, broker support reduces risk. Find one here:{" "}
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
                <h2 className="section-heading">Inspection checklist for a used Lagoon catamaran.</h2>
                <p>
                  You’re not buying a boat — you’re buying the previous owner’s maintenance decisions.
                  This checklist is designed to surface the expensive truths early.
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
                  A smart habit: write down <strong>every</strong> issue and price it. You’ll negotiate better or walk away
                  early — both are wins.
                </p>
              </section>

              <section id="sea-trial" className="mt-20 scroll-mt-28">
                <p className="section-label">Sea trial focus</p>
                <h2 className="section-heading">Sea trial checklist: the fastest way to reveal risk.</h2>
                <p>
                  Treat the sea trial like a stress test. You’re not there to “feel the vibe.” You’re there to confirm:
                  temps, load behaviour, steering, sailing behaviour, and any warnings that only appear under real use.
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
                  If the seller resists a proper trial under load, treat it as information. The best boats welcome scrutiny.
                </p>
              </section>

              <section id="paperwork" className="mt-20 scroll-mt-28">
                <p className="section-label">Paperwork & VAT</p>
                <h2 className="section-heading">Paperwork isn’t admin — it’s the transaction.</h2>
                <p>
                  Lagoon boats are bought and sold internationally every day. That means your checklist must include the
                  paperwork stack: ownership chain, registration, VAT/tax status, CE compliance (where relevant), and any liens.
                  Your survey protects the boat. Your paperwork protects the deal.
                </p>
                <p>
                  Keep the process disciplined: written offer, deposit terms, survey contingencies, and a clear closing timeline.
                  If you’re unsure, work with a reputable broker.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/brokers"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]"
                  >
                    Find a broker →
                  </Link>
                  <Link
                    href="/buy/brand/lagoon"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-[#0a211f]/15 px-7 text-[14.5px] font-medium text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors"
                  >
                    Back to Lagoon inventory →
                  </Link>
                </div>
              </section>

              <section id="resale" className="mt-20 scroll-mt-28">
                <p className="section-label">Resale & liquidity</p>
                <h2 className="section-heading">Resale is strongest when you buy condition + documentation.</h2>
                <p>
                  Lagoon liquidity is real — but it’s earned. The boats that sell cleanly are the ones with clear stories:
                  consistent servicing, evidence of care, and systems that work under load.
                </p>
                <p>
                  If resale matters, favour popular models (often 40–46 class), keep your logs, and maintain proactively.
                  Buyers pay for certainty.
                </p>

                <div className="pull-quote">“Liquidity is earned. It’s the reward for maintenance discipline.”</div>
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
                    Find your next <span className="text-[#fff86c]">Lagoon</span> with confidence.
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                    Explore real listings, compare models, and keep the buying process clean — from shortlist to survey day.
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                    <Link
                      href="/buy/brand/lagoon"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                    >
                      Browse Lagoon listings
                    </Link>
                    <Link
                      href="/buy/brand/lagoon/model/lagoon-42"
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                    >
                      Lagoon 42 listings
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
                    <Link href="/guides" className="hover:text-[#0a211f]/60 transition-colors">
                      Guides
                    </Link>
                    <span>/</span>
                    <span className="text-[#0a211f]/60">Lagoon catamaran buying guide</span>
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