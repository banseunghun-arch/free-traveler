# UNIT-MATE-STATE — 참가 요청 상태 전이 + 동행글 자동 마감 로직

| 항목 | 내용 |
|---|---|
| Task ID | UNIT-MATE-STATE |
| Category | unit_test |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 59 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

참가 요청 PENDING→ACCEPTED/REJECTED 전이 규칙과 동행글 `end_date` 경과 기반 자동 마감 계산 로직에 대한 유닛 테스트.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.4절 REQ-FUNC-035, 037.

## Requirement Ref

- REQ-FUNC-035
- REQ-FUNC-037

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(로직 테스트).

## Depends On

- API-MATE-POSTS
- API-PARTICIPATION

## Expected Files

- `tests/unit/mate-state.test.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- PENDING 상태에서만 ACCEPTED/REJECTED로 전이 가능한지 검증한다.
- `end_date` 경과 시 조회 결과가 CLOSED로 계산되는지 검증한다(경계값: 오늘=`end_date`, 어제, 내일).

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 이미 ACCEPTED/REJECTED인 요청의 재전이 시도 → 거부.
- `end_date` = 오늘 → OPEN(당일 자정까지 유효), `end_date` < 오늘 → CLOSED.

## Verify

`npm test`로 직접 실행.

## Definition of Done

- 테스트셋 전체가 통과한다.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
