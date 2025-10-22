import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "valuable-butterfly-59b895b245.media.strapiapp.com",
      },
    ],
  },
};

export default nextConfig;
