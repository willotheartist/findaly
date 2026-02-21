//·app/guides/motor-yacht-buying-guide/page.tsx
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
  { id: "types", label: "Types of motor yachts" },
  { id: "hulls", label: "Hull types & ride" },
  { id: "budget", label: "Budget bands" },
  { id: "costs", label: "Ownership costs" },
  { id: "shortlist", label: "Shortlisting models" },
  { id: "inspection", label: "Inspection checklist" },
  { id: "sea-trial", label: "Sea trial focus" },
  { id: "paperwork", label: "Paperwork & closing" },
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
  { value: "Comfort", label: "Planing vs displacement changes the ride" },
  { value: "Systems", label: "Generator/AC/electrics decide ownership happiness" },
  { value: "Fuel", label: "Speed is expensive — efficiency is freedom" },
  { value: "Resale", label: "Liquidity follows proven platforms + records" },
]

const quickTopics = [
  "Motor yacht buying guide",
  "Planing vs displacement hull",
  "Best motor yacht for beginners",
  "Motor yacht costs per year",
  "How to sea trial a motor yacht",
  "Used motor yacht checklist",
  "Motor yacht vs trawler",
  "Motor yacht resale value",
]

type TypeCard = {
  title: string
  subtitle: string
  bestFor: string
  watchOut: string
  links?: { label: string; href: string }[]
}

const motorTypes: TypeCard[] = [
  {
    title: "Planing motor yachts",
    subtitle: "Designed to rise and skim at speed",
    bestFor: "Quick coastal hops, day-to-weekend use, higher speed",
    watchOut: "Fuel burn, ride quality in chop, more stress on systems at speed",
  },
  {
    title: "Semi-displacement yachts",
    subtitle: "Balanced speed + efficiency + comfort",
    bestFor: "Owners who cruise often and want a calm, capable platform",
    watchOut: "Not the fastest; buyer must choose by use-case not ego",
  },
  {
    title: "Displacement yachts / trawler-style",
    subtitle: "Range-first cruising and steady passages",
    bestFor: "Efficiency, comfort underway, longer seasons onboard",
    watchOut: "Systems complexity, stabiliser maintenance, weight and corrosion discipline",
    links: [{ label: "Swift Trawler guide", href: "/guides/beneteau-swift-trawler-buying-guide" }],
  },
  {
    title: "Sports cruisers",
    subtitle: "Performance-led, often smaller cabins and outdoor living",
    bestFor: "Fun weekends, fast runs, Mediterranean style",
    watchOut: "Tighter living space, higher fuel burn, weather exposure",
  },
  {
    title: "Flybridge cruisers",
    subtitle: "Upper helm + outdoor entertaining",
    bestFor: "Social cruising, better visibility, more “yacht” feel",
    watchOut: "Windage, docking skill needed, more systems and surfaces to maintain",
  },
]

type HullRow = {
  hull: string
  speedProfile: string
  comfort: string
  typicalBuyerFit: string
  tradeoff: string
}

const hullTable: HullRow[] = [
  {
    hull: "Planing",
    speedProfile: "Fast (high cruise speeds possible)",
    comfort: "Depends heavily on sea state + stabilisation",
    typicalBuyerFit: "Day/weekend owners who want speed and short hops",
    tradeoff: "Fuel burn rises quickly; higher wear on engines and systems",
  },
  {
    hull: "Semi-displacement",
    speedProfile: "Moderate cruise speeds with better efficiency",
    comfort: "Generally calmer, more predictable ride",
    typicalBuyerFit: "Owners who actually cruise and want comfort + capability",
    tradeoff: "Not as fast as planing yachts; costs still scale with size",
  },
  {
    hull: "Displacement",
    speedProfile: "Lower speeds but efficient range",
    comfort: "Steady, calm passages; excellent for longer cruising",
    typicalBuyerFit: "Range-first buyers, extended seasons, liveaboard-style cruising",
    tradeoff: "Lower top speed; maintenance discipline matters more than aesthetics",
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
    whatYouActuallyGet: "Older boats: great value if maintained; risky if neglected",
    biggestRisk: "Deferred maintenance: engines, electrics, leaks, corrosion, tired systems",
    bestMove: "Buy records + survey. Walk away early if the story is messy.",
  },
  {
    band: "€150k–€500k",
    whatYouActuallyGet: "Broader options: newer hulls, better layouts, stronger inventory",
    biggestRisk: "Expensive items coming due: batteries, nav upgrades, generator, HVAC",
    bestMove: "Prioritise clean systems + ownership history over cosmetics.",
  },
  {
    band: "€500k–€1.5m",
    whatYouActuallyGet: "Modern platforms, comfort, and more predictable ownership",
    biggestRisk: "Systems stacks grow: generator/AC/stabilisers become non-negotiable",
    bestMove: "Choose proven platforms and keep resale in mind from day one.",
  },
  {
    band: "€1.5m+",
    whatYouActuallyGet: "Premium experience if operated professionally",
    biggestRisk: "Operating cost shock: crew, refit cycles, compliance",
    bestMove: "Use reputable brokers, plan maintenance like an asset, not a toy.",
  },
]

const costReality = [
  "Berth/mooring fees scale with length and (often) beam — some marinas price by meter",
  "Insurance varies by region, use (private/charter), experience, and claims history",
  "Routine servicing: engines + drives, filters, impellers, fluids, anodes",
  "Generator and air-conditioning under load are the classic “surprise bills”",
  "Batteries, charging, inverters, and shore power are silent reliability drivers",
  "Stabilisers/thrusters are wonderful… and expensive if neglected",
  "Maintenance discipline has a direct resale impact (logs and receipts matter)",
]

const shortlistLogic = [
  "Choose hull type first (planing vs semi-displacement vs displacement)",
  "Pick a size you can berth and maintain without stress",
  "Shortlist proven platforms with broad demand (liquidity matters)",
  "Buy records first: service history, invoices, upgrades, ownership chain",
  "Inspect systems before cosmetics (engines/generator/AC/electrics/corrosion)",
]

const inspectionChecklist = [
  "Engine survey + diagnostics: cooling system, service intervals, abnormal temps/pressures",
  "Generator + air-conditioning under load (not just “it turns on”)",
  "Drivetrain condition: alignment, vibration notes, seals, props, thrusters",
  "Fuel system: filters, evidence of water contamination, tank condition",
  "Corrosion checks: engine room, bonding, through-hulls, seacocks, clamps",
  "Electrical: batteries, chargers, inverters, shore power, wiring quality",
  "Bilge management: pumps, alarms, float switches, ingress clues",
  "Hull/deck moisture checks, window seals, hardware bedding, gelcoat cracks",
  "Navigation electronics age, radar/plotter status, autopilot behavior",
  "Documentation: ownership chain, VAT/tax status, registration, liens where relevant",
]

const seaTrialFocus = [
  "Cold start behavior + smoke, idle stability, engine temps/pressure trends",
  "Acceleration to cruise RPM: hesitation, vibration, unusual noises",
  "Steering feel + tracking, thrusters, docking responsiveness",
  "WOT (if appropriate) to confirm rated RPM without overheating",
  "Generator + AC running during trial: verify electrical stability under load",
  "Post-trial engine room check: leaks, smells, heat, belt dust, coolant residue",
]

const faqs = [
  {
    q: "What’s the best motor yacht type for beginners?",
    a: "Most first-time buyers succeed with manageable size and simple ownership. Focus on a platform you can berth easily, maintain proactively, and use frequently. In many markets, the 30–45ft range offers a strong balance of comfort and complexity.",
  },
  {
    q: "Planing vs displacement: what’s the real difference?",
    a: "Planing yachts rise and skim at speed—great for quick hops but with higher fuel burn and a ride that’s sea-state dependent. Displacement yachts prioritise efficiency and steady passages at lower speeds. Semi-displacement sits between: balanced speed, comfort and efficiency.",
  },
  {
    q: "How much does a motor yacht cost per year to own?",
    a: "It depends on size, location, and how you use the boat, but the big buckets are berth/mooring, insurance, routine servicing, and systems maintenance (generator, AC, electrics). As size increases, complexity and costs rise non-linearly.",
  },
  {
    q: "What matters most when buying used?",
    a: "Systems integrity and history. Engines, generator, AC, electrics, corrosion discipline, and service logs matter more than cosmetics. A professional survey and sea trial under load protect you from expensive surprises.",
  },
  {
    q: "Do motor yachts hold value?",
    a: "They can—especially proven platforms with broad demand and clean history. Resale is strongest when a boat has consistent servicing, transparent records, and systems that work under load.",
  },
]

export default function MotorYachtBuyingGuidePage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const schemas = useMemo(() => {
    const base = "https://www.findaly.co"
    const url = `${base}/guides/motor-yacht-buying-guide`

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
      headline: "Motor yacht buying guide (2026): types, costs, inspection checklist, and resale",
      description:
        "A practical motor yacht buying guide: planing vs displacement hulls, budget bands, ownership costs, shortlisting logic, inspection checklist, sea trial focus, and resale considerations.",
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
        { "@type": "ListItem", position: 3, name: "Motor yacht buying guide", item: url },
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
          <Image src="/hero-buy.jpg" alt="Motor yacht buying guide — Findaly" fill className="object-cover" priority />
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
              Buying Guide • Motor Yachts • Research
            </motion.p>

            <motion.h1
              className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl"
              variants={fadeUp}
            >
              Motor yacht buying guide:{" "}
              <span className="text-[#fff86c]">types, costs</span> & what to inspect (2026).
            </motion.h1>

            <motion.p
              className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed"
              variants={fadeUp}
            >
              A practical guide for serious buyers — planing vs displacement hulls, budget reality,
              ownership costs, inspection priorities, sea-trial focus, and resale considerations.
            </motion.p>

            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href="/buy"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Browse motor yachts
              </Link>
              <Link
                href="/finance"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                Yacht finance basics
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
                      Use filters by brand, model, country, and year — and compare real listings while you read.
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
                  <Link href="/finance" className="pillar-link">
                    <span>💰</span> Yacht finance
                  </Link>
                  <Link href="/brokers" className="pillar-link">
                    <span>🤝</span> Find a broker
                  </Link>
                  <Link href="/guides/yacht-types-explained" className="pillar-link">
                    <span>🧠</span> Types of yachts explained
                  </Link>
                </div>

                <div className="rounded-2xl border border-[#0a211f]/10 bg-[#0a211f]/2 p-5">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                    Popular research paths
                  </p>
                  <div className="space-y-2">
                    <Link href="/guides/beneteau-swift-trawler-buying-guide" className="pillar-link">
                      <span>🧭</span> Trawler-style ownership
                    </Link>
                    <Link href="/guides/catamaran-buying-guide" className="pillar-link">
                      <span>🌊</span> Catamaran buying guide
                    </Link>
                    <Link href="/charter" className="pillar-link">
                      <span>🏝️</span> Charter first
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            <article className="article-body min-w-0">
              <section id="overview" className="scroll-mt-28">
                <p className="section-label">Overview</p>
                <h2 className="section-heading">A motor yacht is a systems platform — not a floating living room.</h2>
                <p>
                  The biggest mistake buyers make is shopping motor yachts like property: layout, finishes, and vibes first.
                  In reality, motor yacht ownership is driven by the systems stack — engines, generator, air-conditioning,
                  electrics, drives, pumps, stabilisation, and corrosion management.
                </p>
                <p>
                  This guide helps you choose the right category, understand planing vs displacement tradeoffs,
                  and buy used inventory with confidence. Start browsing here:
                  {" "}
                  <Link
                    href="/buy"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    yachts for sale on Findaly
                  </Link>.
                </p>
                <div className="pull-quote">
                  “The fastest way to ruin motor yachting is buying more complexity than you can maintain.”
                </div>
              </section>

              <section id="types" className="mt-20 scroll-mt-28">
                <p className="section-label">Types of motor yachts</p>
                <h2 className="section-heading">The motor yacht categories buyers compare most.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Categories (best-fit + watch-outs)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Choose by use-case</div>
                  </div>

                  <div>
                    {motorTypes.map((t) => (
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

                <p className="mt-8">
                  If you’re still deciding at a higher level, this is the anchor page:{" "}
                  <Link
                    href="/guides/yacht-types-explained"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    types of yachts explained
                  </Link>.
                </p>
              </section>

              <section id="hulls" className="mt-20 scroll-mt-28">
                <p className="section-label">Hull types & ride</p>
                <h2 className="section-heading">Planing vs semi-displacement vs displacement: the comfort trade.</h2>
                <p>
                  Hull type changes the ride, cost, and ownership rhythm. It’s also one of the best predictors of satisfaction,
                  because it determines how often you’ll use the boat in real conditions.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Hull styles (practical)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Directional, not absolute</div>
                  </div>

                  <div className="row p-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="th">Hull</th>
                          <th className="th">Speed profile</th>
                          <th className="th">Comfort</th>
                          <th className="th">Typical buyer fit</th>
                          <th className="th">Tradeoff</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hullTable.map((r) => (
                          <tr key={r.hull}>
                            <td className="td"><strong>{r.hull}</strong></td>
                            <td className="td">{r.speedProfile}</td>
                            <td className="td">{r.comfort}</td>
                            <td className="td">{r.typicalBuyerFit}</td>
                            <td className="td">{r.tradeoff}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re leaning range-first, this guide is the trawler anchor:{" "}
                  <Link
                    href="/guides/beneteau-swift-trawler-buying-guide"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Swift Trawler buying guide
                  </Link>.
                </p>
              </section>

              <section id="budget" className="mt-20 scroll-mt-28">
                <p className="section-label">Budget bands</p>
                <h2 className="section-heading">Budget is a maintenance story, not a purchase story.</h2>

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
                  If you’re financing, keep it practical:{" "}
                  <Link
                    href="/finance"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    yacht finance on Findaly
                  </Link>.
                </p>
              </section>

              <section id="costs" className="mt-20 scroll-mt-28">
                <p className="section-label">Ownership costs</p>
                <h2 className="section-heading">Where the money actually goes (and what buyers miss).</h2>
                <p>
                  Motor yacht ownership cost is mostly predictable if you accept the reality: size scales costs, and systems
                  scale complexity. The painful surprises usually come from neglected generators, weak AC, tired batteries,
                  corrosion, and “it worked last season” maintenance.
                </p>

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
              </section>

              <section id="shortlist" className="mt-20 scroll-mt-28">
                <p className="section-label">Shortlisting models</p>
                <h2 className="section-heading">Shortlist by platform, not by photos.</h2>
                <p>
                  The best buying outcomes come from choosing a proven platform with broad demand, then selecting the cleanest example.
                  That’s how you reduce downside and protect resale.
                </p>

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
                  Use brokers to reduce risk when buying internationally:{" "}
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
                <h2 className="section-heading">Inspection checklist for a used motor yacht.</h2>

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
                <h2 className="section-heading">Sea trial checklist: test under load.</h2>

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

                <p className="mt-8">
                  If a seller resists a proper trial, treat it as information. The best boats welcome scrutiny.
                </p>
              </section>

              <section id="paperwork" className="mt-20 scroll-mt-28">
                <p className="section-label">Paperwork & closing</p>
                <h2 className="section-heading">Paperwork isn’t admin — it’s the transaction.</h2>
                <p>
                  Ownership chain, VAT/tax status, registration, liens, and closing structure matter as much as the boat.
                  Your survey protects the asset; your paperwork protects the deal.
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
                <h2 className="section-heading">Resale is strongest when you buy the right history.</h2>
                <p>
                  Motor yacht resale is driven by proven platforms and clean stories: consistent servicing, transparent logs,
                  and systems that work under load. A “cheaper” boat with missing history often becomes the expensive one.
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
                    Find a motor yacht with confidence.
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                    Compare real listings, shortlist proven platforms, and protect your downside with a proper survey and sea trial.
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                    <Link
                      href="/buy"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                    >
                      Browse yachts
                    </Link>
                    <Link
                      href="/finance"
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                    >
                      Yacht finance
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
                    <span className="text-[#0a211f]/60">Motor yacht buying guide</span>
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