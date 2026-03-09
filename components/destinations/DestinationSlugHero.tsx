import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, MapPinned, Waves } from "lucide-react";
import type { DestinationPageData } from "@/app/destinations/[slug]/_data";

export default function DestinationSlugHero({
  data,
}: {
  data: DestinationPageData;
}) {
  return (
    <section className="w-full border-b border-slate-200 bg-white">
      <div className="relative overflow-hidden">
        <div className="relative aspect-16/10 w-full bg-slate-200 sm:aspect-21/9 lg:aspect-24/9">
          <Image
            src={data.heroImage}
            alt={`${data.title} yacht destination`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(2,6,23,0.78),rgba(2,6,23,0.32),rgba(2,6,23,0.08))]" />
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-8 sm:pb-12 lg:pb-14">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/80">
                <Link
                  href="/destinations"
                  className="font-medium text-white/80 no-underline hover:text-white"
                >
                  Destinations
                </Link>
                <span>/</span>
                <span>{data.country}</span>
                <span>/</span>
                <span>{data.title}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
                <Compass className="h-3.5 w-3.5" />
                Destination guide
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Yacht guide to {data.title}
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl">
                {data.subtitle}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {data.vibeTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/destinations/${data.slug}/things-to-do`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F56462] px-5 py-3 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
                >
                  Explore things to do
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/charter"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white no-underline backdrop-blur-md transition-colors hover:bg-white/15"
                >
                  Browse charter
                  <Waves className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="-mt-5 grid gap-3 pb-6 sm:-mt-6 sm:grid-cols-2 lg:grid-cols-4 lg:pb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Best time
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-900">
              {data.quickFacts.bestTime}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Ideal stay
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-900">
              {data.quickFacts.idealStay}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Destination feel
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-900">
              {data.quickFacts.vibe}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              <MapPinned className="h-3.5 w-3.5" />
              Region
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-900">
              {data.region}, {data.country}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 border-t border-slate-200 py-4 text-sm">
          <Link
            href={`/destinations/${data.slug}/things-to-do`}
            className="font-medium text-slate-900 no-underline hover:text-[#F56462]"
          >
            Things to do
          </Link>
          <Link
            href={`/destinations/${data.slug}/things-to-do#marinas`}
            className="font-medium text-slate-600 no-underline hover:text-slate-900"
          >
            Marinas
          </Link>
          <Link
            href={`/destinations/${data.slug}/things-to-do#anchor-spots`}
            className="font-medium text-slate-600 no-underline hover:text-slate-900"
          >
            Anchor spots
          </Link>
          <Link
            href="/destinations"
            className="font-medium text-slate-600 no-underline hover:text-slate-900"
          >
            All destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
