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
    <div className="journal-card p-2">
      <p className="px-5 pt-3 text-xs text-muted-foreground" suppressHydrationWarning>
        {today || "\u00A0"}
      </p>
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
          onClick={() => onSubmit(text)}
          disabled={loading}
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? t("correcting", uiLang) : t("correct", uiLang)}
        </button>
      </div>
    </div>
  );
}
