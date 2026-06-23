import { useEffect, useRef, useState } from "react";
import { Pencil, Flame, Check } from "lucide-react";
import { getGoal, setGoal, entriesThisWeek, currentStreak } from "@/lib/goals";
import { getAllEntries } from "@/lib/db";
import { useUiLang } from "@/lib/ui-lang";

type Variant = "B" | "C";

export function WeeklyGoal() {
  const { uiLang } = useUiLang();
  const [target, setTarget] = useState(3);
  const [done, setDone] = useState(0);
  const [streak, setStreak] = useState(0);
  const [editing, setEditing] = useState(false);
  const [variant, setVariant] = useState<Variant>("B");
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

  // Variant toggle (temporary, for design comparison)
  const Toggle = (
    <div className="mb-3 flex items-center justify-end gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
      <span className="mr-1 opacity-60">preview:</span>
      {(["B", "C"] as Variant[]).map((v) => (
        <button
          key={v}
          onClick={() => setVariant(v)}
          className={`rounded px-2 py-0.5 transition-colors ${
            variant === v
              ? "bg-foreground text-background"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          }`}
        >
          {v === "B" ? "B · Floating" : "C · Airy"}
        </button>
      ))}
    </div>
  );

  // ── Option B: Floating Overlap Card ─────────────────────────────
  if (variant === "B") {
    return (
      <>
        {Toggle}
        <section
          aria-label={uiLang === "ko" ? "이번 주 진행" : "This week's progress"}
          className="relative z-10 -mb-6 rounded-2xl border border-border/50 bg-background p-5 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.18)] sm:p-6"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-6 sm:gap-10">
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
                <span className="text-4xl font-medium text-foreground sm:text-5xl">{done}</span>
                <span className="text-xl text-muted-foreground/50 sm:text-2xl">/</span>
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
                    className="w-[1.6em] bg-transparent text-xl text-muted-foreground outline-none sm:text-2xl"
                    style={{ font: "inherit" }}
                  />
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="group inline-flex items-baseline gap-1.5 text-xl text-muted-foreground transition-colors hover:text-foreground sm:text-2xl"
                  >
                    <span>{target}</span>
                    <Pencil className="h-3 w-3 self-center opacity-0 transition-opacity group-hover:opacity-60" strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>

            <div className="w-px self-stretch bg-border/70" aria-hidden />

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-1.5">
                <Flame className="h-3 w-3 text-primary" strokeWidth={2.5} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {uiLang === "ko" ? "연속" : "Streak"}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="text-3xl font-light tabular-nums text-muted-foreground sm:text-4xl">{streak}</span>
                <span className="pb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                  {uiLang === "ko" ? "일" : `day${streak === 1 ? "" : "s"}`}
                </span>
              </div>
            </div>
          </div>

          <div
            className="mt-5 grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${target}, minmax(0, 1fr))` }}
            role="progressbar"
            aria-valuenow={done}
            aria-valuemin={0}
            aria-valuemax={target}
          >
            {Array.from({ length: target }).map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-colors duration-500 ${i < done ? "bg-primary" : "bg-muted"}`}
                style={{ transitionDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
            {dayLabels.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
        </section>
      </>
    );
  }

  // ── Option C: Airy Typography Scale Jump ────────────────────────
  return (
    <>
      {Toggle}
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
                  defaultValue={target}
                  onBlur={(e) => save(Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") save(Number((e.target as HTMLInputElement).value));
                    if (e.key === "Escape") setEditing(false);
                  }}
                  className="w-[1.6em] bg-transparent text-muted-foreground outline-none"
                  style={{ font: "inherit" }}
                />
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="group inline-flex items-baseline gap-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>{target}</span>
                  <Pencil className="h-2.5 w-2.5 self-center opacity-0 transition-opacity group-hover:opacity-60" strokeWidth={2} />
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
    </>
  );
}
