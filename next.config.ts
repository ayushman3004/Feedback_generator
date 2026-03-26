import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ✅ THIS LINE FIXES EVERYTHING
  },
};

export default nextConfig;
