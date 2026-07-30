// Tiny pub/sub for cross-hook cache invalidation.
// Avoids pulling in a full state manager for a single global signal.

export const ENTRIES_CHANGED = "echo:entries-changed";
export const VOCAB_CHANGED = "echo:vocab-changed";

export function emitEntriesChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ENTRIES_CHANGED));
}

export function onEntriesChanged(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(ENTRIES_CHANGED, cb);
  return () => window.removeEventListener(ENTRIES_CHANGED, cb);
}

export function emitVocabChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(VOCAB_CHANGED));
}

export function onVocabChanged(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(VOCAB_CHANGED, cb);
  return () => window.removeEventListener(VOCAB_CHANGED, cb);
}
