import type { Lang } from "@/lib/types";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { SegmentedControl } from "@/components/ui-common/SegmentedControl";

export type LangFilter = "all" | Lang;

interface Props {
  query: string;
  onQuery: (v: string) => void;
  langFilter: LangFilter;
  onLangFilter: (v: LangFilter) => void;
}

export function HistoryFilters({ query, onQuery, langFilter, onLangFilter }: Props) {
  const { uiLang } = useUiLang();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder={t("searchPlaceholder", uiLang)}
        className="flex-1 min-w-[200px] rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary [caret-color:var(--primary)]"
      />
      <SegmentedControl<LangFilter>
        size="sm"
        value={langFilter}
        onChange={onLangFilter}
        options={[
          { value: "all", label: t("allLangs", uiLang) },
          { value: "en", label: "EN" },
          { value: "ko", label: "KO" },
        ]}
      />
    </div>
  );
}
