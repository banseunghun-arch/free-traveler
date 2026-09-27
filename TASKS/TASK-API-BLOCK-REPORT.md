# API-BLOCK-REPORT — 신고·차단·신고 큐 처리

| 항목 | 내용 |
|---|---|
| Task ID | API-BLOCK-REPORT |
| Category | api |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 55 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

신고 제출/차단·해제/Admin 신고 큐 상태 변경 API. 별도 감사 로그 테이블 없이 `reports` 레코드 필드로만 처리 이력을 남긴다.

## Project Scope

`docs/PROJECT_SCOPE.md` 3절 항목 9; 4절 관리자 범위; 6.4절 REQ-FUNC-039~043; 6.11절 REQ-NF-019.

## Requirement Ref

- REQ-FUNC-039
- REQ-FUNC-040
- REQ-FUNC-041
- REQ-FUNC-042
- REQ-FUNC-043
- REQ-NF-019

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(API Route).

## Depends On

- DB-ACCESS

## Expected Files

- `src/app/api/moderation/route.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 신고 제출 시 사유 코드+설명을 받아 접수 ID를 반환한다(REQ-FUNC-039), 응답 p95 3초 이내를 목표로 단순 insert 경로로 설계한다(REQ-NF-019).
- 차단/해제 시 상호 노출 제한 로직을 즉시 반영한다(REQ-FUNC-040, `API-MATE-POSTS`/`API-PARTICIPATION` 조회 시 차단 관계를 확인).
- Admin 전용으로 OPEN/REVIEWING/RESOLVED/DISMISSED 상태 변경을 제공한다(REQ-FUNC-041).
- 처리 사유/담당자/시각을 `reports` 레코드 필드에 직접 기록한다(REQ-FUNC-042 축소, 별도 감사 로그 테이블 없음).

## Visual AC

- 해당 없음(비-UI Task, 알림은 COMP-GLOBAL-TOAST 소관, REQ-FUNC-043).

## Security/Privacy AC

- 신고/차단은 로그인 사용자만, 상태 변경은 Admin만 가능하다(RLS).

## Test Cases

- 통합 테스트: 차단 후 상대방 게시물이 노출에서 제한되는지 확인한다.
- 통합 테스트: 비Admin의 신고 상태 변경 시도가 거부되는지 확인한다.

## Verify

E2E-AUTH-SMOKE, 통합 테스트.

## Definition of Done

- 위 AC 충족.

## Forbidden

- 별도 감사 로그(AUDIT_LOG) 테이블을 만들지 않는다(REQ-FUNC-076 EXCLUDED).
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
