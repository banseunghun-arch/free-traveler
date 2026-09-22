# DB-RLS-BASE — RLS 정책(본인/작성자/Admin만 접근)

| 항목 | 내용 |
|---|---|
| Task ID | DB-RLS-BASE |
| Category | db |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 49 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

6개 테이블에 대한 Row Level Security 정책. 본인/작성자/Admin만 비공개 데이터에 접근하도록 서버에서 강제한다.

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

해당 없음(DB 정책).

## Depends On

- DB-SCHEMA-BASE

## Expected Files

- `supabase/migrations/0002_rls.sql`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- `profiles`: 본인만 수정, 공개 필드는 전체 조회 가능.
- `mate_posts`: 작성자만 수정/삭제, 조회는 공개(로그인 불필요).
- `participation_requests`: 작성자·요청자만 조회 가능, 작성자만 상태 변경.
- `blocks`, `reports`: 본인 또는 Admin만 조회.
- `external_urls`: Admin만 수정, 조회는 서버 사이드에서만(클라이언트 직접 노출 없음).
- CSRF 방어(SameSite 쿠키, REQ-NF-014), 입력 검증/XSS 차단(REQ-NF-015)을 서버 레이어에서 함께 적용한다.

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 모든 정책은 Supabase RLS로 서버에서 강제하며 클라이언트 검증에만 의존하지 않는다.

## Test Cases

- 통합 테스트(TEST-RLS-BASIC): 권한별 부정 접근 시도가 모두 거부되는지 확인한다.

## Verify

Integration(TEST-RLS-BASIC).

## Definition of Done

- 위 AC 충족.
- TEST-RLS-BASIC 통과.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
