import type { Change, Lang } from "@/lib/types";
import { categoryLabel, categorySeverity } from "@/lib/categories";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { STAGGER } from "@/lib/motion";
import { DiffText } from "./DiffText";

const SEVERITY_VAR: Record<string, string> = {
  core: "var(--cat-core)",
  idiom: "var(--cat-idiom)",
  nit: "var(--cat-nit)",
};

function ChangeCard({
  change,
  lang,
  streak,
  index,
}: {
  change: Change;
  lang: Lang;
  streak: number;
  index: number;
}) {
  const { uiLang } = useUiLang();
  const severity = categorySeverity(lang, change.category);
  const tint = SEVERITY_VAR[severity];
  return (
    <div
      className="animate-row-highlight flex max-w-[64ch] flex-col gap-2.5 border-t border-border px-5 py-4 first:border-t-0"
      style={{ animationDelay: `${index * STAGGER.base}ms` }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="category-pill"
          style={{ color: tint, background: `color-mix(in oklch, ${tint} 14%, transparent)` }}
        >
          {categoryLabel(lang, change.category, uiLang)}
        </span>
        {streak >= 2 && (
          <span className="category-pill bg-secondary text-secondary-foreground">
            {uiLang === "ko"
              ? `이번 주 ${streak}번째`
              : `${streak}${streak === 2 ? "nd" : streak === 3 ? "rd" : "th"} time this week`}
          </span>
        )}
      </div>
      <DiffText original={change.original} refined={change.refined} />
      <p className="text-sm text-muted-foreground">{change.reason}</p>
    </div>
  );
}

export function ChangesTable({
  changes,
  lang,
  weeklyCounts = {},
}: {
  changes: Change[];
  lang: Lang;
  weeklyCounts?: Record<string, number>;
}) {
  const { uiLang } = useUiLang();

  const main = changes.filter((c) => categorySeverity(lang, c.category) !== "nit");
  const nits = changes.filter((c) => categorySeverity(lang, c.category) === "nit");

  return (
    <section className="journal-card overflow-hidden">
      <h2 className="border-b border-border px-6 py-4 text-lg font-semibold">
        {t("changes", uiLang)}
      </h2>
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
            />
          ))}

          {nits.length > 0 && (
            <details className="border-t border-border">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-3 text-xs font-medium text-muted-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                <span aria-hidden style={{ color: SEVERITY_VAR.nit }}>
                  +
                </span>
                {uiLang === "ko"
                  ? `사소한 수정 ${nits.length}건`
                  : `${nits.length} minor ${nits.length === 1 ? "fix" : "fixes"}`}
              </summary>
              <div className="flex max-w-[64ch] flex-col gap-3 px-5 pb-4 pl-10">
                {nits.map((c, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span
                      className="category-pill w-fit"
                      style={{
                        color: SEVERITY_VAR.nit,
                        background: `color-mix(in oklch, ${SEVERITY_VAR.nit} 14%, transparent)`,
                      }}
                    >
                      {categoryLabel(lang, c.category, uiLang)}
                    </span>
                    <div className="text-[0.92rem]">
                      <DiffText original={c.original} refined={c.refined} />
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
