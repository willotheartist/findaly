"use client";

import Link from "next/link";
import PillarShell, { BulletList, SectionHeading, SectionLabel } from "@/components/pillar/PillarShell";

const toc = [
  { id: "why", label: "Why charter" },
  { id: "types", label: "Types of charter" },
  { id: "boat", label: "Choosing the boat" },
  { id: "costs", label: "Costs & deposits" },
  { id: "planning", label: "Itinerary planning" },
  { id: "booking", label: "Booking checks" },
  { id: "faq", label: "FAQ" },
];

export default function CharterGuideClient() {
  return (
    <PillarShell
      kicker="Charter Guide"
      title={
        <>
          Charter smarter —{" "}
          <span className="text-[#fff86c]">experience more</span>.
        </>
      }
      description="Bareboat vs crewed, cat vs monohull vs motor, pricing realities, itineraries and booking checks to avoid chaos."
      heroImage="/charter-hero.jpg"
      heroAlt="Yacht charter guide"
      primaryCta={{ href: "/charter", label: "Browse charters" }}
      secondaryCta={{ href: "/destinations", label: "Explore destinations" }}
      pills={["Bareboat vs crewed", "Costs", "Itineraries", "Booking checks"]}
      stats={[
        { value: "50+ regions", label: "From the Med to the Caribbean" },
        { value: "3 models", label: "Bareboat, skippered, crewed" },
        { value: "Less stress", label: "Better planning + checks" },
        { value: "Better fit", label: "Choose the right boat type" },
      ]}
      toc={toc}
      asideCta={{
        imageSrc: "/list-boat-cta.jpg",
        imageAlt: "List your boat",
        title: "List your boat for charter",
        body: "Earn income from your vessel when it’s not in use.",
        button: { href: "/add-listing", label: "List your boat" },
      }}
      explore={[
        { href: "/buy", label: "Buy a yacht", emoji: "🛥️" },
        { href: "/guides/buying-a-yacht", label: "Buying guide", emoji: "🧭" },
        { href: "/guides/yacht-types-explained", label: "Yacht types explained", emoji: "🧭" },
        { href: "/safety", label: "Safety", emoji: "🛟" },
        { href: "/scams", label: "Avoid scams", emoji: "🛡️" },
      ]}
      faqs={[
        { q: "Bareboat vs crewed — what’s the real difference?", a: "Bareboat means you are responsible for navigation and the boat (or you hire a skipper). Crewed includes a professional captain and often crew, so you focus on the experience." },
        { q: "How far in advance should I book?", a: "Peak season fills quickly. For July–August Med and winter Caribbean, booking 3–6 months ahead is common. Shoulder seasons can be more flexible." },
        { q: "What’s included in the price?", a: "Base price covers the vessel; extras vary: fuel, provisioning, marina fees, cleaning, and crew gratuity (often 10–15% for crewed). Always confirm the breakdown." },
        { q: "Can I charter without a sailing licence?", a: "Yes: book crewed or skippered. Some destinations allow certain motorboats with simpler licensing, but don’t assume — confirm with the operator." },
        { q: "Should I charter before buying?", a: "If you’re undecided between cat/monohull/motor or unsure about layout, chartering is the fastest real-world test." },
      ]}
      bottomCta={{
        kicker: "Ready to cast off?",
        title: (
          <>
            Your next voyage{" "}
            <span className="text-[#fff86c]">starts here</span>.
          </>
        ),
        body: "Pick a boat type that matches your crew, plan a flexible itinerary, and book through clear terms.",
        primary: { href: "/charter", label: "Browse charters" },
        secondary: { href: "/destinations", label: "Pick a destination" },
      }}
      related={[
        { href: "/destinations", label: "Destinations", emoji: "🗺️" },
        { href: "/guides/yacht-types-explained", label: "Yacht types explained", emoji: "🧭" },
        { href: "/guides/buying-a-yacht", label: "Buying guide", emoji: "🧭" },
        { href: "/safety", label: "Safety", emoji: "🛟" },
      ]}
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/guides", label: "Guides" },
        { label: "Charter guide" },
      ]}
    >
      <section id="why" className="scroll-mt-28">
        <SectionLabel>Why charter</SectionLabel>
        <SectionHeading>The smartest way to experience life on the water.</SectionHeading>

        <p>
          Charter gives you the lifestyle — the freedom, the destinations, the rhythm of days at anchor — without the maintenance, marina
          commitments, or capital tied up long-term. It’s also the best way to test a boat type before you buy.
        </p>

        <div className="pull-quote">“Why own when you can charter a different yacht in a different destination every year?”</div>
      </section>

      <section id="types" className="mt-20 scroll-mt-28">
        <SectionLabel>Types of charter</SectionLabel>
        <SectionHeading>Every kind of charter, in one place.</SectionHeading>

        <BulletList
          items={[
            "Bareboat: you skipper (or hire a skipper). Freedom, but you own responsibility.",
            "Skippered: flexibility with professional handling — great for groups.",
            "Crewed: premium simplicity — arrive and relax; captain runs the yacht.",
            "Day vs week vs season: match the time horizon to what you want from the trip.",
          ]}
        />
      </section>

      <section id="boat" className="mt-20 scroll-mt-28">
        <SectionLabel>Choosing the boat</SectionLabel>
        <SectionHeading>Comfort vs performance vs cost.</SectionHeading>

        <p>
          Catamarans typically win for space and stability. Monohull sailboats win for sailing feel and often lower costs. Motor yachts win
          for speed and convenience but can increase fuel spend.
        </p>

        <p className="mt-6">
          Start here: <Link href="/guides/yacht-types-explained" className="inline-link">Yacht types explained</Link>.
        </p>
      </section>

      <section id="costs" className="mt-20 scroll-mt-28">
        <SectionLabel>Costs & deposits</SectionLabel>
        <SectionHeading>Ask for the full breakdown.</SectionHeading>

        <BulletList
          items={[
            "Confirm base fee vs extras: fuel, provisioning, marina fees, cleaning, transfers.",
            "Understand deposit terms and damage responsibilities.",
            "If crewed, confirm gratuity expectations and any APA-style provisions.",
          ]}
        />
      </section>

      <section id="planning" className="mt-20 scroll-mt-28">
        <SectionLabel>Itinerary planning</SectionLabel>
        <SectionHeading>Build rhythm, not a rigid schedule.</SectionHeading>

        <BulletList
          items={[
            "Plan for the least experienced person in your crew.",
            "Use one “must-do” per day; leave room for weather changes and surprise bays.",
            "Choose destinations based on vibe: calm cruising, nightlife, culture, or diving.",
          ]}
        />

        <p className="mt-6">
          Explore: <Link href="/destinations" className="inline-link">Destinations</Link>.
        </p>
      </section>

      <section id="booking" className="mt-20 scroll-mt-28">
        <SectionLabel>Booking checks</SectionLabel>
        <SectionHeading>Clarity beats chaos.</SectionHeading>

        <BulletList
          items={[
            "Confirm licensing requirements early (if bareboat).",
            "Request inventory list and check-in procedure in advance.",
            "Avoid rushed payment requests and off-platform pressure — use trust checks.",
          ]}
        />

        <p className="mt-6">
          Trust pages: <Link href="/scams" className="inline-link">Avoid scams</Link> ·{" "}
          <Link href="/verification" className="inline-link">Verification</Link> ·{" "}
          <Link href="/safety" className="inline-link">Safety</Link>
        </p>
      </section>
    </PillarShell>
  );
}
