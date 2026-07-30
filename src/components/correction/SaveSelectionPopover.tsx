import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { saveVocab, findVocabByText } from "@/lib/vocab-db";
import { uuid } from "@/lib/format";
import type { Lang } from "@/lib/types";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

interface Props {
  children: ReactNode;
  /** Full text the selection is drawn from — stored as `context` so a saved
   *  phrase still reads in place even if the source entry is later deleted. */
  context: string;
  language: Lang;
  entryId: string;
  entryDate: string;
}

interface PopoverPos {
  top: number;
  left: number;
  selectedText: string;
}

/** Wraps refined-text prose so the user can drag-select any phrase — not
 *  just flagged diff words — and save it. Uses `selectionchange` (not just
 *  mouseup) so the popover also dismisses correctly when the selection is
 *  cleared by clicking elsewhere. */
export function SaveSelectionPopover({ children, context, language, entryId, entryDate }: Props) {
  const { uiLang } = useUiLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<PopoverPos | null>(null);
  const [saved, setSaved] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // While true, ignore selectionchange so the "Saved" confirmation stays
  // visible for its full duration instead of being dismissed the instant
  // the selection collapses (e.g. from a click, or from clearing it below).
  const frozenRef = useRef(false);

  useEffect(() => {
    function onSelectionChange() {
      if (frozenRef.current) return;
      const sel = window.getSelection();
      const container = containerRef.current;
      if (!sel || sel.isCollapsed || sel.rangeCount === 0 || !container) {
        setPopover(null);
        return;
      }
      const range = sel.getRangeAt(0);
      if (!container.contains(range.commonAncestorContainer)) {
        setPopover(null);
        return;
      }
      // A selection dragged across a Changes diff spans <del> (the user's
      // original mistake) and <ins> (the fix) with no separator between them
      // — sel.toString() would read "I amI'm". Strip <del> content from a
      // clone so only the corrected/kept text is ever saved. No-op for plain
      // prose (Refined text has no <del>/<ins>).
      const frag = range.cloneContents();
      frag.querySelectorAll("del").forEach((d) => d.remove());
      const selectedText = (frag.textContent ?? "").trim();
      if (!selectedText) {
        setPopover(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setSaved(false);
      setPopover({
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left + rect.width / 2,
        selectedText,
      });
    }

    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const handleSave = useCallback(async () => {
    if (!popover) return;
    const existing = await findVocabByText(popover.selectedText);
    if (!existing) {
      await saveVocab({
        id: uuid(),
        text: popover.selectedText,
        language,
        context,
        entryId,
        entryDate,
        createdAt: new Date().toISOString(),
      });
    }
    setSaved(true);
    frozenRef.current = true;
    hideTimer.current = setTimeout(() => {
      frozenRef.current = false;
      setPopover(null);
      window.getSelection()?.removeAllRanges();
    }, 900);
  }, [popover, language, context, entryId, entryDate]);

  return (
    <div ref={containerRef} className="relative">
      {children}
      {popover && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleSave}
          style={{ top: popover.top, left: popover.left }}
          className="absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap rounded-full border border-primary/30 bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary shadow-lg shadow-primary/10 transition-colors hover:bg-primary/5"
        >
          {saved ? t("savedConfirmed", uiLang) : t("saveToVocab", uiLang)}
        </button>
      )}
    </div>
  );
}
