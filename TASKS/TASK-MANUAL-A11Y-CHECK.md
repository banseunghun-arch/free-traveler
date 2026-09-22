# MANUAL-A11Y-CHECK — 자동(axe)+키보드/스크린리더 수동 접근성 점검(Manual Check)

| 항목 | 내용 |
|---|---|
| Task ID | MANUAL-A11Y-CHECK |
| Category | manual |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 66 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

5개 Screen에 대한 자동(axe-core) 접근성 스캔과, `docs/02_SRS_BASELINE.md` 3.6절 UC-01~09 기반 키보드/스크린리더 수동 점검.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.12절 REQ-NF-023~025.

## Requirement Ref

- REQ-NF-023
- REQ-NF-024
- REQ-NF-025

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/D-001/DESIGN.md` 접근성 관련 Do/Do Not(§21).

## Depends On

- TASK-PAGE-SCR001
- TASK-PAGE-SCR002
- TASK-PAGE-SCR003
- TASK-PAGE-SCR004
- TASK-PAGE-SCR005

## Expected Files

- `tests/a11y/axe.spec.ts`(NEW)
- `수동 QA 체크리스트(docs 또는 TASKS 산출물 외부 문서)`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- Playwright + axe-core로 5개 Screen을 스캔해 critical/serious 위반 0건을 목표로 한다(REQ-NF-024).
- UC-01~09에 대한 키보드 전용 내비게이션과 스크린리더 수동 점검을 수행한다(REQ-NF-025).

## Visual AC

- 해당 없음(테스트/체크리스트).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- axe 스캔 결과에 critical 위반이 없는지 확인한다.
- 키보드만으로 각 Screen의 핵심 흐름을 완료할 수 있는지 확인한다.

## Verify

axe 자동 스캔 + 수동 QA 체크리스트.

## Definition of Done

- axe 위반 0건.
- 수동 체크리스트 전 항목 확인.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
