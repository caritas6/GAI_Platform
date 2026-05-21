'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

// 로그인 페이지 전용 레이아웃 — 이미 로그인 상태면 홈으로 이동
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) return null;
  if (user) return null; // 홈으로 리디렉션 대기

  return <>{children}</>;
}
