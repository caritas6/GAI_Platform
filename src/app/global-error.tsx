'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F7F6F2' }}>
        <div style={{ textAlign: 'center', maxWidth: 360, padding: '0 20px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 600, color: '#534AB7', letterSpacing: 4, marginBottom: 16 }}>G·A·I</div>
          <p style={{ fontSize: 13, color: '#4A4845', marginBottom: 8 }}>페이지를 불러오는 중 오류가 발생했어요.</p>
          <p style={{ fontSize: 11, color: '#9999B0', fontFamily: 'monospace', marginBottom: 20 }}>{error?.message ?? '알 수 없는 오류'}</p>
          <button
            onClick={reset}
            style={{ padding: '9px 24px', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
