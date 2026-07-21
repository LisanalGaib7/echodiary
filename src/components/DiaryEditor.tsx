import { useEffect, useState } from "react";
import { useAutoGrowTextarea } from "@/hooks/useAutoGrowTextarea";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { formatLongDate } from "@/lib/format";

interface Props {
  loading: boolean;
  onSubmit: (text: string) => void;
}

export function DiaryEditor({ loading, onSubmit }: Props) {
  const { uiLang } = useUiLang();
  const [text, setText] = useState("");
  const textareaRef = useAutoGrowTextarea(text);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(formatLongDate(new Date(), uiLang));
  }, [uiLang]);

  return (
    <div className="relative">
      {/* Manuscript rail */}
      <div className="pointer-events-none absolute -left-6 top-0 bottom-0 hidden w-px bg-gradient-to-b from-primary/25 via-primary/5 to-transparent md:block" />

      <p
        className="mb-6 text-[11px] font-medium uppercase tracking-[0.22em] text-primary/50"
        suppressHydrationWarning
      >
        {today || "\u00A0"}
      </p>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("writePlaceholder", uiLang)}
        rows={6}
        className="w-full resize-none overflow-hidden bg-transparent font-serif text-2xl leading-snug text-ink outline-none [caret-color:var(--primary)] placeholder:text-primary/25 selection:bg-primary/10 md:text-3xl min-h-[16rem]"
      />

      <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-primary/10 pt-8 sm:flex-row sm:items-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground tabular-nums">
          {text.length} {uiLang === "ko" ? "자" : "chars"}
        </span>
        <button
          onClick={() => onSubmit(text)}
          disabled={loading}
          className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary-foreground shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
        >
          <span>{loading ? t("correcting", uiLang) : t("correct", uiLang)}</span>
          <span
            className={`h-1.5 w-1.5 rounded-full bg-primary-foreground/80 ${
              loading ? "animate-pulse" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
