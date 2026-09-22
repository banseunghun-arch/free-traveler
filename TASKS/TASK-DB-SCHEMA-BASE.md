# DB-SCHEMA-BASE — 6개 테이블 스키마 마이그레이션

| 항목 | 내용 |
|---|---|
| Task ID | DB-SCHEMA-BASE |
| Category | db |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 48 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Supabase Postgres 스키마 마이그레이션. Skill Rule 10에 따라 정확히 6개 테이블만 만든다(초과 금지).

## Project Scope

`docs/PROJECT_SCOPE.md` 3절 항목 6~10(동행 프로필, 동행글, 참가 요청, 차단, 신고, 외부 URL).

## Requirement Ref

- REQ-FUNC-029
- REQ-FUNC-031
- REQ-FUNC-034
- REQ-FUNC-039
- REQ-FUNC-041
- REQ-FUNC-077

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(DB 스키마).

## Depends On

- 없음

## Expected Files

- `supabase/migrations/0001_schema.sql`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- `profiles`(닉네임, 연령대, 성별, 스타일, 소개, `is_adult`, `adult_verified_at`)를 정확히 이 6개 테이블로만 만든다: `profiles`, `mate_posts`, `participation_requests`, `blocks`, `reports`, `external_urls`.
- `mate_posts`(제목, 국가, 지역, 시작일, 종료일, 모집 인원, 설명, 상태, 작성자).
- `participation_requests`(동행글 ID, 요청자 ID, 메시지 500자, 상태 PENDING/ACCEPTED/REJECTED, 동일 사용자·동일 글 중복 PENDING/ACCEPTED 방지 unique 제약).
- `blocks`(차단한 사용자 ID, 차단된 사용자 ID).
- `reports`(대상 유형/ID, 신고자 ID, 사유, 상태 OPEN/REVIEWING/RESOLVED/DISMISSED, 처리 사유/담당자/시각 필드).
- `external_urls`(키 flight/hotel/sns, URL, 수정자, 수정 시각).

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 모든 테이블에 적절한 외래키·제약조건을 설정한다.

## Test Cases

- 통합 테스트: 마이그레이션 적용 후 6개 테이블과 제약조건이 정확히 존재하는지 확인한다.

## Verify

통합 테스트, 코드 리뷰(테이블 수 확인).

## Definition of Done

- 위 AC 충족.
- 테이블 수가 정확히 6개다.

## Forbidden

- 즐겨찾기·감사로그 등 7번째 테이블을 추가하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
