import type { Entry } from "@/lib/types";
import { CorrectionView } from "@/components/CorrectionView";
import { SectionLabel } from "@/components/correction/SectionLabel";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

interface Props {
  entry: Entry;
  onBack: () => void;
  onDelete: (id: string) => void;
}

export function HistoryDetail({ entry, onBack, onDelete }: Props) {
  const { uiLang } = useUiLang();
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
        ← {t("back", uiLang)}
      </button>
      <div className="journal-card p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {entry.date}
            </span>
            <span className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
              {entry.language.toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => onDelete(entry.id)}
            className="text-xs text-destructive hover:underline"
          >
            {t("delete", uiLang)}
          </button>
        </div>
        <SectionLabel>{t("original", uiLang)}</SectionLabel>
        <p className="mt-3 max-w-[var(--measure)] whitespace-pre-wrap font-serif text-[1.0625rem] leading-[1.7]">
          {entry.originalText}
        </p>
      </div>
      <CorrectionView result={entry} lang={entry.language} />
    </div>
  );
}
