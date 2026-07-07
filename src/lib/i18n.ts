export type UiLang = "en" | "ko";

export const STRINGS = {
  appName: { en: "Echo", ko: "Echo" },
  tagline: {
    en: "Write. Get corrected. See your patterns.",
    ko: "쓰고, 교정받고, 약점을 확인하세요.",
  },
  navWrite: { en: "Write", ko: "작성" },
  navHistory: { en: "History", ko: "일자별 보기" },
  navReport: { en: "Report", ko: "레포트" },
  writePlaceholder: {
    en: "Write today's diary in English or Korean…",
    ko: "오늘의 일기를 한국어 또는 영어로 적어주세요…",
  },
  correct: { en: "Correct", ko: "교정" },
  correcting: { en: "Correcting…", ko: "교정 중…" },
  refined: { en: "Refined version", ko: "교정본" },
  changes: { en: "Changes", ko: "변경표" },
  original: { en: "Original", ko: "원문" },
  refinedCol: { en: "Refined", ko: "교정" },
  reason: { en: "Reason", ko: "이유" },
  category: { en: "Category", ko: "카테고리" },
  overall: { en: "Overall", ko: "총평" },
  score: { en: "Score", ko: "점수" },
  accuracy: { en: "Accuracy", ko: "정확성" },
  naturalness: { en: "Naturalness", ko: "자연스러움" },
  vocabulary: { en: "Vocabulary", ko: "어휘" },
  structure: { en: "Structure", ko: "구조" },
  strengths: { en: "What you do well", ko: "잘한 점" },
  improvements: { en: "Where you can improve", ko: "개선할 점" },
  noEntries: { en: "No entries yet.", ko: "아직 작성한 일기가 없습니다." },
  noChanges: { en: "No changes — already native!", ko: "변경 사항 없음 — 이미 자연스럽습니다!" },
  allTime: { en: "All time", ko: "전체" },
  last30: { en: "Last 30 days", ko: "최근 30일" },
  generate: { en: "Generate report", ko: "레포트 생성" },
  english: { en: "English entries", ko: "영어 일기" },
  korean: { en: "Korean entries", ko: "한국어 일기" },
  count: { en: "Count", ko: "횟수" },
  examples: { en: "Examples", ko: "예시" },
  avgScore: { en: "Average score", ko: "평균 점수" },
  entries: { en: "entries", ko: "편" },
  delete: { en: "Delete", ko: "삭제" },
  back: { en: "Back", ko: "뒤로" },
  errorOccurred: { en: "Something went wrong. Try again.", ko: "오류가 발생했습니다. 다시 시도해주세요." },
  empty: { en: "Please write something first.", ko: "먼저 일기를 작성해주세요." },
  uiLang: { en: "UI", ko: "UI" },
  searchPlaceholder: { en: "Search entries…", ko: "일기 검색…" },
  allLangs: { en: "All", ko: "전체" },
  activity: { en: "Activity", ko: "활동" },
  noMatches: { en: "No entries match your filters.", ko: "조건에 맞는 일기가 없습니다." },
  pickPeriod: { en: "Pick a period and generate your report.", ko: "기간을 선택하고 레포트를 생성하세요." },
  pageNotFound: { en: "Page not found", ko: "페이지를 찾을 수 없습니다" },
  goHome: { en: "Go home", ko: "홈으로" },
  pageDidntLoad: { en: "This page didn't load", ko: "페이지를 불러오지 못했습니다" },
  somethingWrong: { en: "Something went wrong.", ko: "오류가 발생했습니다." },
  tryAgain: { en: "Try again", ko: "다시 시도" },
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey, lang: UiLang): string {
  const entry = STRINGS[key];
  if (!entry) {
    if (import.meta.env?.DEV) console.warn(`[i18n] missing key: ${String(key)}`);
    return String(key);
  }
  return entry[lang];
}
