import { Link } from "@tanstack/react-router";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { SegmentedControl } from "@/components/ui-common/SegmentedControl";
import type { UiLang } from "@/lib/i18n";

const linkCls = "px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-muted";
const activeCls = "bg-secondary text-foreground font-medium";

export function Nav() {
  const { uiLang, setUiLang } = useUiLang();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-paper/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-primary">
            Echo
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {t("tagline", uiLang)}
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className={linkCls}
            activeProps={{ className: `${linkCls} ${activeCls}` }}
          >
            {t("navWrite", uiLang)}
          </Link>
          <Link to="/history" className={linkCls} activeProps={{ className: `${linkCls} ${activeCls}` }}>
            {t("navHistory", uiLang)}
          </Link>
          <Link to="/report" className={linkCls} activeProps={{ className: `${linkCls} ${activeCls}` }}>
            {t("navReport", uiLang)}
          </Link>
          <div className="ml-2">
            <SegmentedControl<UiLang>
              size="xs"
              ariaLabel="UI language"
              value={uiLang}
              onChange={setUiLang}
              options={[
                { value: "en", label: "EN" },
                { value: "ko", label: "KO" },
              ]}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
