# COMP-GLOBAL-TOAST — 참가/신고 처리 결과 Toast

| 항목 | 내용 |
|---|---|
| Task ID | COMP-GLOBAL-TOAST |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 38 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

이메일 발송 없이 참가 요청·신고 처리 결과를 인앱 Toast로 알리는 공용 컴포넌트(REQ-FUNC-043 축소).

## Project Scope

`docs/PROJECT_SCOPE.md` 4절 "실제 이메일 발송 없이 Toast 또는 화면 내 상태로 대체".

## Requirement Ref

- REQ-FUNC-043(축소)

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/D-001/DESIGN.md` §13(Alert·Toast).

## Depends On

- COMP-GLOBAL-DESIGN-TOKENS

## Expected Files

- `src/components/shared/Toast.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 성공/오류/정보 3가지 유형을 지원한다.
- 일정 시간 후 자동으로 사라진다.

## Visual AC

- 접근성: `role="status"` 또는 `aria-live`를 사용한다(REQ-FUNC-079와 연계).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- Playwright: 참가 승인/거절/신고 접수 시 Toast가 나타나는지 확인한다.

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
