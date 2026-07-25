import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";
import { CorrectionView } from "@/components/CorrectionView";
import { CorrectionSkeleton } from "@/components/CorrectionSkeleton";
import { DiaryEditor } from "@/components/DiaryEditor";
import { useCorrection } from "@/hooks/useCorrection";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { Spinner } from "@/components/ui-common/Spinner";
import { getAllEntries } from "@/lib/db";
import { buildScoreTrend, buildWeeklyCategoryCounts } from "@/lib/insights";
import type { Entry } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Echo — Write & correct" },
      {
        name: "description",
        content: "Write a diary entry in English or Korean and get a native-level correction.",
      },
    ],
  }),
  component: WritePage,
});

function WritePage() {
  const { uiLang } = useUiLang();
  const { loading, result, error, submit, retry } = useCorrection();
  const [entries, setEntries] = useState<Entry[]>([]);

  // Recent entries power the score trend + "seen N times this week" badges below.
  // Only needed once a correction lands, and re-fetched each time so a new entry
  // (already saved by useCorrection before result is set) is reflected immediately.
  useEffect(() => {
    if (!result) return;
    getAllEntries().then(setEntries);
  }, [result]);

  const trend = useMemo(() => {
    const current = entries[0];
    if (!result || !current) return undefined;
    return buildScoreTrend(entries, current.id, current.language);
  }, [entries, result]);

  const weeklyCounts = useMemo(() => buildWeeklyCategoryCounts(entries), [entries]);

  return (
    <div className="space-y-16">
      <Toaster position="top-center" richColors closeButton />

      <header className="reveal space-y-4" style={{ animationDelay: "40ms" }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/60">
          Chapter I — Write
        </p>
        <h1 className="font-display text-6xl font-light leading-[0.92] tracking-[-0.03em] text-primary sm:text-7xl md:text-[6rem]">
          Echo <span className="italic font-light">your</span> thoughts.
        </h1>
      </header>

      <div className="reveal" style={{ animationDelay: "180ms" }}>
        <DiaryEditor loading={loading} onSubmit={submit} />
      </div>

      {loading && (
        <div className="reveal">
          <CorrectionSkeleton />
        </div>
      )}

      {error && !loading && (
        <div
          role="alert"
          className="journal-card flex flex-col gap-4 border-destructive/30 p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t("correctionFailed", uiLang)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("correctionFailedDesc", uiLang)}
              </p>
            </div>
          </div>
          <button
            onClick={retry}
            disabled={loading}
            className="inline-flex items-center gap-2 self-start rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary/10 disabled:opacity-60 sm:self-auto"
          >
            {loading && <Spinner size={12} />}
            {t("retry", uiLang)}
          </button>
        </div>
      )}

      {result && !loading && (
        <div className="reveal">
          <CorrectionView
            result={result}
            lang={result.language}
            trend={trend}
            weeklyCounts={weeklyCounts}
          />
        </div>
      )}
    </div>
  );
}
