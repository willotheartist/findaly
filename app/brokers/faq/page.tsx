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
  { q: "How do enquiries work?", a: "Buyers contact you directly through Findaly messages. You respond and close off-platform as needed." },
  { q: "Can we upload inventory in bulk?", a: "Yes — we support structured ingestion and media mapping. (MVP placeholder copy.)" },
  { q: "Do you support multiple agents?", a: "Yes — broker teams can have multiple accounts and listing owners." },
  { q: "What’s required for verification?", a: "We’ll ask for brokerage details and basic validation to improve buyer trust." },
];

export default function BrokersFaqPage() {
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
        .btn-primary { display:inline-flex; height:44px; align-items:center; justify-content:center; border-radius: 14px; background:#fff86c; padding:0 18px; font-size:14px; font-weight:700; color:#0a211f; text-decoration:none; }
        .btn-ghost { display:inline-flex; height:44px; align-items:center; justify-content:center; border-radius: 14px; border:1px solid rgba(10,33,31,0.16); padding:0 18px; font-size:14px; font-weight:600; color:#0a211f; text-decoration:none; background: rgba(10,33,31,0.02); }
        .btn-ghost:hover { background: rgba(10,33,31,0.06); }
      `}</style>

      <div className="pillar-page">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <motion.p className="section-label" initial="hidden" animate="show" variants={fadeUp}>For Brokers</motion.p>
          <motion.h1 className="section-heading" initial="hidden" animate="show" variants={fadeUp}>Broker FAQ</motion.h1>

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
            <Link href="/brokers/join" className="btn-primary">Join</Link>
            <Link href="/brokers/pricing" className="btn-ghost">Pricing</Link>
            <Link href="/brokers" className="btn-ghost">Back</Link>
          </div>

          <div className="mt-14 border-t border-[#0a211f]/10 pt-6 text-[13px] text-[#0a211f]/40">
            <Link href="/" className="hover:text-[#0a211f]/65 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/brokers" className="hover:text-[#0a211f]/65 transition-colors">Brokers</Link>
            <span className="mx-2">/</span>
            <span className="text-[#0a211f]/65">FAQ</span>
          </div>
        </div>
      </div>
    </>
  );
}
