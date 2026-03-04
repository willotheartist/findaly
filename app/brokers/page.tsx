// app/brokers/page.tsx
import type { Metadata } from "next";
import BrokersClient from "./BrokersClient";

export const metadata: Metadata = {
  title: "Yacht Brokers | Findaly",
  description:
    "Browse verified yacht brokers and brokerages worldwide. Message brokers directly and discover professional listings on Findaly.",
  alternates: { canonical: "/brokers" },
  robots: { index: true, follow: true },
};

export default function BrokersPage() {
  return <BrokersClient />;
}