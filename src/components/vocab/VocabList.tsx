import type { VocabItem } from "@/lib/vocab-types";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

interface Props {
  items: VocabItem[];
  onDelete: (id: string) => void;
}

export function VocabList({ items, onDelete }: Props) {
  const { uiLang } = useUiLang();
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="journal-card animate-row-highlight p-5"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {item.entryDate}
              </span>
              <span className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                {item.language.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="text-xs text-destructive hover:underline"
            >
              {t("delete", uiLang)}
            </button>
          </div>
          <p className="rounded-[3px] bg-primary/10 px-1 py-0.5 font-serif text-lg text-primary">
            {item.text}
          </p>
          {item.context.trim() !== item.text.trim() && (
            <p className="mt-2 max-w-[var(--measure)] text-sm text-muted-foreground">
              {item.context}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
