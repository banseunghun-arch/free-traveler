# COMP-SCR004-FILTER-BAR — Filter(국가·지역·기간·모집상태)+결과 요약

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR004-FILTER-BAR |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-004 |
| Route | /mates |
| Page Entry | src/app/mates/page.tsx (조립은 TASK-PAGE-SCR004 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 26 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Section 2. 국가·지역·기간·모집 상태 필터와 "총 N개의 모집글이 있어요" 결과 요약. 차단한 사용자의 글은 결과에서 제외한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.4절 REQ-FUNC-030 — 필터 로직 + 차단 관계 조회로 제외.

## Requirement Ref

- REQ-FUNC-030

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: /mates
- Page Entry: src/app/mates/page.tsx (조립은 TASK-PAGE-SCR004 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-004.

## Depends On

- API-MATE-POSTS

## Expected Files

- `src/components/scr004/FilterBar.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 국가·지역·기간·모집 상태로 필터링한다.
- 차단한 사용자가 작성한 글을 결과에서 제외한다.
- 결과 개수를 "총 N개의 모집글이 있어요" 형태로 표시한다.

## Visual AC

- 필터 초기화 버튼을 제공한다.

## Security/Privacy AC

- 차단 목록은 로그인 사용자 본인 것만 조회한다(RLS).

## Test Cases

- Playwright: 복수 필터 조합 결과를 확인한다.
- Playwright: 차단한 사용자의 글이 결과에서 제외되는지 확인한다.

## Verify

Playwright(E2E-MATE-AUTH).

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
