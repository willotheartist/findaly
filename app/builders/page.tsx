import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Boat Builders & Brands Directory | Findaly",
  description:
    "Explore boat builders, brands and shipyards. Browse by brand, model, year and country, and discover the market on Findaly.",
  alternates: { canonical: "/builders" },
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
    title: "Shipyard & Yacht Builders Directory | Findaly",
    description: "A curated directory of shipyards and yacht builders. Discover leading manufacturers on Findaly.",
    url: "https://www.findaly.co/builders",
    siteName: "Findaly",
    type: "website",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipyard & Yacht Builders Directory | Findaly",
    description: "A curated directory of shipyards and yacht builders. Discover leading manufacturers on Findaly.",
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
        <h1>Shipyards and Yacht Builders on Findaly</h1>
        <p>A curated directory of shipyards and yacht builders. Discover leading manufacturers and explore their inventory on Findaly.</p>
        <nav>
          <a href="/">Home</a>
          <a href="/buy">Boats for Sale</a>
          <a href="/buy/sailboats">Sailboats for Sale</a>
          <a href="/buy/motor-yachts">Motor Yachts for Sale</a>
          <a href="/buy/catamarans">Catamarans for Sale</a>
          <a href="/buy/superyachts">Superyachts for Sale</a>
          <a href="/sell">Sell Your Boat</a>
          <a href="/charter">Charter</a>
          <a href="/brokers">Brokers</a>
          <a href="/brokers/join">List as a Broker</a>
          <a href="/guides">Buying Guides</a>
          <a href="/guides/buying-a-yacht">Buying a Yacht Guide</a>
          <a href="/guides/catamaran-buying-guide">Catamaran Buying Guide</a>
          <a href="/guides/motor-yacht-buying-guide">Motor Yacht Buying Guide</a>
          <a href="/finance">Yacht Finance</a>
          <a href="/services">Marine Services</a>
          <a href="/destinations">Destinations</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About</a>
          <a href="/faq">FAQ</a>
        </nav>
      </div>
      <p className="text-sm font-medium tracking-wide text-neutral-500">Browse</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Boat builders & brands</h1>
      <p className="mt-5 text-lg leading-relaxed text-neutral-700">
        Findaly is building an open directory of builders, brands, and models — connected directly to listings and real market availability.
        Use it to shortlist models and compare what’s actually for sale across regions.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/brands" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Browse brands
        </Link>
        <Link href="/buy" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Boats for sale
        </Link>
        <Link href="/guides/yacht-types-explained" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Yacht types explained
        </Link>
      </div>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-8">
        <h2 className="text-2xl font-semibold tracking-tight">How to use the builders directory</h2>
        <Bullets
          items={[
            "Start with a brand, then narrow by model and year based on layout and usage.",
            "Compare availability across regions: country pages and year filters show supply.",
            "Use guides to understand the trade-offs between boat types and ownership realities.",
          ]}
        />
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <Link href="/buy/brand" className="rounded-2xl border border-neutral-200 bg-white p-6 hover:bg-neutral-50">
          <p className="text-sm font-semibold">Browse by brand</p>
          <p className="mt-2 text-sm text-neutral-700">
            Explore brand → model → year → country routes.
          </p>
        </Link>
        <Link href="/buy/model" className="rounded-2xl border border-neutral-200 bg-white p-6 hover:bg-neutral-50">
          <p className="text-sm font-semibold">Browse by model</p>
          <p className="mt-2 text-sm text-neutral-700">
            Shortlist specific models and compare listings.
          </p>
        </Link>
        <Link href="/guides/buying-a-yacht" className="rounded-2xl border border-neutral-200 bg-white p-6 hover:bg-neutral-50">
          <p className="text-sm font-semibold">Buying playbook</p>
          <p className="mt-2 text-sm text-neutral-700">
            Understand process, survey, and closing.
          </p>
        </Link>
      </section>
    </main>
  );
}
