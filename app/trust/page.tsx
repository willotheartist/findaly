// app/trust/page.tsx
"use client"

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
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
}

const pillars = [
  {
    icon: "✓",
    title: "Broker verification",
    body: "Every Pro broker on Findaly completes an identity and business verification process. Verified accounts display a badge across all their listings and their profile — so buyers know exactly who they&apos;re dealing with.",
    detail: [
      "Identity verified against business registration",
      "Verified badge displayed on all listings",
      "Manual review by the Findaly team",
      "Ongoing compliance checks",
    ],
  },
  {
    icon: "◎",
    title: "Listing moderation",
    body: "Every listing on Findaly is reviewed before going live. We check for accuracy, completeness, and compliance with our marketplace standards. Listings that don&apos;t meet our quality bar are returned to the seller for improvement.",
    detail: [
      "All listings reviewed before going live",
      "Minimum photo and description requirements",
      "Flagging system for buyers to report issues",
      "Rapid response to reported listings",
    ],
  },
  {
    icon: "✉",
    title: "Secure messaging",
    body: "All communication between buyers, sellers, and brokers happens through Findaly&apos;s built-in messaging system. We never share your personal contact details without your consent.",
    detail: [
      "All messages stay within the platform",
      "No personal details shared without consent",
      "Message history preserved for reference",
      "Report and block tools available to all users",
    ],
  },
  {
    icon: "€",
    title: "Finance transparency",
    body: "Findaly provides clear, honest information about marine finance options. We don&apos;t accept payments from lenders to promote their products, and we always remind users that our finance content is informational — not financial advice.",
    detail: [
      "No paid lender promotions",
      "Clear informational disclaimers",
      "Independent guidance on finance types",
      "Links to regulated financial advisers",
    ],
  },
]

export default function TrustPage() {
  return (
    <>
      <style>{`
        .trust-page { background-color: #f5f2eb; color: #1a1a1a; }
        .section-label { font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #0a211f; opacity: 0.4; margin-bottom: 0.75rem; display: block; }
        .section-heading { font-size: clamp(28px, 3.5vw, 44px); line-height: 1.1; letter-spacing: -0.02em; color: #0a211f; font-weight: 700; }
        .body-text { font-size: 17px; line-height: 1.8; color: rgba(10,33,31,0.65); }
        .body-text strong { color: #0a211f; font-weight: 600; }
        .pillar-icon { width: 44px; height: 44px; background: #fff86c; color: #0a211f; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; flex-shrink: 0; }
        .detail-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: rgba(10,33,31,0.6); padding: 8px 0; border-bottom: 1px solid rgba(10,33,31,0.06); }
        .detail-item:last-child { border-bottom: none; }
        .detail-dot { width: 6px; height: 6px; background: #fff86c; border-radius: 50%; flex-shrink: 0; }
        .divider { border: none; border-top: 1px solid rgba(10,33,31,0.08); margin: 0; }
      `}</style>

      <div className="trust-page min-h-screen">

        {/* HERO */}
        <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
          <Image src="/brokers-hero.jpg" alt="Trust and safety on Findaly" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/70 via-[#0a211f]/40 to-[#f5f2eb]" />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#fff86c] mb-4" variants={fadeUp}>
              Trust &amp; Safety
            </motion.p>
            <motion.h1
              className="text-[clamp(36px,6vw,68px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-3xl"
              variants={fadeUp}
            >
              Built for trust,{" "}
              <span className="text-[#fff86c]">from the ground up.</span>
            </motion.h1>
            <motion.p className="mt-6 text-[17px] text-white/65 max-w-xl leading-relaxed" variants={fadeUp}>
              Every transaction on Findaly is backed by verification, moderation, and transparency. Here&apos;s exactly how we keep the platform safe.
            </motion.p>
          </motion.div>
        </div>

        <div className="mx-auto max-w-5xl px-6">

          {/* INTRO */}
          <motion.section
            className="mt-20 max-w-2xl"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.span className="section-label" variants={fadeUp}>Our commitment</motion.span>
            <motion.h2 className="section-heading mt-2" variants={fadeUp}>
              A marketplace you can rely on.
            </motion.h2>
            <motion.p className="body-text mt-6" variants={fadeUp}>
              Buying or selling a yacht is one of the most significant transactions most people will ever make. <strong>Trust is not a feature — it&apos;s the foundation.</strong> Findaly is built around four core commitments: verified identities, moderated listings, secure communications, and financial transparency.
            </motion.p>
          </motion.section>

          <hr className="divider mt-16" />

          {/* TRUST PILLARS */}
          <motion.section
            className="mt-16 space-y-12"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-start"
                variants={fadeUp}
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="pillar-icon">{p.icon}</div>
                    <h2 className="text-[22px] font-bold text-[#0a211f] tracking-tight">{p.title}</h2>
                  </div>
                  <p
                    className="body-text"
                    dangerouslySetInnerHTML={{ __html: p.body }}
                  />
                </div>
                <div className="rounded-2xl border border-[#0a211f]/8 bg-[#0a211f]/2 px-6 py-4">
                  {p.detail.map((d) => (
                    <div key={d} className="detail-item">
                      <span className="detail-dot" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
                {i < pillars.length - 1 && <hr className="divider lg:col-span-2" />}
              </motion.div>
            ))}
          </motion.section>

          <hr className="divider mt-16" />

          {/* REPORT SECTION */}
          <motion.section
            className="mt-16"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.span className="section-label" variants={fadeUp}>Report a concern</motion.span>
            <motion.h2 className="section-heading mt-2 max-w-xl" variants={fadeUp}>
              See something wrong? Tell us.
            </motion.h2>
            <motion.p className="body-text mt-4 max-w-xl" variants={fadeUp}>
              If you encounter a listing, message, or account that seems suspicious, inaccurate, or in breach of our standards — please report it. Our team reviews every report and responds within 24 hours.
            </motion.p>
            <motion.div className="mt-6" variants={fadeUp}>
              <a
                href="mailto:trust@findaly.co"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0a211f] px-6 text-[14px] font-semibold text-[#fff86c]"
              >
                trust@findaly.co →
              </a>
            </motion.div>
          </motion.section>

          {/* CLOSING CTA */}
          <motion.div
            className="mt-20 mb-20 rounded-2xl bg-[#0a211f] p-10 md:p-14 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#fff86c]/70 mb-4">
              Ready to get started?
            </p>
            <h3 className="text-[clamp(26px,3.5vw,40px)] font-bold leading-[1.1] text-white tracking-tight">
              Buy and sell with{" "}
              <span className="text-[#fff86c]">confidence.</span>
            </h3>
            <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
              Thousands of buyers and sellers trust Findaly to connect them with the right vessel, the right broker, and the right deal.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <Link href="/buy" className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]">
                Browse Yachts
              </Link>
              <Link href="/add-listing" className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors">
                List Your Boat
              </Link>
            </div>
          </motion.div>

        </div>

        {/* BREADCRUMB */}
        <div className="mx-auto max-w-5xl px-6 pb-12">
          <div className="border-t border-[#0a211f]/8 pt-6">
            <nav className="flex items-center gap-2 text-[13px] text-[#0a211f]/35">
              <Link href="/" className="hover:text-[#0a211f]/60 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#0a211f]/60">Trust &amp; Safety</span>
            </nav>
          </div>
        </div>

      </div>
    </>
  )
}