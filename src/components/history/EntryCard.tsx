import type { Entry } from "@/lib/types";
import { useUiLang } from "@/lib/ui-lang";

export function EntryCard({ entry, onOpen }: { entry: Entry; onOpen: (e: Entry) => void }) {
  const { uiLang } = useUiLang();
  const d = new Date(entry.date);
  const monthLabel = d.toLocaleDateString(uiLang === "ko" ? "ko-KR" : "en-US", { month: "short" });

  return (
    <button
      onClick={() => onOpen(entry)}
      className="journal-card flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-muted/40"
    >
      <div className="flex flex-col items-center justify-center rounded-md bg-secondary px-3 py-2 text-center">
        <div className="text-xs text-muted-foreground">{monthLabel}</div>
        <div className="font-serif text-xl font-semibold leading-none">{d.getDate()}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium">
            {entry.language.toUpperCase()}
          </span>
          <span className="font-mono text-sm font-semibold text-primary">
            {entry.overall.score.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">/ 10</span>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{entry.originalText}</p>
      </div>
    </button>
  );
}
