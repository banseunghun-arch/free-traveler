# TASK-PAGE-SCR001 — SCR-001 Page Owner — 메인 홈(`/`) 조립

| 항목 | 내용 |
|---|---|
| Task ID | TASK-PAGE-SCR001 |
| Category | page_owner |
| Implementation Status | IMPLEMENT |
| Screen | SCR-001 |
| Route | / |
| Page Entry | src/app/page.tsx |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 1 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

현재 `src/app/page.tsx`는 create-next-app 기본 스타터(Next.js 로고, "To get started, edit the page.tsx file.", "Deploy Now"/"Documentation" 링크) 그대로다. 이 Task는 그 파일을 SCR-001(메인 홈) 최종 콘텐츠로 완전히 교체하는 Route 조립 작업이며, 하위 Component 자체의 구현은 각 COMP-SCR001-* Task의 범위다. Page Owner는 Section 배치·데이터 바인딩·상태 분기만 담당한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 2절: 여행지 검색·필터·상세와 안전정보를 홈(SCR-001)의 목록과 Drawer/Modal로 통합한다(`/destinations/*`, `/safety/*` 별도 라우트 폐지). 3절 항목 1·2·3.

## Requirement Ref

- REQ-FUNC-001
- REQ-FUNC-002
- REQ-FUNC-003
- REQ-FUNC-004
- REQ-FUNC-005
- REQ-FUNC-006
- REQ-FUNC-007(축소)
- REQ-FUNC-009
- REQ-FUNC-064
- REQ-FUNC-065
- REQ-FUNC-067
- REQ-FUNC-068
- REQ-FUNC-079

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: /
- Page Entry: src/app/page.tsx

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-001(영역 순서 7개, 주요 Component, 상태, 이동); `design-reference/D-001/DESIGN.md` §17(Hero 높이 규칙), §19(Section 순서·최소 콘텐츠 수), §20(완성형 Empty State·Placeholder 금지 규칙).

## Depends On

- COMP-SCR001-SEARCH-HERO
- COMP-SCR001-DOMESTIC-GRID
- COMP-SCR001-INTL-GRID
- COMP-SCR001-THEME-CHIPS
- COMP-SCR001-SAFETY-GRID
- COMP-SCR001-DEST-DETAIL-DRAWER
- COMP-SCR001-MATE-PREVIEW
- COMP-SCR001-ABOUT-SUMMARY
- COMP-GLOBAL-HEADER-FOOTER
- COMP-GLOBAL-EMPTY-STATE-BLOCK
- COMP-GLOBAL-FAVORITES
- COMP-GLOBAL-DESIGN-TOKENS
- DATA-DESTINATIONS
- DATA-SAFETY

## Expected Files

- `src/app/page.tsx`(MODIFY — 현재 create-next-app 기본 스타터)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- create-next-app 기본 스타터(Next.js 로고, "To get started, edit the page.tsx file.", "Deploy Now"/"Documentation" 링크)를 완전히 제거한다.
- Section을 정확히 다음 순서로 조립한다: ①검색 Hero → ②국내 여행지 6개 → ③해외 여행지 6개 → ④여행 동기 6개 → ⑤국가별 주의사항 6개 → ⑥최근 동행글 3개 또는 완성형 Empty State → ⑦free_traveler 소개.
- ②③은 `DATA-DESTINATIONS`, ⑤는 `DATA-SAFETY`, ⑥은 `API-MATE-POSTS`(모집중 글, 없으면 Empty), ⑦은 `DATA-REPRESENTATIVE`에서 데이터를 가져온다.
- 최소 콘텐츠 수: 국내 Card 6개, 해외 Card 6개, 테마 Chip 6개, 국가 Card 6개, 최근 동행글 3개(있을 때).
- 반응형 콘텐츠 밀도: Desktop Card Grid 3×2, Mobile 1열 가로 스크롤(행 줄바꿈 없이 컬럼만 축소).
- 검색어·필터 제출은 같은 화면 내 결과 필터링/스크롤로 처리하고 별도 라우트로 이동하지 않는다.

## Visual AC

- Hero는 Desktop 520~600px로 제한해 다음 Section 시작부가 화면에 보인다.
- 큰 빈 영역(과도한 여백)을 만들지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 문구를 포함하지 않는다.
- 내용 없는 빈 Card를 만들지 않는다.
- Section 6이 데이터 없음 상태일 때 완성형 Empty State(안내 문장 + 이용 방법 3단계 + 글쓰기 CTA)를 표시한다(빈 화면처럼 보이지 않게).
- Section 6의 `API-MATE-POSTS` 조회 중에는 Loading 상태(Skeleton Card 3개)를 표시한다. 조회 완료 전까지 빈 화면이나 레이아웃 흔들림(CLS) 없이, 완료 후 Empty State 또는 실제 카드로 전환한다.

## Security/Privacy AC

- 즐겨찾기 토글은 `localStorage`만 사용하고 서버로 전송하지 않는다(비로그인 이용 가능, REQ-FUNC-068).
- 비로그인 상태에서 동행글 쓰기 CTA 클릭 시 `/account`로 안내하며, 인증 없이 쓰기 API를 호출하지 않는다.

## Test Cases

- Playwright: 첫 진입 시 Section 1~7이 순서대로 렌더링되는지 확인한다.
- Playwright: 국내/해외 Card를 6개씩 렌더링하는지, 부족 시 실패하는지 확인한다.
- Playwright: 최근 동행글 0건일 때 Empty State(안내+3단계+CTA)가 나타나는지 확인한다.
- Playwright: `API-MATE-POSTS` 응답 지연 시 Loading Skeleton이 먼저 나타나고, 응답 후 Empty State 또는 카드로 전환되는지 확인한다.
- Playwright: 즐겨찾기 하트 클릭 후 새로고침해도 `localStorage`에서 상태가 유지되는지 확인한다.
- Playwright: 국가 Card 클릭 → 안전정보 Drawer 전환 확인.

## Verify

Playwright(E2E-PUBLIC-SMOKE), 수동 브라우저 확인(RELEASE-CHECK-VERCEL-SUPABASE).

## Definition of Done

- 위 Functional/Visual/Security AC를 모두 만족한다.
- E2E-PUBLIC-SMOKE의 관련 시나리오가 통과한다.
- Depends On의 모든 Component/Data Task가 먼저 완료되어 있다.

## Forbidden

- 별도 라우트(`/destinations/*`, `/safety/*`)를 새로 만들지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
