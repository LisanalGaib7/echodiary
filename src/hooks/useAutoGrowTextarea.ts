import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export function useAutoGrowTextarea(value: string) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Collapse to 0 first so scrollHeight reflects the real content height,
    // then expand to fit. Using 0 instead of "auto" avoids getting stuck at
    // the textarea's rows/min-height.
    el.style.height = "0";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  // Resize before paint so users never see a collapsed frame.
  useLayoutEffect(() => {
    resize();
  }, [value, resize]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  return ref;
}
