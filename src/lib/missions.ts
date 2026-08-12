// "Today's mission": derived entirely from the user's own recent history,
// no AI call. See echodiary Product Spec §6 for the design rationale
// (Phase 1 is avoidance-type missions only — judged deterministically from
// changes[], never from a fresh model call).

import type { Change, Entry, Lang } from "./types";
import { buildReport } from "./report";
import { categorySeverity } from "./categories";
import { toYMD } from "./goals";

export interface Mission {
  language: Lang;
  category: string;
}

const WINDOW_DAYS = 14;
const CACHE_PREFIX = "echo.mission.";
const SKIP_PREFIX = "echo.mission.skip.";

function withinWindow(entries: Entry[], days: number): Entry[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return entries.filter((e) => new Date(e.createdAt).getTime() >= cutoff);
}

/** Most common diary language in the window; ties break toward the most
 *  recent entry's language. Null if the window is empty. */
function dominantLanguage(entries: Entry[]): Lang | null {
  if (entries.length === 0) return null;
  const counts: Record<string, number> = {};
  for (const e of entries) counts[e.language] = (counts[e.language] ?? 0) + 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = sorted[0][0] as Lang;
  const tied = sorted.filter(([, c]) => c === sorted[0][1]);
  if (tied.length === 1) return top;
  return entries[0].language; // entries are createdAt-desc (see getAllEntries)
}

function computeMission(entries: Entry[]): Mission | null {
  const window = withinWindow(entries, WINDOW_DAYS);
  const lang = dominantLanguage(window);
  if (!lang) return null;

  const report = buildReport(window, lang);
  if (report.categories.length === 0) return null;

  // Prefer a "core" (meaning-changing) category over idiom/nit — those are
  // the errors worth a day's focused attention. Falls back to the single
  // most frequent category if nothing core-severity showed up.
  const core = report.categories.find((c) => categorySeverity(lang, c.code) === "core");
  const category = (core ?? report.categories[0]).code;

  return { language: lang, category };
}

/** Stable for the whole day once assigned, so the mission doesn't shift
 *  mid-session as new entries land. Returns null when there isn't enough
 *  history yet — callers should render nothing rather than a placeholder. */
export function getTodayMission(entries: Entry[]): Mission | null {
  if (typeof window === "undefined") return null;
  const key = CACHE_PREFIX + toYMD(new Date());
  const cached = window.localStorage.getItem(key);
  if (cached) {
    try {
      return JSON.parse(cached) as Mission;
    } catch {
      // fall through and recompute
    }
  }
  const mission = computeMission(entries);
  if (mission) window.localStorage.setItem(key, JSON.stringify(mission));
  return mission;
}

export function isMissionSkippedToday(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SKIP_PREFIX + toYMD(new Date())) === "1";
}

export function skipMissionToday(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SKIP_PREFIX + toYMD(new Date()), "1");
}

/** True (mission passed) when none of the flagged changes match the
 *  mission's category — the whole judgment, no AI involved. */
export function judgeMission(mission: Mission, changes: Change[]): boolean {
  return !changes.some((c) => c.category === mission.category);
}

/** Consecutive most-recent entries (entries are createdAt-desc) that passed
 *  a mission in this exact category. Stops at the first entry with no
 *  mission, a different category, or a fail. */
export function missionStreak(entries: Entry[], category: string): number {
  let streak = 0;
  for (const e of entries) {
    if (!e.mission || e.mission.category !== category || !e.mission.passed) break;
    streak++;
  }
  return streak;
}
