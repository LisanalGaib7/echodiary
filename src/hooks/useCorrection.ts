import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { track } from "@vercel/analytics";
import { correctEntry } from "@/lib/correction.functions";
import { saveEntry } from "@/lib/db";
import { t } from "@/lib/i18n";
import { useUiLang } from "@/lib/ui-lang";
import { useExplainLang } from "@/lib/explain-lang";
import { todayISODate, uuid } from "@/lib/format";
import { judgeMission, type Mission } from "@/lib/missions";
import type { Entry } from "@/lib/types";

export function useCorrection() {
  const { uiLang } = useUiLang();
  const { explainLang } = useExplainLang();
  const correct = useServerFn(correctEntry);
  const [loading, setLoading] = useState(false);
  // Holds the full saved Entry (not just the raw CorrectionResult) so callers
  // have `id`/`date` for anything keyed to the saved entry — e.g. saving a
  // selected phrase from the Refined text needs entryId/entryDate.
  const [result, setResult] = useState<Entry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastText, setLastText] = useState<string>("");

  const [lastMission, setLastMission] = useState<Mission | null>(null);

  const submit = useCallback(
    async (text: string, mission?: Mission | null) => {
      if (!text.trim()) {
        toast.error(t("empty", uiLang));
        return;
      }
      setLastText(text);
      setLastMission(mission ?? null);
      setLoading(true);
      setResult(null);
      setError(null);
      try {
        const r = await correct({ data: { text, explainLang } });
        const now = new Date();
        const entry: Entry = {
          ...r,
          id: uuid(),
          date: todayISODate(now),
          originalText: text,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          // Only set when a mission was active AND matches the language the
          // AI actually detected — a mission assigned for English shouldn't
          // silently "pass" a Korean entry it was never meant to judge.
          mission:
            mission && mission.language === r.language
              ? { category: mission.category, passed: judgeMission(mission, r.changes) }
              : undefined,
        };
        await saveEntry(entry);
        setResult(entry);
        // The metric that actually answers "does anyone use this" — page
        // views alone can't tell visiting apart from writing. Language code
        // only; no diary text leaves the device for analytics.
        track("correction_completed", { lang: r.language });
        toast.success(t("correctionSaved", uiLang));
      } catch (e) {
        console.error(e);
        const msg = t("errorOccurred", uiLang);
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [correct, uiLang, explainLang],
  );

  const retry = useCallback(() => {
    if (lastText) void submit(lastText, lastMission);
  }, [lastText, lastMission, submit]);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return { loading, result, error, lastText, submit, retry, reset };
}
