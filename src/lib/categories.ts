// Single source of truth for error categories.
// Referenced by both the UI and the AI prompt.

import type { UiLang } from "@/lib/i18n";

export type Lang = "en" | "ko";

// Severity buckets drive both color weight and grouping in the Changes view:
// "core" = grammar that changes meaning/correctness, "idiom" = reads fine but
// unnatural, "nit" = surface-level (spelling/punctuation), folded away by default.
export type CategorySeverity = "core" | "idiom" | "nit";

export interface CategoryDef {
  code: string;
  labelEn: string;
  labelKo: string;
  severity: CategorySeverity;
}

export const EN_CATEGORIES: CategoryDef[] = [
  { code: "tense", labelEn: "Tense", labelKo: "시제", severity: "core" },
  { code: "subject_verb_agreement", labelEn: "Agreement", labelKo: "수일치", severity: "core" },
  { code: "article", labelEn: "Article", labelKo: "관사", severity: "core" },
  { code: "preposition", labelEn: "Preposition", labelKo: "전치사", severity: "core" },
  { code: "word_order", labelEn: "Word order", labelKo: "어순", severity: "core" },
  { code: "word_choice", labelEn: "Vocabulary", labelKo: "어휘", severity: "idiom" },
  {
    code: "collocation_naturalness",
    labelEn: "Collocation",
    labelKo: "콜로케이션",
    severity: "idiom",
  },
  { code: "punctuation", labelEn: "Punctuation", labelKo: "구두점", severity: "nit" },
  { code: "spelling", labelEn: "Spelling", labelKo: "철자", severity: "nit" },
];

export const KO_CATEGORIES: CategoryDef[] = [
  { code: "josa", labelEn: "Particles", labelKo: "조사", severity: "core" },
  { code: "spelling_spacing", labelEn: "Spelling", labelKo: "맞춤법", severity: "nit" },
  { code: "word_choice", labelEn: "Vocabulary", labelKo: "어휘", severity: "idiom" },
  { code: "word_order_structure", labelEn: "Structure", labelKo: "문장구조", severity: "core" },
  { code: "honorifics", labelEn: "Honorifics", labelKo: "높임법", severity: "idiom" },
  { code: "naturalness", labelEn: "Naturalness", labelKo: "자연스러움", severity: "idiom" },
];

export function categoriesFor(lang: Lang): CategoryDef[] {
  return lang === "en" ? EN_CATEGORIES : KO_CATEGORIES;
}

export function categoryLabel(lang: Lang, code: string, uiLang: UiLang): string {
  const def = categoriesFor(lang).find((c) => c.code === code);
  if (!def) return code;
  return uiLang === "en" ? def.labelEn : def.labelKo;
}

export function categoryCodes(lang: Lang): string[] {
  return categoriesFor(lang).map((c) => c.code);
}

export function categorySeverity(lang: Lang, code: string): CategorySeverity {
  return categoriesFor(lang).find((c) => c.code === code)?.severity ?? "idiom";
}
