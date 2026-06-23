import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { deleteEntry, getAllEntries } from "@/lib/db";
import type { Entry, Lang } from "@/lib/types";
import { CorrectionView } from "@/components/CorrectionView";
import { StreakHeatmap } from "@/components/StreakHeatmap";
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

type LangFilter = "all" | Lang;

function HistoryPage() {
  const { uiLang } = useUiLang();
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [selected, setSelected] = useState<Entry | null>(null);
  const [query, setQuery] = useState("");
  const [langFilter, setLangFilter] = useState<LangFilter>("all");

  async function load() {
    setEntries(await getAllEntries());
  }

  useEffect(() => { load(); }, []);

  async function onDelete(id: string) {
    await deleteEntry(id);
    if (selected?.id === id) setSelected(null);
    await load();
  }

  const filtered = useMemo(() => {
    if (!entries) return [];
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (langFilter !== "all" && e.language !== langFilter) return false;
      if (!q) return true;
      return (
        e.originalText.toLowerCase().includes(q) ||
        e.refinedText.toLowerCase().includes(q) ||
        e.date.includes(q)
      );
    });
  }, [entries, query, langFilter]);

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

  const langs: LangFilter[] = ["all", "en", "ko"];

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">{t("navHistory", uiLang)}</h1>

      {entries && entries.length > 0 && (
        <section className="journal-card p-5">
          <div className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">{t("activity", uiLang)}</div>
          <div className="overflow-x-auto pb-1">
            <StreakHeatmap dates={entries.map((e) => e.date)} weeks={52} />
          </div>
        </section>
      )}

      {entries && entries.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder", uiLang)}
            className="flex-1 min-w-[200px] rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary [caret-color:var(--primary)]"
          />
          <div className="flex overflow-hidden rounded-md border border-border text-xs">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLangFilter(l)}
                className={`px-3 py-1.5 ${langFilter === l ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                {l === "all" ? t("allLangs", uiLang) : l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {entries === null ? (
        <p className="text-muted-foreground">…</p>
      ) : entries.length === 0 ? (
        <div className="journal-card p-12 text-center text-muted-foreground">{t("noEntries", uiLang)}</div>
      ) : filtered.length === 0 ? (
        <div className="journal-card p-12 text-center text-muted-foreground">{t("noMatches", uiLang)}</div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((e) => (
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
