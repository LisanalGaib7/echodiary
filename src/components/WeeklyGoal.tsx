import { useEffect, useState } from "react";
import { getGoal, setGoal, entriesThisWeek, currentStreak } from "@/lib/goals";
import { getAllEntries } from "@/lib/db";
import { useUiLang } from "@/lib/ui-lang";

export function WeeklyGoal() {
  const { uiLang } = useUiLang();
  const [target, setTarget] = useState(3);
  const [done, setDone] = useState(0);
  const [streak, setStreak] = useState(0);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setTarget(getGoal().target);
    getAllEntries().then((entries) => {
      const dates = entries.map((e) => e.date);
      setDone(entriesThisWeek(dates));
      setStreak(currentStreak(dates));
    });
  }, []);

  const pct = Math.min(100, Math.round((done / Math.max(1, target)) * 100));

  function save(n: number) {
    const v = Math.max(1, Math.min(14, n || 1));
    setTarget(v);
    setGoal({ target: v });
    setEditing(false);
  }

  return (
    <div className="journal-card flex flex-wrap items-center gap-5 px-5 py-4">
      <div className="flex-1 min-w-[200px]">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {uiLang === "ko" ? "이번 주 목표" : "This week"}
          </span>
          {editing ? (
            <input
              type="number"
              min={1}
              max={14}
              defaultValue={target}
              autoFocus
              onBlur={(e) => save(Number(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && save(Number((e.target as HTMLInputElement).value))}
              className="w-14 rounded border border-border bg-transparent px-1.5 py-0.5 text-right text-sm"
            />
          ) : (
            <button onClick={() => setEditing(true)} className="font-mono text-sm text-muted-foreground hover:text-foreground">
              {done} / {target}
            </button>
          )}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-2xl font-semibold text-primary">{streak}</span>
        <span className="text-xs text-muted-foreground">
          {uiLang === "ko" ? "일 연속" : `day${streak === 1 ? "" : "s"} streak`}
        </span>
      </div>
    </div>
  );
}
