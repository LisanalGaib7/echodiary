import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export function useAutoGrowTextarea(value: string) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // Collapse first so scrollHeight reflects real content, then expand to fit.
    el.style.height = "0";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  // Resize before paint so users never see a collapsed frame.
  useLayoutEffect(() => {
    resize();
  }, [value, resize]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    // Re-measure after web fonts load — metrics change and can clip the box.
    let cancelled = false;
    document.fonts?.ready?.then(() => {
      if (!cancelled) resize();
    });
    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  return ref;
}
