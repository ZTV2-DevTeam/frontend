import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["thf.bing.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
