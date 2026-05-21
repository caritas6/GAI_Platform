'use client';

import { usePathname } from 'next/navigation';
import Nav from './Nav';
import AuthGuard from './AuthGuard';

// 로그인 페이지는 Nav·래퍼 없이 전체 화면으로 렌더링
// 나머지 페이지는 AuthGuard + Nav + 중앙 정렬 래퍼 적용
export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  return (
    <AuthGuard>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginBottom: 10 }}>
          G·A·I Platform — v0.1
        </div>
        <Nav />
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}
