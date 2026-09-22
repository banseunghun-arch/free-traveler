# COMP-SCR001-INTL-GRID — 해외 인기 여행지 Card Grid 6개

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR001-INTL-GRID |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-001 |
| Route | / |
| Page Entry | src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 8 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

홈 Section 3. `DATA-DESTINATIONS`의 `scope=international` 항목을 표시한다. `COMP-SCR001-DOMESTIC-GRID`와 동일 컴포넌트를 variant prop으로 재사용한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.1절 REQ-FUNC-001, REQ-FUNC-007.

## Requirement Ref

- REQ-FUNC-001
- REQ-FUNC-007(축소)

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: /
- Page Entry: src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-001; `design-reference/D-001/DESIGN.md` §9(Destination Card).

## Depends On

- DATA-DESTINATIONS
- COMP-GLOBAL-FAVORITES

## Expected Files

- `src/components/scr001/DestinationGrid.tsx (variant=international)`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- `scope=international` 데이터 중 6개를 Card Grid로 표시한다.
- 각 Card는 `countryCode`를 보유해 안전정보 Drawer 연결에 사용된다(REQ-FUNC-006).
- Card 클릭 시 `COMP-SCR001-DEST-DETAIL-DRAWER`를 연다.

## Visual AC

- Desktop 3×2 Grid, Mobile 1열 가로 스크롤.
- 이미지 alt 텍스트 필수.

## Security/Privacy AC

- 해당 없음(읽기 전용 정적 데이터).

## Test Cases

- Playwright: 해외 Card가 정확히 6개 렌더링되는지 확인한다.

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
