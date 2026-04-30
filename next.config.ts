import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Disable telemetry in production
  telemetry: false,

  // Optimize for production
  poweredByHeader: false,

  // Enable experimental features if needed
  experimental: {
    // Enable if you need server components optimization
    // serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
