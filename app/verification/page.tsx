import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verification: Listings, Brokers, and Trust Signals on Findaly | Findaly",
  description:
    "How verification works on Findaly: what we check, what buyers should verify, and how trust signals help reduce risk across buying, selling and charter.",
  alternates: { canonical: "/verification" },
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
      <p className="text-sm font-medium tracking-wide text-neutral-500">Trust</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Verification</h1>
      <p className="mt-5 text-lg leading-relaxed text-neutral-700">
        Verification reduces risk by making the important signals explicit: who’s behind the listing, whether documentation is coherent,
        and whether the transaction flow stays within safe norms. This page explains what “verified” means — and what you should still verify yourself.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/brokers" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Brokers
        </Link>
        <Link href="/scams" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Avoid scams
        </Link>
        <Link href="/support" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Support
        </Link>
      </div>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-8">
        <p className="text-sm font-semibold">Important</p>
        <p className="mt-3 text-neutral-700 leading-relaxed">
          Verification helps reduce risk, but it isn’t a replacement for independent surveys, legal checks, and safe payment practices.
          Think of it as “stronger signals + fewer unknowns”.
        </p>
      </section>

      <section>
        <H2>What buyers should verify (always)</H2>
        <Bullets
          items={[
            "Identity: who you’re dealing with (seller/broker), and their authority to sell.",
            "Ownership/title chain: coherent documentation and registration details.",
            "Condition: independent survey + sea trial for serious purchases.",
            "Payment flow: traceable rails, written agreement, no rushed changes.",
          ]}
        />
        <p className="mt-4 text-neutral-700 leading-relaxed">
          Related: <Link className="underline" href="/guides/survey-inspection">Survey & inspection</Link> ·{" "}
          <Link className="underline" href="/guides/buying-a-yacht">Buying guide</Link>
        </p>

        <H2>Broker verification (trust signals)</H2>
        <Bullets
          items={[
            "Clear business identity, contact points, and track record.",
            "Consistent listing quality and completeness across the catalogue.",
            "Transparent communication and standard contractual process.",
          ]}
        />
        <p className="mt-4 text-neutral-700 leading-relaxed">
          If you’re a broker: <Link className="underline" href="/brokers/join">Join</Link> ·{" "}
          <Link className="underline" href="/brokers/pricing">Pricing</Link>
        </p>

        <H2>What to do if something feels wrong</H2>
        <Bullets
          items={[
            "Pause the transaction and request verification steps in writing.",
            "Do not send funds until identity and documentation are coherent.",
            "Report the situation through Findaly so patterns can be flagged.",
          ]}
        />
        <p className="mt-4 text-neutral-700 leading-relaxed">
          Next: <Link className="underline" href="/scams">Avoid scams</Link> ·{" "}
          <Link className="underline" href="/report">Report</Link>
        </p>
      </section>
    </main>
  );
}
