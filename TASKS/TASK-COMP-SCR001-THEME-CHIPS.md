# COMP-SCR001-THEME-CHIPS — 여행 동기·테마 Chip 6개

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR001-THEME-CHIPS |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-001 |
| Route | / |
| Page Entry | src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관) |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 10 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

홈 Section 4. Requirement에 직접 매핑되지 않는 디자인 규정(UI_CONTRACT.md §SCR-001)에 따른 테마 Chip 목록으로, 클릭 시 여행지 결과 Section을 테마 기준으로 필터링한다.

## Project Scope

해당 없음 — `design-reference/UI_CONTRACT.md` §SCR-001 디자인 규정에서 파생된 Component (Requirement Ref 미연결).

## Requirement Ref

- 없음

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: /
- Page Entry: src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-001; `design-reference/D-001/DESIGN.md` §9(Destination Card).

## Depends On

- COMP-GLOBAL-DESIGN-TOKENS

## Expected Files

- `src/components/scr001/ThemeChips.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 테마 Chip을 6개 표시한다.
- Chip 클릭 시 국내/해외 여행지 결과 Section을 해당 테마로 필터링한다.

## Visual AC

- 빈 Chip을 만들지 않는다(모두 실제 테마명).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- Playwright: 테마 Chip 클릭 시 여행지 결과가 필터링되는지 확인한다.

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
