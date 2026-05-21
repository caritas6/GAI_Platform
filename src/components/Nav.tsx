'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: '홈', href: '/' },
  { label: '프로젝트', href: '/projects' },
  { label: 'AI Agent', href: '/agent' },
  { label: 'DAO', href: '/dao' },
  { label: '포트폴리오', href: '/portfolio' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'var(--color-bg-secondary)',
        border: '0.5px solid var(--color-border)',
        borderRadius: '10px',
        marginBottom: '16px',
      }}
    >
      {/* Logo */}
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand)', letterSpacing: 2 }}>
        G·A·I
      </span>

      {/* Links */}
      <div style={{ display: 'flex', gap: 20 }}>
        {navItems.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
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

      {/* Avatar */}
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'var(--brand-light)',
          color: 'var(--brand-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        김디
      </div>
    </nav>
  );
}
