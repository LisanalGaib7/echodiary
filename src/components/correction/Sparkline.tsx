const WIDTH = 168;
const HEIGHT = 38;
const PAD = 4;

export function Sparkline({ scores, label }: { scores: number[]; label: string }) {
  if (scores.length < 2) return null;

  const min = Math.min(...scores, 0);
  const max = Math.max(...scores, 10);
  const span = max - min || 1;
  const stepX = (WIDTH - PAD * 2) / (scores.length - 1);

  const points = scores.map((s, i) => {
    const x = PAD + i * stepX;
    const y = HEIGHT - PAD - ((s - min) / span) * (HEIGHT - PAD * 2);
    return `${x},${y}`;
  });
  const last = points[points.length - 1].split(",").map(Number);

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={label}
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill="var(--color-primary)" />
    </svg>
  );
}
