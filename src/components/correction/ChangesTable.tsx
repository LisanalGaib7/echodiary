import type { ReactNode } from "react";
import type { Change, Lang } from "@/lib/types";
import { categoryLabel, categorySeverity } from "@/lib/categories";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { STAGGER } from "@/lib/motion";
import { DiffText } from "./DiffText";
import { SectionLabel } from "./SectionLabel";
import { SaveSelectionPopover } from "./SaveSelectionPopover";

const SEVERITY_VAR: Record<string, string> = {
  core: "var(--cat-core)",
  idiom: "var(--cat-idiom)",
  nit: "var(--cat-nit)",
};

/** Outlined label with a faint tint wash — serif + uppercase (not font-variant small-caps:
 * Fraunces has no true small-caps glyphs, so the browser synthesizes them and only the first
 * letter reads at full size). Same shape used for the category tag and the neutral streak
 * badge; the wash keeps it from reading as an empty outline without tipping back into the
 * saturated filled-pill look. */
function OutlineLabel({ children, tint }: { children: ReactNode; tint?: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-[4px] border px-2 py-[0.26em] font-serif text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${
        tint ? "" : "bg-secondary/40"
      }`}
      style={
        tint
          ? {
              color: tint,
              borderColor: `color-mix(in oklch, ${tint} 35%, transparent)`,
              background: `color-mix(in oklch, ${tint} 10%, transparent)`,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}

interface SaveContext {
  entryId: string;
  entryDate: string;
  refinedText: string;
}

function ChangeCard({
  change,
  lang,
  streak,
  index,
  saveContext,
}: {
  change: Change;
  lang: Lang;
  streak: number;
  index: number;
  saveContext?: SaveContext;
}) {
  const { uiLang } = useUiLang();
  const severity = categorySeverity(lang, change.category);
  const tint = SEVERITY_VAR[severity];
  const diff = <DiffText original={change.original} refined={change.refined} />;
  return (
    <div
      className="animate-row-highlight border-t border-border px-6 py-4 first:border-t-0"
      style={{ animationDelay: `${index * STAGGER.base}ms` }}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <OutlineLabel tint={tint}>{categoryLabel(lang, change.category, uiLang)}</OutlineLabel>
          {streak >= 2 && (
            <OutlineLabel>
              {uiLang === "ko"
                ? `이번 주 ${streak}번째`
                : `${streak}${streak === 2 ? "nd" : streak === 3 ? "rd" : "th"} time this week`}
            </OutlineLabel>
          )}
        </div>
        {saveContext ? (
          <SaveSelectionPopover
            context={saveContext.refinedText}
            entryId={saveContext.entryId}
            entryDate={saveContext.entryDate}
            language={lang}
          >
            {diff}
          </SaveSelectionPopover>
        ) : (
          diff
        )}
        <p className="max-w-[var(--measure)] text-sm text-muted-foreground">{change.reason}</p>
      </div>
    </div>
  );
}

export function ChangesTable({
  changes,
  lang,
  weeklyCounts = {},
  entryId,
  entryDate,
  refinedText,
}: {
  changes: Change[];
  lang: Lang;
  weeklyCounts?: Record<string, number>;
  /** Present once the entry is saved; enables drag-select-to-save on each
   *  change's diff text. Omitted while a correction is still in flight. */
  entryId?: string;
  entryDate?: string;
  refinedText?: string;
}) {
  const { uiLang } = useUiLang();
  const saveContext =
    entryId && entryDate && refinedText ? { entryId, entryDate, refinedText } : undefined;

  const main = changes.filter((c) => categorySeverity(lang, c.category) !== "nit");
  const nits = changes.filter((c) => categorySeverity(lang, c.category) === "nit");

  return (
    <section className="journal-card overflow-hidden">
      <div className="px-6 pb-2 pt-6">
        <SectionLabel>{t("changes", uiLang)}</SectionLabel>
      </div>
      {changes.length === 0 ? (
        <p className="px-6 py-8 text-center text-muted-foreground">{t("noChanges", uiLang)}</p>
      ) : (
        <div>
          {main.map((c, i) => (
            <ChangeCard
              key={i}
              change={c}
              lang={lang}
              streak={weeklyCounts[c.category] ?? 0}
              index={i}
              saveContext={saveContext}
            />
          ))}

          {nits.length > 0 && (
            <details className="border-t border-border">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-6 py-3 text-xs font-medium text-muted-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                <span aria-hidden style={{ color: SEVERITY_VAR.nit }}>
                  +
                </span>
                {uiLang === "ko"
                  ? `사소한 수정 ${nits.length}건`
                  : `${nits.length} minor ${nits.length === 1 ? "fix" : "fixes"}`}
              </summary>
              <div className="flex flex-col gap-3 px-6 pb-4">
                {nits.map((c, i) => {
                  const diff = <DiffText original={c.original} refined={c.refined} />;
                  return (
                    <div key={i} className="flex flex-col gap-1">
                      <OutlineLabel tint={SEVERITY_VAR.nit}>
                        {categoryLabel(lang, c.category, uiLang)}
                      </OutlineLabel>
                      <div className="max-w-[var(--measure)] text-[0.92rem]">
                        {saveContext ? (
                          <SaveSelectionPopover
                            context={saveContext.refinedText}
                            entryId={saveContext.entryId}
                            entryDate={saveContext.entryDate}
                            language={lang}
                          >
                            {diff}
                          </SaveSelectionPopover>
                        ) : (
                          diff
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
