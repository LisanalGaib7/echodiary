interface Props {
  done: number;
  target: number;
}

export function GoalProgressBar({ done, target }: Props) {
  return (
    <div
      className="mt-5 grid gap-1"
      style={{ gridTemplateColumns: `repeat(${target}, minmax(0, 1fr))` }}
      role="progressbar"
      aria-valuenow={done}
      aria-valuemin={0}
      aria-valuemax={target}
    >
      {Array.from({ length: target }).map((_, i) => (
        <span
          key={i}
          className={`h-0.5 rounded-full transition-colors duration-500 ${i < done ? "bg-primary" : "bg-muted/60"}`}
          style={{ transitionDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
}
