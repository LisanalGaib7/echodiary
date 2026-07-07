import type { Overall } from "@/lib/types";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { SubScore } from "./SubScore";

function scoreColor(s: number) {
  if (s >= 8) return "text-success";
  if (s >= 5) return "text-warning";
  return "text-destructive";
}

export function OverallSection({ overall }: { overall: Overall }) {
  const { uiLang } = useUiLang();
  const o = overall;
  return (
    <section className="journal-card p-6">
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex items-baseline gap-2">
          <span
            className={`score-text text-6xl font-semibold tabular-nums ${scoreColor(o.score)}`}
          >
            {o.score.toFixed(1)}
          </span>
          <span className="score-text text-lg text-muted-foreground">/ 10</span>
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
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-success">
            {t("strengths", uiLang)}
          </div>
          <p className="text-sm leading-relaxed">{o.strengths}</p>
        </div>
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-warning">
            {t("improvements", uiLang)}
          </div>
          <p className="text-sm leading-relaxed">{o.improvements}</p>
        </div>
      </div>
    </section>
  );
}
