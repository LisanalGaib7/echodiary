import { useCallback, useEffect, useState } from "react";
import { getAllEntries } from "@/lib/db";
import { onEntriesChanged } from "@/lib/events";
import type { Entry } from "@/lib/types";

// Shared entries loader that stays in sync with saves/deletes anywhere in the app.
export function useEntries() {
  const [entries, setEntries] = useState<Entry[] | null>(null);

  const refresh = useCallback(async () => {
    setEntries(await getAllEntries());
  }, []);

  useEffect(() => {
    refresh();
    return onEntriesChanged(() => {
      refresh();
    });
  }, [refresh]);

  return { entries, refresh };
}
