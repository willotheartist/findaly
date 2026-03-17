import type { Metadata } from "next";
import { Isla40BuyingGuidePageClient } from "./Isla40BuyingGuidePageClient";

export const metadata: Metadata = {
  title: "Fountaine Pajot Isla 40 Buying Guide | Findaly",
  description: "Complete buying guide for the Fountaine Pajot Isla 40. Layouts, prices, what to check and where to find Isla 40s for sale.",
  alternates: { canonical: "/guides/isla-40-buying-guide" },
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
    title: "Fountaine Pajot Isla 40 Buying Guide | Findaly",
    description: "Complete buying guide for the Fountaine Pajot Isla 40. Layouts, prices, what to check and where to find Isla 40s for sale.",
    url: "https://www.findaly.co/guides/isla-40-buying-guide",
    siteName: "Findaly",
    type: "article",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fountaine Pajot Isla 40 Buying Guide | Findaly",
    description: "Complete buying guide for the Fountaine Pajot Isla 40. Layouts, prices, what to check and where to find Isla 40s for sale.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Fountaine Pajot Isla 40 Buying Guide — Layouts, Prices and What to Check</h1>
        <p>Complete buying guide for the Fountaine Pajot Isla 40. Layouts, prices, what to check and where to find Isla 40s for sale.</p>
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
      <Isla40BuyingGuidePageClient />
    </>
  );
}
