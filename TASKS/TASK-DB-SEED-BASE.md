# DB-SEED-BASE — 개발/테스트용 시드 데이터

| 항목 | 내용 |
|---|---|
| Task ID | DB-SEED-BASE |
| Category | db |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 51 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

로컬 개발과 E2E/통합 테스트 실행을 위한 최소 시드 데이터(테스트 계정, 샘플 동행글 등).

## Project Scope

해당 없음 — 개발 지원 도구(Requirement Ref 미연결).

## Requirement Ref

- 없음

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음.

## Depends On

- DB-SCHEMA-BASE

## Expected Files

- `supabase/seed.sql`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 6개 테이블 각각에 테스트 실행에 필요한 최소 샘플 행을 포함한다.
- RLS 통합 테스트(TEST-RLS-BASIC)가 요구하는 역할별(일반/작성자/Admin) 계정을 포함한다.

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 시드 계정의 비밀번호는 로컬/테스트 환경 전용이며 운영 배포에 포함하지 않는다.

## Test Cases

- 통합 테스트: 시드 적용 후 TEST-RLS-BASIC이 필요한 역할별 계정을 찾을 수 있는지 확인한다.

## Verify

통합 테스트(TEST-RLS-BASIC) 실행 전제조건.

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
