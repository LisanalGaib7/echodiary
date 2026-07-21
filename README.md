# Echo

Bilingual (EN/KO) diary app with AI correction, a per-change table, streaks, weekly goals, and periodic reports.

---

## English

### What it does

- Write a diary entry in English or Korean.
- Get a corrected version plus a table of changes with categories and per-change reasons.
- See four sub-scores: Accuracy, Naturalness, Vocabulary, Structure.
- Track streaks and a weekly goal.
- Browse past entries in a 1-year activity heatmap and search them.
- Generate reports of the errors you make most often.

### Stack

- TanStack Start v1, React 19, Vite 7
- Tailwind CSS v4, shadcn/ui, Fraunces + Inter
- IndexedDB (client-side entry storage)
- Server-side AI gateway (OpenAI-compatible)
- Cloudflare Workers runtime

### Scripts

```bash
bun install
bun dev            # dev server on :8080
bun run build      # production build
bun run build:dev  # development-mode build
bun test
bun run lint
bun run format
```

### Environment

Copy `.env.example` to `.env` and fill in the AI gateway credentials.

### Project structure

```
src/
  routes/        # File-based routing (TanStack Start)
    __root.tsx   # App shell
    index.tsx    # Write
    history.tsx  # History
    report.tsx   # Report
    settings.tsx # Settings
  components/    # correction, history, report, root, weekly-goal, ui-common
  hooks/         # useCorrection, useEntries, useDraft, useWeeklyGoal, …
  lib/           # i18n, db, ai-provider, correction functions, motion, format
  styles.css     # Tailwind + design tokens
```

### UI languages

English, Korean, Japanese, Chinese, Spanish, French. The Write page header stays in English across all locales.

### Deployment

Any Cloudflare Workers-compatible host. See `MIGRATION.md` for notes on swapping the AI provider and Vite config.

### License

Private.

---

## 한국어

### 개요

한국어·영어 일기를 쓰고 교정과 변경표, 장기 패턴 리포트를 확인하는 앱.

### 기능

- 한국어 또는 영어로 일기 작성
- 교정본과 변경 이유가 담긴 변경표
- 네 가지 세부 점수: 정확성, 자연스러움, 어휘, 구조
- 연속 작성 기록(스트릭)과 주간 목표
- 지난 일기를 1년치 히트맵으로 확인, 검색 지원
- 자주 반복되는 오류를 모아 보여주는 리포트

### 기술 스택

- TanStack Start v1, React 19, Vite 7
- Tailwind CSS v4, shadcn/ui, Fraunces + Inter
- IndexedDB (일기 로컬 저장)
- 서버 사이드 AI 게이트웨이 (OpenAI 호환)
- Cloudflare Workers 런타임

### 스크립트

```bash
bun install
bun dev            # :8080 개발 서버
bun run build      # 프로덕션 빌드
bun run build:dev  # 개발 모드 빌드
bun test
bun run lint
bun run format
```

### 환경 변수

`.env.example`을 `.env`로 복사한 뒤 AI 게이트웨이 값을 채운다.

### 프로젝트 구조

```
src/
  routes/        # 파일 기반 라우팅 (TanStack Start)
    __root.tsx   # 앱 셸
    index.tsx    # 작성
    history.tsx  # 일자별 보기
    report.tsx   # 레포트
    settings.tsx # 설정
  components/    # correction, history, report, root, weekly-goal, ui-common
  hooks/         # useCorrection, useEntries, useDraft, useWeeklyGoal, …
  lib/           # i18n, db, ai-provider, 교정 함수, motion, format
  styles.css     # Tailwind + 디자인 토큰
```

### UI 언어

영어, 한국어, 일본어, 중국어, 스페인어, 프랑스어. Write 페이지 헤더는 모든 언어에서 영어로 고정.

### 배포

Cloudflare Workers 호환 호스트에서 동작. AI 프로바이더와 Vite 설정 교체는 `MIGRATION.md` 참고.

### 라이선스

Private.
