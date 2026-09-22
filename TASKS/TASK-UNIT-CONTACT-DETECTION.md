# UNIT-CONTACT-DETECTION — 공개 연락처 패턴 탐지 정확도

| 항목 | 내용 |
|---|---|
| Task ID | UNIT-CONTACT-DETECTION |
| Category | unit_test |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 58 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

`src/lib/contact-detection.ts`의 전화번호·이메일·메신저ID 정규식 탐지 로직에 대한 정확도 테스트셋.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.4절 REQ-FUNC-032 — "유닛 테스트: 탐지율 기준 테스트셋".

## Requirement Ref

- REQ-FUNC-032

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(로직 테스트).

## Depends On

- API-MATE-POSTS

## Expected Files

- `tests/unit/contact-detection.test.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 전화번호(다양한 표기: 010-1234-5678, 01012345678 등) 탐지.
- 이메일 주소 탐지.
- 카카오톡ID/인스타그램 핸들 등 메신저ID 패턴 탐지.
- 정상 텍스트(연락처 아님)를 오탐하지 않는 케이스도 포함한다.

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 탐지 대상 패턴별 True Positive 케이스.
- 정상 문장 False Positive 방지 케이스.

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
