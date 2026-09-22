# UNIT-TRAVEL-DATES — 날짜 검증(과거·역전·동일 날짜 차단)

| 항목 | 내용 |
|---|---|
| Task ID | UNIT-TRAVEL-DATES |
| Category | unit_test |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 57 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

항공(REQ-FUNC-013)·숙소(REQ-FUNC-021) 폼이 공유하는 날짜 검증 로직에 대한 유닛 테스트.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.2/6.3절 — "유닛 테스트 + Playwright 경계값 확인".

## Requirement Ref

- REQ-FUNC-013
- REQ-FUNC-021

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(로직 테스트).

## Depends On

- COMP-SCR003-FLIGHT-FORM
- COMP-SCR003-HOTEL-FORM

## Expected Files

- `tests/unit/travel-dates.test.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 과거 출발일/체크인 입력을 거부하는지 검증한다.
- 역전 날짜(귀국일<출발일, 체크아웃<체크인)를 거부하는지 검증한다.
- 동일 날짜(체크인=체크아웃)를 거부하는지 검증한다(호텔 전용).

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 오늘 이전 날짜 입력 → 거부.
- 귀국일 < 출발일 → 거부.
- 체크인 = 체크아웃 → 거부(호텔).
- 유효한 미래 날짜 조합 → 통과.

## Verify

`npm test`(단위 테스트 러너)로 직접 실행.

## Definition of Done

- 모든 테스트 케이스가 통과한다.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
