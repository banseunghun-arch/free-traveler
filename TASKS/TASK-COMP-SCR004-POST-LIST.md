# COMP-SCR004-POST-LIST — 동행글 목록(최대 8개, 상태 배지)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR004-POST-LIST |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-004 |
| Route | /mates |
| Page Entry | src/app/mates/page.tsx (조립은 TASK-PAGE-SCR004 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 27 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Section 3. 동행글 목록을 최대 8개 우선 노출하고 "더 보기" 페이지네이션을 제공한다. 상태 배지(모집중/마감)는 `end_date` 경과 여부를 조회 시점에 계산해 표시한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.4절 REQ-FUNC-037 — 배치 없이 조회 시 end_date 경과 여부 계산.

## Requirement Ref

- REQ-FUNC-037

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: /mates
- Page Entry: src/app/mates/page.tsx (조립은 TASK-PAGE-SCR004 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-004, `design-reference/D-001/DESIGN.md` §11(Mate Post Card).

## Depends On

- API-MATE-POSTS

## Expected Files

- `src/components/scr004/PostList.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 최대 8개 우선 노출 + "더 보기" 페이지네이션을 제공한다.
- `end_date` 경과 시 자동으로 마감 배지를 표시한다(별도 배치 없음).

## Visual AC

- 목록 Loading 시 Skeleton을 표시한다.

## Security/Privacy AC

- 해당 없음(공개 목록, Guest도 열람 가능).

## Test Cases

- 유닛 테스트(UNIT-MATE-STATE): end_date 경과 글이 마감으로 표시되는지 확인한다.
- Playwright: 8개 초과 시 "더 보기"로 추가 로드되는지 확인한다.

## Verify

Playwright(E2E-AUTH-SMOKE), Unit(UNIT-MATE-STATE).

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
