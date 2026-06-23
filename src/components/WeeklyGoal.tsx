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

  const pct = Math.min(100, Math.round((done / Math.max(1, target)) * 100));
  const complete = done >= target;

  function save(n: number) {
    const v = Math.max(1, Math.min(14, Math.floor(n) || 1));
    setTarget(v);
    setGoal({ target: v });
    setEditing(false);
  }

  // Day labels for the week (Mon-Sun)
  const dayLabels =
    uiLang === "ko" ? ["월", "화", "수", "목", "금", "토", "일"] : ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <section className="journal-card relative overflow-hidden px-6 py-5">
      {/* Header row */}
      <header className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
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

        {streak > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <span className="font-mono tabular-nums text-foreground">{streak}</span>
            <span>
              {uiLang === "ko" ? "일 연속" : `day${streak === 1 ? "" : "s"} streak`}
            </span>
          </div>
        )}
      </header>

      {/* Hero numeric — editorial focal point */}
      <div className="mt-3 flex items-end justify-between gap-6">
        <div className="flex items-baseline gap-2 font-serif tabular-nums leading-none">
          <span className="text-5xl font-medium text-foreground sm:text-6xl">{done}</span>
          <span className="text-2xl text-muted-foreground/60 sm:text-3xl">/</span>
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
              className="w-[1.6em] bg-transparent text-2xl text-foreground outline-none sm:text-3xl"
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

        <p className="pb-1 text-right text-xs leading-tight text-muted-foreground">
          {complete ? (
            <span className="text-foreground">
              {uiLang === "ko" ? "이번 주 목표 완료" : "Goal complete"}
            </span>
          ) : (
            <>
              {uiLang === "ko"
                ? `${target - done}편 남음`
                : `${target - done} to go`}
            </>
          )}
        </p>
      </div>

      {/* Segmented progress — one slot per target entry */}
      <div
        className="mt-5 grid gap-1.5"
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
              className={`h-1.5 rounded-full transition-colors duration-500 ${
                filled ? "bg-primary" : "bg-muted"
              }`}
              style={{ transitionDelay: `${i * 40}ms` }}
            />
          );
        })}
      </div>

      {/* Day-of-week footer reference */}
      <div className="mt-2 flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
        {dayLabels.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <span className="sr-only">{pct}%</span>
    </section>
  );
}
