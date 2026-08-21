import type { Lang } from "@/lib/types";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { wordDiff } from "@/lib/diff";
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
  /** Diffed against `text` to highlight the corrected spans. Computed, not
   *  taken from the AI's `changes` rows — those can omit or misattribute an
   *  edit (see PR history), which silently hid changes the user never typed.
   *  Omitted only while a correction is still in flight. */
  originalText?: string;
}

export function RefinedSection({ text, entryId, entryDate, language, originalText }: Props) {
  const { uiLang } = useUiLang();
  // "del" segments are words present only in originalText — never rendered,
  // since this paragraph shows refinedText only. What remains ("same" + "ins"
  // in order) reconstructs refinedText exactly.
  const segs = originalText
    ? wordDiff(originalText, text).filter((s) => s.type !== "del")
    : [{ type: "same" as const, text }];
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
