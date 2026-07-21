import { Link } from "@tanstack/react-router";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

const base =
  "block pl-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/40 transition-colors hover:text-primary";
const active = "text-primary border-l-2 border-primary -ml-[2px]";

export function Nav() {
  const { uiLang } = useUiLang();

  return (
    <nav aria-label="Primary" className="flex flex-col gap-8">
      <Link to="/" className="inline-flex items-baseline gap-2">
        <span className="font-display text-3xl font-light italic tracking-tight text-primary">
          Echo
        </span>
      </Link>

      <div className="flex flex-col gap-4">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          className={base}
          activeProps={{ className: `${base} ${active}` }}
        >
          {t("navWrite", uiLang)}
        </Link>
        <Link to="/history" className={base} activeProps={{ className: `${base} ${active}` }}>
          {t("navHistory", uiLang)}
        </Link>
        <Link to="/report" className={base} activeProps={{ className: `${base} ${active}` }}>
          {t("navReport", uiLang)}
        </Link>
        <Link to="/settings" className={base} activeProps={{ className: `${base} ${active}` }}>
          {t("navSettings", uiLang)}
        </Link>
      </div>
    </nav>
  );
}
