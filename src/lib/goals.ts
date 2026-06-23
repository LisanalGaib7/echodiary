const KEY = "echo-weekly-goal";

export interface WeeklyGoal {
  target: number; // entries per week
}

export function getGoal(): WeeklyGoal {
  if (typeof window === "undefined") return { target: 3 };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { target: 3 };
}

export function setGoal(g: WeeklyGoal) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(g));
}

// Returns Monday of current ISO week at 00:00 local
export function startOfWeek(d = new Date()): Date {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = (date.getDay() + 6) % 7; // 0 = Mon
  date.setDate(date.getDate() - day);
  return date;
}

export function entriesThisWeek(dates: string[]): number {
  const start = startOfWeek().getTime();
  const uniq = new Set<string>();
  for (const d of dates) {
    const t = new Date(d).getTime();
    if (t >= start) uniq.add(d);
  }
  return uniq.size;
}

// Compute current consecutive-day streak (counting today or yesterday as start)
export function currentStreak(dates: string[]): number {
  const set = new Set(dates);
  let streak = 0;
  const cur = new Date();
  cur.setHours(0, 0, 0, 0);
  // Allow today missing: start from today, if absent try yesterday
  if (!set.has(toYMD(cur))) cur.setDate(cur.getDate() - 1);
  while (set.has(toYMD(cur))) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

export function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
