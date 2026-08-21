import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/** Body-copy typefaces the user can pick between — applies to the Write
 *  textarea, Refined paragraph, Changes diff, and History original/refined
 *  text. Deliberately separate from --font-serif (Fraunces), which stays the
 *  brand face for the logo, headers, and category tags regardless of this
 *  choice. */
export interface ContentFont {
  id: string;
  label: string;
  family: string;
}

export const CONTENT_FONTS: ContentFont[] = [
  { id: "lora", label: "Lora", family: '"Lora", Georgia, serif' },
  { id: "fraunces", label: "Fraunces", family: '"Fraunces", ui-serif, Georgia, serif' },
  { id: "source-serif", label: "Source Serif 4", family: '"Source Serif 4", Georgia, serif' },
  { id: "space-mono", label: "Space Mono", family: '"Space Mono", ui-monospace, monospace' },
  { id: "inter", label: "Inter", family: '"Inter", ui-sans-serif, sans-serif' },
];

export const DEFAULT_CONTENT_FONT_ID = "lora";

interface Ctx {
  contentFontId: string;
  setContentFontId: (id: string) => void;
}

const ContentFontContext = createContext<Ctx>({
  contentFontId: DEFAULT_CONTENT_FONT_ID,
  setContentFontId: () => {},
});

function applyContentFont(id: string) {
  const font = CONTENT_FONTS.find((f) => f.id === id) ?? CONTENT_FONTS[0];
  document.documentElement.style.setProperty("--content-font", font.family);
}

export function ContentFontProvider({ children }: { children: ReactNode }) {
  const [contentFontId, setContentFontIdState] = useState<string>(DEFAULT_CONTENT_FONT_ID);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("echo.contentFont") : null;
    if (stored && CONTENT_FONTS.some((f) => f.id === stored)) {
      setContentFontIdState(stored);
      applyContentFont(stored);
    }
  }, []);

  const setContentFontId = (id: string) => {
    setContentFontIdState(id);
    applyContentFont(id);
    if (typeof window !== "undefined") localStorage.setItem("echo.contentFont", id);
  };

  return (
    <ContentFontContext.Provider value={{ contentFontId, setContentFontId }}>
      {children}
    </ContentFontContext.Provider>
  );
}

export function useContentFont() {
  return useContext(ContentFontContext);
}
