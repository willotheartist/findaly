import type { Metadata } from "next";
import { UsedBeneteauChecklistPageClient } from "./UsedBeneteauChecklistPageClient";

export const metadata: Metadata = {
  title: "Used Beneteau Buying Checklist | Findaly",
  description: "Essential checklist for buying a used Beneteau. What to inspect, common issues to look for and how to negotiate a fair price.",
  alternates: { canonical: "/guides/used-beneteau-checklist" },
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
    title: "Used Beneteau Buying Checklist | Findaly",
    description: "Essential checklist for buying a used Beneteau. What to inspect, common issues to look for and how to negotiate a fair price.",
    url: "https://www.findaly.co/guides/used-beneteau-checklist",
    siteName: "Findaly",
    type: "article",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Used Beneteau Buying Checklist | Findaly",
    description: "Essential checklist for buying a used Beneteau. What to inspect, common issues to look for and how to negotiate a fair price.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Used Beneteau Buying Checklist — What to Inspect Before You Buy</h1>
        <p>Essential checklist for buying a used Beneteau. What to inspect, common issues to look for and how to negotiate a fair price.</p>
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
      <UsedBeneteauChecklistPageClient />
    </>
  );
}
