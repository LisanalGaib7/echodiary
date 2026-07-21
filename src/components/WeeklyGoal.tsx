import { useUiLang } from "@/lib/ui-lang";
import { useWeeklyGoal } from "@/hooks/useWeeklyGoal";
import { GoalEditor } from "./weekly-goal/GoalEditor";

export function WeeklyGoal() {
  const { uiLang } = useUiLang();
  const { target, done, streak, complete, updateTarget, minTarget, maxTarget } = useWeeklyGoal();

  const label = uiLang === "ko" ? "주간 목표" : "Weekly Goal";
  const pct = target > 0 ? Math.round((Math.min(done, target) / target) * 100) : 0;

  const remaining = Math.max(0, target - done);
  const hint =
    uiLang === "ko"
      ? complete
        ? "이번 주 목표를 달성했어요."
        : remaining === 1
          ? "한 편만 더 쓰면 이번 주가 완성돼요."
          : `${remaining}편 더 쓰면 이번 주가 완성돼요.`
      : complete
        ? "You've completed this week's cycle."
        : remaining === 1
          ? "One more entry to complete your weekly reflection cycle."
          : `${remaining} more entries to complete your weekly cycle.`;

  const streakLabel =
    uiLang === "ko"
      ? `${streak}일 연속`
      : streak === 1
        ? "1 day streak"
        : `${streak} days streak`;

  return (
    <section aria-label={label} className="space-y-6 border-t border-primary/10 pt-8">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary/60">{label}</h3>

      <div className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <span className="score-text text-4xl font-light italic leading-none text-primary">
            {done}
            <span className="text-xl opacity-40">/</span>
            <GoalEditor target={target} min={minTarget} max={maxTarget} onSave={updateTarget} />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary tabular-nums">
            {pct}% {complete ? (uiLang === "ko" ? "달성" : "reached") : uiLang === "ko" ? "진행" : "progress"}
          </span>
        </div>

        <div className="flex gap-1.5" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={target}>
          {Array.from({ length: target }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                i < done ? "bg-primary" : "bg-primary/10"
              }`}
              style={{ transitionDelay: `${i * 40}ms` }}
            />
          ))}
        </div>

        <p className="text-sm leading-relaxed text-primary/70">{hint}</p>

        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
          {streakLabel}
        </p>
      </div>
    </section>
  );
}
