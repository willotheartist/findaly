// app/guides/buying-a-beneteau/page.tsx
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
  { id: "about-beneteau", label: "About Beneteau" },
  { id: "prices", label: "Price guide" },
  { id: "models", label: "Popular models" },
  { id: "is-it-good", label: "Is Beneteau a good brand?" },
  { id: "new-vs-used", label: "New vs used" },
  { id: "where-popular", label: "Where they’re popular" },
  { id: "checklist", label: "What to check before buying" },
  { id: "financing", label: "Financing" },
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
  { value: "Global", label: "Beneteau has one of the largest dealer networks worldwide" },
  { value: "Liquid", label: "Strong resale demand means easier exits and faster sales" },
  { value: "Range", label: "Sailing + motor lines cover first-time buyers to serious cruisers" },
  { value: "Known", label: "A brand most surveyors, yards, and marinas know intimately" },
]

const quickTopics = [
  "Beneteau",
  "Sailing yachts",
  "Motor yachts",
  "Oceanis",
  "Swift Trawler",
  "Used yacht checklist",
  "Price guide",
  "2026 buyer guide",
]

const popularModels = [
  {
    name: "Beneteau Oceanis 45",
    slug: "oceanis-45",
    type: "Sailing / cruising",
    bestFor: "Med + coastal cruising, family trips, charter-friendly layouts",
    price: "Typical used range: ~€180k–€420k (varies heavily by year/spec/location)",
    notes:
      "A sweet-spot cruiser: good interior volume, proven platform, and broad buyer demand. Condition and inventory (rig, sails, electronics) matter more than brochure specs.",
  },
  {
    name: "Beneteau Oceanis 38.1",
    slug: "oceanis-38-1",
    type: "Sailing / cruising",
    bestFor: "First-time owners, easy handling, marina-friendly size",
    price: "Typical used range: ~€140k–€320k",
    notes:
      "Popular for its manageable size and modern layouts. Watch for charter wear and the age of sails/electronics—those upgrades add up fast.",
  },
  {
    name: "Beneteau First 40",
    slug: "first-40",
    type: "Sailing / performance",
    bestFor: "Faster passagemaking, club racing, performance cruising",
    price: "Typical used range: ~€120k–€280k",
    notes:
      "Sharper handling and better upwind feel. Prior use matters: a lightly-raced boat can be great; a hard-raced boat can hide expensive fatigue in rig/sails/hardware.",
  },
  {
    name: "Beneteau Swift Trawler 44",
    slug: "swift-trawler-44",
    type: "Motor / long-range cruising",
    bestFor: "Comfortable coastal passages, liveaboard-friendly cruising",
    price: "Typical used range: ~€420k–€1.1m+",
    notes:
      "A serious cruising platform with huge demand. Engine hours, maintenance logs, and stabilisation options are key value drivers.",
  },
  {
    name: "Beneteau Gran Turismo 46",
    slug: "gran-turismo-46",
    type: "Motor / sports cruiser",
    bestFor: "Day boating, weekend use, coastal hops in comfort",
    price: "Typical used range: ~€350k–€1.2m+",
    notes:
      "A lifestyle-oriented cruiser where systems and upkeep define the ownership experience. Focus on service history, generator/AC health, and drivetrain condition.",
  },
]

const priceBands = [
  {
    label: "Sailing yachts — older generations (approx. 2000–2010)",
    range: "Often ~€90k–€180k",
    drivers: "Condition, rig age, sails, and electronics will swing value dramatically.",
  },
  {
    label: "Sailing yachts — mid generations (approx. 2010–2020)",
    range: "Often ~€180k–€400k+",
    drivers: "Layout, engine hours, upgrade history, and charter use matter most.",
  },
  {
    label: "Sailing yachts — newer production / late-model",
    range: "Often ~€350k–€800k+",
    drivers: "Spec packages, inventory, and delivery region influence pricing.",
  },
  {
    label: "Motor yachts — Gran Turismo range",
    range: "Often ~€300k–€1.2m+",
    drivers: "Hours, drivetrain (IPS/shaft), generator/AC health, and storage history.",
  },
  {
    label: "Motor yachts — Swift Trawler range",
    range: "Often ~€400k–€1.5m+",
    drivers: "Stabilisation, navigation suite, service records, and cruising equipment.",
  },
]

const checklistSailing = [
  "Rigging age (standing + running), mast/boom inspection, and chainplate condition",
  "Sail inventory (age, condition, and whether replacements are imminent)",
  "Keel/hull join inspection and evidence of previous grounding",
  "Osmosis/moisture checks and hull maintenance history",
  "Engine hours + service records (cooling system, mounts, exhaust, belts)",
  "Electrical system: batteries, charging, shore power, inverter health",
  "Navigation electronics age (chartplotter, AIS, radar) and wiring quality",
  "Safety gear + compliance (liferaft service date, fire extinguishers, flares)",
]

const checklistMotor = [
  "Full engine survey (compression, cooling, turbos where relevant) + sea trial results",
  "Hours vs maintenance: regular servicing matters more than low hours alone",
  "Generator/air-conditioning operation under load",
  "Drivetrain condition (IPS/shaft/sterndrive), seals, and any vibration notes",
  "Fuel system: tank condition, filters, and evidence of water contamination",
  "Stabilisation systems (if fitted): service history and operation",
  "Corrosion checks in engine room and around through-hulls",
  "Electrical systems and bilge management: pumps, alarms, and wiring standards",
]

const faqs = [
  {
    q: "How much does a Beneteau yacht cost?",
    a: "Beneteau pricing depends on model, year, region, and specification. Used sailing models can start around the low six figures, while late-model cruisers and motor yachts can reach well into seven figures. The biggest pricing variables are condition, service history, equipment, and whether the boat has been heavily chartered.",
  },
  {
    q: "Is Beneteau a good yacht brand?",
    a: "Yes — for most buyers, Beneteau is a strong choice because of global support, broad resale demand, and proven production platforms. The trade-off is that they’re production-built rather than bespoke; value is driven by maintenance, upgrades, and ownership history more than marketing claims.",
  },
  {
    q: "Are Beneteau yachts good for ocean crossings?",
    a: "Some Beneteau models and configurations are used for longer passages, but suitability depends on the specific boat, its condition, and how it’s equipped. For offshore plans, prioritise a thorough survey, rig inspection, safety gear, and a realistic upgrade budget.",
  },
  {
    q: "Do Beneteau yachts hold their value?",
    a: "Generally, Beneteau has strong liquidity because the brand is widely recognised and there’s consistent buyer demand. Like all production yachts, depreciation is steepest early, then stabilises — and the best-maintained boats with clean histories typically resell faster.",
  },
  {
    q: "What should I avoid when buying a used Beneteau?",
    a: "Avoid boats with unclear ownership history, missing service records, or obvious signs of neglect. Charter boats can still be good purchases, but they must be inspected carefully for wear, deferred maintenance, and tired systems (rig, sails, upholstery, electronics).",
  },
]

export default function BuyingABeneteauGuidePage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const beneteauFaqSchema = useMemo(
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
        .model-row { padding: 18px; border-top: 1px solid rgba(10,33,31,0.06); }
        .model-row:first-child { border-top: none; }
        .model-name { font-size: 17px; font-weight: 700; color: #0a211f; letter-spacing: -0.01em; }
        .model-meta { font-size: 13px; color: rgba(10,33,31,0.55); margin-top: 6px; }
        .model-note { margin-top: 10px; font-size: 15px; line-height: 1.7; color: rgba(10,33,31,0.65); }
        .faq-item { border-bottom: 1px solid rgba(10,33,31,0.08); }
        .faq-question { width: 100%; text-align: left; padding: 20px 0; font-size: 16px; font-weight: 500; color: #0a211f; display: flex; justify-content: space-between; align-items: center; background: none; border: none; cursor: pointer; gap: 16px; }
        .faq-answer { font-size: 15px; line-height: 1.7; color: rgba(10,33,31,0.6); padding-bottom: 20px; }
      `}</style>

      <div className="pillar-page min-h-screen pb-0">
        {/* HERO */}
        <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
          <Image
            src="/hero-buy.jpg"
            alt="Buying a Beneteau yacht — Findaly guide"
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
              Buying Guide
            </motion.p>
            <motion.h1
              className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl"
              variants={fadeUp}
            >
              Buying a Beneteau:{" "}
              <span className="text-[#fff86c]">models, prices</span> & what to
              know in 2026.
            </motion.h1>
            <motion.p
              className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed"
              variants={fadeUp}
            >
              A confident, global guide for serious buyers — from pricing ranges
              to the models people actually search for, and what to inspect
              before you make an offer.
            </motion.p>

            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href="/buy/brand/beneteau"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Browse Beneteau Listings
              </Link>
              <Link
                href="/finance"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                Explore Yacht Finance
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
                      alt="Findaly — list your boat"
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-[#0a211f] p-5">
                    <p className="text-[15px] font-semibold text-white">
                      Looking for a specific model?
                    </p>
                    <p className="mt-1.5 text-[13px] text-white/50 leading-relaxed">
                      Jump straight into Beneteau listings and filter by year,
                      country, length, or budget.
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
                    Explore Findaly
                  </p>
                  <Link href="/buy" className="pillar-link">
                    <span>🛥️</span> Buy a Yacht
                  </Link>
                  <Link href="/sell" className="pillar-link">
                    <span>🏷️</span> Sell Your Boat
                  </Link>
                  <Link href="/charter" className="pillar-link">
                    <span>⚓</span> Charter a Yacht
                  </Link>
                  <Link href="/finance" className="pillar-link">
                    <span>💰</span> Yacht Finance
                  </Link>
                  <Link href="/destinations" className="pillar-link">
                    <span>🗺️</span> Destinations
                  </Link>
                </div>

                <div className="rounded-2xl border border-[#0a211f]/10 bg-[#0a211f]/2 p-5">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                    Popular Beneteau pages
                  </p>
                  <div className="space-y-2">
                    <Link href="/buy/brand/beneteau" className="pillar-link">
                      <span>🏷️</span> Beneteau brand hub
                    </Link>
                    <Link href="/buy/brand/beneteau/model/oceanis-45" className="pillar-link">
                      <span>⛵</span> Oceanis 45 listings
                    </Link>
                    <Link href="/buy/brand/beneteau/model/swift-trawler-44" className="pillar-link">
                      <span>🚤</span> Swift Trawler 44 listings
                    </Link>
                    <Link href="/buy/brand/beneteau/model/gran-turismo-46" className="pillar-link">
                      <span>⚡</span> Gran Turismo 46 listings
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            <article className="article-body min-w-0">
              <section id="overview" className="scroll-mt-28">
                <p className="section-label">Overview</p>
                <h2 className="section-heading">A smart way to buy, not a romantic one.</h2>
                <p>
                  Searching for a Beneteau usually means you want something{" "}
                  <strong>proven, widely supported, and easy to own</strong> —
                  a yacht with real-world resale demand, familiar systems, and a
                  global ecosystem of surveyors, yards, and dealers who know the platform.
                </p>
                <p>
                  This guide is written for global buyers — whether you’re comparing
                  an Oceanis for Mediterranean cruising, a First for faster sailing,
                  or a Swift Trawler for comfortable motor cruising. We’ll cover
                  realistic price ranges, which models are most searched, and what to
                  inspect before you commit.
                </p>
                <div className="pull-quote">
                  “A Beneteau isn’t just a boat choice — it’s an ownership strategy:
                  support, liquidity, and predictable costs.”
                </div>
                <p>
                  If you’re ready to browse inventory while you read, start here:{" "}
                  <Link href="/buy/brand/beneteau" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    Beneteau yachts for sale on Findaly
                  </Link>
                  .
                </p>
              </section>

              <section id="about-beneteau" className="mt-20 scroll-mt-28">
                <p className="section-label">About Beneteau</p>
                <h2 className="section-heading">Who Beneteau is — and why it matters.</h2>
                <p>
                  Beneteau is one of the world’s best-known yacht manufacturers, founded in{" "}
                  <strong>France</strong> and built into a globally recognised builder with
                  strong distribution across Europe, the US, and key cruising regions.
                  In practical terms, that scale matters: it typically means{" "}
                  <strong>strong parts availability, familiar systems, and broader buyer demand</strong>
                  when you eventually sell.
                </p>
                <p>
                  Beneteau spans both sailing and motor categories. The core lines most buyers
                  encounter include the{" "}
                  <strong>Oceanis</strong> (cruising sailboats),{" "}
                  <strong>First</strong> (performance-oriented sailing),{" "}
                  <strong>Gran Turismo</strong> (sport cruisers), and{" "}
                  <strong>Swift Trawler</strong> (comfortable long-range motor cruising).
                </p>
                <p>
                  For Findaly, that range is valuable because it creates a clear pSEO structure:
                  brand → model → year → country. The better we reinforce the brand hub with
                  authoritative guides, the more your Beneteau model pages benefit.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/buy/brand/beneteau"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]"
                  >
                    Explore Beneteau on Findaly →
                  </Link>
                  <Link
                    href="/buy"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-[#0a211f]/15 px-7 text-[14.5px] font-medium text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors"
                  >
                    Browse all yachts →
                  </Link>
                </div>
              </section>

              <section id="prices" className="mt-20 scroll-mt-28">
                <p className="section-label">Price guide</p>
                <h2 className="section-heading">How much does a Beneteau cost, realistically?</h2>
                <p>
                  Beneteau prices vary dramatically by model, year, region, and equipment.
                  The most common buyer mistake is under-budgeting the{" "}
                  <strong>post-purchase catch-up</strong> — sails, rigging, batteries,
                  electronics, servicing, safety gear. Two identical models can differ
                  by tens of thousands based on maintenance and inventory.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Typical price bands (global)</div>
                    <div className="text-[12px] text-[#0a211f]/45">Ranges vary by region/spec</div>
                  </div>
                  <div>
                    {priceBands.map((b) => (
                      <div key={b.label} className="model-row">
                        <div className="model-name">{b.label}</div>
                        <div className="model-meta">
                          <strong className="text-[#0a211f]">{b.range}</strong>
                          <span className="text-[#0a211f]/45"> • </span>
                          <span>{b.drivers}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-8">
                  If you want to sanity-check affordability beyond the purchase price,
                  explore{" "}
                  <Link href="/finance" className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold">
                    yacht financing on Findaly
                  </Link>{" "}
                  and treat it as a total-cost conversation: purchase, ownership, insurance,
                  berth, servicing, and upgrades.
                </p>
              </section>

              <section id="models" className="mt-20 scroll-mt-28">
                <p className="section-label">Popular models</p>
                <h2 className="section-heading">The Beneteau models buyers actually search for.</h2>
                <p>
                  You can buy “a Beneteau” — but you’ll own a specific platform, with a specific
                  layout, age profile, and maintenance reality. The models below are popular for a reason:
                  they have broad demand, familiar systems, and a global service ecosystem.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Top models</div>
                    <div className="text-[12px] text-[#0a211f]/45">Best-fit + what to watch</div>
                  </div>

                  <div>
                    {popularModels.map((m) => (
                      <div key={m.slug} className="model-row">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <div className="model-name">
                              <Link
                                href={`/buy/brand/beneteau/model/${m.slug}`}
                                className="text-[#0a211f] no-underline hover:underline decoration-[#fff86c] underline-offset-4"
                              >
                                {m.name}
                              </Link>
                            </div>
                            <div className="model-meta">
                              {m.type} • <strong className="text-[#0a211f]">Best for:</strong>{" "}
                              {m.bestFor}
                            </div>
                          </div>
                          <Link
                            href={`/buy/brand/beneteau/model/${m.slug}`}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0a211f] px-4 text-[13px] font-semibold text-[#fff86c]"
                          >
                            View listings →
                          </Link>
                        </div>
                        <p className="model-note">
                          <strong>Price context:</strong> {m.price}
                        </p>
                        <p className="model-note mb-0!">{m.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-8">
                  Pro tip: if you’re torn between two models, compare their{" "}
                  <strong>inventory cost</strong> (sails/rig/electronics for sailboats,
                  generator/AC/drive systems for motor yachts). The “cheaper” boat can quickly
                  become the expensive one.
                </p>
              </section>

              <section id="is-it-good" className="mt-20 scroll-mt-28">
                <p className="section-label">Brand evaluation</p>
                <h2 className="section-heading">Is Beneteau a good yacht brand?</h2>
                <p>
                  For most buyers, yes — and the reasons are practical. Beneteau tends to offer a
                  strong balance of comfort, availability, and resale liquidity. You’re rarely
                  alone in the market: there are always buyers searching for familiar platforms.
                </p>
                <p>
                  The key is to set expectations. Beneteau is primarily a production builder,
                  which means you’re buying a platform with known characteristics — not a bespoke,
                  heavy-displacement expedition yacht. That’s not a drawback. It’s simply the trade.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">What Beneteau gets right</div>
                    <div className="text-[12px] text-[#0a211f]/45">And where buyers should be sharp</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="model-row">
                      <div className="model-name">Strengths</div>
                      <ul className="mt-3">
                        <li>Global dealer and service network</li>
                        <li>Strong resale liquidity in popular models</li>
                        <li>Predictable ownership: familiar systems and layouts</li>
                        <li>Good availability of parts, yards, and surveyors</li>
                        <li>Wide range: cruising, performance, motor cruising</li>
                      </ul>
                    </div>
                    <div className="model-row">
                      <div className="model-name">Watch-outs</div>
                      <ul className="mt-3">
                        <li>Condition variance is huge — maintenance history is everything</li>
                        <li>Electronics can date fast; upgrades are expensive</li>
                        <li>Charter boats require extra scrutiny for wear and fatigue</li>
                        <li>Don’t assume “newer” equals “better” without a survey</li>
                        <li>Ownership costs depend more on systems than brand</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="new-vs-used" className="mt-20 scroll-mt-28">
                <p className="section-label">New vs used</p>
                <h2 className="section-heading">New vs used Beneteau: the smart trade-offs.</h2>
                <p>
                  If you’re buying new, you’re paying for warranty, predictable delivery,
                  and a clean slate. If you’re buying used, you’re buying value — but you must
                  validate condition. The best used purchases usually look like this:
                  a well-kept boat with a clear history, regular servicing, and sensible upgrades.
                </p>
                <p>
                  Depreciation is often steepest in the early years, then stabilises — which is
                  why many confident buyers target well-maintained boats in the “stable” zone.
                  For global buyers, region matters: local demand can shift pricing noticeably.
                </p>
                <div className="pull-quote">
                  “Buy the owner, then buy the boat — history and care beat brochure promises.”
                </div>
                <p>
                  Want to slice inventory by build year? Use Findaly’s year filters under the brand hub:
                  <br />
                  <Link
                    href="/buy/brand/beneteau/year/2018"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Beneteau 2018 listings
                  </Link>{" "}
                  (example).
                </p>
              </section>

              <section id="where-popular" className="mt-20 scroll-mt-28">
                <p className="section-label">Global demand</p>
                <h2 className="section-heading">Where Beneteau is most popular — and why.</h2>
                <p>
                  Beneteau’s popularity is global, but it shows up differently by region. In the Mediterranean,
                  Oceanis models are common thanks to marina access, coastal cruising patterns, and strong charter
                  presence. In the US, demand is often concentrated around active sailing communities and cruising
                  corridors. In the Caribbean, condition and storm history matter more than badges.
                </p>
                <p>
                  This matters because pricing is regional. A boat’s location can influence cost through
                  tax/VAT status, berth market, and demand cycles — not just the spec sheet.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Explore by destination</div>
                    <div className="text-[12px] text-[#0a211f]/45">Pair “where you cruise” with “what you buy”</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {[
                      { title: "Mediterranean", href: "/destinations" , note: "High Oceanis demand, charter-heavy markets." },
                      { title: "Caribbean", href: "/destinations" , note: "Inspect hard: weather history + systems." },
                      { title: "US East Coast", href: "/destinations" , note: "Strong community demand; seasonal cycles." },
                    ].map((x) => (
                      <div key={x.title} className="model-row">
                        <div className="model-name">{x.title}</div>
                        <p className="model-note mb-0!">{x.note}</p>
                        <div className="mt-4">
                          <Link
                            href={x.href}
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#0a211f]/15 px-4 text-[13px] font-semibold text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors"
                          >
                            Explore →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="checklist" className="mt-20 scroll-mt-28">
                <p className="section-label">Inspection checklist</p>
                <h2 className="section-heading">What to check before you buy (and why).</h2>
                <p>
                  Beneteau ownership success comes down to inspection discipline. A clean survey and sea trial
                  aren’t optional — they’re the mechanism that protects your downside. You’re not just buying a boat.
                  You’re buying the next few years of maintenance decisions made by the previous owner.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Sailing Beneteau checklist</div>
                    <div className="text-[12px] text-[#0a211f]/45">Rig + sails + hull fundamentals</div>
                  </div>
                  <div className="model-row">
                    <ul className="mt-0">
                      {checklistSailing.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="card mt-6">
                  <div className="card-head">
                    <div className="card-title">Motor Beneteau checklist</div>
                    <div className="text-[12px] text-[#0a211f]/45">Hours + systems + drivetrain</div>
                  </div>
                  <div className="model-row">
                    <ul className="mt-0">
                      {checklistMotor.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re buying internationally, treat paperwork as part of the inspection:
                  title/ownership chain, VAT or tax status, CE compliance where relevant, and any lien checks.
                  A broker can help — but you still need a clean process.
                </p>
              </section>

              <section id="financing" className="mt-20 scroll-mt-28">
                <p className="section-label">Financing</p>
                <h2 className="section-heading">Financing a Beneteau: keep it practical.</h2>
                <p>
                  Financing can expand your options — but it shouldn’t distort your decision-making.
                  The best approach is to finance a boat you can still comfortably afford to own:
                  berth, insurance, maintenance, and upgrades. Beneteau is often finance-friendly because
                  it’s a widely known brand with strong market liquidity in popular models.
                </p>
                <p>
                  Explore options and understand the shape of payments before you commit:
                </p>
                <div className="mt-6">
                  <Link
                    href="/finance"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]"
                  >
                    Yacht finance on Findaly →
                  </Link>
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
                  Ready to browse?
                </p>
                <h3 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.1] text-white tracking-tight">
                  Find your next{" "}
                  <span className="text-[#fff86c]">Beneteau</span> with confidence.
                </h3>
                <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                  Explore real listings, compare models, and keep the buying process clean —
                  from first shortlist to survey day.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/buy/brand/beneteau"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                  >
                    Browse Beneteau Listings
                  </Link>
                  <Link
                    href="/buy"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                  >
                    Browse all yachts
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
              <span className="text-[#0a211f]/60">Buying a Beneteau</span>
            </nav>
          </div>
        </div>

        {/* FAQ SCHEMA SCRIPT */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(beneteauFaqSchema) }}
        />
      </div>
    </>
  )
}
