import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { deleteEntry, getAllEntries } from "@/lib/db";
import type { Entry } from "@/lib/types";
import { CorrectionView } from "@/components/CorrectionView";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Echo — History" },
      { name: "description", content: "Browse your past diary entries and corrections by date." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { uiLang } = useUiLang();
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [selected, setSelected] = useState<Entry | null>(null);

  async function load() {
    setEntries(await getAllEntries());
  }

  useEffect(() => { load(); }, []);

  async function onDelete(id: string) {
    await deleteEntry(id);
    if (selected?.id === id) setSelected(null);
    await load();
  }

  if (selected) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground">← {t("back", uiLang)}</button>
        <div className="journal-card p-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{selected.date}</div>
              <span className="mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{selected.language.toUpperCase()}</span>
            </div>
            <button onClick={() => onDelete(selected.id)} className="text-xs text-destructive hover:underline">{t("delete", uiLang)}</button>
          </div>
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">{t("original", uiLang)}</h2>
          <p className="whitespace-pre-wrap font-serif text-base leading-relaxed">{selected.originalText}</p>
        </div>
        <CorrectionView result={selected} lang={selected.language} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">{t("navHistory", uiLang)}</h1>
      {entries === null ? (
        <p className="text-muted-foreground">…</p>
      ) : entries.length === 0 ? (
        <div className="journal-card p-12 text-center text-muted-foreground">{t("noEntries", uiLang)}</div>
      ) : (
        <ul className="space-y-3">
          {entries.map((e) => (
            <li key={e.id}>
              <button onClick={() => setSelected(e)} className="journal-card flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-muted/40">
                <div className="flex flex-col items-center justify-center rounded-md bg-secondary px-3 py-2 text-center">
                  <div className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString(uiLang === "ko" ? "ko-KR" : "en-US", { month: "short" })}</div>
                  <div className="font-serif text-xl font-semibold leading-none">{new Date(e.date).getDate()}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium">{e.language.toUpperCase()}</span>
                    <span className="font-mono text-sm font-semibold text-primary">{e.overall.score.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">/ 10</span>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{e.originalText}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
