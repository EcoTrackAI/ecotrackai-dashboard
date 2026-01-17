import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure environment variables are properly available
  reactStrictMode: true,

  // Configure headers for better caching and security
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
