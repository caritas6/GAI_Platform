import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/GAI_Platform",
  trailingSlash: true,   // GitHub Pages 정적 파일 라우팅 호환
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
