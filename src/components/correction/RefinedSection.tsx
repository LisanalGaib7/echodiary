import type { Change, Lang } from "@/lib/types";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { highlightRefined } from "@/lib/diff";
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
  /** Used to highlight the corrected spans inside `text`. Omitted only
   *  while a correction is still in flight. */
  changes?: Change[];
}

export function RefinedSection({ text, entryId, entryDate, language, changes }: Props) {
  const { uiLang } = useUiLang();
  const segs = highlightRefined(
    text,
    (changes ?? []).map((c) => c.refined),
  );
  const body = (
    <p className="mt-3 max-w-[var(--measure)] whitespace-pre-wrap font-content text-[1.0625rem] leading-[1.7] text-ink">
      {segs.map((seg, i) =>
        seg.type === "ins" ? (
          <ins key={i} className="rounded-[3px] bg-success/15 px-0.5 text-success no-underline">
            {seg.text}
          </ins>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
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
