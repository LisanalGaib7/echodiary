import { Link } from "@tanstack/react-router";
import { PenLine, Clock, Bookmark, BarChart3, Settings } from "lucide-react";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

const item = "flex flex-1 flex-col items-center gap-1 py-2 text-primary/40 transition-colors";
const active = "text-primary";

export function MobileTabBar() {
  const { uiLang } = useUiLang();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-primary/10 bg-background/95 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1 backdrop-blur-md md:hidden"
    >
      <Link
        to="/"
        preload="intent"
        activeOptions={{ exact: true }}
        className={item}
        activeProps={{ className: `${item} ${active}` }}
      >
        <PenLine className="h-5 w-5" strokeWidth={1.75} />
        <span className="text-[9px] font-bold uppercase tracking-[0.14em]">
          {t("navWrite", uiLang)}
        </span>
      </Link>
      <Link
        to="/history"
        preload="intent"
        className={item}
        activeProps={{ className: `${item} ${active}` }}
      >
        <Clock className="h-5 w-5" strokeWidth={1.75} />
        <span className="text-[9px] font-bold uppercase tracking-[0.14em]">
          {t("navHistory", uiLang)}
        </span>
      </Link>
      <Link
        to="/saved"
        preload="intent"
        className={item}
        activeProps={{ className: `${item} ${active}` }}
      >
        <Bookmark className="h-5 w-5" strokeWidth={1.75} />
        <span className="text-[9px] font-bold uppercase tracking-[0.14em]">
          {t("navSaved", uiLang)}
        </span>
      </Link>
      <Link
        to="/report"
        preload="intent"
        className={item}
        activeProps={{ className: `${item} ${active}` }}
      >
        <BarChart3 className="h-5 w-5" strokeWidth={1.75} />
        <span className="text-[9px] font-bold uppercase tracking-[0.14em]">
          {t("navReport", uiLang)}
        </span>
      </Link>
      <Link
        to="/settings"
        preload="intent"
        className={item}
        activeProps={{ className: `${item} ${active}` }}
      >
        <Settings className="h-5 w-5" strokeWidth={1.75} />
        <span className="text-[9px] font-bold uppercase tracking-[0.14em]">
          {t("navSettings", uiLang)}
        </span>
      </Link>
    </nav>
  );
}
