# E2E-TRAVEL-TOOLS — 항공·숙소 조건입력→검증→요약→외부이동 스모크(Chromium 단일)

| 항목 | 내용 |
|---|---|
| Task ID | E2E-TRAVEL-TOOLS |
| Category | e2e |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 62 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

PROJECT_SCOPE.md 7절 시나리오 2·3(항공/호텔 흐름)을 Chromium 단일 브라우저로 검증한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 7절 #2, #3.

## Requirement Ref

- 없음

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-003.

## Depends On

- TASK-PAGE-SCR003

## Expected Files

- `e2e/travel-tools.spec.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 항공 조건 입력 → 검증 오류 → 유효 입력 → 요약 → 외부 새 탭 이동(#2).
- 호텔 조건 입력 → 검증 오류 → 유효 입력 → 요약 → 외부 새 탭 이동(#3).
- 비전달 고지 문구 노출을 확인한다.
- **Chromium 단일 브라우저**로만 실행한다.

## Visual AC

- 해당 없음(테스트 코드).

## Security/Privacy AC

- 네트워크 요청 검사로 입력값이 서버로 전송되지 않는지 확인한다.

## Test Cases

- 위 Functional AC의 각 시나리오를 순차 `test()` 블록으로 구현한다.

## Verify

`npx playwright test --project=chromium e2e/travel-tools.spec.ts`.

## Definition of Done

- 모든 시나리오가 통과한다.

## Forbidden

- 다른 브라우저 프로젝트를 추가하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
