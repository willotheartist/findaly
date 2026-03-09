// app/robots.ts
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // App routes (auth, settings, private)
          "/api/",
          "/login",
          "/signup",
          "/logout",
          "/settings",
          "/messages",
          "/my-listings",
          "/upgrade",
          "/stack",
          "/searches",
          "/saved",
          "/alerts",
          "/billing/",

          // Old tool directory paths — these don't exist anymore
          // Blocking them stops Google recrawling 250+ dead URLs
          "/alternatives/",
          "/compare/",
          "/best/",
          "/tools/",
          "/use-cases/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}