# API-MATE-POSTS — 동행글 CRUD+연락처 탐지+자동/수동 마감

| 항목 | 내용 |
|---|---|
| Task ID | API-MATE-POSTS |
| Category | api |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 53 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

동행글 작성/조회/수정/마감/삭제 API. 제출 시점에 공개 연락처 패턴을 탐지해 차단하고, 조회 시점에 `end_date` 경과를 계산해 마감 상태를 표시한다(배치 없음).

## Project Scope

`docs/PROJECT_SCOPE.md` 3절 항목 7; 4절 "동행글 자동 마감: 배치 없이 조회 시점에 계산".

## Requirement Ref

- REQ-FUNC-031
- REQ-FUNC-032
- REQ-FUNC-037
- REQ-FUNC-038

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(API Route).

## Depends On

- DB-ACCESS

## Expected Files

- `src/app/api/mates/route.ts`(NEW)
- `src/app/api/mates/[id]/route.ts`(NEW)
- `src/lib/contact-detection.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 작성 시 필수 필드·날짜 역전·과거 종료일을 서버에서도 검증한다(REQ-FUNC-031).
- 설명 텍스트에서 전화번호·이메일·메신저ID 패턴을 정규식으로 탐지해 서버에서도 제출을 차단한다(REQ-FUNC-032, 클라이언트 우회 방지).
- GET 응답에서 `end_date` 경과 여부를 계산해 CLOSED 상태를 포함한다(REQ-FUNC-037, 별도 배치 작업 없음).
- 작성자 전용 수동 마감/수정/삭제를 제공하며 승인된 참가 요청이 있으면 경고 응답을 포함한다(REQ-FUNC-038).

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 모든 쓰기 작업은 인증 세션과 RLS로 검증한다.
- 연락처 패턴 탐지는 클라이언트뿐 아니라 서버에서도 재검증한다.

## Test Cases

- 유닛 테스트(UNIT-CONTACT-DETECTION): 다양한 연락처 패턴 탐지율을 테스트셋으로 검증한다.
- 유닛 테스트(UNIT-MATE-STATE): `end_date` 경계값 계산을 검증한다.
- 통합 테스트: 비작성자의 수정/삭제 시도가 403으로 거부되는지 확인한다.

## Verify

Unit(UNIT-CONTACT-DETECTION, UNIT-MATE-STATE), E2E-AUTH-SMOKE.

## Definition of Done

- 위 AC 충족.

## Forbidden

- 마감을 위한 별도 배치/Cron Job을 만들지 않는다(조회 시점 계산으로 대체).
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
