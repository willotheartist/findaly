import type { Metadata } from "next";
import { BrokersFaqPageClient } from "./BrokersFaqPageClient";

export const metadata: Metadata = {
  title: "Broker FAQ | Findaly",
  description: "Frequently asked questions for yacht brokers listing on Findaly.",
  alternates: { canonical: "/brokers/faq" },
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
    title: "Broker FAQ | Findaly",
    description: "Frequently asked questions for yacht brokers listing on Findaly.",
    url: "https://www.findaly.co/brokers/faq",
    siteName: "Findaly",
    type: "website",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Broker FAQ | Findaly",
    description: "Frequently asked questions for yacht brokers listing on Findaly.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Findaly Broker FAQ</h1>
        <p>Frequently asked questions for yacht brokers listing on Findaly.</p>
        <nav>
          <a href="/">Home</a>
          <a href="/buy">Boats for Sale</a>
          <a href="/sell">Sell Your Boat</a>
          <a href="/charter">Charter</a>
          <a href="/brokers">Brokers</a>
          <a href="/guides">Guides</a>
          <a href="/finance">Finance</a>
          <a href="/services">Services</a>
          <a href="/destinations">Destinations</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/faq">FAQ</a>
          <a href="/blog">Blog</a>
          <a href="/pricing">Pricing</a>
        </nav>
      </div>
      <BrokersFaqPageClient />
    </>
  );
}
