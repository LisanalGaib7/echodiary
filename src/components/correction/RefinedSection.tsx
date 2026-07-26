import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { SectionLabel } from "./SectionLabel";

export function RefinedSection({ text }: { text: string }) {
  const { uiLang } = useUiLang();
  return (
    <section className="journal-card p-6">
      <SectionLabel>{t("refined", uiLang)}</SectionLabel>
      <p className="mt-3 max-w-[var(--measure)] whitespace-pre-wrap font-serif text-[1.0625rem] leading-[1.7] text-ink">
        {text}
      </p>
    </section>
  );
}
