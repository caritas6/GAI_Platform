import { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, style, className, onClick }: CardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: 'var(--color-bg-primary)',
        border: '0.5px solid var(--color-border)',
        borderRadius: 10,
        padding: '12px 14px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
}

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <Card>
      <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', margin: '0 0 6px' }}>
        {label}
      </p>
      <p style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
        {value}
      </p>
      <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', margin: 0 }}>{sub}</p>
    </Card>
  );
}

interface SectionLabelProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function SectionLabel({ children, style }: SectionLabelProps) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 600,
        color: 'var(--color-text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        margin: '0 0 8px',
        ...style,
      }}
    >
      {children}
    </p>
  );
}
