"use client";

import Link from "next/link";
import PillarShell, { BulletList, SectionHeading, SectionLabel } from "@/components/pillar/PillarShell";

const toc = [
  { id: "intro", label: "Overview" },
  { id: "basics", label: "Deposits, terms, affordability" },
  { id: "borrower", label: "Borrower profile" },
  { id: "vessel", label: "Vessel suitability" },
  { id: "docs", label: "Documents checklist" },
  { id: "survey", label: "Survey / valuation" },
  { id: "timeline", label: "Typical timeline" },
  { id: "pitfalls", label: "Common pitfalls" },
  { id: "faq", label: "FAQ" },
];

export default function FinanceGuideClient() {
  return (
    <PillarShell
      kicker="Yacht Finance"
      title={
        <>
          Finance a yacht with{" "}
          <span className="text-[#fff86c]">clarity</span>, not guesswork.
        </>
      }
      description="What lenders actually check: deposit, affordability, vessel suitability, documents, survey/valuation and how to keep your case moving."
      heroImage="/finance-hero.jpg"
      heroAlt="Yacht finance guide"
      primaryCta={{ href: "/finance", label: "Explore Findaly Finance" }}
      secondaryCta={{ href: "/services/yacht-finance", label: "Yacht finance services" }}
      pills={["Eligibility", "Documents", "Survey/valuation", "Timeline"]}
      stats={[
        { value: "5 pillars", label: "Deposit, borrower, vessel, docs, survey" },
        { value: "1 checklist", label: "Finance-ready documents" },
        { value: "Less churn", label: "Fewer back-and-forth delays" },
        { value: "Faster closing", label: "When preparation is done early" },
      ]}
      toc={toc}
      asideCta={{
        imageSrc: "/list-boat-cta.jpg",
        imageAlt: "Find services",
        title: "Finance-ready support",
        body: "Survey, legal and insurance services reduce risk and improve lender confidence.",
        button: { href: "/services", label: "Explore services" },
      }}
      explore={[
        { href: "/guides/buying-a-yacht", label: "Buying guide", emoji: "🧭" },
        { href: "/guides/survey-inspection", label: "Survey & inspection", emoji: "🧪" },
        { href: "/services/yacht-finance", label: "Finance services", emoji: "💰" },
        { href: "/services/marine-lawyers", label: "Marine lawyers", emoji: "⚖️" },
        { href: "/services/marine-insurance", label: "Marine insurance", emoji: "🧾" },
      ]}
      faqs={[
        {
          q: "What makes a yacht finance application “strong”?",
          a: "Clear affordability, a sensible deposit, coherent documents, and a vessel that fits lender criteria. Add an independent survey/valuation and approvals move faster.",
        },
        {
          q: "Does the boat itself affect approval?",
          a: "Yes. The vessel is security. Age, condition, market liquidity, location/jurisdiction, and documentation clarity all affect lender appetite.",
        },
        {
          q: "Do I need a survey for finance?",
          a: "Very often, yes. Survey/valuation protects the lender and the buyer. Even when not required, it’s the safest move for the buyer.",
        },
        {
          q: "When should I start finance conversations?",
          a: "Early — before you fall in love with a boat. Indicative finance helps you shortlist realistically and negotiate from strength.",
        },
        {
          q: "Can I finance a charter boat?",
          a: "Sometimes, but criteria can be tighter depending on intended use, insurance, and operator structure. Get clarity early and keep documentation clean.",
        },
      ]}
      bottomCta={{
        kicker: "Make your case finance-ready",
        title: (
          <>
            Move faster by removing{" "}
            <span className="text-[#fff86c]">uncertainty</span>.
          </>
        ),
        body: "Shortlist boats that fit lender criteria, prep documents early, and schedule survey/valuation quickly once an offer is accepted.",
        primary: { href: "/finance", label: "Start with Findaly Finance" },
        secondary: { href: "/guides/buying-a-yacht", label: "Buying playbook" },
      }}
      related={[
        { href: "/guides/buying-a-yacht", label: "Buying a yacht", emoji: "🧭" },
        { href: "/guides/survey-inspection", label: "Survey & inspection", emoji: "🧪" },
        { href: "/services/yacht-finance", label: "Yacht finance services", emoji: "💰" },
        { href: "/services", label: "All services", emoji: "🧰" },
      ]}
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/guides", label: "Guides" },
        { label: "Yacht Finance" },
      ]}
    >
      <section id="intro" className="scroll-mt-28">
        <SectionLabel>Overview</SectionLabel>
        <SectionHeading>Finance is a risk decision — your job is to remove unknowns.</SectionHeading>

        <p>
          Yacht finance is less about “do I like this boat?” and more about “is this a safe, documentable transaction with reliable
          repayment and suitable security?” Lenders want predictable repayment and an asset they can value and resell. Buyers want clarity
          early so they don’t waste weeks chasing boats they can’t fund.
        </p>

        <div className="pull-quote">
          “Strong applications aren’t louder. They’re cleaner: fewer gaps, fewer surprises, more evidence.”
        </div>

        <div className="callout mt-8">
          <p className="mb-0 text-[15px] text-[#0a211f]/75 leading-relaxed">
            The five pillars: deposit + borrower profile + vessel suitability + documentation + independent survey/valuation.
          </p>
        </div>
      </section>

      <section id="basics" className="mt-20 scroll-mt-28">
        <SectionLabel>Deposits, terms, affordability</SectionLabel>
        <SectionHeading>Start with what actually controls approval: deposit and affordability.</SectionHeading>

        <p>
          Your deposit reduces lender risk. Your affordability proves repayment. Term length shapes monthly payment and total interest.
          These three are the spine of your case. If they’re unclear, everything downstream gets slower.
        </p>

        <BulletList
          items={[
            "Deposit: higher deposit typically improves lender comfort and reduces payment stress.",
            "Affordability: stability matters (income consistency, existing commitments, credit behaviour).",
            "Term: longer term can reduce monthly payments but increases total interest paid over time.",
          ]}
        />

        <p className="mt-6">
          Tip: start finance conversations before you become emotionally attached to a specific listing. It keeps your shortlist realistic.
          Pair this with the{" "}
          <Link href="/guides/buying-a-yacht" className="inline-link">Buying guide</Link>.
        </p>
      </section>

      <section id="borrower" className="mt-20 scroll-mt-28">
        <SectionLabel>Borrower profile</SectionLabel>
        <SectionHeading>Lenders fund people first, boats second.</SectionHeading>

        <p>
          The borrower profile is where most approvals are decided. Lenders want to see stable repayment capacity and reasonable
          risk behaviour. A “clean” case tends to have organised documents, consistent narrative, and no last-minute surprises.
        </p>

        <BulletList
          items={[
            "Identity and address evidence: consistent details across all docs.",
            "Income evidence: stable history that supports the monthly payment comfortably.",
            "Existing commitments: credit cards, loans, mortgages — lenders look at total burden.",
            "A coherent story: why this boat, why now, how you’ll use it (personal vs charter).",
          ]}
        />

        <div className="callout mt-8">
          <p className="mb-2 text-[15px] font-semibold text-[#0a211f]">Make it easy to say “yes”</p>
          <p className="mb-0">
            Lenders don’t love ambiguity. Provide what they need up-front, in one organised bundle. That’s how cases move fast.
          </p>
        </div>
      </section>

      <section id="vessel" className="mt-20 scroll-mt-28">
        <SectionLabel>Vessel suitability</SectionLabel>
        <SectionHeading>The boat is security — so suitability matters.</SectionHeading>

        <p>
          Even strong borrowers can be declined if the vessel is hard to value, hard to resell, or poorly documented. In practice, lenders
          care about age, condition, market liquidity, and whether the documentation supports a clean lien/transfer process.
        </p>

        <BulletList
          items={[
            "Condition + maintainability: clear service history reduces risk.",
            "Marketability: common models and liquid segments are easier security.",
            "Jurisdiction and documentation norms: registration/title/VAT clarity matters.",
            "Intended use: charter use can change insurance, income assumptions, and criteria.",
          ]}
        />

        <p className="mt-6">
          This is why survey/valuation and paperwork checks aren’t “extra” — they’re central. Read{" "}
          <Link href="/guides/survey-inspection" className="inline-link">Survey & inspection</Link>.
        </p>
      </section>

      <section id="docs" className="mt-20 scroll-mt-28">
        <SectionLabel>Documents checklist</SectionLabel>
        <SectionHeading>Most delays are paperwork gaps. Avoid them.</SectionHeading>

        <p>
          Finance delays often come from missing documents, inconsistent details, or unclear vessel paperwork. Build your checklist early.
          If you can send a clean bundle once, you remove 80% of back-and-forth.
        </p>

        <div className="mt-8 overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>What you’ll typically need</th>
                <th>Why it matters</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Personal</strong></td>
                <td>ID, proof of address, income evidence, bank statements</td>
                <td>Affordability + identity verification</td>
              </tr>
              <tr>
                <td><strong>Vessel</strong></td>
                <td>Registration, ownership/title chain, VAT evidence where relevant, inventory</td>
                <td>Clean security + transferability</td>
              </tr>
              <tr>
                <td><strong>Transaction</strong></td>
                <td>Sale agreement, broker/seller details, timelines, payment rails</td>
                <td>Process clarity; prevents closing surprises</td>
              </tr>
              <tr>
                <td><strong>Survey/valuation</strong></td>
                <td>Independent survey report and/or valuation</td>
                <td>Condition proof and value confirmation</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-6">
          If anything feels inconsistent, don’t push forward anyway. Pause and use{" "}
          <Link href="/verification" className="inline-link">Verification</Link>{" "}
          and{" "}
          <Link href="/scams" className="inline-link">Avoid scams</Link>.
        </p>
      </section>

      <section id="survey" className="mt-20 scroll-mt-28">
        <SectionLabel>Survey / valuation</SectionLabel>
        <SectionHeading>Independent evidence is what keeps the deal clean.</SectionHeading>

        <p>
          Survey/valuation protects both buyer and lender. It’s the independent view of condition and value. Buyers should treat survey
          as a non-negotiable risk-control step — not a “nice to have”.
        </p>

        <BulletList
          items={[
            "Survey findings can change price, require repairs, or justify walking away.",
            "Sea trial validates function under load: engines, steering, systems working together.",
            "Organise survey quickly after conditional offer acceptance to keep momentum.",
          ]}
        />

        <p className="mt-6">
          Full walkthrough:{" "}
          <Link href="/guides/survey-inspection" className="inline-link">Survey & inspection guide</Link>.
        </p>
      </section>

      <section id="timeline" className="mt-20 scroll-mt-28">
        <SectionLabel>Typical timeline</SectionLabel>
        <SectionHeading>A smooth case is mostly sequencing.</SectionHeading>

        <p>
          The best finance journeys don’t “feel” fast — they’re simply prepared. A typical sequence is: shortlist → indicative finance →
          offer accepted (conditional) → survey/valuation → final approval → closing.
        </p>

        <BulletList
          items={[
            "Get indicative finance early (before you negotiate).",
            "Make offer conditional on survey + paperwork checks.",
            "Schedule survey/valuation quickly once offer is accepted.",
            "Keep all parties aligned: buyer, seller, broker, lender, surveyor, legal.",
          ]}
        />

        <p className="mt-6">
          Align the finance journey with the overall purchase journey in{" "}
          <Link href="/guides/buying-a-yacht" className="inline-link">Buying a yacht</Link>.
        </p>
      </section>

      <section id="pitfalls" className="mt-20 scroll-mt-28">
        <SectionLabel>Common pitfalls</SectionLabel>
        <SectionHeading>Where people lose weeks (and how to avoid it).</SectionHeading>

        <BulletList
          items={[
            "Chasing boats that are hard to finance (age/condition/low liquidity) without checking lender criteria first.",
            "Delaying the survey and then discovering major issues late in the timeline.",
            "Inconsistent identity details across documents (causes compliance delays).",
            "Unclear title/VAT/ownership chain — creates legal risk and lender hesitation.",
            "Rushed closing pressure (often a red flag) — pause and verify instead.",
          ]}
        />

        <div className="callout mt-8">
          <p className="mb-0">
            If you want the biggest speed win: prepare the full document bundle early and treat survey as an immediate next step after
            conditional acceptance.
          </p>
        </div>
      </section>
    </PillarShell>
  );
}
