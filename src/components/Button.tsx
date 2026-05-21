import { CSSProperties, ReactNode } from 'react';

interface ButtonProps {
  variant?: 'default' | 'primary';
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  fullWidth?: boolean;
}

export default function Button({ variant = 'default', children, onClick, style, fullWidth }: ButtonProps) {
  const base: CSSProperties = {
    fontSize: 11,
    padding: '5px 12px',
    border: '0.5px solid var(--color-border)',
    borderRadius: 6,
    background: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    whiteSpace: 'nowrap',
    fontWeight: 500,
    width: fullWidth ? '100%' : undefined,
  };

  const primary: CSSProperties = {
    background: 'var(--brand-light)',
    borderColor: 'var(--brand-border)',
    color: 'var(--brand-text)',
  };

  return (
    <button
      onClick={onClick}
      style={{ ...base, ...(variant === 'primary' ? primary : {}), ...style }}
    >
      {children}
    </button>
  );
}
