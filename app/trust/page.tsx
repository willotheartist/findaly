import type { Metadata } from "next";
import { TrustPageClient } from "./TrustPageClient";

export const metadata: Metadata = {
  title: "Trust | Findaly",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <TrustPageClient />;
}
