import type { Lang } from "@/lib/types";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { SectionLabel } from "./SectionLabel";
import { SaveSelectionPopover } from "./SaveSelectionPopover";

interface Props {
  text: string;
  /** Present when the entry has been saved (Write page: after the async
   *  save resolves; History: always). Omitted while a correction is still
   *  in flight, which simply skips rendering the save-selection popover. */
  entryId?: string;
  entryDate?: string;
  language?: Lang;
}

export function RefinedSection({ text, entryId, entryDate, language }: Props) {
  const { uiLang } = useUiLang();
  const body = (
    <p className="mt-3 max-w-[var(--measure)] whitespace-pre-wrap font-serif text-[1.0625rem] leading-[1.7] text-ink">
      {text}
    </p>
  );
  return (
    <section className="journal-card p-6">
      <SectionLabel>{t("refined", uiLang)}</SectionLabel>
      {entryId && entryDate && language ? (
        <SaveSelectionPopover
          context={text}
          entryId={entryId}
          entryDate={entryDate}
          language={language}
        >
          {body}
        </SaveSelectionPopover>
      ) : (
        body
      )}
    </section>
  );
}
