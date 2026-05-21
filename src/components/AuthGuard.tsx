'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user && pathname !== '/login') {
      // 비로그인 → 로그인 페이지로
      router.replace('/login');
    } else if (user && pathname === '/login') {
      // 이미 로그인 상태에서 로그인 페이지 접근 → 홈으로
      router.replace('/');
    }
  }, [user, loading, pathname, router]);

  // 로딩 중
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', flexDirection: 'column', gap: 12,
      }}>
        <div style={{
          width: 28, height: 28,
          border: '2.5px solid var(--brand-light)',
          borderTopColor: 'var(--brand)',
          borderRadius: '50%',
          animation: 'spin .7s linear infinite',
        }} />
        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>인증 확인 중...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 비로그인 + 보호된 페이지 → 빈 화면 (리디렉션 대기)
  if (!user && pathname !== '/login') return null;

  // 로그인 상태 + 로그인 페이지 → 빈 화면 (홈 리디렉션 대기)
  if (user && pathname === '/login') return null;

  return <>{children}</>;
}
