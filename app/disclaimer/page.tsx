import type { Metadata } from "next";
import { DisclaimerPageClient } from "./DisclaimerPageClient";

export const metadata: Metadata = {
  title: "Disclaimer | Findaly",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <DisclaimerPageClient />;
}
