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
  retry: { en: "Retry", ko: "다시 시도" },
  draftSaving: { en: "Saving…", ko: "저장 중…" },
  draftSavedAt: { en: "Draft saved", ko: "임시 저장됨" },
  draftRestored: { en: "Draft restored", ko: "임시 저장을 불러왔어요" },
  correctionSaved: { en: "Saved to history", ko: "기록에 저장되었습니다" },
  correctionFailed: { en: "Correction failed", ko: "교정에 실패했어요" },
  correctionFailedDesc: {
    en: "We couldn't reach the correction service. Your text is safe — try again.",
    ko: "교정 서비스에 연결하지 못했어요. 작성한 내용은 그대로 있어요 — 다시 시도해보세요.",
  },
  emptyWriteTitle: { en: "Start with today's page", ko: "오늘의 페이지를 시작하세요" },
  emptyWriteDesc: {
    en: "Write a few sentences above and press Correct to see native-level feedback.",
    ko: "위에 몇 문장 적고 ‘교정’을 누르면 원어민 수준의 피드백을 받아볼 수 있어요.",
  },
  emptyHistoryTitle: { en: "No entries yet", ko: "아직 작성한 일기가 없어요" },
  emptyHistoryDesc: {
    en: "Your finished entries will collect here as a searchable manuscript.",
    ko: "완성한 일기는 이곳에 검색 가능한 원고처럼 쌓입니다.",
  },
  emptyMatchesTitle: { en: "Nothing matches", ko: "일치하는 결과가 없어요" },
  emptyMatchesDesc: {
    en: "Try a different keyword or reset the language filter.",
    ko: "다른 검색어를 사용하거나 언어 필터를 초기화해보세요.",
  },
  clearFilters: { en: "Clear filters", ko: "필터 초기화" },
  goWrite: { en: "Start writing", ko: "일기 쓰러 가기" },
  emptyReportTitle: { en: "Your patterns, distilled", ko: "당신의 패턴, 요약본" },
  emptyReportDesc: {
    en: "Pick a period above and generate a report to see which errors you make most often.",
    ko: "위에서 기간을 고르고 레포트를 생성하면 자주 반복되는 오류를 확인할 수 있어요.",
  },
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
