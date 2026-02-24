"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

export default function BrokersJoinPage() {
  return (
    <>
      <style>{`
        .pillar-page { background-color: #f5f2eb; color: #1a1a1a; min-height: 100vh; }
        .card { padding: 22px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.08); background: rgba(10,33,31,0.02); }
        .btn-primary { display:inline-flex; height:44px; align-items:center; justify-content:center; border-radius: 14px; background:#fff86c; padding:0 18px; font-size:14px; font-weight:700; color:#0a211f; text-decoration:none; }
        .btn-ghost { display:inline-flex; height:44px; align-items:center; justify-content:center; border-radius: 14px; border:1px solid rgba(10,33,31,0.16); padding:0 18px; font-size:14px; font-weight:600; color:#0a211f; text-decoration:none; background: rgba(10,33,31,0.02); }
        .btn-ghost:hover { background: rgba(10,33,31,0.06); }
      `}</style>

      <div className="pillar-page">
        <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
          <Image src="/brokers-hero.jpg" alt="Join Findaly as a broker" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/65 via-[#0a211f]/30 to-[#f5f2eb]" />
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" variants={stagger} initial="hidden" animate="show">
            <motion.p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#fff86c] mb-4" variants={fadeUp}>
              For Brokers
            </motion.p>
            <motion.h1 className="text-[clamp(34px,5vw,60px)] font-bold leading-[1.05] tracking-[-0.03em] text-white max-w-3xl" variants={fadeUp}>
              List faster. Close smarter. <span className="text-[#fff86c]">Win more clients.</span>
            </motion.h1>
            <motion.p className="mt-6 text-[17px] text-white/70 max-w-xl leading-relaxed" variants={fadeUp}>
              Join Findaly to showcase inventory, capture enquiries, and build trust with verification.
            </motion.p>
            <motion.div className="mt-8 flex gap-3 flex-wrap justify-center" variants={fadeUp}>
              <Link href="/brokers/pricing" className="btn-primary">See pricing</Link>
              <Link href="/contact" className="btn-ghost" style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", background: "transparent" }}>
                Talk to us
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Premium listing presentation", d: "High-intent traffic + clean UX that converts." },
              { t: "Direct enquiries", d: "Messages go straight to your team." },
              { t: "Trust signals", d: "Verification, safety content, and transparent details." },
            ].map((x) => (
              <div key={x.t} className="card">
                <div className="text-[16px] font-semibold text-[#0a211f]">{x.t}</div>
                <div className="mt-2 text-[14px] leading-relaxed text-[#0a211f]/55">{x.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-3 flex-wrap">
            <Link href="/brokers/pricing" className="btn-primary">Pricing</Link>
            <Link href="/brokers/faq" className="btn-ghost">Broker FAQ</Link>
            <Link href="/brokers" className="btn-ghost">Back to brokers</Link>
          </div>

          <div className="mt-14 border-t border-[#0a211f]/10 pt-6 text-[13px] text-[#0a211f]/40">
            <Link href="/" className="hover:text-[#0a211f]/65 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/brokers" className="hover:text-[#0a211f]/65 transition-colors">Brokers</Link>
            <span className="mx-2">/</span>
            <span className="text-[#0a211f]/65">Join</span>
          </div>
        </div>
      </div>
    </>
  );
}
