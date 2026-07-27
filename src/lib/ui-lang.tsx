import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { UI_LANGS, type UiLang } from "@/lib/i18n";

interface Ctx {
  uiLang: UiLang;
  setUiLang: (l: UiLang) => void;
}

const UiLangContext = createContext<Ctx>({ uiLang: "en", setUiLang: () => {} });

const UI_LANG_VALUES = UI_LANGS.map((l) => l.value);

/** Best-effort guess for a first-time visitor only — an explicit stored
 *  choice always wins over this, see the effect below. */
function detectBrowserUiLang(): UiLang {
  if (typeof navigator === "undefined") return "en";
  const primary = navigator.language?.split("-")[0];
  return UI_LANG_VALUES.includes(primary as UiLang) ? (primary as UiLang) : "en";
}

export function UiLangProvider({ children }: { children: ReactNode }) {
  const [uiLang, setUiLangState] = useState<UiLang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("echo.uiLang") : null;
    if (stored && UI_LANG_VALUES.includes(stored as UiLang)) {
      setUiLangState(stored as UiLang);
    } else {
      setUiLangState(detectBrowserUiLang());
    }
  }, []);

  const setUiLang = (l: UiLang) => {
    setUiLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("echo.uiLang", l);
  };

  return <UiLangContext.Provider value={{ uiLang, setUiLang }}>{children}</UiLangContext.Provider>;
}

export function useUiLang() {
  return useContext(UiLangContext);
}
