import type { Metadata } from "next";
import { CrewJobsPageClient } from "./CrewJobsPageClient";

export const metadata: Metadata = {
  title: "Crew Jobs | Findaly",
  robots: { index: false, follow: true },
};

export default function CrewJobsPage() {
  return <CrewJobsPageClient />;
}
