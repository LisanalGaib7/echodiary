import type { Lang } from "./categories";

export type { Lang };

export interface Change {
  original: string;
  refined: string;
  reason: string;
  category: string;
}

export interface SubScores {
  accuracy: number;
  naturalness: number;
  vocabulary: number;
  structure: number;
}

export interface Overall {
  score: number;
  subScores: SubScores;
  strengths: string;
  improvements: string;
}

export interface CorrectionResult {
  language: Lang;
  refinedText: string;
  changes: Change[];
  overall: Overall;
}

export interface Entry extends CorrectionResult {
  id: string;
  date: string; // YYYY-MM-DD
  originalText: string;
  createdAt: string;
  updatedAt: string;
  /** Present only when a mission was active at write time. Judged
   *  deterministically from `changes` — see src/lib/missions.ts. */
  mission?: { category: string; passed: boolean };
}
