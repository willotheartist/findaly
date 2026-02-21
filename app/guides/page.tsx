import Image from "next/image"
import Link from "next/link"
import { GUIDES } from "./_data"

export const metadata = {
  title: "Yacht Buying Guides | Findaly",
  description:
    "Browse Findaly’s yacht buying guides: pricing, inspections, model comparisons, ownership reality, and how to buy clean.",
}

export default function GuidesHubPage() {
  return (
    <main className="min-h-screen bg-[#f5f2eb] text-[#0a211f]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[52vh] min-h-[420px] w-full">
          <Image
            src="/hero-buy.jpg"
            alt="Findaly yacht buying guides"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a211f]/75 via-[#0a211f]/35 to-[#f5f2eb]" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="max-w-3xl text-center">
              <p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#fff86c]">
                Findaly Guides
              </p>
              <h1 className="mt-4 text-[clamp(32px,5vw,64px)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
                Buying guides, checklists, and model comparisons —
                <span className="text-[#fff86c]"> built to help you buy clean</span>.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-[16.5px] leading-relaxed text-white/70">
                Practical, no-fluff resources that link directly into live inventory: brand hubs,
                model hubs, and listing pages.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/buy"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fff86c] px-7 text-[14.5px] font-semibold text-[#0a211f] hover:opacity-90 transition-opacity"
                >
                  Browse yachts
                </Link>
                <Link
                  href="/brokers"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Find a broker
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-6xl px-6 pt-14">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-[#0a211f]/10 bg-[#0a211f]/2 p-6">
            <div className="text-[13px] font-bold tracking-[0.16em] uppercase text-[#0a211f]/45">
              Cluster strategy
            </div>
            <p className="mt-3 text-[15.5px] leading-relaxed text-[#0a211f]/70">
              Each guide links into Findaly’s hubs (brand/model/country/year), strengthening crawl paths
              and pushing authority into pages that actually convert.
            </p>
          </div>

          <div className="rounded-2xl border border-[#0a211f]/10 bg-[#0a211f]/2 p-6">
            <div className="text-[13px] font-bold tracking-[0.16em] uppercase text-[#0a211f]/45">
              Built for intent
            </div>
            <p className="mt-3 text-[15.5px] leading-relaxed text-[#0a211f]/70">
              These pages target informational queries (“pricing”, “inspection checklist”, “comparison”)
              and send users to commercial pages when they’re ready.
            </p>
          </div>

          <div className="rounded-2xl border border-[#0a211f]/10 bg-[#0a211f]/2 p-6">
            <div className="text-[13px] font-bold tracking-[0.16em] uppercase text-[#0a211f]/45">
              Internal linking
            </div>
            <p className="mt-3 text-[15.5px] leading-relaxed text-[#0a211f]/70">
              You’ll get clean: Guides → Brand hubs → Model hubs → Listings — plus lateral links
              between guides.
            </p>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#0a211f]/45">
              Browse guides
            </p>
            <h2 className="mt-3 text-[clamp(22px,2.6vw,34px)] font-semibold tracking-[-0.02em]">
              Start with a guide, then jump into live inventory.
            </h2>
          </div>

          <Link
            href="/buy"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#0a211f]/15 px-6 text-[14px] font-semibold text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors"
          >
            Browse yachts →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <article
              key={g.slug}
              className="overflow-hidden rounded-2xl border border-[#0a211f]/10 bg-white/40"
            >
              <div className="relative h-44">
                <Image
                  src={g.image}
                  alt={`${g.title} — Findaly guide`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] uppercase text-white">
                  {g.tag}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-[18px] font-semibold tracking-[-0.01em]">{g.title}</h3>
                <p className="mt-2 text-[13.5px] text-[#0a211f]/55">{g.subtitle}</p>
                <p className="mt-4 text-[14.5px] leading-relaxed text-[#0a211f]/70">
                  {g.excerpt}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    href={g.primaryCtaHref}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0a211f] px-4 text-[13px] font-semibold text-[#fff86c]"
                  >
                    {g.primaryCtaLabel} →
                  </Link>
                  {g.secondaryCtaHref ? (
                    <Link
                      href={g.secondaryCtaHref}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-[#0a211f]/15 px-4 text-[13px] font-semibold text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors"
                    >
                      {g.secondaryCtaLabel} →
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer-ish nav */}
        <div className="mt-14 rounded-2xl border border-[#0a211f]/10 bg-[#0a211f]/2 p-8 text-center">
          <p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#0a211f]/45">
            Want to move faster?
          </p>
          <h3 className="mt-3 text-[clamp(20px,2.5vw,30px)] font-semibold tracking-[-0.02em]">
            Browse live listings while you read.
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-[14.5px] leading-relaxed text-[#0a211f]/65">
            Guides build confidence. Inventory builds intent. The best SEO pages connect both.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/buy"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#fff86c] px-6 text-[14px] font-semibold text-[#0a211f] hover:opacity-90 transition-opacity"
            >
              Browse yachts
            </Link>
            <Link
              href="/sell"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#0a211f]/15 px-6 text-[14px] font-semibold text-[#0a211f] hover:bg-[#0a211f]/5 transition-colors"
            >
              List your boat
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}