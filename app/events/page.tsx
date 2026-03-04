import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Boat Shows & Marine Events | Findaly",
  description:
    "Boat shows, marine events and industry gatherings. Use destinations and guides to plan charters, viewings and trips around events.",
  alternates: { canonical: "/events" },
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
