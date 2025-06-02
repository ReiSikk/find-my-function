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
        hostname: "rimibaltic-res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.s-cloud.fi",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
