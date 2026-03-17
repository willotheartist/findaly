import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | Findaly",
  robots: { index: false, follow: true },
};

// app/support/page.tsx
import SupportClient from "./SupportClient"

export default function SupportPage() {
  return <SupportClient />
}