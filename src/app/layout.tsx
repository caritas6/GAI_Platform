import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';

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
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '24px 16px',
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: 'var(--color-text-tertiary)',
              marginBottom: 10,
            }}
          >
            G·A·I Platform — v0.1
          </div>
          <Nav />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
