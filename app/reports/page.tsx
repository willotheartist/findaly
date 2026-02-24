"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};

const items = [
  { title: "Market overview", href: "/buy" },
  { title: "Top brands", href: "/brands" },
  { title: "Destinations snapshot", href: "/destinations" },
  { title: "Broker insights", href: "/brokers" },
];

export default function ReportsPage() {
  return (
    <>
      <style>{`
        .pillar-page { background-color: #f5f2eb; color: #1a1a1a; min-height: 100vh; }
        .section-label { font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #0a211f; opacity: 0.4; margin-bottom: 0.75rem; }
        .section-heading { font-size: clamp(28px, 3.4vw, 44px); line-height: 1.12; letter-spacing: -0.02em; color: #0a211f; margin-bottom: 1.25rem; font-weight: 700; }
        .card { padding: 22px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.08); background: rgba(10,33,31,0.02); }
        .link { text-decoration: none; color: #0a211f; }
        .link:hover { text-decoration: underline; text-underline-offset: 3px; }
      `}</style>

      <div className="pillar-page">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <motion.p className="section-label" initial="hidden" animate="show" variants={fadeUp}>
            Reports
          </motion.p>
          <motion.h1 className="section-heading" initial="hidden" animate="show" variants={fadeUp}>
            Market data — made readable.
          </motion.h1>
          <motion.p className="text-[17px] leading-[1.75] text-[#0a211f]/70 max-w-2xl" initial="hidden" animate="show" variants={fadeUp}>
            We’re shipping downloadable market notes and operator briefs. For now, explore the live hubs below.
          </motion.p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {items.map((it) => (
              <div key={it.title} className="card">
                <Link href={it.href} className="link font-semibold">
                  {it.title} →
                </Link>
                <p className="mt-2 text-[14px] text-[#0a211f]/55 leading-relaxed">
                  Jump into the live marketplace pages while reports expand.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-[#0a211f]/10 pt-6 text-[13px] text-[#0a211f]/40">
            <Link href="/" className="hover:text-[#0a211f]/65 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#0a211f]/65">Reports</span>
          </div>
        </div>
      </div>
    </>
  );
}
