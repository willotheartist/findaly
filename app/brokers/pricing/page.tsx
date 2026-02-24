"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};

export default function BrokersPricingPage() {
  return (
    <>
      <style>{`
        .pillar-page { background-color: #f5f2eb; color: #1a1a1a; min-height: 100vh; }
        .section-label { font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #0a211f; opacity: 0.4; margin-bottom: 0.75rem; }
        .section-heading { font-size: clamp(28px, 3.4vw, 44px); line-height: 1.12; letter-spacing: -0.02em; color: #0a211f; margin-bottom: 1.25rem; font-weight: 700; }
        .card { padding: 22px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.08); background: rgba(10,33,31,0.02); }
        .btn-primary { display:inline-flex; height:44px; align-items:center; justify-content:center; border-radius: 14px; background:#fff86c; padding:0 18px; font-size:14px; font-weight:700; color:#0a211f; text-decoration:none; }
        .btn-ghost { display:inline-flex; height:44px; align-items:center; justify-content:center; border-radius: 14px; border:1px solid rgba(10,33,31,0.16); padding:0 18px; font-size:14px; font-weight:600; color:#0a211f; text-decoration:none; background: rgba(10,33,31,0.02); }
        .btn-ghost:hover { background: rgba(10,33,31,0.06); }
      `}</style>

      <div className="pillar-page">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <motion.p className="section-label" initial="hidden" animate="show" variants={fadeUp}>For Brokers</motion.p>
          <motion.h1 className="section-heading" initial="hidden" animate="show" variants={fadeUp}>
            Broker pricing
          </motion.h1>
          <motion.p className="text-[17px] leading-[1.75] text-[#0a211f]/70 max-w-2xl" initial="hidden" animate="show" variants={fadeUp}>
            This is an MVP placeholder so the footer doesn’t look empty. Plug in your real pricing and Stripe logic when ready.
          </motion.p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card">
              <div className="text-[16px] font-semibold text-[#0a211f]">Starter</div>
              <div className="mt-2 text-[14px] text-[#0a211f]/55">For small brokerages.</div>
              <div className="mt-6 flex gap-3 flex-wrap">
                <Link href="/contact" className="btn-primary">Enquire</Link>
                <Link href="/brokers/join" className="btn-ghost">Join</Link>
              </div>
            </div>
            <div className="card">
              <div className="text-[16px] font-semibold text-[#0a211f]">Pro</div>
              <div className="mt-2 text-[14px] text-[#0a211f]/55">For multi-office teams.</div>
              <div className="mt-6 flex gap-3 flex-wrap">
                <Link href="/contact" className="btn-primary">Talk to sales</Link>
                <Link href="/brokers/faq" className="btn-ghost">FAQ</Link>
              </div>
            </div>
          </div>

          <div className="mt-14 border-t border-[#0a211f]/10 pt-6 text-[13px] text-[#0a211f]/40">
            <Link href="/" className="hover:text-[#0a211f]/65 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/brokers" className="hover:text-[#0a211f]/65 transition-colors">Brokers</Link>
            <span className="mx-2">/</span>
            <span className="text-[#0a211f]/65">Pricing</span>
          </div>
        </div>
      </div>
    </>
  );
}
