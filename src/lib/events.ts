// Tiny pub/sub for cross-hook cache invalidation.
// Avoids pulling in a full state manager for a single global signal.

export const ENTRIES_CHANGED = "echo:entries-changed";

export function emitEntriesChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ENTRIES_CHANGED));
}

export function onEntriesChanged(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(ENTRIES_CHANGED, cb);
  return () => window.removeEventListener(ENTRIES_CHANGED, cb);
}
