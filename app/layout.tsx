// app/layout.tsx
import "./globals.css";
import { Inter_Tight } from "next/font/google";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteHeaderOffsetClient from "@/components/SiteHeaderOffsetClient";
import { getSiteUrl, absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Findaly: Every boat. Every budget. Every need.",
    template: "%s | Findaly",
  },

  description:
    "Buy, sell, and charter boats worldwide with trusted brokers. Discover every boat for every budget on Findaly — the everything marketplace for the maritime world.",

  applicationName: "Findaly",

  alternates: {
    canonical: siteUrl,
  },

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Findaly",
    title: "Findaly: Every boat. Every budget. Every need.",
    description:
      "Buy, sell, and charter boats worldwide with trusted brokers. Discover every boat for every budget on Findaly.",
    images: [
      {
        url: absoluteUrl("/hero-buy.jpg"),
        width: 1200,
        height: 630,
        alt: "Findaly — boats for sale, charter, and services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Findaly: Every boat. Every budget. Every need.",
    description:
      "Buy, sell, and charter boats worldwide with trusted brokers. Discover every boat for every budget on Findaly.",
    images: [absoluteUrl("/hero-buy.jpg")],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// ─── JSON-LD Schema ───────────────────────────────────────────────────────────
// Organization: registers Findaly as a named entity with Google.
// WebSite: enables the Sitelinks Searchbox in branded search results.
// Update sameAs[] as you create social profiles.
// Update logo.url if your logo path differs from /logo.png.
// ─────────────────────────────────────────────────────────────────────────────

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Findaly",
  url: "https://findaly.co",
  logo: {
    "@type": "ImageObject",
    url: "https://findaly.co/logo.png",
    width: 200,
    height: 60,
  },
  description:
    "The everything marketplace for the maritime world. Buy, sell, and charter boats worldwide.",
  sameAs: [
    // Add your social profiles here as you create them, e.g.:
    // "https://www.instagram.com/findaly",
    // "https://www.linkedin.com/company/findaly",
    // "https://twitter.com/findaly",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Findaly",
  url: "https://findaly.co",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://findaly.co/buy?query={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={interTight.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen">
        <Header />
        <SiteHeaderOffsetClient />
        {children}
        <Footer />
      </body>
    </html>
  );
}