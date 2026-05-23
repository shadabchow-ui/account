import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true,
  },
};

export default nextConfig;
