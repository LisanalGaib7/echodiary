import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "echo:draft";
const DEBOUNCE_MS = 600;

export type DraftStatus = "idle" | "saving" | "saved";

interface Stored {
  text: string;
  savedAt: string;
}

function read(): Stored | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed?.text) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Debounced localStorage draft for the diary editor.
 * - Restores any pending text on first mount (returns `initial`).
 * - Persists every keystroke after a 600ms pause.
 * - `status` powers the "Saved · HH:MM" indicator in the editor UI.
 * - Call `clear()` after a successful submission.
 */
export function useDraft(text: string) {
  const [initial, setInitial] = useState<string>("");
  const [status, setStatus] = useState<DraftStatus>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [restored, setRestored] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydrated = useRef(false);

  // hydrate once
  useEffect(() => {
    const found = read();
    if (found) {
      setInitial(found.text);
      setSavedAt(new Date(found.savedAt));
      setStatus("saved");
      setRestored(true);
    }
    hydrated.current = true;
  }, []);

  // persist on change
  useEffect(() => {
    if (!hydrated.current) return;
    if (timer.current) clearTimeout(timer.current);
    if (!text.trim()) {
      window.localStorage.removeItem(STORAGE_KEY);
      setStatus("idle");
      setSavedAt(null);
      return;
    }
    setStatus("saving");
    timer.current = setTimeout(() => {
      const now = new Date();
      const payload: Stored = { text, savedAt: now.toISOString() };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        setSavedAt(now);
        setStatus("saved");
      } catch {
        setStatus("idle");
      }
    }, DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [text]);

  const clear = useCallback(() => {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    setStatus("idle");
    setSavedAt(null);
    setRestored(false);
  }, []);

  return { initial, status, savedAt, restored, clear };
}
