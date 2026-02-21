// app/support/SupportClient.tsx
"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { LifeBuoy, ChevronDown, Mail, Shield, FileText } from "lucide-react"

export default function SupportClient() {
  const [open, setOpen] = useState<number | null>(0)

  const faqs = useMemo(
    () => [
      {
        q: "How do I contact a seller or broker?",
        a: "Open any listing and use the contact panel. Your message appears in /messages so you can keep negotiations organised.",
      },
      {
        q: "How do saved searches work?",
        a: "Saved searches are your filters (brand/model/year/budget/etc). They power alerts and let you monitor the market without browsing daily.",
      },
      {
        q: "Can Findaly help with finance?",
        a: "Yes — Findaly links you to finance guidance and helps you structure the buying process cleanly. Visit /finance for the starting point.",
      },
      {
        q: "Why do I need a survey and sea trial?",
        a: "Because the expensive truths show up under load. Survey + sea trial is how you protect downside risk and negotiate with confidence.",
      },
      {
        q: "How do I list my yacht?",
        a: "Use /add-listing. If you’re a broker or professional seller, you can manage multiple listings in /my-listings.",
      },
      {
        q: "Is Findaly global?",
        a: "Yes. Inventory and guides are built to support international buyers — cross-border transactions, paperwork, and broker workflows.",
      },
      {
        q: "I’m seeing a 404 or something feels broken — what should I do?",
        a: "Send the URL and a quick description. If it’s account-related, include the email on your account (or the username) so we can locate your session quickly.",
      },
      {
        q: "Do you verify brokers or listings?",
        a: "Verification is being expanded. For now, treat Findaly as a discovery layer and always confirm ownership, paperwork, and condition via professional checks.",
      },
    ],
    []
  )

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#0a211f]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-[#0a211f]/10 bg-white p-7 sm:p-10">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#0a211f]/45">
            Help & Support
          </p>
          <h1 className="mt-3 text-[clamp(26px,4vw,44px)] font-bold leading-[1.08] tracking-[-0.02em]">
            Get unstuck. Buy smart. Keep the process clean.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#0a211f]/60">
            Findaly is built for serious browsing + confident buying. If you’re stuck, we’ll get you moving quickly.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#0a211f]/10 bg-[#0a211f]/3 p-5">
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-4 w-4 text-[#0a211f]/45" />
                <div className="text-[14px] font-semibold">Support topics</div>
              </div>
              <p className="mt-2 text-[13px] text-[#0a211f]/60 leading-relaxed">
                Buying, selling, accounts, saved searches, alerts, messages, safety and process.
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/guides"
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-[#0a211f] text-[13px] font-semibold text-[#fff86c]"
                >
                  Guides →
                </Link>
                <Link
                  href="/buy"
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[#0a211f]/12 bg-white text-[13px] font-medium hover:bg-[#0a211f]/5"
                >
                  Browse →
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-[#0a211f]/10 bg-[#0a211f]/3 p-5">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#0a211f]/45" />
                <div className="text-[14px] font-semibold">Contact</div>
              </div>
              <p className="mt-2 text-[13px] text-[#0a211f]/60 leading-relaxed">
                Use the contact page for structured inquiries, or message us with a link and context.
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/contact"
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-[#0a211f] text-[13px] font-semibold text-[#fff86c]"
                >
                  Contact →
                </Link>
                <Link
                  href="/messages"
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[#0a211f]/12 bg-white text-[13px] font-medium hover:bg-[#0a211f]/5"
                >
                  Inbox →
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-[#0a211f]/10 bg-[#0a211f]/3 p-5">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#0a211f]/45" />
                <div className="text-[14px] font-semibold">Safety</div>
              </div>
              <p className="mt-2 text-[13px] text-[#0a211f]/60 leading-relaxed">
                Survey + sea trial, paperwork checks, and broker-led transactions reduce risk.
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/trust"
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-[#0a211f] text-[13px] font-semibold text-[#fff86c]"
                >
                  Trust →
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[#0a211f]/12 bg-white text-[13px] font-medium hover:bg-[#0a211f]/5"
                >
                  Terms →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 rounded-3xl border border-[#0a211f]/10 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0a211f]/40" />
            <h2 className="text-[16px] font-semibold">FAQ</h2>
          </div>

          <div className="mt-4 border-t border-[#0a211f]/8">
            {faqs.map((f, i) => {
              const isOpen = open === i
              return (
                <div key={i} className="border-b border-[#0a211f]/8 py-1">
                  <button
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-[14.5px] font-medium">{f.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#0a211f]/35 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen ? (
                    <div className="pb-4 text-[13.5px] leading-relaxed text-[#0a211f]/60">
                      {f.a}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div className="mt-8 rounded-2xl bg-[#0a211f] p-6 text-center">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#fff86c]/70">
              Still stuck?
            </p>
            <h3 className="mt-3 text-[22px] font-bold text-white tracking-tight">
              Send us the link and what you expected to happen.
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-white/60">
              If it’s a bug, include the URL + a short description. If it’s a workflow question, tell us if you’re buying,
              selling, or browsing — we’ll point you to the clean next step.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-sm font-semibold text-[#0a211f]"
              >
                Contact Findaly
              </Link>
              <Link
                href="/guides"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/85 hover:bg-white/5"
              >
                Read guides →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 text-[12px] text-[#0a211f]/45">
          Next (if you want): add a proper support taxonomy (/support/buying, /support/selling, etc.) with article-style pages.
        </div>
      </div>
    </div>
  )
}