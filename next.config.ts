import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Using App Router primarily, but pages directory exists for legacy _app.tsx
  // The pages/_document.tsx is still needed for server-side rendering
  // Configure output for standalone build
  output: 'standalone',
};

export default nextConfig;