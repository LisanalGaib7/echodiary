import { getDb, VOCAB_STORE } from "./db";
import type { VocabItem } from "./vocab-types";
import { emitVocabChanged } from "./events";

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function saveVocab(item: VocabItem): Promise<void> {
  const db = await getDb();
  await db.put(VOCAB_STORE, item);
  emitVocabChanged();
}

export async function getAllVocab(): Promise<VocabItem[]> {
  const db = await getDb();
  const all = (await db.getAll(VOCAB_STORE)) as VocabItem[];
  return all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function deleteVocab(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(VOCAB_STORE, id);
  emitVocabChanged();
}

/** Checks whether a phrase (normalized: trimmed, case-insensitive, whitespace
 *  collapsed) is already saved, so the popover can show "Saved" instead of
 *  creating a duplicate. */
export async function findVocabByText(text: string): Promise<VocabItem | undefined> {
  const target = normalize(text);
  const all = await getAllVocab();
  return all.find((v) => normalize(v.text) === target);
}
