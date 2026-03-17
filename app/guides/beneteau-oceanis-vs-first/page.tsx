import type { Metadata } from "next";
import { OceanisVsFirstGuidePageClient } from "./OceanisVsFirstGuidePageClient";

export const metadata: Metadata = {
  title: "Beneteau Oceanis vs First: Which to Buy? | Findaly",
  description: "Beneteau Oceanis vs First comparison guide. Understand the differences in design, performance, price and what each range is best suited for.",
  alternates: { canonical: "/guides/beneteau-oceanis-vs-first" },
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
    title: "Beneteau Oceanis vs First: Which to Buy? | Findaly",
    description: "Beneteau Oceanis vs First comparison guide. Understand the differences in design, performance, price and what each range is best suited for.",
    url: "https://www.findaly.co/guides/beneteau-oceanis-vs-first",
    siteName: "Findaly",
    type: "article",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beneteau Oceanis vs First: Which to Buy? | Findaly",
    description: "Beneteau Oceanis vs First comparison guide. Understand the differences in design, performance, price and what each range is best suited for.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Beneteau Oceanis vs First — Which Should You Buy?</h1>
        <p>Beneteau Oceanis vs First comparison guide. Understand the differences in design, performance, price and what each range is best suited for.</p>
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
      <OceanisVsFirstGuidePageClient />
    </>
  );
}
