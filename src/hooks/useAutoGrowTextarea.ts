import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

/**
 * @param metricsKey Bump this when something other than `value` changes the
 *   textarea's line metrics (e.g. a font-size step), since scrollHeight
 *   depends on both. Without it the box can clip: same text, taller lines.
 */
export function useAutoGrowTextarea(value: string, metricsKey?: string | number) {
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
  }, [value, metricsKey, resize]);

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
