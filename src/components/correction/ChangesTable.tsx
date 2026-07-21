import type { Change, Lang } from "@/lib/types";
import { categoryLabel } from "@/lib/categories";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { STAGGER } from "@/lib/motion";

export function ChangesTable({ changes, lang }: { changes: Change[]; lang: Lang }) {
  const { uiLang } = useUiLang();

  return (
    <section className="journal-card overflow-hidden">
      <h2 className="border-b border-border px-6 py-4 text-lg font-semibold">
        {t("changes", uiLang)}
      </h2>
      {changes.length === 0 ? (
        <p className="px-6 py-8 text-center text-muted-foreground">{t("noChanges", uiLang)}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">{t("original", uiLang)}</th>
                <th className="px-4 py-2.5 text-left font-medium">{t("refinedCol", uiLang)}</th>
                <th className="px-4 py-2.5 text-left font-medium">{t("reason", uiLang)}</th>
                <th className="px-4 py-2.5 text-left font-medium">{t("category", uiLang)}</th>
              </tr>
            </thead>
            <tbody>
              {changes.map((c, i) => (
                <tr
                  key={i}
                  className="animate-row-highlight border-t border-border align-top"
                  style={{ animationDelay: `${i * STAGGER.base}ms` }}
                >
                  <td className="px-4 py-3">
                    <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-destructive">
                      {c.original}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-success/10 px-1.5 py-0.5 text-success">
                      {c.refined}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.reason}</td>
                  <td className="px-4 py-3">
                    <span className="category-pill bg-secondary text-secondary-foreground border border-border">
                      {categoryLabel(lang, c.category, uiLang)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
