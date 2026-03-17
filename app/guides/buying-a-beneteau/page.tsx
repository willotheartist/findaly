// app/guides/buying-a-beneteau/page.tsx
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import BuyingABeneteauClient from "./BuyingABeneteauClient";

export const metadata: Metadata = {
  title: "Buying a Beneteau | Findaly",
  description:
    "A practical 2026 buyer guide for Beneteau yachts — popular models, realistic pricing ranges, what to inspect, and how to buy clean.",
  alternates: { canonical: absoluteUrl("/guides/buying-a-beneteau") },
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
    title: "Buying a Beneteau | Findaly",
    description:
      "A practical 2026 buyer guide for Beneteau yachts — popular models, realistic pricing ranges, what to inspect, and how to buy clean.",
    url: absoluteUrl("/guides/buying-a-beneteau"),
    siteName: "Findaly",
    type: "article",
    images: [{ url: absoluteUrl("/og-findaly.jpg"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buying a Beneteau | Findaly",
    description:
      "A practical 2026 buyer guide for Beneteau yachts — popular models, realistic pricing ranges, what to inspect, and how to buy clean.",
    images: [absoluteUrl("/og-findaly.jpg")],
  },
};

export default function BuyingABeneteauPage() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Buying a Beneteau — Complete Guide</h1>
        <p>Complete guide to buying a Beneteau. Covers Oceanis, First and Swift Trawler ranges, prices, what to check and where to find them.</p>
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
      <BuyingABeneteauClient />
    </>
  );
}