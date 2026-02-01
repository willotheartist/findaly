// app/destinations/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getDestinationBySlug } from "./_data";
import DestinationSlugHero from "@/components/destinations/DestinationSlugHero";
import DestinationQuickFacts from "@/components/destinations/DestinationQuickFacts";
import DestinationHighlights from "@/components/destinations/DestinationHighlights";

export default async function DestinationSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getDestinationBySlug(slug);

  if (!data) return notFound();

  return (
    <main className="w-full bg-[#FAFAFA]">
      <DestinationSlugHero data={data} />

      <DestinationQuickFacts data={data} />

      <DestinationHighlights data={data} />

      {/* Bottom CTA */}
      <section className="w-full pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900">
            {/* Subtle gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-slate-800/50 via-transparent to-slate-950/50" />
            
            <div className="relative px-8 py-12 sm:px-12 sm:py-16">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-lg">
                  <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                    Explore more destinations
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-slate-400">
                    Find your next adventure. Browse by region, vibe, or season.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/destinations"
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-white px-6 py-3.5 text-[15px] font-medium text-slate-900 no-underline transition-opacity hover:opacity-90"
                  >
                    All destinations
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href={`/destinations/${data.slug}/things-to-do`}
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-700 px-6 py-3.5 text-[15px] font-medium text-white no-underline transition-colors hover:border-slate-600 hover:bg-slate-800/50"
                  >
                    Things to do in {data.title}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}