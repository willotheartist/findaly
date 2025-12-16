import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — findaly",
  description:
    "Findaly helps people choose software with clarity — comparisons, alternatives, and best-for lists.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main)">
      <div className="mx-auto max-w-4xl px-6 py-20">
        {/* Breadcrumb */}
        <div className="text-xs text-(--color-text-muted)">
          <Link
            href="/tools"
            className="underline underline-offset-2 hover:text-(--color-text-main)"
          >
            Tools
          </Link>
          <span className="mx-1">/</span>
          <span>About</span>
        </div>

        {/* Hero */}
        <section className="mt-10">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            findaly is built to bring clarity back to software choice.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-(--color-text-muted)">
            There are more tools than ever — and less confidence than ever when picking one.
            Findaly exists to help you decide faster, with fewer regrets.
          </p>
        </section>

        {/* Story */}
        <section className="mt-24 grid gap-12 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-medium tracking-tight">
              Why Findaly exists
            </h2>
          </div>

          <div className="space-y-6 text-sm leading-7 text-(--color-text-muted)">
            <p>
              Findaly is built by a solo developer and designer who’s tried too many tools to count —
              and paid for more subscriptions than he’d like to admit.
            </p>
            <p>
              The pattern was always the same: endless “best” articles, shallow comparisons,
              and a lot of trial-and-error that burned both time and money.
            </p>
            <p>
              After repeating that cycle one too many times, it felt obvious that the problem
              wasn’t a lack of options — it was a lack of clear, decision-focused guidance.
            </p>
          </div>
        </section>

        {/* What it is */}
        <section className="mt-24 grid gap-12 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-medium tracking-tight">
              What Findaly is
            </h2>
          </div>

          <div className="space-y-6 text-sm leading-7 text-(--color-text-muted)">
            <p>
              Findaly is a software directory designed around decisions, not discovery for
              discovery’s sake.
            </p>
            <p>
              It helps you compare tools side-by-side, explore credible alternatives, and
              narrow down the best options for a specific use case — whether you’re a founder,
              creator, freelancer, or small team.
            </p>
            <p>
              Every page is structured to answer one question clearly:
              <span className="ml-1 text-(--color-text-main)">
                “What should I choose — and why?”
              </span>
            </p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="mt-24 grid gap-12 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-medium tracking-tight">
              How it’s different
            </h2>
          </div>

          <div className="space-y-6 text-sm leading-7 text-(--color-text-muted)">
            <p>
              Findaly doesn’t try to list everything — it focuses on what matters.
            </p>
            <p>
              Rankings are shaped by real tradeoffs, not hype. Alternatives exist to help you
              see beyond the obvious choice. And “best for” lists are grounded in actual
              workflows, not generic categories.
            </p>
            <p>
              As the product evolves, trust comes first. If monetization exists, it’s explicit —
              never hidden inside rankings or recommendations.
            </p>
          </div>
        </section>

        {/* Built by */}
        <section className="mt-24 grid gap-12 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-medium tracking-tight">
              Built by Wall&Fifth
            </h2>
          </div>

          <div className="space-y-6 text-sm leading-7 text-(--color-text-muted)">
            <p>
              Findaly is a project by Wall&Fifth — a small studio focused on thoughtful
              software, clean interfaces, and products that respect people’s time.
            </p>
            <p>
              It’s designed and built with the same principles that guide all Wall&Fifth work:
              clarity over noise, structure over shortcuts, and long-term usefulness over trends.
            </p>
          </div>
        </section>

        {/* Close */}
        <section className="mt-24">
          <p className="max-w-2xl text-sm leading-7 text-(--color-text-muted)">
            Findaly is still evolving — with more comparisons, deeper alternatives,
            and sharper “best for” pages coming soon.
          </p>

          <div className="mt-6 flex gap-4 text-sm">
            <Link
              href="/tools"
              className="underline underline-offset-4 hover:text-(--color-text-main)"
            >
              Browse tools
            </Link>
            <Link
              href="/submit"
              className="underline underline-offset-4 hover:text-(--color-text-main)"
            >
              Suggest a tool
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
