'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth, UserRole } from '@/lib/auth-context';

const ROLES: { value: UserRole; icon: string; label: string; desc: string }[] = [
  { value: 'student',    icon: '🎓', label: '학생',         desc: 'KBU 디자인학과 재학생' },
  { value: 'professor',  icon: '👩‍🏫', label: '교수 · 교육자', desc: '지도교수 및 강사' },
  { value: 'industry',   icon: '🏢', label: '산업체 파트너', desc: '산학협력 멘토 · 기업' },
  { value: 'researcher', icon: '🔬', label: '외부 연구자',   desc: 'HCI / HCAI 연구자' },
];

export default function LoginPage() {
  const { login, loginGoogle, register } = useAuth();
  const router = useRouter();

  const [tab,         setTab]         = useState<'login' | 'register'>('login');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role,        setRole]        = useState<UserRole>('student');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [resetSent,   setResetSent]   = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        if (!displayName.trim()) { setError('이름을 입력해주세요.'); setLoading(false); return; }
        await register(email, password, displayName, role);
      }
      router.replace('/');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '오류가 발생했습니다.';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (msg.includes('email-already-in-use')) {
        setError('이미 사용 중인 이메일입니다.');
      } else if (msg.includes('weak-password')) {
        setError('비밀번호는 6자 이상이어야 합니다.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginGoogle();
      router.replace('/');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Google 로그인 오류');
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email.trim()) {
      setError('비밀번호를 재설정할 이메일을 입력해주세요.');
      return;
    }
    if (!auth) { setError('Firebase가 초기화되지 않았습니다.'); return; }
    setError('');
    setResetSent(false);
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('user-not-found') || msg.includes('invalid-email')) {
        setError('등록된 이메일이 없거나 형식이 올바르지 않습니다.');
      } else {
        setError('재설정 메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px 16px',
      background: 'var(--color-bg-primary)',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontFamily: 'monospace', fontSize: 32, fontWeight: 600,
            color: 'var(--brand)', letterSpacing: 6, marginBottom: 8,
          }}>
            G·A·I
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
            KBU 디자인학과 산학 교육 플랫폼
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', fontFamily: 'monospace' }}>
            (재)경기도경제과학진흥원 · 디자인 재능나눔 사업
          </div>
        </div>

        {/* 카드 */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '0.5px solid var(--color-border)',
          borderRadius: 14, padding: '28px 24px',
        }}>

          {/* 탭 */}
          <div style={{
            display: 'flex', borderBottom: '0.5px solid var(--color-border)',
            marginBottom: 22,
          }}>
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setResetSent(false); }}
                style={{
                  flex: 1, padding: '8px 0', fontSize: 13, fontWeight: 500,
                  border: 'none', background: 'none', cursor: 'pointer',
                  color: tab === t ? 'var(--brand)' : 'var(--color-text-tertiary)',
                  borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent',
                  marginBottom: -1, transition: 'all .15s',
                }}
              >
                {t === 'login' ? '로그인' : '회원가입'}
              </button>
            ))}
          </div>

          {/* 회원가입: 역할 선택 */}
          {tab === 'register' && (
            <>
              <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 10 }}>
                역할 선택
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    style={{
                      padding: '10px 12px', border: role === r.value
                        ? '1.5px solid var(--brand)'
                        : '0.5px solid var(--color-border)',
                      borderRadius: 10, background: role === r.value ? 'var(--brand-light)' : 'var(--color-bg-primary)',
                      cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
                    }}
                  >
                    <span style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>{r.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', display: 'block' }}>{r.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>{r.desc}</span>
                  </button>
                ))}
              </div>

              {/* 이름 */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>이름</label>
                <input
                  type="text" placeholder="홍길동"
                  value={displayName} onChange={e => setDisplayName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {/* 이메일 */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>이메일</label>
            <input
              type="email" placeholder="example@kbu.ac.kr"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={inputStyle}
            />
          </div>

          {/* 비밀번호 */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 11, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 5 }}>비밀번호</label>
            <input
              type="password" placeholder="6자 이상"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={inputStyle}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div style={{
              fontSize: 11, color: '#993C1D', background: '#FAECE7',
              border: '0.5px solid #F5C2B0', borderRadius: 7,
              padding: '8px 12px', marginBottom: 14,
            }}>
              {error}
            </div>
          )}

          {/* 시작하기 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '11px', background: loading ? 'var(--brand-border)' : 'var(--brand)',
              border: 'none', borderRadius: 9, color: '#fff', fontSize: 13,
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background .15s', marginBottom: 12,
            }}
          >
            {loading ? (
              <>
                <span style={spinnerStyle} />
                연결 중...
              </>
            ) : (
              tab === 'login' ? '로그인' : '회원가입'
            )}
          </button>

          {/* 비밀번호 찾기 (로그인 탭에서만 표시) */}
          {tab === 'login' && (
            <div style={{ textAlign: 'center', marginBottom: 4 }}>
              {resetSent ? (
                <div style={{
                  fontSize: 11, color: '#1A7A4A', background: '#E8F7EF',
                  border: '0.5px solid #A8DFC0', borderRadius: 7,
                  padding: '8px 12px', marginBottom: 8,
                }}>
                  ✉️ 비밀번호 재설정 메일을 보냈어요. 받은 편지함을 확인해주세요.
                </div>
              ) : (
                <button
                  onClick={handleReset}
                  disabled={resetLoading}
                  style={{
                    background: 'none', border: 'none', cursor: resetLoading ? 'default' : 'pointer',
                    fontSize: 11, color: 'var(--color-text-tertiary)',
                    textDecoration: 'underline', textDecorationStyle: 'dotted',
                    padding: '2px 0', marginBottom: 6,
                    opacity: resetLoading ? 0.5 : 1,
                  }}
                >
                  {resetLoading ? '메일 발송 중...' : '비밀번호를 잊으셨나요?'}
                </button>
              )}
            </div>
          )}

          {/* 구분선 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            margin: '14px 0', color: 'var(--color-text-tertiary)', fontSize: 11,
          }}>
            <div style={{ flex: 1, height: 0.5, background: 'var(--color-border)' }} />
            또는
            <div style={{ flex: 1, height: 0.5, background: 'var(--color-border)' }} />
          </div>

          {/* Google 로그인 */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%', padding: '9px', border: '0.5px solid var(--color-border)',
              borderRadius: 9, background: 'var(--color-bg-primary)',
              cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13,
              color: 'var(--color-text-secondary)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background .15s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.2 0 5.9 1.1 8.1 2.9l6-6C34.5 3.1 29.6 1 24 1 14.8 1 7 6.7 3.7 14.6l7 5.4C12.4 13.7 17.7 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.5 2.8-2.2 5.2-4.7 6.8l7.3 5.7c4.3-4 6.7-9.8 6.7-16.5z"/>
              <path fill="#FBBC05" d="M10.7 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6l-7-5.4A23 23 0 0 0 1 24c0 3.7.9 7.2 2.5 10.3l7.2-5.7z"/>
              <path fill="#34A853" d="M24 47c5.5 0 10.2-1.8 13.6-4.9l-7.3-5.7c-1.8 1.2-4.2 1.9-6.3 1.9-6.3 0-11.6-4.2-13.3-9.9l-7.2 5.7C7 41.3 14.8 47 24 47z"/>
            </svg>
            Google로 계속하기
          </button>
        </div>

        <div style={{
          textAlign: 'center', fontSize: 9, color: 'var(--color-text-tertiary)',
          fontFamily: 'monospace', marginTop: 20, letterSpacing: 1,
        }}>
          G·A·I PLATFORM · KBU DESIGN DEPT · 2025
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="email"], input[type="password"], input[type="text"] {
          width: 100%; padding: 9px 12px;
          background: var(--color-bg-primary);
          border: 0.5px solid var(--color-border);
          border-radius: 8px; font-size: 13px;
          color: var(--color-text-primary); outline: none;
          transition: border-color .15s;
        }
        input:focus { border-color: var(--brand); }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: 'var(--color-bg-primary)',
  border: '0.5px solid var(--color-border)',
  borderRadius: 8, fontSize: 13,
  color: 'var(--color-text-primary)', outline: 'none',
};

const spinnerStyle: React.CSSProperties = {
  width: 15, height: 15,
  border: '2px solid rgba(255,255,255,.3)',
  borderTopColor: '#fff', borderRadius: '50%',
  animation: 'spin .7s linear infinite',
  display: 'inline-block',
};
