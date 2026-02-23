// components/home/GuidesRowSection.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, ChevronRight } from "lucide-react";

type GuideCard = {
  title: string;
  href: string;
  excerpt: string;
  tag?: string;
  readTime?: string;
  image?: string;
};

function SectionHeader({
  title,
  subtitle,
  href,
  cta = "See all",
}: {
  title: string;
  subtitle?: string;
  href: string;
  cta?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-1.5 text-base text-slate-500">{subtitle}</p> : null}
      </div>

      <Link
        href={href}
        className="group hidden items-center gap-2 text-sm font-medium text-slate-600 no-underline transition-colors hover:text-slate-900 sm:inline-flex"
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

function GuideCardTile({ it }: { it: GuideCard }) {
  return (
    <Link
      href={it.href}
      className="group relative overflow-hidden rounded-2xl bg-white no-underline shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:shadow-md hover:ring-slate-300"
    >
      {/* Image */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        {it.image ? (
          <Image
            src={it.image}
            alt={it.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-slate-100 to-slate-50">
            <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_30%_40%,rgba(0,0,0,0.06),transparent)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-slate-200 transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>
        )}

        {/* Premium tag (not a pill) */}
        <div
          className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 bg-[#0a211f] px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-[#fff86c] shadow-sm ring-1 ring-black/10"
          style={{
            clipPath: "polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%, 6% 50%)",
          }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#fff86c]" />
          {it.tag || "GUIDE"}
        </div>

        {/* Read time */}
        {it.readTime ? (
          <div className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-sm ring-1 ring-black/5">
            {it.readTime}
          </div>
        ) : null}
      </div>

      {/* Body */}
      <div className="px-4 pb-4 pt-4">
        <div className="min-w-0">
          <div className="line-clamp-2 text-[16px] font-semibold tracking-tight text-slate-900">
            {it.title}
          </div>
          <div className="mt-2 line-clamp-2 text-sm text-slate-500">{it.excerpt}</div>
        </div>

        {/* Footer row */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          {/* ✅ Read Article (Inter Tight, normal case, medium) */}
          <div className="text-sm font-medium text-slate-700 transition-colors group-hover:text-slate-900">
            Read Article
          </div>

          <ChevronRight className="h-4 w-4 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-slate-500" />
        </div>
      </div>
    </Link>
  );
}

function Rail({ items }: { items: GuideCard[] }) {
  if (!items.length) return null;
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.href} className="min-w-[320px] sm:min-w-0">
          <GuideCardTile it={it} />
        </div>
      ))}
    </div>
  );
}

export default function GuidesRowSection() {
  const guides: GuideCard[] = [
    {
      title: "Lagoon Catamaran Buying Guide",
      href: "/guides/lagoon-catamaran-buying-guide",
      excerpt: "What Lagoon models are best for families, long-range cruising, and resale value.",
      tag: "GUIDE",
      readTime: "10 min",
      image: "/guides/lagoon-catamaran.jpg",
    },
    {
      title: "Beneteau Swift Trawler Buying Guide",
      href: "/guides/beneteau-swift-trawler-buying-guide",
      excerpt: "Real-world speeds, running costs, layouts, and what to inspect before buying.",
      tag: "GUIDE",
      readTime: "12 min",
      image: "/guides/swift-trawler.jpg",
    },
    {
      title: "Motor Yacht Buying Guide",
      href: "/guides/motor-yacht-buying-guide",
      excerpt: "How to choose the right motor yacht: sizes, hulls, engines, and ownership costs.",
      tag: "GUIDE",
      readTime: "9 min",
      image: "/guides/motor-yacht.jpg",
    },
    {
      title: "Yacht Types Explained",
      href: "/guides/yacht-types-explained",
      excerpt: "A quick, clear breakdown: sailboats, motor yachts, trawlers, cats, and more.",
      tag: "RESEARCH",
      readTime: "7 min",
      image: "/guides/yacht-types.jpg",
    },
  ];

  return (
    <section className="w-full bg-linear-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeader
          title="Latest guides"
          subtitle="Short, practical buying advice — written for real buyers"
          href="/guides"
          cta="Browse all guides"
        />
        <Rail items={guides} />

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 no-underline hover:text-slate-900"
          >
            Browse guides <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}