import { Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { useUiLang } from "@/lib/ui-lang";
import { useWeeklyGoal } from "@/hooks/useWeeklyGoal";

export function MobileHeader() {
  const { uiLang } = useUiLang();
  const { target, done, streak, complete } = useWeeklyGoal();

  const goalLabel =
    uiLang === "ko"
      ? "주간 목표"
      : uiLang === "ja"
        ? "週の目標"
        : uiLang === "zh"
          ? "本周目标"
          : uiLang === "es"
            ? "Meta semanal"
            : uiLang === "fr"
              ? "Objectif"
              : "Weekly Goal";

  const doneLabel =
    uiLang === "ko"
      ? `${done} / ${target}편 완료`
      : uiLang === "ja"
        ? `${done} / ${target} 件`
        : uiLang === "zh"
          ? `${done} / ${target} 篇`
          : uiLang === "es"
            ? `${done} de ${target}`
            : uiLang === "fr"
              ? `${done} sur ${target}`
              : `${done} of ${target} entries`;

  const streakLabel =
    streak === 0
      ? uiLang === "ko"
        ? "연속 없음"
        : uiLang === "ja"
          ? "連続なし"
          : uiLang === "zh"
            ? "无连续"
            : uiLang === "es"
              ? "Sin racha"
              : uiLang === "fr"
                ? "Aucun"
                : "No streak"
      : uiLang === "ko"
        ? `${streak}일 연속`
        : uiLang === "ja"
          ? `${streak}日連続`
          : uiLang === "zh"
            ? `连续 ${streak} 天`
            : uiLang === "es"
              ? `${streak} días`
              : uiLang === "fr"
                ? `${streak} j.`
                : streak === 1
                  ? "1 day streak"
                  : `${streak} day streak`;

  return (
    <header className="md:hidden">
      <div className="flex items-center justify-between px-1 pb-4">
        <Link
          to="/"
          className="font-display text-3xl font-light italic tracking-tight text-primary"
        >
          Echo
        </Link>
        <div className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1">
          <Flame className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
          <span className="text-xs font-semibold text-primary tabular-nums">{streakLabel}</span>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-primary/10 bg-primary/[0.03] px-4 py-3">
        <div className="min-w-0 flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
            {goalLabel}
          </span>
          <span className="mt-0.5 truncate text-sm font-medium text-primary/90">
            {complete
              ? uiLang === "ko"
                ? "이번 주 목표 달성!"
                : "Weekly goal reached"
              : doneLabel}
          </span>
        </div>
        <div
          className="flex shrink-0 gap-1.5"
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={target}
        >
          {Array.from({ length: target }).map((_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i < done ? "bg-primary" : "bg-primary/15"
              }`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
