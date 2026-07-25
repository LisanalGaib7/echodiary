// Derives "how does this entry compare" signals from the user's own history.
// Both helpers read from the same entries array the Write page already has
// on hand after a correction — no new storage, no server calls.

import type { Entry, Lang } from "./types";

export interface ScoreTrend {
  /** Chronological, current entry last. */
  scores: number[];
  /** Average of same-language entries before this one, or null if this is the first. */
  priorAvg: number | null;
}

export function buildScoreTrend(
  entries: Entry[],
  currentId: string,
  lang: Lang,
  maxPoints = 6,
): ScoreTrend {
  const sameLang = entries
    .filter((e) => e.language === lang && e.id !== currentId)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  const current = entries.find((e) => e.id === currentId);
  const prior = sameLang.slice(-(maxPoints - 1));
  const priorAvg = prior.length
    ? prior.reduce((sum, e) => sum + e.overall.score, 0) / prior.length
    : null;

  const scores = [
    ...prior.map((e) => e.overall.score),
    ...(current ? [current.overall.score] : []),
  ];
  return { scores, priorAvg };
}

/** Category code -> how many times it appeared across entries in the last `windowDays`. */
export function buildWeeklyCategoryCounts(
  entries: Entry[],
  windowDays = 7,
): Record<string, number> {
  const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  const counts: Record<string, number> = {};
  for (const e of entries) {
    if (new Date(e.createdAt).getTime() < cutoff) continue;
    for (const c of e.changes) counts[c.category] = (counts[c.category] ?? 0) + 1;
  }
  return counts;
}
