// app/contact/page.tsx
"use client"

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

const contacts = [
  {
    label: "General enquiries",
    email: "hello@findaly.co",
    description: "Questions about the platform, your account, or anything else.",
  },
  {
    label: "Press &amp; media",
    email: "press@findaly.co",
    description: "Media enquiries, coverage requests, and partnership opportunities.",
  },
  {
    label: "Trust &amp; safety",
    email: "trust@findaly.co",
    description: "Report a listing, account, or message that concerns you.",
  },
  {
    label: "Pro &amp; broker accounts",
    email: "pro@findaly.co",
    description: "Questions about Pro accounts, brokerage listings, and verification.",
  },
]

export default function ContactPage() {
  return (
    <>
      <style>{`
        .contact-page { background-color: #f5f2eb; color: #1a1a1a; }
        .section-label { font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #0a211f; opacity: 0.4; margin-bottom: 0.75rem; display: block; }
        .section-heading { font-size: clamp(28px, 3.5vw, 48px); line-height: 1.1; letter-spacing: -0.02em; color: #0a211f; font-weight: 700; }
        .body-text { font-size: 17px; line-height: 1.8; color: rgba(10,33,31,0.65); }
        .contact-card { padding: 28px; border-radius: 1.25rem; border: 1px solid rgba(10,33,31,0.08); background: rgba(10,33,31,0.02); transition: border-color 0.2s; }
        .contact-card:hover { border-color: rgba(10,33,31,0.18); }
        .divider { border: none; border-top: 1px solid rgba(10,33,31,0.08); margin: 0; }
      `}</style>

      <div className="contact-page min-h-screen">
        <div className="mx-auto max-w-4xl px-6 pt-24 pb-20">

          {/* HEADER */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.span className="section-label" variants={fadeUp}>Contact</motion.span>
            <motion.h1 className="section-heading mt-2 max-w-xl" variants={fadeUp}>
              We&apos;re based in London.<br />We&apos;d love to hear from you.
            </motion.h1>
            <motion.p className="body-text mt-5 max-w-lg" variants={fadeUp}>
              Whether you have a question about a listing, need help with your account, or want to explore a partnership — the right team is just an email away.
            </motion.p>
          </motion.div>

          {/* CONTACT CARDS */}
          <motion.div
            className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {contacts.map((c) => (
              <motion.div key={c.email} className="contact-card" variants={fadeUp}>
                <p
                  className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#0a211f]/40"
                  dangerouslySetInnerHTML={{ __html: c.label }}
                />
                <a
                  href={`mailto:${c.email}`}
                  className="mt-2 block text-[17px] font-semibold text-[#0a211f] hover:opacity-70 transition-opacity"
                >
                  {c.email}
                </a>
                <p className="mt-2 text-[14px] leading-relaxed text-[#0a211f]/50">
                  {c.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <hr className="divider mt-16" />

          {/* OFFICE */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp}>
              <span className="section-label">Office</span>
              <h2 className="text-[26px] font-bold text-[#0a211f] tracking-tight mt-2">London, UK</h2>
              <p className="body-text mt-4">
                Findaly is headquartered in London. Our team works across the UK and remotely across Europe.
              </p>
              <p className="body-text">
                We don&apos;t publish a full street address for walk-in visits — all enquiries are handled by the teams above.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4">
              <div className="rounded-2xl bg-[#0a211f] p-7">
                <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[#fff86c]/60 mb-5">Quick links</p>
                <div className="space-y-3">
                  {[
                    { label: "List your boat", href: "/add-listing" },
                    { label: "Browse yachts for sale", href: "/buy" },
                    { label: "Trust &amp; Safety", href: "/trust" },
                    { label: "About Findaly", href: "/about" },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center justify-between py-2.5 border-b border-white/8 last:border-0 text-[14px] text-white/70 hover:text-white transition-colors"
                      dangerouslySetInnerHTML={undefined}
                    >
                      <span dangerouslySetInnerHTML={{ __html: l.label }} />
                      <span className="text-white/30">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>

        {/* BREADCRUMB */}
        <div className="mx-auto max-w-4xl px-6 pb-12">
          <div className="border-t border-[#0a211f]/8 pt-6">
            <nav className="flex items-center gap-2 text-[13px] text-[#0a211f]/35">
              <Link href="/" className="hover:text-[#0a211f]/60 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#0a211f]/60">Contact</span>
            </nav>
          </div>
        </div>

      </div>
    </>
  )
}