import { Link } from "@tanstack/react-router";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

export function NotFound() {
  const { uiLang } = useUiLang();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-4 text-muted-foreground">{t("pageNotFound", uiLang)}</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          {t("goHome", uiLang)}
        </Link>
      </div>
    </div>
  );
}
