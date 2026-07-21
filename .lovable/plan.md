## 진단 (현재 상태)

- 팔레트/타이포(Fraunces + Inter, 테라코타/크림)와 종이 질감(그레인·비네트)은 이미 ADA 후보급 재료. 다만 **레이아웃이 여전히 "카드 스택"** 이라 재료가 살지 않음.
- Weekly Goal은 재구성됐지만, Hero → Goal → Editor → Correction 사이 **리듬(간격·스케일)이 균등**해서 시선 앵커가 없음.
- 모션은 히어로 타이틀 blur-reveal + 타자기 캐럿 정도. **상태 전환(제출→교정 결과 등장)에 서사가 없음.**
- History는 리스트+히트맵, Report는 카드 — 정보밀도만 있고 **"편집물"이 아님**.

## 방향성 — ADA 방법론 3가지 축

1. **Sense of place**: 각 라우트가 같은 "종이" 위에 있지만 다른 방(챕터)처럼 느껴져야 함 → 라우트 전환에 shared-element / view-transition.
2. **Focus over features**: 화면당 진짜 주인공 1개. Write=문장, History=시간, Report=패턴. 나머지는 whisper.
3. **Motion with meaning**: 장식용 애니메이션 금지. 모든 모션이 상태·계층·인과를 설명.

---

## 개선 포인트 (영역별)

### 공통 셸

- **타이포 스케일 재정의**: display 72/64/40, body 16/14. 현재 hero가 body와 너무 가까움 → 대비 강화.
- **그리드 재설계**: 12-col 대신 **편집디자인식 비대칭 그리드** (2/3 + 1/3), 왼쪽 여백에 챕터 번호("I. Write", "II. Archive", "III. Patterns")를 얇은 라벨로.
- **Nav**: 상단 가로 nav → **왼쪽 세로 인덱스(데스크톱)** / 상단 최소 nav(모바일). 로고는 워드마크만.
- **View transitions**: `document.startViewTransition` 로 라우트 이동 시 hero 타이틀·카드 morph.
- **Cursor·caret**: 텍스트 영역 진입 시 caret가 부드럽게 페이드-인, 문단 완성 시 짧은 "펜 끝 튐" 마이크로모션.

### Write (I)

- **날짜를 히어로화**: "Wednesday, June 24" 를 좌측 세로 라벨로 크게 (Fraunces Italic, 얇게). 텍스트에어리어는 배경과 동화 — 경계 없는 종이.
- **Weekly Goal 재배치**: 상단 스트립 대신 **우측 sticky rail** — 진행률 세그먼트가 세로로, 첨삭 완료 시 세그먼트가 채워지는 애니메이션이 실제 인과를 보여줌.
- **제출→결과 시네마**:
  1. Correct 버튼 → 버튼이 로딩 인디케이터로 morph
  2. 원문 텍스트가 살짝 blur/desaturate
  3. Refined 문장이 원문 위에 오버레이되며 차이 나는 단어만 색이 도는 shimmer
  4. 스크롤 하면 Refined가 위로 고정되고 아래에 ChangesTable이 stagger reveal
- **원문↔교정 diff 인터랙션**: 밑줄 hover 시 해당 change 카드가 하이라이트 (양방향 링크).

### History (II)

- **연대기 뷰**: 리스트 → **세로 타임라인**. 좌측에 월/주, 오른쪽에 엔트리. 히트맵은 상단이 아니라 **좌측 인덱스에 얇은 세로 스파크라인**으로 대체 (1년치, 스크롤 동기화).
- **엔트리 카드**: 점수 배지 → 문장의 첫 15자를 큰 serif로, 점수는 우측 상단 작은 tabular.
- **스크롤 스크럽**: 스파크라인 hover → 해당 주로 타임라인 점프, 배경에 옅은 하이라이트 밴드.
- **필터**: 상단 filter bar → 왼쪽 사이드 rail (라디오식 세로).

### Report (III)

- **"이번 달 나의 패턴" 매거진 스프레드**: 통계 대신 문장형 인사이트가 주인공 ("You lean on 'very' 3.2× more than natives"). 숫자는 서브.
- **데이터 시각화**: 카드형 → **한 페이지 대시보드 없이, 세로 스크롤 스토리**. 각 지표가 풀블리드 섹션.
- **비교 오브젝트**: 사용자 vs 네이티브 빈도를 **작은 부호 조판**(dot/bar/tick)으로 표현, Recharts 최소화.

### 모션 시스템 (시네마틱, 절제됨)

- **easing 통일**: `cubic-bezier(0.2, 0.9, 0.2, 1)` (Apple-like), duration 240/400/640ms 3단계.
- **Stagger**: 리스트/그리드는 40ms 간격, 최대 8개까지만 stagger.
- **Scroll-driven**: `animation-timeline: view()` 로 섹션 진입 시 opacity·translateY.
- **Reduced motion**: 모든 모션은 `prefers-reduced-motion` 시 opacity fade만.
- **Haptic-like micro**: 버튼 press 시 8ms scale(0.98), 성공 시 subtle glow pulse.

### 폰트 세부

- **Fraunces**: opsz 72로 히어로 (SOFT=100, WONK=1). 숫자는 tabular + `ss01`.
- **Inter**: v4, feature `cv11 ss03`, body letter-spacing -0.01em.
- **선택 추가**: 얇은 sans (예: **Söhne** 대체로 **Geist** 또는 **Inter Display**) — 라벨 전용. → 승인 시 도입.

---

## 실행 절차

1. **캡처**: Playwright로 Write / History / Report / 결과 상태 4장 캡처.
2. **디자인 방향 3안 생성**(`design--create_directions`) — 아래 3가지 무드로 렌더링:
  - **A. Editorial Silence** — 매거진 스프레드, 비대칭 그리드, 큰 Fraunces italic, 종이 여백 극대화.
  - **B. Cinematic Journal** — 어두운 톤 옵션, 필름 그레인 강조, 히어로가 극영화 타이틀처럼 등장.
  - **C. Precision Instrument** — 얇은 sans + 얇은 rules, 데이터가 조판된 계기판처럼, 모션은 기계적으로 정확.
3. **사용자 선택** → 그 방향으로 스타일 토큰·레이아웃·모션 커밋.
4. **구현 순서** (승인 후 별도 진행):
  - Step 1: 토큰·타이포 스케일·easing 통일 (`styles.css`)
  - Step 2: Write 라우트 재구성 + 제출 시네마 모션
  - Step 3: History 타임라인 재구성
  - Step 4: Report 스토리 스프레드
  - Step 5: View transitions + reduced-motion QA

## 기술 노트

- View transitions는 TanStack Router `router.navigate` 를 `document.startViewTransition` 로 래핑하는 얇은 훅으로 도입 (fallback: no-op).
- `animation-timeline: view()` 는 최신 Chromium만 → 안전 fallback으로 `IntersectionObserver` 병행.
- 새 폰트 도입 시 `__root.tsx` `<link rel="preconnect">` + `font-display: swap` 유지.
- 스크롤 스크럽·shared element는 페이지 재렌더 없이 layout-preserving 하도록 `useLayoutEffect` 로 측정.

## 확인 필요

- 다크 모드는 이번 리디자인에 포함할까요? (현재 토큰만 존재, UI 미노출) -> 다크 모드 포함
- 새 얇은 sans(Geist/Inter Display) 도입 허용? 아니면 Inter만 유지? -> 허용 
- View transitions 미지원 브라우저(Safari 구버전)는 그냥 무모션 fallback 으로 갈까요? -> ok

플랜 승인해 주시면 캡처 → 3안 렌더링으로 넘어갑니다.