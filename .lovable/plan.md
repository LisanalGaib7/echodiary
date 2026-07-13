# 보안 강화 + 플랫폼 이식성(Portability) 플랜

목표 두 가지를 한 번에 달성합니다.
1. AI 크레딧 남용 등 실제 위험 차단
2. Lovable을 떠나 Vercel / Cloudflare / Netlify / 자체 호스팅 어디로 가도 최소 수정으로 돌아가는 구조

---

## 원칙: Lovable 종속 지점을 "얇은 어댑터"로 격리

현재 코드에서 Lovable 특화 지점은 3곳뿐입니다:
- `LOVABLE_API_KEY` 환경변수 + `ai.gateway.lovable.dev` (AI Gateway)
- `@lovable.dev/vite-tanstack-config` (Vite 설정)
- 배포 파이프라인 (Cloudflare Worker 타겟)

나머지(TanStack Start, IndexedDB, Fraunces/Inter, UI 코드)는 이미 표준입니다. 이 3개만 갈아끼울 수 있게 만들면 이식성 확보 완료.

---

## Phase 1 — 보안 즉시 조치 (이식성과 무관하게 필요)

### 1-1. AI 프로바이더 어댑터화 + 크레딧 보호
`src/lib/ai-gateway.server.ts`를 **`src/lib/ai-provider.server.ts`** 로 일반화:

```
provider = env.AI_PROVIDER  // "lovable" | "openai" | "openrouter" | "gemini"
switch (provider) {
  case "lovable":    createOpenAICompatible({ baseURL: LOVABLE_GW, headers: { "Lovable-API-Key": ... }})
  case "openai":     createOpenAI({ apiKey: OPENAI_API_KEY })
  case "openrouter": createOpenAICompatible({ baseURL: "https://openrouter.ai/api/v1", ... })
  case "gemini":     createGoogleGenerativeAI({ apiKey: GEMINI_API_KEY })
}
```

`correction.functions.ts`는 `getAiProvider()`만 호출 → 플랫폼 이동 시 env만 바꾸면 됨.

동시에 크레딧 남용 방어:
- **Origin/Referer 화이트리스트** 체크 (배포 도메인만 허용, 실패시 403)
- **Cloudflare Turnstile** 위젯 추가 → 서버에서 토큰 검증 (`TURNSTILE_SECRET`)
- 기존 in-memory rate limit은 유지하되 "best-effort" 주석 명확화

### 1-2. 입력/출력 하드닝
- 입력 8000자 유지, 추가로 **일일 총 문자수 제한**(IP 기준)
- 에러 메시지에서 provider/키 존재 여부 노출 금지 (이미 부분 적용, 재점검)
- AI 응답 refinedText를 렌더링하는 컴포넌트에서 `dangerouslySetInnerHTML` 없는지 재확인 (현재 clean)

### 1-3. 보안 헤더
`src/routes/__root.tsx` 또는 SSR 응답에 헤더 추가:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` (fonts.googleapis.com, fonts.gstatic.com, self만 허용)

---

## Phase 2 — 이식성 리팩토링

### 2-1. 환경변수 계층 정리
`src/lib/env.server.ts` 신설 — 모든 `process.env` 접근을 여기로 집중:

```
AI_PROVIDER, LOVABLE_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY,
TURNSTILE_SECRET, ALLOWED_ORIGINS, APP_BASE_URL
```

`.env.example` 파일 추가 → 다른 플랫폼으로 옮길 때 참고용.

### 2-2. Vite 설정 이중화
현재 `@lovable.dev/vite-tanstack-config`가 tanstackStart/vite-react/tailwind/nitro/path-alias를 통째로 감싸고 있음. 마이그레이션 대비 **`vite.config.portable.ts`** 를 함께 준비:

```ts
// 표준 조합: tanstackStart + viteReact + tailwindcss + tsconfigPaths + nitro
// Lovable 전용 componentTagger/error-logger만 빠짐
```

평소엔 `vite.config.ts`(Lovable) 사용, 이관 시 `vite.config.portable.ts`로 교체 + `package.json`에서 `@lovable.dev/*` 제거하면 즉시 표준 TanStack Start 프로젝트가 됨.

### 2-3. 배포 타겟 문서화
`MIGRATION.md` 작성:
- **Vercel**: `nitro preset = vercel`, env 등록, Edge/Node 선택
- **Cloudflare Pages/Workers**: 현 세팅 그대로 (`nodejs_compat`)
- **Netlify**: `nitro preset = netlify`
- **자체 호스팅(Node)**: `nitro preset = node-server`, `node .output/server/index.mjs`

각 케이스별 필요한 env 목록과 도메인/CSP 조정 포인트 포함.

### 2-4. 데이터 이식성
현재 저장소는 브라우저 IndexedDB(`src/lib/db.ts`)라 플랫폼 이동과 무관 ✅. 단:
- **Export/Import(JSON)** 버튼 추가 (History 페이지)
- 향후 Cloud 옮길 때를 위해 `Entry` 스키마 버전 필드(`schemaVersion: 1`) 준비

### 2-5. 에러 리포팅 분리
`src/lib/lovable-error-reporting.ts`가 Lovable 전용. `src/lib/error-reporting.ts` 인터페이스로 감싸고, 프로바이더 미설정 시 no-op로 동작하게 → 이관 후 Sentry 등으로 교체 쉬움.

---

## Phase 3 — 검증

- `bunx tsgo` 통과
- 로컬 build + 실제 첨삭 1회
- Origin 화이트리스트/Turnstile을 우회한 curl 요청이 403 반환하는지 확인
- `AI_PROVIDER=openai` 로 바꿔 스모크 테스트 (마이그레이션 리허설)

---

## 파일 변경 요약

**신규**
- `src/lib/ai-provider.server.ts`
- `src/lib/env.server.ts`
- `src/lib/error-reporting.ts`
- `src/lib/security/origin.ts`, `src/lib/security/turnstile.ts`
- `vite.config.portable.ts`
- `.env.example`
- `MIGRATION.md`

**수정**
- `src/lib/correction.functions.ts` (프로바이더 추상화 + origin/turnstile 검증)
- `src/routes/__root.tsx` 또는 `src/server.ts` (보안 헤더)
- `src/components/DiaryEditor.tsx` (Turnstile 위젯)
- `src/routes/history.tsx` (Export/Import)
- `package.json` (선택 의존성 표시)

**삭제 후보(이관 시)**
- `@lovable.dev/vite-tanstack-config`, `lovable-error-reporting` 관련 임포트

## 범위 외
- UI/디자인 변경 없음
- 사용자 인증 도입 없음 (원하면 Phase 4로 별도 계획 — Lovable Cloud 대신 Supabase 직접 연결이 이식성 최상)
