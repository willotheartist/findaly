import type { Metadata } from "next";
import { BrokersJoinPageClient } from "./BrokersJoinPageClient";

export const metadata: Metadata = {
  title: "Join Findaly as a Broker | Findaly",
  description: "List your inventory on Findaly and reach thousands of serious buyers. Join Europe's growing boat marketplace.",
  alternates: { canonical: "/brokers/join" },
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
    title: "Join Findaly as a Broker | Findaly",
    description: "List your inventory on Findaly and reach thousands of serious buyers. Join Europe's growing boat marketplace.",
    url: "https://www.findaly.co/brokers/join",
    siteName: "Findaly",
    type: "website",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Findaly as a Broker | Findaly",
    description: "List your inventory on Findaly and reach thousands of serious buyers. Join Europe's growing boat marketplace.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>Join Findaly as a Yacht Broker</h1>
        <p>List your inventory on Findaly and reach thousands of serious buyers. Join Europe's growing boat marketplace.</p>
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
      <BrokersJoinPageClient />
    </>
  );
}
