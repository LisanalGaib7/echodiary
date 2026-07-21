## 1. Header: 모든 언어에서 영어 고정

`src/routes/index.tsx`에서 `uiLang === "ko"` 분기 제거. `kicker`와 `headline`을 항상 영어 버전으로 렌더:

- kicker: `"Chapter I — Write"`
- headline: `Echo <span italic>your</span> thoughts.`

이탤릭 악센트(`your`)는 그대로 유지.

## 2. README 톤 다듬기 — "AI스러움" 제거

현재 README의 마케팅/자기소개 어투("turns everyday writing into targeted language practice", "일기를 언어 학습으로 바꿔주는", 감탄사, 형용사 나열)를 걷어내고, 개발자가 리포를 열었을 때 필요한 정보만 담백하게 정리.

### 변경 방향

- **오프닝**: 소개 문단을 한 줄로 축소. "Echo is a bilingual (EN/KO) diary app with AI correction, change tables, and long-term pattern reports." / "한국어·영어 일기를 쓰고 교정과 변경표, 장기 패턴 리포트를 확인하는 앱."
- **Features**: 형용사·수식어 제거하고 명사 위주 bullet. 예: "Correction with editorial feedback" → "Corrections with per-change reasons and overall notes."
- **한국어 섹션**: 직역체·번역 냄새("~있습니다", "~수 있고") 정리하고 간결한 개발 문서체로. "주요 기능", "기술 스택" 같은 라벨은 유지.
- 이모지·과장 어휘·"turns X into Y" 류 마케팅 구문 전부 제거.
- Tech stack, Getting started, Environment, Project structure, Scripts, Deployment, License 섹션 구조와 코드블록은 유지 (정보성 있음).

### 파일

- `README.md` — 전면 재작성 (구조 유지, 문장만 교체)
- `src/routes/index.tsx` — `headline` / `kicker` 상수화, `uiLang` 분기 제거

코드 변경은 index.tsx 한 파일에 국한.
