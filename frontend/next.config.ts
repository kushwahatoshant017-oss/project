import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["openweathermap.org"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
