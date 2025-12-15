// app/page.tsx
import Link from "next/link";
import { ArrowUpRight, Boxes, Layers, Search, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      {/* roomy top glow (Linear-ish) */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[760px] bg-[radial-gradient(1000px_380px_at_50%_0%,rgba(255,255,255,0.10),rgba(0,0,0,0))]" />

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-24 md:pt-28">
        {/* HERO */}
        <section className="text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <Zap size={14} className="opacity-80" />
            Findaly — software tools directory
          </p>

          <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Find the right tool.
            <br />
            Compare in minutes.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
            A clean, professional directory for software buyers: pricing model, key features,
            integrations, and ranked alternatives — built for fast decisions.
          </p>

          {/* Search-style bar (roomier, no white-on-white) */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-3">
                <Search size={18} className="text-white/45" />
                <span className="text-sm text-white/45">Search tools, categories, features…</span>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/tools"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-[rgba(255,255,255,0.08)] px-5 py-3 text-sm font-medium text-white transition hover:border-white/25 hover:bg-[rgba(255,255,255,0.10)] md:flex-none"
                >
                  Browse tools <ArrowUpRight size={16} className="opacity-70" />
                </Link>

                <Link
                  href="/compare"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-transparent px-5 py-3 text-sm font-medium text-white/85 transition hover:border-white/25 hover:text-white md:flex-none"
                >
                  Compare <Boxes size={16} className="opacity-80" />
                </Link>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 px-1 text-xs text-white/55">
              <span className="text-white/55">Popular:</span>
              <Link
                href="/tools/category/ai"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70 transition hover:border-white/20 hover:text-white"
              >
                AI
              </Link>
              <Link
                href="/tools/category/crm"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70 transition hover:border-white/20 hover:text-white"
              >
                CRM
              </Link>
              <Link
                href="/tools/category/analytics"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70 transition hover:border-white/20 hover:text-white"
              >
                Analytics
              </Link>
              <Link
                href="/tools/category/automation"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70 transition hover:border-white/20 hover:text-white"
              >
                Automation
              </Link>
            </div>
          </div>

          {/* Mini highlights row (more breathing room) */}
          <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3 md:gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                <Sparkles size={16} className="text-white/70" />
                Ranked alternatives
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Alternatives are selected for decision flows — not random “related tools”.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                <Boxes size={16} className="text-white/70" />
                Clean compare pages
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Jump from a tool to “X vs Y” with consistent structure and fast scanning.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                <Layers size={16} className="text-white/70" />
                Category navigation
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Browse by category, pricing model, and use case — with clean URLs.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: How it works (spaced like Linear) */}
        <section className="mt-28 md:mt-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              How Findaly works
            </p>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white md:text-4xl">
              Built for speed, clarity, and trust.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
              Every page is designed for decision-making: clear sections, consistent layout, and a
              minimal UI that doesn’t distract.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <p className="text-sm font-semibold text-white/90">1) Find</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Search and filter tools by category and pricing model.
              </p>
              <div className="mt-6">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/80 underline underline-offset-4 transition hover:text-white"
                >
                  Browse tools <ArrowUpRight size={16} className="opacity-70" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <p className="text-sm font-semibold text-white/90">2) Understand</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Pricing model, key features, integrations, and quick facts — in a predictable format.
              </p>
              <div className="mt-6">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/80 underline underline-offset-4 transition hover:text-white"
                >
                  View an example <ArrowUpRight size={16} className="opacity-70" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <p className="text-sm font-semibold text-white/90">3) Decide</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Use ranked alternatives and comparisons to choose confidently.
              </p>
              <div className="mt-6">
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/80 underline underline-offset-4 transition hover:text-white"
                >
                  Compare tools <ArrowUpRight size={16} className="opacity-70" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA (more space + larger padding) */}
        <section className="mt-28 md:mt-32">
          <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 md:p-12">
            <div className="mx-auto max-w-5xl text-center">
              <h3 className="text-2xl font-semibold tracking-tight text-white md:text-4xl">
                Start browsing Findaly
              </h3>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
                Explore tools, categories, and comparison flows — designed to feel modern and
                professional.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-[rgba(255,255,255,0.08)] px-6 py-3 text-sm font-medium text-white transition hover:border-white/25 hover:bg-[rgba(255,255,255,0.10)]"
                >
                  Browse tools <ArrowUpRight size={16} className="opacity-70" />
                </Link>
                <Link
                  href="/tools/category/ai"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-transparent px-6 py-3 text-sm font-medium text-white/85 transition hover:border-white/25 hover:text-white"
                >
                  Browse AI <Layers size={16} className="opacity-80" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-20 border-t border-white/10 pt-8 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Findaly. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
