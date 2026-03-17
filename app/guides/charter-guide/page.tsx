import type { Metadata } from "next";
import CharterGuideClient from "./CharterGuideClient";

export const metadata: Metadata = {
  title: "Yacht Charter Guide: Types, Costs, Itineraries & How to Book | Findaly",
  description:
    "Plan a yacht charter with confidence: bareboat vs crewed, costs, deposits, itinerary planning, destination seasonality, and booking checks.",
  alternates: { canonical: "/guides/charter-guide" },
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
    title: "Yacht Charter Guide | Findaly",
    description: "Complete guide to chartering a yacht. Everything you need to know about bareboat and crewed charters.",
    url: "https://www.findaly.co/guides/charter-guide",
    siteName: "Findaly",
    type: "website",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yacht Charter Guide | Findaly",
    description: "Complete guide to chartering a yacht. Everything you need to know about bareboat and crewed charters.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Yacht Charter Guide — How to Charter a Boat</h1>
        <p>Complete guide to chartering a yacht. Everything you need to know about bareboat and crewed charters on Findaly.</p>
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
      <CharterGuideClient />
    </>
  );
}
