const KEY = "echo-weekly-goal";

export interface WeeklyGoal {
  target: number; // entries per week
}

export function getGoal(): WeeklyGoal {
  if (typeof window === "undefined") return { target: 3 };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Corrupt or unreadable value — fall through to the default below.
  }
  return { target: 3 };
}

export function setGoal(g: WeeklyGoal) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(g));
}

// Monday of current ISO week at 00:00 local
export function startOfWeek(d = new Date()): Date {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = (date.getDay() + 6) % 7; // 0 = Mon
  date.setDate(date.getDate() - day);
  return date;
}

// Count unique local-date entries from the week's Monday onward.
// Compares YYYY-MM-DD strings to avoid timezone drift from Date parsing.
export function entriesThisWeek(dates: string[]): number {
  const startYmd = toYMD(startOfWeek());
  const uniq = new Set<string>();
  for (const d of dates) {
    if (d >= startYmd) uniq.add(d);
  }
  return uniq.size;
}

// Current consecutive-day streak, counting today or yesterday as start.
export function currentStreak(dates: string[]): number {
  const set = new Set(dates);
  let streak = 0;
  const cur = new Date();
  cur.setHours(0, 0, 0, 0);
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
