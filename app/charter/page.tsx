// app/charter/page.tsx
import type { Metadata } from "next";
import CharterClient from "./CharterClient";

export const metadata: Metadata = {
  title: "Charter a Yacht | Findaly",
  description:
    "Browse yacht charters worldwide. Book direct with owners and operators — day trips to full-season charters on Findaly.",
  alternates: { canonical: "/charter" },
};

export default function CharterPage() {
  return <CharterClient />;
}