"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};

const faqs = [
  { q: "Is Findaly a broker?", a: "No. Findaly is a marketplace. Listings may be posted by brokers, brands, and private sellers." },
  { q: "How do I enquire about a boat?", a: "Open the listing and send an enquiry — you’ll message the seller directly through Findaly." },
  { q: "Can I list my yacht?", a: "Yes. Use the listing wizard to publish a sale or charter listing." },
  { q: "Do you charge fees?", a: "Some paid features exist for brokers and premium listings. See Pricing for details." },
  { q: "How do you keep users safe?", a: "We promote verification, safe payments, and scam prevention guidance across the platform." },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <style>{`
        .pillar-page { background-color: #f5f2eb; color: #1a1a1a; min-height: 100vh; }
        .section-label { font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #0a211f; opacity: 0.4; margin-bottom: 0.75rem; }
        .section-heading { font-size: clamp(28px, 3.4vw, 44px); line-height: 1.12; letter-spacing: -0.02em; color: #0a211f; margin-bottom: 1.25rem; font-weight: 700; }
        .faq-item { border-bottom: 1px solid rgba(10,33,31,0.08); }
        .faq-question { width: 100%; text-align: left; padding: 18px 0; font-size: 16px; font-weight: 600; color: #0a211f; display: flex; justify-content: space-between; align-items: center; background: none; border: none; cursor: pointer; gap: 16px; }
        .faq-answer { font-size: 15px; line-height: 1.7; color: rgba(10,33,31,0.65); padding-bottom: 18px; }
        .btn { display:inline-flex; height:44px; align-items:center; justify-content:center; border-radius: 14px; background:#fff86c; padding:0 18px; font-size:14px; font-weight:700; color:#0a211f; text-decoration:none; }
        .btn2 { display:inline-flex; height:44px; align-items:center; justify-content:center; border-radius: 14px; border:1px solid rgba(10,33,31,0.16); padding:0 18px; font-size:14px; font-weight:600; color:#0a211f; text-decoration:none; background: rgba(10,33,31,0.02); }
        .btn2:hover { background: rgba(10,33,31,0.06); }
      `}</style>

      <div className="pillar-page">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <motion.p className="section-label" initial="hidden" animate="show" variants={fadeUp}>FAQ</motion.p>
          <motion.h1 className="section-heading" initial="hidden" animate="show" variants={fadeUp}>
            Quick answers — so you can move fast.
          </motion.h1>
          <motion.p className="text-[17px] leading-[1.75] text-[#0a211f]/70 max-w-2xl" initial="hidden" animate="show" variants={fadeUp}>
            If you can’t find what you need, message us and we’ll help.
          </motion.p>

          <div className="mt-10 border-t border-[#0a211f]/10">
            {faqs.map((f, i) => (
              <div key={f.q} className="faq-item">
                <button className="faq-question" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                  <span>{f.q}</span>
                  <span className="text-[#0a211f]/30 text-xl shrink-0">{open === i ? "−" : "+"}</span>
                </button>
                {open === i && <p className="faq-answer">{f.a}</p>}
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-3 flex-wrap">
            <Link href="/support" className="btn">Contact support</Link>
            <Link href="/pricing" className="btn2">Pricing</Link>
          </div>

          <div className="mt-14 border-t border-[#0a211f]/10 pt-6 text-[13px] text-[#0a211f]/40">
            <Link href="/" className="hover:text-[#0a211f]/65 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#0a211f]/65">FAQ</span>
          </div>
        </div>
      </div>
    </>
  );
}
