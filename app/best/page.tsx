import Link from "next/link";
import type { Metadata } from "next";
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

  return (
    <main className="min-h-screen bg-(--color-bg)">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-xs text-(--color-text-muted)">
          <Link href="/tools" className="underline underline-offset-2">
            Tools
          </Link>
          <span className="mx-1">/</span>
          <span>Best</span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold">Best pages</h1>
        <p className="mt-2 max-w-3xl text-sm text-(--color-text-muted)">
          These are programmatic shortlists: <span className="font-medium">category</span> ×{" "}
          <span className="font-medium">use case</span>. They’re designed to rank and to drive users
          into comparisons and alternatives.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/5 bg-(--color-surface) p-5">
            <h2 className="text-sm font-semibold">Pick a category</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {categories.slice(0, 18).map((c) => (
                <Link
                  key={c.id}
                  href={`/tools/category/${c.slug}`}
                  className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 underline underline-offset-2"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <p className="mt-3 text-xs text-(--color-text-muted)">
              Tip: pick a category then use a use case below to jump to a best page.
            </p>
          </div>

          <div className="rounded-2xl border border-black/5 bg-(--color-surface) p-5">
            <h2 className="text-sm font-semibold">Pick a use case</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {useCases.slice(0, 24).map((u) => (
                <Link
                  key={u.id}
                  href={`/use-cases/${u.slug}`}
                  className="rounded-full border border-black/10 bg-(--color-surface) px-3 py-1 underline underline-offset-2"
                >
                  {u.name}
                </Link>
              ))}
            </div>
            <p className="mt-3 text-xs text-(--color-text-muted)">
              Use cases show which categories have relevant tools and link to the best pages.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
