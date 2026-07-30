import { createFileRoute } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { deleteVocab } from "@/lib/vocab-db";
import { useVocab } from "@/hooks/useVocab";
import { VocabList } from "@/components/vocab/VocabList";
import { EmptyState } from "@/components/ui-common/EmptyState";
import { Spinner } from "@/components/ui-common/Spinner";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Echo — Saved" },
      {
        name: "description",
        content: "Phrases you've selected and saved from your refined entries.",
      },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { uiLang } = useUiLang();
  const { vocab } = useVocab();

  return (
    <div className="animate-page-enter space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">{t("navSaved", uiLang)}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("savedPageDesc", uiLang)}</p>
      </div>

      {vocab === null ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Spinner size={14} />
          <span>…</span>
        </div>
      ) : vocab.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-5 w-5" />}
          title={t("emptySavedTitle", uiLang)}
          description={t("emptySavedDesc", uiLang)}
        />
      ) : (
        <VocabList items={vocab} onDelete={(id) => deleteVocab(id)} />
      )}
    </div>
  );
}
