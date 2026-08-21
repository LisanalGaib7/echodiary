import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAutoGrowTextarea } from "@/hooks/useAutoGrowTextarea";
import { useDraft, type DraftStatus } from "@/hooks/useDraft";
import { useUiLang } from "@/lib/ui-lang";
import { t, type UiLang } from "@/lib/i18n";
import { formatLongDate } from "@/lib/format";
import { Spinner } from "@/components/ui-common/Spinner";
import { TypeScale } from "@/components/editor/TypeScale";
import { TYPE_STEPS, useEditorType } from "@/lib/editor-type";
import { useContentFont } from "@/lib/content-font";

interface Props {
  loading: boolean;
  onSubmit: (text: string) => void;
}

function statusLabel(status: DraftStatus, savedAt: Date | null, uiLang: UiLang) {
  if (status === "saving") return t("draftSaving", uiLang);
  if (status === "saved" && savedAt) {
    const time = savedAt.toLocaleTimeString(uiLang === "ko" ? "ko-KR" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${t("draftSavedAt", uiLang)} · ${time}`;
  }
  return "\u00A0";
}

export function DiaryEditor({ loading, onSubmit }: Props) {
  const { uiLang } = useUiLang();
  const { typeStep } = useEditorType();
  const { contentFontId } = useContentFont();
  const [text, setText] = useState("");
  // metricsKey: font-size/line-height/font-family all change the box's
  // natural height even when `text` doesn't, so the grow hook needs to
  // re-measure whenever any of them changes too.
  const textareaRef = useAutoGrowTextarea(text, `${typeStep}-${contentFontId}`);
  const [today, setToday] = useState("");
  const { initial, status, savedAt, restored, clear } = useDraft(text);

  // Hydrate textarea with any restored draft
  useEffect(() => {
    if (initial && !text) {
      setText(initial);
      toast(t("draftRestored", uiLang), { duration: 3000 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const handleClear = () => {
    clear();
    setText("");
  };

  useEffect(() => {
    setToday(formatLongDate(new Date(), uiLang));
  }, [uiLang]);

  const canSubmit = text.trim().length > 0 && !loading;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-6 top-0 bottom-0 hidden w-px bg-gradient-to-b from-primary/25 via-primary/5 to-transparent md:block" />

      <div className="mb-6 flex items-baseline justify-between gap-4">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary/50"
          suppressHydrationWarning
        >
          {today || "\u00A0"}
        </p>
        <div className="flex items-center gap-4">
          <p
            className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80 tabular-nums transition-opacity"
            aria-live="polite"
          >
            {status === "saving" && <Spinner size={10} className="text-muted-foreground/70" />}
            {status === "saved" && !restored && (
              <span className="h-1 w-1 rounded-full bg-success/70" aria-hidden />
            )}
            {statusLabel(status, savedAt, uiLang)}
          </p>
          <TypeScale />
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("writePlaceholder", uiLang)}
        rows={6}
        className="min-h-[16rem] w-full resize-none overflow-hidden bg-transparent font-content text-ink outline-none [caret-color:var(--primary)] placeholder:text-primary/25 selection:bg-primary/10"
        style={{
          maxWidth: "min(45ch, 100%)", // ~65 prose chars: ch is the "0" glyph, wider than average
          fontSize: `${TYPE_STEPS[typeStep].fontSize}px`,
          lineHeight: TYPE_STEPS[typeStep].lineHeight,
        }}
      />

      <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-primary/10 pt-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground tabular-nums">
            {text.length} {uiLang === "ko" ? "자" : "chars"}
          </span>
          {text.length > 0 && (
            <button
              onClick={handleClear}
              disabled={loading}
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70 underline decoration-dotted underline-offset-4 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("clearEntry", uiLang)}
            </button>
          )}
        </div>
        <button
          onClick={() => onSubmit(text)}
          disabled={!canSubmit}
          aria-busy={loading}
          className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary-foreground shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <span>{loading ? t("correcting", uiLang) : t("correct", uiLang)}</span>
          {loading ? (
            <Spinner size={12} className="text-primary-foreground/80" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
          )}
        </button>
      </div>
    </div>
  );
}
