'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

const navItems = [
  { label: '홈',        href: '/' },
  { label: '프로젝트',  href: '/projects' },
  { label: 'AI Agent', href: '/agent' },
  { label: 'DAO',       href: '/dao' },
  { label: '포트폴리오', href: '/portfolio' },
];

const ROLE_COLOR: Record<string, { bg: string; text: string }> = {
  student:    { bg: '#EEEDFE', text: '#3C3489' },
  professor:  { bg: '#E1F5EE', text: '#085041' },
  industry:   { bg: '#FAECE7', text: '#712B13' },
  researcher: { bg: '#FAEEDA', text: '#633806' },
};

export default function Nav() {
  const { user, profile, logout } = useAuth();
  const pathname  = usePathname();
  const router    = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  // 표시 이름: 최대 3자
  const displayName =
    profile?.displayName || user.displayName || user.email?.split('@')[0] || '사용자';
  const shortName = displayName.slice(0, 3);
  const roleColor = ROLE_COLOR[profile?.role ?? 'student'] ?? ROLE_COLOR.student;

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <nav
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', background: 'var(--color-bg-secondary)',
        border: '0.5px solid var(--color-border)', borderRadius: 10, marginBottom: 16,
        position: 'relative',
      }}
    >
      {/* 로고 */}
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand)', letterSpacing: 2 }}>
        G·A·I
      </span>

      {/* 네비 링크 */}
      <div style={{ display: 'flex', gap: 20 }}>
        {navItems.map(item => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontSize: 12,
                color: isActive ? 'var(--brand)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* 사용자 아바타 + 드롭다운 */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            width: 30, height: 30, borderRadius: '50%',
            background: roleColor.bg, color: roleColor.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
            border: '0.5px solid var(--color-border)',
          }}
          title={displayName}
        >
          {shortName}
        </button>

        {/* 드롭다운 메뉴 */}
        {menuOpen && (
          <div
            style={{
              position: 'absolute', right: 0, top: 36, zIndex: 200,
              background: 'var(--color-bg-primary)',
              border: '0.5px solid var(--color-border)',
              borderRadius: 10, padding: '6px 0', minWidth: 160,
              boxShadow: '0 4px 16px rgba(0,0,0,.08)',
            }}
          >
            {/* 사용자 정보 */}
            <div style={{
              padding: '10px 14px 8px',
              borderBottom: '0.5px solid var(--color-border)',
              marginBottom: 4,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                {displayName}
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', fontFamily: 'monospace' }}>
                {user.email}
              </div>
              {profile?.role && (
                <span style={{
                  display: 'inline-block', marginTop: 6,
                  fontSize: 10, padding: '2px 8px', borderRadius: 20,
                  background: roleColor.bg, color: roleColor.text,
                  fontFamily: 'monospace',
                }}>
                  {{
                    student: '학생', professor: '교수 · 교육자',
                    industry: '산업체 파트너', researcher: '외부 연구자',
                  }[profile.role]}
                </span>
              )}
              {profile?.score !== undefined && (
                <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                  DAO 기여 점수 · <strong>{profile.score}</strong>
                </div>
              )}
            </div>

            {/* 로그아웃 */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%', padding: '8px 14px', background: 'none',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: 12, color: '#993C1D',
                transition: 'background .12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FAECE7')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              로그아웃
            </button>
          </div>
        )}
      </div>

      {/* 드롭다운 외부 클릭 닫기 */}
      {menuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100 }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}
