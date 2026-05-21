'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Nav from '@/components/Nav';

// 인증이 필요한 페이지들의 공통 레이아웃
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // 로딩 중
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', flexDirection: 'column', gap: 12,
      }}>
        <div style={{
          width: 24, height: 24,
          border: '2.5px solid #EEEDFE',
          borderTopColor: '#534AB7',
          borderRadius: '50%',
          animation: 'spin .7s linear infinite',
        }} />
        <span style={{ fontSize: 12, color: '#9999B0' }}>로딩 중...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 비로그인 → 리디렉션 대기 (빈 화면 방지)
  if (!user) return null;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ fontSize: 10, color: '#9999B0', marginBottom: 10, fontFamily: 'monospace' }}>
        G·A·I Platform — v0.1
      </div>
      <Nav />
      <main>{children}</main>
    </div>
  );
}
