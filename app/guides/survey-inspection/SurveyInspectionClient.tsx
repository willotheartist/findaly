"use client";

import Link from "next/link";
import PillarShell, { BulletList, SectionHeading, SectionLabel } from "@/components/pillar/PillarShell";

const toc = [
  { id: "intro", label: "Overview" },
  { id: "what", label: "What a survey covers" },
  { id: "trial", label: "Sea trial checklist" },
  { id: "findings", label: "Common findings" },
  { id: "severity", label: "Severity framework" },
  { id: "negotiate", label: "Negotiation" },
  { id: "seller", label: "If you’re selling" },
  { id: "faq", label: "FAQ" },
];

export default function SurveyInspectionClient() {
  return (
    <PillarShell
      kicker="Survey & Inspection"
      title={
        <>
          Turn “looks good” into{" "}
          <span className="text-[#fff86c]">evidence</span>.
        </>
      }
      description="What surveyors check, how sea trials work, how to interpret findings, and how to negotiate with a survey report."
      heroImage="/guides/yacht-types.jpg"
      heroAlt="Survey and inspection guide"
      primaryCta={{ href: "/services/yacht-surveyors", label: "Find surveyors" }}
      secondaryCta={{ href: "/buy", label: "Browse boats" }}
      pills={["Hull & structure", "Systems", "Sea trial", "Negotiation"]}
      stats={[
        { value: "1 goal", label: "Reduce uncertainty before you commit" },
        { value: "2 parts", label: "Survey + sea trial" },
        { value: "3 outcomes", label: "Fix, discount, or walk away" },
        { value: "Cleaner closing", label: "Fewer last-minute surprises" },
      ]}
      toc={toc}
      asideCta={{
        imageSrc: "/list-boat-cta.jpg",
        imageAlt: "Services",
        title: "Build a safer deal",
        body: "Survey + paperwork checks + insurance alignment = fewer disputes and cleaner closing.",
        button: { href: "/services", label: "Explore services" },
      }}
      explore={[
        { href: "/guides/buying-a-yacht", label: "Buying guide", emoji: "🧭" },
        { href: "/guides/finance", label: "Finance guide", emoji: "💰" },
        { href: "/verification", label: "Verification", emoji: "✅" },
        { href: "/scams", label: "Avoid scams", emoji: "🛡️" },
        { href: "/services/marine-lawyers", label: "Marine lawyers", emoji: "⚖️" },
      ]}
      faqs={[
        {
          q: "What’s the difference between a survey and a sea trial?",
          a: "A survey is a structured inspection of condition and systems. A sea trial tests function under load: engines, steering, handling, electronics, and real-world performance.",
        },
        {
          q: "Can I use the survey report to renegotiate price?",
          a: "Yes. That’s normal. Use evidence: severity, quotes for fixes, and comparables. Your options are discount, seller repairs, or walk away.",
        },
        {
          q: "Do sellers ever provide a recent survey?",
          a: "Sometimes. It can help, but buyers should still ensure it’s independent, relevant, and reflects current condition. A fresh buyer-commissioned survey is often safer.",
        },
        {
          q: "What are the biggest deal-killers?",
          a: "Structural issues, severe corrosion, unsafe electrics, major engine problems, and documentation gaps that prevent clean title transfer.",
        },
        {
          q: "Does finance usually require a survey/valuation?",
          a: "Very often. Lenders want independent evidence of condition and value. Even when optional, it’s smart buyer protection.",
        },
      ]}
      bottomCta={{
        kicker: "Next step",
        title: (
          <>
            Use the survey to buy{" "}
            <span className="text-[#fff86c]">confidently</span>.
          </>
        ),
        body: "Offer conditional on survey and paperwork checks, then move fast once evidence is clean.",
        primary: { href: "/guides/buying-a-yacht", label: "Buying playbook" },
        secondary: { href: "/guides/finance", label: "Finance guide" },
      }}
      related={[
        { href: "/guides/buying-a-yacht", label: "Buying a yacht", emoji: "🧭" },
        { href: "/guides/finance", label: "Yacht finance", emoji: "💰" },
        { href: "/services/yacht-surveyors", label: "Surveyors", emoji: "🧪" },
        { href: "/services", label: "Services", emoji: "🧰" },
      ]}
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/guides", label: "Guides" },
        { label: "Survey & Inspection" },
      ]}
    >
      <section id="intro" className="scroll-mt-28">
        <SectionLabel>Overview</SectionLabel>
        <SectionHeading>The survey is your risk-control tool.</SectionHeading>

        <p>
          A yacht survey is not bureaucracy — it’s independent evidence. It converts “the boat feels fine” into a structured assessment of
          hull integrity, systems, safety, and maintainability. The sea trial then validates real-world function under load.
        </p>

        <div className="pull-quote">
          “If the survey kills the deal, the deal needed killing.”
        </div>

        <div className="callout mt-8">
          <p className="mb-0">
            Your three outcomes: fix-before-close, discount, or walk away. The report gives you leverage and clarity.
          </p>
        </div>
      </section>

      <section id="what" className="mt-20 scroll-mt-28">
        <SectionLabel>What a survey covers</SectionLabel>
        <SectionHeading>Structure, systems, safety, and value.</SectionHeading>

        <p>
          Survey scope varies by boat type and region, but the intent is consistent: confirm structural integrity, identify defects and
          risks, and document condition so you can decide rationally.
        </p>

        <BulletList
          items={[
            "Hull & deck: structure, fittings, through-hulls, moisture indicators, impact signs.",
            "Rig & sails (sailboats): mast, standing rigging, chainplates, deck hardware, sail condition.",
            "Engines & propulsion: leaks, mounts, cooling, exhaust, prop/shaft, service history.",
            "Electrical & plumbing: batteries/charging, wiring quality, pumps, heads, tanks, leaks.",
            "Safety: navigation lights, bilge systems, fire extinguishers, gas systems, life-saving gear.",
          ]}
        />

        <p className="mt-6">
          Want the broader purchase journey?{" "}
          <Link href="/guides/buying-a-yacht" className="inline-link">Buying a yacht</Link>.
        </p>
      </section>

      <section id="trial" className="mt-20 scroll-mt-28">
        <SectionLabel>Sea trial checklist</SectionLabel>
        <SectionHeading>Test function under load.</SectionHeading>

        <p>
          Sea trials expose issues that static inspections don’t: overheating, vibration, steering behaviour, electronics quirks, and how
          systems work together. Treat it like a checklist, not a cruise.
        </p>

        <div className="callout mt-8">
          <p className="mb-2 text-[15px] font-semibold text-[#0a211f]">Sea trial priorities</p>
          <BulletList
            items={[
              "Engines: start behaviour, temps, smoke, vibration, response at different RPMs.",
              "Steering/handling: turning, reverse control, thrusters, helm response.",
              "Systems: navigation electronics, autopilot, pumps, heads, generator (if any).",
              "Leaks/noise: listen for unusual noise and check bilges after running.",
            ]}
          />
        </div>
      </section>

      <section id="findings" className="mt-20 scroll-mt-28">
        <SectionLabel>Common findings</SectionLabel>
        <SectionHeading>Most reports are a mix of minor and meaningful.</SectionHeading>

        <p>
          Buyers often panic when they see a long list. That’s normal — most boats have a list. Your job is to separate “maintenance” from
          “risk”.
        </p>

        <BulletList
          items={[
            "Minor: anodes, tired batteries, cosmetic issues, expired safety items — negotiation leverage.",
            "Important: corrosion, unsafe wiring, recurring leaks, rigging concerns — needs quotes and follow-up.",
            "Critical: structural concerns, major engine issues, documentation gaps — pause or walk away.",
          ]}
        />

        <p className="mt-6">
          If you’re financing, align with the lender early:{" "}
          <Link href="/guides/finance" className="inline-link">Finance guide</Link>.
        </p>
      </section>

      <section id="severity" className="mt-20 scroll-mt-28">
        <SectionLabel>Severity framework</SectionLabel>
        <SectionHeading>How to interpret “findings” like a pro.</SectionHeading>

        <div className="mt-8 overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Severity</th>
                <th>What it means</th>
                <th>Typical response</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Low</strong></td>
                <td>Maintenance items, cosmetic wear, easy fixes</td>
                <td>Minor discount or accept as ownership reality</td>
              </tr>
              <tr>
                <td><strong>Medium</strong></td>
                <td>Fixable issues with real cost (pumps, wiring tidiness, leaks)</td>
                <td>Get quotes; negotiate discount or seller repair</td>
              </tr>
              <tr>
                <td><strong>High</strong></td>
                <td>Safety-critical, major systems, structural, severe corrosion</td>
                <td>Specialist inspection; either major concession or walk away</td>
              </tr>
              <tr>
                <td><strong>Deal-breaker</strong></td>
                <td>Unclear title/liens, severe structure issues, cannot be safely resolved</td>
                <td>Walk away — protect your future self</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-6">
          Documentation risk matters as much as mechanical risk. Use{" "}
          <Link href="/verification" className="inline-link">Verification</Link>{" "}
          and{" "}
          <Link href="/scams" className="inline-link">Avoid scams</Link>{" "}
          when anything feels inconsistent.
        </p>
      </section>

      <section id="negotiate" className="mt-20 scroll-mt-28">
        <SectionLabel>Negotiation</SectionLabel>
        <SectionHeading>Use evidence, then choose your outcome.</SectionHeading>

        <p>
          Negotiation isn’t “haggling” — it’s aligning price to condition. Use quotes where possible. Be clear: you want either a discount,
          seller repairs before close, or specific conditions in the contract.
        </p>

        <BulletList
          items={[
            "Ask for quotes for big items; negotiate from real costs, not vague fear.",
            "Don’t accept “it’s normal” for safety-critical issues — safety is non-negotiable.",
            "If uncertainty remains high, walking away is often the best financial decision.",
          ]}
        />
      </section>

      <section id="seller" className="mt-20 scroll-mt-28">
        <SectionLabel>If you’re selling</SectionLabel>
        <SectionHeading>Prepared sellers close faster.</SectionHeading>

        <p>
          Sellers who provide coherent docs, service history, and honest condition notes reduce friction. Buyers trust clarity. That trust
          turns into fewer time-wasters and less last-minute re-trading.
        </p>

        <BulletList
          items={[
            "Prepare docs: registration, ownership chain, VAT evidence, service history, inventory list.",
            "Fix obvious issues before listing; buyers discount hard when they see neglect.",
            "Read: Selling a yacht for listing and enquiry best practices.",
          ]}
        />

        <p className="mt-6">
          Continue:{" "}
          <Link href="/guides/selling-a-yacht" className="inline-link">Selling a yacht</Link>.
        </p>
      </section>
    </PillarShell>
  );
}
