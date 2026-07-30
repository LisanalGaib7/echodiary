import type { Lang } from "./categories";

/** A phrase the user chose to keep. `context`/`entryDate` are denormalized
 *  from the source entry so a saved item still renders fully even after the
 *  original diary entry is deleted. */
export interface VocabItem {
  id: string;
  text: string;
  language: Lang;
  context: string;
  entryId: string;
  entryDate: string;
  createdAt: string;
}
