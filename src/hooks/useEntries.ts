import { useCallback, useEffect, useState } from "react";
import { getAllEntries } from "@/lib/db";
import { onEntriesChanged } from "@/lib/events";
import type { Entry } from "@/lib/types";

let entriesCache: Entry[] | null = null;

// Shared entries loader that stays in sync with saves/deletes anywhere in the app.
export function useEntries() {
  const [entries, setEntries] = useState<Entry[] | null>(entriesCache);

  const refresh = useCallback(async () => {
    const next = await getAllEntries();
    entriesCache = next;
    setEntries(next);
  }, []);

  useEffect(() => {
    refresh();
    return onEntriesChanged(() => {
      refresh();
    });
  }, [refresh]);

  return { entries, refresh };
}
