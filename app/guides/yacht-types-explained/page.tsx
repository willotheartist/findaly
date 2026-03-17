import type { Metadata } from "next";
import { YachtTypesExplainedPageClient } from "./YachtTypesExplainedPageClient";

export const metadata: Metadata = {
  title: "Yacht Types Explained | Findaly",
  description: "A clear guide to yacht types — motor yachts, sailing yachts, catamarans, RIBs and superyachts. Understand which type suits your needs.",
  alternates: { canonical: "/guides/yacht-types-explained" },
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
    title: "Yacht Types Explained | Findaly",
    description: "A clear guide to yacht types — motor yachts, sailing yachts, catamarans, RIBs and superyachts. Understand which type suits your needs.",
    url: "https://www.findaly.co/guides/yacht-types-explained",
    siteName: "Findaly",
    type: "article",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yacht Types Explained | Findaly",
    description: "A clear guide to yacht types — motor yachts, sailing yachts, catamarans, RIBs and superyachts. Understand which type suits your needs.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Yacht Types Explained — Motor Yachts, Catamarans, Sailboats and More</h1>
        <p>A clear guide to yacht types — motor yachts, sailing yachts, catamarans, RIBs and superyachts. Understand which type suits your needs.</p>
        <nav>
          <a href="/">Home</a>
          <a href="/buy">Boats for Sale</a>
          <a href="/buy/catamarans">Catamarans for Sale</a>
          <a href="/buy/sailboats">Sailboats for Sale</a>
          <a href="/buy/motor-yachts">Motor Yachts for Sale</a>
          <a href="/guides">All Buying Guides</a>
          <a href="/guides/buying-a-yacht">Buying a Yacht Guide</a>
          <a href="/guides/catamaran-buying-guide">Catamaran Buying Guide</a>
          <a href="/guides/lagoon-catamaran-buying-guide">Lagoon Catamaran Guide</a>
          <a href="/guides/motor-yacht-buying-guide">Motor Yacht Buying Guide</a>
          <a href="/finance">Yacht Finance</a>
          <a href="/services/yacht-surveyors">Yacht Surveyors</a>
        </nav>
      </div>
      <YachtTypesExplainedPageClient />
    </>
  );
}
