## 1. "mastery" → "progress"

**`src/components/WeeklyGoal.tsx`** (line 45): 영어 라벨 `mastery` → `progress`. 한국어 "진행" 유지.

```tsx
{pct}% {complete ? (uiLang === "ko" ? "달성" : "reached") : uiLang === "ko" ? "진행" : "progress"}
```

## 2. History fade-in 모션 통일

현재 각 라우트의 진입 애니메이션:

| 라우트 | 현재 |
|---|---|
| `/` (index) | `.reveal` — blur+translate, `--duration-xl` (~500ms) 스태거 |
| `/history` | `.animate-page-enter` — translate 6px, `--duration-sm` (~200ms) |
| `/report` | `.animate-page-enter` — 동일 |
| `/settings` | `.animate-page-enter` — 동일 |

History만 안 보이는 건 200ms + translate 6px가 너무 미묘해서입니다. 다른 탭도 동일하게 밋밋함.

**변경**: `animate-page-enter` 키프레임을 살짝 강화 — opacity 0→1 + translateY 8px, `--duration-md` (~300ms)로 상향. reduced-motion은 그대로 존중.

- `src/styles.css`의 `@keyframes page-enter`와 `@utility animate-page-enter` 두 곳만 조정
- 라우트 파일들은 이미 `animate-page-enter`가 붙어 있으므로 수정 불필요
- History의 두 분기(list / detail) 모두 이미 래퍼에 클래스가 있어 자동 적용

## 3. 검증

`bun test`로 tab-switch 테스트 통과 확인 (라우트 모듈 헬스체크).
