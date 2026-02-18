"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

/* ------------------------------------------------------------------ */
/*  Animation tokens                                                   */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  TOC                                                                */
/* ------------------------------------------------------------------ */
const tocSections = [
  { id: "why-findaly", label: "Why Findaly" },
  { id: "how-it-works", label: "How it works" },
  { id: "your-listing", label: "Your listing" },
  { id: "reach", label: "Reach & exposure" },
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

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */
const stats = [
  { value: "0%", label: "Commission — you keep every euro" },
  { value: "Free", label: "To list your boat on Findaly" },
  { value: "Global", label: "Buyer network across 50+ countries" },
  { value: "24h", label: "Average time to first enquiry" },
]

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */
const faqs = [
  {
    q: "How much does it cost to sell my boat on Findaly?",
    a: "Listing your boat is completely free. We don't charge commission on the sale. Pro accounts unlock premium placement and analytics for brokers and dealers.",
  },
  {
    q: "Can I list a boat for sale privately, without a broker?",
    a: "Absolutely. Findaly is built for both private sellers and professional brokers. Create a free account, add your listing, and buyers can message you directly.",
  },
  {
    q: "What types of vessels can I sell on Findaly?",
    a: "Everything that moves on water — yachts, sailboats, motorboats, catamarans, RIBs, jet skis, dinghies, fishing boats, houseboats, and more.",
  },
  {
    q: "How do I write a good listing?",
    a: "High-quality photos make the biggest difference. After that, accurate specs (length, engine hours, year) and an honest description of the vessel's condition drive serious enquiries.",
  },
  {
    q: "Can I also list my boat for charter while it's for sale?",
    a: "Yes. Findaly supports dual listings — you can mark a vessel as available for both sale and charter simultaneously.",
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function SellPage() {
  const activeId = useTocTracker()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <style>{`
        .pillar-page {
          background-color: #f5f2eb;
          color: #1a1a1a;
        }
        .article-body p {
          font-size: 17px;
          line-height: 1.75;
          color: rgba(10,33,31,0.7);
          margin-bottom: 1.5rem;
        }
        .article-body strong {
          color: #0a211f;
          font-weight: 600;
        }
        .section-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0a211f;
          opacity: 0.4;
          margin-bottom: 0.75rem;
        }
        .section-heading {
          font-size: clamp(28px, 3.5vw, 40px);
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #0a211f;
          margin-bottom: 1.75rem;
          font-weight: 600;
        }
        .pull-quote {
          font-size: clamp(22px, 2.8vw, 32px);
          line-height: 1.4;
          color: #0a211f;
          border-left: 3px solid #fff86c;
          padding-left: 1.5rem;
          margin: 2.5rem 0;
          font-style: italic;
          opacity: 0.85;
        }
        .toc-link {
          display: block;
          padding: 6px 0;
          font-size: 13.5px;
          color: rgba(10,33,31,0.35);
          transition: color 0.2s;
          text-decoration: none;
        }
        .toc-link:hover { color: rgba(10,33,31,0.7); }
        .toc-link-active {
          color: #0a211f !important;
          font-weight: 600;
        }
        .toc-link-active::before {
          content: '—';
          margin-right: 8px;
          color: #fff86c;
        }
        .stat-card {
          padding: 28px 24px;
          background: rgba(10,33,31,0.04);
          border-radius: 1.25rem;
          border: 1px solid rgba(10,33,31,0.08);
        }
        .step-number {
          width: 36px;
          height: 36px;
          background: #fff86c;
          color: #0a211f;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .faq-item {
          border-bottom: 1px solid rgba(10,33,31,0.08);
        }
        .faq-question {
          width: 100%;
          text-align: left;
          padding: 20px 0;
          font-size: 16px;
          font-weight: 500;
          color: #0a211f;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          gap: 16px;
        }
        .faq-answer {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(10,33,31,0.6);
          padding-bottom: 20px;
        }
        .pillar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 1.25rem;
          border: 1px solid rgba(10,33,31,0.1);
          font-size: 14px;
          font-weight: 500;
          color: #0a211f;
          text-decoration: none;
          transition: all 0.2s;
          background: rgba(10,33,31,0.02);
        }
        .pillar-link:hover {
          background: rgba(10,33,31,0.06);
          border-color: rgba(10,33,31,0.2);
        }
      `}</style>

      <div className="pillar-page min-h-screen pb-0">
        {/* ── HERO ── */}
        <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
          <Image
            src="/sell-hero.jpg"
            alt="Sell your boat on Findaly"
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
              Sell Your Boat
            </motion.p>
            <motion.h1
              className="text-[clamp(36px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-3xl"
              variants={fadeUp}
            >
              Your boat deserves{" "}
              <span className="text-[#fff86c]">the right buyer.</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-[17px] text-white/70 max-w-xl leading-relaxed"
              variants={fadeUp}
            >
              List for free. No commission. Reach a global network of serious buyers in minutes.
            </motion.p>
            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link
                href="/add-listing"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] transition-opacity hover:opacity-90"
              >
                List Your Boat — It&apos;s Free
              </Link>
              <Link
                href="/buy"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
              >
                See how listings look
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ── STAT ROW ── */}
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

        {/* ── TWO-COLUMN BODY ── */}
        <div className="mx-auto mt-20 max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-5">
                {/* TOC */}
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

                {/* CTA card */}
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
                      Ready to list your boat?
                    </p>
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

                {/* Other pillars */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/40 mb-3">
                    Explore Findaly
                  </p>
                  <Link href="/buy" className="pillar-link">
                    <span>🛥️</span> Buy a Yacht
                  </Link>
                  <Link href="/charter" className="pillar-link">
                    <span>⚓</span> Charter a Yacht
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

              {/* WHY FINDALY */}
              <section id="why-findaly" className="scroll-mt-28">
                <p className="section-label">Why Findaly</p>
                <h2 className="section-heading">
                  Sell without the middleman.{" "}
                  <span style={{ color: "#0a211f", opacity: 0.5 }}>Keep what&apos;s yours.</span>
                </h2>
                <p>
                  Traditional boat sales cost sellers tens of thousands in broker commissions.
                  Findaly flips the model.{" "}
                  <strong>List your vessel for free, connect directly with buyers, and keep 100% of the sale price.</strong>
                </p>
                <p>
                  Whether you&apos;re selling your first jet ski or a 30-metre superyacht, Findaly gives every seller the same powerful tools that were previously reserved for major brokerages — detailed listing pages, high-resolution photo galleries, full specification sheets, and a global audience of qualified buyers.
                </p>

                <div className="pull-quote">
                  &quot;The maritime world&apos;s best-kept secret is that you don&apos;t need a broker to sell your boat.&quot;
                </div>

                <p>
                  Private sellers get the same visibility as professional dealers. Your listing appears alongside verified brokerages, with identical search placement and the same access to Findaly&apos;s buyer network. The only difference is you pay nothing.
                </p>
              </section>

              {/* HOW IT WORKS */}
              <section id="how-it-works" className="mt-20 scroll-mt-28">
                <p className="section-label">How it works</p>
                <h2 className="section-heading">
                  Three steps to your first enquiry.
                </h2>

                <div className="space-y-8 mt-8">
                  {[
                    {
                      step: "01",
                      title: "Create your listing",
                      body: "Use our guided listing wizard to add photos, specs, and your asking price. It takes about 10 minutes. You can always come back and edit.",
                    },
                    {
                      step: "02",
                      title: "Get discovered",
                      body: "Your listing is indexed immediately. Buyers searching by type, brand, location, price, or year will find your boat in search results and category pages.",
                    },
                    {
                      step: "03",
                      title: "Connect with buyers",
                      body: "Serious enquiries land directly in your Findaly inbox. Chat, share documents, arrange viewings — all through the platform. No middleman, no delays.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-5">
                      <div className="step-number">{item.step}</div>
                      <div>
                        <h3 className="font-semibold text-[17px] text-[#0a211f] mb-2">{item.title}</h3>
                        {/* ✅ FIX: mb-0! is not valid tailwind */}
                        <p className="mb-0">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <Link
                    href="/add-listing"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0a211f] px-7 text-[14.5px] font-semibold text-[#fff86c]"
                  >
                    Start your listing →
                  </Link>
                </div>
              </section>

              {/* YOUR LISTING */}
              <section id="your-listing" className="mt-20 scroll-mt-28">
                <p className="section-label">Your listing</p>
                <h2 className="section-heading">
                  A listing that works as hard as you do.
                </h2>
                <p>
                  Every Findaly listing comes with a full-screen photo gallery, complete specification table, engine details, accommodation breakdown, and a direct messaging channel to you. No generic templates — each listing is a proper vessel presentation.
                </p>
                <p>
                  <strong>Photos drive enquiries.</strong> Findaly supports up to 50 high-resolution images per listing. Buyers expect to see the cockpit, the engine bay, the interior, and the waterline. Give them everything.
                </p>
                <p>
                  <strong>Specs matter.</strong> Year, length, beam, displacement, engine hours, fuel type, navigation electronics — buyers filter by these fields. The more complete your listing, the higher it ranks in search results.
                </p>

                <div className="pull-quote">
                  &quot;A great listing is half the sale.&quot;
                </div>

                <p>
                  Findaly&apos;s listing wizard guides you through every field — nothing is left to chance. When you&apos;re done, your listing is immediately live, immediately indexed, and immediately visible to buyers around the world.
                </p>
              </section>

              {/* REACH */}
              <section id="reach" className="mt-20 scroll-mt-28">
                <p className="section-label">Reach & exposure</p>
                <h2 className="section-heading">
                  Your boat, seen by buyers in 50+ countries.
                </h2>
                <p>
                  The maritime market is global. A Bénéteau listed in Marseille can sell to a buyer in Sydney. A Sunseeker in Monaco can attract interest from Miami.{" "}
                  <strong>Findaly&apos;s buyer network spans every major sailing region on the planet.</strong>
                </p>
                <p>
                  Listings are structured for search engine discovery — brand pages, model pages, country pages, and year pages mean your vessel appears in Google searches far beyond the platform itself. Findaly brings buyers to you.
                </p>
                <p>
                  Buyers can save searches and set alerts. When your listing matches their criteria, they&apos;re notified automatically. You don&apos;t have to wait for them to find you — Findaly&apos;s system sends your listing directly to people actively looking for exactly what you&apos;re selling.
                </p>
              </section>

              {/* FAQ */}
              <section id="faq" className="mt-20 scroll-mt-28">
                <p className="section-label">FAQ</p>
                <h2 className="section-heading">
                  Common questions from sellers.
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
                      {openFaq === i && (
                        <p className="faq-answer">{faq.a}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* CLOSING CTA */}
              <div className="mt-20 mb-8 rounded-2xl bg-[#0a211f] p-10 md:p-14 text-center">
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#fff86c]/70 mb-4">
                  Ready to sell?
                </p>
                <h3 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.1] text-white tracking-tight">
                  List your boat today.{" "}
                  <span className="text-[#fff86c]">It&apos;s free.</span>
                </h3>
                <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
                  Join thousands of sellers reaching serious buyers across the globe. No commission. No fees. Just results.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/add-listing"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
                  >
                    List Your Boat
                  </Link>
                  <Link
                    href="/buy"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                  >
                    Browse listings
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* BREADCRUMBS */}
        <div className="mx-auto mt-16 max-w-6xl px-6 pb-20">
          <div className="border-t border-[#0a211f]/8 pt-6">
            <nav className="flex items-center gap-2 text-[13px] text-[#0a211f]/35">
              <Link href="/" className="hover:text-[#0a211f]/60 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#0a211f]/60">Sell Your Boat</span>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
