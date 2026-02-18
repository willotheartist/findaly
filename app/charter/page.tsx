"use client"

import { useEffect, useState } from "react"
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
  { id: "why-charter", label: "Why charter" },
  { id: "types", label: "Types of charter" },
  { id: "how-it-works", label: "How it works" },
  { id: "destinations", label: "Top destinations" },
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
  { value: "2,000+", label: "Charter vessels worldwide" },
  { value: "50+", label: "Destinations across every ocean" },
  { value: "Direct", label: "Book straight with the owner" },
  { value: "Any size", label: "Day trips to full-season charters" },
]

const faqs = [
  {
    q: "What's the difference between bareboat and crewed charter?",
    a: "Bareboat charter means you captain the vessel yourself — you'll need a valid sailing licence. Crewed charter comes with a professional captain (and often a full crew), so you simply enjoy the experience.",
  },
  {
    q: "How far in advance should I book a charter?",
    a: "For peak season (July–August in the Med, December–February in the Caribbean), book 3–6 months ahead. Shoulder season and last-minute deals are often available with less notice.",
  },
  {
    q: "Can I charter a yacht without a sailing licence?",
    a: "Yes — choose a crewed charter and the captain handles everything. Some destinations also allow bareboat charter with a motor vessel licence for powerboats.",
  },
  {
    q: "What's typically included in a charter price?",
    a: "The base rate covers the vessel. Additional costs vary: fuel, provisioning, marina fees, and crew gratuity (typically 10–15%) are usually extra. Always check the listing for what's included.",
  },
  {
    q: "Can I list my own boat for charter on Findaly?",
    a: "Absolutely. Use our listing wizard to create a charter listing — set your availability, rates, and vessel details. Findaly connects you directly with charterers.",
  },
]

export default function CharterPage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <style>{`
        .pillar-page { background-color: #f5f2eb; color: #1a1a1a; }
        .article-body p { font-size: 17px; line-height: 1.75; color: rgba(10,33,31,0.7); margin-bottom: 1.5rem; }
        .article-body strong { color: #0a211f; font-weight: 600; }
        .section-label { font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #0a211f; opacity: 0.4; margin-bottom: 0.75rem; }
        .section-heading { font-size: clamp(28px, 3.5vw, 40px); line-height: 1.15; letter-spacing: -0.02em; color: #0a211f; margin-bottom: 1.75rem; font-weight: 600; }
        .pull-quote { font-size: clamp(22px, 2.8vw, 32px); line-height: 1.4; color: #0a211f; border-left: 3px solid #fff86c; padding-left: 1.5rem; margin: 2.5rem 0; font-style: italic; opacity: 0.85; }
        .toc-link { display: block; padding: 6px 0; font-size: 13.5px; color: rgba(10,33,31,0.35); transition: color 0.2s; text-decoration: none; }
        .toc-link:hover { color: rgba(10,33,31,0.7); }
        .toc-link-active { color: #0a211f !important; font-weight: 600; }
        .toc-link-active::before { content: '—'; margin-right: 8px; color: #fff86c; }
        .stat-card { padding: 28px 24px; background: rgba(10,33,31,0.04); border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.08); }
        .charter-type-card { padding: 24px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.08); background: rgba(10,33,31,0.02); transition: border-color 0.2s; }
        .charter-type-card:hover { border-color: rgba(10,33,31,0.18); }
        .faq-item { border-bottom: 1px solid rgba(10,33,31,0.08); }
        .faq-question { width: 100%; text-align: left; padding: 20px 0; font-size: 16px; font-weight: 500; color: #0a211f; display: flex; justify-content: space-between; align-items: center; background: none; border: none; cursor: pointer; gap: 16px; }
        .faq-answer { font-size: 15px; line-height: 1.7; color: rgba(10,33,31,0.6); padding-bottom: 20px; }
        .pillar-link { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.1); font-size: 14px; font-weight: 500; color: #0a211f; text-decoration: none; transition: all 0.2s; background: rgba(10,33,31,0.02); }
        .pillar-link:hover { background: rgba(10,33,31,0.06); border-color: rgba(10,33,31,0.2); }
        .dest-tag { display: inline-flex; align-items: center; padding: 8px 16px; border-radius: 100px; background: rgba(10,33,31,0.05); border: 1px solid rgba(10,33,31,0.08); font-size: 14px; color: #0a211f; font-weight: 500; text-decoration: none; }
        .dest-tag:hover { background: rgba(10,33,31,0.08); }
      `}</style>

      <div className="pillar-page min-h-screen pb-0">
        {/* HERO */}
        <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
          <Image src="/charter-hero.jpg" alt="Charter a yacht on Findaly" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/60 via-[#0a211f]/30 to-[#f5f2eb]" />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#fff86c] mb-4" variants={fadeUp}>
              Charter a Yacht
            </motion.p>
            <motion.h1
              className="text-[clamp(36px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-3xl"
              variants={fadeUp}
            >
              The open water is <span className="text-[#fff86c]">waiting for you.</span>
            </motion.h1>
            <motion.p className="mt-6 text-[17px] text-white/70 max-w-xl leading-relaxed" variants={fadeUp}>
              Browse thousands of charter yachts worldwide. Book direct with owners. No agency fees.
            </motion.p>
            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href="/buy?intent=CHARTER"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Find a Charter
              </Link>
              <Link
                href="/add-listing"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                List your boat for charter
              </Link>
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
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-5">
                <div className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/3 p-6">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-4">
                    On this page
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
                    <Image src="/list-boat-cta.jpg" alt="List your boat on Findaly" fill sizes="280px" className="object-cover" />
                  </div>
                  <div className="bg-[#0a211f] p-5">
                    <p className="text-[15px] font-semibold text-white">List your boat for charter</p>
                    <p className="mt-1.5 text-[13px] text-white/50 leading-relaxed">
                      Earn income from your vessel while it&apos;s not in use.
                    </p>
                    <Link
                      href="/add-listing"
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#fff86c] text-[13.5px] font-semibold text-[#0a211f]"
                    >
                      List Your Boat
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
                  <Link href="/brokers" className="pillar-link">
                    <span>🤝</span> Yacht Brokers
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

            {/* Article */}
            <article className="article-body min-w-0">
              <section id="why-charter" className="scroll-mt-28">
                <p className="section-label">Why charter</p>
                <h2 className="section-heading">The smartest way to experience life on the water.</h2>
                <p>
                  Owning a yacht is a dream. Chartering one is a reality you can book this weekend.{" "}
                  <strong>Charter gives you everything ownership offers — the freedom, the destinations, the lifestyle</strong> — without
                  the maintenance, the marina fees, or the capital tied up at anchor.
                </p>
                <p>
                  Findaly&apos;s charter marketplace connects you directly with boat owners and professional charter operators across every
                  major sailing region. No agency layers. No opaque pricing. Just the vessel, the owner, and the sea.
                </p>
                <div className="pull-quote">
                  &quot;Why own when you can charter a different yacht in a different destination every year?&quot;
                </div>
                <p>
                  For those who are ready to buy, charter is also the perfect way to trial a vessel type before committing. Spend a week on
                  a catamaran in the Greek islands before you decide if it&apos;s the right choice for your next purchase.
                </p>
              </section>

              <section id="types" className="mt-20 scroll-mt-28">
                <p className="section-label">Types of charter</p>
                <h2 className="section-heading">Every kind of charter, in one place.</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {[
                    {
                      icon: "⚓",
                      title: "Bareboat Charter",
                      body: "You captain the vessel. Full freedom, full responsibility. Requires a valid RYA, IYT, or equivalent licence.",
                    },
                    {
                      icon: "👨‍✈️",
                      title: "Crewed Charter",
                      body: "Captain and crew included. Simply arrive, relax, and let the professionals handle everything from navigation to meals.",
                    },
                    { icon: "📅", title: "Day Charter", body: "A single day or weekend on the water. Perfect for celebrations, corporate events, or a spontaneous escape." },
                    { icon: "🌍", title: "Long-Term Charter", body: "Week-long to full-season charters. The closest experience to yacht ownership without the commitment." },
                  ].map((type) => (
                    <div key={type.title} className="charter-type-card">
                      <div className="text-2xl mb-3">{type.icon}</div>
                      <h3 className="font-semibold text-[16px] text-[#0a211f] mb-2">{type.title}</h3>
                      <p className="mb-0 text-[14px]">{type.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="how-it-works" className="mt-20 scroll-mt-28">
                <p className="section-label">How it works</p>
                <h2 className="section-heading">Find. Book. Sail.</h2>

                <div className="space-y-8 mt-8">
                  {[
                    {
                      step: "01",
                      title: "Search by destination or vessel type",
                      body: "Filter by location, dates, vessel type, size, and budget. Findaly's search covers the Mediterranean, Caribbean, Pacific, and beyond.",
                    },
                    {
                      step: "02",
                      title: "Compare and shortlist",
                      body: "Each charter listing shows full specs, photos, availability calendar, and pricing. Save favourites and compare side by side.",
                    },
                    {
                      step: "03",
                      title: "Contact the owner directly",
                      body: "Send an enquiry through Findaly's messaging system. Negotiate directly, ask questions, and confirm your booking without any agency in between.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-5">
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          background: "#fff86c",
                          color: "#0a211f",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[17px] text-[#0a211f] mb-2">{item.title}</h3>
                        <p className="mb-0">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="destinations" className="mt-20 scroll-mt-28">
                <p className="section-label">Top destinations</p>
                <h2 className="section-heading">From the Med to the Pacific — we&apos;ve got you covered.</h2>
                <p>
                  Findaly&apos;s charter listings span the world&apos;s most iconic sailing destinations. Whether you&apos;re chasing{" "}
                  <strong>Greek island sunsets, Caribbean trade winds, or Norwegian fjords</strong>, you&apos;ll find the right vessel in the
                  right place.
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {[
                    "Greek Islands",
                    "French Riviera",
                    "Croatia",
                    "Balearic Islands",
                    "Caribbean",
                    "BVI",
                    "Maldives",
                    "Turkey",
                    "Amalfi Coast",
                    "Norwegian Fjords",
                    "Sardinia",
                    "Montenegro",
                  ].map((dest) => (
                    <Link key={dest} href={`/destinations`} className="dest-tag">
                      {dest}
                    </Link>
                  ))}
                </div>

                <p className="mt-8">
                  Each destination on Findaly has a dedicated page with editorial content covering sailing conditions, anchorages, marina
                  guides, and the best times to visit.{" "}
                  <Link href="/destinations" className="underline underline-offset-2 text-[#0a211f]">
                    Explore destinations →
                  </Link>
                </p>
              </section>

              <section id="faq" className="mt-20 scroll-mt-28">
                <p className="section-label">FAQ</p>
                <h2 className="section-heading">Everything you need to know about chartering.</h2>
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
              </section>

              <div className="mt-20 mb-8 rounded-2xl bg-[#0a211f] p-10 md:p-14 text-center">
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#fff86c]/70 mb-4">Ready to cast off?</p>
                <h3 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.1] text-white tracking-tight">
                  Your next voyage <span className="text-[#fff86c]">starts here.</span>
                </h3>
                <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                  Browse thousands of charter vessels across 50+ destinations. Book direct. Pay less.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/buy?intent=CHARTER"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                  >
                    Find a Charter
                  </Link>
                  <Link
                    href="/add-listing"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                  >
                    List your boat
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
              <span className="text-[#0a211f]/60">Charter a Yacht</span>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
