import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  output: 'standalone',
  // Start: Legacy Path Redirect Patterns
  async redirects() {
    return [
      {
        source: '/balai_raya',
        destination: '/town-hall',
        permanent: true,
      },
      {
        source: '/kedai_runcit',
        destination: '/asset-store',
        permanent: true,
      },
      {
        source: '/muzium',
        destination: '/cyber-museum',
        permanent: true,
      },
    ];
  },
  // End: Legacy Path Redirect Patterns
};

export default nextConfig;