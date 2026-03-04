import type { Metadata } from "next";
import FinanceGuideClient from "./FinanceGuideClient";

export const metadata: Metadata = {
  title: "Yacht Finance Guide: Deposits, Terms, Eligibility & Lender Checks | Findaly",
  description:
    "Understand yacht finance: deposits, terms, eligibility, documents, surveys/valuations, timelines, and how to prepare a finance-ready case.",
  alternates: { canonical: "/guides/finance" },
};

export default function Page() {
  return <FinanceGuideClient />;
}
