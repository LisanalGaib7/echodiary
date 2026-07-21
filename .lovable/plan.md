관측 결과, 탭 클릭 자체는 동작하지만 첫 방문 시 라우트 변경까지 100~400ms 이상 걸리고, History는 화면 제목이 보이기까지 약 615ms가 걸렸습니다. 원인은 추정이 아니라 코드/런타임 관측 기준으로 아래와 같습니다.

## 확인된 원인

1. **라우트 컴포넌트가 자동 code-splitting 되어 첫 방문마다 JS 청크를 다운로드합니다.**
   - Playwright 관측에서 `/history → /` 클릭 후 여러 route/component 모듈 요청이 발생했습니다.
   - `/history → /report`: `src/routes/report.tsx?...&tsr-split=component`, `src/lib/report.ts`, `LangReportCard.tsx` 요청이 발생했습니다.
   - `/report → /settings`: `settings.tsx?...&tsr-split=component`, Radix Select 관련 모듈 요청이 발생했습니다.
   - 그래서 첫 탭 전환은 “클릭 → 라우트 청크 로드 → 렌더” 순서가 되어 느리게 느껴집니다.

2. **현재 router에 hover/touch intent preloading이 설정되어 있지 않습니다.**
   - `src/router.tsx`에는 `defaultPreloadStaleTime: 0`만 있고 `defaultPreload`가 없습니다.
   - `Nav.tsx`, `MobileTabBar.tsx`의 `Link`에도 `preload="intent"`가 없습니다.
   - 즉 사용자가 탭에 접근하기 전 청크를 미리 받아두지 못합니다.

3. **History 진입 시 IndexedDB 전체 조회가 컴포넌트 mount 후 실행됩니다.**
   - `src/routes/history.tsx` → `useEntries()`
   - `src/hooks/useEntries.ts`는 mount 후 `getAllEntries()`를 호출합니다.
   - `src/lib/db.ts`의 `getAllEntries()`는 IndexedDB `getAll()` 후 전체 정렬을 합니다.
   - 데이터가 많을수록 History 첫 렌더/히트맵 계산이 더 느려질 수 있습니다.

4. **페이지 진입 애니메이션이 500ms라 체감 지연을 키웁니다.**
   - `src/styles.css`의 `.animate-page-enter`는 `--duration-lg: 500ms`를 사용합니다.
   - 라우트는 바뀌어도 콘텐츠가 500ms 동안 fade/slide 되므로 “탭이 늦게 바뀐다”는 느낌이 강화됩니다.

5. **데스크톱과 모바일 nav가 동시에 DOM에 있어 active 계산 대상이 중복됩니다.**
   - `__root.tsx`에서 데스크톱 `Nav`와 모바일 `MobileTabBar`가 모두 렌더되고 CSS로 숨겨집니다.
   - 직접적인 핵심 병목은 아니지만, active link 계산/DOM 업데이트가 중복됩니다.

## 개선 계획

1. **탭 링크에 preload를 추가합니다.**
   - `src/router.tsx`: `defaultPreload: "intent"` 추가.
   - `Nav.tsx`, `MobileTabBar.tsx`: 주요 탭 `Link`에 `preload="intent"`를 명시.
   - 데스크톱 hover, 모바일 touch/focus 시 다음 라우트 청크를 미리 받아 첫 클릭 지연을 줄입니다.

2. **주요 탭 route chunk를 앱 시작 후 idle 시간에 사전 로드합니다.**
   - `RootComponent`에서 `useRouter()`를 사용해 `/`, `/history`, `/report`, `/settings`를 `requestIdleCallback` 또는 짧은 timeout으로 `router.preloadRoute()`합니다.
   - 첫 클릭 전에 청크가 준비되어 있게 만들어 체감 전환 속도를 안정화합니다.

3. **탭 전환 애니메이션 시간을 줄입니다.**
   - `.animate-page-enter`는 유지하되 500ms 대신 180~220ms 정도로 줄입니다.
   - History fade-in 요구는 유지하면서, “늦게 바뀌는” 느낌을 줄입니다.

4. **History 데이터 로딩을 더 가볍게 보이도록 정리합니다.**
   - `useEntries()`가 이미 로드된 값을 재사용할 수 있도록 간단한 module-level cache를 둡니다.
   - History 재방문 시 `entries === null` 로딩 상태로 되돌아가지 않게 합니다.
   - 필요하면 이후 단계에서 IndexedDB 정렬/조회 범위를 최적화할 수 있습니다.

5. **전환 속도 회귀 테스트를 보강합니다.**
   - 기존 tab-switch 테스트는 route 파일 존재만 확인합니다.
   - 최소한 router 설정과 nav preload 속성이 유지되는지 테스트하거나, 가능한 범위에서 탭 링크 구성을 검증하도록 업데이트합니다.

## 기대 효과

- 첫 탭 전환: 라우트 청크 다운로드 대기 감소.
- 재방문 탭 전환: 거의 즉시 전환.
- History: 데이터가 이미 로드된 경우 로딩 깜빡임 감소.
- 애니메이션은 유지하되 체감 속도는 더 빠르게 조정.