// app/best/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Boxes, Layers, Search, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Best tools — browse decision-first shortlists",
  description:
    "Browse best-of pages by category and use case. Jump to comparisons and alternatives fast.",
};

export default async function BestIndexPage() {
  const [categories, useCases] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ name: "asc" }] }),
    prisma.useCase.findMany({ orderBy: [{ name: "asc" }] }),
  ]);

  const topCategories = categories.slice(0, 24);
  const topUseCases = useCases.slice(0, 24);

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      {/* top glow (match Home) */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[760px] bg-[radial-gradient(1000px_380px_at_50%_0%,rgba(255,255,255,0.10),rgba(0,0,0,0))]" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:pt-24">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/60">
          <Link href="/tools" className="hover:text-white">
            Tools
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-white/80">Best</span>
        </div>

        {/* HERO */}
        <section className="text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <Sparkles size={14} className="opacity-80" />
            Programmatic shortlists (category × use case)
          </p>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Best tools for your workflow.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
            These pages are built to help you decide quickly: consistent structure, fast scanning,
            and links into comparisons and alternatives.
          </p>

          {/* Search-style bar (visual only, like Home) */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-3">
                <Search size={18} className="text-white/45" />
                <span className="text-sm text-white/45">
                  Pick a category, then a use case…
                </span>
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
              <span className="text-white/55">Shortlists:</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                best/{`{category}`}-tools-for-{`{use-case}`}
              </span>
            </div>
          </div>
        </section>

        {/* PICKERS */}
        <section className="mt-14 grid gap-6 md:grid-cols-2">
          {/* Categories */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                <Layers size={16} className="text-white/70" />
                Pick a category
              </div>

              <Link
                href="/tools"
                className="inline-flex items-center gap-2 text-sm text-white/70 underline underline-offset-4 hover:text-white"
              >
                Browse all <ArrowUpRight size={16} className="opacity-70" />
              </Link>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Start with a category, then use a use case below to jump into relevant best pages.
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              {topCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/tools/category/${c.slug}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70 transition hover:border-white/20 hover:text-white"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            {categories.length > topCategories.length ? (
              <p className="mt-4 text-xs text-white/45">
                Showing {topCategories.length} of {categories.length}. Use category pages to
                explore more.
              </p>
            ) : null}
          </div>

          {/* Use cases */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                <Sparkles size={16} className="text-white/70" />
                Pick a use case
              </div>

              <Link
                href="/use-cases"
                className="inline-flex items-center gap-2 text-sm text-white/70 underline underline-offset-4 hover:text-white"
              >
                View all <ArrowUpRight size={16} className="opacity-70" />
              </Link>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Use cases show which categories have relevant tools — and link to the best pages.
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              {topUseCases.map((u) => (
                <Link
                  key={u.id}
                  href={`/use-cases/${u.slug}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70 transition hover:border-white/20 hover:text-white"
                >
                  {u.name}
                </Link>
              ))}
            </div>

            {useCases.length > topUseCases.length ? (
              <p className="mt-4 text-xs text-white/45">
                Showing {topUseCases.length} of {useCases.length}. Use the use case explorer to
                browse everything.
              </p>
            ) : null}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-16 md:mt-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              How these pages work
            </p>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white md:text-4xl">
              Built to drive decisions (and comparisons).
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
              Each best page links directly into profiles, alternatives, and “X vs Y” comparisons —
              so users can move from shortlist → decision fast.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <p className="text-sm font-semibold text-white/90">1) Shortlist</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                See the best tools for a specific category + use case combination.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <p className="text-sm font-semibold text-white/90">2) Validate</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Jump into tool profiles for pricing, integrations, and a consistent decision format.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <p className="text-sm font-semibold text-white/90">3) Compare</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Move into comparisons and alternatives to choose confidently.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 md:mt-20">
          <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 md:p-12">
            <div className="mx-auto max-w-5xl text-center">
              <h3 className="text-2xl font-semibold tracking-tight text-white md:text-4xl">
                Explore best-of shortlists
              </h3>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
                Start with a category, then choose a use case — or browse tools directly.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-[rgba(255,255,255,0.08)] px-6 py-3 text-sm font-medium text-white transition hover:border-white/25 hover:bg-[rgba(255,255,255,0.10)]"
                >
                  Browse tools <ArrowUpRight size={16} className="opacity-70" />
                </Link>
                <Link
                  href="/use-cases"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-transparent px-6 py-3 text-sm font-medium text-white/85 transition hover:border-white/25 hover:text-white"
                >
                  Browse use cases <Sparkles size={16} className="opacity-80" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
