"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};

export default function ReportPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <style>{`
        .pillar-page { background-color: #f5f2eb; color: #1a1a1a; min-height: 100vh; }
        .section-label { font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #0a211f; opacity: 0.4; margin-bottom: 0.75rem; }
        .section-heading { font-size: clamp(28px, 3.4vw, 44px); line-height: 1.12; letter-spacing: -0.02em; color: #0a211f; margin-bottom: 1.25rem; font-weight: 700; }
        .card { padding: 22px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.08); background: rgba(10,33,31,0.02); }
        .input { width:100%; border:1px solid rgba(10,33,31,0.14); background: rgba(255,255,255,0.55); border-radius: 14px; padding: 12px 14px; outline: none; font-size: 14px; color:#0a211f; }
        .input:focus { border-color: rgba(10,33,31,0.25); background: rgba(255,255,255,0.75); }
        .btn { display:inline-flex; height:44px; align-items:center; justify-content:center; border-radius: 14px; background:#fff86c; padding:0 18px; font-size:14px; font-weight:700; color:#0a211f; border:none; cursor:pointer; }
        .note { font-size: 13px; color: rgba(10,33,31,0.55); line-height: 1.6; }
      `}</style>

      <div className="pillar-page">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <motion.p className="section-label" initial="hidden" animate="show" variants={fadeUp}>Trust & Safety</motion.p>
          <motion.h1 className="section-heading" initial="hidden" animate="show" variants={fadeUp}>Report a listing</motion.h1>
          <motion.p className="text-[17px] leading-[1.75] text-[#0a211f]/70 max-w-2xl" initial="hidden" animate="show" variants={fadeUp}>
            If something feels off — report it. We’ll review quickly and take action if needed.
          </motion.p>

          <div className="card mt-8">
            {sent ? (
              <>
                <p className="text-[16px] font-semibold text-[#0a211f]">Thanks — we’ve received your report.</p>
                <p className="mt-2 note">If you’re in immediate danger or suspect fraud, contact local authorities.</p>
                <div className="mt-6 flex gap-3 flex-wrap">
                  <Link href="/safety" className="underline underline-offset-2 text-[#0a211f]">Safety tips</Link>
                  <Link href="/scams" className="underline underline-offset-2 text-[#0a211f]">Avoid scams</Link>
                </div>
              </>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[13px] font-semibold text-[#0a211f]/70 mb-2">Listing URL (or ID)</label>
                  <input className="input" placeholder="https://www.findaly.co/buy/..." required />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#0a211f]/70 mb-2">What’s the issue?</label>
                  <textarea className="input" rows={5} placeholder="Tell us what you noticed..." required />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button type="submit" className="btn">Submit report</button>
                  <span className="note">This form is an MVP placeholder — wire it to your API when ready.</span>
                </div>
              </form>
            )}
          </div>

          <div className="mt-14 border-t border-[#0a211f]/10 pt-6 text-[13px] text-[#0a211f]/40">
            <Link href="/" className="hover:text-[#0a211f]/65 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#0a211f]/65">Report</span>
          </div>
        </div>
      </div>
    </>
  );
}
