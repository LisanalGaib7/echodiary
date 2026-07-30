import { openDB, type IDBPDatabase } from "idb";
import type { Entry } from "./types";
import { emitEntriesChanged } from "./events";

const DB_NAME = "echo-diary";
const STORE = "entries";
export const VOCAB_STORE = "vocab";

let dbPromise: Promise<IDBPDatabase> | null = null;

// Single shared connection — vocab-db.ts imports this too, so the store
// list and version live in exactly one place.
export function getDb() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB not available on server"));
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: "id" });
          store.createIndex("date", "date");
          store.createIndex("createdAt", "createdAt");
        }
        if (!db.objectStoreNames.contains(VOCAB_STORE)) {
          const vocab = db.createObjectStore(VOCAB_STORE, { keyPath: "id" });
          vocab.createIndex("createdAt", "createdAt");
          vocab.createIndex("entryId", "entryId");
        }
      },
    });
  }
  return dbPromise;
}

export async function saveEntry(entry: Entry): Promise<void> {
  const db = await getDb();
  await db.put(STORE, entry);
  emitEntriesChanged();
}

export async function getAllEntries(): Promise<Entry[]> {
  const db = await getDb();
  const all = (await db.getAll(STORE)) as Entry[];
  return all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getEntry(id: string): Promise<Entry | undefined> {
  const db = await getDb();
  return (await db.get(STORE, id)) as Entry | undefined;
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE, id);
  emitEntriesChanged();
}
