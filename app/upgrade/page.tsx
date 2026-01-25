"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

type PlanId = "free" | "pro" | "premium";

type Plan = {
  id: PlanId;
  name: string;
  priceMonthly: string;
  sub: string;
  accent: string;
  cta: string;
  footnote?: string;
  features: { title: string; desc: string }[];
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: "€0",
    sub: "Public profile + basic presence",
    accent: "#0ea5e9",
    cta: "Start free",
    features: [
      { title: "Public profile", desc: "Show name, location, and contact." },
      { title: "Basic portfolio", desc: "Link to listings or work." },
      { title: "Standard placement", desc: "Visible in search results." },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: "€39",
    sub: "For active brokers and pros",
    accent: "#ff6a00",
    cta: "Upgrade to Pro",
    features: [
      { title: "Verified badge", desc: "Boost trust instantly." },
      { title: "Higher ranking", desc: "More exposure in discovery." },
      { title: "Lead capture", desc: "Simple inquiry form on profile." },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    priceMonthly: "€99",
    sub: "For top firms that want maximum visibility",
    accent: "#8b5cf6",
    cta: "Go Premium",
    footnote: "Includes priority support.",
    features: [
      { title: "Featured placement", desc: "Top slots in relevant categories." },
      { title: "Rich media gallery", desc: "More images, more impact." },
      { title: "Team members", desc: "Add multiple agents to one profile." },
    ],
  },
];

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

export default function UpgradePage() {
  const [selected, setSelected] = useState<PlanId>("pro");

  const selPlan = PLANS.find((p) => p.id === selected) ?? PLANS[1];

  return (
    <main className="w-full bg-white">
      {/* Header */}
      <section className="relative w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-orange-50/30">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full opacity-25 blur-3xl"
            style={{ backgroundColor: selPlan.accent }}
          />
          <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-3xl" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="upgrade-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#upgrade-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-4 text-sm text-slate-600">
            <Link href="/" className="no-underline hover:text-slate-900">
              Home
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-semibold text-slate-900">Upgrade</span>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70">
              <Shield className="h-3.5 w-3.5 text-slate-500" />
              Plans
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Choose a plan
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Upgrade your profile for better trust and visibility.
            </p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="grid gap-5 lg:grid-cols-3">
            {PLANS.map((p) => {
              const isActive = p.id === selected;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.id)}
                  className={cx(
                    "text-left overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-all",
                    "hover:border-slate-300 hover:shadow-md",
                    isActive ? "border-slate-300 ring-2 ring-slate-900/5" : "border-slate-200/80"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-bold text-slate-900">{p.name}</div>
                      <div className="mt-1 text-sm text-slate-600">{p.sub}</div>
                    </div>
                    {p.id !== "free" ? (
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200/80">
                        <Sparkles className="h-5 w-5" style={{ color: p.accent }} />
                      </div>
                    ) : (
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200/80">
                        <Zap className="h-5 w-5 text-slate-400" />
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div className="text-3xl font-bold tracking-tight text-slate-900">
                      {p.priceMonthly}
                      <span className="ml-1 text-sm font-semibold text-slate-500">/mo</span>
                    </div>
                    {isActive ? (
                      <BadgeCheck className="h-6 w-6" style={{ color: p.accent }} />
                    ) : null}
                  </div>

                  <div className="mt-6 grid gap-3">
                    {p.features.map((f) => (
                      <div key={f.title} className="rounded-2xl border border-slate-200/80 bg-white p-4">
                        <div className="text-sm font-semibold text-slate-900">{f.title}</div>
                        <div className="mt-1 text-sm text-slate-600">{f.desc}</div>
                      </div>
                    ))}
                  </div>

                  {p.footnote ? (
                    <div className="mt-4 text-sm text-slate-600">{p.footnote}</div>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Checkout card */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div className="p-6 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-lg font-bold text-slate-900">
                    Selected: {selPlan.name}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {selPlan.priceMonthly}/mo
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Checkout wiring next")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                  style={{ backgroundColor: selPlan.accent }}
                >
                  <CreditCard className="h-4 w-4" />
                  {selPlan.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 p-6 sm:p-7">
              <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <span>Need to edit your profile first?</span>
                <Link
                  href="/settings"
                  className="font-semibold text-slate-900 no-underline hover:text-slate-900"
                >
                  Go to settings <ArrowRight className="inline h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-slate-600">
            <Link href="/contact" className="font-semibold text-slate-900 no-underline hover:text-[#ff6a00]">
              Contact support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
