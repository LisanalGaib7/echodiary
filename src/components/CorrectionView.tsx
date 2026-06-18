import type { CorrectionResult, Lang } from "@/lib/types";
import { categoryLabel } from "@/lib/categories";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

function scoreColor(s: number) {
  if (s >= 8) return "text-success";
  if (s >= 5) return "text-warning";
  return "text-destructive";
}

function SubScore({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${(value / 10) * 100}%` }} />
      </div>
    </div>
  );
}

export function CorrectionView({ result, lang }: { result: CorrectionResult; lang: Lang }) {
  const { uiLang } = useUiLang();
  const o = result.overall;

  return (
    <div className="space-y-6">
      {/* Refined */}
      <section className="journal-card p-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {t("refined", uiLang)}
        </h2>
        <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-ink">{result.refinedText}</p>
      </section>

      {/* Changes table */}
      <section className="journal-card overflow-hidden">
        <h2 className="border-b border-border px-6 py-4 text-lg font-semibold">{t("changes", uiLang)}</h2>
        {result.changes.length === 0 ? (
          <p className="px-6 py-8 text-center text-muted-foreground">{t("noChanges", uiLang)}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">{t("original", uiLang)}</th>
                  <th className="px-4 py-2.5 text-left font-medium">{t("refinedCol", uiLang)}</th>
                  <th className="px-4 py-2.5 text-left font-medium">{t("reason", uiLang)}</th>
                  <th className="px-4 py-2.5 text-left font-medium">{t("category", uiLang)}</th>
                </tr>
              </thead>
              <tbody>
                {result.changes.map((c, i) => (
                  <tr key={i} className="border-t border-border align-top">
                    <td className="px-4 py-3"><span className="rounded bg-destructive/10 px-1.5 py-0.5 text-destructive">{c.original}</span></td>
                    <td className="px-4 py-3"><span className="rounded bg-success/10 px-1.5 py-0.5 text-success">{c.refined}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{c.reason}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full border border-border bg-secondary px-2 py-0.5 text-xs">
                        {categoryLabel(lang, c.category, uiLang)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Overall */}
      <section className="journal-card p-6">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex items-baseline gap-2">
            <span className={`font-serif text-6xl font-semibold ${scoreColor(o.score)}`}>{o.score.toFixed(1)}</span>
            <span className="text-lg text-muted-foreground">/ 10</span>
          </div>
          <div className="flex-1 min-w-[240px] grid grid-cols-2 gap-3">
            <SubScore label={t("accuracy", uiLang)} value={o.subScores.accuracy} />
            <SubScore label={t("naturalness", uiLang)} value={o.subScores.naturalness} />
            <SubScore label={t("vocabulary", uiLang)} value={o.subScores.vocabulary} />
            <SubScore label={t("structure", uiLang)} value={o.subScores.structure} />
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-success/30 bg-success/5 p-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-success">{t("strengths", uiLang)}</div>
            <p className="text-sm leading-relaxed">{o.strengths}</p>
          </div>
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-warning">{t("improvements", uiLang)}</div>
            <p className="text-sm leading-relaxed">{o.improvements}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
