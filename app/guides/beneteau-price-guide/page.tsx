// app/guides/beneteau-price-guide/page.tsx
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
  { id: "what-drives-price", label: "What drives price" },
  { id: "price-bands", label: "Typical price bands" },
  { id: "by-model", label: "Price by model (context)" },
  { id: "running-costs", label: "Running costs & budget" },
  { id: "negotiation", label: "Negotiation & red flags" },
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

const stats = [
  { value: "Wider", label: "Beneteau prices vary more by condition than by brochure spec" },
  { value: "Inventory", label: "Sails, rig, electronics can swing value by €20k–€80k+" },
  { value: "Region", label: "Location affects VAT/tax, demand cycles, and logistics costs" },
  { value: "Liquidity", label: "Popular models resell faster when history is clean" },
]

const quickTopics = [
  "Beneteau prices",
  "Used Beneteau",
  "Oceanis",
  "Swift Trawler",
  "Gran Turismo",
  "Survey",
  "Running costs",
  "Negotiation",
]

const priceBands = [
  {
    label: "Sailing — older generations (approx. 1995–2010)",
    range: "Often ~€60k–€180k",
    drivers: "Rig age, sails, electronics, osmosis risk, engine servicing, ownership history.",
  },
  {
    label: "Sailing — mid generations (approx. 2010–2020)",
    range: "Often ~€160k–€450k+",
    drivers: "Layout, spec packs, charter wear, inventory refresh (sails/plotter/batteries).",
  },
  {
    label: "Sailing — late-model / recent production",
    range: "Often ~€350k–€900k+",
    drivers: "Delivery region, packages, condition, and demand in your cruising area.",
  },
  {
    label: "Motor — Gran Turismo / sports cruisers",
    range: "Often ~€250k–€1.2m+",
    drivers: "Hours, drivetrain type, generator/AC health, storage history, corrosion.",
  },
  {
    label: "Motor — Swift Trawler range",
    range: "Often ~€400k–€1.6m+",
    drivers: "Stabilisation, nav suite, service records, cruising equipment, resale demand.",
  },
]

const modelContext = [
  {
    name: "Beneteau Oceanis 38.1",
    href: "/buy/brand/beneteau/model/oceanis-38-1",
    why: "Often a first-owner sweet spot; price driven by sails/electronics + charter history.",
    whatMovesIt: "New sails, new plotter/AIS, fresh standing rigging, clean engine logs.",
  },
  {
    name: "Beneteau Oceanis 45",
    href: "/buy/brand/beneteau/model/oceanis-45",
    why: "Broad demand; price varies wildly based on inventory and maintenance discipline.",
    whatMovesIt: "Rig age, sail inventory, keel/hull history, autopilot suite, generator (if fitted).",
  },
  {
    name: "Beneteau First 40",
    href: "/buy/brand/beneteau/model/first-40",
    why: "Performance platforms must be judged by how they’ve been used (raced vs cruised).",
    whatMovesIt: "Rig fatigue, deck hardware, sail wardrobe, structural checks, maintenance quality.",
  },
  {
    name: "Beneteau Swift Trawler 44",
    href: "/buy/brand/beneteau/model/swift-trawler-44",
    why: "High demand; engines + systems define value more than cosmetics.",
    whatMovesIt: "Full service history, generator/AC under load, stabilisation servicing, corrosion control.",
  },
  {
    name: "Beneteau Gran Turismo 46",
    href: "/buy/brand/beneteau/model/gran-turismo-46",
    why: "Lifestyle cruiser; condition of complex systems drives the ownership experience.",
    whatMovesIt: "Drive system health, cooling systems, electrics, evidence of careful seasonal maintenance.",
  },
]

const runningCostRows = [
  {
    label: "Survey + sea trial + haul-out",
    note: "Your downside protection. Budget varies by size/region, but don’t skip it.",
  },
  {
    label: "Inventory catch-up (sailboats)",
    note: "Standing rigging, sails, batteries, electronics. Can be the largest hidden cost.",
  },
  {
    label: "Systems catch-up (motor yachts)",
    note: "Generator, AC, drives/shafts, fuel systems, stabilisation (if fitted).",
  },
  {
    label: "Berth + insurance",
    note: "Often more expensive than people expect. Region and season matter a lot.",
  },
  {
    label: "Maintenance buffer",
    note: "Assume surprises. The best owners budget for them and keep logs clean.",
  },
]

const faqs = [
  {
    q: "What’s a realistic budget for a used Beneteau?",
    a: "Start with purchase price, then add a buffer for survey outcomes and catch-up. For sailboats, rig, sails, and electronics can be a major swing factor. For motor yachts, engines and systems (generator/AC/drivetrain) matter most. The cleanest boats with history usually cost more upfront — and less over time.",
  },
  {
    q: "Why do two identical Beneteau models have totally different prices?",
    a: "Condition and inventory. The “same” boat might differ by rig age, sail inventory, electronics suite, service discipline, and ownership history. A cheaper listing can quickly become more expensive after upgrades and repairs.",
  },
  {
    q: "Do Beneteau yachts hold value?",
    a: "Popular models often have strong liquidity because demand is consistent. Depreciation is usually steepest early, then stabilises. Boats with clean history, sensible upgrades, and tidy survey outcomes resell faster.",
  },
  {
    q: "How should I negotiate price on a Beneteau?",
    a: "Base it on evidence: survey findings, inventory age, service logs, and comparable listings. Avoid “feels” negotiation. If rigging or key systems are nearing replacement, negotiate with real quotes and timelines.",
  },
  {
    q: "Is it better to buy in Europe or elsewhere?",
    a: "It depends on where you’ll keep the boat and how taxes/logistics work for your situation. Location affects demand, VAT/tax status, and transport costs. Always treat paperwork as part of the buying process.",
  },
]

export default function BeneteauPriceGuidePage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }),
    []
  )

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
        .faq-item { border-bottom: 1px solid rgba(10,33,31,0.08); }
        .faq-question { width: 100%; text-align: left; padding: 20px 0; font-size: 16px; font-weight: 500; color: #0a211f; display: flex; justify-content: space-between; align-items: center; background: none; border: none; cursor: pointer; gap: 16px; }
        .faq-answer { font-size: 15px; line-height: 1.7; color: rgba(10,33,31,0.6); padding-bottom: 20px; }
      `}</style>

      <div className="pillar-page min-h-screen pb-0">
        {/* HERO */}
        <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
          <Image
            src="/hero-buy.jpg"
            alt="Beneteau price guide — Findaly"
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
              Price Guide
            </motion.p>
            <motion.h1
              className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl"
              variants={fadeUp}
            >
              Beneteau prices:{" "}
              <span className="text-[#fff86c]">what drives value</span> in 2026.
            </motion.h1>
            <motion.p
              className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed"
              variants={fadeUp}
            >
              A practical, global pricing guide — from realistic bands to the hidden
              costs that decide whether a boat is “cheap” or just “unfinished.”
            </motion.p>

            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href="/buy/brand/beneteau"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Browse Beneteau Listings
              </Link>
              <Link
                href="/guides/buying-a-beneteau"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                Read the full Beneteau buyer guide
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
                <div className="text-[22px] font-bold tracking-tight text-[#0a211f]">
                  {s.value}
                </div>
                <div className="mt-2 text-[13px] leading-snug text-[#0a211f]/50">
                  {s.label}
                </div>
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
                    <p className="text-[15px] font-semibold text-white">
                      Want real market comps?
                    </p>
                    <p className="mt-1.5 text-[13px] text-white/50 leading-relaxed">
                      Jump into live Beneteau listings and filter by year, country,
                      length, or budget.
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
                    Beneteau authority cluster
                  </p>
                  <Link href="/guides/buying-a-beneteau" className="pillar-link">
                    <span>📘</span> Buying a Beneteau (pillar)
                  </Link>
                  <Link href="/guides/used-beneteau-checklist" className="pillar-link">
                    <span>✅</span> Used Beneteau checklist
                  </Link>
                  <Link href="/guides/beneteau-oceanis-vs-first" className="pillar-link">
                    <span>⛵</span> Oceanis vs First
                  </Link>
                  <Link href="/guides/beneteau-swift-trawler-buying-guide" className="pillar-link">
                    <span>🚤</span> Swift Trawler buying guide
                  </Link>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                    Explore Findaly
                  </p>
                  <Link href="/buy" className="pillar-link">
                    <span>🛥️</span> Buy a Yacht
                  </Link>
                  <Link href="/finance" className="pillar-link">
                    <span>💰</span> Yacht Finance
                  </Link>
                  <Link href="/brokers" className="pillar-link">
                    <span>🧭</span> Yacht Brokers
                  </Link>
                  <Link href="/destinations" className="pillar-link">
                    <span>🗺️</span> Destinations
                  </Link>
                </div>
              </div>
            </aside>

            <article className="article-body min-w-0">
              <section id="overview" className="scroll-mt-28">
                <p className="section-label">Overview</p>
                <h2 className="section-heading">Pricing is a condition story, not a brand story.</h2>
                <p>
                  Buyers search “Beneteau price” like there’s one number. In reality, Beneteau values are shaped by{" "}
                  <strong>condition, inventory, location, and history</strong> far more than by model name alone.
                  Two identical Oceanis listings can be tens of thousands apart — and both can be “correct.”
                </p>
                <p>
                  Use this guide for sanity checks, not as a final valuation. The real truth is always inside:
                  survey outcomes, service records, and what’s been replaced recently (rigging, sails, batteries,
                  electronics, engines, generator, AC).
                </p>
                <div className="pull-quote">
                  “A cheaper Beneteau is often just a boat where you’ll pay the missing maintenance later.”
                </div>
                <p>
                  For live pricing context, browse:
                  {" "}
                  <Link
                    href="/buy/brand/beneteau"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Beneteau yachts for sale on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="what-drives-price" className="mt-20 scroll-mt-28">
                <p className="section-label">What drives price</p>
                <h2 className="section-heading">The 6 levers that actually move value.</h2>
                <ul>
                  <li><strong>Condition:</strong> hull, rig, engines, systems, corrosion control, bilge discipline.</li>
                  <li><strong>Inventory age:</strong> sails/rig/electronics (sailboats), generator/AC/drives (motor).</li>
                  <li><strong>History:</strong> owners, usage (charter vs private), logs, invoices, survey trail.</li>
                  <li><strong>Location:</strong> demand, seasonality, VAT/tax status, cruising reputation, logistics.</li>
                  <li><strong>Spec:</strong> nav suite, batteries/solar, stabilisation, watermaker, heating/AC.</li>
                  <li><strong>Paperwork:</strong> title/ownership chain, liens, VAT proof, compliance where relevant.</li>
                </ul>
                <p>
                  When you evaluate price, treat “extras” as <strong>future cost savings</strong>.
                  A boat with fresh rigging and a modern nav stack can be the better deal — even at a higher ask.
                </p>
              </section>

              <section id="price-bands" className="mt-20 scroll-mt-28">
                <p className="section-label">Typical price bands</p>
                <h2 className="section-heading">Global pricing bands that won’t lie to you.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Typical price bands</div>
                    <div className="text-[12px] text-[#0a211f]/45">Ranges vary by region/spec</div>
                  </div>
                  <div>
                    {priceBands.map((b) => (
                      <div key={b.label} className="row">
                        <div className="row-title">{b.label}</div>
                        <div className="row-meta">
                          <strong className="text-[#0a211f]">{b.range}</strong>
                          <span className="text-[#0a211f]/45"> • </span>
                          <span>{b.drivers}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-8">
                  Don’t treat these as “what you should pay.” Treat them as: “if I see a listing wildly outside this,
                  what am I missing?” Sometimes the answer is great (exceptional history). Sometimes it’s bad (deferred maintenance).
                </p>
              </section>

              <section id="by-model" className="mt-20 scroll-mt-28">
                <p className="section-label">Price by model</p>
                <h2 className="section-heading">Model context: what buyers forget to price in.</h2>
                <p>
                  Below are common Beneteau models where “cheap vs expensive” is usually explained by
                  inventory and systems — not by the hull itself.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Model pricing context</div>
                    <div className="text-[12px] text-[#0a211f]/45">What moves value</div>
                  </div>
                  <div>
                    {modelContext.map((m) => (
                      <div key={m.name} className="row">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <div className="row-title">
                              <Link
                                href={m.href}
                                className="text-[#0a211f] no-underline hover:underline decoration-[#fff86c] underline-offset-4"
                              >
                                {m.name}
                              </Link>
                            </div>
                            <div className="row-meta">{m.why}</div>
                            <p className="row-note mb-0!">
                              <strong>Value drivers:</strong> {m.whatMovesIt}
                            </p>
                          </div>
                          <Link
                            href={m.href}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0a211f] px-4 text-[13px] font-semibold text-[#fff86c]"
                          >
                            View listings →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-8">
                  If you want the broader buying logic (not just price), read the pillar:
                  {" "}
                  <Link
                    href="/guides/buying-a-beneteau"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Buying a Beneteau (full guide)
                  </Link>
                  .
                </p>
              </section>

              <section id="running-costs" className="mt-20 scroll-mt-28">
                <p className="section-label">Running costs</p>
                <h2 className="section-heading">Budget like an owner, not like a shopper.</h2>
                <p>
                  The fastest way to make a “good deal” bad is to ignore ownership costs. Your purchase price is the entry fee.
                  Ownership is decided by maintenance discipline and systems health.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Budget checklist</div>
                    <div className="text-[12px] text-[#0a211f]/45">Treat these as non-optional</div>
                  </div>
                  <div>
                    {runningCostRows.map((r) => (
                      <div key={r.label} className="row">
                        <div className="row-title">{r.label}</div>
                        <p className="row-note mb-0!">{r.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-8">
                  Want help thinking about payment structure? Explore:
                  {" "}
                  <Link
                    href="/finance"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    yacht finance on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="negotiation" className="mt-20 scroll-mt-28">
                <p className="section-label">Negotiation</p>
                <h2 className="section-heading">Negotiate with evidence, not vibes.</h2>
                <p>
                  Great negotiation is simple: tie your offer to facts. Survey findings, age of key inventory, service records,
                  and comparable listings. If the boat needs standing rigging within 12 months, that’s not an opinion — it’s a cost.
                </p>
                <ul>
                  <li><strong>Red flag:</strong> unclear ownership chain or missing paperwork.</li>
                  <li><strong>Red flag:</strong> “low hours” with thin service history.</li>
                  <li><strong>Red flag:</strong> cosmetic refit while systems are ignored.</li>
                  <li><strong>Green flag:</strong> boring, organised logs + invoices + surveys.</li>
                </ul>
                <p>
                  If you’re buying globally, a broker can protect the transaction structure. You can browse:
                  {" "}
                  <Link
                    href="/brokers"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    yacht brokers on Findaly
                  </Link>
                  .
                </p>
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
                        <span className="text-[#0a211f]/30 text-xl shrink-0">
                          {openFaq === i ? "−" : "+"}
                        </span>
                      </button>
                      {openFaq === i && <p className="faq-answer">{faq.a}</p>}
                    </div>
                  ))}
                </div>
              </section>

              <div className="mt-20 mb-8 rounded-2xl bg-[#0a211f] p-10 md:p-14 text-center">
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#fff86c]/70 mb-4">
                  Next step
                </p>
                <h3 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.1] text-white tracking-tight">
                  Compare real listings —{" "}
                  <span className="text-[#fff86c]">then price confidently.</span>
                </h3>
                <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                  Use this guide to frame value, then validate with listings, survey discipline,
                  and clean paperwork.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/buy/brand/beneteau"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                  >
                    Browse Beneteau Listings
                  </Link>
                  <Link
                    href="/guides/buying-a-beneteau"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                  >
                    Read the pillar guide
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl px-6 pb-20">
          <div className="border-t border-[#0a211f]/8 pt-6">
            <nav className="flex items-center gap-2 text-[13px] text-[#0a211f]/35">
              <Link href="/" className="hover:text-[#0a211f]/60 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#0a211f]/60">Guides</span>
              <span>/</span>
              <span className="text-[#0a211f]/60">Beneteau Price Guide</span>
            </nav>
          </div>
        </div>

        {/* FAQ SCHEMA SCRIPT */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </div>
    </>
  )
}
