import { Check } from "lucide-react";
import { useUiLang } from "@/lib/ui-lang";
import { useWeeklyGoal } from "@/hooks/useWeeklyGoal";
import { GoalEditor } from "./weekly-goal/GoalEditor";
import { GoalProgressBar } from "./weekly-goal/GoalProgressBar";
import { StreakBadge } from "./weekly-goal/StreakBadge";

export function WeeklyGoal() {
  const { uiLang } = useUiLang();
  const { target, done, streak, complete, updateTarget, minTarget, maxTarget } = useWeeklyGoal();

  const label = uiLang === "ko" ? "주간 목표" : "Weekly Goal";

  return (
    <section aria-label={label} className="py-10">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {label}
          </span>
          <span className="font-serif text-base tabular-nums text-foreground">
            {done}
            <span className="text-muted-foreground/50">/</span>
            <GoalEditor target={target} min={minTarget} max={maxTarget} onSave={updateTarget} />
          </span>
          {complete && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
              <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
              {uiLang === "ko" ? "달성" : "Reached"}
            </span>
          )}
        </div>

        <StreakBadge streak={streak} />
      </div>

      <GoalProgressBar done={done} target={target} />
    </section>
  );
}
