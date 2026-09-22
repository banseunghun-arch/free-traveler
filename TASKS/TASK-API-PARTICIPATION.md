# API-PARTICIPATION — 참가 요청 제출·승인·거절·중복 차단

| 항목 | 내용 |
|---|---|
| Task ID | API-PARTICIPATION |
| Category | api |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 54 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

참가 요청 제출/승인/거절 API. 동일 사용자의 동일 글에 대한 중복 PENDING/ACCEPTED 요청을 DB unique 제약으로 차단한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 3절 항목 8; 6.4절 REQ-FUNC-034~036.

## Requirement Ref

- REQ-FUNC-034
- REQ-FUNC-035
- REQ-FUNC-036

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(API Route).

## Depends On

- DB-ACCESS
- API-MATE-POSTS

## Expected Files

- `src/app/api/participation/route.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 참가 메시지(500자 이하)를 PENDING 상태로 제출한다(REQ-FUNC-034).
- DB unique 제약으로 동일 사용자·동일 글의 중복 PENDING/ACCEPTED 요청을 거부한다(REQ-FUNC-035).
- 작성자 권한 검사 후에만 승인/거절 상태 전이를 허용한다(REQ-FUNC-036).

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 요청 메시지는 작성자·요청자만 조회 가능하다(RLS).
- 비작성자의 승인/거절 시도는 403으로 거부한다.

## Test Cases

- 통합 테스트: 중복 요청 제출 시나리오, 비작성자 403 시나리오를 확인한다.

## Verify

E2E-MATE-AUTH, 통합 테스트.

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
