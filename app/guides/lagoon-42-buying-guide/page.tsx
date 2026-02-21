// app/guides/lagoon-42-buying-guide/page.tsx
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
  { id: "who", label: "Who it’s for" },
  { id: "versions", label: "Versions & layouts" },
  { id: "pricing", label: "Price ranges by era" },
  { id: "charter", label: "Ex-charter reality" },
  { id: "comparison", label: "Compare vs 40 / 46 / 450" },
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
   CONTENT
   ─────────────────────────────────────────── */

const stats = [
  { value: "Sweet spot", label: "Volume + demand + manageable complexity" },
  { value: "Charter core", label: "Huge ex-charter supply → inspect harder" },
  { value: "Energy matters", label: "Batteries / charging / loads = comfort" },
  { value: "Buy records", label: "Invoices + logs are a pricing weapon" },
]

const quickTopics = [
  "Lagoon 42 for sale",
  "Lagoon 42 owner version",
  "Lagoon 42 ex charter",
  "Lagoon 42 price",
  "Lagoon 42 review",
  "Used catamaran checklist",
  "Catamaran sea trial guide",
  "Charter crossover economics",
]

type EraRow = {
  era: string
  range: string
  typicallyIncludes: string
  valueDrivers: string
  bestFor: string
}

const eraPricing: EraRow[] = [
  {
    era: "Early used / first-wave inventory",
    range: "Often ~€400k–€650k",
    typicallyIncludes:
      "Higher hours, older nav, mixed refit quality; may be ex-charter; sails/rig age varies widely",
    valueDrivers:
      "Rig replacement proof, engines/genset/AC health, core moisture checks, honest refit invoices",
    bestFor:
      "Value buyers who survey aggressively and budget upgrades early (energy + nav + soft goods)",
  },
  {
    era: "Mid-used / well-kept examples",
    range: "Often ~€650k–€900k",
    typicallyIncludes:
      "Better inventory completeness; more consistent maintenance; may include watermaker/solar/upgrades",
    valueDrivers:
      "Owner layout, energy upgrades (lithium/solar/inverters), full logs, clean bilges + electrics",
    bestFor:
      "Balanced buyers who want comfort without taking on a full refit project",
  },
  {
    era: "Late-model / high-spec / pristine",
    range: "Often ~€900k–€1.3m+",
    typicallyIncludes:
      "Higher spec nav + comfort systems, fresher soft goods, better cosmetics; stronger resale positioning",
    valueDrivers:
      "Professional maintenance trail, sorted systems under load, VAT/title clarity, complete safety inventory",
    bestFor:
      "Owners planning longer seasons and wanting predictable ownership + easy resale later",
  },
]

type LayoutRow = {
  label: string
  whyItMatters: string
  whatToCheck: string
}

const layouts: LayoutRow[] = [
  {
    label: "Owner version vs charter layout",
    whyItMatters:
      "Owner versions usually command stronger demand: fewer cabins, more storage, better owner privacy and systems care patterns.",
    whatToCheck:
      "Confirm cabin count, storage, galley spec, and whether systems upgrades were done for owner comfort vs charter turnover.",
  },
  {
    label: "Helm / cockpit flow",
    whyItMatters:
      "How you live aboard is mostly cockpit and galley flow. Small differences change daily comfort dramatically.",
    whatToCheck:
      "Sightlines, weather exposure at helm, traveller/boom control ergonomics, boarding points, dinghy access.",
  },
  {
    label: "Energy & refrigeration loads",
    whyItMatters:
      "Liveaboard comfort is batteries + charging + refrigeration load. If it’s weak, you’ll run the generator constantly.",
    whatToCheck:
      "Battery chemistry/age, inverter capacity, solar sizing, alternator upgrades, wiring quality, fridge/freezer condition.",
  },
]

type CompareRow = {
  model: string
  bestFor: string
  tradeOff: string
  link: string
}

const compareRows: CompareRow[] = [
  {
    model: "Lagoon 40",
    bestFor: "Smaller crews, easier berths, lower operating load",
    tradeOff: "Less volume; may feel tight if you do long seasons with guests",
    link: "/buy/brand/lagoon/model/lagoon-40",
  },
  {
    model: "Lagoon 42",
    bestFor: "The demand sweet spot: space + comfort + broad resale pool",
    tradeOff: "More systems load than 40; ex-charter supply means inspection matters",
    link: "/buy/brand/lagoon/model/lagoon-42",
  },
  {
    model: "Lagoon 46",
    bestFor: "More storage + guest comfort; longer seasons aboard",
    tradeOff: "More complexity: energy, plumbing, davits; higher operating rhythm",
    link: "/buy/brand/lagoon/model/lagoon-46",
  },
  {
    model: "Lagoon 450 / 450F",
    bestFor: "Proven charter platform; market familiarity and parts availability",
    tradeOff: "Often charter-worn; refits can be cosmetic; inspect rigs + systems harder",
    link: "/buy/brand/lagoon/model/lagoon-450",
  },
]

type CharterQ = { q: string; why: string }

const charterQuestions: CharterQ[] = [
  {
    q: "Show me gross revenue + booking evidence (not a summary).",
    why: "If the operator can’t show it cleanly, the economics are storytelling.",
  },
  {
    q: "What refit work was done and where are invoices (with dates + yards)?",
    why: "Paint and cushions don’t fix tired generators, wiring, or moisture.",
  },
  {
    q: "Standing rigging replacement history (dates, invoices, who signed it off).",
    why: "Rig age is a six-figure risk over time and can be used to negotiate.",
  },
  {
    q: "How are damages logged and recovered from guests?",
    why: "Small repeated damage becomes structural wear and hidden maintenance.",
  },
  {
    q: "How are maintenance budgets approved and capped?",
    why: "You need control, or the boat becomes a cost centre you can’t manage.",
  },
  {
    q: "How do they handle downtime and what’s the realistic utilisation?",
    why: "The fantasy is ‘always booked’. The reality is weather + repairs + gaps.",
  },
]

const inspectionChecklist = [
  "Moisture readings around deck hardware, stanchions, windows, cleats, and any added fittings (davit/solar mounts)",
  "Evidence of slamming wear / stress: cracks, repairs, gelcoat work, impact history, and structural inspection notes",
  "Standing rigging age + replacement proof (invoices, dates) and mast/chainplate inspection",
  "Sails + running rigging condition; winches and deck gear service history",
  "Engines: diagnostics, cooling systems, mounts, vibration notes, hours vs servicing discipline",
  "Generator + air-conditioning under load (not just idle) + service history",
  "Energy system: batteries, inverters, chargers, alternators, solar, wiring quality, corrosion, bonding",
  "Plumbing: pumps, hot water, heads, holding tanks, hose condition, leaks, smells",
  "Watermaker: operation + maintenance logs (membrane age matters)",
  "Tender + davits/handling gear mounts and reinforcement; stress cracks near mounts",
  "Bilges: cleanliness, pump function, ingress clues, float switches and alarms",
  "Documentation: ownership chain, VAT/tax status, registration, CE compliance where relevant, lien checks",
]

const seaTrialFocus = [
  "Cold start on both engines: smoke, idle stability, temps and pressure trends",
  "Motoring cruise run: vibration, steering response, temperature stability, any alarms under load",
  "Sailing test where possible: pointing, speed vs wind, helm feel, autopilot behaviour",
  "Tacks/jibes: sheet loads, traveller control, winch behaviour, rig noises",
  "Generator + AC running during trial: confirm electrical stability under real load",
  "Watermaker run + product water check (if fitted): pressure behaviour and output stability",
  "Post-trial engine room + bilge check: leaks, smells, belt dust, coolant residue, salt tracks",
]

const faqs = [
  {
    q: "Why is the Lagoon 42 considered a sweet spot?",
    a: "Because it balances what most buyers want: real liveaboard comfort, a broad resale pool, and manageable complexity compared to larger platforms. Demand is strong when condition and records are clean.",
  },
  {
    q: "Should I avoid an ex-charter Lagoon 42?",
    a: "Not automatically. Ex-charter can be good value if maintenance records are complete and the refit quality is honest. The key is to inspect harder: rig age, moisture, energy systems, generator/AC under load, and plumbing.",
  },
  {
    q: "What upgrades matter most for liveaboard comfort?",
    a: "Energy and loads: batteries (often lithium), inverter/charger capacity, solar, alternator upgrades, refrigeration health, and wiring quality. These determine how often you must run the generator.",
  },
  {
    q: "What’s the biggest pricing lever on a Lagoon 42?",
    a: "History + systems. Rig replacement proof, sorted generator/AC, strong electrical/plumbing health, and clean survey results can justify a premium. Missing records or tired systems should reduce price materially.",
  },
  {
    q: "Does the Lagoon 42 hold value?",
    a: "Generally yes, especially owner versions or well-maintained examples with clear documentation. Liquidity is strongest for clean boats with sorted systems and an honest story.",
  },
]

export default function Lagoon42BuyingGuidePage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const schemas = useMemo(() => {
    const url = absoluteUrl("/guides/lagoon-42-buying-guide")

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
      headline: "Lagoon 42 buying guide (2026): prices by era, ex-charter reality, and what to inspect",
      description:
        "A practical buying guide to the Lagoon 42 catamaran: realistic price bands by era, layout choices, ex-charter checklist, inspection priorities, sea trial focus, paperwork, and resale considerations.",
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
        { "@type": "ListItem", position: 3, name: "Lagoon 42 buying guide", item: url },
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
          <Image src="/hero-buy.jpg" alt="Lagoon 42 buying guide — Findaly" fill className="object-cover" priority />
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
              Buying Guide • Lagoon • Model: 42
            </motion.p>

            <motion.h1
              className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl"
              variants={fadeUp}
            >
              Lagoon 42 buying guide:{" "}
              <span className="text-[#fff86c]">prices by era</span>, ex-charter reality & what to inspect (2026).
            </motion.h1>

            <motion.p className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed" variants={fadeUp}>
              The practical buyer’s guide to the most in-demand Lagoon platform — with layout choices, realistic price
              bands, charter crossover questions, inspection priorities, and the sea-trial checklist that protects your downside.
            </motion.p>

            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href="/buy/brand/lagoon/model/lagoon-42"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Browse Lagoon 42 listings
              </Link>
              <Link
                href="/buy/brand/lagoon"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                Lagoon brand hub
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
                      Use the Lagoon 42 model hub, then filter by year, cabins, location, and budget.
                    </p>
                    <Link
                      href="/buy/brand/lagoon/model/lagoon-42"
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#fff86c] text-[13.5px] font-semibold text-[#0a211f]"
                    >
                      Lagoon 42 listings →
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                    Related hubs
                  </p>
                  <Link href="/buy/brand/lagoon" className="pillar-link">
                    <span>🏷️</span> Lagoon brand hub
                  </Link>
                  <Link href="/guides/lagoon-catamaran-buying-guide" className="pillar-link">
                    <span>📘</span> Lagoon catamaran guide
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
                    Compare quickly
                  </p>
                  <div className="space-y-2">
                    {[
                      { title: "Lagoon 40 listings", slug: "lagoon-40", icon: "⛵" },
                      { title: "Lagoon 46 listings", slug: "lagoon-46", icon: "🧭" },
                      { title: "Lagoon 450 listings", slug: "lagoon-450", icon: "🛟" },
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
                <h2 className="section-heading">The Lagoon 42 is popular because it’s the catamaran most people actually use.</h2>
                <p>
                  The <strong>Lagoon 42</strong> sits in the sweet spot: enough volume to feel like a floating apartment,
                  small enough to berth without constant stress, and common enough that buyers (and surveyors) know where to look.
                </p>
                <p>
                  This guide is intentionally wired into Findaly’s cluster:{" "}
                  <strong>Lagoon brand hub → Lagoon 42 model hub → listings</strong>. If you want to browse inventory while reading,
                  open the{" "}
                  <Link
                    href="/buy/brand/lagoon/model/lagoon-42"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Lagoon 42 listings hub
                  </Link>{" "}
                  and filter by year, cabins, and location.
                </p>
                <div className="pull-quote">
                  “Most buyers don’t choose the Lagoon 42 because it’s perfect. They choose it because it’s the most reliably usable.”
                </div>
              </section>

              <section id="who" className="mt-20 scroll-mt-28">
                <p className="section-label">Who it’s for</p>
                <h2 className="section-heading">Who the Lagoon 42 fits (and who should size up or down).</h2>
                <p>
                  The best way to buy is to define your real use-case: number of people aboard, duration per trip,
                  and how “hands-on” you are with systems. The Lagoon 42 works for a lot of buyers — but not every buyer.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Best-fit breakdown</div>
                    <div className="text-[12px] text-[#0a211f]/45">Use-case first, aesthetics second</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">Ideal for</div>
                      <ul className="mt-3">
                        <li>Couples or families doing long weekends → weeks</li>
                        <li>Buyers wanting stability at anchor + social cockpit flow</li>
                        <li>Owners who may do some charter weeks to offset costs</li>
                        <li>People who want broad resale demand later</li>
                        <li>Med + Caribbean style cruising patterns</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Consider alternatives if</div>
                      <ul className="mt-3">
                        <li>You want simpler ownership → consider a <Link href="/buy/brand/lagoon/model/lagoon-40" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">Lagoon 40</Link></li>
                        <li>You’ll host guests constantly → consider <Link href="/buy/brand/lagoon/model/lagoon-46" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">Lagoon 46</Link></li>
                        <li>You want proven charter economics → consider <Link href="/buy/brand/lagoon/model/lagoon-450" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">Lagoon 450</Link></li>
                        <li>You hate maintenance → don’t buy tired systems to “save money”</li>
                        <li>You want performance sailing → different brands may suit better</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="versions" className="mt-20 scroll-mt-28">
                <p className="section-label">Versions & layouts</p>
                <h2 className="section-heading">Layouts matter more than year. Buy the version you’ll actually live in.</h2>
                <p>
                  Lagoon 42 listings can look identical in photos and behave totally differently in ownership.
                  The difference is usually layout + energy system decisions. Treat layout as a “core spec”, not a preference.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Layout decisions that change ownership</div>
                    <div className="text-[12px] text-[#0a211f]/45">What it changes + what to check</div>
                  </div>
                  <div>
                    {layouts.map((l) => (
                      <div key={l.label} className="row">
                        <div className="row-title">{l.label}</div>
                        <p className="row-note">
                          <strong>Why it matters:</strong> {l.whyItMatters}
                        </p>
                        <p className="row-note mb-0!">
                          <strong>What to check:</strong> {l.whatToCheck}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-8">
                  If you’re browsing broadly, start at the{" "}
                  <Link
                    href="/buy/brand/lagoon"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Lagoon brand hub
                  </Link>{" "}
                  then filter to the 42 model — it keeps the route consistent and supports the cluster structure.
                </p>
              </section>

              <section id="pricing" className="mt-20 scroll-mt-28">
                <p className="section-label">Price ranges by era</p>
                <h2 className="section-heading">Lagoon 42 pricing varies by era — but systems + records decide the real number.</h2>
                <p>
                  Lagoon 42 prices swing hard because supply includes owner boats, lightly chartered boats, and heavily chartered boats.
                  The most expensive mistake is buying the cheapest listing and then discovering you also bought a refit.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Typical price bands (directional)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Use for context, not as a promise</div>
                  </div>
                  <div className="row p-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="th">Era</th>
                          <th className="th">Typical range</th>
                          <th className="th">Typically includes</th>
                          <th className="th">Value drivers</th>
                          <th className="th">Best for</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eraPricing.map((r) => (
                          <tr key={r.era}>
                            <td className="td"><strong>{r.era}</strong></td>
                            <td className="td">{r.range}</td>
                            <td className="td">{r.typicallyIncludes}</td>
                            <td className="td">{r.valueDrivers}</td>
                            <td className="td">{r.bestFor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re financing the purchase, keep it practical: finance a boat you can still comfortably own (berth, insurance,
                  servicing, upgrades). Start here:{" "}
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
                <p className="section-label">Ex-charter reality</p>
                <h2 className="section-heading">Ex-charter Lagoon 42: what’s normal, what’s dangerous, what’s negotiable.</h2>
                <p>
                  Ex-charter is not a red flag by itself. The risk is uncertainty: missing invoices, “refits” without proof,
                  tired generators, moisture findings, rig age, and rushed cosmetic work.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">The questions that stop fantasy economics</div>
                    <div className="text-[12px] text-[#0a211f]/45">Ask these before you fly to view</div>
                  </div>
                  <div className="row">
                    <ul className="mt-0">
                      {charterQuestions.map((x) => (
                        <li key={x.q}>
                          <strong>{x.q}</strong>
                          <div className="text-[13.5px] mt-1 text-[#0a211f]/55">{x.why}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pull-quote">
                  “Ex-charter can be great value — if you buy the records and the survey. Without that, you’re buying a story.”
                </div>

                <p className="mt-6">
                  If your goal is charter rather than ownership, start here:{" "}
                  <Link
                    href="/charter"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    charter on Findaly
                  </Link>
                  . If your goal is ownership, treat charter history as a checklist multiplier.
                </p>
              </section>

              <section id="comparison" className="mt-20 scroll-mt-28">
                <p className="section-label">Compare vs 40 / 46 / 450</p>
                <h2 className="section-heading">Compare Lagoon 42 vs nearby alternatives.</h2>
                <p>
                  The Lagoon 42 is often the right answer — but not always. Use this comparison to choose by operating rhythm,
                  not by cabin count and photos.
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
                          <th className="th">Trade-off</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compareRows.map((r) => (
                          <tr key={r.model}>
                            <td className="td">
                              <Link
                                href={r.link}
                                className="text-[#0a211f] font-semibold no-underline hover:underline decoration-[#fff86c] underline-offset-4"
                              >
                                {r.model}
                              </Link>
                            </td>
                            <td className="td">{r.bestFor}</td>
                            <td className="td">{r.tradeOff}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section id="ownership" className="mt-20 scroll-mt-28">
                <p className="section-label">Ownership reality</p>
                <h2 className="section-heading">Ownership is energy + systems load. Get that right and life is calm.</h2>
                <p>
                  On a Lagoon 42, comfort is mostly about the “invisible stack”: batteries, charging, refrigeration load,
                  pumps, plumbing, generator, AC. If these are healthy, ownership is easy. If they’re tired, ownership becomes expensive.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Where your money actually goes</div>
                    <div className="text-[12px] text-[#0a211f]/45">The boring stuff that matters most</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">High-impact items</div>
                      <ul className="mt-3">
                        <li>Rig + sail wardrobe renewal cadence (and proof)</li>
                        <li>Generator + AC under real load</li>
                        <li>Energy system upgrades (lithium/solar/inverters) + wiring quality</li>
                        <li>Watermaker + plumbing health (hoses, pumps, tanks)</li>
                        <li>Moisture + bedding around deck hardware</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Owner mindset</div>
                      <ul className="mt-3">
                        <li>Buy records, then buy the boat</li>
                        <li>Survey + sea trial are protection, not drama</li>
                        <li>Energy discipline = comfort (liveaboard especially)</li>
                        <li>Keep invoices from day one (resale starts now)</li>
                        <li>Don’t let cosmetics replace inspection</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="mt-8">
                  Want a broker to reduce cross-border risk?{" "}
                  <Link
                    href="/brokers"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    find a broker on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="inspection" className="mt-20 scroll-mt-28">
                <p className="section-label">Inspection checklist</p>
                <h2 className="section-heading">Inspection checklist for a used Lagoon 42.</h2>
                <p>
                  The Lagoon 42 is common enough that patterns repeat. This checklist focuses on the expensive truths:
                  moisture, rig age, energy health, and systems under load.
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
                  Negotiation rule: list every defect, price it, and total it. If the seller can’t explain the gap, you walk.
                </p>
              </section>

              <section id="sea-trial" className="mt-20 scroll-mt-28">
                <p className="section-label">Sea trial focus</p>
                <h2 className="section-heading">Sea trial checklist: stress test the systems, not the vibes.</h2>
                <p>
                  The sea trial is where “sorted” becomes obvious. Run systems under load, test sailing if possible,
                  and take notes. A Lagoon 42 should feel calm when healthy.
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
                <h2 className="section-heading">Paperwork isn’t admin — it’s the deal.</h2>
                <p>
                  Lagoon 42 transactions are often cross-border. Your paperwork stack must be disciplined: ownership chain,
                  registration, VAT/tax status, CE compliance (where relevant), and any liens. Your survey protects the boat.
                  Your paperwork protects the transaction.
                </p>
                <p>
                  Keep the process clean: written offer, deposit terms, survey contingencies, and a closing timeline.
                  If unsure, work with a reputable broker.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/brokers"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]"
                  >
                    Find a broker →
                  </Link>
                  <Link
                    href="/buy/brand/lagoon/model/lagoon-42"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-[#0a211f]/15 px-7 text-[14.5px] font-medium text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors"
                  >
                    Back to Lagoon 42 listings →
                  </Link>
                </div>
              </section>

              <section id="resale" className="mt-20 scroll-mt-28">
                <p className="section-label">Resale & liquidity</p>
                <h2 className="section-heading">Resale is strongest when you buy a clean story.</h2>
                <p>
                  Lagoon 42 liquidity is strong because demand is broad — but buyers pay for certainty. The boats that sell cleanly
                  are the ones with records, sorted systems, honest surveys, and a maintenance trail that reads like discipline.
                </p>
                <p>
                  If resale matters, buy the version with broad demand (often owner layouts), keep your invoices, and maintain proactively.
                  Buyers reward clarity.
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
                    Find your next <span className="text-[#fff86c]">Lagoon 42</span> with confidence.
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                    Explore real listings, compare layouts, and keep the buying process clean — from shortlist to survey day.
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                    <Link
                      href="/buy/brand/lagoon/model/lagoon-42"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                    >
                      Browse Lagoon 42 listings
                    </Link>
                    <Link
                      href="/buy/brand/lagoon"
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                    >
                      Lagoon brand hub
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
                    <Link href="/guides/lagoon-catamaran-buying-guide" className="hover:text-[#0a211f]/60 transition-colors">
                      Lagoon guide
                    </Link>
                    <span>/</span>
                    <span className="text-[#0a211f]/60">Lagoon 42 buying guide</span>
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