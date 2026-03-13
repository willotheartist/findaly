import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

type BuyMetaArgs = {
  title: string;
  description: string;
  pathname: string; // must start with "/"
  robots?: Metadata["robots"];
};

export function buyMeta({
  title,
  description,
  pathname,
  robots = { index: true, follow: true },
}: BuyMetaArgs): Metadata {
  const url = absoluteUrl(pathname);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Findaly",
      type: "website",
      images: [
        {
          url: absoluteUrl("/og-findaly.jpg"),
          width: 1200,
          height: 630,
          alt: "Findaly — boats for sale, charter, and services",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/og-findaly.jpg")],
    },
    robots,
  };
}
