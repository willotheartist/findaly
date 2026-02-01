// components/destinations/DestinationSlugHero.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DestinationPageData } from "@/app/destinations/[slug]/_data";

export default function DestinationSlugHero({
  data,
}: {
  data: DestinationPageData;
}) {
  return (
    <section className="w-full">
      {/* Image container - full bleed on mobile, contained on desktop */}
      <div className="relative">
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-200 sm:aspect-21/9 lg:aspect-24/9">
          <Image
            src={data.heroImage}
            alt={data.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          {/* Gradient overlay for text legibility */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Content overlay - positioned at bottom */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-8 sm:pb-12">
            {/* Location breadcrumb */}
            <div className="mb-4">
              <span className="text-sm font-medium text-white/80">
                {data.region}, {data.country}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {data.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
              {data.subtitle}
            </p>

            {/* Tags - simple, understated */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {data.vibeTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action bar - sits below hero image */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6">
            <div className="flex items-center gap-6">
              <Link
                href={`/destinations/${data.slug}/things-to-do`}
                className="text-[15px] font-medium text-slate-900 no-underline transition-colors hover:text-[#F56462]"
              >
                Things to do
              </Link>
              <Link
                href={`/destinations/${data.slug}/things-to-do#marinas`}
                className="text-[15px] font-medium text-slate-600 no-underline transition-colors hover:text-slate-900"
              >
                Marinas
              </Link>
              <Link
                href={`/destinations/${data.slug}/things-to-do#anchor-spots`}
                className="text-[15px] font-medium text-slate-600 no-underline transition-colors hover:text-slate-900"
              >
                Anchor spots
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/destinations/${data.slug}/things-to-do`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#F56462] px-5 py-2.5 text-[15px] font-medium text-white no-underline transition-opacity hover:opacity-90"
              >
                Explore
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-[15px] font-medium text-slate-700 no-underline transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                All destinations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}