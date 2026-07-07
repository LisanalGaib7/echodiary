import type { Entry, Lang } from "./types";

export interface CategoryAgg {
  code: string;
  count: number;
  examples: { original: string; refined: string }[];
}

export interface LangReport {
  lang: Lang;
  entryCount: number;
  avgScore: number;
  categories: CategoryAgg[];
}

const MAX_EXAMPLES = 3;

export function buildReport(entries: Entry[], lang: Lang): LangReport {
  const filtered = entries.filter((e) => e.language === lang);
  const map = new Map<string, CategoryAgg>();

  for (const e of filtered) {
    for (const c of e.changes) {
      const cur = map.get(c.category) ?? { code: c.category, count: 0, examples: [] };
      cur.count++;
      if (cur.examples.length < MAX_EXAMPLES) {
        cur.examples.push({ original: c.original, refined: c.refined });
      }
      map.set(c.category, cur);
    }
  }

  const categories = [...map.values()].sort((a, b) => b.count - a.count);
  const avgScore = filtered.length
    ? filtered.reduce((s, e) => s + e.overall.score, 0) / filtered.length
    : 0;

  return { lang, entryCount: filtered.length, avgScore, categories };
}

export function filterByPeriod(entries: Entry[], period: "all" | "30d"): Entry[] {
  if (period === "all") return entries;
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return entries.filter((e) => new Date(e.createdAt).getTime() >= cutoff);
}
