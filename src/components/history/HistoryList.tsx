import type { Entry } from "@/lib/types";
import { EntryCard } from "./EntryCard";

export function HistoryList({
  entries,
  onOpen,
}: {
  entries: Entry[];
  onOpen: (e: Entry) => void;
}) {
  return (
    <ul className="space-y-3">
      {entries.map((e) => (
        <li key={e.id}>
          <EntryCard entry={e} onOpen={onOpen} />
        </li>
      ))}
    </ul>
  );
}
