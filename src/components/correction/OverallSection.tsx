import type { Overall } from "@/lib/types";
import type { ScoreTrend } from "@/lib/insights";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { ScoreRing } from "./ScoreRing";
import { Sparkline } from "./Sparkline";

const SUB_LABEL_KEYS = ["accuracy", "naturalness", "vocabulary", "structure"] as const;

export function OverallSection({ overall, trend }: { overall: Overall; trend?: ScoreTrend }) {
  const { uiLang } = useUiLang();
  const o = overall;

  const subs = SUB_LABEL_KEYS.map((key) => ({
    key,
    label: t(key, uiLang),
    value: o.subScores[key],
  })).sort((a, b) => a.value - b.value);

  const delta = trend?.priorAvg != null ? o.score - trend.priorAvg : null;

  return (
    <section className="journal-card p-6">
      <div className="flex flex-wrap items-center gap-6">
        <ScoreRing score={o.score} />
        <div className="flex min-w-0 flex-col gap-1.5">
          {delta != null && trend && (
            <div className="flex flex-wrap items-baseline gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-[0.78rem] tabular-nums ${
                  delta >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                }`}
              >
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                {uiLang === "ko"
                  ? `최근 ${trend.scores.length - 1}편 평균 ${trend.priorAvg!.toFixed(1)}`
                  : `vs. last ${trend.scores.length - 1} avg ${trend.priorAvg!.toFixed(1)}`}
              </span>
            </div>
          )}
          {trend && trend.scores.length >= 2 && (
            <Sparkline
              scores={trend.scores}
              label={uiLang === "ko" ? "최근 점수 추이" : "Recent score trend"}
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {subs.map((s, i) => (
          <div
            key={s.key}
            className="grid grid-cols-[6.5rem_1fr_2.2rem] items-center gap-3 text-sm"
          >
            <span className={i === 0 ? "font-semibold text-ink" : "text-muted-foreground"}>
              {s.label}
            </span>
            <span className="h-[5px] overflow-hidden rounded-full bg-secondary">
              <span
                className={`block h-full rounded-full ${i === 0 ? "bg-primary" : "bg-primary/35"}`}
                style={{ width: `${s.value * 10}%` }}
              />
            </span>
            <span
              className={`score-text text-right tabular-nums ${i === 0 ? "text-primary" : "text-muted-foreground"}`}
            >
              {s.value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-primary/25 bg-primary/5 p-4">
        <div className="mb-1 font-mono text-xs uppercase tracking-wide text-primary">
          {t("focusTitle", uiLang)}
        </div>
        <p className="text-sm leading-relaxed">{o.improvements}</p>
      </div>

      <p className="mt-4 flex gap-2 text-sm text-muted-foreground">
        <span className="shrink-0 font-semibold text-success">{t("strengths", uiLang)}</span>
        <span>{o.strengths}</span>
      </p>
    </section>
  );
}
