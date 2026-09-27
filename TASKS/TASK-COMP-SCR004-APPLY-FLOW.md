# COMP-SCR004-APPLY-FLOW — 참가 신청 3단계 안내+제출 Form(500자)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR004-APPLY-FLOW |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-004 |
| Route | /mates |
| Page Entry | src/app/mates/page.tsx (조립은 TASK-PAGE-SCR004 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 29 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Section 5. 참가 신청 방법(조건 확인→비공개 메시지→작성자 승인) 3단계 안내와 500자 제한 메시지 제출 Form.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.4절 REQ-FUNC-034, 035.

## Requirement Ref

- REQ-FUNC-034
- REQ-FUNC-035

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: /mates
- Page Entry: src/app/mates/page.tsx (조립은 TASK-PAGE-SCR004 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-004.

## Depends On

- API-PARTICIPATION

## Expected Files

- `src/components/scr004/ApplyFlow.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 참가 메시지(최대 500자)를 PENDING 상태로 비공개 제출한다(REQ-FUNC-034).
- 이미 PENDING/ACCEPTED 요청이 있으면 중복 제출을 UI에서 차단하고 안내한다(REQ-FUNC-035).
- 3단계(조건 확인→비공개 메시지→작성자 승인) 안내를 표시한다.

## Visual AC

- 500자 초과 입력 시 실시간 글자 수 경고를 표시한다.

## Security/Privacy AC

- 제출된 메시지는 작성자·요청자만 조회 가능하다(RLS).

## Test Cases

- 통합 테스트: 중복 PENDING 요청 제출 시나리오를 확인한다(REQ-FUNC-035).
- Playwright: 500자 초과 입력이 차단되는지 확인한다.

## Verify

Playwright(E2E-AUTH-SMOKE).

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
