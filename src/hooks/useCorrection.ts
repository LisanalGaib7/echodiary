import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { correctEntry } from "@/lib/correction.functions";
import { saveEntry } from "@/lib/db";
import { t } from "@/lib/i18n";
import { useUiLang } from "@/lib/ui-lang";
import { todayISODate, uuid } from "@/lib/format";
import type { CorrectionResult, Entry } from "@/lib/types";

export function useCorrection() {
  const { uiLang } = useUiLang();
  const correct = useServerFn(correctEntry);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);

  async function submit(text: string) {
    if (!text.trim()) {
      toast.error(t("empty", uiLang));
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await correct({ data: { text } });
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
    } catch (e) {
      console.error(e);
      toast.error(t("errorOccurred", uiLang));
    } finally {
      setLoading(false);
    }
  }

  return { loading, result, submit };
}
