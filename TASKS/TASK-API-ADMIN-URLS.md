# API-ADMIN-URLS — 외부 URL(항공/호텔/SNS) HTTPS 검증·저장

| 항목 | 내용 |
|---|---|
| Task ID | API-ADMIN-URLS |
| Category | api |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 56 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Admin이 설정하는 항공/호텔/SNS 외부 URL을 HTTPS만 허용해 검증·저장하는 API. `COMP-SCR003-FLIGHT-FORM`/`HOTEL-FORM`의 외부 이동 링크가 이 값을 사용한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 4절 관리자 범위; 6.7절 REQ-FUNC-077; 8절 "외부 URL은 Vercel 환경변수 또는 Admin 설정으로 관리".

## Requirement Ref

- REQ-FUNC-077

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(API Route).

## Depends On

- DB-ACCESS

## Expected Files

- `src/app/api/admin/urls/route.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 저장 요청의 URL이 `https://`로 시작하지 않으면 거부한다(REQ-FUNC-077).
- key(`flight`/`hotel`/`sns`)별로 URL을 저장하고 수정자·수정 시각을 기록한다.

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- Admin 역할만 쓰기 가능하다(RLS+서버 역할 검사).

## Test Cases

- 통합 테스트: `http://` URL 저장 시도가 거부되는지 확인한다.
- Playwright: Admin이 아닌 사용자의 API 호출이 거부되는지 확인한다.

## Verify

E2E-AUTH-SMOKE, 통합 테스트.

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
