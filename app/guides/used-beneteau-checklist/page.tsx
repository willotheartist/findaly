// app/guides/used-beneteau-checklist/page.tsx
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
  { id: "paperwork", label: "Paperwork first" },
  { id: "sailing", label: "Sailing checklist" },
  { id: "motor", label: "Motor checklist" },
  { id: "sea-trial", label: "Sea trial & survey" },
  { id: "deal-breakers", label: "Deal breakers" },
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
  { value: "Order", label: "Paperwork → survey → price. Not the other way around." },
  { value: "Logs", label: "Service records beat “low hours” every time" },
  { value: "Systems", label: "Most surprises come from neglected systems, not hulls" },
  { value: "Global", label: "International buys demand clean title + tax/VAT clarity" },
]

const quickTopics = [
  "Used Beneteau checklist",
  "Survey",
  "Sea trial",
  "Rigging",
  "Osmosis",
  "Engines",
  "Paperwork",
  "VAT / tax",
]

const paperworkChecklist = [
  "Clear ownership chain (title/registration documents, seller authority to sell)",
  "VAT / tax status evidence (where relevant) and any import documentation",
  "Outstanding liens or finance checks (ask explicitly; validate where possible)",
  "CE / compliance documentation where applicable",
  "Service history: engine services, haul-out records, invoices, survey reports",
  "Insurance history and claims disclosures (especially storm / grounding events)",
  "Charter history disclosure (if applicable): usage intensity and maintenance programme",
]

const sailingChecklist = [
  "Standing rigging age + inspection (chainplates, terminals, mast fittings)",
  "Running rigging condition (halyards, sheets, clutches, blocks, winches)",
  "Sail wardrobe condition (main/genoa, any spares, cover usage and storage)",
  "Keel/hull join inspection and evidence of grounding or repairs",
  "Osmosis/moisture checks and hull maintenance history",
  "Engine hours + service records (cooling, mounts, exhaust, belts, fuel system)",
  "Electrical system: batteries, charging, shore power, inverter health",
  "Electronics age (plotter, AIS, radar) and wiring standards",
  "Seacocks/through-hulls condition and access",
  "Bilge discipline: pumps, alarms, evidence of chronic water ingress",
  "Safety gear status (liferaft service date, extinguishers, flares, EPIRB where used)",
]

const motorChecklist = [
  "Full engine survey plan + sea trial objectives (temps, RPM, smoke, vibration)",
  "Hours vs maintenance: evidence of regular servicing and cooling system care",
  "Generator + air-conditioning under load (not just powered on at the dock)",
  "Drivetrain condition (IPS/shaft/sterndrive), seals, and vibration notes",
  "Fuel system: tank condition, filters, evidence of water contamination",
  "Stabilisation systems (if fitted): service history and operation",
  "Engine room corrosion checks and overall cleanliness",
  "Electrical systems: chargers, batteries, alternators, shore power, wiring quality",
  "Bilge management: pumps, float switches, alarms, high-water alerts",
  "Domestic systems: water heater, plumbing leaks, heads, macerators, holding tank",
]

const dealBreakers = [
  "Unclear ownership or missing paperwork (walk away or pause until resolved)",
  "No service history on high-value systems (engines/generator/rig) with vague explanations",
  "Survey reveals structural damage not priced or disclosed (especially keel/grounding)",
  "Chronic water ingress or serious corrosion in engine spaces",
  "Suspicious cosmetic refit while systems are visibly neglected",
  "Seller refuses haul-out or survey access",
]

const faqs = [
  {
    q: "Is it risky to buy a used Beneteau?",
    a: "Not if you treat it like a process: paperwork first, then survey and sea trial, then price negotiation. Beneteau platforms are widely supported; the risk is almost always condition, history, or neglected systems — which a good survey plan will expose.",
  },
  {
    q: "Should I avoid ex-charter Beneteau boats?",
    a: "Not automatically. Some charter fleets maintain boats aggressively. But you must inspect for wear, deferred maintenance, and tired inventory (sails, rig, upholstery, electronics). Price should reflect reality.",
  },
  {
    q: "What’s the single most important step?",
    a: "A thorough survey and sea trial, paired with clean paperwork. If the seller won’t allow a haul-out and proper inspection, treat that as a major red flag.",
  },
  {
    q: "Do I need a broker if I’m buying internationally?",
    a: "It often helps. A good broker can manage the transaction structure, documentation, and negotiation — but you still need your own survey discipline and clarity on tax/VAT and title.",
  },
  {
    q: "What’s the biggest hidden cost on sailboats vs motor yachts?",
    a: "Sailboats: rigging, sails, and electronics. Motor yachts: engines, generator/AC, and drivetrain. In both cases, poor service history is the real cost multiplier.",
  },
]

export default function UsedBeneteauChecklistPage() {
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
        .faq-item { border-bottom: 1px solid rgba(10,33,31,0.08); }
        .faq-question { width: 100%; text-align: left; padding: 20px 0; font-size: 16px; font-weight: 500; color: #0a211f; display: flex; justify-content: space-between; align-items: center; background: none; border: none; cursor: pointer; gap: 16px; }
        .faq-answer { font-size: 15px; line-height: 1.7; color: rgba(10,33,31,0.6); padding-bottom: 20px; }
      `}</style>

      <div className="pillar-page min-h-screen pb-0">
        {/* HERO */}
        <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
          <Image
            src="/hero-buy.jpg"
            alt="Used Beneteau checklist — Findaly"
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
              Inspection Checklist
            </motion.p>
            <motion.h1
              className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl"
              variants={fadeUp}
            >
              Used Beneteau checklist:{" "}
              <span className="text-[#fff86c]">what to inspect</span> before you buy.
            </motion.h1>
            <motion.p
              className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed"
              variants={fadeUp}
            >
              A clean, global buying checklist — paperwork first, then systems,
              then survey discipline. Built for real transactions.
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
                Read the pillar guide
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

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                    Beneteau authority cluster
                  </p>
                  <Link href="/guides/buying-a-beneteau" className="pillar-link">
                    <span>📘</span> Buying a Beneteau (pillar)
                  </Link>
                  <Link href="/guides/beneteau-price-guide" className="pillar-link">
                    <span>💶</span> Beneteau price guide
                  </Link>
                  <Link href="/guides/beneteau-oceanis-vs-first" className="pillar-link">
                    <span>⛵</span> Oceanis vs First
                  </Link>
                  <Link href="/guides/beneteau-swift-trawler-buying-guide" className="pillar-link">
                    <span>🚤</span> Swift Trawler buying guide
                  </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#0a211f]/10">
                  <div className="relative h-44">
                    <Image
                      src="/list-boat-cta.jpg"
                      alt="Findaly — browse Beneteau"
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-[#0a211f] p-5">
                    <p className="text-[15px] font-semibold text-white">
                      Compare condition quickly
                    </p>
                    <p className="mt-1.5 text-[13px] text-white/50 leading-relaxed">
                      Use listings to spot patterns: fresh rigging, clean engine logs,
                      tidy bilges, clear paperwork.
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
                  <Link href="/brokers" className="pillar-link">
                    <span>🧭</span> Yacht Brokers
                  </Link>
                  <Link href="/finance" className="pillar-link">
                    <span>💰</span> Yacht Finance
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
                <h2 className="section-heading">The goal is simple: reduce surprise.</h2>
                <p>
                  A used Beneteau can be a fantastic buy — but only if you treat inspection like a discipline.
                  This checklist is designed for global buyers who want a clean transaction:{" "}
                  <strong>paperwork clarity, systems reality, and a proper survey</strong>.
                </p>
                <div className="pull-quote">
                  “Paperwork first. Systems second. Survey always. Price comes last.”
                </div>
                <p>
                  If you want the broader buying strategy, start here:
                  {" "}
                  <Link
                    href="/guides/buying-a-beneteau"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Buying a Beneteau (pillar guide)
                  </Link>
                  .
                </p>
              </section>

              <section id="paperwork" className="mt-20 scroll-mt-28">
                <p className="section-label">Paperwork first</p>
                <h2 className="section-heading">If paperwork is messy, the deal is messy.</h2>
                <p>
                  Before you fall in love with a layout or a cockpit, validate the transaction foundation.
                  Buying internationally is totally normal — but it requires discipline.
                </p>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Paperwork checklist</div>
                    <div className="text-[12px] text-[#0a211f]/45">Don’t skip</div>
                  </div>
                  <div className="row">
                    <ul className="mt-0">
                      {paperworkChecklist.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re not comfortable handling paperwork alone, browse a professional:
                  {" "}
                  <Link
                    href="/brokers"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Findaly brokers directory
                  </Link>
                  .
                </p>
              </section>

              <section id="sailing" className="mt-20 scroll-mt-28">
                <p className="section-label">Sailing checklist</p>
                <h2 className="section-heading">Rig + sails + hull basics decide everything.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Sailboat checklist</div>
                    <div className="text-[12px] text-[#0a211f]/45">Inspect like an owner</div>
                  </div>
                  <div className="row">
                    <ul className="mt-0">
                      {sailingChecklist.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-8">
                  Want to compare Oceanis listings while you inspect? Start here:
                  {" "}
                  <Link
                    href="/buy/brand/beneteau"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Beneteau listings
                  </Link>
                  .
                </p>
              </section>

              <section id="motor" className="mt-20 scroll-mt-28">
                <p className="section-label">Motor checklist</p>
                <h2 className="section-heading">Engines + systems: test under load.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Motor yacht checklist</div>
                    <div className="text-[12px] text-[#0a211f]/45">Don’t trust dock demos</div>
                  </div>
                  <div className="row">
                    <ul className="mt-0">
                      {motorChecklist.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-8">
                  If you’re focusing Swift Trawlers specifically, read:
                  {" "}
                  <Link
                    href="/guides/beneteau-swift-trawler-buying-guide"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Swift Trawler buying guide
                  </Link>
                  .
                </p>
              </section>

              <section id="sea-trial" className="mt-20 scroll-mt-28">
                <p className="section-label">Sea trial & survey</p>
                <h2 className="section-heading">Your process that protects your downside.</h2>
                <p>
                  Don’t treat survey as a formality. Treat it as a decision gate.
                  You’re verifying structure, systems, and history — and pricing risk properly.
                </p>
                <ul>
                  <li><strong>Haul-out:</strong> hull, keel, through-hulls, rudder, props/gear, tabs.</li>
                  <li><strong>Sea trial:</strong> temps, vibration, RPM, smoke, steering feel, autopilot, stability.</li>
                  <li><strong>Systems under load:</strong> generator + AC, pumps, electronics, charging.</li>
                  <li><strong>Document everything:</strong> photos, notes, and follow-up quotes.</li>
                </ul>
              </section>

              <section id="deal-breakers" className="mt-20 scroll-mt-28">
                <p className="section-label">Deal breakers</p>
                <h2 className="section-heading">When to walk away (fast).</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Deal breakers</div>
                    <div className="text-[12px] text-[#0a211f]/45">Protect your time</div>
                  </div>
                  <div className="row">
                    <ul className="mt-0">
                      {dealBreakers.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-8">
                  If you want pricing context to back decisions, read:
                  {" "}
                  <Link
                    href="/guides/beneteau-price-guide"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Beneteau price guide
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
                  Ready to shortlist?
                </p>
                <h3 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.1] text-white tracking-tight">
                  Browse listings —{" "}
                  <span className="text-[#fff86c]">then inspect properly.</span>
                </h3>
                <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                  A great used Beneteau is usually boring: clean logs, tidy systems,
                  and a seller who welcomes survey discipline.
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
              <span className="text-[#0a211f]/60">Used Beneteau Checklist</span>
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
