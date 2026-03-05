// app/add-listing/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List a yacht | Findaly",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function AddListingLayout({ children }: { children: React.ReactNode }) {
  return children;
}