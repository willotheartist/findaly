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
  robots: {
    index: true,
    follow: true,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <SellPageClient />
    </>
  )
}