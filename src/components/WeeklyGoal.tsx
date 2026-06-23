import { useEffect, useRef, useState } from "react";
import { Pencil, Flame, Check } from "lucide-react";
import { getGoal, setGoal, entriesThisWeek, currentStreak } from "@/lib/goals";
import { getAllEntries } from "@/lib/db";
import { useUiLang } from "@/lib/ui-lang";

export function WeeklyGoal() {
  const { uiLang } = useUiLang();
  const [target, setTarget] = useState(3);
  const [done, setDone] = useState(0);
  const [streak, setStreak] = useState(0);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTarget(getGoal().target);
    getAllEntries().then((entries) => {
      const dates = entries.map((e) => e.date);
      setDone(entriesThisWeek(dates));
      setStreak(currentStreak(dates));
    });
  }, []);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const complete = done >= target;

  function save(n: number) {
    const v = Math.max(1, Math.min(14, Math.floor(n) || 1));
    setTarget(v);
    setGoal({ target: v });
    setEditing(false);
  }

  const dayLabels =
    uiLang === "ko" ? ["월", "화", "수", "목", "금", "토", "일"] : ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <section
      aria-label={uiLang === "ko" ? "이번 주 진행" : "This week's progress"}
      className="border-y border-border/40 py-6"
    >
      {/* Two-column ledger: GOAL | STREAK, separated by a hairline */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-6 sm:gap-10">
        {/* LEFT — Goal (hero metric) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {uiLang === "ko" ? "이번 주" : "This week"}
            </span>
            {complete && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
                <Check className="h-3 w-3" strokeWidth={2.5} />
                {uiLang === "ko" ? "달성" : "Reached"}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 font-serif tabular-nums leading-none">
            <span className="text-5xl font-medium text-foreground sm:text-6xl">{done}</span>
            <span className="text-2xl text-muted-foreground/50 sm:text-3xl">/</span>
            {editing ? (
              <input
                ref={inputRef}
                type="number"
                min={1}
                max={14}
                defaultValue={target}
                onBlur={(e) => save(Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") save(Number((e.target as HTMLInputElement).value));
                  if (e.key === "Escape") setEditing(false);
                }}
                className="w-[1.6em] bg-transparent text-2xl text-muted-foreground outline-none sm:text-3xl"
                style={{ font: "inherit" }}
              />
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="group inline-flex items-baseline gap-1.5 text-2xl text-muted-foreground transition-colors hover:text-foreground sm:text-3xl"
                title={uiLang === "ko" ? "목표 수정" : "Edit goal"}
              >
                <span>{target}</span>
                <Pencil
                  className="h-3 w-3 self-center opacity-0 transition-opacity group-hover:opacity-60"
                  strokeWidth={2}
                />
              </button>
            )}
          </div>
        </div>

        {/* Vertical hairline */}
        <div className="w-px self-stretch bg-border/70" aria-hidden />

        {/* RIGHT — Streak (supporting metric, smaller & lighter) */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-1.5">
            <Flame className="h-3 w-3 text-primary" strokeWidth={2.5} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {uiLang === "ko" ? "연속" : "Streak"}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-3xl font-light tabular-nums text-muted-foreground sm:text-4xl">
              {streak}
            </span>
            <span className="pb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
              {uiLang === "ko"
                ? "일"
                : `day${streak === 1 ? "" : "s"}`}
            </span>
          </div>
        </div>
      </div>

      {/* Segmented progress */}
      <div
        className="mt-6 grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${target}, minmax(0, 1fr))` }}
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={target}
      >
        {Array.from({ length: target }).map((_, i) => {
          const filled = i < done;
          return (
            <span
              key={i}
              className={`h-1 rounded-full transition-colors duration-500 ${
                filled ? "bg-primary" : "bg-muted"
              }`}
              style={{ transitionDelay: `${i * 40}ms` }}
            />
          );
        })}
      </div>

      {/* Day labels */}
      <div className="mt-2 flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
        {dayLabels.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
    </section>
  );
}
