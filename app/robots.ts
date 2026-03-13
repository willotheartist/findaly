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
          "/api/",
          "/login",
          "/signup",
          "/logout",
          "/settings",
          "/messages",
          "/my-listings",
          "/upgrade",
          "/stack",
          "/search",
          "/searches",
          "/saved",
          "/alerts",
          "/billing/",
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
