import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Boating Safety: Practical Checklists for Buyers, Sellers & Charters | Findaly",
  description:
    "Safety guidance for buying, selling and chartering boats. Checklists for inspection, onboard safety, weather planning and responsible boating.",
  alternates: { canonical: "/safety" },
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
    title: "Boating Safety Checklists | Findaly",
    description: "Safety guidance for buying, selling and chartering boats on Findaly.",
    url: "https://www.findaly.co/safety",
    siteName: "Findaly",
    type: "website",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boating Safety Checklists | Findaly",
    description: "Safety guidance for buying, selling and chartering boats on Findaly.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 text-2xl font-semibold tracking-tight">{children}</h2>;
}
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
        <h1>Boating Safety — Checklists for Buyers, Sellers and Charters</h1>
        <p>Safety guidance for buying, selling and chartering boats on Findaly.</p>
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
      <p className="text-sm font-medium tracking-wide text-neutral-500">Trust</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Safety</h1>
      <p className="mt-5 text-lg leading-relaxed text-neutral-700">
        Safety is a system: preparation, maintenance, training, and good judgement. This hub focuses on practical checklists
        for owners and charterers — the stuff that prevents emergencies and protects people on board.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/guides/charter-guide" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Charter guide
        </Link>
        <Link href="/guides/survey-inspection" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Survey & inspection
        </Link>
        <Link href="/scams" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Avoid scams
        </Link>
      </div>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-8">
        <p className="text-sm font-semibold">Before you go</p>
        <Bullets
          items={[
            "Know your limits: experience, conditions, night passages, unfamiliar harbours.",
            "Check weather properly and plan a conservative route with safe alternatives.",
            "Do a pre-departure inspection: fuel, bilges, engine checks, lights, radio, safety kit.",
          ]}
        />
      </section>

      <section>
        <H2>Onboard safety checklist</H2>
        <Bullets
          items={[
            "Lifejackets accessible and appropriate for all passengers.",
            "Fire extinguishers present, in-date, and crew knows how to use them.",
            "First aid kit stocked; emergency contacts and procedures known.",
            "VHF radio tested; navigation lights working; bilge pumps functional.",
            "Gas systems checked (if present); ventilate cabins; manage CO risks.",
          ]}
        />

        <H2>Charter safety (if you’re renting)</H2>
        <Bullets
          items={[
            "Do a proper handover: systems demo, emergency procedures, and local rules.",
            "Confirm what insurance covers and what is your responsibility.",
            "Agree check-in/out inventory and document existing damage with photos.",
          ]}
        />
        <p className="mt-4 text-neutral-700 leading-relaxed">
          Pair this with: <Link className="underline" href="/guides/charter-guide">Yacht charter guide</Link>.
        </p>

        <H2>Buying/selling safety (transaction safety)</H2>
        <Bullets
          items={[
            "Use independent surveyors and, when needed, marine legal checks.",
            "Avoid rushed payments; keep a clear paper trail; verify ownership and documents.",
            "If something feels off, pause and read the scams checklist.",
          ]}
        />
        <p className="mt-4 text-neutral-700 leading-relaxed">
          Continue: <Link className="underline" href="/verification">Verification</Link> ·{" "}
          <Link className="underline" href="/scams">Avoid scams</Link> ·{" "}
          <Link className="underline" href="/report">Report an issue</Link>
        </p>
      </section>
    </main>
  );
}
