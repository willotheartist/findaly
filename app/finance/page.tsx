// app/finance/page.tsx
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import FinanceClient from "./FinanceClient";

export const metadata: Metadata = {
  title: "Yacht Finance | Findaly",
  description:
    "Marine finance options for every vessel and every budget. Understand deposits, terms, surveys, and loan types before you make an offer.",
  alternates: { canonical: absoluteUrl("/finance") },
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
    title: "Yacht Finance | Findaly",
    description:
      "Marine finance options for every vessel and every budget. Understand deposits, terms, surveys, and loan types before you make an offer.",
    url: absoluteUrl("/finance"),
    siteName: "Findaly",
    type: "website",
    images: [{ url: absoluteUrl("/og-findaly.jpg"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yacht Finance | Findaly",
    description:
      "Marine finance options for every vessel and every budget. Understand deposits, terms, surveys, and loan types before you make an offer.",
    images: [absoluteUrl("/og-findaly.jpg")],
  },
};

export default function FinancePage() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Yacht Finance — Marine Finance Options on Findaly</h1>
        <p>Marine finance options for every vessel and every budget. Understand deposits, terms, surveys, and loan types before you make an offer.</p>
        <nav>
          <a href="/">Home</a>
          <a href="/buy">Boats for Sale</a>
          <a href="/buy/sailboats">Sailboats for Sale</a>
          <a href="/buy/motor-yachts">Motor Yachts for Sale</a>
          <a href="/buy/catamarans">Catamarans for Sale</a>
          <a href="/buy/superyachts">Superyachts for Sale</a>
          <a href="/sell">Sell Your Boat</a>
          <a href="/charter">Charter a Boat</a>
          <a href="/brokers">Yacht Brokers</a>
          <a href="/brokers/join">List as a Broker</a>
          <a href="/guides">Buying Guides</a>
          <a href="/guides/buying-a-yacht">Buying a Yacht Guide</a>
          <a href="/guides/catamaran-buying-guide">Catamaran Buying Guide</a>
          <a href="/finance">Yacht Finance</a>
          <a href="/services">Marine Services</a>
          <a href="/destinations">Destinations</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/faq">FAQ</a>
          <a href="/blog">Blog</a>
        </nav>
      </div>
      <FinanceClient />
    </>
  );
}