"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const categories = [
  { title: "Electronics & Navigation", desc: "Plotters, radar, AIS, instruments." },
  { title: "Safety & Deck Gear", desc: "Life rafts, EPIRBs, winches, anchors." },
  { title: "Engines & Mechanical", desc: "Parts, servicing, upgrades." },
  { title: "Interior & Comfort", desc: "Cabin upgrades, galley, climate." },
  { title: "Sails & Rigging", desc: "Standing and running rigging, sails." },
  { title: "Tenders & Toys", desc: "Tenders, seabobs, boards, inflatables." },
];

export default function PartsPage() {
  return (
    <>
      <style>{`
        .pillar-page { background-color: #f5f2eb; color: #1a1a1a; }
        .article-body p { font-size: 17px; line-height: 1.75; color: rgba(10,33,31,0.7); margin-bottom: 1.25rem; }
        .section-label { font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #0a211f; opacity: 0.4; margin-bottom: 0.75rem; }
        .section-heading { font-size: clamp(28px, 3.4vw, 44px); line-height: 1.12; letter-spacing: -0.02em; color: #0a211f; margin-bottom: 1.25rem; font-weight: 700; }
        .card { padding: 22px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.08); background: rgba(10,33,31,0.02); }
        .btn-primary { display:inline-flex; height:44px; align-items:center; justify-content:center; border-radius: 14px; background:#fff86c; padding:0 18px; font-size:14px; font-weight:700; color:#0a211f; text-decoration:none; }
        .btn-ghost { display:inline-flex; height:44px; align-items:center; justify-content:center; border-radius: 14px; border:1px solid rgba(10,33,31,0.16); padding:0 18px; font-size:14px; font-weight:600; color:#0a211f; text-decoration:none; background: rgba(10,33,31,0.02); }
        .btn-ghost:hover { background: rgba(10,33,31,0.06); }
      `}</style>

      <div className="pillar-page min-h-screen">
        <div className="relative h-[52vh] min-h-[420px] w-full overflow-hidden">
          <Image src="/hero-buy.jpg" alt="Yacht parts & equipment" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/65 via-[#0a211f]/30 to-[#f5f2eb]" />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#fff86c] mb-4" variants={fadeUp}>
              Parts & Equipment
            </motion.p>
            <motion.h1 className="text-[clamp(34px,5.4vw,62px)] font-bold leading-[1.05] tracking-[-0.03em] text-white max-w-3xl" variants={fadeUp}>
              Everything your yacht needs — <span className="text-[#fff86c]">in one place.</span>
            </motion.h1>
            <motion.p className="mt-6 text-[17px] text-white/70 max-w-xl leading-relaxed" variants={fadeUp}>
              Find trusted suppliers, essentials, upgrades, and the gear that keeps you safe at sea.
            </motion.p>
            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link href="/services" className="btn-primary">Browse Services</Link>
              <Link href="/contact" className="btn-ghost">Partner with Findaly</Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="section-label">Popular categories</p>
          <h2 className="section-heading">Explore parts and equipment.</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {categories.map((c) => (
              <div key={c.title} className="card">
                <div className="text-[16px] font-semibold text-[#0a211f]">{c.title}</div>
                <div className="mt-2 text-[14px] leading-relaxed text-[#0a211f]/55">{c.desc}</div>
                <div className="mt-5 flex gap-2">
                  <Link href="/contact" className="btn-ghost" style={{ height: 40 }}>Enquire</Link>
                  <Link href="/services" className="btn-primary" style={{ height: 40 }}>Find pros</Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl bg-[#0a211f] p-10 md:p-12 text-center">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#fff86c]/70 mb-4">
              Coming next
            </p>
            <h3 className="text-[clamp(24px,3vw,36px)] font-bold leading-[1.1] text-white tracking-tight">
              A curated marketplace for marine suppliers.
            </h3>
            <p className="mx-auto mt-4 max-w-md text-[15px] text-white/50 leading-relaxed">
              We’re building a supplier directory + request flow. If you sell marine gear, let’s talk.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <Link href="/contact" className="btn-primary">Get in touch</Link>
              <Link href="/buy" className="btn-ghost" style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", background: "transparent" }}>
                Browse yachts
              </Link>
            </div>
          </div>

          <div className="mt-14 border-t border-[#0a211f]/10 pt-6 text-[13px] text-[#0a211f]/40">
            <Link href="/" className="hover:text-[#0a211f]/65 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#0a211f]/65">Parts & Equipment</span>
          </div>
        </div>
      </div>
    </>
  );
}
