// app/guides/buying-a-beneteau/page.tsx
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import BuyingABeneteauClient from "./BuyingABeneteauClient";

export const metadata: Metadata = {
  title: "Buying a Beneteau | Findaly",
  description:
    "A practical 2026 buyer guide for Beneteau yachts — popular models, realistic pricing ranges, what to inspect, and how to buy clean.",
  alternates: { canonical: absoluteUrl("/guides/buying-a-beneteau") },
  robots: { index: true, follow: true },
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
  return <BuyingABeneteauClient />;
}