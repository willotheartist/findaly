import type { Metadata } from "next";
import SearchClient from "./SearchClient";

type PageProps = {
  searchParams?: {
    q?: string;
  };
};

export const metadata: Metadata = {
  title: "Search | Findaly",
  description: "Search results on Findaly.",
  alternates: {
    canonical: "/search",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage(_props: PageProps) {
  return <SearchClient />;
}
