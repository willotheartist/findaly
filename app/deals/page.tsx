import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Boat Deals: Standout Listings, Price Drops & Opportunities | Findaly",
  description:
    "Discover standout boats, notable price drops and opportunities. Use Findaly’s market browse tools to compare listings by brand, model, year and country.",
  alternates: { canonical: "/deals" },
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
      <p className="text-sm font-medium tracking-wide text-neutral-500">Browse</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Deals</h1>
      <p className="mt-5 text-lg leading-relaxed text-neutral-700">
        “Deal” only means something compared to the market. Use Findaly’s browse routes to benchmark listings by brand, model, year and location —
        then judge condition and documentation with the right checks.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/buy" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Browse boats for sale
        </Link>
        <Link href="/guides/buying-a-yacht" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Buying guide
        </Link>
        <Link href="/guides/survey-inspection" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Survey & inspection
        </Link>
      </div>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-8">
        <h2 className="text-2xl font-semibold tracking-tight">How to spot a real deal</h2>
        <Bullets
          items={[
            "Benchmark against comparable listings (same model/year, similar equipment, similar region).",
            "Discount for uncertainty: missing service history, unclear VAT/title, weak photo set.",
            "Don’t skip the survey — it’s the difference between a deal and a repair bill.",
          ]}
        />
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Link href="/buy/brand" className="rounded-2xl border border-neutral-200 bg-white p-6 hover:bg-neutral-50">
          <p className="text-sm font-semibold">Browse by brand</p>
          <p className="mt-2 text-sm text-neutral-700">Compare supply and pricing patterns.</p>
        </Link>
        <Link href="/buy/year" className="rounded-2xl border border-neutral-200 bg-white p-6 hover:bg-neutral-50">
          <p className="text-sm font-semibold">Browse by year</p>
          <p className="mt-2 text-sm text-neutral-700">See market shifts by build year.</p>
        </Link>
        <Link href="/scams" className="rounded-2xl border border-neutral-200 bg-white p-6 hover:bg-neutral-50">
          <p className="text-sm font-semibold">Avoid scams</p>
          <p className="mt-2 text-sm text-neutral-700">Cheap + rushed payments = risk.</p>
        </Link>
      </section>
    </main>
  );
}
