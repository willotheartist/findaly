// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://findaly.co"), // ✅ change if needed
  title: {
    default: "Findaly",
    template: "%s — Findaly",
  },
  description: "Compare software tools by pricing, features, integrations, and ranked alternatives.",
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
  openGraph: {
    title: "Findaly",
    description: "Compare software tools by pricing, features, integrations, and ranked alternatives.",
    url: "https://findaly.co",
    siteName: "Findaly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Findaly",
    description: "Compare software tools by pricing, features, integrations, and ranked alternatives.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-(--color-bg) text-(--color-text-main)">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
