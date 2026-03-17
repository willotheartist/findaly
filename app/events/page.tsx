import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Boat Shows & Marine Events | Findaly",
  description:
    "Boat shows, marine events and industry gatherings. Use destinations and guides to plan charters, viewings and trips around events.",
  alternates: { canonical: "/events" },
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
    title: "Boat Shows & Marine Events | Findaly",
    description: "Boat shows, marine events and industry gatherings on Findaly.",
    url: "https://www.findaly.co/events",
    siteName: "Findaly",
    type: "website",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boat Shows & Marine Events | Findaly",
    description: "Boat shows, marine events and industry gatherings on Findaly.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 list-disc pl-6 text-neutral-700">
      {items.map((t) => (
        <li key={t} className="mt-2 leading-relaxed">
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Boat Shows and Marine Events</h1>
        <p>Boat shows, marine events and industry gatherings on Findaly.</p>
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
      <p className="text-sm font-medium tracking-wide text-neutral-500">Explore</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Events</h1>
      <p className="mt-5 text-lg leading-relaxed text-neutral-700">
        Marine events are where buyers compare models, meet brokers, and plan next-season routes.
        This hub will expand into a curated calendar. For now, use Findaly’s destination and guide clusters to plan intelligently.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/destinations" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Destinations
        </Link>
        <Link href="/charter" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Charters
        </Link>
        <Link href="/buy" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Boats for sale
        </Link>
      </div>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-8">
        <h2 className="text-2xl font-semibold tracking-tight">How to use events strategically</h2>
        <Bullets
          items={[
            "Use events to shortlist models in person — then benchmark listings online.",
            "If you’re chartering, plan around shoulder-season value and destination vibe.",
            "If you’re buying, align surveys and viewings with travel to reduce friction.",
          ]}
        />
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Link href="/guides/buying-a-yacht" className="rounded-2xl border border-neutral-200 bg-white p-6 hover:bg-neutral-50">
          <p className="text-sm font-semibold">Buying a yacht</p>
          <p className="mt-2 text-sm text-neutral-700">Process, negotiation, closing.</p>
        </Link>
        <Link href="/guides/charter-guide" className="rounded-2xl border border-neutral-200 bg-white p-6 hover:bg-neutral-50">
          <p className="text-sm font-semibold">Charter guide</p>
          <p className="mt-2 text-sm text-neutral-700">Pick the right boat and plan.</p>
        </Link>
        <Link href="/guides/survey-inspection" className="rounded-2xl border border-neutral-200 bg-white p-6 hover:bg-neutral-50">
          <p className="text-sm font-semibold">Survey & inspection</p>
          <p className="mt-2 text-sm text-neutral-700">Reduce risk before you commit.</p>
        </Link>
      </section>
    </main>
  );
}
