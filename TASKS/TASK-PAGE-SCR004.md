# TASK-PAGE-SCR004 — SCR-004 Page Owner — 동행 찾기(`/mates`) 조립

| 항목 | 내용 |
|---|---|
| Task ID | TASK-PAGE-SCR004 |
| Category | page_owner |
| Implementation Status | IMPLEMENT |
| Screen | SCR-004 |
| Route | /mates |
| Page Entry | src/app/mates/page.tsx |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 4 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

`src/app/mates/`는 아직 존재하지 않는다. 동행글 작성 자체는 SCR-003의 동행 탭으로 이전되었으므로(`/mates/new` 폐지), 이 Route는 목록·필터·상세·참가신청·신고/차단만 담당한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 2절: "작성은 SCR-003 동행 탭으로 이동(`/mates/new` 폐지)"; 3절 항목 7·8·9.

## Requirement Ref

- REQ-FUNC-064
- REQ-FUNC-065
- REQ-FUNC-079

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: /mates
- Page Entry: src/app/mates/page.tsx

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-004(영역 순서 6개); `design-reference/D-001/DESIGN.md` §11(Mate Post Card), §12(Drawer·Modal), §14(Loading·Empty·Error 상태).

## Depends On

- COMP-SCR004-INTRO-CTA
- COMP-SCR004-FILTER-BAR
- COMP-SCR004-POST-LIST
- COMP-SCR004-POST-DETAIL
- COMP-SCR004-APPLY-FLOW
- COMP-SCR004-REPORT-BLOCK
- API-MATE-POSTS
- API-PARTICIPATION
- API-BLOCK-REPORT
- COMP-GLOBAL-HEADER-FOOTER
- COMP-GLOBAL-EMPTY-STATE-BLOCK
- COMP-GLOBAL-TOAST
- COMP-GLOBAL-DESIGN-TOKENS

## Expected Files

- `src/app/mates/page.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- Section 순서: ①Intro+글쓰기 CTA → ②Filter·결과 요약 → ③동행 목록(최대 8개) → ④상세(Desktop 좌우분할/Mobile Drawer) → ⑤신청 방법 3단계 → ⑥안전·신고·차단 안내+CTA.
- ③④는 `API-MATE-POSTS`, ⑤ 신청은 `API-PARTICIPATION`, ⑥ 신고/차단은 `API-BLOCK-REPORT`에서 데이터를 가져온다.
- 목록 결과 없음/필터 결과 없음 모두 완성형 Empty State(안내+필터 초기화+이용 방법 3단계+글쓰기 CTA)를 표시한다.

## Visual AC

- 큰 빈 영역·Placeholder 문구·빈 Card 금지.
- Mobile은 별도 Screen 미승인이라 반응형(Drawer 전환)으로만 대응한다.
- ③④ 목록·상세 데이터(`API-MATE-POSTS`) 조회 중에는 Loading 상태(Skeleton Card)를 표시한다. 조회가 끝나기 전까지 빈 화면이나 이전 필터 결과를 Empty로 오인시키지 않는다.

## Security/Privacy AC

- 연락처 정보를 응답 데이터에 포함하지 않는다(REQ-FUNC-033).
- 신청·신고·차단은 로그인 사용자만 가능(RLS로 서버 강제), 열람은 Guest도 가능하다.

## Test Cases

- Playwright: 필터 적용 후 결과가 즉시 갱신되는지 확인한다.
- Playwright: 필터 결과 없음 시 Empty State(초기화 버튼 포함)가 나타나는지 확인한다.
- Playwright: `API-MATE-POSTS` 응답 지연 시 Loading Skeleton이 먼저 나타나고, 응답 후 목록/Empty State로 전환되는지 확인한다.
- Playwright: Card 클릭 → Desktop 좌우 분할 / Mobile Drawer 전환을 확인한다.
- Playwright: 비로그인 상태로 참가 신청 시도 시 로그인 유도가 나타나는지 확인한다.
- 통합 테스트: 응답 페이로드에 연락처 필드가 없는지 확인한다.

## Verify

Playwright(E2E-MATE-AUTH), Unit(UNIT-MATE-STATE).

## Definition of Done

- 위 AC를 모두 만족한다.
- E2E-MATE-AUTH의 동행 목록/신청/신고/차단 시나리오가 통과한다.

## Forbidden

- `/mates/new` 라우트를 다시 만들지 않는다(작성은 SCR-003 소관).
- 연락처 필드를 API 응답에 포함하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
