import { useRouter } from "@tanstack/react-router";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

export function RootError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const { uiLang } = useUiLang();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">{t("pageDidntLoad", uiLang)}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("somethingWrong", uiLang)}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          {t("tryAgain", uiLang)}
        </button>
      </div>
    </div>
  );
}
