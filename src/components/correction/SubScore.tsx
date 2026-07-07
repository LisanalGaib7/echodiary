import { ProgressBar } from "@/components/ui-common/ProgressBar";

export function SubScore({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="score-text text-sm font-medium text-primary">{value.toFixed(1)}</span>
      </div>
      <ProgressBar value={value} max={10} />
    </div>
  );
}
