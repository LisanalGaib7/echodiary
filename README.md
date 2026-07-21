# Echo

> Write. Get corrected. See your patterns.

Echo is a multilingual diary app that turns everyday writing into targeted language practice. Write in English or Korean, get native-level corrections with an editorial change table and sub-scores, and watch your patterns emerge over time through streaks, weekly goals, and periodic reports.

---

## English

### Overview

Echo pairs a distraction-free diary editor with an AI writing coach. Each entry is corrected sentence by sentence, tagged by error category (Grammar, Collocation, Agreement, …), and scored across four dimensions — **Accuracy · Naturalness · Vocabulary · Structure**. Over time, the History heatmap and Report views surface the errors you make most often.

### Features

- **Correction with editorial feedback** — refined version, per-change reasons, and coach-style overall notes.
- **Changes table** — original vs. refined, categorized with compact pill tags.
- **History** — searchable manuscript-style archive with a 1-year activity heatmap.
- **Weekly goal & streak** — set a weekly target, track consecutive-day streaks.
- **Reports** — aggregated top errors and average scores per language, per period.
- **6-language UI** — English, Korean, Japanese, Chinese, Spanish, French.
- **Auto-saving drafts** — never lose an in-progress entry.
- **Responsive** — manuscript-spread layout on desktop, bottom tab bar on mobile.

### Tech stack

- **Framework**: TanStack Start v1 (React 19, SSR, server functions)
- **Build**: Vite 7
- **Styling**: Tailwind CSS v4 + shadcn/ui, Fraunces (display) + Inter (UI)
- **Storage**: IndexedDB (client-side entries)
- **AI**: Server-side AI gateway (OpenAI-compatible)
- **Runtime**: Cloudflare Workers (edge)

### Getting started

```bash
bun install
bun dev            # start dev server on :8080
bun run build      # production build
bun run build:dev  # development-mode build
bun test           # run tests
bun run lint       # eslint
bun run format     # prettier
```

### Environment

Copy `.env.example` to `.env` and fill in the AI gateway credentials and any related secrets.

### Project structure

```
src/
  routes/        # File-based routing (TanStack Start)
    __root.tsx   # App shell
    index.tsx    # Write
    history.tsx  # History
    report.tsx   # Report
    settings.tsx # Settings
  components/    # UI components (correction, history, report, root, weekly-goal, ui-common)
  hooks/         # useCorrection, useEntries, useDraft, useWeeklyGoal, …
  lib/           # i18n, db, ai-provider, correction functions, motion, format
  styles.css     # Tailwind + design tokens
```

### Deployment & portability

Any Cloudflare Workers-compatible host runs the build output. See `MIGRATION.md` for notes on porting the AI provider and Vite config away from the default hosting environment.

### License

Private project.

---

## 한국어

### 소개

Echo는 하루의 글쓰기를 언어 학습으로 바꿔주는 다국어 일기 앱입니다. 한국어 또는 영어로 일기를 쓰면 원어민 수준의 교정과 변경표, 그리고 **정확성 · 자연스러움 · 어휘 · 구조** 네 가지 세부 점수를 받을 수 있고, 시간이 지나면 히스토리 히트맵과 레포트를 통해 자신의 반복 오류 패턴을 확인할 수 있습니다.

### 주요 기능

- **교정 & 에디토리얼 피드백** — 교정본, 변경 이유, 코치가 쓴 듯한 총평.
- **변경표** — 원문과 교정본을 나란히 보여주고 카테고리 태그로 분류.
- **일자별 보기** — 검색 가능한 원고 형태 아카이브 + 1년치 활동 히트맵.
- **주간 목표 & 연속 기록** — 이번 주 목표 설정, 연속 작성 일수 추적.
- **레포트** — 언어별·기간별 상위 오류와 평균 점수 집계.
- **6개 언어 UI** — 한국어, 영어, 일본어, 중국어, 스페인어, 프랑스어.
- **임시 저장** — 작성 중인 글을 자동으로 보관.
- **반응형** — 데스크톱은 원고 스프레드 레이아웃, 모바일은 하단 탭바.

### 기술 스택

- **프레임워크**: TanStack Start v1 (React 19, SSR, 서버 함수)
- **빌드**: Vite 7
- **스타일**: Tailwind CSS v4 + shadcn/ui, Fraunces(디스플레이) + Inter(UI)
- **저장소**: IndexedDB (클라이언트 로컬 저장)
- **AI**: 서버 사이드 AI 게이트웨이 (OpenAI 호환)
- **런타임**: Cloudflare Workers (엣지)

### 시작하기

```bash
bun install
bun dev            # :8080 개발 서버
bun run build      # 프로덕션 빌드
bun run build:dev  # 개발 모드 빌드
bun test           # 테스트 실행
bun run lint       # eslint
bun run format     # prettier
```

### 환경 변수

`.env.example`을 `.env`로 복사한 뒤 AI 게이트웨이 관련 값을 채워주세요.

### 프로젝트 구조

```
src/
  routes/        # 파일 기반 라우팅 (TanStack Start)
    __root.tsx   # 앱 셸
    index.tsx    # 작성
    history.tsx  # 일자별 보기
    report.tsx   # 레포트
    settings.tsx # 설정
  components/    # UI 컴포넌트 (correction, history, report, root, weekly-goal, ui-common)
  hooks/         # useCorrection, useEntries, useDraft, useWeeklyGoal, …
  lib/           # i18n, db, ai-provider, 교정 함수, motion, format
  styles.css     # Tailwind + 디자인 토큰
```

### 배포 & 이식성

Cloudflare Workers 호환 호스트라면 어디서든 실행할 수 있습니다. AI 프로바이더와 Vite 설정을 기본 호스팅 환경에서 분리하는 방법은 `MIGRATION.md`를 참고하세요.

### 라이선스

Private project.
