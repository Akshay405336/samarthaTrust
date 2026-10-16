import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [
        {
          source: "/images/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "no-cache, must-revalidate",
            },
          ],
        },
        {
          source: "/logo.png",
          headers: [
            {
              key: "Cache-Control",
              value: "no-cache, must-revalidate",
            },
          ],
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
