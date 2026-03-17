import type { Metadata } from "next";
import SurveyInspectionClient from "./SurveyInspectionClient";

export const metadata: Metadata = {
  title: "Yacht Survey & Inspection Guide: What’s Checked + Sea Trial Tips | Findaly",
  description:
    "Understand yacht surveys and inspections: what surveyors check, sea trial checklists, common findings, and how to negotiate using the report.",
  alternates: { canonical: "/guides/survey-inspection" },
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
    title: "Yacht Survey & Inspection Guide | Findaly",
    description: "Complete guide to yacht surveys and inspections. What to expect and how to interpret findings.",
    url: "https://www.findaly.co/guides/survey-inspection",
    siteName: "Findaly",
    type: "website",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yacht Survey & Inspection Guide | Findaly",
    description: "Complete guide to yacht surveys and inspections. What to expect and how to interpret findings.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Yacht Survey and Inspection Guide</h1>
        <p>Complete guide to yacht surveys and inspections. What to expect, what surveyors check and how to interpret findings.</p>
        <nav>
          <a href="/">Home</a>
          <a href="/buy">Boats for Sale</a>
          <a href="/buy/sailboats">Sailboats for Sale</a>
          <a href="/buy/motor-yachts">Motor Yachts for Sale</a>
          <a href="/buy/catamarans">Catamarans for Sale</a>
          <a href="/buy/superyachts">Superyachts for Sale</a>
          <a href="/sell">Sell Your Boat</a>
          <a href="/charter">Charter</a>
          <a href="/brokers">Brokers</a>
          <a href="/brokers/join">List as a Broker</a>
          <a href="/guides">Buying Guides</a>
          <a href="/guides/buying-a-yacht">Buying a Yacht Guide</a>
          <a href="/guides/catamaran-buying-guide">Catamaran Buying Guide</a>
          <a href="/guides/motor-yacht-buying-guide">Motor Yacht Buying Guide</a>
          <a href="/finance">Yacht Finance</a>
          <a href="/services">Marine Services</a>
          <a href="/destinations">Destinations</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About</a>
          <a href="/faq">FAQ</a>
        </nav>
      </div>
      <SurveyInspectionClient />
    </>
  );
}
