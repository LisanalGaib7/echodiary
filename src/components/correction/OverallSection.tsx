import type { Overall } from "@/lib/types";
import type { ScoreTrend } from "@/lib/insights";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { ScoreRing } from "./ScoreRing";
import { Sparkline } from "./Sparkline";
import { SectionLabel } from "./SectionLabel";

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
      <SectionLabel>{t("overall", uiLang)}</SectionLabel>

      {/* One neutral box for every number: ring + trend + sub-scores. Color is
          reserved for the two prose boxes below, so it reads as "here's where
          the coach is talking" rather than competing with them. */}
      <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-5">
        <div className="flex flex-wrap items-center gap-6">
          <ScoreRing score={o.score} />

          {/* Fixed-height so this column doesn't jump between "has history" and "first entry". */}
          <div className="flex min-h-14 min-w-0 flex-1 flex-col justify-center gap-1.5">
            {delta != null && trend ? (
              <>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[0.78rem] tabular-nums ${
                      delta >= 0
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
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
                {trend.scores.length >= 2 && (
                  <Sparkline
                    scores={trend.scores}
                    label={uiLang === "ko" ? "최근 점수 추이" : "Recent score trend"}
                  />
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{t("trendEmpty", uiLang)}</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
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
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="rounded-lg border border-primary/25 bg-primary/5 p-4">
          <div className="mb-1.5 text-sm font-semibold text-primary">{t("focusTitle", uiLang)}</div>
          <p className="text-sm leading-relaxed text-foreground">{o.improvements}</p>
        </div>
        <div className="rounded-lg border border-success/25 bg-success/5 p-4">
          <div className="mb-1.5 text-sm font-semibold text-success">{t("strengths", uiLang)}</div>
          <p className="text-sm leading-relaxed text-foreground">{o.strengths}</p>
        </div>
      </div>
    </section>
  );
}
