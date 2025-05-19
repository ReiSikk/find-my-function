import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.selver.ee",
        port: "",
        pathname: "/**",      
  },
      {
        protocol: "https",
        hostname: "www.rimi.ee",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
