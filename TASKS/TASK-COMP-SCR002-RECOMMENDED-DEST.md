# COMP-SCR002-RECOMMENDED-DEST — 추천 여행지 4개+CTA

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR002-RECOMMENDED-DEST |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-002 |
| Route | /about |
| Page Entry | src/app/about/page.tsx (조립은 TASK-PAGE-SCR002 소관) |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 20 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

About Section 7. 정적 데이터에 지정된 추천 여행지 슬러그 6개 중 공개 여행지만 연결해 Card 4개로 표시하고, CTA Banner를 붙인다. 문의·SNS 링크(REQ-FUNC-062)도 이 블록에서 조건부로 노출한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.6절 REQ-FUNC-062(축소), REQ-FUNC-063.

## Requirement Ref

- REQ-FUNC-062(축소)
- REQ-FUNC-063

## Screen / Route / Page Entry

- Screen: SCR-002
- Route: /about
- Page Entry: src/app/about/page.tsx (조립은 TASK-PAGE-SCR002 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-002.

## Depends On

- DATA-REPRESENTATIVE
- DATA-DESTINATIONS

## Expected Files

- `src/components/scr002/RecommendedDestinations.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 추천 여행지 Card 4개 + CTA Banner를 표시한다.
- 문의·SNS 링크는 값이 있을 때만 렌더링하고 빈 값은 숨긴다(REQ-FUNC-062).
- 추천 슬러그는 공개된 여행지만 연결한다(REQ-FUNC-063).

## Visual AC

- 빈 링크 자리(placeholder)를 남기지 않는다.

## Security/Privacy AC

- 해당 없음.

## Test Cases

- Playwright: 추천 링크 4개가 모두 유효한 여행지로 연결되는지 확인한다.
- Playwright: SNS 링크가 빈 값일 때 렌더링되지 않는지 확인한다.

## Verify

Playwright(E2E-PUBLIC-SMOKE).

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
