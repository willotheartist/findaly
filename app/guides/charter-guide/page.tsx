import type { Metadata } from "next";
import CharterGuideClient from "./CharterGuideClient";

export const metadata: Metadata = {
  title: "Yacht Charter Guide: Types, Costs, Itineraries & How to Book | Findaly",
  description:
    "Plan a yacht charter with confidence: bareboat vs crewed, costs, deposits, itinerary planning, destination seasonality, and booking checks.",
  alternates: { canonical: "/guides/charter-guide" },
};

export default function Page() {
  return <CharterGuideClient />;
}
