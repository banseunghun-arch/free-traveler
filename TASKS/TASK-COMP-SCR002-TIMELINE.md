# COMP-SCR002-TIMELINE — 여행 Timeline 6개 이상

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR002-TIMELINE |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-002 |
| Route | /about |
| Page Entry | src/app/about/page.tsx (조립은 TASK-PAGE-SCR002 소관) |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 17 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

About Section 4. 연도·장소·요약으로 구성된 여행 Timeline을 세로/스택형으로 표시한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.6절 REQ-FUNC-060.

## Requirement Ref

- REQ-FUNC-060

## Screen / Route / Page Entry

- Screen: SCR-002
- Route: /about
- Page Entry: src/app/about/page.tsx (조립은 TASK-PAGE-SCR002 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-002.

## Depends On

- DATA-REPRESENTATIVE

## Expected Files

- `src/components/scr002/Timeline.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- Timeline 항목을 6개 이상 표시한다(연도·장소·요약).

## Visual AC

- 항목이 시간순으로 정렬되어 있다(번호/순서 표시는 실제 시간 순서를 반영할 때만 사용).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- Playwright: Timeline 항목 수가 6개 이상인지 확인한다.

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
