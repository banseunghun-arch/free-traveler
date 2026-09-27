# COMP-SCR004-REPORT-BLOCK — 신고·차단 트리거+안전 안내 CTA Banner

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR004-REPORT-BLOCK |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-004 |
| Route | /mates |
| Page Entry | src/app/mates/page.tsx (조립은 TASK-PAGE-SCR004 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 30 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Section 6. 신고·차단 트리거 버튼과 안전 안내 CTA Banner("여행 조건도 함께 정리하기" → `/travel-tools`).

## Project Scope

`docs/PROJECT_SCOPE.md` 6.4절 REQ-FUNC-039, 040, 043.

## Requirement Ref

- REQ-FUNC-039
- REQ-FUNC-040
- REQ-FUNC-043

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: /mates
- Page Entry: src/app/mates/page.tsx (조립은 TASK-PAGE-SCR004 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-004, `design-reference/D-001/DESIGN.md` §13(Alert·Toast).

## Depends On

- API-BLOCK-REPORT
- COMP-GLOBAL-TOAST

## Expected Files

- `src/components/scr004/ReportBlockPanel.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 신고 제출 시 사유 코드+설명을 받고 접수 ID를 표시한다(REQ-FUNC-039).
- 차단/해제 시 상호 노출 제한 로직이 즉시 반영된다(REQ-FUNC-040).
- 처리 결과는 이메일 대신 인앱 Toast로 알린다(REQ-FUNC-043 축소).

## Visual AC

- 신고/차단 확인 다이얼로그를 표시해 실수 클릭을 방지한다.

## Security/Privacy AC

- 신고/차단은 로그인 사용자만 가능하다(RLS로 서버 강제).

## Test Cases

- Playwright: 신고 제출 후 접수 ID와 Toast가 표시되는지 확인한다.
- 통합 테스트: 차단 후 상대방 글이 노출에서 제한되는지 확인한다.

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
