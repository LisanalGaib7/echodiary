import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/** Five-step type scale for the diary editor. Index 2 (30px) matches the
 *  pre-existing `md:text-3xl` size, so the default is a visual no-op. */
export const TYPE_STEPS = [
  { fontSize: 19, lineHeight: 1.7 },
  { fontSize: 24, lineHeight: 1.6 },
  { fontSize: 30, lineHeight: 1.5 },
  { fontSize: 38, lineHeight: 1.38 },
  { fontSize: 47, lineHeight: 1.28 },
] as const;

export const DEFAULT_TYPE_STEP = 2;

interface Ctx {
  typeStep: number;
  setTypeStep: (i: number) => void;
}

const EditorTypeContext = createContext<Ctx>({
  typeStep: DEFAULT_TYPE_STEP,
  setTypeStep: () => {},
});

export function EditorTypeProvider({ children }: { children: ReactNode }) {
  const [typeStep, setTypeStepState] = useState<number>(DEFAULT_TYPE_STEP);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("echo.editorType") : null;
    const parsed = stored === null ? NaN : Number.parseInt(stored, 10);
    if (Number.isInteger(parsed) && parsed >= 0 && parsed < TYPE_STEPS.length) {
      setTypeStepState(parsed);
    }
  }, []);

  const setTypeStep = (i: number) => {
    setTypeStepState(i);
    if (typeof window !== "undefined") localStorage.setItem("echo.editorType", String(i));
  };

  return (
    <EditorTypeContext.Provider value={{ typeStep, setTypeStep }}>
      {children}
    </EditorTypeContext.Provider>
  );
}

export function useEditorType() {
  return useContext(EditorTypeContext);
}
