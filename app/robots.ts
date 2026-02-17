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

        // Private / non-index pages
        disallow: [
          "/api/",
          "/login",
          "/signup",
          "/logout",
          "/settings",
          "/messages",
          "/my-listings",
          "/upgrade",
          "/stack", // if this is internal tooling, keep blocked
          "/searches", // optional: if these are user-specific query replays, keep blocked
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
