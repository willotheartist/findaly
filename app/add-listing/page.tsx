// app/add-listing/page.tsx
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import AddListingClient from "./AddListingClient";

export const metadata: Metadata = {
  title: "List a Boat | Findaly",
  description: "Create a boat listing on Findaly in minutes.",
  alternates: {
    canonical: absoluteUrl("/add-listing"),
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function AddListingPage() {
  return <AddListingClient />;
}