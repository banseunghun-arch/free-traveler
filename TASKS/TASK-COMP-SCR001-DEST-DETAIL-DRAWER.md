# COMP-SCR001-DEST-DETAIL-DRAWER — 여행지 상세 Drawer/Modal(추천 6개 포함)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR001-DEST-DETAIL-DRAWER |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-001 |
| Route | / |
| Page Entry | src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 9 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

여행지 Card 클릭 시 열리는 상세 패널. overview/highlights/itinerary 등 필수 콘텐츠 항목(REQ-FUNC-004)을 표시하고, 해외 여행지는 안전정보 Drawer로 전환하는 진입점(REQ-FUNC-006)을 제공한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.1절 REQ-FUNC-004, 006, 009.

## Requirement Ref

- REQ-FUNC-004
- REQ-FUNC-006
- REQ-FUNC-009

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: /
- Page Entry: src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-001; `design-reference/D-001/DESIGN.md` §9(Destination Card), §12(Drawer·Modal).

## Depends On

- DATA-DESTINATIONS
- DATA-SAFETY

## Expected Files

- `src/components/scr001/DestinationDrawer.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 정적 데이터 스키마의 필수 항목(overview, highlights, itinerary 등)을 모두 표시한다.
- 해외 여행지는 "안전정보 보기" 진입점을 제공해 같은 Drawer 안에서 안전정보 Drawer(`COMP-SCR001-SAFETY-GRID`의 상세 뷰)로 전환한다(별도 라우트 없음).
- 동일 국가·테마 기준 관련 여행지 추천을 최대 6개 하단에 표시한다(REQ-FUNC-009).

## Visual AC

- Desktop은 Drawer(측면 패널) 또는 Modal, Mobile은 전체화면 Drawer.
- 추천 영역이 0건이면 섹션 자체를 숨기고 빈 영역을 남기지 않는다.

## Security/Privacy AC

- 해당 없음(읽기 전용 정적 데이터).

## Test Cases

- Playwright: 상세 Drawer의 필수 항목이 모두 렌더링되는지 확인한다.
- Playwright: 해외 여행지 상세→안전정보 Drawer 전환을 확인한다.
- Playwright: 추천 영역에 최대 6개까지만 표시되는지 확인한다.

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
