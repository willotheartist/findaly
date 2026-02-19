// app/guides/beneteau-oceanis-vs-first/page.tsx
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
  { id: "who-should-buy", label: "Who should buy what" },
  { id: "handling", label: "Handling & performance" },
  { id: "comfort", label: "Comfort & layouts" },
  { id: "ownership", label: "Ownership & maintenance" },
  { id: "resale", label: "Resale & liquidity" },
  { id: "quick-picks", label: "Quick model picks" },
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
  { value: "Oceanis", label: "Cruising comfort + easy ownership, built for volume demand" },
  { value: "First", label: "Performance bias + sharper handling, more sensitive to history" },
  { value: "Process", label: "Survey + rig inspection matter more on performance platforms" },
  { value: "Pick", label: "Choose by usage: marina life vs sailing feel vs racing intent" },
]

const quickTopics = [
  "Oceanis vs First",
  "Beneteau sailing",
  "Cruising",
  "Performance",
  "Resale",
  "Survey",
  "Rigging",
  "Best model",
]

const quickModelPicks = [
  {
    name: "Beneteau Oceanis 38.1",
    href: "/buy/brand/beneteau/model/oceanis-38-1",
    why: "Manageable size, modern layouts, first-owner friendly.",
  },
  {
    name: "Beneteau Oceanis 45",
    href: "/buy/brand/beneteau/model/oceanis-45",
    why: "Broad global demand; great family cruiser when inventory is fresh.",
  },
  {
    name: "Beneteau First 40",
    href: "/buy/brand/beneteau/model/first-40",
    why: "Performance-leaning platform; validate rig + sail wardrobe + fatigue.",
  },
  {
    name: "Browse all Beneteau listings",
    href: "/buy/brand/beneteau",
    why: "Filter by year, length, and location once you know your direction.",
  },
]

const faqs = [
  {
    q: "Is Oceanis better than First?",
    a: "Not in absolute terms — they’re built for different buyers. Oceanis is typically comfort-first cruising with broad resale demand. First is more performance-oriented and rewards engaged sailing, but you must be more careful about history and rig/sail condition.",
  },
  {
    q: "Which is better for Mediterranean cruising?",
    a: "Often Oceanis, because layouts and comfort align with marina-based cruising. But a well-kept First can be brilliant if you prioritise sailing feel and faster passages. Decide based on your usage: family comfort vs sailing performance.",
  },
  {
    q: "Which line has better resale?",
    a: "Popular Oceanis models often have very strong liquidity due to broad buyer demand. First models can be highly desirable too, but resale is more sensitive to condition, fatigue, and how hard the boat was used (especially if raced).",
  },
  {
    q: "What matters most when buying a used First model?",
    a: "Rig inspection, deck hardware condition, sail wardrobe, and signs of fatigue. A lightly-used performance boat can be a gem; a hard-raced boat can hide expensive wear. Survey discipline is non-negotiable.",
  },
  {
    q: "Should I pick based on price alone?",
    a: "No. Factor the inventory and upgrade costs. A “cheaper” boat with old rigging, tired sails, and outdated electronics can become the expensive one quickly.",
  },
]

export default function OceanisVsFirstGuidePage() {
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
            alt="Beneteau Oceanis vs First guide — Findaly"
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
              Comparison Guide
            </motion.p>
            <motion.h1
              className="text-[clamp(34px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-4xl"
              variants={fadeUp}
            >
              Beneteau Oceanis vs First:{" "}
              <span className="text-[#fff86c]">which line fits you?</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-[17px] text-white/70 max-w-2xl leading-relaxed"
              variants={fadeUp}
            >
              A confident, buyer-first comparison — comfort vs performance,
              ownership reality, and how to choose without regret.
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
                  <Link href="/guides/used-beneteau-checklist" className="pillar-link">
                    <span>✅</span> Used Beneteau checklist
                  </Link>
                  <Link href="/guides/beneteau-swift-trawler-buying-guide" className="pillar-link">
                    <span>🚤</span> Swift Trawler buying guide
                  </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#0a211f]/10">
                  <div className="relative h-44">
                    <Image
                      src="/list-boat-cta.jpg"
                      alt="Findaly — explore listings"
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-[#0a211f] p-5">
                    <p className="text-[15px] font-semibold text-white">
                      Want a fast shortlist?
                    </p>
                    <p className="mt-1.5 text-[13px] text-white/50 leading-relaxed">
                      Pick your line first (Oceanis or First), then filter inventory
                      by year, region, and condition.
                    </p>
                    <Link
                      href="/buy/brand/beneteau"
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#fff86c] text-[13.5px] font-semibold text-[#0a211f]"
                    >
                      Browse Beneteau →
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            <article className="article-body min-w-0">
              <section id="overview" className="scroll-mt-28">
                <p className="section-label">Overview</p>
                <h2 className="section-heading">Choose by usage, not by identity.</h2>
                <p>
                  Oceanis and First aren’t “better vs worse.” They’re different tools.
                  Oceanis is typically a <strong>comfort-first cruising platform</strong> built for broad demand.
                  First leans toward <strong>performance and sailing feel</strong> — and ownership reality is more sensitive to history.
                </p>
                <div className="pull-quote">
                  “Oceanis is a lifestyle. First is a bias. Pick the one you’ll actually use.”
                </div>
                <p>
                  If you’re still deciding brand-wide, start here:
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

              <section id="who-should-buy" className="mt-20 scroll-mt-28">
                <p className="section-label">Fit</p>
                <h2 className="section-heading">Who should buy Oceanis vs First?</h2>
                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Quick fit</div>
                    <div className="text-[12px] text-[#0a211f]/45">Use this honestly</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="row">
                      <div className="row-title">Oceanis (Cruising)</div>
                      <ul className="mt-3">
                        <li>Comfort-forward layouts and interiors</li>
                        <li>Marina-based cruising, family trips, entertaining</li>
                        <li>Broader buyer demand and liquidity on popular models</li>
                        <li>Ownership feels more predictable (when maintained)</li>
                      </ul>
                    </div>
                    <div className="row">
                      <div className="row-title">First (Performance)</div>
                      <ul className="mt-3">
                        <li>Sharper sailing feel and performance bias</li>
                        <li>Club racing, faster passages, more engaged handling</li>
                        <li>Condition matters more (rig/sails/hardware fatigue)</li>
                        <li>History-sensitive resale (especially hard-raced boats)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="handling" className="mt-20 scroll-mt-28">
                <p className="section-label">Performance</p>
                <h2 className="section-heading">Handling: the difference you feel.</h2>
                <p>
                  First models generally reward trimming and technique. Oceanis models generally reward stability and comfort.
                  If you love the act of sailing, First is often the emotional win — but you need to buy carefully.
                </p>
                <p>
                  The key buyer mistake: purchasing a performance platform without budgeting for inventory (sails/rigging)
                  and expecting it to feel “fast” on tired gear.
                </p>
              </section>

              <section id="comfort" className="mt-20 scroll-mt-28">
                <p className="section-label">Comfort</p>
                <h2 className="section-heading">Comfort and layouts: what your week looks like.</h2>
                <p>
                  Oceanis tends to win on volume, light, and liveability — especially for families and guests.
                  If your sailing is mostly weekends, marina dinners, and coastal cruising, this matters.
                </p>
                <p>
                  First can still be comfortable, but the buyer expectation should be: you’re prioritising sailing feel and speed,
                  not floating apartment vibes.
                </p>
              </section>

              <section id="ownership" className="mt-20 scroll-mt-28">
                <p className="section-label">Ownership</p>
                <h2 className="section-heading">Ownership reality: where costs hide.</h2>
                <p>
                  Oceanis ownership tends to be more “mainstream”: parts familiarity, broad service experience,
                  and fewer performance-wear surprises. First ownership can be equally fine — but depends heavily on how it was used.
                </p>
                <p>
                  If you’re buying used, pair this guide with:
                  {" "}
                  <Link
                    href="/guides/used-beneteau-checklist"
                    className="underline decoration-[#fff86c] underline-offset-4 text-[#0a211f] font-semibold"
                  >
                    Used Beneteau checklist
                  </Link>
                  .
                </p>
              </section>

              <section id="resale" className="mt-20 scroll-mt-28">
                <p className="section-label">Resale</p>
                <h2 className="section-heading">Resale: liquidity vs niche demand.</h2>
                <p>
                  Popular Oceanis models typically enjoy broad buyer demand — which can mean faster sales when condition is clean.
                  First models can be highly desirable too, but the buyer pool is more sensitive to proof:
                  sail wardrobe, rig age, maintenance, and usage history.
                </p>
                <p>
                  Want price context for negotiation? Read:
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

              <section id="quick-picks" className="mt-20 scroll-mt-28">
                <p className="section-label">Quick picks</p>
                <h2 className="section-heading">Fast model picks to shortlist.</h2>

                <div className="card mt-8">
                  <div className="card-head">
                    <div className="card-title">Shortlist</div>
                    <div className="text-[12px] text-[#0a211f]/45">Then filter listings</div>
                  </div>
                  <div>
                    {quickModelPicks.map((m) => (
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
                            <p className="row-note mb-0!">{m.why}</p>
                          </div>
                          <Link
                            href={m.href}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0a211f] px-4 text-[13px] font-semibold text-[#fff86c]"
                          >
                            View →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  Ready to shortlist?
                </p>
                <h3 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.1] text-white tracking-tight">
                  Pick your line —{" "}
                  <span className="text-[#fff86c]">then buy with discipline.</span>
                </h3>
                <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                  The best outcome is simple: find a platform that matches your usage,
                  then validate condition through survey and clean records.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/buy/brand/beneteau"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                  >
                    Browse Beneteau Listings
                  </Link>
                  <Link
                    href="/guides/used-beneteau-checklist"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                  >
                    Use the checklist
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
              <span className="text-[#0a211f]/60">Oceanis vs First</span>
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
