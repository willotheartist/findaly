// app/brokers/page.tsx
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
  { id: "why-broker", label: "Why use a broker" },
  { id: "find-broker", label: "Find a broker" },
  { id: "pro-accounts", label: "Pro accounts" },
  { id: "how-it-works", label: "How it works" },
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
  { value: "Verified", label: "All Pro brokers are identity-verified" },
  { value: "Global", label: "Brokerages from 30+ countries" },
  { value: "Direct", label: "Message brokers instantly" },
  { value: "Free", label: "No cost to search and contact" },
]

const faqs = [
  {
    q: "Why should I use a yacht broker instead of selling privately?",
    a: "Brokers bring experience, a qualified buyer network, and handle the legal paperwork. For high-value vessels or complex international transactions, a reputable broker can be invaluable. For simpler sales, Findaly's private listing tools are equally powerful.",
  },
  {
    q: "How do I know a broker on Findaly is reputable?",
    a: "Verified brokers on Findaly have completed our identity and business verification process. Look for the verified badge on their profile. We also encourage buyers to check membership with EYBA, YBAA, or equivalent industry associations.",
  },
  {
    q: "What commission do yacht brokers typically charge?",
    a: "Industry standard is typically 8–10% of the sale price for the selling broker, sometimes split with a buying broker. Always agree on commission in writing before engaging a broker.",
  },
  {
    q: "Can a broker list their entire fleet on Findaly?",
    a: "Yes. Pro accounts allow unlimited listings, bulk import tools, analytics dashboards, priority search placement, and verified badges across all their listings.",
  },
  {
    q: "I'm a broker — how do I get a Pro account?",
    a: "Create a free account, then upgrade to Pro from your dashboard. Pro accounts are available for individual brokers and full brokerages.",
  },
]

export default function BrokersPage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // ─────────────────────────────────────────────────────────────────────────────
  // FAQ SCHEMA
  // ─────────────────────────────────────────────────────────────────────────────
  const brokersFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why should I use a yacht broker instead of selling privately?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Brokers bring experience, a qualified buyer network, and handle the legal paperwork. For high-value vessels or complex international transactions, a reputable broker can be invaluable.",
        },
      },
      {
        "@type": "Question",
        name: "How do I know a broker on Findaly is reputable?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Verified brokers on Findaly have completed our identity and business verification process. Look for the verified badge on their profile.",
        },
      },
      {
        "@type": "Question",
        name: "What commission do yacht brokers typically charge?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Industry standard is typically 8 to 10% of the sale price for the selling broker, sometimes split with a buying broker. Always agree on commission in writing before engaging a broker.",
        },
      },
      {
        "@type": "Question",
        name: "Can a broker list their entire fleet on Findaly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Pro accounts allow unlimited listings, bulk import tools, analytics dashboards, priority search placement, and verified badges across all their listings.",
        },
      },
      {
        "@type": "Question",
        name: "I am a broker — how do I get a Pro account?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Create a free account, then upgrade to Pro from your dashboard. Pro accounts are available for individual brokers and full brokerages.",
        },
      },
    ],
  }

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
        .pro-feature { display: flex; gap: 12px; align-items: flex-start; padding: 20px 0; border-bottom: 1px solid rgba(10,33,31,0.06); }
        .pro-feature:last-child { border-bottom: none; }
        .faq-item { border-bottom: 1px solid rgba(10,33,31,0.08); }
        .faq-question { width: 100%; text-align: left; padding: 20px 0; font-size: 16px; font-weight: 500; color: #0a211f; display: flex; justify-content: space-between; align-items: center; background: none; border: none; cursor: pointer; gap: 16px; }
        .faq-answer { font-size: 15px; line-height: 1.7; color: rgba(10,33,31,0.6); padding-bottom: 20px; }
        .pillar-link { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.1); font-size: 14px; font-weight: 500; color: #0a211f; text-decoration: none; transition: all 0.2s; background: rgba(10,33,31,0.02); }
        .pillar-link:hover { background: rgba(10,33,31,0.06); border-color: rgba(10,33,31,0.2); }
        .verified-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 100px; background: rgba(10,33,31,0.06); font-size: 12px; font-weight: 600; color: #0a211f; }
      `}</style>

      <div className="pillar-page min-h-screen pb-0">
        {/* HERO */}
        <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
          <Image
            src="/brokers-hero.jpg"
            alt="Yacht brokers on Findaly"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/60 via-[#0a211f]/30 to-[#f5f2eb]" />
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
              Yacht Brokers
            </motion.p>
            <motion.h1
              className="text-[clamp(36px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-3xl"
              variants={fadeUp}
            >
              The world&apos;s best brokers,{" "}
              <span className="text-[#fff86c]">in one place.</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-[17px] text-white/70 max-w-xl leading-relaxed"
              variants={fadeUp}
            >
              Browse verified yacht brokers and brokerages. Or list your fleet
              with a Pro account and reach serious buyers worldwide.
            </motion.p>
            <motion.div
              className="mt-8 flex gap-3 flex-wrap justify-center"
              variants={fadeUp}
            >
              <Link
                href="/buy"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Browse Broker Listings
              </Link>
              <Link
                href="/upgrade"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                Get a Pro Account
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
                    On this page
                  </p>
                  <nav>
                    {tocSections.map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className={`toc-link ${
                          activeId === s.id ? "toc-link-active" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault()
                          document
                            .getElementById(s.id)
                            ?.scrollIntoView({ behavior: "smooth" })
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
                      alt="List your boat on Findaly"
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-[#0a211f] p-5">
                    <p className="text-[15px] font-semibold text-white">
                      Are you a broker?
                    </p>
                    <p className="mt-1.5 text-[13px] text-white/50 leading-relaxed">
                      List your fleet and reach global buyers with a Pro
                      account.
                    </p>
                    <Link
                      href="/upgrade"
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#fff86c] text-[13.5px] font-semibold text-[#0a211f]"
                    >
                      Get Pro Account
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
              </div>
            </aside>

            <article className="article-body min-w-0">
              <section id="why-broker" className="scroll-mt-28">
                <p className="section-label">Why use a broker</p>
                <h2 className="section-heading">Experience that pays for itself.</h2>
                <p>
                  A yacht is one of the most complex assets you&apos;ll ever buy
                  or sell.{" "}
                  <strong>
                    A professional broker doesn&apos;t just find you a boat — they
                    protect you through the entire transaction.
                  </strong>{" "}
                  Survey coordination, title checks, contract negotiation, flag
                  state transfers, VAT status verification — the details that can
                  cost buyers and sellers dearly if overlooked.
                </p>
                <p>
                  Findaly&apos;s verified brokers bring decades of combined
                  expertise across every vessel category, from entry-level
                  motorboats to superyachts. Their listings come with the
                  credibility of professional representation and the reach of
                  Findaly&apos;s global buyer network.
                </p>
                <div className="pull-quote">
                  &quot;The right broker doesn&apos;t just sell your yacht. They
                  protect the transaction.&quot;
                </div>
                <p>
                  For buyers, a broker with deep market knowledge can find
                  off-market vessels, negotiate on your behalf, and guide you
                  through surveys and sea trials. For sellers, a Pro broker on
                  Findaly gets priority placement, verified badges, and analytics
                  dashboards to track listing performance.
                </p>
              </section>

              <section id="find-broker" className="mt-20 scroll-mt-28">
                <p className="section-label">Find a broker</p>
                <h2 className="section-heading">
                  Search by location, speciality, or vessel type.
                </h2>
                <p>
                  Findaly&apos;s broker directory is searchable by geography,
                  vessel speciality, and brokerage size. Looking for a Sunseeker
                  specialist in the south of France? A catamaran expert in the
                  BVI? A superyacht brokerage in Monaco? You&apos;ll find them
                  here.
                </p>
                <p>
                  Every broker profile on Findaly shows their active listings,
                  their specialities, their location, and — for verified accounts
                  — their professional credentials.{" "}
                  <strong>
                    Verified brokers have completed Findaly&apos;s identity and
                    business verification process
                  </strong>{" "}
                  <span className="verified-badge">✓ Verified</span>
                </p>
                <p>
                  Contact any broker directly through Findaly&apos;s messaging
                  system. No cold emails, no hunting for contact pages — just a
                  direct line to the right professional.
                </p>

                <div className="mt-8">
                  <Link
                    href="/buy"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]"
                  >
                    Browse broker listings →
                  </Link>
                </div>
              </section>

              <section id="pro-accounts" className="mt-20 scroll-mt-28">
                <p className="section-label">Pro accounts</p>
                <h2 className="section-heading">
                  Built for the professionals who take this seriously.
                </h2>
                <p>
                  Findaly Pro is designed for brokers, dealers, and brokerages
                  who need more than a basic listing page. Pro accounts unlock
                  the full power of the platform.
                </p>

                <div className="mt-6 rounded-2xl border border-[#0a211f]/8 overflow-hidden">
                  <div className="bg-[#0a211f] px-6 py-4">
                    <p className="text-[13px] font-semibold text-[#fff86c] tracking-wide uppercase">
                      Pro Account Features
                    </p>
                  </div>
                  <div className="px-6 divide-y divide-[#0a211f]/6">
                    {[
                      {
                        icon: "∞",
                        title: "Unlimited listings",
                        body: "List your entire fleet with no caps. Bulk import tools make it fast.",
                      },
                      {
                        icon: "✓",
                        title: "Verified badge",
                        body: "A verification badge appears across all your listings and your profile.",
                      },
                      {
                        icon: "↑",
                        title: "Priority placement",
                        body: "Your listings rank higher in search results and category pages.",
                      },
                      {
                        icon: "◎",
                        title: "Analytics dashboard",
                        body: "Track views, enquiries, saves, and performance for every listing.",
                      },
                      {
                        icon: "✉",
                        title: "Direct enquiry routing",
                        body: "All buyer messages route to your team&apos;s shared inbox.",
                      },
                    ].map((f) => (
                      <div key={f.title} className="pro-feature">
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
                            fontSize: 16,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {f.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-[15px] text-[#0a211f]">
                            {f.title}
                          </h4>
                          <p className="text-[14px]! mb-0! mt-0.5">{f.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/upgrade"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]"
                  >
                    Upgrade to Pro →
                  </Link>
                </div>
              </section>

              <section id="how-it-works" className="mt-20 scroll-mt-28">
                <p className="section-label">How it works</p>
                <h2 className="section-heading">
                  From first enquiry to completed sale.
                </h2>
                <div className="space-y-8 mt-8">
                  {[
                    {
                      step: "01",
                      title: "Find your vessel or broker",
                      body: "Search Findaly's marketplace by vessel type, brand, location, or price. Filter to show professional broker listings only.",
                    },
                    {
                      step: "02",
                      title: "Make contact directly",
                      body: "Message the broker or seller directly. No agency layer, no email forms. Direct communication from day one.",
                    },
                    {
                      step: "03",
                      title: "Survey, negotiate, close",
                      body: "The broker handles the paperwork. Findaly's platform keeps communications organised throughout the transaction.",
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
                        <h3 className="font-semibold text-[17px] text-[#0a211f] mb-2">
                          {item.title}
                        </h3>
                        <p className="mb-0!">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="faq" className="mt-20 scroll-mt-28">
                <p className="section-label">FAQ</p>
                <h2 className="section-heading">
                  Questions about brokers on Findaly.
                </h2>
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
                  Are you a broker?
                </p>
                <h3 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.1] text-white tracking-tight">
                  Join the world&apos;s{" "}
                  <span className="text-[#fff86c]">maritime marketplace.</span>
                </h3>
                <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                  Pro accounts give you unlimited listings, verified badges,
                  priority placement, and a global audience of serious buyers.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/upgrade"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                  >
                    Get Pro Account
                  </Link>
                  <Link
                    href="/add-listing"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                  >
                    List a boat free
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl px-6 pb-20">
          <div className="border-t border-[#0a211f]/8 pt-6">
            <nav className="flex items-center gap-2 text-[13px] text-[#0a211f]/35">
              <Link
                href="/"
                className="hover:text-[#0a211f]/60 transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <span className="text-[#0a211f]/60">Yacht Brokers</span>
            </nav>
          </div>
        </div>

        {/* FAQ SCHEMA SCRIPT (inside top-level wrapper, just before closing tag) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(brokersFaqSchema) }}
        />
      </div>
    </>
  )
}
