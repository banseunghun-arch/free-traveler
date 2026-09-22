# COMP-SCR001-MATE-PREVIEW — 최근 동행글 3개 또는 완성형 Empty State

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR001-MATE-PREVIEW |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-001 |
| Route | / |
| Page Entry | src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관) |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 12 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

홈 Section 6. `API-MATE-POSTS`에서 모집중 동행글 최신 3개를 가져와 미리보기로 표시하고, 없으면 완성형 Empty State를 표시한다.

## Project Scope

해당 없음 — UI_CONTRACT.md §SCR-001 디자인 규정(Requirement Ref 미연결, API-MATE-POSTS의 REQ-FUNC-037/038이 데이터 신선도를 보장).

## Requirement Ref

- 없음

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: /
- Page Entry: src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-001; `design-reference/D-001/DESIGN.md` §9(Destination Card), `design-reference/D-001/DESIGN.md` §20(완성형 Empty State 규칙).

## Depends On

- API-MATE-POSTS
- COMP-GLOBAL-EMPTY-STATE-BLOCK

## Expected Files

- `src/components/scr001/RecentMatePreview.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 모집중 동행글 최신 3개를 표시한다.
- "동행 더 보기" 클릭 시 `/mates`로 이동한다.
- 0건일 때 안내 문장 + 이용 방법 3단계 + 글쓰기 CTA를 표시한다.

## Visual AC

- 빈 화면처럼 보이지 않게 완성형 Empty State를 사용한다(`Lorem ipsum`/"준비 중"/"정보 확인 필요" 금지).

## Security/Privacy AC

- 비공개 참가 메시지·연락처를 미리보기에 노출하지 않는다.

## Test Cases

- Playwright: 동행글 0건일 때 Empty State가 나타나는지 확인한다.
- Playwright: 3개 초과 시에도 정확히 3개만 표시되는지 확인한다.

## Verify

Playwright(E2E-PUBLIC-SMOKE).

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
