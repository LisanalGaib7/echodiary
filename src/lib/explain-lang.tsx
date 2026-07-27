import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ExplainLang } from "@/lib/i18n";

interface Ctx {
  explainLang: ExplainLang;
  setExplainLang: (l: ExplainLang) => void;
}

const ExplainLangContext = createContext<Ctx>({ explainLang: "en", setExplainLang: () => {} });

const EXPLAIN_LANG_VALUES: ExplainLang[] = ["en", "ko"];

/** First-visit default only — an explicit stored choice always wins.
 *  Falls back through the stored UI language (if en/ko), then the browser
 *  language, before landing on English. */
function detectDefaultExplainLang(): ExplainLang {
  if (typeof window === "undefined") return "en";

  const storedUiLang = localStorage.getItem("echo.uiLang");
  if (storedUiLang && EXPLAIN_LANG_VALUES.includes(storedUiLang as ExplainLang)) {
    return storedUiLang as ExplainLang;
  }

  const browserPrimary = navigator.language?.split("-")[0];
  if (EXPLAIN_LANG_VALUES.includes(browserPrimary as ExplainLang)) {
    return browserPrimary as ExplainLang;
  }

  return "en";
}

export function ExplainLangProvider({ children }: { children: ReactNode }) {
  const [explainLang, setExplainLangState] = useState<ExplainLang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("echo.explainLang") : null;
    if (stored && EXPLAIN_LANG_VALUES.includes(stored as ExplainLang)) {
      setExplainLangState(stored as ExplainLang);
    } else {
      setExplainLangState(detectDefaultExplainLang());
    }
  }, []);

  const setExplainLang = (l: ExplainLang) => {
    setExplainLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("echo.explainLang", l);
  };

  return (
    <ExplainLangContext.Provider value={{ explainLang, setExplainLang }}>
      {children}
    </ExplainLangContext.Provider>
  );
}

export function useExplainLang() {
  return useContext(ExplainLangContext);
}
