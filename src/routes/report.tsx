import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getAllEntries } from "@/lib/db";
import type { Entry, Lang } from "@/lib/types";
import { categoryLabel } from "@/lib/categories";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Echo — Report" },
      { name: "description", content: "See which errors you make most often, per language." },
    ],
  }),
  component: ReportPage,
});

type Period = "all" | "30d";

interface CategoryAgg {
  code: string;
  count: number;
  examples: { original: string; refined: string }[];
}

interface LangReport {
  lang: Lang;
  entryCount: number;
  avgScore: number;
  categories: CategoryAgg[];
}

function buildReport(entries: Entry[], lang: Lang): LangReport {
  const filtered = entries.filter((e) => e.language === lang);
  const map = new Map<string, CategoryAgg>();
  for (const e of filtered) {
    for (const c of e.changes) {
      const cur = map.get(c.category) ?? { code: c.category, count: 0, examples: [] };
      cur.count++;
      if (cur.examples.length < 3) cur.examples.push({ original: c.original, refined: c.refined });
      map.set(c.category, cur);
    }
  }
  const categories = [...map.values()].sort((a, b) => b.count - a.count);
  const avg = filtered.length ? filtered.reduce((s, e) => s + e.overall.score, 0) / filtered.length : 0;
  return { lang, entryCount: filtered.length, avgScore: avg, categories };
}

function ReportPage() {
  const { uiLang } = useUiLang();
  const [period, setPeriod] = useState<Period>("all");
  const [reports, setReports] = useState<{ en: LangReport; ko: LangReport } | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const all = await getAllEntries();
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const filtered = period === "30d"
        ? all.filter((e) => new Date(e.createdAt).getTime() >= cutoff)
        : all;
      setReports({ en: buildReport(filtered, "en"), ko: buildReport(filtered, "ko") });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold">{t("navReport", uiLang)}</h1>
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-md border border-border text-sm">
            <button onClick={() => setPeriod("all")} className={`px-3 py-1.5 ${period === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{t("allTime", uiLang)}</button>
            <button onClick={() => setPeriod("30d")} className={`px-3 py-1.5 ${period === "30d" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{t("last30", uiLang)}</button>
          </div>
          <button onClick={generate} disabled={loading} className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {loading ? "…" : t("generate", uiLang)}
          </button>
        </div>
      </div>

      {reports === null ? (
        <div className="journal-card p-12 text-center text-muted-foreground">
          {uiLang === "ko" ? "기간을 선택하고 레포트를 생성하세요." : "Pick a period and generate your report."}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <LangReportCard r={reports.en} title={t("english", uiLang)} />
          <LangReportCard r={reports.ko} title={t("korean", uiLang)} />
        </div>
      )}
    </div>
  );
}

function LangReportCard({ r, title }: { r: LangReport; title: string }) {
  const { uiLang } = useUiLang();
  const max = r.categories[0]?.count ?? 1;
  return (
    <section className="journal-card p-6">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="text-xs text-muted-foreground">{r.entryCount} {t("entries", uiLang)}</div>
      </header>

      <div className="mb-6 flex items-baseline gap-3 border-b border-border pb-4">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{t("avgScore", uiLang)}</span>
        <span className="font-serif text-3xl font-semibold text-primary">{r.avgScore.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">/ 10</span>
      </div>

      {r.categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noEntries", uiLang)}</p>
      ) : (
        <ul className="space-y-4">
          {r.categories.map((c) => (
            <li key={c.code}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">{categoryLabel(r.lang, c.code, uiLang)}</span>
                <span className="font-mono text-xs text-muted-foreground">×{c.count}</span>
              </div>
              <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(c.count / max) * 100}%` }} />
              </div>
              <ul className="space-y-1 pl-1 text-xs">
                {c.examples.map((ex, i) => (
                  <li key={i} className="text-muted-foreground">
                    <span className="text-destructive line-through">{ex.original}</span>
                    <span className="mx-1.5">→</span>
                    <span className="text-success">{ex.refined}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
