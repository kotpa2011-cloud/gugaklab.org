import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/archive": ["./content/archive/**/*"],
  },
};

export default nextConfig;
