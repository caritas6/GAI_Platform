import { CSSProperties, ReactNode } from 'react';

type TagVariant = 'green' | 'purple' | 'orange' | 'amber' | 'gray';

const variantStyles: Record<TagVariant, CSSProperties> = {
  green: { background: 'var(--green-bg)', color: 'var(--green-text)' },
  purple: { background: 'var(--brand-light)', color: 'var(--brand-text)' },
  orange: { background: 'var(--orange-bg)', color: 'var(--orange-text)' },
  amber: { background: 'var(--amber-bg)', color: 'var(--amber-text)' },
  gray: { background: 'var(--gray-bg)', color: 'var(--gray-text)' },
};

interface TagProps {
  variant?: TagVariant;
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}

export default function Tag({ variant = 'gray', children, onClick, style }: TagProps) {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-block',
        fontSize: 10,
        padding: '2px 8px',
        borderRadius: 4,
        marginRight: 4,
        marginBottom: 4,
        cursor: onClick ? 'pointer' : 'default',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
