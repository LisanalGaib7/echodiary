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
      className="py-10"
    >
      <div className="flex items-center justify-between gap-6">
        {/* Goal — compact inline */}
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {uiLang === "ko" ? "이번 주" : "This week"}
          </span>
          <span className="font-serif text-base tabular-nums text-foreground">
            {done}
            <span className="text-muted-foreground/50">/</span>
            {editing ? (
            <input
                ref={inputRef}
                type="number"
                min={1}
                max={14}
 page={1}
                defaultValue={target}
                onBlur={(e) => save(Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") save(Number((e.target as HTMLInputElement).value));
                  if (e.key === "Escape") setEditing(false);
                }}
                className="w-[2.2em] border-b border-primary/40 bg-transparent pb-px text-center text-foreground outline-none transition-colors focus:border-primary"
                style={{ font: "inherit" }}
              />
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="group inline-flex items-baseline gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={uiLang === "ko" ? "목표 수정" : "Edit goal"}
              >
                <span className="border-b border-transparent pb-px transition-all group-hover:border-muted-foreground/40">
                  {target}
                </span>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted/60 transition-all group-hover:bg-muted">
                  <Pencil className="h-2.5 w-2.5 opacity-40 transition-opacity group-hover:opacity-100" strokeWidth={2} />
                </span>
              </button>
            )}
          </span>
          {complete && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
              <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
              {uiLang === "ko" ? "달성" : "Reached"}
            </span>
          )}
        </div>

        {/* Streak — compact inline */}
        <div className="flex items-baseline gap-1.5">
          <Flame className="h-2.5 w-2.5 self-center text-primary" strokeWidth={2.5} />
          <span className="font-serif text-base tabular-nums text-foreground">{streak}</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {uiLang === "ko" ? "일 연속" : `day${streak === 1 ? "" : "s"} streak`}
          </span>
        </div>
      </div>

      {/* Hairline segmented bar — very thin, almost invisible until filled */}
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
      <div className="mt-1.5 flex justify-between text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40">
        {dayLabels.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
    </section>
  );
}
