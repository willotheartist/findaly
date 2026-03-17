// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Force canonical host: https://www.findaly.co
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "findaly.co" }],
        destination: "https://www.findaly.co/:path*",
        permanent: true, // 308
      },
    ];
  },

  images: {
    remotePatterns: [
      // Free fallback endpoint
      { protocol: "https", hostname: "www.google.com", pathname: "/s2/favicons/**" },

      // Allow icons hosted on *any* https domain (max compatibility)
      // If you want stricter, remove this and whitelist only known hosts.
      { protocol: "https", hostname: "**" },
    ],
  },
};

if (process.env.NODE_ENV === "production") {
  fetch("https://www.google.com/ping?sitemap=https%3A%2F%2Fwww.findaly.co%2Fsitemap.xml")
    .then(() => console.log("✓ Google pinged"))
    .catch(() => {});
}

export default nextConfig;