interface Props {
  value: number;
  max?: number;
  className?: string;
  fillClassName?: string;
}

// Continuous fill bar. For a segmented/dashed variant, see GoalProgressBar.
export function ProgressBar({
  value,
  max = 10,
  className = "h-1.5",
  fillClassName = "bg-primary",
}: Props) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`overflow-hidden rounded-full bg-muted ${className}`}>
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${fillClassName}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
