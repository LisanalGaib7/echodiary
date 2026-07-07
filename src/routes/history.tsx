import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { deleteEntry } from "@/lib/db";
import { useEntries } from "@/hooks/useEntries";
import type { Entry } from "@/lib/types";
import { StreakHeatmap } from "@/components/StreakHeatmap";
import { HistoryFilters, type LangFilter } from "@/components/history/HistoryFilters";
import { HistoryList } from "@/components/history/HistoryList";
import { HistoryDetail } from "@/components/history/HistoryDetail";
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
  const { entries } = useEntries();
  const [selected, setSelected] = useState<Entry | null>(null);
  const [query, setQuery] = useState("");
  const [langFilter, setLangFilter] = useState<LangFilter>("all");

  async function onDelete(id: string) {
    await deleteEntry(id);
    if (selected?.id === id) setSelected(null);
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
    return <HistoryDetail entry={selected} onBack={() => setSelected(null)} onDelete={onDelete} />;
  }

  const hasEntries = entries && entries.length > 0;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">{t("navHistory", uiLang)}</h1>

      {hasEntries && (
        <section className="journal-card p-5">
          <div className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
            {t("activity", uiLang)}
          </div>
          <div className="overflow-x-auto pb-1">
            <StreakHeatmap dates={entries!.map((e) => e.date)} weeks={52} />
          </div>
        </section>
      )}

      {hasEntries && (
        <HistoryFilters
          query={query}
          onQuery={setQuery}
          langFilter={langFilter}
          onLangFilter={setLangFilter}
        />
      )}

      {entries === null ? (
        <p className="text-muted-foreground">…</p>
      ) : entries.length === 0 ? (
        <div className="journal-card p-12 text-center text-muted-foreground">
          {t("noEntries", uiLang)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="journal-card p-12 text-center text-muted-foreground">
          {t("noMatches", uiLang)}
        </div>
      ) : (
        <HistoryList entries={filtered} onOpen={setSelected} />
      )}
    </div>
  );
}
