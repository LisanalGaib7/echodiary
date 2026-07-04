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

export function todayISODate(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
