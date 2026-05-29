import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Core configuration options */
  allowedDevOrigins: [
    "172.28.101.152",         // Raw IP (Crucial for Turbopack)
    "172.28.101.152:3001",    // Network location
    "localhost:3001",         // Local interface
    "localhost"               // Raw local fallback
  ]
};

export default nextConfig;
