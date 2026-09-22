# DATA-REPRESENTATIVE — free_traveler 대표 소개 정적 데이터

| 항목 | 내용 |
|---|---|
| Task ID | DATA-REPRESENTATIVE |
| Category | data |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 46 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

SCR-001 요약 블록과 SCR-002 전체 페이지가 공유하는 단일 대표 소개 데이터 소스.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.6절 REQ-FUNC-057~063.

## Requirement Ref

- REQ-FUNC-057
- REQ-FUNC-058
- REQ-FUNC-059
- REQ-FUNC-060
- REQ-FUNC-061
- REQ-FUNC-062
- REQ-FUNC-063

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(정적 데이터 스키마).

## Depends On

- 없음

## Expected Files

- `src/data/representative.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 대표명, 50+ Trips, 30+ Countries 수치(REQ-FUNC-057), 소개·철학 텍스트(REQ-FUNC-058), 방문 국가 30개국 목록(REQ-FUNC-059), Timeline 6개 이상(REQ-FUNC-060), Gallery 사진 8장 이상(REQ-FUNC-061), 문의·SNS 링크(REQ-FUNC-062, 빈 값 허용), 추천 여행지 슬러그 6개(REQ-FUNC-063)를 포함한다.

## Visual AC

- 이미지 필드는 alt 텍스트 필수(출처/작가/라이선스 필드 없음).
- Placeholder 문구를 포함하지 않는다.

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 유닛 테스트: 방문 국가 30개 이상, Timeline 6개 이상, Gallery 8장 이상인지 확인한다.
- 유닛 테스트: 추천 여행지 슬러그 6개가 모두 `DATA-DESTINATIONS`에 존재하는지 확인한다.

## Verify

DATA-VALIDATION-SCRIPT, 유닛 테스트.

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
