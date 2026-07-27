import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { correctEntry } from "@/lib/correction.functions";
import { saveEntry } from "@/lib/db";
import { t } from "@/lib/i18n";
import { useUiLang } from "@/lib/ui-lang";
import { useExplainLang } from "@/lib/explain-lang";
import { todayISODate, uuid } from "@/lib/format";
import type { CorrectionResult, Entry } from "@/lib/types";

export function useCorrection() {
  const { uiLang } = useUiLang();
  const { explainLang } = useExplainLang();
  const correct = useServerFn(correctEntry);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastText, setLastText] = useState<string>("");

  const submit = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        toast.error(t("empty", uiLang));
        return;
      }
      setLastText(text);
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
        };
        await saveEntry(entry);
        setResult(r);
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
    if (lastText) void submit(lastText);
  }, [lastText, submit]);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return { loading, result, error, lastText, submit, retry, reset };
}
