## 목표
1. `STRINGS`의 모든 키(≈60개)에 **ja / zh / es / fr** 번역 추가
2. **모바일 셸을 하단 탭 바 레이아웃**으로 재구성 (선택한 v1 프로토타입 기준)
   - 상단: `Echo` 로고 + 스트릭 pill
   - 상단 슬림: Weekly Goal 요약 카드 (X of N + 도트)
   - 중앙: 일기 작성 영역 (즉시 노출)
   - 하단 고정: Write / History / Report / Settings 탭 바
3. 데스크톱(≥md) 레이아웃은 **변경 없음** — 사이드바 유지

---

## 1. 번역 추가 — `src/lib/i18n.ts`

모든 STRINGS 항목에 `ja`, `zh`, `es`, `fr` 필드 추가. 번역 원칙:
- 앱/브랜드명 "Echo"는 그대로
- 짧고 인터페이스 톤 유지 (일기 앱)
- 언어별 관례 존중 (예: 중문은 "写作 / 历史 / 报告 / 设置", 일본어는 "書く / 履歴 / レポート / 設定")

`t()` 시그니처는 그대로. 폴백 로직은 이미 `entry[lang] ?? entry.en`이라 안전.

---

## 2. 모바일 셸 재구성

### 2.1 새 컴포넌트

**`src/components/root/MobileTabBar.tsx`**
- 하단 고정 (`fixed bottom-0 inset-x-0`), safe-area 하단 패딩
- 4개 탭: Write / History / Report / Settings
- 각 탭: 얇은 라인 아이콘 + 소형 대문자 라벨 (`text-[10px] uppercase tracking-tight`)
- 활성 탭은 maroon (`text-primary`, 아이콘 fill), 비활성은 `text-primary/40`
- `Link` + `activeProps` 로 하이라이트

**`src/components/root/MobileHeader.tsx`**
- 상단: `Echo` 로고 (Fraunces italic) + 우측 스트릭 pill (`useWeeklyGoal`에서 streak 읽음)
- 그 아래에 `WeeklyGoalCompact` 렌더

**`src/components/weekly-goal/WeeklyGoalCompact.tsx`**
- 한 줄 요약: "Weekly Goal" 캡션 + "N of M entries completed" + 우측 도트 프로그레스
- 기존 `useWeeklyGoal` 훅 재사용
- 데스크톱 사이드바의 `WeeklyGoal` 은 그대로 유지

### 2.2 `src/routes/__root.tsx`
- 현재: `md:grid-cols-12` — 모바일에서는 `aside`가 위에 stacking
- 변경: 
  - `<aside>`에 `hidden md:block` 추가 → 모바일에서 사이드바 숨김
  - 모바일 전용 `<MobileHeader />`를 `<main>` 위쪽에 `md:hidden`으로 렌더
  - 모바일 전용 `<MobileTabBar />`를 최상위에 `md:hidden fixed`로 렌더
  - `<main>`에 모바일용 하단 패딩 (`pb-24 md:pb-0`) — 탭 바 가림 방지

### 2.3 `src/routes/index.tsx`
- 모바일에서 상단 데이터라인(오늘 날짜 + 히어로 heading)이 이미 노출되도록 위쪽 여백만 살짝 조정 (필요 시)
- 히어로 heading 사이즈만 모바일에서 한 단계 낮춤 (`text-5xl md:text-7xl` 등) — 기존 값에 맞춰 미세 조정

---

## 3. 검증
- 프리뷰 393×852에서 접속 시 첫 화면에 헤더 + Weekly Goal 요약 + 히어로 heading + 텍스트에어리어 상단이 함께 보이는지 확인
- 하단 탭 4개가 Write/History/Report/Settings로 이동하며 활성 상태가 시각적으로 반영되는지 확인
- Settings 페이지에서 언어를 ja/zh/es/fr로 바꾸면 네비 라벨, 버튼, 빈 상태 문구까지 전부 번역이 반영되는지 확인
- 데스크톱(≥md) 뷰에서 기존 사이드바 레이아웃이 시각적으로 완전히 동일한지 확인
- `bun test` 통과 (tab-switch 스모크 유지)

---

## 참고 / 범위 밖
- 교정 로직, DB, AI 프롬프트 미변경
- 데스크톱 사이드바 디자인 미변경
- 새 색상 토큰 도입 없음 — 기존 maroon/cream 유지
