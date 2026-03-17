import type { Metadata } from "next";
import { LagoonCatamaranBuyingGuidePageClient } from "./LagoonCatamaranBuyingGuidePageClient";

export const metadata: Metadata = {
  title: "Lagoon Catamaran Buying Guide | Findaly",
  description: "Expert buying guide for Lagoon catamarans. Compare Lagoon 40, 42, 46 and 450 models, prices, layouts and what to check before buying.",
  alternates: { canonical: "/guides/lagoon-catamaran-buying-guide" },
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
    title: "Lagoon Catamaran Buying Guide | Findaly",
    description: "Expert buying guide for Lagoon catamarans. Compare Lagoon 40, 42, 46 and 450 models, prices, layouts and what to check before buying.",
    url: "https://www.findaly.co/guides/lagoon-catamaran-buying-guide",
    siteName: "Findaly",
    type: "article",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lagoon Catamaran Buying Guide | Findaly",
    description: "Expert buying guide for Lagoon catamarans. Compare Lagoon 40, 42, 46 and 450 models, prices, layouts and what to check before buying.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Lagoon Catamaran Buying Guide — Models, Prices and What to Check</h1>
        <p>Expert buying guide for Lagoon catamarans. Compare Lagoon 40, 42, 46 and 450 models, prices, layouts and what to check before buying.</p>
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
      <LagoonCatamaranBuyingGuidePageClient />
    </>
  );
}
