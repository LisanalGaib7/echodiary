import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

/**
 * Shimmer placeholder shown while a correction is being generated,
 * so the reader keeps their reading position instead of staring at a blank card.
 */
export function CorrectionSkeleton() {
  const { uiLang } = useUiLang();
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <section className="journal-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-loading" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/60">
            {t("correcting", uiLang)}
          </span>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full rounded-md bg-primary/10 animate-loading" />
          <div
            className="h-4 w-11/12 rounded-md bg-primary/10 animate-loading"
            style={{ animationDelay: "80ms" }}
          />
          <div
            className="h-4 w-9/12 rounded-md bg-primary/10 animate-loading"
            style={{ animationDelay: "160ms" }}
          />
          <div
            className="h-4 w-10/12 rounded-md bg-primary/10 animate-loading"
            style={{ animationDelay: "240ms" }}
          />
        </div>
      </section>
      <section className="journal-card overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <div className="h-4 w-24 rounded-md bg-primary/10 animate-loading" />
        </div>
        <div className="divide-y divide-border">
          {[0, 1, 2].map((i) => (
            <div key={i} className="grid grid-cols-4 gap-4 px-4 py-4">
              <div
                className="h-4 rounded bg-primary/10 animate-loading"
                style={{ animationDelay: `${i * 60}ms` }}
              />
              <div
                className="h-4 rounded bg-primary/10 animate-loading"
                style={{ animationDelay: `${i * 60 + 40}ms` }}
              />
              <div
                className="h-4 rounded bg-primary/10 animate-loading"
                style={{ animationDelay: `${i * 60 + 80}ms` }}
              />
              <div
                className="h-4 rounded bg-primary/10 animate-loading"
                style={{ animationDelay: `${i * 60 + 120}ms` }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
