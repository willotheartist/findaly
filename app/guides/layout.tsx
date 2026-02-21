import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Guides | Findaly",
  description:
    "Buying guides, checklists, and model comparisons to help you buy a yacht with confidence.",
}

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}