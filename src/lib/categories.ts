// Single source of truth for error categories.
// Referenced by both the UI and the AI prompt.

export type Lang = "en" | "ko";

export interface CategoryDef {
  code: string;
  labelEn: string;
  labelKo: string;
}

export const EN_CATEGORIES: CategoryDef[] = [
  { code: "tense", labelEn: "Tense", labelKo: "시제" },
  { code: "subject_verb_agreement", labelEn: "Subject–verb agreement", labelKo: "주어-동사 수일치" },
  { code: "article", labelEn: "Article (a/the)", labelKo: "관사 (a/the)" },
  { code: "preposition", labelEn: "Preposition", labelKo: "전치사" },
  { code: "word_order", labelEn: "Word order", labelKo: "어순" },
  { code: "word_choice", labelEn: "Word choice", labelKo: "어휘 선택" },
  { code: "collocation_naturalness", labelEn: "Collocation / naturalness", labelKo: "콜로케이션·자연스러움" },
  { code: "punctuation", labelEn: "Punctuation", labelKo: "구두점" },
  { code: "spelling", labelEn: "Spelling", labelKo: "철자" },
];

export const KO_CATEGORIES: CategoryDef[] = [
  { code: "josa", labelEn: "Particles (josa)", labelKo: "조사" },
  { code: "spelling_spacing", labelEn: "Spelling & spacing", labelKo: "맞춤법·띄어쓰기" },
  { code: "word_choice", labelEn: "Word choice", labelKo: "어휘 선택" },
  { code: "word_order_structure", labelEn: "Word order / structure", labelKo: "어순·문장구조" },
  { code: "honorifics", labelEn: "Honorifics", labelKo: "높임법" },
  { code: "naturalness", labelEn: "Naturalness", labelKo: "자연스러움" },
];

export function categoriesFor(lang: Lang): CategoryDef[] {
  return lang === "en" ? EN_CATEGORIES : KO_CATEGORIES;
}

export function categoryLabel(lang: Lang, code: string, uiLang: "en" | "ko"): string {
  const def = categoriesFor(lang).find((c) => c.code === code);
  if (!def) return code;
  return uiLang === "en" ? def.labelEn : def.labelKo;
}

export function categoryCodes(lang: Lang): string[] {
  return categoriesFor(lang).map((c) => c.code);
}
