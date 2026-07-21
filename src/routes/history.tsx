import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, SearchX } from "lucide-react";
import { deleteEntry } from "@/lib/db";
import { useEntries } from "@/hooks/useEntries";
import type { Entry } from "@/lib/types";
import { StreakHeatmap } from "@/components/StreakHeatmap";
import { HistoryFilters, type LangFilter } from "@/components/history/HistoryFilters";
import { HistoryList } from "@/components/history/HistoryList";
import { HistoryDetail } from "@/components/history/HistoryDetail";
import { EmptyState } from "@/components/ui-common/EmptyState";
import { Spinner } from "@/components/ui-common/Spinner";
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
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Spinner size={14} />
          <span>…</span>
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-5 w-5" />}
          title={t("emptyHistoryTitle", uiLang)}
          description={t("emptyHistoryDesc", uiLang)}
          action={
            <Link
              to="/"
              className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary-foreground shadow-lg shadow-primary/10 transition-transform hover:scale-[1.02]"
            >
              {t("goWrite", uiLang)}
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<SearchX className="h-5 w-5" />}
          title={t("emptyMatchesTitle", uiLang)}
          description={t("emptyMatchesDesc", uiLang)}
          action={
            <button
              onClick={() => {
                setQuery("");
                setLangFilter("all");
              }}
              className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary/10"
            >
              {t("clearFilters", uiLang)}
            </button>
          }
        />
      ) : (
        <HistoryList entries={filtered} onOpen={setSelected} />
      )}
    </div>
  );
}
