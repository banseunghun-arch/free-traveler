# TASK-PAGE-SCR003 — SCR-003 Page Owner — 통합 여행 준비(`/travel-tools`) 조립

| 항목 | 내용 |
|---|---|
| Task ID | TASK-PAGE-SCR003 |
| Category | page_owner |
| Implementation Status | IMPLEMENT |
| Screen | SCR-003 |
| Route | /travel-tools |
| Page Entry | src/app/travel-tools/page.tsx |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 3 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

`src/app/travel-tools/`는 아직 존재하지 않는다. 항공편/숙소/동행 구하기 3개 탭을 하나의 Route에서 실제로 조립해야 하며(Skill Rule 8), 탭 컴포넌트 자체 구현은 COMP-SCR003-* Task에 위임하되 탭 전환 상태 관리는 Page Owner가 책임진다.

## Project Scope

`docs/PROJECT_SCOPE.md` 3절 항목 5(항공·숙소 입력·검증·요약·외부 이동), 항목 7(동행글 작성); 4절 "항공·숙소 입력값은 서버·DB·URL 쿼리에 전달하지 않는다".

## Requirement Ref

- REQ-FUNC-054
- REQ-FUNC-064
- REQ-FUNC-065
- REQ-FUNC-079
- REQ-FUNC-080

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: /travel-tools
- Page Entry: src/app/travel-tools/page.tsx

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-003(영역 순서 6개, 탭 정확히 3개); `design-reference/D-001/DESIGN.md` §10(Form·Tabs), §15(Desktop·Mobile 규칙, Mobile 승인됨).

## Depends On

- COMP-SCR003-INTRO-TABS
- COMP-SCR003-FLIGHT-FORM
- COMP-SCR003-HOTEL-FORM
- COMP-SCR003-MATE-COMPOSER
- COMP-GLOBAL-HEADER-FOOTER
- COMP-GLOBAL-DESIGN-TOKENS
- AUTH-SUPABASE-EMAIL
- API-MATE-POSTS

## Expected Files

- `src/app/travel-tools/page.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- "항공편 찾기"/"숙소 찾기"/"동행 구하기" 3개 탭을 **실제로 조립**한다(탭 전환 상태 관리 포함, 각 탭의 입력·검증·완료 상태는 서로 독립).
- Section 순서: ①Intro(이용 순서 3단계) → ②탭 → ③조건 입력 Form → ④입력 요약·외부 이동 → ⑤찾기 Tip 3개 → ⑥동행 작성 또는 로그인 안내·안전 안내.
- Mobile 변형 승인됨 — Form 필드 세로 재배치, 탭은 가로 스크롤 또는 3등분.

## Visual AC

- 큰 빈 영역·Placeholder 문구 금지, 빈 Card 금지.
- 동행 탭 비로그인 상태는 완성형 안내(문장+방법+CTA)로 Empty가 아닌 Unauthorized 상태를 표시한다(REQ-FUNC-027/028).
- 동행 탭 진입 시 `AUTH-SUPABASE-EMAIL` 세션 확인 중에는 Loading 상태(짧은 스켈레톤)를 표시한 뒤, 확인이 끝나면 Unauthorized 안내 또는 작성 Form으로 전환한다(빈 화면 노출 없이).

## Security/Privacy AC

- 항공·숙소 입력값을 서버·DB·URL 쿼리 어디에도 전달/저장하지 않는다(REQ-FUNC-017, REQ-FUNC-025, REQ-NF-017) — 클라이언트 상태로만 유지한다.
- 동행 작성 제출 시 안전수칙 동의 여부와 동의 시각만 기록한다(REQ-FUNC-080).

## Test Cases

- Playwright: 탭 전환 시 다른 탭의 입력 상태가 유지되는지 확인한다.
- Playwright: 항공 탭에서 과거 날짜/역전 날짜 입력 시 제출이 차단되는지 확인한다(UNIT-TRAVEL-DATES와 연계).
- Playwright: 외부 이동 버튼이 새 탭(`noopener,noreferrer`)으로 열리고 쿼리 파라미터가 없는지 확인한다.
- Playwright: 비로그인 상태로 동행 탭 진입 시 로그인 안내가 표시되는지 확인한다.
- Playwright: 동행 탭 진입 직후 세션 확인 Loading 상태가 잠깐이라도 렌더링되고, 이후 Unauthorized 또는 작성 Form으로 정상 전환되는지 확인한다.
- 네트워크 탭 확인: 항공·숙소 폼 제출 시 서버 API 호출이 발생하지 않는지 확인한다.

## Verify

Playwright(E2E-PUBLIC-SMOKE), Unit(UNIT-TRAVEL-DATES).

## Definition of Done

- 위 AC를 모두 만족한다.
- E2E-PUBLIC-SMOKE의 E2E-003/E2E-004/E2E-005 시나리오가 통과한다.
- Depends On의 Component Task가 모두 완료되어 있다.

## Forbidden

- 항공·숙소 조건을 저장하는 API Route를 만들지 않는다.
- 실시간 항공권/호텔 가격을 표시하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
