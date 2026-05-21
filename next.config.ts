import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/DAI_Platform",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
