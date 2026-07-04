import { Flame } from "lucide-react";
import { useUiLang } from "@/lib/ui-lang";

export function StreakBadge({ streak }: { streak: number }) {
  const { uiLang } = useUiLang();
  return (
    <div className="flex items-baseline gap-1.5">
      <Flame className="h-2.5 w-2.5 self-center text-primary" strokeWidth={2.5} />
      <span className="font-serif text-base tabular-nums text-foreground">{streak}</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {uiLang === "ko" ? "일 연속" : `day${streak === 1 ? "" : "s"} streak`}
      </span>
    </div>
  );
}
