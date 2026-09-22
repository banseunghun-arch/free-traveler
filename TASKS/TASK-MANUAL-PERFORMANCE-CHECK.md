# MANUAL-PERFORMANCE-CHECK — Lighthouse 수동 성능 점검(Manual Check)

| 항목 | 내용 |
|---|---|
| Task ID | MANUAL-PERFORMANCE-CHECK |
| Category | manual |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 67 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

정식 RUM 측정 체계 없이, 배포된 5개 Screen에 대해 수동 Lighthouse 점검으로 LCP/INP/CLS 목표를 확인한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.8절 REQ-NF-001~003(REQ-NF-004/007 EXCLUDED와 구분).

## Requirement Ref

- REQ-NF-001
- REQ-NF-002
- REQ-NF-003

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(성능 점검).

## Depends On

- TASK-PAGE-SCR001
- TASK-PAGE-SCR002
- TASK-PAGE-SCR003
- TASK-PAGE-SCR004
- TASK-PAGE-SCR005

## Expected Files

- `수동 Lighthouse 리포트(문서화, TASKS 산출물 외부)`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 5개 Screen에 대해 LCP p75 ≤2.5s(REQ-NF-001), INP p75 ≤200ms(REQ-NF-002), CLS p75 ≤0.1(REQ-NF-003) 목표 대비 결과를 기록한다.

## Visual AC

- 해당 없음(점검 리포트).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 각 Screen당 Lighthouse 실행 1회 이상, 결과를 리포트에 기록한다.

## Verify

수동 Lighthouse 실행.

## Definition of Done

- 5개 Screen 모두 리포트 기록 완료.

## Forbidden

- Lighthouse CI 자동 게이트를 구성하지 않는다(REQ-NF-007 EXCLUDED — 수동 점검으로 대체).
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
