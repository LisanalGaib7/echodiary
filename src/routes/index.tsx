import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast, Toaster } from "sonner";
import { correctEntry } from "@/lib/correction.functions";
import { saveEntry } from "@/lib/db";
import type { Entry, CorrectionResult } from "@/lib/types";
import { CorrectionView } from "@/components/CorrectionView";
import { TypewriterTagline } from "@/components/TypewriterTagline";
import { WeeklyGoal } from "@/components/WeeklyGoal";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { useAutoGrowTextarea } from "@/hooks/useAutoGrowTextarea";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Echo — Write & correct" },
      { name: "description", content: "Write a diary entry in English or Korean and get a native-level correction." },
    ],
  }),
  component: WritePage,
});

function uuid() {
  return crypto.randomUUID();
}

function WritePage() {
  const { uiLang } = useUiLang();
  const correct = useServerFn(correctEntry);
  const [text, setText] = useState("");
  const textareaRef = useAutoGrowTextarea(text);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(new Date().toLocaleDateString(uiLang === "ko" ? "ko-KR" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  }, [uiLang]);

  async function onSubmit() {
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
        date: now.toISOString().slice(0, 10),
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

  return (
    <div className="space-y-8">
      <Toaster position="top-center" />
      <div>
        <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-5xl"><TypewriterTagline text={t("tagline", uiLang)} /></h1>
        <p className="mt-2 text-xs text-muted-foreground">{new Date().toLocaleDateString(uiLang === "ko" ? "ko-KR" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div className="journal-card p-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("writePlaceholder", uiLang)}
          rows={6}
          className="w-full resize-none overflow-hidden rounded-lg bg-transparent p-5 font-sans text-lg leading-[1.7] text-ink outline-none [caret-color:var(--primary)] placeholder:text-muted-foreground/60 min-h-[12rem]"
        />
        <div className="flex items-center justify-between px-3 pb-2">
          <span className="text-xs text-muted-foreground">{text.length} chars</span>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? t("correcting", uiLang) : t("correct", uiLang)}
          </button>
        </div>
      </div>

      {result && <CorrectionView result={result} lang={result.language} />}
    </div>
  );
}
