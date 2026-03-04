"use client";

import Link from "next/link";
import PillarShell, { BulletList, SectionHeading, SectionLabel } from "@/components/pillar/PillarShell";

const toc = [
  { id: "intro", label: "Overview" },
  { id: "pricing", label: "Pricing" },
  { id: "prep", label: "Preparation" },
  { id: "photos", label: "Photo shotlist" },
  { id: "listing", label: "Listing that converts" },
  { id: "enquiries", label: "Enquiries & viewings" },
  { id: "negotiation", label: "Negotiation & contract" },
  { id: "closing", label: "Closing safely" },
  { id: "faq", label: "FAQ" },
];

export default function SellingAYachtClient() {
  return (
    <PillarShell
      kicker="Selling a Yacht"
      title={
        <>
          Sell faster by selling{" "}
          <span className="text-[#fff86c]">confidence</span>.
        </>
      }
      description="A seller playbook: pricing, prep, photo shotlist, listing structure, enquiries, negotiation and safe closing."
      heroImage="/sell-hero.jpg"
      heroAlt="Selling a yacht"
      primaryCta={{ href: "/add-listing", label: "Create a listing" }}
      secondaryCta={{ href: "/brokers", label: "Work with brokers" }}
      pills={["Pricing realism", "Listing quality", "Buyer trust", "Clean closing"]}
      stats={[
        { value: "1 goal", label: "Reduce buyer uncertainty" },
        { value: "10 photos+", label: "Show condition clearly" },
        { value: "Fewer time-wasters", label: "Qualify enquiries" },
        { value: "Clean close", label: "Docs ready early" },
      ]}
      toc={toc}
      asideCta={{
        imageSrc: "/list-boat-cta.jpg",
        imageAlt: "List your boat",
        title: "List properly",
        body: "A strong listing is clear specs + honest condition + great photos. That’s what converts.",
        button: { href: "/add-listing", label: "List your boat" },
      }}
      explore={[
        { href: "/sell", label: "Sell overview", emoji: "🏷️" },
        { href: "/brokers", label: "Brokers", emoji: "🤝" },
        { href: "/verification", label: "Verification", emoji: "✅" },
        { href: "/scams", label: "Avoid scams", emoji: "🛡️" },
        { href: "/buy", label: "Browse comps", emoji: "🛥️" },
      ]}
      faqs={[
        { q: "Should I price high and negotiate down?", a: "Usually no. Overpricing reduces enquiries and makes listings go stale. A realistic price attracts serious buyers and gives you cleaner negotiating leverage." },
        { q: "What photos matter most?", a: "Exterior angles, helm, saloon, galley, cabins, heads, engine room, and any key upgrades. Consistency beats quantity." },
        { q: "Do I need documents ready before listing?", a: "Yes. Documentation delays kill momentum. A prepared seller feels safer, and safer listings convert." },
        { q: "Should I use a broker?", a: "Often helpful for negotiation and cross-border process. You still need strong photos, clear specs, and a coherent story." },
        { q: "What’s the safest way to close?", a: "Keep payment traceable, keep terms written, align inventory list, and avoid rushed last-minute changes. Use trust pages if something feels off." },
      ]}
      bottomCta={{
        kicker: "Ready to list?",
        title: (
          <>
            Turn your listing into a{" "}
            <span className="text-[#fff86c]">buyer magnet</span>.
          </>
        ),
        body: "Price realistically, show condition clearly, and keep paperwork clean. That’s how you sell without drama.",
        primary: { href: "/add-listing", label: "Create a listing" },
        secondary: { href: "/buy", label: "Browse comps" },
      }}
      related={[
        { href: "/guides/buying-a-yacht", label: "Buying guide", emoji: "🧭" },
        { href: "/guides/survey-inspection", label: "Survey & inspection", emoji: "🧪" },
        { href: "/verification", label: "Verification", emoji: "✅" },
        { href: "/scams", label: "Avoid scams", emoji: "🛡️" },
      ]}
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/guides", label: "Guides" },
        { label: "Selling a Yacht" },
      ]}
    >
      <section id="intro" className="scroll-mt-28">
        <SectionLabel>Overview</SectionLabel>
        <SectionHeading>Most yacht listings don’t fail because the boat is bad.</SectionHeading>

        <p>
          Listings fail because the buyer can’t trust what they’re seeing: vague specs, weak photos, unclear history, missing documents,
          and pricing that doesn’t match the market. The fix is simple — but not “easy”: be precise, show condition honestly, and remove
          uncertainty early.
        </p>

        <div className="pull-quote">
          “You’re not selling a boat. You’re selling confidence: condition, history, and paperwork.”
        </div>

        <div className="callout mt-8">
          <p className="mb-0">
            If you want the fastest uplift: price realistically, publish a consistent photo set, and have docs ready before enquiries
            arrive.
          </p>
        </div>
      </section>

      <section id="pricing" className="mt-20 scroll-mt-28">
        <SectionLabel>Pricing</SectionLabel>
        <SectionHeading>Pricing is positioning, not wishful thinking.</SectionHeading>

        <p>
          Overpriced listings get fewer enquiries; fewer enquiries makes the listing feel stale; stale listings get lowball offers. Use
          comparable listings and adjust for condition, inventory, service history, and location.
        </p>

        <BulletList
          items={[
            "Compare like-for-like: year, engine hours, refit quality, electronics, inventory, region.",
            "Price for attention: you want serious enquiries, not “maybe later”.",
            "Use survey evidence (if recent) to justify premium condition — otherwise expect pushback.",
          ]}
        />

        <p className="mt-6">
          Use Findaly comps: browse similar boats in{" "}
          <Link href="/buy" className="inline-link">Boats for sale</Link>.
        </p>
      </section>

      <section id="prep" className="mt-20 scroll-mt-28">
        <SectionLabel>Preparation</SectionLabel>
        <SectionHeading>Clean + organised beats “we’ll explain later”.</SectionHeading>

        <p>
          Buyers judge with their eyes first. Remove clutter, deep clean, fix obvious defects, and collect documentation before the first
          enquiry. A prepared boat presents as “loved” and “ready”.
        </p>

        <BulletList
          items={[
            "Declutter and stage: make cabins feel usable and spacious.",
            "Fix small defects: leaks, dead lights, broken latches, tired ropes.",
            "Prepare docs now: registration, ownership chain, VAT evidence, service history, inventory list.",
          ]}
        />
      </section>

      <section id="photos" className="mt-20 scroll-mt-28">
        <SectionLabel>Photo shotlist</SectionLabel>
        <SectionHeading>Your photos are your first survey.</SectionHeading>

        <p>
          Strong photos reduce time-wasters and increase buyer trust. Aim for bright, wide, consistent images that show layout and
          condition without hiding flaws.
        </p>

        <div className="callout mt-8">
          <p className="mb-2 text-[15px] font-semibold text-[#0a211f]">Minimum shotlist</p>
          <BulletList
            items={[
              "Exterior: bow/stern, both sides, deck, cockpit, swim platform, helm.",
              "Interior: saloon, galley, cabins, heads (and any key storage areas).",
              "Systems: engine room (cleanly), nav station/helm electronics, batteries/charging if accessible.",
              "Details: upgrades, sails/rig (if sail), tender/outboard, notable features.",
            ]}
          />
        </div>
      </section>

      <section id="listing" className="mt-20 scroll-mt-28">
        <SectionLabel>Listing that converts</SectionLabel>
        <SectionHeading>Answer objections before the buyer asks.</SectionHeading>

        <p>
          Your listing should be coherent: specs, layout, condition notes, and what’s included. Be transparent. You don’t need to “sell”
          — clarity sells.
        </p>

        <BulletList
          items={[
            "Specs: length/beam/draft, engines, fuel/water, year, location, cabins/berths.",
            "Condition notes: what’s been serviced, what’s new, what’s due soon.",
            "Inventory list: what is included in the sale — be explicit.",
            "Story: who is this boat perfect for (cruising, family, charter, etc.).",
          ]}
        />
      </section>

      <section id="enquiries" className="mt-20 scroll-mt-28">
        <SectionLabel>Enquiries & viewings</SectionLabel>
        <SectionHeading>Qualify without being difficult.</SectionHeading>

        <p>
          Serious buyers ask specific questions. Your job is to respond with clarity and keep the process structured. Share the inventory
          list early, offer viewing slots, and align on survey process upfront.
        </p>

        <BulletList
          items={[
            "Ask: intended use, budget range, timeline, experience level (helps qualify).",
            "Share: service highlights and known issues early (builds trust).",
            "Expect survey requests; confident sellers don’t resist reasonable checks.",
          ]}
        />
      </section>

      <section id="negotiation" className="mt-20 scroll-mt-28">
        <SectionLabel>Negotiation & contract</SectionLabel>
        <SectionHeading>Keep it evidence-led and written.</SectionHeading>

        <p>
          Negotiations go sideways when terms are vague. Agree conditions, timelines, and inclusions in writing. If buyers want concessions
          after survey, ask for quotes or clear severity rationale.
        </p>

        <BulletList
          items={[
            "Define conditions: survey outcome, paperwork checks, financing (if relevant).",
            "Be explicit on inclusions: tender, electronics, spares, safety gear.",
            "Use marine legal help for cross-border deals or complex ownership/title chains.",
          ]}
        />
      </section>

      <section id="closing" className="mt-20 scroll-mt-28">
        <SectionLabel>Closing safely</SectionLabel>
        <SectionHeading>Closing should feel boring.</SectionHeading>

        <p>
          Keep payments traceable, avoid last-minute bank detail changes, and don’t tolerate pressure tactics. If anything feels off,
          pause and use the trust playbooks.
        </p>

        <BulletList
          items={[
            "Use traceable payment rails and keep full paperwork trail.",
            "Confirm buyer identity and keep communication consistent.",
            "Use trust pages when anything feels rushed or “special”.",
          ]}
        />

        <p className="mt-6">
          Trust:{" "}
          <Link href="/verification" className="inline-link">Verification</Link>{" "}
          ·{" "}
          <Link href="/scams" className="inline-link">Avoid scams</Link>{" "}
          ·{" "}
          <Link href="/safety" className="inline-link">Safety</Link>
        </p>
      </section>
    </PillarShell>
  );
}
