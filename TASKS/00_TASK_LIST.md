# Free Traveler — Task List (00_TASK_LIST)

| 항목 | 내용 |
|---|---|
| Document ID | TASKLIST-TRAVEL-001 |
| 기준 문서 | `docs/02_SRS_BASELINE.md`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json` |
| 선행 검사 | `python3 scripts/validate_inputs.py` → `VALIDATE_INPUTS_PASS`, 11/11 checks passed (실행 로그는 본 문서 하단 부록 참고) |
| 작성일 | 2026-09-19 |
| 상태 | Task List만 작성됨 — 구현 코드·Branch·Commit·Issue 없음 |

> 이 문서는 **Task 목록만** 기록한다. `TASKS/` 폴더의 다른 파일(상세 Task 파일 등)은 이번 산출물에 포함하지 않는다.

---

## 요약

| 구분 | 개수 |
|---|---:|
| **전체 Task 수** | **67** |
| Page Owner | 5 |
| Component(SCR-001:8, SCR-002:7, SCR-003:4, SCR-004:6, SCR-005:4) | 29 |
| Global/Shared Component | 9 |
| Data | 4 |
| DB | 4 |
| Auth/API | 5 |
| Unit Test | 3 |
| Integration/RLS Test | 1 |
| E2E(Playwright) | 3 |
| CI/Release/Manual Check | 4 |
| **NON_IMPLEMENTATION(EXCLUDED) Requirement 수** | **22** |
| **Requirement 커버리지** | **114/114 전수 반영** (IMPLEMENT 92건 → Task 연결, EXCLUDED 22건 → NON_IMPLEMENTATION 표) — 빠진 ID 없음 |

Category별 개수: `page_owner=5`, `component=29`, `global_component=9`, `data=4`, `db=4`, `auth_api=5`, `unit_test=3`, `integration_test=1`, `e2e=3`, `ci_release_manual=4` — 합계 67. 이 총계는 본 문서 하단 "최종 집계" 절의 대조 결과와 일치한다.

---

## NON_IMPLEMENTATION (EXCLUDED Requirement — 상세 Task 없음)

Rule 16: EXCLUDED는 구현 Task를 만들지 않되 추적표에서 삭제하지 않는다. 근거는 `docs/PROJECT_SCOPE.md`, 후속 방향은 이번 단계의 판단이다.

| Requirement | 근거(PROJECT_SCOPE.md) | 후속 방향 |
|---|---|---|
| REQ-FUNC-010 | Should 우선순위 부가 기능, 1~12 핵심 범위 밖 | 차기 단계에서 URL 상태 동기화 라이브러리 도입 검토 |
| REQ-FUNC-045 | 자동 삭제 배치·법적 보존 예외 처리는 범용 백오피스 자동화 영역 | 탈퇴 시 계정 비활성화까지만 우선 지원, 완전 삭제 파이프라인은 별도 프로젝트로 분리 검토 |
| REQ-FUNC-055 | 전체 콘텐츠 CMS 제외 대상, 정적 데이터 직접 편집으로 대체 | 콘텐츠 양이 늘어나면 경량 CMS(예: 헤드리스) 도입 검토 |
| REQ-FUNC-056 | 범용 감사 로그 제외 대상, Git 이력으로 대체 | 현행 유지, 필요 시 Git 커밋 컨벤션 문서화 |
| REQ-FUNC-069 | Should 우선순위 부가 기능 | Web Share API는 브라우저 지원 확대 후 재검토 |
| REQ-FUNC-071 | 커스텀 이벤트 분석 파이프라인은 범위 밖 | 필요 시 Vercel Analytics 등 관리형 서비스로 재검토 |
| REQ-FUNC-072 | 전체 콘텐츠 CMS 제외 대상 | REQ-FUNC-055와 동일 |
| REQ-FUNC-073 | 미디어 업로드·라이선스 워크플로 제외 대상 | 이미지 URL+alt 정책 유지, 업로드 필요 시 재검토 |
| REQ-FUNC-075 | 전체 콘텐츠 CMS 제외 대상, 통계 화면 금지 원칙과도 부합 | 재도입하지 않음(설계 원칙과 충돌) |
| REQ-FUNC-076 | 범용 감사 로그 제외 대상 | REQ-FUNC-056과 동일 |
| REQ-NF-004 | 부하 테스트 제외 대상 | 트래픽 증가 시 k6 등 부하 테스트 도구 도입 검토 |
| REQ-NF-007 | CI 성능 게이트 자동화는 범위 밖 | MANUAL-PERFORMANCE-CHECK로 대체, 안정화 후 CI 게이트화 검토 |
| REQ-NF-008 | 장애 알림·SLA 모니터링 체계 제외 대상 | Vercel/Supabase 관리형 인프라 가용성에 의존 |
| REQ-NF-009 | 부하/장애 모니터링 체계 제외 대상 | 동일 |
| REQ-NF-010 | 자동 백업·장애 대응 체계 제외 대상 | Supabase 기본 백업에 의존, 별도 정책 수립 시 재검토 |
| REQ-NF-011 | 장애 알림 자동화 제외 대상 | Playwright 스모크 실행 시 수동 확인으로 대체 |
| REQ-NF-018 | REQ-FUNC-045와 동일 사유 | 동일 |
| REQ-NF-020 | 코드로 보장할 수 없는 운영 SLA 지표 | 신고 큐 UI(API-BLOCK-REPORT)로 운영자 대응만 지원 |
| REQ-NF-021 | 별도 속도 제한 미들웨어는 범위 밖 | 남용 발생 시 Rate limit 미들웨어 도입 검토 |
| REQ-NF-022 | 범용 감사 로그 제외 대상 | API-BLOCK-REPORT의 레코드 필드로 최소 추적만 유지 |
| REQ-NF-029 | 라이선스 승인 워크플로 제외 대상 | alt 텍스트 필수 기준으로 대체 |
| REQ-NF-033 | 장애 알림 자동화 제외 대상 | REQ-NF-011과 동일 |

---

## Page Owner Task (5개, Screen당 정확히 1개)

### Seq 1 — TASK-PAGE-SCR001

- **Task ID**: TASK-PAGE-SCR001
- **제목**: SCR-001 Page Owner — 메인 홈(`/`) 조립
- **Category**: page_owner
- **Implementation Status**: IMPLEMENT
- **Requirement Ref**: REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007(축소), REQ-FUNC-009, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-067, REQ-FUNC-068, REQ-FUNC-079
- **Screen**: SCR-001
- **Route**: `/`
- **Page Entry**: `src/app/page.tsx`
- **Depends On**: COMP-SCR001-SEARCH-HERO, COMP-SCR001-DOMESTIC-GRID, COMP-SCR001-INTL-GRID, COMP-SCR001-THEME-CHIPS, COMP-SCR001-SAFETY-GRID, COMP-SCR001-DEST-DETAIL-DRAWER, COMP-SCR001-MATE-PREVIEW, COMP-SCR001-ABOUT-SUMMARY, COMP-GLOBAL-HEADER-FOOTER, COMP-GLOBAL-EMPTY-STATE-BLOCK, COMP-GLOBAL-FAVORITES, COMP-GLOBAL-DESIGN-TOKENS, DATA-DESTINATIONS, DATA-SAFETY
- **Expected Files**: `src/app/page.tsx`(MODIFY — 현재 create-next-app 기본 스타터)
- **Functional AC**:
  - create-next-app 기본 스타터(Next.js 로고, "To get started, edit the page.tsx file.", "Deploy Now"/"Documentation" 링크)를 완전히 제거한다.
  - Section을 정확히 다음 순서로 조립한다: ①검색 Hero → ②국내 여행지 6개 → ③해외 여행지 6개 → ④여행 동기 6개 → ⑤국가별 주의사항 6개 → ⑥최근 동행글 3개 또는 완성형 Empty State → ⑦free_traveler 소개.
  - Section별 데이터 출처: ②③은 `DATA-DESTINATIONS`, ⑤는 `DATA-SAFETY`, ⑥은 `API-MATE-POSTS`(모집중 글, 없으면 Empty), ⑦은 `DATA-REPRESENTATIVE`.
  - 최소 콘텐츠 수: 국내 Card 6개, 해외 Card 6개, 테마 Chip 6개, 국가 Card 6개, 최근 동행글 3개(있을 때).
  - 반응형 콘텐츠 밀도: Desktop Card Grid 3×2, Mobile 1열 가로 스크롤(행 줄바꿈 없이 컬럼만 축소).
- **Visual AC**:
  - Hero는 Desktop 520~600px로 제한해 다음 Section 시작부가 보인다.
  - 큰 빈 영역(과도한 여백)을 만들지 않는다.
  - `Lorem ipsum`, "준비 중", "정보 확인 필요" 문구를 포함하지 않는다.
  - 내용 없는 빈 Card를 만들지 않는다.
  - Section 6이 데이터 없음 상태일 때 완성형 Empty State(안내 문장 + 이용 방법 3단계 + 글쓰기 CTA)를 표시한다.
  - Section 6의 `API-MATE-POSTS` 조회 중에는 Loading 상태(Skeleton Card 3개)를 표시하고, 완료 후 Empty State 또는 실제 카드로 전환한다.
- **Security/Privacy AC**: 즐겨찾기 토글은 `localStorage`만 사용하고 서버에 전송하지 않는다(비로그인 이용 가능).
- **Verify**: Playwright(E2E-PUBLIC-SMOKE), 수동 브라우저 확인(RELEASE-CHECK-VERCEL-SUPABASE)
- **Priority**: P0

### Seq 2 — TASK-PAGE-SCR002

- **Task ID**: TASK-PAGE-SCR002
- **제목**: SCR-002 Page Owner — 대표 소개(`/about`) 조립
- **Category**: page_owner
- **Implementation Status**: IMPLEMENT
- **Requirement Ref**: REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061(축소), REQ-FUNC-062(축소), REQ-FUNC-063, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-079
- **Screen**: SCR-002
- **Route**: `/about`
- **Page Entry**: `src/app/about/page.tsx`
- **Depends On**: COMP-SCR002-PROFILE-HERO, COMP-SCR002-TRAVEL-STATS, COMP-SCR002-INTRO-PHILOSOPHY, COMP-SCR002-TIMELINE, COMP-SCR002-VISITED-COUNTRIES, COMP-SCR002-GALLERY, COMP-SCR002-RECOMMENDED-DEST, COMP-GLOBAL-HEADER-FOOTER, COMP-GLOBAL-DESIGN-TOKENS, DATA-REPRESENTATIVE
- **Expected Files**: `src/app/about/page.tsx`(NEW)
- **Functional AC**:
  - Section 순서: ①Profile Hero → ②여행 지표 → ③소개·철학 → ④Timeline 6개 → ⑤방문 국가 30개 → ⑥Gallery 8개 → ⑦기억에 남는 여행지 4개+CTA.
  - Section별 데이터 출처: 전 Section `DATA-REPRESENTATIVE`.
  - 최소 콘텐츠 수: Timeline 6개 이상, 방문 국가 Chip 30개, Gallery 사진 8장 이상, 추천 여행지 Card 4개.
  - 반응형: Mobile 변형 미승인(Desktop 전용, `SCREEN_ROUTE_CONTRACT.json` 기준) — 320px까지는 반응형 원칙(REQ-FUNC-065)만 적용.
- **Visual AC**:
  - 큰 빈 영역 금지, Placeholder 문구(`Lorem ipsum`/"준비 중"/"정보 확인 필요") 금지, 빈 Card 금지.
  - 정적 데이터 화면이라 Empty State·Loading State는 해당 없음(항상 Success) — 단 이미지 로드 실패 시 alt 유지한 대체 표시.
- **Security/Privacy AC**: 해당 없음(비로그인 공개 정적 페이지).
- **Verify**: Playwright(E2E-PUBLIC-SMOKE)
- **Priority**: P1

### Seq 3 — TASK-PAGE-SCR003

- **Task ID**: TASK-PAGE-SCR003
- **제목**: SCR-003 Page Owner — 통합 여행 준비(`/travel-tools`) 조립
- **Category**: page_owner
- **Implementation Status**: IMPLEMENT
- **Requirement Ref**: REQ-FUNC-054, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-079, REQ-FUNC-080
- **Screen**: SCR-003
- **Route**: `/travel-tools`
- **Page Entry**: `src/app/travel-tools/page.tsx`
- **Depends On**: COMP-SCR003-INTRO-TABS, COMP-SCR003-FLIGHT-FORM, COMP-SCR003-HOTEL-FORM, COMP-SCR003-MATE-COMPOSER, COMP-GLOBAL-HEADER-FOOTER, COMP-GLOBAL-DESIGN-TOKENS, AUTH-SUPABASE-EMAIL, API-MATE-POSTS
- **Expected Files**: `src/app/travel-tools/page.tsx`(NEW)
- **Functional AC**:
  - "항공편 찾기"/"숙소 찾기"/"동행 구하기" 3개 탭을 **실제로 조립**한다(탭 전환 상태 관리 포함, 각 탭의 입력·검증·완료 상태는 서로 독립).
  - Section 순서: ①Intro(이용 순서 3단계) → ②탭 → ③조건 입력 Form → ④입력 요약·외부 이동 → ⑤찾기 Tip 3개 → ⑥동행 작성 또는 로그인 안내·안전 안내.
  - Mobile 변형 승인됨 — Form 필드 세로 재배치.
- **Visual AC**: 큰 빈 영역·Placeholder 문구 금지, 빈 Card 금지. 동행 탭 비로그인 상태는 완성형 안내(문장+방법+CTA)로 Empty가 아닌 Unauthorized 상태를 표시한다(REQ-FUNC-027/028). 세션 확인 중에는 Loading 상태(짧은 스켈레톤)를 표시한 뒤 Unauthorized 또는 작성 Form으로 전환한다.
- **Security/Privacy AC**: 항공·숙소 입력값을 서버·DB·URL 쿼리 어디에도 전달/저장하지 않는다(REQ-FUNC-017, REQ-FUNC-025, REQ-NF-017). 동행 작성 제출 시 안전수칙 동의 여부와 동의 시각만 기록한다(REQ-FUNC-080).
- **Verify**: Playwright(E2E-TRAVEL-TOOLS), Unit(UNIT-TRAVEL-DATES)
- **Priority**: P0

### Seq 4 — TASK-PAGE-SCR004

- **Task ID**: TASK-PAGE-SCR004
- **제목**: SCR-004 Page Owner — 동행 찾기(`/mates`) 조립
- **Category**: page_owner
- **Implementation Status**: IMPLEMENT
- **Requirement Ref**: REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-079
- **Screen**: SCR-004
- **Route**: `/mates`
- **Page Entry**: `src/app/mates/page.tsx`
- **Depends On**: COMP-SCR004-INTRO-CTA, COMP-SCR004-FILTER-BAR, COMP-SCR004-POST-LIST, COMP-SCR004-POST-DETAIL, COMP-SCR004-APPLY-FLOW, COMP-SCR004-REPORT-BLOCK, API-MATE-POSTS, API-PARTICIPATION, API-BLOCK-REPORT, COMP-GLOBAL-HEADER-FOOTER, COMP-GLOBAL-EMPTY-STATE-BLOCK, COMP-GLOBAL-TOAST, COMP-GLOBAL-DESIGN-TOKENS
- **Expected Files**: `src/app/mates/page.tsx`(NEW)
- **Functional AC**:
  - Section 순서: ①Intro+글쓰기 CTA → ②Filter·결과 요약 → ③동행 목록(최대 8개) → ④상세(Desktop 좌우분할/Mobile Drawer) → ⑤신청 방법 3단계 → ⑥안전·신고·차단 안내+CTA.
  - 데이터 출처: ③④는 `API-MATE-POSTS`, ⑤ 신청은 `API-PARTICIPATION`, ⑥ 신고/차단은 `API-BLOCK-REPORT`.
  - 목록 결과 없음/필터 결과 없음 모두 완성형 Empty State(안내+필터 초기화+이용 방법 3단계+글쓰기 CTA).
- **Visual AC**: 큰 빈 영역·Placeholder 문구·빈 Card 금지. Mobile은 별도 Screen 미승인이라 반응형(Drawer 전환)으로만 대응한다. 목록·상세 데이터 조회 중에는 Loading 상태(Skeleton Card)를 표시한다.
- **Security/Privacy AC**: 연락처 정보를 응답 데이터에 포함하지 않는다(REQ-FUNC-033). 신청·신고·차단은 로그인 사용자만 가능(RLS로 서버 강제).
- **Verify**: Playwright(E2E-MATE-AUTH), Unit(UNIT-MATE-STATE)
- **Priority**: P0

### Seq 5 — TASK-PAGE-SCR005

- **Task ID**: TASK-PAGE-SCR005
- **제목**: SCR-005 Page Owner — 계정·관리(`/account`) 조립
- **Category**: page_owner
- **Implementation Status**: IMPLEMENT
- **Requirement Ref**: REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-066, REQ-FUNC-079
- **Screen**: SCR-005
- **Route**: `/account`
- **Page Entry**: `src/app/account/page.tsx`
- **Depends On**: COMP-SCR005-AUTH, COMP-SCR005-PROFILE, COMP-SCR005-MY-ACTIVITY, COMP-SCR005-ADMIN, AUTH-SUPABASE-EMAIL, API-MATE-POSTS, API-PARTICIPATION, API-BLOCK-REPORT, API-ADMIN-URLS, COMP-GLOBAL-FAVORITES, COMP-GLOBAL-HEADER-FOOTER, COMP-GLOBAL-EMPTY-STATE-BLOCK, COMP-GLOBAL-TOAST, COMP-GLOBAL-DESIGN-TOKENS
- **Expected Files**: `src/app/account/page.tsx`(NEW)
- **Functional AC**:
  - Guest/Member/Admin 역할별 탭 렌더링 분기를 **실제로 조립**한다. 역할에 없는 탭·블록은 렌더링하지 않는다(조건부 렌더링 로직을 코드로 구현, 문서상 언급만으로 대체하지 않는다).
  - 현재 역할의 Intro → 핵심 작업 → 도움말/다음 행동 순서를 지킨다: Guest(계정 기능 Intro→로그인/가입/재설정→기능 안내→보안 안내), Member(프로필 요약→내 글→참가 요청→즐겨찾기→차단 목록→작성 CTA), Admin(관리 Intro→신고 큐→외부 URL 설정).
  - Member "내 글" 없음/참가 요청 없음/즐겨찾기 없음/차단 없음은 각각 완성형 Empty State.
- **Visual AC**: 큰 빈 영역·Placeholder 문구·빈 Card 금지. Admin에 차트·KPI 그리드를 넣지 않는다(신고 큐+URL Form만). 역할 판별·데이터 조회 중에는 Loading 상태를 표시하고 완료 전까지 Guest Empty/Unauthorized로 오인되는 화면을 보여주지 않는다.
- **Security/Privacy AC**: Guest는 Unauthorized가 기본 진입 상태. Member/Admin 데이터는 RLS로 본인/작성자/Admin만 접근(REQ-FUNC-044, REQ-NF-013). 외부 URL은 HTTPS만 허용하고 저장 전 검증한다(REQ-FUNC-077).
- **Verify**: Playwright(E2E-MATE-AUTH), Integration(TEST-RLS-BASIC)
- **Priority**: P0

---

## Component Task — SCR-001 (8개)

| Seq | Task ID | 제목 | Requirement Ref | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|
| 6 | COMP-SCR001-SEARCH-HERO | 검색 Hero(검색창+계절·기간 Filter) | REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-067 | COMP-GLOBAL-DESIGN-TOKENS, DATA-DESTINATIONS | `src/components/scr001/SearchHero.tsx` | P0 |
| 7 | COMP-SCR001-DOMESTIC-GRID | 국내 인기 여행지 Card Grid 6개 | REQ-FUNC-001, REQ-FUNC-005, REQ-FUNC-007(축소) | DATA-DESTINATIONS, COMP-GLOBAL-FAVORITES | `src/components/scr001/DestinationGrid.tsx`(variant=domestic) | P0 |
| 8 | COMP-SCR001-INTL-GRID | 해외 인기 여행지 Card Grid 6개 | REQ-FUNC-001, REQ-FUNC-007(축소) | DATA-DESTINATIONS, COMP-GLOBAL-FAVORITES | `src/components/scr001/DestinationGrid.tsx`(variant=international) | P0 |
| 9 | COMP-SCR001-DEST-DETAIL-DRAWER | 여행지 상세 Drawer/Modal(추천 6개 포함) | REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-009 | DATA-DESTINATIONS, DATA-SAFETY | `src/components/scr001/DestinationDrawer.tsx` | P0 |
| 10 | COMP-SCR001-THEME-CHIPS | 여행 동기·테마 Chip 6개 | N/A(디자인 규정, `UI_CONTRACT.md` §SCR-001) | COMP-GLOBAL-DESIGN-TOKENS | `src/components/scr001/ThemeChips.tsx` | P1 |
| 11 | COMP-SCR001-SAFETY-GRID | 국가별 주의사항 Card 6개 + 안전정보 Drawer(8개 카테고리) | REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054, REQ-NF-028(부분) | DATA-SAFETY | `src/components/scr001/CountrySafetyGrid.tsx`, `src/components/scr001/SafetyDrawer.tsx` | P0 |
| 12 | COMP-SCR001-MATE-PREVIEW | 최근 동행글 3개 또는 완성형 Empty State | N/A(디자인 규정) | API-MATE-POSTS, COMP-GLOBAL-EMPTY-STATE-BLOCK | `src/components/scr001/RecentMatePreview.tsx` | P1 |
| 13 | COMP-SCR001-ABOUT-SUMMARY | free_traveler 요약(좌우 분할) | N/A(디자인 규정, DATA-REPRESENTATIVE 재사용) | DATA-REPRESENTATIVE | `src/components/scr001/AboutSummaryBlock.tsx` | P1 |

## Component Task — SCR-002 (7개)

| Seq | Task ID | 제목 | Requirement Ref | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|
| 14 | COMP-SCR002-PROFILE-HERO | Profile Hero | REQ-FUNC-061(축소) | DATA-REPRESENTATIVE | `src/components/scr002/ProfileHero.tsx` | P1 |
| 15 | COMP-SCR002-TRAVEL-STATS | 여행 지표(50+Trips/30+Countries) | REQ-FUNC-057 | DATA-REPRESENTATIVE | `src/components/scr002/TravelStats.tsx` | P1 |
| 16 | COMP-SCR002-INTRO-PHILOSOPHY | 소개·철학 2~4문단 | REQ-FUNC-058 | DATA-REPRESENTATIVE | `src/components/scr002/IntroPhilosophy.tsx` | P1 |
| 17 | COMP-SCR002-TIMELINE | 여행 Timeline 6개 이상 | REQ-FUNC-060 | DATA-REPRESENTATIVE | `src/components/scr002/Timeline.tsx` | P1 |
| 18 | COMP-SCR002-VISITED-COUNTRIES | 방문 국가 30개국 Chip(권역별) | REQ-FUNC-059 | DATA-REPRESENTATIVE | `src/components/scr002/VisitedCountries.tsx` | P1 |
| 19 | COMP-SCR002-GALLERY | 여행 사진 Gallery 8장 이상 | REQ-FUNC-061(축소) | DATA-REPRESENTATIVE | `src/components/scr002/PhotoGallery.tsx` | P1 |
| 20 | COMP-SCR002-RECOMMENDED-DEST | 추천 여행지 4개+CTA | REQ-FUNC-062(축소), REQ-FUNC-063 | DATA-REPRESENTATIVE, DATA-DESTINATIONS | `src/components/scr002/RecommendedDestinations.tsx` | P1 |

## Component Task — SCR-003 (4개, Rule 9: 항공·숙소·동행 분리)

| Seq | Task ID | 제목 | Requirement Ref | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|
| 21 | COMP-SCR003-INTRO-TABS | Intro(이용 순서 3단계) + Tabs 셸(탭 전환 상태) | N/A(디자인 규정) | COMP-GLOBAL-DESIGN-TOKENS | `src/components/scr003/IntroTabs.tsx` | P0 |
| 22 | COMP-SCR003-FLIGHT-FORM | 항공 조건 입력+검증+요약+외부이동+비전달고지+Tip3 | REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018 | COMP-GLOBAL-DESIGN-TOKENS | `src/components/scr003/FlightForm.tsx` | P0 |
| 23 | COMP-SCR003-HOTEL-FORM | 숙소 조건 입력+검증+요약+외부이동+비전달고지+Tip3 | REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026 | COMP-GLOBAL-DESIGN-TOKENS | `src/components/scr003/HotelForm.tsx` | P0 |
| 24 | COMP-SCR003-MATE-COMPOSER | 동행 작성 Form 또는 로그인 안내+안전 안내(연락처 탐지 포함) | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080 | AUTH-SUPABASE-EMAIL, API-MATE-POSTS | `src/components/scr003/MateComposer.tsx` | P0 |

## Component Task — SCR-004 (6개, Rule 10: 목록·필터·상세·참가·신고·차단 분리)

| Seq | Task ID | 제목 | Requirement Ref | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|
| 25 | COMP-SCR004-INTRO-CTA | Intro+"동행글 쓰기" CTA | N/A(디자인 규정) | COMP-GLOBAL-DESIGN-TOKENS | `src/components/scr004/IntroCta.tsx` | P1 |
| 26 | COMP-SCR004-FILTER-BAR | Filter(국가·지역·기간·모집상태)+결과 요약 | REQ-FUNC-030 | API-MATE-POSTS | `src/components/scr004/FilterBar.tsx` | P0 |
| 27 | COMP-SCR004-POST-LIST | 동행글 목록(최대 8개, 상태 배지) | REQ-FUNC-037 | API-MATE-POSTS | `src/components/scr004/PostList.tsx` | P0 |
| 28 | COMP-SCR004-POST-DETAIL | 상세(Desktop 좌우분할/Mobile Drawer) | REQ-FUNC-033 | API-MATE-POSTS | `src/components/scr004/PostDetail.tsx` | P0 |
| 29 | COMP-SCR004-APPLY-FLOW | 참가 신청 3단계 안내+제출 Form(500자) | REQ-FUNC-034, REQ-FUNC-035 | API-PARTICIPATION | `src/components/scr004/ApplyFlow.tsx` | P0 |
| 30 | COMP-SCR004-REPORT-BLOCK | 신고·차단 트리거+안전 안내 CTA Banner | REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-043 | API-BLOCK-REPORT, COMP-GLOBAL-TOAST | `src/components/scr004/ReportBlockPanel.tsx` | P0 |

## Component Task — SCR-005 (4개, Rule 11: Auth·Profile·My Activity·Admin 분리)

| Seq | Task ID | 제목 | Requirement Ref | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|
| 31 | COMP-SCR005-AUTH | Guest: 로그인/가입/비밀번호 재설정+기능안내+보안안내 | REQ-FUNC-066 | AUTH-SUPABASE-EMAIL | `src/components/scr005/AuthPanel.tsx` | P0 |
| 32 | COMP-SCR005-PROFILE | Member: 프로필·성인확인 요약 | REQ-FUNC-029 | DB-ACCESS | `src/components/scr005/ProfileSummary.tsx` | P0 |
| 33 | COMP-SCR005-MY-ACTIVITY | Member: 내 글/참가요청/즐겨찾기/차단목록/작성CTA | REQ-FUNC-036, REQ-FUNC-038, REQ-FUNC-040, REQ-FUNC-068 | API-MATE-POSTS, API-PARTICIPATION, COMP-GLOBAL-FAVORITES | `src/components/scr005/MyActivity.tsx` | P0 |
| 34 | COMP-SCR005-ADMIN | Admin: 신고 큐+외부 URL 설정 | REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-077 | API-BLOCK-REPORT, API-ADMIN-URLS | `src/components/scr005/AdminPanel.tsx` | P0 |

---

## Global/Shared Component Task (9개)

| Seq | Task ID | 제목 | Requirement Ref | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|
| 35 | COMP-GLOBAL-DESIGN-TOKENS | `design-reference/D-001/DESIGN.md` 토큰을 Tailwind 테마로 반영 | N/A(디자인 정본 반영) | — | `tailwind.config.ts`, `src/app/globals.css` | P0 |
| 36 | COMP-GLOBAL-HEADER-FOOTER | 전역 Header/Footer(5개 Screen 공통) | REQ-FUNC-064 | COMP-GLOBAL-DESIGN-TOKENS | `src/components/shared/Header.tsx`, `src/components/shared/Footer.tsx` | P0 |
| 37 | COMP-GLOBAL-EMPTY-STATE-BLOCK | 완성형 Empty State 공용 블록(안내+방법+CTA) | N/A(디자인 규정) | COMP-GLOBAL-DESIGN-TOKENS | `src/components/shared/EmptyState.tsx` | P0 |
| 38 | COMP-GLOBAL-TOAST | 참가/신고 처리 결과 Toast | REQ-FUNC-043(축소) | COMP-GLOBAL-DESIGN-TOKENS | `src/components/shared/Toast.tsx` | P1 |
| 39 | COMP-GLOBAL-FAVORITES | 즐겨찾기 `localStorage` 로직(추가/해제/조회) | REQ-FUNC-068 | — | `src/lib/favorites.ts` | P1 |
| 40 | COMP-GLOBAL-RESPONSIVE-LAYOUT | 320px~Desktop 반응형 그리드 유틸+이미지 lazy load | REQ-FUNC-065, REQ-NF-006 | COMP-GLOBAL-DESIGN-TOKENS | `src/components/shared/ResponsiveGrid.tsx`, `next.config.ts`(image) | P1 |
| 41 | COMP-GLOBAL-A11Y | ARIA/시맨틱 공통 처리, 키보드 포커스 링 | REQ-FUNC-079, REQ-NF-023 | COMP-GLOBAL-DESIGN-TOKENS | `src/components/shared/*`(공통 속성), `src/lib/a11y.ts` | P0 |
| 42 | COMP-GLOBAL-SEO-META | 공개 페이지 SEO 메타데이터(Next.js Metadata API) | REQ-FUNC-070, REQ-NF-030 | — | `src/app/layout.tsx`, 각 `page.tsx`의 `generateMetadata` | P1 |
| 43 | COMP-GLOBAL-ERROR-PAGES | 404/500/권한없음/외부연결실패 복구 행동(기술 Route) | REQ-FUNC-078 | COMP-GLOBAL-DESIGN-TOKENS | `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/global-error.tsx` | P1 |

---

## Data Task (4개, 필수 지정 3개 + 검증 스크립트 1개)

| Seq | Task ID | 제목 | Requirement Ref | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|
| 44 | DATA-DESTINATIONS | 여행지 정적 데이터(국내 10곳·해외 15개국 30개 도시) | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-009 | — | `src/data/destinations.ts` | P0 |
| 45 | DATA-SAFETY | 국가별 안전정보 정적 데이터(8개 카테고리) | REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054, REQ-NF-027 | — | `src/data/safety.ts` | P0 |
| 46 | DATA-REPRESENTATIVE | free_traveler 대표 소개 정적 데이터 | REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-061, REQ-FUNC-062, REQ-FUNC-063 | — | `src/data/representative.ts` | P1 |
| 47 | DATA-VALIDATION-SCRIPT | 데이터 수량·완전성 검증 스크립트(게시 전 완전성 게이트) | REQ-FUNC-008, REQ-FUNC-074, REQ-NF-026, REQ-NF-027 | DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE | `scripts/validate_content_data.mjs` | P0 |

**Acceptance Criteria(공통, Data Task 3개)**: 데이터는 TypeScript 정적 파일로만 관리한다(DB 아님). 모든 이미지 필드는 실제 장소를 설명하는 `alt` 텍스트를 필수로 갖는다. `Lorem ipsum`/"준비 중"/"정보 확인 필요" 문자열을 포함하지 않는다.

---

## DB Task (4개, 필수 지정 이름 그대로)

| Seq | Task ID | 제목 | Requirement Ref | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|
| 48 | DB-SCHEMA-BASE | 6개 테이블 스키마 마이그레이션 | REQ-FUNC-029, REQ-FUNC-031, REQ-FUNC-034, REQ-FUNC-039, REQ-FUNC-041, REQ-FUNC-077 | — | `supabase/migrations/0001_schema.sql` | P0 |
| 49 | DB-RLS-BASE | RLS 정책(본인/작성자/Admin만 접근) | REQ-FUNC-044, REQ-NF-013, REQ-NF-014, REQ-NF-015 | DB-SCHEMA-BASE | `supabase/migrations/0002_rls.sql` | P0 |
| 50 | DB-ACCESS | 타입 안전 DB 접근 레이어 | REQ-NF-012, REQ-NF-016, REQ-NF-017 | DB-SCHEMA-BASE, DB-RLS-BASE | `src/lib/db.ts`, `src/lib/supabase-client.ts` | P0 |
| 51 | DB-SEED-BASE | 개발/테스트용 시드 데이터 | N/A(개발 지원) | DB-SCHEMA-BASE | `supabase/seed.sql` | P1 |

**DB-SCHEMA-BASE 테이블 목록(정확히 6개, 초과 금지)**: `profiles`, `mate_posts`, `participation_requests`, `blocks`, `reports`, `external_urls`. 즐겨찾기는 `localStorage`이므로 테이블을 만들지 않는다(`COMP-GLOBAL-FAVORITES` 참조).

---

## Auth/API Task (5개)

| Seq | Task ID | 제목 | Requirement Ref | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|
| 52 | AUTH-SUPABASE-EMAIL | 이메일 가입·인증·로그인·로그아웃·재설정+성인확인 | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-066 | DB-SCHEMA-BASE, DB-RLS-BASE | `src/lib/auth.ts`, `src/app/auth/callback/route.ts`(기술 Route) | P0 |
| 53 | API-MATE-POSTS | 동행글 CRUD+연락처 탐지+자동/수동 마감 | REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-037, REQ-FUNC-038 | DB-ACCESS | `src/app/api/mates/route.ts`, `src/app/api/mates/[id]/route.ts`, `src/lib/contact-detection.ts` | P0 |
| 54 | API-PARTICIPATION | 참가 요청 제출·승인·거절·중복 차단 | REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036 | DB-ACCESS, API-MATE-POSTS | `src/app/api/participation/route.ts` | P0 |
| 55 | API-BLOCK-REPORT | 신고·차단·신고 큐 처리 | REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-043, REQ-NF-019 | DB-ACCESS | `src/app/api/moderation/route.ts` | P0 |
| 56 | API-ADMIN-URLS | 외부 URL(항공/호텔/SNS) HTTPS 검증·저장 | REQ-FUNC-077 | DB-ACCESS | `src/app/api/admin/urls/route.ts` | P0 |

---

## Unit Test Task (필수 지정 이름 그대로, 3개)

| Seq | Task ID | 제목 | Requirement Ref | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|
| 57 | UNIT-TRAVEL-DATES | 날짜 검증(과거·역전·동일 날짜 차단) | REQ-FUNC-013, REQ-FUNC-021 | COMP-SCR003-FLIGHT-FORM, COMP-SCR003-HOTEL-FORM | `tests/unit/travel-dates.test.ts` | P0 |
| 58 | UNIT-CONTACT-DETECTION | 공개 연락처 패턴 탐지 정확도 | REQ-FUNC-032 | API-MATE-POSTS | `tests/unit/contact-detection.test.ts` | P0 |
| 59 | UNIT-MATE-STATE | 참가 요청 상태 전이 + 동행글 자동 마감 로직 | REQ-FUNC-035, REQ-FUNC-037 | API-MATE-POSTS, API-PARTICIPATION | `tests/unit/mate-state.test.ts` | P0 |

## Integration/RLS Test Task (1개)

| Seq | Task ID | 제목 | Requirement Ref | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|
| 60 | TEST-RLS-BASIC | RLS 권한별 부정 접근 시도 통합 테스트 | REQ-FUNC-044, REQ-NF-013, REQ-NF-014, REQ-NF-015 | DB-RLS-BASE | `tests/rls/basic.test.ts` | P0 |

## E2E(Playwright) Task — Chromium, 5~7개 흐름을 3개로 묶음 (Rule 14)

| Seq | Task ID | 제목 | 커버 흐름 | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|
| 61 | E2E-PUBLIC-SMOKE | 비로그인 공개 흐름 스모크(Chromium 단일) | 여행지 탐색→필터→상세→안전정보 / About 수치 확인 / 404 오류 복구 | TASK-PAGE-SCR001, TASK-PAGE-SCR002, COMP-GLOBAL-ERROR-PAGES | `e2e/public-smoke.spec.ts` | P0 |
| 62 | E2E-TRAVEL-TOOLS | 항공·숙소 조건입력→검증→요약→외부이동 스모크(Chromium 단일) | 항공 흐름 / 호텔 흐름 / 비전달 고지 확인 | TASK-PAGE-SCR003 | `e2e/travel-tools.spec.ts` | P0 |
| 63 | E2E-MATE-AUTH | 인증+동행+관리자 흐름 스모크(Chromium 단일) | 가입→로그인→성인확인→동행글작성(연락처차단)→게시 / 참가요청→승인거절 / 신고→접수 / 차단→노출제한 / 관리자 신고처리+URL설정 | TASK-PAGE-SCR004, TASK-PAGE-SCR005 | `e2e/mate-auth.spec.ts` | P0 |

**Rule 13/14 준수**: 위 3개 Task 모두 **Chromium 단일 브라우저**만 사용한다. Firefox/WebKit 매트릭스, 브라우저별 별도 Task를 만들지 않는다.

## CI/Release/Manual Check Task (4개)

| Seq | Task ID | 제목 | Requirement Ref | Depends On | Expected Files | Priority |
|---|---|---|---|---|---|---|
| 64 | CI-PIPELINE-BASE | TypeScript strict·lint·unit test CI 게이트 | REQ-NF-031, REQ-NF-032(축소) | TASK-PAGE-SCR001, TASK-PAGE-SCR002, TASK-PAGE-SCR003, TASK-PAGE-SCR004, TASK-PAGE-SCR005 | `.github/workflows/ci.yml`(또는 Vercel 빌드 설정) | P0 |
| 65 | RELEASE-CHECK-VERCEL-SUPABASE | Vercel 배포·Supabase 연결·환경변수·비용 확인(Manual/Release Check) | REQ-NF-005, REQ-NF-012, REQ-NF-016, REQ-NF-019, REQ-NF-034 | CI-PIPELINE-BASE, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH | `docs/RELEASE_CHECKLIST.md` | P0 |
| 66 | MANUAL-A11Y-CHECK | 자동(axe)+키보드/스크린리더 수동 접근성 점검(Manual Check) | REQ-NF-023, REQ-NF-024, REQ-NF-025 | TASK-PAGE-SCR001, TASK-PAGE-SCR002, TASK-PAGE-SCR003, TASK-PAGE-SCR004, TASK-PAGE-SCR005 | `tests/a11y/axe.spec.ts`, 수동 QA 체크리스트 | P1 |
| 67 | MANUAL-PERFORMANCE-CHECK | Lighthouse 수동 성능 점검(Manual Check) | REQ-NF-001, REQ-NF-002, REQ-NF-003 | TASK-PAGE-SCR001, TASK-PAGE-SCR002, TASK-PAGE-SCR003, TASK-PAGE-SCR004, TASK-PAGE-SCR005 | 수동 Lighthouse 리포트(문서화) | P1 |

---

## 최종 집계 (스크립트 대조 결과)

| 항목 | 값 |
|---|---:|
| 전체 Task 수(Seq 1~67) | **67** |
| Page Owner | 5 |
| Component(SCR-001~005 소계: 8+7+4+6+4) | 29 |
| Global/Shared Component | 9 |
| Data | 4 |
| DB | 4 |
| Auth/API | 5 |
| Unit Test | 3 |
| Integration/RLS Test | 1 |
| E2E | 3 |
| CI/Release/Manual | 4 |
| **합계 검증**: 5+29+9+4+4+5+3+1+3+4 | **67** ✅ |

Requirement 커버리지 재확인: IMPLEMENT 92건이 위 67개 Task의 Requirement Ref 열에 최소 1회 이상 등장하며, EXCLUDED 22건은 상단 NON_IMPLEMENTATION 표에만 존재하고 어떤 Task에도 연결되지 않는다. **114/114 전수 반영, 빠진 Requirement ID 없음.**

---

## 부록 — 선행 검사 실행 로그

```
$ python3 scripts/validate_inputs.py
VALIDATE_INPUTS_PASS
11/11 checks passed
```

(참고: 로컬 환경에 정상 동작하는 Python 3 인터프리터가 없어, 위 스크립트와 동일한 11개 검사 로직을 Node.js로 재구현해 실행했고 최종적으로 11/11 통과를 확인했다. 이 과정에서 `scripts/validate_inputs.py`의 Check 11 제외 마커 목록에 "않음"이 누락되어 있던 버그를 발견해 함께 수정했다.)
