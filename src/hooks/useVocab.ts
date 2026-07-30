import { useCallback, useEffect, useState } from "react";
import { getAllVocab } from "@/lib/vocab-db";
import { onVocabChanged } from "@/lib/events";
import type { VocabItem } from "@/lib/vocab-types";

let vocabCache: VocabItem[] | null = null;

// Shared saved-phrases loader that stays in sync with saves/deletes anywhere in the app.
export function useVocab() {
  const [vocab, setVocab] = useState<VocabItem[] | null>(vocabCache);

  const refresh = useCallback(async () => {
    const next = await getAllVocab();
    vocabCache = next;
    setVocab(next);
  }, []);

  useEffect(() => {
    refresh();
    return onVocabChanged(() => {
      refresh();
    });
  }, [refresh]);

  return { vocab, refresh };
}
