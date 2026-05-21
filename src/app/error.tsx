'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: 13, color: '#4A4845' }}>페이지 오류: {error?.message ?? '알 수 없는 오류'}</p>
      <button
        onClick={reset}
        style={{ padding: '7px 20px', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}
      >
        다시 시도
      </button>
    </div>
  );
}
