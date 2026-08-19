import { useMemo } from "react";
import { toYMD } from "@/lib/goals";

interface Props {
  dates: string[]; // YYYY-MM-DD
  weeks?: number;
}

// GitHub-style heatmap: columns = weeks, rows = days (Mon..Sun)
export function StreakHeatmap({ dates, weeks = 14 }: Props) {
  const { cols } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of dates) counts.set(d, (counts.get(d) ?? 0) + 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Find Sunday of current week (end of week)
    const endOfWeek = new Date(today);
    const dow = (today.getDay() + 6) % 7; // 0=Mon
    endOfWeek.setDate(today.getDate() + (6 - dow));

    const cols: { date: Date; ymd: string; count: number; future: boolean }[][] = [];
    const start = new Date(endOfWeek);
    start.setDate(start.getDate() - (weeks * 7 - 1));

    const cursor = new Date(start);
    for (let w = 0; w < weeks; w++) {
      const col: (typeof cols)[number] = [];
      for (let d = 0; d < 7; d++) {
        const ymd = toYMD(cursor);
        col.push({
          date: new Date(cursor),
          ymd,
          count: counts.get(ymd) ?? 0,
          future: cursor.getTime() > today.getTime(),
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      cols.push(col);
    }
    return { cols };
  }, [dates, weeks]);

  function shade(count: number, future: boolean): string {
    if (future) return "bg-transparent";
    if (count === 0) return "bg-muted/60";
    if (count === 1) return "bg-primary/35";
    if (count === 2) return "bg-primary/65";
    return "bg-primary";
  }

  return (
    <div className="flex gap-[3px]">
      {cols.map((col, i) => (
        <div key={i} className="flex flex-col gap-[3px]">
          {col.map((cell) => (
            <div
              key={cell.ymd}
              title={`${cell.ymd} · ${cell.count}`}
              className={`h-3 w-3 rounded-[3px] ${shade(cell.count, cell.future)}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
