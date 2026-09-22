# COMP-SCR001-ABOUT-SUMMARY — free_traveler 요약(좌우 분할)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR001-ABOUT-SUMMARY |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-001 |
| Route | / |
| Page Entry | src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관) |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 13 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

홈 Section 7. `DATA-REPRESENTATIVE`를 재사용해 SCR-002 상세 페이지로 연결되는 좌우 분할 요약 블록을 렌더링한다.

## Project Scope

해당 없음 — UI_CONTRACT.md §SCR-001 디자인 규정. 표시 수치(50+ Trips/30+ Countries)는 REQ-FUNC-057 데이터 소스를 그대로 재사용한다.

## Requirement Ref

- 없음

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: /
- Page Entry: src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-001; `design-reference/D-001/DESIGN.md` §9(Destination Card).

## Depends On

- DATA-REPRESENTATIVE

## Expected Files

- `src/components/scr001/AboutSummaryBlock.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 50+ Trips/30+ Countries 수치와 소개 요약 문구를 표시한다.
- "대표 이야기 더 보기" CTA는 `/about`으로 이동한다.

## Visual AC

- SCR-002와 수치가 완전히 일치해야 한다(단일 데이터 소스 재사용으로 보증).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- Playwright: 홈의 수치가 `/about` 페이지 수치와 동일한지 확인한다.

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
