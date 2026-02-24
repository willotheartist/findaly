"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};

export default function LinkedInPage() {
  return (
    <>
      <style>{`
        .pillar-page { background-color: #f5f2eb; color: #1a1a1a; min-height: 100vh; }
        .section-label { font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #0a211f; opacity: 0.4; margin-bottom: 0.75rem; }
        .section-heading { font-size: clamp(28px, 3.4vw, 44px); line-height: 1.12; letter-spacing: -0.02em; color: #0a211f; margin-bottom: 1.25rem; font-weight: 700; }
        .card { padding: 22px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.08); background: rgba(10,33,31,0.02); }
      `}</style>

      <div className="pillar-page">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <motion.p className="section-label" initial="hidden" animate="show" variants={fadeUp}>Social</motion.p>
          <motion.h1 className="section-heading" initial="hidden" animate="show" variants={fadeUp}>LinkedIn</motion.h1>

          <div className="card mt-8">
            <p className="text-[16px] leading-[1.75] text-[#0a211f]/70">
              Placeholder page to keep the footer clean. Switch this to an external LinkedIn URL whenever you’re ready.
            </p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Link href="/brokers" className="underline underline-offset-2 text-[#0a211f]">Brokers</Link>
              <Link href="/careers" className="underline underline-offset-2 text-[#0a211f]">Careers</Link>
            </div>
          </div>

          <div className="mt-14 border-t border-[#0a211f]/10 pt-6 text-[13px] text-[#0a211f]/40">
            <Link href="/" className="hover:text-[#0a211f]/65 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#0a211f]/65">LinkedIn</span>
          </div>
        </div>
      </div>
    </>
  );
}
