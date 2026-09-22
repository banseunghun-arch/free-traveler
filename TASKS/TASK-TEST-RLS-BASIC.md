# TEST-RLS-BASIC — RLS 권한별 부정 접근 시도 통합 테스트

| 항목 | 내용 |
|---|---|
| Task ID | TEST-RLS-BASIC |
| Category | integration_test |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 60 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

`DB-RLS-BASE`에서 정의한 정책이 실제로 부정 접근을 차단하는지 확인하는 통합 테스트. `DB-SEED-BASE`의 역할별(일반/작성자/Admin) 시드 계정을 사용한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.4절 REQ-FUNC-044; 6.10절 REQ-NF-013~015.

## Requirement Ref

- REQ-FUNC-044
- REQ-NF-013
- REQ-NF-014
- REQ-NF-015

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(통합 테스트).

## Depends On

- DB-RLS-BASE

## Expected Files

- `tests/rls/basic.test.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 타 사용자의 `profiles`/`mate_posts`/`participation_requests` 수정 시도가 거부되는지 확인한다.
- 비작성자의 `mate_posts` 수정/삭제, 비Admin의 `reports`/`external_urls` 쓰기 시도가 거부되는지 확인한다.
- CSRF/XSS 방어(REQ-NF-014/015) 시나리오(위조 요청, `<script>` 페이로드 입력)를 포함한다.

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 모든 부정 접근 시도가 403 또는 빈 결과로 처리되는지 확인한다(정보 노출 없음).

## Test Cases

- 테이블별 소유자 아님 사용자의 쓰기 시도 → 거부.
- Admin 전용 테이블에 대한 일반 사용자 접근 → 거부.
- XSS 페이로드 입력 → 이스케이프 처리 확인.

## Verify

통합 테스트 러너로 직접 실행.

## Definition of Done

- 모든 테스트 케이스가 통과한다.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
