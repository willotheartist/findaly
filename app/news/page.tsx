//·app/news/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yachting News & Market Updates | Findaly",
  description:
    "Market updates, new launches, buyer trends and platform notes. A lightweight newsroom that will expand as Findaly grows.",
  alternates: { canonical: "/news" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Yachting News & Market Updates | Findaly",
    description: "Market updates, new launches, buyer trends and platform notes from Findaly.",
    url: "https://www.findaly.co/news",
    siteName: "Findaly",
    type: "website",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yachting News & Market Updates | Findaly",
    description: "Market updates, new launches, buyer trends and platform notes from Findaly.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

type NewsCard = {
  title: string;
  excerpt: string;
  href: string;
  label: string;
};

const CARDS: NewsCard[] = [
  {
    label: "Market",
    title: "What buyers are filtering for right now",
    excerpt:
      "A quick look at the filters that correlate with high-intent browsing — brands, year ranges, and top cruising regions.",
    href: "/buy",
  },
  {
    label: "Guides",
    title: "The modern buying checklist",
    excerpt:
      "Survey, sea trial, title, and negotiation — the simple sequence that prevents expensive mistakes.",
    href: "/guides",
  },
  {
    label: "Brokers",
    title: "How to choose a broker (fast)",
    excerpt:
      "The questions that reveal whether a broker is truly aligned — and how to avoid mismatched inventory.",
    href: "/brokers",
  },
  {
    label: "Destinations",
    title: "Popular cruising regions to explore",
    excerpt:
      "Browse destination pages and things-to-do hubs to plan your route and shortlist the right boat type.",
    href: "/destinations",
  },
  {
    label: "Finance",
    title: "Ownership costs: the non-obvious ones",
    excerpt:
      "Mooring, maintenance, crew, insurance, upgrades — the costs that move faster than sticker price.",
    href: "/finance",
  },
  {
    label: "Reports",
    title: "Reports (coming soon)",
    excerpt:
      "Snapshot pricing and demand trends — structured like a briefing, not a wall of text.",
    href: "/reports",
  },
];

export default function NewsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Yachting News and Market Updates</h1>
        <p>Market updates, new launches, buyer trends and platform notes from Findaly.</p>
        <nav>
          <a href="/">Home</a>
          <a href="/buy">Boats for Sale</a>
          <a href="/sell">Sell Your Boat</a>
          <a href="/brokers">Brokers</a>
          <a href="/guides">Buying Guides</a>
          <a href="/safety">Boating Safety</a>
          <a href="/scams">Avoid Scams</a>
          <a href="/faq">FAQ</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
          Learn
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          News &amp; updates
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          A lightweight newsroom: market notes, buyer behavior, and platform updates.
          Built to be genuinely useful — and to strengthen internal linking into your inventory hubs.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/buy"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
          >
            Browse listings →
          </Link>
          <Link
            href="/reports"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
          >
            View reports →
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { title: "Inventory-first linking", text: "Every update routes back into real buying paths." },
          { title: "Short, useful briefs", text: "Readable notes — not content-for-content’s-sake." },
          { title: "Designed to expand", text: "When you add a CMS, this becomes a true publication." },
        ].map((x) => (
          <div key={x.title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-900">{x.title}</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{x.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 no-underline hover:border-slate-300"
          >
            <div className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-500">
              {c.label}
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900 group-hover:underline">
              {c.title}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.excerpt}</p>
            <div className="mt-4 text-sm font-semibold text-slate-900">
              Read more →
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold tracking-tight text-slate-900">
              Want a weekly “market brief” email?
            </div>
            <p className="mt-1 text-sm text-slate-600">
              If you decide to wire it, we can connect this to your footer email capture next.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
          >
            Contact →
          </Link>
        </div>
      </div>
    </main>
  );
}