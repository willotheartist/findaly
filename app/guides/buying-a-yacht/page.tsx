import type { Metadata } from "next";
import BuyingAYachtClient from "./BuyingAYachtClient";

export const metadata: Metadata = {
  title: "Buying a Yacht: Costs, Process, Survey, Negotiation & Closing | Findaly",
  description:
    "A complete guide to buying a yacht: budgeting, shortlisting, viewings, surveys and sea trials, paperwork, negotiation and safe closing.",
  alternates: { canonical: "/guides/buying-a-yacht" },
};

export default function Page() {
  return <BuyingAYachtClient />;
}
