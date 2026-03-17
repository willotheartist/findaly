// app/charter/page.tsx
import type { Metadata } from "next";
import CharterClient from "./CharterClient";

export const metadata: Metadata = {
  title: "Charter a Yacht | Findaly",
  description:
    "Browse yacht charters worldwide. Book direct with owners and operators — day trips to full-season charters on Findaly.",
  alternates: { canonical: "/charter" },
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
    title: "Charter a Boat on Findaly",
    description: "Discover boat and yacht charters worldwide. Find sailing holidays, motor yacht charters and crewed charters on Findaly.",
    url: "https://www.findaly.co",
    siteName: "Findaly",
    type: "website",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charter a Boat on Findaly",
    description: "Discover boat and yacht charters worldwide. Find sailing holidays, motor yacht charters and crewed charters on Findaly.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

export default function CharterPage() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Charter a Boat on Findaly</h1>
        <p>Discover boat and yacht charters worldwide. Find sailing holidays, motor yacht charters and crewed charters on Findaly.</p>
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
      <CharterClient />
    </>
  );
}