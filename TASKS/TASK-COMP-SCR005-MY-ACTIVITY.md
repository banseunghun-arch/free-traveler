# COMP-SCR005-MY-ACTIVITY — Member: 내 글/참가요청/즐겨찾기/차단목록/작성CTA

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR005-MY-ACTIVITY |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-005 |
| Route | /account |
| Page Entry | src/app/account/page.tsx (조립은 TASK-PAGE-SCR005 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 33 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Member 역할 전용 블록. 내 글(수정·마감·삭제), 참가 요청(보낸/받은, 승인/거절), 즐겨찾기, 차단 목록(해제), 새 동행글 작성 CTA를 모두 포함한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.4절 REQ-FUNC-036, 038, 040; 6.7절 REQ-FUNC-068.

## Requirement Ref

- REQ-FUNC-036
- REQ-FUNC-038
- REQ-FUNC-040
- REQ-FUNC-068

## Screen / Route / Page Entry

- Screen: SCR-005
- Route: /account
- Page Entry: src/app/account/page.tsx (조립은 TASK-PAGE-SCR005 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-005, `design-reference/D-001/DESIGN.md` §14(Loading·Empty·Error 상태).

## Depends On

- API-MATE-POSTS
- API-PARTICIPATION
- COMP-GLOBAL-FAVORITES

## Expected Files

- `src/components/scr005/MyActivity.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 내 글 목록에서 수정·마감·삭제를 제공한다(작성자 전용, 승인 요청자 존재 시 경고 표시, REQ-FUNC-038).
- 보낸/받은 참가 요청을 목록으로 표시하고 작성자는 승인/거절을 수행한다(REQ-FUNC-036).
- 즐겨찾기 목록을 `localStorage`에서 조회한다(REQ-FUNC-068, `COMP-GLOBAL-FAVORITES` 재사용).
- 차단 목록과 해제 버튼을 제공한다(REQ-FUNC-040).
- 각 목록이 0건일 때 완성형 Empty State("아직 쓴 글이 없어요" 등 + CTA)를 표시한다.

## Visual AC

- 목록별 Empty State는 서로 다른 CTA를 갖는다(내 글→작성, 참가요청→동행 찾기 등).

## Security/Privacy AC

- 모든 목록은 본인 소유 데이터만 조회한다(RLS).

## Test Cases

- Playwright: 내 글 수정/마감/삭제 흐름을 확인한다.
- Playwright: 참가 요청 승인/거절 후 상태가 반영되는지 확인한다.
- Playwright: 즐겨찾기 0건일 때 Empty State를 확인한다.

## Verify

Playwright(E2E-AUTH-SMOKE), Integration(TEST-RLS-BASIC).

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
