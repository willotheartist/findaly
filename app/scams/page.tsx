import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Avoid Yacht Scams: Red Flags, Safe Payments, and What to Verify | Findaly",
  description:
    "Learn common yacht scams and how to avoid them. Red flags, safe payment practices, document checks and what to do if you suspect fraud.",
  alternates: { canonical: "/scams" },
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
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Avoid scams</h1>
      <p className="mt-5 text-lg leading-relaxed text-neutral-700">
        The pattern is consistent: pressure, urgency, and unusual payment instructions. If a deal tries to bypass normal process,
        treat it as risk until proven safe. Use this checklist to protect yourself.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/verification" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Verification process
        </Link>
        <Link href="/safety" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Safety hub
        </Link>
        <Link href="/report" className="rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium hover:bg-neutral-50">
          Report an issue
        </Link>
      </div>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-8">
        <p className="text-sm font-semibold">Fast rule</p>
        <p className="mt-3 text-neutral-700 leading-relaxed">
          If you’re being rushed to pay, pushed off-platform, or given “special” bank instructions — pause. Real sellers and brokers
          will tolerate reasonable verification steps.
        </p>
      </section>

      <section>
        <H2>High-risk red flags</H2>
        <Bullets
          items={[
            "Price is far below market with vague explanation (“urgent sale”, “moving abroad”).",
            "Seller refuses calls/video, avoids questions, or changes story and identity details.",
            "You’re asked to pay a deposit to “hold it” before viewing, survey, or documents.",
            "Payment requested to unrelated third party or a different country than expected.",
            "Pressure tactics: “many buyers, pay today”, unusual deadlines, emotional manipulation.",
          ]}
        />

        <H2>Safe buying practices</H2>
        <Bullets
          items={[
            "Insist on a viewing/verification route. Ask for recent dated photos/video if remote.",
            "Use independent surveyors; treat the survey as non-negotiable on serious purchases.",
            "Verify ownership/title chain and registration details; confirm seller authority to sell.",
            "Keep communications and docs organised; do not accept last-minute contract changes.",
          ]}
        />
        <p className="mt-4 text-neutral-700 leading-relaxed">
          Pair this with: <Link className="underline" href="/guides/buying-a-yacht">Buying a yacht</Link> and{" "}
          <Link className="underline" href="/guides/survey-inspection">Survey guide</Link>.
        </p>

        <H2>What to do if you suspect fraud</H2>
        <Bullets
          items={[
            "Stop payment and do not send further funds.",
            "Document everything: screenshots, emails, bank details, listing URL, messages.",
            "Report via Findaly and relevant local authorities if funds were transferred.",
          ]}
        />
        <p className="mt-4 text-neutral-700 leading-relaxed">
          Next steps: <Link className="underline" href="/report">Report</Link> ·{" "}
          <Link className="underline" href="/support">Support</Link> ·{" "}
          <Link className="underline" href="/contact">Contact</Link>
        </p>
      </section>
    </main>
  );
}
