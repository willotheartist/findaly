import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
