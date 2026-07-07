import { categoryLabel } from "@/lib/categories";
import type { LangReport } from "@/lib/report";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { ProgressBar } from "@/components/ui-common/ProgressBar";

export function LangReportCard({ r, title }: { r: LangReport; title: string }) {
  const { uiLang } = useUiLang();
  const max = r.categories[0]?.count ?? 1;

  return (
    <section className="journal-card p-6">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="text-xs text-muted-foreground">
          {r.entryCount} {t("entries", uiLang)}
        </div>
      </header>

      <div className="mb-6 flex items-baseline gap-3 border-b border-border pb-4">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {t("avgScore", uiLang)}
        </span>
        <span className="font-serif text-3xl font-semibold text-primary">
          {r.avgScore.toFixed(1)}
        </span>
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
              <div className="mb-2">
                <ProgressBar value={c.count} max={max} />
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
