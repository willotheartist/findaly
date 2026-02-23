//·app/shipyards/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipyards & Builders | Findaly",
  description:
    "A curated directory of shipyards and yacht builders. Discover leading manufacturers and explore their inventory on Findaly.",
};

const SHIPYARDS = [
  { name: "Beneteau", note: "France — sailing & power", href: "/buy/brand/beneteau" },
  { name: "Jeanneau", note: "France — cruisers", href: "/buy/brand/jeanneau" },
  { name: "Lagoon", note: "France — catamarans", href: "/buy/brand/lagoon" },
  { name: "Fountaine Pajot", note: "France — catamarans", href: "/buy/brand/fountaine-pajot" },
  { name: "Princess", note: "UK — motor yachts", href: "/buy/brand/princess" },
  { name: "Sunseeker", note: "UK — performance luxury", href: "/buy/brand/sunseeker" },
  { name: "Azimut", note: "Italy — motor yachts", href: "/buy/brand/azimut" },
  { name: "Ferretti", note: "Italy — luxury group", href: "/buy/brand/ferretti" },
];

export default function ShipyardsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
          Explore
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Shipyards &amp; builders
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          A curated directory of leading shipyards. Over time, each builder gets a proper page
          (history, model lines, reviews, and live listings).
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/brands"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
          >
            Browse brands →
          </Link>
          <Link
            href="/buy"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-slate-300"
          >
            Browse listings →
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { title: "Builder context", text: "Understand what each yard is known for (quality, layout, resale)." },
          { title: "Model lines", text: "We’ll expand into model families and comparisons as content grows." },
          { title: "Inventory-first", text: "Every shipyard entry routes you to live listings immediately." },
        ].map((x) => (
          <div key={x.title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-900">{x.title}</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{x.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SHIPYARDS.map((s) => (
          <Link
            key={s.name}
            href={s.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 no-underline hover:border-slate-300"
          >
            <div className="text-sm font-semibold text-slate-900 group-hover:underline">
              {s.name}
            </div>
            <p className="mt-2 text-sm text-slate-600">{s.note}</p>
            <div className="mt-4 text-sm font-semibold text-slate-900">
              View listings →
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold tracking-tight text-slate-900">
              Are you a builder or shipyard rep?
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Claim your presence and add verified information, media, and model lines.
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