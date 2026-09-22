# COMP-SCR002-VISITED-COUNTRIES — 방문 국가 30개국 Chip(권역별)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR002-VISITED-COUNTRIES |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-002 |
| Route | /about |
| Page Entry | src/app/about/page.tsx (조립은 TASK-PAGE-SCR002 소관) |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 18 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

About Section 5. 방문 30개국 이상을 권역별로 그룹핑한 Chip 목록으로 표시한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.6절 REQ-FUNC-059 — 국가 수 ≥30 데이터 검증.

## Requirement Ref

- REQ-FUNC-059

## Screen / Route / Page Entry

- Screen: SCR-002
- Route: /about
- Page Entry: src/app/about/page.tsx (조립은 TASK-PAGE-SCR002 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-002.

## Depends On

- DATA-REPRESENTATIVE

## Expected Files

- `src/components/scr002/VisitedCountries.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 국가 Chip을 권역별로 그룹핑해 30개 이상 표시한다.
- Chip 클릭 시 해당 국가의 안전정보/여행지로 연결한다(가능한 경우).

## Visual AC

- 그룹 라벨(권역명)이 명확히 구분된다.

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 데이터 검증: 국가 수가 30개 이상인지 확인한다.
- Playwright: 국가 Chip 클릭 시 연결이 동작하는지 확인한다.

## Verify

Playwright(E2E-PUBLIC-SMOKE), 데이터 검증(DATA-VALIDATION-SCRIPT).

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
