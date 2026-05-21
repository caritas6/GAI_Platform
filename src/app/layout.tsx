import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import LayoutShell from '@/components/LayoutShell';

export const metadata: Metadata = {
  title: 'G·A·I Platform',
  description: '산학협력 AI 기반 디자인 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {/* AuthProvider: 전체 앱의 인증 상태 관리 */}
        <AuthProvider>
          {/* LayoutShell: 로그인 페이지 / 일반 페이지 레이아웃 분기 */}
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
