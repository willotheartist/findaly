// app/finance/page.tsx
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import FinanceClient from "./FinanceClient";

export const metadata: Metadata = {
  title: "Yacht Finance | Findaly",
  description:
    "Marine finance options for every vessel and every budget. Understand deposits, terms, surveys, and loan types before you make an offer.",
  alternates: { canonical: absoluteUrl("/finance") },
  robots: { index: true, follow: true },
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
  return <FinanceClient />;
}