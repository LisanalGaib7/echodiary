// Single source of truth for error categories.
// Referenced by both the UI and the AI prompt.

import type { UiLang } from "@/lib/i18n";

export type Lang = "en" | "ko";

export interface CategoryDef {
  code: string;
  labelEn: string;
  labelKo: string;
}

export const EN_CATEGORIES: CategoryDef[] = [
  { code: "tense", labelEn: "Tense", labelKo: "시제" },
  { code: "subject_verb_agreement", labelEn: "Agreement", labelKo: "수일치" },
  { code: "article", labelEn: "Article", labelKo: "관사" },
  { code: "preposition", labelEn: "Preposition", labelKo: "전치사" },
  { code: "word_order", labelEn: "Word order", labelKo: "어순" },
  { code: "word_choice", labelEn: "Vocabulary", labelKo: "어휘" },
  { code: "collocation_naturalness", labelEn: "Collocation", labelKo: "콜로케이션" },
  { code: "punctuation", labelEn: "Punctuation", labelKo: "구두점" },
  { code: "spelling", labelEn: "Spelling", labelKo: "철자" },
];

export const KO_CATEGORIES: CategoryDef[] = [
  { code: "josa", labelEn: "Particles", labelKo: "조사" },
  { code: "spelling_spacing", labelEn: "Spelling", labelKo: "맞춤법" },
  { code: "word_choice", labelEn: "Vocabulary", labelKo: "어휘" },
  { code: "word_order_structure", labelEn: "Structure", labelKo: "문장구조" },
  { code: "honorifics", labelEn: "Honorifics", labelKo: "높임법" },
  { code: "naturalness", labelEn: "Naturalness", labelKo: "자연스러움" },
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
