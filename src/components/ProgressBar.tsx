interface ProgressBarProps {
  percent: number;
  color?: string;
}

export default function ProgressBar({ percent, color = '#1D9E75' }: ProgressBarProps) {
  return (
    <div
      style={{
        height: 6,
        background: 'var(--color-bg-tertiary)',
        borderRadius: 3,
        marginTop: 4,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: 6,
          width: `${percent}%`,
          background: color,
          borderRadius: 3,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
}
