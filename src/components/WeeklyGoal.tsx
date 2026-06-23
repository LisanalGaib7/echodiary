import { useEffect, useState } from "react";
import { Pencil, Flame } from "lucide-react";
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
    <div className="journal-card flex flex-col gap-3 px-5 py-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {uiLang === "ko" ? "이번 주 목표" : "This week"}
        </span>
        {editing ? (
          <input
            type="number"
            min={1}
            max={14}
            defaultValue={target}
            autoFocus
            onBlur={(e) => save(Number(e.target_path.value))}
            onKeyDown={(e) => e.key === "Enter" && save(Number((e.target as HTMLInputElement).value))}
            className="w-16 rounded-md border border-border bg-transparent px-2 py-1 text-right text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="group flex items-center gap-1.5 text-sm font-mono text-muted-foreground transition-colors hover:text-foreground"
            title={uiLang === "ko" ? "목표 수정" : "Edit goal"}
          >
            <span>{done} / {target}</span>
            <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex shrink-0 items-center gap-1 text-xs">
          <Flame className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium text-foreground">{streak}</span>
          <span className="text-muted-foreground">
            {uiLang === "ko" ? "일 연속" : `day${streak === 1 ? "" : "s"}`}
          </span>
        </div>
      </div>
    </div>
  );
}
