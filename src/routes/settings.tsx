import { createFileRoute } from "@tanstack/react-router";
import { SegmentedControl } from "@/components/ui-common/SegmentedControl";
import { useUiLang } from "@/lib/ui-lang";
import { t, type UiLang } from "@/lib/i18n";

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

  return (
    <div className="animate-page-enter space-y-10">
      <h1 className="font-serif text-3xl font-semibold">{t("navSettings", uiLang)}</h1>

      <section className="journal-card space-y-4 p-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/70">
            {t("language", uiLang)}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("languageDesc", uiLang)}
          </p>
        </div>
        <SegmentedControl<UiLang>
          size="md"
          ariaLabel="UI language"
          value={uiLang}
          onChange={setUiLang}
          options={[
            { value: "en", label: "English" },
            { value: "ko", label: "한국어" },
          ]}
        />
      </section>
    </div>
  );
}
