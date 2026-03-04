"use client";

import Link from "next/link";
import PillarShell, { BulletList, SectionHeading, SectionLabel } from "@/components/pillar/PillarShell";

const toc = [
  { id: "intro", label: "Overview" },
  { id: "budget", label: "Budget & running costs" },
  { id: "boat-type", label: "Choosing the right type" },
  { id: "shortlist", label: "Shortlisting framework" },
  { id: "viewings", label: "Viewings checklist" },
  { id: "survey", label: "Survey & sea trial" },
  { id: "paperwork", label: "Paperwork & title" },
  { id: "negotiation", label: "Negotiation & contract" },
  { id: "closing", label: "Closing safely" },
  { id: "faq", label: "FAQ" },
];

export default function BuyingAYachtClient() {
  return (
    <PillarShell
      kicker="Buying a Yacht"
      title={
        <>
          Buy with confidence — <span className="text-[#fff86c]">not guesswork.</span>
        </>
      }
      description="A practical end-to-end guide: budgeting, shortlisting, viewings, survey & sea trial, paperwork, negotiation, and safe closing."
      heroImage="/hero-buy.jpg"
      heroAlt="Buying a yacht guide"
      primaryCta={{ href: "/buy", label: "Browse boats for sale" }}
      secondaryCta={{ href: "/guides/survey-inspection", label: "Survey & inspection" }}
      pills={["Budget realism", "Viewing checklist", "Paperwork & title", "Safe closing"]}
      stats={[
        { value: "10 steps", label: "From shortlist to safe closing" },
        { value: "3 checklists", label: "Viewing, survey, paperwork" },
        { value: "Risk-first", label: "Reduce expensive surprises" },
        { value: "Evidence-led", label: "Negotiate with facts" },
      ]}
      toc={toc}
      asideCta={{
        imageSrc: "/list-boat-cta.jpg",
        imageAlt: "Findaly services",
        title: "Buying with support",
        body: "Use surveyors, finance and legal services to reduce risk on the biggest steps.",
        button: { href: "/services", label: "Explore services" },
      }}
      explore={[
        { href: "/buy", label: "Boats for sale", emoji: "🛥️" },
        { href: "/guides/finance", label: "Yacht finance", emoji: "💰" },
        { href: "/services/yacht-surveyors", label: "Yacht surveyors", emoji: "🧪" },
        { href: "/scams", label: "Avoid scams", emoji: "🛡️" },
        { href: "/verification", label: "Verification", emoji: "✅" },
      ]}
      faqs={[
        {
          q: "Do I really need a survey if the boat looks great?",
          a: "Yes. A survey turns “looks fine” into evidence. It also protects financing and prevents disputes. If you skip one step, you’re buying uncertainty.",
        },
        {
          q: "How much should I budget beyond the purchase price?",
          a: "It depends on size, usage, and location — but plan for berthing/mooring, insurance, maintenance, haul-outs, servicing, and upgrades. The right budget keeps the boat usable.",
        },
        {
          q: "Is it safer to buy through a broker?",
          a: "Often yes for process and documentation, especially cross-border. But brokers don’t replace independent survey and title/legal checks.",
        },
        {
          q: "What are the biggest red flags?",
          a: "Pressure to pay fast, refusal to share docs, unclear ownership/title chain, inconsistent identity details, and resistance to survey/sea trial.",
        },
        {
          q: "Should I charter before buying?",
          a: "If you’re unsure about boat type or layout, yes. A week onboard teaches you more than any spec sheet.",
        },
      ]}
      bottomCta={{
        kicker: "Ready to start?",
        title: (
          <>
            Browse the market, then buy <span className="text-[#fff86c]">the right way.</span>
          </>
        ),
        body: "Shortlist a few boats, view them with a checklist, and negotiate with evidence. That’s how you get a clean close.",
        primary: { href: "/buy", label: "Browse boats" },
        secondary: { href: "/guides/finance", label: "Understand finance" },
      }}
      related={[
        { href: "/guides/finance", label: "Yacht finance", emoji: "💰" },
        { href: "/guides/survey-inspection", label: "Survey & inspection", emoji: "🧪" },
        { href: "/guides/yacht-types-explained", label: "Yacht types explained", emoji: "🧭" },
        { href: "/services", label: "Services", emoji: "🧰" },
      ]}
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/guides", label: "Guides" },
        { label: "Buying a Yacht" },
      ]}
    >
      <section id="intro" className="scroll-mt-28">
        <SectionLabel>Overview</SectionLabel>
        <SectionHeading>Buying a yacht is a process — not a moment.</SectionHeading>

        <p>
          Most bad yacht purchases don’t happen because someone chose the “wrong” model. They happen because buyers skip steps under
          pressure: they don’t budget realistically, they don’t run a proper inspection, they accept unclear paperwork, or they rush
          payment. This guide makes the journey predictable: clear decision points, repeatable checklists, and a “boring close”.
        </p>

        <div className="pull-quote">
          “The goal isn’t to buy quickly. The goal is to buy safely — and then speed comes naturally.”
        </div>

        <div className="callout mt-8">
          <p className="mb-0 text-[15px] text-[#0a211f]/75 leading-relaxed">
            Fast safe path: shortlist 3–6 boats → view → offer conditional on survey → survey + paperwork checks → negotiate based on
            evidence → close with traceable rails.
          </p>
        </div>
      </section>

      <section id="budget" className="mt-20 scroll-mt-28">
        <SectionLabel>Budget & running costs</SectionLabel>
        <SectionHeading>The purchase price is only the entry ticket.</SectionHeading>

        <p>
          The right budget keeps the boat <strong>usable</strong>, not just purchased. Start with how you’ll use it (day trips,
          weekends, cruising, liveaboard), then match the size and complexity to what you can sustain long-term.
        </p>

        <div className="mt-8 overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Cost area</th>
                <th>What it includes</th>
                <th>Buyer tip</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Berthing / mooring</strong></td>
                <td>Marina fees, winter storage, haul-outs, local rules (varies by region)</td>
                <td>Confirm real seasonal pricing before you commit to a location.</td>
              </tr>
              <tr>
                <td><strong>Insurance</strong></td>
                <td>Hull cover, liability, cruising limits, charter exclusions</td>
                <td>Get a quote early; some boats/areas cost more than expected.</td>
              </tr>
              <tr>
                <td><strong>Maintenance</strong></td>
                <td>Engine service, antifoul, anodes, pumps, electrics, rig checks</td>
                <td>Budget for predictable annual work + occasional big-ticket items.</td>
              </tr>
              <tr>
                <td><strong>Upgrades</strong></td>
                <td>Batteries, solar, nav gear, safety kit, comfort improvements</td>
                <td>Assume you’ll change something in the first 30–90 days. Normal.</td>
              </tr>
              <tr>
                <td><strong>Fuel & consumables</strong></td>
                <td>Fuel, gas, water, onboard supplies</td>
                <td>Motor yachts demand more fuel budget; plan accordingly.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <BulletList
          items={[
            "If financing, get an indicative view early so you negotiate from strength. Start with Yacht finance.",
            "Don’t ignore logistics: where the boat lives determines cost, use frequency, and resale ease.",
            "A low purchase price can be a bad deal if the boat is tired, undocumented, or expensive to berth.",
          ]}
        />

        <p className="mt-6">
          If finance is part of the journey, read{" "}
          <Link href="/guides/finance" className="inline-link">Yacht finance</Link>{" "}
          early — it shapes what boats are eligible and what documents you’ll need later.
        </p>
      </section>

      <section id="boat-type" className="mt-20 scroll-mt-28">
        <SectionLabel>Choosing the right type</SectionLabel>
        <SectionHeading>Boat type is lifestyle: space, stability, performance, cost.</SectionHeading>

        <p>
          Better buyers start with constraints: how many people, where you cruise, draft limitations, whether you care about sailing feel,
          and how your crew handles motion. A boat that fits your crew gets used; a boat that doesn’t becomes “for sale” again.
        </p>

        <div className="callout mt-8">
          <p className="mb-2 text-[15px] font-semibold text-[#0a211f]">Quick decision guide</p>
          <BulletList
            items={[
              "Catamaran: space + stability (families, groups, relaxed cruising).",
              "Monohull sail: sailing feel + often simpler ownership (varies by model).",
              "Motor yacht: speed + convenience (plan fuel and systems complexity).",
            ]}
          />
        </div>

        <p className="mt-6">
          Deeper context:{" "}
          <Link href="/guides/yacht-types-explained" className="inline-link">Yacht types explained</Link>
          {" · "}
          <Link href="/guides/catamaran-buying-guide" className="inline-link">Catamaran buying guide</Link>
          {" · "}
          <Link href="/guides/motor-yacht-buying-guide" className="inline-link">Motor yacht buying guide</Link>
        </p>
      </section>

      <section id="shortlist" className="mt-20 scroll-mt-28">
        <SectionLabel>Shortlisting framework</SectionLabel>
        <SectionHeading>Build a shortlist that prevents emotional mistakes.</SectionHeading>

        <p>
          A shortlist is how you stay rational. If you get attached to one boat too early, you lose negotiation power and tolerate risks
          you shouldn’t. Aim for 3–6 viable options, then negotiate calmly and walk away when you should.
        </p>

        <BulletList
          items={[
            "Non-negotiables: length range, cabins, draft limits, region, budget ceiling.",
            "Comfort needs: generator, A/C, watermaker, solar, dinghy/outboard, etc.",
            "Red flags: unclear title, pressure tactics, refusal of survey/sea trial.",
            "Prefer listings with coherent specs, strong photo sets, and clear seller identity.",
          ]}
        />

        <p className="mt-6">
          Use your browse routes:{" "}
          <Link href="/buy/brand" className="inline-link">by brand</Link>{" "}
          or{" "}
          <Link href="/buy/model" className="inline-link">by model</Link>{" "}
          then narrow by year and country.
        </p>
      </section>

      <section id="viewings" className="mt-20 scroll-mt-28">
        <SectionLabel>Viewings checklist</SectionLabel>
        <SectionHeading>A viewing is an inspection — not a tour.</SectionHeading>

        <p>
          Your first viewing should focus on risk, not romance. Use a consistent checklist so you can compare boats fairly and stop
          time-wasting early.
        </p>

        <div className="callout mt-8">
          <p className="mb-2 text-[15px] font-semibold text-[#0a211f]">Fast viewing checklist</p>
          <BulletList
            items={[
              "Deck & exterior: cracks, soft spots, standing water, poor sealing around fittings.",
              "Engine room: leaks, corrosion, hose condition, access for servicing.",
              "Electrics: batteries/charging, wiring tidiness, electronics age/function.",
              "Plumbing: heads, pumps, leaks, damp around bulkheads.",
              "Interior: smells, mold, stains, unexplained repairs, misaligned doors.",
              "Docs snapshot: ask what exists before you negotiate — don’t wait.",
            ]}
          />
        </div>

        <p className="mt-6">
          Next:{" "}
          <Link href="/guides/survey-inspection" className="inline-link">Survey & inspection</Link>{" "}
          is where the purchase becomes safe.
        </p>
      </section>

      <section id="survey" className="mt-20 scroll-mt-28">
        <SectionLabel>Survey & sea trial</SectionLabel>
        <SectionHeading>This step turns risk into numbers.</SectionHeading>

        <p>
          The survey is your independent safety net. It validates structure and systems, highlights deficiencies, and gives you a
          negotiation foundation based on evidence. A sea trial tests function under load: engines, steering, handling, and systems
          working together.
        </p>

        <BulletList
          items={[
            "Use an independent surveyor — not chosen by the seller.",
            "Treat findings as negotiation levers: price adjustment, repairs, or walk-away.",
            "If financing, lenders often require survey/valuation evidence before final approval.",
          ]}
        />

        <p className="mt-6">
          Full guide:{" "}
          <Link href="/guides/survey-inspection" className="inline-link">Survey & inspection</Link>.
        </p>
      </section>

      <section id="paperwork" className="mt-20 scroll-mt-28">
        <SectionLabel>Paperwork & title</SectionLabel>
        <SectionHeading>Documentation is where deals quietly die.</SectionHeading>

        <p>
          Paperwork isn’t exciting — but it’s the difference between a clean close and months of stress. When documentation is unclear,
          you don’t know what you’re buying, who owns it, or whether liens exist.
        </p>

        <div className="callout mt-8">
          <p className="mb-2 text-[15px] font-semibold text-[#0a211f]">Ask for these early</p>
          <BulletList
            items={[
              "Registration + proof of ownership/title chain.",
              "VAT status evidence where relevant (varies by jurisdiction).",
              "Inventory list: what is included in the sale.",
              "Service history: engine servicing, major refits, invoices if possible.",
              "Lien/finance status: confirm whether it exists and how it clears at closing.",
            ]}
          />
        </div>

        <p className="mt-6">
          Trust flow:{" "}
          <Link href="/scams" className="inline-link">Avoid scams</Link>{" "}
          and{" "}
          <Link href="/verification" className="inline-link">Verification</Link>.
        </p>
      </section>

      <section id="negotiation" className="mt-20 scroll-mt-28">
        <SectionLabel>Negotiation & contract</SectionLabel>
        <SectionHeading>Negotiate with evidence, not vibes.</SectionHeading>

        <p>
          The strongest negotiation position is prepared + alternatives + facts. Use survey findings, comparable listings, seasonality,
          and documentation clarity as your backbone.
        </p>

        <BulletList
          items={[
            "Make offers conditional on survey + paperwork checks. That’s normal in serious deals.",
            "Benchmark with comps, then adjust for condition, inventory, and location.",
            "Be explicit in contracts: inclusions, timelines, conditions, and failure modes.",
          ]}
        />

        <p className="mt-6">
          Helpful services:{" "}
          <Link href="/services/marine-lawyers" className="inline-link">Marine lawyers</Link>{" "}
          and{" "}
          <Link href="/services/marine-insurance" className="inline-link">Marine insurance</Link>.
        </p>
      </section>

      <section id="closing" className="mt-20 scroll-mt-28">
        <SectionLabel>Closing safely</SectionLabel>
        <SectionHeading>Closing should be boring. That’s the safety signal.</SectionHeading>

        <p>
          A safe close is structured, documented, and traceable. Most disputes and scams cluster around payment and handover: unusual bank
          details, last-minute changes, rushed timelines, and “special arrangements.”
        </p>

        <BulletList
          items={[
            "Avoid rushed payment instructions. Keep a full paper trail.",
            "Verify identity and authority to sell before funds move.",
            "Confirm insurance activation timing and handover conditions.",
            "Use survey findings to ensure the delivered boat matches agreed condition.",
          ]}
        />

        <p className="mt-6">
          Trust hub:{" "}
          <Link href="/scams" className="inline-link">Avoid scams</Link>{" "}
          ·{" "}
          <Link href="/verification" className="inline-link">Verification</Link>{" "}
          ·{" "}
          <Link href="/safety" className="inline-link">Safety</Link>
        </p>
      </section>
    </PillarShell>
  );
}
