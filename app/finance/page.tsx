// app/finance/page.tsx
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
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
}

const tocSections = [
  { id: "financing-a-yacht", label: "Financing a yacht" },
  { id: "how-it-works", label: "How it works" },
  { id: "loan-types", label: "Types of marine finance" },
  { id: "what-to-know", label: "What to know first" },
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
        if (visible.length > 0) setActiveId(visible[0].target.id)
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
  { value: "80%", label: "Of yacht purchases use some form of finance" },
  { value: "Competitive", label: "Marine loan rates from specialist lenders" },
  { value: "Fast", label: "Pre-approval decisions often within 48 hours" },
  { value: "Flexible", label: "Terms from 5 to 20 years available" },
]

const faqs = [
  {
    q: "Can I finance a used boat as well as a new one?",
    a: "Yes. Most marine lenders will finance both new and used vessels, though the terms may differ. Age, condition, and survey results all influence the lending decision for older vessels.",
  },
  {
    q: "What deposit do I need to buy a yacht on finance?",
    a: "Typical deposits range from 10–30% depending on the lender, vessel type, and your financial profile. Some specialist lenders offer lower deposit products for well-qualified buyers.",
  },
  {
    q: "Does the boat need a survey before finance is approved?",
    a: "Most lenders require a marine survey for vessels above a certain value or age. The survey protects both you and the lender by confirming the vessel's condition and market value.",
  },
  {
    q: "Can I finance a yacht registered in another country?",
    a: "International marine finance is complex but absolutely possible. Specialist lenders work with cross-border purchases regularly — flag state, VAT status, and registration all affect the structure of the finance.",
  },
  {
    q: "What's the difference between a marine mortgage and a personal loan for a boat?",
    a: "A marine mortgage uses the vessel as security, typically offering lower rates and longer terms. A personal loan is unsecured, quicker, but usually at higher rates and over shorter periods — better suited for smaller vessels.",
  },
]

export default function FinancePage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // ─────────────────────────────────────────────────────────────────────────────
  // FAQ SCHEMA
  // ─────────────────────────────────────────────────────────────────────────────
  const financeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I finance a used boat as well as a new one?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Most marine lenders will finance both new and used vessels, though the terms may differ. Age, condition, and survey results all influence the lending decision for older vessels.",
        },
      },
      {
        "@type": "Question",
        name: "What deposit do I need to buy a yacht on finance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Typical deposits range from 10 to 30% depending on the lender, vessel type, and your financial profile. Some specialist lenders offer lower deposit products for well-qualified buyers.",
        },
      },
      {
        "@type": "Question",
        name: "Does the boat need a survey before finance is approved?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most lenders require a marine survey for vessels above a certain value or age. The survey protects both you and the lender by confirming the vessel's condition and market value.",
        },
      },
      {
        "@type": "Question",
        name: "Can I finance a yacht registered in another country?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "International marine finance is complex but absolutely possible. Specialist lenders work with cross-border purchases regularly — flag state, VAT status, and registration all affect the structure of the finance.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between a marine mortgage and a personal loan for a boat?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A marine mortgage uses the vessel as security, typically offering lower rates and longer terms. A personal loan is unsecured, quicker, but usually at higher rates and over shorter periods — better suited for smaller vessels.",
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
        .loan-type-card { padding: 24px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.08); background: rgba(10,33,31,0.02); }
        .checklist-item { display: flex; gap: 12px; align-items: flex-start; padding: 14px 0; border-bottom: 1px solid rgba(10,33,31,0.06); }
        .checklist-item:last-child { border-bottom: none; }
        .check-dot { width: 22px; height: 22px; background: #fff86c; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #0a211f; flex-shrink: 0; margin-top: 2px; }
        .faq-item { border-bottom: 1px solid rgba(10,33,31,0.08); }
        .faq-question { width: 100%; text-align: left; padding: 20px 0; font-size: 16px; font-weight: 500; color: #0a211f; display: flex; justify-content: space-between; align-items: center; background: none; border: none; cursor: pointer; gap: 16px; }
        .faq-answer { font-size: 15px; line-height: 1.7; color: rgba(10,33,31,0.6); padding-bottom: 20px; }
        .pillar-link { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.1); font-size: 14px; font-weight: 500; color: #0a211f; text-decoration: none; transition: all 0.2s; background: rgba(10,33,31,0.02); }
        .pillar-link:hover { background: rgba(10,33,31,0.06); border-color: rgba(10,33,31,0.2); }
        .disclaimer { font-size: 13px !important; line-height: 1.6 !important; color: rgba(10,33,31,0.35) !important; font-style: italic; }
      `}</style>

      <div className="pillar-page min-h-screen pb-0">
        {/* HERO */}
        <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
          <Image
            src="/finance-hero.jpg"
            alt="Yacht finance on Findaly"
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
              Yacht Finance
            </motion.p>

            <motion.h1
              className="text-[clamp(36px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-3xl"
              variants={fadeUp}
            >
              Don&apos;t wait to own.{" "}
              <span className="text-[#fff86c]">Finance it.</span>
            </motion.h1>

            <motion.p
              className="mt-6 text-[17px] text-white/70 max-w-xl leading-relaxed"
              variants={fadeUp}
            >
              Marine finance options for every vessel and every budget. Understand your options before you make an offer.
            </motion.p>

            <motion.div
              className="mt-8 flex gap-3 flex-wrap justify-center"
              variants={fadeUp}
            >
              <Link
                href="/buy"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                Browse Yachts for Sale
              </Link>

              <Link
                href="/add-listing"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                List your boat
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
                    <Image
                      src="/list-boat-cta.jpg"
                      alt="List your boat on Findaly"
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-[#0a211f] p-5">
                    <p className="text-[15px] font-semibold text-white">Ready to list your boat?</p>
                    <p className="mt-1.5 text-[13px] text-white/50 leading-relaxed">
                      Free listing. No commission. Global reach.
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
                  <Link href="/buy" className="pillar-link"><span>🛥️</span> Buy a Yacht</Link>
                  <Link href="/sell" className="pillar-link"><span>🏷️</span> Sell Your Boat</Link>
                  <Link href="/charter" className="pillar-link"><span>⚓</span> Charter a Yacht</Link>
                  <Link href="/brokers" className="pillar-link"><span>🤝</span> Yacht Brokers</Link>
                  <Link href="/destinations" className="pillar-link"><span>🗺️</span> Destinations</Link>
                </div>
              </div>
            </aside>

            <article className="article-body min-w-0">
              <section id="financing-a-yacht" className="scroll-mt-28">
                <p className="section-label">Financing a yacht</p>
                <h2 className="section-heading">The yacht you want is closer than you think.</h2>
                <p>
                  Most people assume yacht ownership requires significant capital upfront. The reality is different:{" "}
                  <strong>marine finance is well-developed, competitive, and accessible</strong> to buyers across a wide range of budgets.
                  From a €30,000 motorboat to a €3 million sailing yacht, specialist lenders work with buyers every day.
                </p>
                <p>
                  The key is understanding the landscape before you make an offer. Interest rates, term lengths, deposit requirements,
                  and the role of a survey all vary between lenders and vessel types. Going in informed means going in with confidence.
                </p>

                <div className="pull-quote">
                  &ldquo;The best time to explore finance options is before you find the boat you love.&rdquo;
                </div>

                <p>
                  Findaly&apos;s finance guide covers everything you need to understand your options. And when you&apos;ve found your vessel
                  on Findaly, you&apos;ll be ready to move quickly.
                </p>
              </section>

              <section id="how-it-works" className="mt-20 scroll-mt-28">
                <p className="section-label">How it works</p>
                <h2 className="section-heading">From search to sea, financed.</h2>
                <div className="space-y-8 mt-8">
                  {[
                    {
                      step: "01",
                      title: "Understand your budget",
                      body:
                        "Before searching for a vessel, know your total budget including deposit, survey costs, insurance, registration, and first-year running costs. Finance calculators can help you model monthly repayments at different rates and terms.",
                    },
                    {
                      step: "02",
                      title: "Get pre-approved",
                      body:
                        "Approaching a specialist marine lender before you make an offer gives you confidence — and sellers confidence in you. Pre-approval typically takes 24–72 hours and requires proof of income and basic financial information.",
                    },
                    {
                      step: "03",
                      title: "Find your vessel on Findaly",
                      body:
                        "With finance arranged in principle, you can search Findaly's marketplace knowing your numbers. When you find the right vessel, you can move quickly.",
                    },
                    {
                      step: "04",
                      title: "Survey and complete",
                      body:
                        "Lenders typically require a professional marine survey for vessels above a threshold value. Once the survey is satisfactory, finance is confirmed and the sale completes.",
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
                        <p className="mb-0!">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="loan-types" className="mt-20 scroll-mt-28">
                <p className="section-label">Types of marine finance</p>
                <h2 className="section-heading">Not all marine loans are the same.</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {[
                    { icon: "⚓", title: "Marine Mortgage", body: "The vessel is used as security. Typically lower rates and longer terms (5–20 years). Best for higher-value purchases." },
                    { icon: "📄", title: "Hire Purchase", body: "You pay in instalments and own the vessel outright at the end. Simple structure, predictable monthly payments." },
                    { icon: "🔄", title: "Refinancing", body: "Already own a vessel? Refinancing can release equity or reduce your monthly repayments. Common for upgrading to a larger boat." },
                    { icon: "🏦", title: "Personal Loan", body: "Unsecured lending for smaller vessels. Quicker to arrange, higher rates. Suitable for boats under €50,000." },
                  ].map((type) => (
                    <div key={type.title} className="loan-type-card">
                      <div className="text-2xl mb-3">{type.icon}</div>
                      <h3 className="font-semibold text-[16px] text-[#0a211f] mb-2">{type.title}</h3>
                      <p className="mb-0! text-[14px]!">{type.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="what-to-know" className="mt-20 scroll-mt-28">
                <p className="section-label">What to know first</p>
                <h2 className="section-heading">Key things every buyer should understand.</h2>
                <p>
                  Marine finance has some important differences from property or car finance.{" "}
                  <strong>Going in prepared avoids surprises at the wrong moment.</strong>
                </p>

                <div className="mt-6 rounded-2xl border border-[#0a211f]/8 overflow-hidden px-6">
                  {[
                    { point: "VAT status matters", detail: "Ensure the vessel has paid or exempt VAT status before committing. Unresolved VAT can add 20%+ to your total cost." },
                    { point: "Survey is not optional", detail: "For financed purchases, a professional marine survey is almost always required. Budget €500–€3,000 depending on vessel size." },
                    { point: "Running costs are real", detail: "Marina fees, insurance, maintenance, fuel, and crew (if applicable) typically add 5–15% of the vessel's value per year." },
                    { point: "Vessel age affects terms", detail: "Most lenders won't finance vessels over 25–30 years old. Some specialist lenders exist for classic and vintage vessels." },
                    { point: "Flag state and registration", detail: "Where the vessel is registered affects insurance, finance, and which waters you can legally sail. Get advice before purchase." },
                  ].map((item) => (
                    <div key={item.point} className="checklist-item">
                      <div className="check-dot">✓</div>
                      <div>
                        <h4 className="font-semibold text-[15px] text-[#0a211f]">{item.point}</h4>
                        <p className="text-[14px]! mb-0! mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="disclaimer mt-6">
                  Findaly provides general information about marine finance for educational purposes only. This is not financial advice.
                  Always consult a qualified marine finance specialist or independent financial adviser before making any financial decisions.
                </p>
              </section>

              <section id="faq" className="mt-20 scroll-mt-28">
                <p className="section-label">FAQ</p>
                <h2 className="section-heading">Marine finance questions, answered.</h2>
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
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#fff86c]/70 mb-4">Ready to find your yacht?</p>
                <h3 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.1] text-white tracking-tight">
                  Browse every vessel. <span className="text-[#fff86c]">Find your match.</span>
                </h3>
                <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                  Findaly&apos;s marketplace connects you directly with sellers and brokers. Once your finance is in place, you can move fast.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/buy"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                  >
                    Browse Yachts for Sale
                  </Link>
                  <Link
                    href="/brokers"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                  >
                    Find a broker
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl px-6 pb-20">
          <div className="border-t border-[#0a211f]/8 pt-6">
            <nav className="flex items-center gap-2 text-[13px] text-[#0a211f]/35">
              <Link href="/" className="hover:text-[#0a211f]/60 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#0a211f]/60">Yacht Finance</span>
            </nav>
          </div>
        </div>

        {/* FAQ SCHEMA SCRIPT (inside top-level wrapper, just before closing tag) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(financeFaqSchema) }}
        />
      </div>
    </>
  )
}
