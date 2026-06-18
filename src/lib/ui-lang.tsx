import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { UiLang } from "@/lib/i18n";

interface Ctx {
  uiLang: UiLang;
  setUiLang: (l: UiLang) => void;
}

const UiLangContext = createContext<Ctx>({ uiLang: "en", setUiLang: () => {} });

export function UiLangProvider({ children }: { children: ReactNode }) {
  const [uiLang, setUiLangState] = useState<UiLang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("echo.uiLang") : null;
    if (stored === "en" || stored === "ko") setUiLangState(stored);
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
