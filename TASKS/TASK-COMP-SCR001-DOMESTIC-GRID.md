# COMP-SCR001-DOMESTIC-GRID — 국내 인기 여행지 Card Grid 6개

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR001-DOMESTIC-GRID |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-001 |
| Route | / |
| Page Entry | src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 7 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

홈 Section 2. `DATA-DESTINATIONS`의 `scope=domestic` 항목을 Card Grid로 표시하고, 각 Card에 즐겨찾기 토글을 제공한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.1절 REQ-FUNC-001(국내·해외 목록 구분), REQ-FUNC-005(결과 없음 안내), REQ-FUNC-007(alt 텍스트만 관리).

## Requirement Ref

- REQ-FUNC-001
- REQ-FUNC-005
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

- `src/components/scr001/DestinationGrid.tsx (variant=domestic)`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- `scope=domestic` 데이터 중 6개를 Card Grid로 표시한다.
- Card 클릭 시 `COMP-SCR001-DEST-DETAIL-DRAWER`를 연다.
- 하트 아이콘 클릭 시 `COMP-GLOBAL-FAVORITES`를 통해 `localStorage`에 추가/해제한다.
- 필터 적용 결과가 0건이면 안내 문구 + 필터 초기화 버튼을 표시한다(REQ-FUNC-005).

## Visual AC

- Desktop 3×2 Grid, Mobile 1열 가로 스크롤.
- 이미지는 실제 장소를 설명하는 alt 텍스트를 갖는다(REQ-FUNC-007 축소 — 출처/작가/라이선스 필드는 두지 않음).
- 내용 없는 빈 Card를 만들지 않는다.

## Security/Privacy AC

- 해당 없음(읽기 전용 정적 데이터).

## Test Cases

- Playwright: 국내 Card가 정확히 6개 렌더링되는지 확인한다.
- Playwright: 즐겨찾기 토글 후 새로고침해도 상태가 유지되는지 확인한다.

## Verify

Playwright(E2E-PUBLIC-SMOKE).

## Definition of Done

- 위 AC 충족.

## Forbidden

- 별점·가격 정보를 Card에 표시하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
