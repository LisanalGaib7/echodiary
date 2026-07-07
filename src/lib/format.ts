import type { UiLang } from "./i18n";

export function uuid(): string {
  return crypto.randomUUID();
}

export function formatLongDate(date: Date, lang: UiLang): string {
  return date.toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Local-time YYYY-MM-DD. Using toISOString would flip the date across
// UTC midnight for users east of UTC (e.g. KST).
export function todayISODate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
