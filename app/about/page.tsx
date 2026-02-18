// app/about/page.tsx
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
    href: "/buy",
    icon: "🛥️",
    title: "Buy",
    body: "Browse thousands of vessels for sale — from jet skis to superyachts. Search by brand, model, location, and price.",
  },
  {
    href: "/sell",
    icon: "🏷️",
    title: "Sell",
    body: "List your boat for free. No commission. Connect directly with serious buyers from around the world.",
  },
  {
    href: "/charter",
    icon: "⚓",
    title: "Charter",
    body: "Find the perfect charter yacht for any destination. Book direct with owners. No agency layers.",
  },
  {
    href: "/finance",
    icon: "💰",
    title: "Finance",
    body: "Understand your marine finance options before you make an offer. Competitive rates, specialist lenders.",
  },
  {
    href: "/brokers",
    icon: "🤝",
    title: "Brokers",
    body: "Work with verified professional brokers. Or list your fleet with a Pro account and reach global buyers.",
  },
  {
    href: "/destinations",
    icon: "🗺️",
    title: "Destinations",
    body: "Editorial guides to the world&apos;s best sailing destinations. Plan your next voyage with confidence.",
  },
]

const trustStats = [
  { value: "2026", label: "Founded" },
  { value: "London", label: "Headquartered" },
  { value: "300+", label: "Vessels listed" },
  { value: "50+", label: "Countries reached" },
]

const pressLogos = [
  { name: "Yachting World" },
  { name: "Boat International" },
  { name: "Motor Boat & Yachting" },
  { name: "The Sunday Times" },
]

export default function AboutPage() {
  return (
    <>
      <style>{`
        .about-page {
          background-color: #f5f2eb;
          color: #1a1a1a;
        }
        .section-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0a211f;
          opacity: 0.4;
          margin-bottom: 0.75rem;
          display: block;
        }
        .section-heading {
          font-size: clamp(28px, 3.5vw, 44px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #0a211f;
          font-weight: 700;
        }
        .body-text {
          font-size: 17px;
          line-height: 1.8;
          color: rgba(10,33,31,0.65);
        }
        .body-text strong {
          color: #0a211f;
          font-weight: 600;
        }
        .stat-card {
          padding: 32px 28px;
          background: rgba(10,33,31,0.04);
          border-radius: 1.25rem;
          border: 1px solid rgba(10,33,31,0.08);
        }
        .pillar-card {
          padding: 28px 24px;
          border-radius: 1.25rem;
          border: 1px solid rgba(10,33,31,0.08);
          background: rgba(10,33,31,0.02);
          text-decoration: none;
          display: block;
          transition: border-color 0.2s, background 0.2s;
        }
        .pillar-card:hover {
          border-color: rgba(10,33,31,0.18);
          background: rgba(10,33,31,0.04);
        }
        .press-card {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1.25rem;
          border: 1px solid rgba(10,33,31,0.08);
          background: rgba(10,33,31,0.02);
          font-size: 14px;
          font-weight: 600;
          color: rgba(10,33,31,0.3);
          letter-spacing: 0.02em;
        }
        .divider {
          border: none;
          border-top: 1px solid rgba(10,33,31,0.08);
          margin: 0;
        }
        .value-row {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding: 20px 0;
          border-bottom: 1px solid rgba(10,33,31,0.06);
        }
        .value-row:last-child { border-bottom: none; }
        .value-dot {
          width: 28px;
          height: 28px;
          background: #fff86c;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: #0a211f;
          flex-shrink: 0;
          margin-top: 2px;
        }
      `}</style>

      <div className="about-page min-h-screen">
        {/* ── HERO ── */}
        <div className="relative h-[60vh] min-h-[460px] w-full overflow-hidden">
          <Image
            src="/sell-hero.jpg"
            alt="Findaly — the maritime marketplace"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/70 via-[#0a211f]/40 to-[#f5f2eb]" />
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
              About Findaly
            </motion.p>
            <motion.h1
              className="text-[clamp(36px,6vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] text-white max-w-3xl"
              variants={fadeUp}
            >
              The everything marketplace{" "}
              <span className="text-[#fff86c]">for the maritime world.</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-[17px] text-white/65 max-w-xl leading-relaxed"
              variants={fadeUp}
            >
              Findaly is a global yacht marketplace connecting buyers, sellers, charter clients, and brokers worldwide.
            </motion.p>
          </motion.div>
        </div>

        <div className="mx-auto max-w-5xl px-6">
          {/* ── TRUST STATS ── */}
          <motion.div
            className="grid grid-cols-2 gap-4 md:grid-cols-4 -mt-2 relative z-10"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {trustStats.map((s) => (
              <motion.div key={s.label} className="stat-card" variants={fadeUp}>
                <div className="text-[22px] font-bold tracking-tight text-[#0a211f]">{s.value}</div>
                <div className="mt-1.5 text-[13px] leading-snug text-[#0a211f]/50">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── SECTION 1: IDENTITY ── */}
          <motion.section
            className="mt-24"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.span className="section-label" variants={fadeUp}>Who we are</motion.span>
            <motion.h2 className="section-heading mt-2 max-w-2xl" variants={fadeUp}>
              One platform for every corner of the maritime world.
            </motion.h2>
            <motion.div className="mt-8 max-w-2xl space-y-5" variants={fadeUp}>
              <p className="body-text">
                Findaly was founded in London in 2026 with a single purpose: to modernise and unify a fragmented maritime industry.{" "}
                <strong>Before Findaly, buying a yacht meant bouncing between a dozen platforms.</strong>{" "}
                Selling one meant paying a broker tens of thousands in commission — or posting to a forum and hoping for the best.
              </p>
              <p className="body-text">
                We built the platform we wished existed. A proper marketplace — transparent, structured, and built for the full spectrum of maritime participants. Private owners sit alongside established brokerages. First-time buyers browse next to serious collectors. Everyone gets access to the same powerful tools.
              </p>
              <p className="body-text">
                Whether you&apos;re buying your first jet ski, hiring a captain for the summer, searching for a used outboard engine, or listing your brokerage&apos;s entire fleet —{" "}
                <strong>Findaly is built for you.</strong>
              </p>
            </motion.div>
          </motion.section>

          <hr className="divider mt-20" />

          {/* ── SECTION 2: MISSION ── */}
          <motion.section
            className="mt-20"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.span className="section-label" variants={fadeUp}>Our mission</motion.span>
            <motion.h2 className="section-heading mt-2 max-w-2xl" variants={fadeUp}>
              Transparent. Modern. Built for the people who love the sea.
            </motion.h2>

            <motion.div className="mt-10 rounded-2xl bg-[#0a211f] p-8 md:p-12" variants={fadeUp}>
              <p className="text-[clamp(20px,2.5vw,28px)] leading-normal text-white/80 font-light">
                &quot;The maritime world deserves a platform that matches its ambition. Not a classified ads board from 2004. Not an opaque brokerage network with hidden fees. A proper marketplace —{" "}
                <span className="text-[#fff86c] font-semibold">open, global, and built to last.</span>
                &quot;
              </p>
              <p className="mt-6 text-[13px] font-semibold tracking-[0.15em] uppercase text-white/30">
                — Findaly, London, 2026
              </p>
            </motion.div>

            <motion.div className="mt-10 rounded-2xl border border-[#0a211f]/8 overflow-hidden" variants={fadeUp}>
              {[
                { title: "Transparent pricing", body: "No hidden fees. No surprise commissions. Private sellers list for free and keep 100% of their sale price." },
                { title: "Modern infrastructure", body: "Built on modern technology from day one — fast search, real-time messaging, and a listing experience that actually works on mobile." },
                { title: "Broker-enabled", body: "Professional brokers are core to the maritime world. Findaly gives them Pro tools — verified badges, priority placement, analytics — without locking out private sellers." },
                { title: "Finance-connected", body: "Most yacht purchases involve finance. Findaly ensures buyers understand their options before they make an offer." },
                { title: "Globally minded", body: "Maritime is inherently international. Findaly is built for cross-border discovery — a buyer in Sydney can find a vessel listed in Marseille in seconds." },
              ].map((v) => (
                <div key={v.title} className="value-row px-6">
                  <div className="value-dot">✓</div>
                  <div>
                    <h3 className="font-semibold text-[15px] text-[#0a211f]">{v.title}</h3>
                    <p className="text-[14px] leading-relaxed text-[#0a211f]/55 mt-0.5">{v.body}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.section>

          <hr className="divider mt-20" />

          {/* ── SECTION 3: HOW IT WORKS ── */}
          <motion.section
            className="mt-20"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.span className="section-label" variants={fadeUp}>What we offer</motion.span>
            <motion.h2 className="section-heading mt-2 max-w-xl" variants={fadeUp}>
              Six pillars. One platform.
            </motion.h2>
            <motion.p className="body-text mt-4 max-w-xl" variants={fadeUp}>
              Findaly brings together every part of the maritime world that was previously scattered across dozens of platforms.
            </motion.p>

            <motion.div
              className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={stagger}
            >
              {pillars.map((p) => (
                <motion.div key={p.title} variants={fadeUp}>
                  <Link href={p.href} className="pillar-card">
                    <span className="text-2xl">{p.icon}</span>
                    <h3 className="mt-3 font-bold text-[17px] text-[#0a211f]">{p.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-[#0a211f]/55">{p.body}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <hr className="divider mt-20" />

          {/* ── SECTION 4: TRUST SIGNALS ── */}
          <motion.section
            className="mt-20"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.span className="section-label" variants={fadeUp}>By the numbers</motion.span>
            <motion.h2 className="section-heading mt-2 max-w-xl" variants={fadeUp}>
              A marketplace built on trust and growing fast.
            </motion.h2>

            <motion.div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6" variants={fadeUp}>
              <div className="rounded-2xl bg-[#0a211f] p-8">
                <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[#fff86c]/60 mb-6">Platform</p>
                <div className="space-y-5">
                  {[
                    { label: "Vessels listed", value: "300+" },
                    { label: "Countries reached", value: "50+" },
                    { label: "Founded", value: "2026" },
                    { label: "Headquartered", value: "London, UK" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center border-b border-white/8 pb-5 last:border-0 last:pb-0">
                      <span className="text-[14px] text-white/50">{item.label}</span>
                      <span className="text-[15px] font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#0a211f]/8 p-8">
                <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[#0a211f]/40 mb-6">For sellers</p>
                <div className="space-y-5">
                  {[
                    { label: "Commission charged", value: "0%" },
                    { label: "Cost to list", value: "Free" },
                    { label: "Photos per listing", value: "Up to 50" },
                    { label: "Time to go live", value: "Under 10 min" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center border-b border-[#0a211f]/6 pb-5 last:border-0 last:pb-0">
                      <span className="text-[14px] text-[#0a211f]/50">{item.label}</span>
                      <span className="text-[15px] font-semibold text-[#0a211f]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.section>

          <hr className="divider mt-20" />

          {/* ── SECTION 5: PRESS ── */}
          <motion.section
            className="mt-20"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.span className="section-label" variants={fadeUp}>Press & media</motion.span>
            <motion.h2 className="section-heading mt-2 max-w-xl" variants={fadeUp}>
              Coverage coming soon.
            </motion.h2>
            <motion.p className="body-text mt-4 max-w-xl" variants={fadeUp}>
              Findaly launched in 2026 and is actively growing its presence across maritime and yachting media. Press enquiries are welcome.
            </motion.p>

            <motion.div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3" variants={fadeUp}>
              {pressLogos.map((p) => (
                <div key={p.name} className="press-card">
                  {p.name}
                </div>
              ))}
            </motion.div>

            <motion.div className="mt-6" variants={fadeUp}>
              <a
                href="mailto:press@findaly.co"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#0a211f]/15 px-5 text-[14px] font-medium text-[#0a211f]/70 hover:border-[#0a211f]/30 hover:text-[#0a211f] transition-colors"
              >
                press@findaly.co →
              </a>
            </motion.div>
          </motion.section>

          {/* ── CLOSING CTA ── */}
          <motion.div
            className="mt-20 mb-20 rounded-2xl bg-[#0a211f] p-10 md:p-14 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#fff86c]/70 mb-4">
              Join Findaly
            </p>
            <h3 className="text-[clamp(26px,3.5vw,40px)] font-bold leading-[1.1] text-white tracking-tight">
              The maritime world{" "}
              <span className="text-[#fff86c]">starts here.</span>
            </h3>
            <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
              Browse vessels, list your boat for free, or explore the world&apos;s best sailing destinations.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/buy"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
              >
                Browse Yachts
              </Link>
              <Link
                href="/add-listing"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
              >
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
              <span className="text-[#0a211f]/60">About</span>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
