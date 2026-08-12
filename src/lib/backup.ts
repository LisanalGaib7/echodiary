// Local backup: export everything the user can't get back (diary entries and
// saved phrases) to a file, and restore it additively.
//
// Schemas are declared here rather than reused from correction.functions.ts:
// that module pulls in env.server / origin.server / ai-provider.server, and
// importing from it would drag server-only code into the client bundle.

import { z } from "zod";
import { getAllEntries, saveEntry } from "./db";
import { getAllVocab, saveVocab } from "./vocab-db";
import type { Entry } from "./types";
import { getGoal } from "./goals";

const LangSchema = z.enum(["en", "ko"]);

const ChangeSchema = z.object({
  original: z.string(),
  refined: z.string(),
  reason: z.string(),
  category: z.string(),
});

const EntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  originalText: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  language: LangSchema,
  refinedText: z.string(),
  changes: z.array(ChangeSchema),
  overall: z.object({
    score: z.number(),
    subScores: z.object({
      accuracy: z.number(),
      naturalness: z.number(),
      vocabulary: z.number(),
      structure: z.number(),
    }),
    strengths: z.string(),
    improvements: z.string(),
  }),
});

const VocabSchema = z.object({
  id: z.string(),
  text: z.string(),
  language: LangSchema,
  context: z.string(),
  entryId: z.string(),
  entryDate: z.string(),
  createdAt: z.string(),
});

/** Carried for reference only — restore deliberately does not apply these,
 *  so importing a backup never silently switches the user's UI language. */
const SettingsSchema = z
  .object({
    uiLang: z.string().optional(),
    explainLang: z.string().optional(),
    editorType: z.number().optional(),
    weeklyGoal: z.object({ target: z.number() }).optional(),
  })
  .optional();

export const FORMAT = "echodiary-backup";
export const VERSION = 1;

export const BackupSchema = z.object({
  // Literals, so a foreign or corrupt JSON file is rejected with a clear
  // validation error instead of half-importing.
  format: z.literal(FORMAT),
  version: z.literal(VERSION),
  exportedAt: z.string(),
  entries: z.array(EntrySchema),
  vocab: z.array(VocabSchema),
  settings: SettingsSchema,
});

export type BackupFile = z.infer<typeof BackupSchema>;

export interface RestoreResult {
  entriesAdded: number;
  entriesSkipped: number;
  vocabAdded: number;
  vocabSkipped: number;
}

function readLocal(key: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem(key) ?? undefined;
}

export async function buildBackup(): Promise<BackupFile> {
  const [entries, vocab] = await Promise.all([getAllEntries(), getAllVocab()]);
  const editorTypeRaw = readLocal("echo.editorType");
  return {
    format: FORMAT,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    entries,
    vocab,
    settings: {
      uiLang: readLocal("echo.uiLang"),
      explainLang: readLocal("echo.explainLang"),
      editorType: editorTypeRaw ? Number(editorTypeRaw) : undefined,
      weeklyGoal: getGoal(),
    },
  };
}

export function parseBackup(text: string): BackupFile {
  return BackupSchema.parse(JSON.parse(text));
}

/** Additive only: an id that already exists is skipped, never overwritten,
 *  so restoring can't destroy data that is already on this device. */
export async function applyBackup(file: BackupFile): Promise<RestoreResult> {
  const [existingEntries, existingVocab] = await Promise.all([getAllEntries(), getAllVocab()]);
  const entryIds = new Set(existingEntries.map((e) => e.id));
  const vocabIds = new Set(existingVocab.map((v) => v.id));

  const result: RestoreResult = {
    entriesAdded: 0,
    entriesSkipped: 0,
    vocabAdded: 0,
    vocabSkipped: 0,
  };

  for (const entry of file.entries) {
    if (entryIds.has(entry.id)) {
      result.entriesSkipped++;
      continue;
    }
    await saveEntry(entry);
    result.entriesAdded++;
  }

  for (const item of file.vocab) {
    if (vocabIds.has(item.id)) {
      result.vocabSkipped++;
      continue;
    }
    await saveVocab(item);
    result.vocabAdded++;
  }

  return result;
}

/** Human-readable companion to the JSON backup — for reading elsewhere or
 *  moving into a notes app. Not restorable; JSON stays the source of truth. */
export function toMarkdown(entries: Entry[]): string {
  const header = [
    "# echodiary",
    "",
    `${entries.length} entries · exported ${new Date().toISOString().slice(0, 10)}`,
    "",
  ];

  const body = entries.map((e) => {
    const lines = [
      "---",
      "",
      `## ${e.date}`,
      "",
      `**Original**`,
      "",
      e.originalText,
      "",
      `**Refined**`,
      "",
      e.refinedText,
      "",
    ];

    if (e.changes.length > 0) {
      lines.push("**Changes**", "");
      for (const c of e.changes) {
        // Quotes rather than backticks: a snippet containing a backtick
        // would otherwise break the inline code span.
        lines.push(`- "${c.original}" → "${c.refined}" — ${c.reason} (${c.category})`);
      }
      lines.push("");
    }

    const s = e.overall.subScores;
    lines.push(
      `**Score** ${e.overall.score}/10 — accuracy ${s.accuracy}, naturalness ${s.naturalness}, vocabulary ${s.vocabulary}, structure ${s.structure}`,
      "",
      `**Strengths** ${e.overall.strengths}`,
      "",
      `**Improvements** ${e.overall.improvements}`,
      "",
    );

    return lines.join("\n");
  });

  return [...header, ...body].join("\n");
}

export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function backupFilename(ext: "json" | "md"): string {
  return `echodiary-backup-${new Date().toISOString().slice(0, 10)}.${ext}`;
}
