// app/sell/page.tsx
import type { Metadata } from "next"
import SellPageClient from "./SellPageClient"
import { faqs } from "./content"

const CANONICAL = "https://www.findaly.co/sell"

export const metadata: Metadata = {
  title: "Sell Your Boat for Free | Findaly",
  description:
    "List your yacht or boat for sale on Findaly. Free listing, no commission, and global reach to serious buyers. Create your listing in minutes.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "Sell Your Boat for Free | Findaly",
    description:
      "Free listing, no commission, and global reach to serious buyers. Create your listing in minutes.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Your Boat for Free | Findaly",
    description: "List your yacht or boat for sale on Findaly. Free listing, no commission, global reach to serious buyers.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
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
}

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  }
}

export default function SellPage() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Sell Your Boat for Free on Findaly</h1>
        <p>List your yacht or boat for sale on Findaly. Free listing, no commission, and global reach to serious buyers.</p>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <SellPageClient />
    </>
  )
}