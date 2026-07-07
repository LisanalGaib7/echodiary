import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

export function RefinedSection({ text }: { text: string }) {
  const { uiLang } = useUiLang();
  return (
    <section className="journal-card p-6">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        {t("refined", uiLang)}
      </h2>
      <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-ink">{text}</p>
    </section>
  );
}
