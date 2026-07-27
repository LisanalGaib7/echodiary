import { createFileRoute } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUiLang } from "@/lib/ui-lang";
import { useExplainLang } from "@/lib/explain-lang";
import { t, UI_LANGS, EXPLAIN_LANGS, type UiLang, type ExplainLang } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Echo — Settings" },
      { name: "description", content: "Adjust Echo preferences, including interface language." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { uiLang, setUiLang } = useUiLang();
  const { explainLang, setExplainLang } = useExplainLang();

  return (
    <div className="animate-page-enter space-y-10">
      <h1 className="font-serif text-3xl font-semibold">{t("navSettings", uiLang)}</h1>

      <section className="journal-card space-y-4 p-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/70">
            {t("language", uiLang)}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("languageDesc", uiLang)}</p>
        </div>
        <Select value={uiLang} onValueChange={(v) => setUiLang(v as UiLang)}>
          <SelectTrigger className="w-full max-w-xs" aria-label="UI language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UI_LANGS.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="journal-card space-y-4 p-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/70">
            {t("explainLanguage", uiLang)}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("explainLanguageDesc", uiLang)}</p>
        </div>
        <Select value={explainLang} onValueChange={(v) => setExplainLang(v as ExplainLang)}>
          <SelectTrigger className="w-full max-w-xs" aria-label="Explanation language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EXPLAIN_LANGS.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">{t("explainLanguageNote", uiLang)}</p>
      </section>
    </div>
  );
}
