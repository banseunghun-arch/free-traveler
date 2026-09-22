# DB-ACCESS — 타입 안전 DB 접근 레이어

| 항목 | 내용 |
|---|---|
| Task ID | DB-ACCESS |
| Category | db |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 50 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

`API-MATE-POSTS`/`API-PARTICIPATION`/`API-BLOCK-REPORT`/`API-ADMIN-URLS`가 공통으로 사용하는 타입 안전 Supabase 클라이언트 래퍼.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.10절 REQ-NF-012, 016; F2/F3 REQ-NF-017.

## Requirement Ref

- REQ-NF-012
- REQ-NF-016
- REQ-NF-017

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(DB 접근 레이어).

## Depends On

- DB-SCHEMA-BASE
- DB-RLS-BASE

## Expected Files

- `src/lib/db.ts`(NEW)
- `src/lib/supabase-client.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- Supabase 서버/클라이언트 인스턴스를 분리 생성한다(서버 전용 키는 서버에서만 사용).
- TLS 1.2 이상(Vercel/Supabase 기본 HTTPS)을 전제로 연결한다(REQ-NF-012).

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 모든 비밀키는 Vercel 환경변수로만 관리하고 클라이언트 번들에 포함하지 않는다(REQ-NF-016).
- 항공·숙소 원시 입력값을 로그·분석 이벤트에 남기지 않는다(REQ-NF-017).

## Test Cases

- 빌드 산출물 검사: 클라이언트 번들에 서버 전용 키가 포함되지 않는지 확인한다.

## Verify

빌드 산출물 검사, 코드 리뷰.

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
