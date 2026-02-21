// app/guides/lagoon-40-buying-guide/page.tsx
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
  { id: "why", label: "Why Lagoon 40" },
  { id: "versions", label: "Versions & layouts" },
  { id: "pricing", label: "Real price ranges" },
  { id: "comparison", label: "Lagoon 40 vs alternatives" },
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
  { value: "40ft", label: "The sweet spot size for many first-time cat buyers" },
  { value: "Huge market", label: "Inventory depth + service familiarity worldwide" },
  { value: "Spec-driven", label: "Price swings come from autonomy + condition" },
  { value: "Liquid", label: "Resale is strong when the story is clean" },
]

const quickTopics = [
  "Lagoon 40",
  "Lagoon 40 price",
  "Lagoon 40 vs Lagoon 42",
  "Lagoon 40 vs Isla 40",
  "Lagoon 40 charter",
  "Used Lagoon 40 checklist",
  "Saildrive seals",
  "Rigging replacement",
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
    segment: "Higher-hours / charter-heavy / base spec",
    range: "Often ~€380k–€650k",
    whatDrivesIt:
      "Charter wear, engine hours, sail age, tired heads/plumbing, cosmetics vs systems reality, nav age",
    bestFor: "Value buyers with survey discipline + a refit budget",
  },
  {
    segment: "Owner-use / balanced spec / clean documentation",
    range: "Often ~€650k–€950k",
    whatDrivesIt:
      "Service history, saildrive maintenance, electrical condition, water systems health, inventory completeness",
    bestFor: "Most buyers: a calm ownership experience + easier resale later",
  },
  {
    segment: "Late-model / high-spec / autonomy done properly",
    range: "Often ~€950k–€1.25m+",
    whatDrivesIt:
      "Lithium + solar quality, modern nav, watermaker/genset/AC under load, location, VAT status, condition",
    bestFor: "Long-season owners who want predictable independence",
  },
]

type VersionCard = {
  title: string
  bestFor: string
  watchOut: string
  valueDrivers: string[]
}

const versions: VersionCard[] = [
  {
    title: "Owner’s layout (3-cabin)",
    bestFor: "Couples who cruise a lot and want storage + a real owner suite",
    watchOut: "Verify autonomy spec: power + water capacity for your plans",
    valueDrivers: ["Owner-buyer demand", "Cleaner histories", "Better day-to-day liveability"],
  },
  {
    title: "4-cabin / guest layout",
    bestFor: "Families + hosting-heavy cruising",
    watchOut: "Plumbing wear compounds: odours/leaks/heads tell the truth",
    valueDrivers: ["Broad demand", "Often charter crossover", "Strong resale if well kept"],
  },
  {
    title: "Charter program boats",
    bestFor: "Entry price + big inventory access",
    watchOut: "Cosmetics can hide systems fatigue; require invoices and load tests",
    valueDrivers: ["Cheaper purchase", "Professional maintenance can exist", "Refit upside"],
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
    model: "Lagoon 40",
    bestFor: "40ft cat buyers who want market depth and proven service familiarity",
    whyPeopleChooseIt: "Huge supply, easy resale path, many spec variants to choose from",
    whatToWatch: "Charter wear, messy electrics, saildrive history, leaks and plumbing fatigue",
    primaryLink: { href: "/buy/brand/lagoon/model/lagoon-40", label: "Lagoon 40 listings" },
  },
  {
    model: "Lagoon 42",
    bestFor: "More space + longer stays with more guests",
    whyPeopleChooseIt: "Benchmark 42ft platform with deep global demand",
    whatToWatch: "Higher systems burden, charter fatigue, spec variance",
    primaryLink: { href: "/guides/lagoon-42-buying-guide", label: "Lagoon 42 guide" },
  },
  {
    model: "Fountaine Pajot Isla 40",
    bestFor: "Modern 40ft alternative with slightly calmer ownership feel",
    whyPeopleChooseIt: "Modern design and strong value when spec and history are clean",
    whatToWatch: "Electrical install quality, water systems, saildrive seals",
    primaryLink: { href: "/guides/isla-40-buying-guide", label: "Isla 40 guide" },
  },
  {
    model: "Bali 4.0 (category alt)",
    bestFor: "Buyers prioritising indoor-outdoor volume and different layout philosophy",
    whyPeopleChooseIt: "Space-forward layouts; appeals to some liveaboard styles",
    whatToWatch: "Build spec, resale dynamics, and how systems are maintained",
  },
]

const inspectionChecklist = [
  "Rig + standing rigging age (invoices matter), chainplates, corrosion, tuning history",
  "Sails: age/shape/UV damage; inventory completeness vs your cruising plan",
  "Engines: diagnostics + service history; verify hours align with invoices",
  "Saildrives: seals, corrosion, oil condition; check for water ingress history",
  "Electrical: batteries (type/age), chargers, inverter, shore power, wiring quality, fusing",
  "Lithium/solar (if present): install quality, documentation, ventilation, safety configuration",
  "Generator + air-conditioning (if fitted) under sustained load — not just a quick demo",
  "Watermaker output + maintenance (membranes, flushing, filter changes)",
  "Leaks/water ingress: deck fittings, windows, hatches, moisture readings where relevant",
  "Steering/autopilot, rudder bearings, sail-handling hardware and winches",
  "Plumbing: odours, leaks, seacocks/through-hulls, pumps, bilge alarms",
  "Bridge-deck slamming/stress clues and structural integrity signals (use-pattern matters)",
  "Documentation: VAT/tax status, registration, ownership chain, CE compliance, liens",
]

const seaTrialFocus = [
  "Cold start + idle stability; alarms, smoke, vibration",
  "Steering + tracking; autopilot engagement test if possible",
  "Cruising RPM: temp/pressure trends and drivetrain vibration notes",
  "Sail handling if possible: hoist/reef, loads, traveller/winch behaviour, sail shape",
  "Genset + AC running during trial: voltage stability and real load behaviour",
  "Watermaker running (if fitted): output stability, noise/vibration, filter condition",
  "Post-trial engine rooms: dry, no new leaks, belt dust, coolant residue, smells",
]

const faqs = [
  {
    q: "Is the Lagoon 40 a good first catamaran?",
    a: "For many buyers, yes. The Lagoon 40 sits in a popular 40ft sweet spot with deep inventory, global service familiarity, and broad resale demand — when you buy a clean example with strong documentation.",
  },
  {
    q: "How much does a used Lagoon 40 cost?",
    a: "Prices vary by year, region, condition and spec. Many boats cluster from mid-six figures into seven figures, with higher prices driven by autonomy upgrades (lithium/solar/watermaker), clean history, and proven systems health.",
  },
  {
    q: "Lagoon 40 vs Lagoon 42 — which should I pick?",
    a: "Choose Lagoon 42 if you want more space for guests and longer stays. Choose Lagoon 40 if you want a slightly lighter systems burden and a massive used market to shop from. In both: buy records first, then buy the boat.",
  },
  {
    q: "What are the biggest inspection priorities?",
    a: "Rigging age, saildrive health, electrical system quality (especially lithium/solar installs), and load-testing generator/AC/watermaker. Leaks and plumbing health are key in guest-heavy layouts.",
  },
  {
    q: "Do Lagoon 40s hold their value?",
    a: "Generally, yes — clean examples in popular configurations tend to sell well because the buyer market is large. Liquidity improves when the maintenance history is clear and systems are proven under load.",
  },
]

export default function Lagoon40BuyingGuidePage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const schemas = useMemo(() => {
    const base = "https://www.findaly.co"
    const url = `${base}/guides/lagoon-40-buying-guide`

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
      headline: "Lagoon 40 buying guide (2026): prices, versions, what to inspect",
      description:
        "A practical Lagoon 40 buying guide: real-world price ranges, versions and layouts, Lagoon 40 vs Lagoon 42 vs Isla 40, inspection checklist, sea trial priorities, paperwork/VAT, charter considerations, and resale.",
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
        { "@type": "ListItem", position: 3, name: "Lagoon 40 buying guide", item: url },
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
          <Image src="/hero-buy.jpg" alt="Lagoon 40 buying guide — Findaly" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/70 via-[#0a211f]/35 to-[#f5f2eb]" />

          <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" variants={stagger} initial="hidden" animate="show">
            <motion.p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#fff86c] mb-4" variants={fadeUp}>
              Buying Guide • Lagoon • Lagoon 40
            </motion.p>

            <motion.h1 className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl" variants={fadeUp}>
              Lagoon 40 buying guide:{" "}
              <span className="text-[#fff86c]">prices, versions</span> & what to inspect (2026).
            </motion.h1>

            <motion.p className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed" variants={fadeUp}>
              The practical buyer’s guide: real-world price bands, version choices, Lagoon 40 vs Lagoon 42 vs Isla 40, charter boat
              reality, inspection checklist, sea-trial tests, paperwork/VAT, and resale logic.
            </motion.p>

            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href="/buy/brand/lagoon/model/lagoon-40"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Browse Lagoon 40 listings
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

        {/* TWO-COLUMN BODY */}
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
                      The Lagoon hub + model filters are your fastest path to real-market pricing. Read the checklist sections below,
                      then compare against listings you shortlist.
                    </p>
                    <Link
                      href="/buy/brand/lagoon/model/lagoon-40"
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#fff86c] text-[13.5px] font-semibold text-[#0a211f]"
                    >
                      Browse Lagoon 40 →
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">Lagoon shortcuts</p>
                  <Link href="/buy/brand/lagoon" className="pillar-link">
                    <span>🏷️</span> Lagoon brand hub
                  </Link>
                  <Link href="/buy/brand/lagoon/model/lagoon-40" className="pillar-link">
                    <span>🧭</span> Lagoon 40 listings
                  </Link>
                  <Link href="/buy/brand/lagoon/model/lagoon-42" className="pillar-link">
                    <span>⭐</span> Lagoon 42 listings
                  </Link>
                  <Link href="/guides/lagoon-42-buying-guide" className="pillar-link">
                    <span>📘</span> Lagoon 42 guide
                  </Link>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">Related guides</p>
                  <Link href="/guides/isla-40-buying-guide" className="pillar-link">
                    <span>🧠</span> Isla 40 buying guide
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
              </div>
            </aside>

            <article className="article-body min-w-0">
              <section id="overview" className="scroll-mt-28">
                <p className="section-label">Overview</p>
                <h2 className="section-heading">Lagoon 40: the market’s most shoppable 40ft catamaran.</h2>
                <p>
                  The <strong>Lagoon 40</strong> sits in a size band where demand is huge: first-time cat buyers, family cruisers,
                  charter crossover buyers, and owners who want manageable complexity without feeling “small”.
                  The upside is inventory depth. The risk is spec variance — and charter fatigue.
                </p>
                <p>
                  Browse inventory while reading:{" "}
                  <Link
                    href="/buy/brand/lagoon/model/lagoon-40"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Lagoon 40 listings on Findaly
                  </Link>{" "}
                  (then jump back here to validate what you’re seeing).
                </p>
                <div className="pull-quote">
                  “The Lagoon 40 isn’t a unicorn hunt. It’s a filtering exercise: history, spec, and systems truth.”
                </div>
              </section>

              <section id="why" className="mt-20 scroll-mt-28">
                <p className="section-label">Why Lagoon 40</p>
                <h2 className="section-heading">Why the Lagoon 40 wins — and why some buyers get burned.</h2>
                <p>
                  The Lagoon 40 wins because the market is deep: more choice, more pricing signals, more service familiarity.
                  The downside is that “Lagoon 40” tells you almost nothing unless you understand the boat’s use-pattern and autonomy spec.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Strengths vs watch-outs</div>
                    <div className="text-[12px] text-[#0a211f]/45">Where buyers should focus</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">Strengths</div>
                      <ul className="mt-3">
                        <li>Massive used inventory = real negotiation opportunities</li>
                        <li>Global service familiarity and parts accessibility</li>
                        <li>Strong family/charter-friendly layouts</li>
                        <li>Resale path is clear for clean examples</li>
                        <li>Spec options allow autonomy upgrades (if done correctly)</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Watch-outs</div>
                      <ul className="mt-3">
                        <li>Charter cosmetics can hide tired systems</li>
                        <li>DIY electrics and undocumented lithium installs</li>
                        <li>Saildrive maintenance history is a hard requirement</li>
                        <li>Leaks and plumbing fatigue in guest-heavy setups</li>
                        <li>Payload creep impacts sailing feel and component wear</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="versions" className="mt-20 scroll-mt-28">
                <p className="section-label">Versions & layouts</p>
                <h2 className="section-heading">Choose by how you live onboard (and how much plumbing you want).</h2>
                <p>
                  Lagoon 40s come in different layouts, and the layout choice impacts maintenance rhythm and resale demand.
                  Owner’s versions tend to attract owner buyers; 4-cabin versions broaden the market but increase wear risk.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Common configurations</div>
                    <div className="text-[12px] text-[#0a211f]/45">Best-fit + watch-outs</div>
                  </div>

                  <div>
                    {versions.map((v) => (
                      <div key={v.title} className="row">
                        <div className="row-title">{v.title}</div>
                        <div className="row-meta">
                          <strong className="text-[#0a211f]">Best for:</strong> {v.bestFor}
                        </div>
                        <p className="row-note">
                          <strong>Watch-out:</strong> {v.watchOut}
                        </p>
                        <p className="row-note mb-0!">
                          <strong>Value drivers:</strong> {v.valueDrivers.join(" • ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-8">
                  If you want the “bigger sibling” in this family, read:{" "}
                  <Link
                    href="/guides/lagoon-42-buying-guide"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Lagoon 42 buying guide
                  </Link>
                  .
                </p>
              </section>

              <section id="pricing" className="mt-20 scroll-mt-28">
                <p className="section-label">Real price ranges</p>
                <h2 className="section-heading">Pricing is a proxy for systems truth.</h2>
                <p>
                  On Lagoon 40s, pricing moves most with: (1) charter history vs owner-use, (2) autonomy spec and the quality of installs,
                  and (3) real documentation that proves service discipline.
                </p>

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
                  If you’re financing, avoid “budget blow-ups”: treat rigging/sails/saildrives/electrics as real consumables in your model.
                  Basics here:{" "}
                  <Link href="/finance" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    yacht finance on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="comparison" className="mt-20 scroll-mt-28">
                <p className="section-label">Lagoon 40 vs alternatives</p>
                <h2 className="section-heading">Comparison: pick by complexity tolerance and resale path.</h2>
                <p>
                  If you want an easy shopping experience and strong resale options, the Lagoon 40’s market depth is hard to beat.
                  If you want a more “modern 40” alternative, compare with Isla 40.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">At-a-glance comparison</div>
                    <div className="text-[12px] text-[#0a211f]/45">Choose by ownership feel</div>
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
                <h2 className="section-heading">Owning a Lagoon 40 is mostly about systems discipline.</h2>
                <p>
                  A good Lagoon 40 feels calm. A neglected one becomes a never-ending “small fixes” story.
                  The difference is almost always maintenance rhythm and documentation.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Where your time and money goes</div>
                    <div className="text-[12px] text-[#0a211f]/45">The reality buyers miss</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">High-impact items</div>
                      <ul className="mt-3">
                        <li>Engines + saildrive service discipline</li>
                        <li>Rigging and sail replacement planning</li>
                        <li>Electrical health (batteries/chargers/inverter)</li>
                        <li>Water systems (watermaker, pumps, filters)</li>
                        <li>Leaks/plumbing and seacock discipline</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Owner mindset</div>
                      <ul className="mt-3">
                        <li>Buy records first — then buy the boat</li>
                        <li>Load-test systems; don’t accept demos</li>
                        <li>Keep payload honest to protect performance and wear</li>
                        <li>Keep logs and invoices for resale day</li>
                        <li>Budget upgrades early (nav, batteries, safety)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="mt-8">
                  Broker support reduces risk when buying abroad:{" "}
                  <Link href="/brokers" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    find a broker on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="inspection" className="mt-20 scroll-mt-28">
                <p className="section-label">Inspection checklist</p>
                <h2 className="section-heading">Inspection checklist for a used Lagoon 40.</h2>
                <p>Use this list to structure your survey and your own walk-through.</p>

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
                  Negotiation method: list every defect, price it, then either negotiate or walk early. Both outcomes protect you.
                </p>
              </section>

              <section id="sea-trial" className="mt-20 scroll-mt-28">
                <p className="section-label">Sea trial focus</p>
                <h2 className="section-heading">Sea trial checklist: prove stability and systems under load.</h2>
                <p>This is where hidden risk shows up fastest.</p>

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
              </section>

              <section id="paperwork" className="mt-20 scroll-mt-28">
                <p className="section-label">Paperwork & VAT</p>
                <h2 className="section-heading">Paperwork is the deal.</h2>
                <p>
                  Confirm VAT/tax status, registration, ownership chain, and any liens. Your survey protects the boat; paperwork protects the transaction.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/buy/brand/lagoon/model/lagoon-40"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]"
                  >
                    Browse Lagoon 40 listings →
                  </Link>
                  <Link
                    href="/buy/brand/lagoon"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-[#0a211f]/15 px-7 text-[14.5px] font-medium text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors"
                  >
                    Back to Lagoon hub →
                  </Link>
                </div>
              </section>

              <section id="charter" className="mt-20 scroll-mt-28">
                <p className="section-label">Charter boats</p>
                <h2 className="section-heading">Charter Lagoon 40s can be good buys — but demand technical proof.</h2>
                <p>
                  Charter history isn’t inherently bad. The question is whether maintenance was real, documented, and proactive — and whether the boat passes load tests today.
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
                        <li>Invoice-backed service logs (rig, engines, saildrives)</li>
                        <li>Systems replaced on schedule</li>
                        <li>Transparent defect list + survey openness</li>
                        <li>Inventory list matches reality</li>
                        <li>Load tests welcomed</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">Red flags</div>
                      <ul className="mt-3">
                        <li>Fresh cosmetics with weak technical history</li>
                        <li>Messy wiring / undocumented upgrades</li>
                        <li>Persistent odours, damp, recurring leaks</li>
                        <li>Seller resistance to load testing</li>
                        <li>Paperwork ambiguity (VAT, ownership chain)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="resale" className="mt-20 scroll-mt-28">
                <p className="section-label">Resale & liquidity</p>
                <h2 className="section-heading">Resale is strongest when you buy the cleanest story.</h2>
                <p>
                  Lagoon 40 liquidity is helped by a large buyer market — but your resale result depends on how clean your boat’s story is:
                  documented servicing, tidy electrics, proven systems, and honest presentation.
                </p>

                <div className="pull-quote">“Lagoon 40 resale is a story sale: history, records, and predictable systems.”</div>
              </section>

              <section id="faq" className="mt-20 scroll-mt-28">
                <p className="section-label">FAQ</p>
                <h2 className="section-heading">Quick answers buyers search for.</h2>

                <div className="mt-2 border-t border-[#0a211f]/8">
                  {faqs.map((faq, i) => (
                    <div key={i} className="faq-item">
                      <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                        <span>{faq.q}</span>
                        <span className="text-[#0a211f]/30 text-xl shrink-0">{openFaq === i ? "−" : "+"}</span>
                      </button>
                      {openFaq === i && <p className="faq-answer">{faq.a}</p>}
                    </div>
                  ))}
                </div>

                <div className="mt-14 rounded-2xl bg-[#0a211f] p-10 md:p-14 text-center">
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#fff86c]/70 mb-4">Ready to browse?</p>
                  <h3 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.1] text-white tracking-tight">
                    Find your next <span className="text-[#fff86c]">Lagoon 40</span> with confidence.
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                    Explore real listings, compare spec, and keep the buying process disciplined — from shortlist to survey day.
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                    <Link href="/buy/brand/lagoon/model/lagoon-40" className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]">
                      Browse Lagoon 40 listings
                    </Link>
                    <Link href="/buy/brand/lagoon" className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors">
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
                    <span className="text-[#0a211f]/60">Guides</span>
                    <span>/</span>
                    <span className="text-[#0a211f]/60">Lagoon 40 buying guide</span>
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