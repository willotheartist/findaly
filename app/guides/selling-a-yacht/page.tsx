import type { Metadata } from "next";
import SellingAYachtClient from "./SellingAYachtClient";

export const metadata: Metadata = {
  title: "Selling a Yacht: Pricing, Prep, Listing, Enquiries & Closing | Findaly",
  description:
    "A practical guide to selling a yacht: pricing, preparation, photo shotlist, listing structure, enquiry qualification, negotiation and safe closing.",
  alternates: { canonical: "/guides/selling-a-yacht" },
};

export default function Page() {
  return <SellingAYachtClient />;
}
