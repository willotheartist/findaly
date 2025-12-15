import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Sparkles } from "lucide-react";
import UseCasesExplorer from "../../components/UseCasesExplorer";

export const metadata: Metadata = {
  title: "Use cases — browse software by what you need",
  description:
    "Browse use cases and find the best tools for startups, freelancers, agencies, creators, and more.",
};

export default async function UseCasesIndexPage() {
  const useCases = await prisma.useCase.findMany({
    orderBy: [{ name: "asc" }],
    select: { id: true, name: true, slug: true },
  });

  return (
    <main className="min-h-screen bg-(--bg) text-(--text)">
      <div className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[760px] bg-[radial-gradient(1000px_380px_at_50%_0%,rgba(255,255,255,0.10),rgba(0,0,0,0))]" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-20">
        <div className="text-xs text-white/50">
          <Link href="/tools" className="text-white/60 hover:text-white no-underline">
            Tools
          </Link>
          <span className="mx-1">/</span>
          <span className="text-white/70">Use cases</span>
        </div>

        <section className="mt-6 text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <Sparkles size={14} className="opacity-80" />
            Browse by intent
          </p>

          <h1 className="mx-auto mt-7 max-w-4xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Use cases
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            Pick what you’re trying to do. We’ll route you to the best tools plus fast comparisons.
          </p>
        </section>

        <section className="mt-10 md:mt-12">
          <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 md:p-6">
            <UseCasesExplorer useCases={useCases} />
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Findaly. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
