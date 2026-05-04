import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@assets": path.resolve("C:/Users/MSI/.cursor/projects/c-Users-MSI-Desktop/assets"),
    };

    return config;
  },
};

export default nextConfig;
