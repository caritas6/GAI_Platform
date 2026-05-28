import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 배포: output: "export" 제거 → API Route 사용 가능
  // basePath 제거 → 루트 도메인에서 서비스
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
