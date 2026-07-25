const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreRing({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(1, score / 10));
  const dashoffset = CIRCUMFERENCE * (1 - pct);

  return (
    <div className="relative h-[108px] w-[108px] shrink-0">
      <svg viewBox="0 0 108 108" className="h-full w-full -rotate-90">
        <circle
          cx="54"
          cy="54"
          r={RADIUS}
          fill="none"
          stroke="var(--color-secondary)"
          strokeWidth="8"
        />
        <circle
          cx="54"
          cy="54"
          r={RADIUS}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashoffset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="score-text text-[1.9rem] leading-none text-ink tabular-nums">
          {score.toFixed(1)}
        </span>
        <span className="font-mono text-[0.6rem] tracking-[0.08em] text-muted-foreground">
          / 10
        </span>
      </div>
    </div>
  );
}
