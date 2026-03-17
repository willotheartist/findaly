import type { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Findaly | The Maritime Marketplace",
  description: "Findaly is the everything marketplace for the maritime world. Buy, sell and charter boats with trusted brokers worldwide.",
  alternates: { canonical: "/about" },
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
    title: "About Findaly | The Maritime Marketplace",
    description: "Findaly is the everything marketplace for the maritime world. Buy, sell and charter boats with trusted brokers worldwide.",
    url: "https://www.findaly.co/about",
    siteName: "Findaly",
    type: "website",
    images: [{ url: "https://www.findaly.co/og-findaly.jpg", width: 1200, height: 630, alt: "Findaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Findaly | The Maritime Marketplace",
    description: "Findaly is the everything marketplace for the maritime world. Buy, sell and charter boats with trusted brokers worldwide.",
    images: ["https://www.findaly.co/og-findaly.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}}>
        <h1>About Findaly — The Everything Marketplace for the Maritime World</h1>
        <p>Findaly is the everything marketplace for the maritime world. Buy, sell and charter boats with trusted brokers worldwide.</p>
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
      <AboutPageClient />
    </>
  );
}
