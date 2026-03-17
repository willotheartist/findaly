import type { Metadata } from "next";
import { PartsPageClient } from "./PartsPageClient";

export const metadata: Metadata = {
  title: "Parts | Findaly",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <PartsPageClient />;
}
