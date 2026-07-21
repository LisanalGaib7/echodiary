## 목표
1. 탭 전환 시 라우트가 즉시 바뀌는지 확인하는 간단한 테스트 추가
2. History(및 Report) 페이지에도 Write처럼 fade-in 애니메이션 적용
3. EN/KO 언어 스위처를 사이드바 Nav에서 분리해 별도의 **Settings 탭**으로 이동

## 변경 사항

### 1. History / Report fade-in
- `src/routes/history.tsx`: 최상위 컨테이너와 `HistoryDetail` 분기에 기존 모션 토큰(`animate-page-enter` 또는 `reveal`, `src/styles.css`·`src/lib/motion.ts`에 이미 정의됨)을 적용
- `src/routes/report.tsx`: 동일하게 최상위 래퍼에 적용
- 새 CSS는 추가하지 않고 기존 유틸만 사용

### 2. Settings 탭으로 언어 스위처 분리
- `src/routes/settings.tsx` 신규 생성
  - `createFileRoute("/settings")` + 자체 `head()` 메타
  - "Language" 섹션에 기존 `SegmentedControl`을 `useUiLang()`에 바인딩 (EN / KO)
  - 향후 테마·리마인더 등 확장 가능한 구조
- `src/components/root/Nav.tsx`
  - 하단의 `SegmentedControl`과 `useUiLang` 제거
  - Report 아래에 "Settings" 링크 추가 (동일한 세로 인덱스 스타일)
- `src/lib/i18n.ts`
  - `navSettings` 문자열 추가 ("Settings" / "설정")
  - 필요 시 `language` 라벨 문자열 추가 ("Language" / "언어")

### 3. 라우트 전환 테스트
- `src/routes/__tests__/tab-switch.test.tsx` 추가 (Vitest + RTL)
  - `createMemoryHistory`로 라우터 마운트
  - `/` → Write 히어로 텍스트 확인
  - `/history`로 이동 → History 헤딩 즉시 렌더 확인
  - `/report`로 이동 → Report 헤딩 즉시 렌더 확인
  - 애니메이션 대기 없이 `router.navigate` 직후 DOM에 존재하는지 검증 (이전 회귀 지점을 정확히 커버)
- Vitest 설정이 없다면 `vitest.config.ts` + `test-setup.ts`(jsdom, RTL) 최소 구성 추가, 있으면 재사용

## 검증
- `bunx vitest run`으로 신규 테스트 통과 확인
- 프리뷰에서 History/Report 탭 클릭 시 부드럽게 fade-in 되는지 육안 확인
- `/settings`에서만 언어 스위처가 노출되고, 변경 시 앱 전체 언어가 즉시 반영되는지 확인

## 참고
- 교정/AI 로직·데이터 모델은 건드리지 않음 (UI/라우팅 한정)
- 언어 설정은 기존 `UiLangProvider`의 `localStorage` 저장이 그대로 유지되므로 위치만 이동