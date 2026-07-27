import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  serverActions: {
    bodySizeLimit: '20mb',
  },
};

export default nextConfig;
