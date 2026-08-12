import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

/** Desktop-only launcher (mirrors MobileTabBar's `md:hidden` — on mobile,
 *  the tab bar already owns the bottom of the screen, so feedback lives in
 *  Settings instead). */
export function FeedbackFab() {
  const { uiLang } = useUiLang();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    fabRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-40 hidden md:block">
      {open && (
        <div className="absolute bottom-[calc(100%+12px)] right-0 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl">
          <h3 className="font-serif text-base font-semibold text-foreground">
            {t("feedbackTitle", uiLang)}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("feedbackDesc", uiLang)}</p>
          <div className="mt-3">
            <FeedbackForm onSent={close} />
          </div>
        </div>
      )}

      <button
        ref={fabRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t("close", uiLang) : t("feedbackFabLabel", uiLang)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105"
      >
        {open ? (
          <X className="h-5 w-5" strokeWidth={2} />
        ) : (
          <MessageCircle className="h-5 w-5" strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
