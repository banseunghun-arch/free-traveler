# COMP-SCR001-SEARCH-HERO — 검색 Hero(검색창+계절·기간 Filter)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR001-SEARCH-HERO |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-001 |
| Route | / |
| Page Entry | src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 6 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

홈 Section 1. 여행지·안전정보 통합 검색(REQ-FUNC-067)과 국가·도시·계절·테마·기간 필터(REQ-FUNC-002), 키워드 검색(REQ-FUNC-003)의 입력 UI를 제공하는 독립 Component다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.1절 REQ-FUNC-002/003 — 클라이언트에서 정적 데이터를 AND 조건으로 필터링/부분 일치 검색.

## Requirement Ref

- REQ-FUNC-002
- REQ-FUNC-003
- REQ-FUNC-067

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: /
- Page Entry: src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-001; `design-reference/D-001/DESIGN.md` §9(Destination Card), §8(Search·Filter), §17(Hero 높이 규칙).

## Depends On

- COMP-GLOBAL-DESIGN-TOKENS
- DATA-DESTINATIONS

## Expected Files

- `src/components/scr001/SearchHero.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 검색창(키워드), 계절 Select, 기간(출발~복귀) 입력을 제공한다.
- 제출 시 `DATA-DESTINATIONS`를 대상으로 키워드 부분 일치 + 계절/기간 AND 조건 필터링 결과를 부모(Page Owner)에 전달한다.
- 검색 결과 유형(여행지/안전정보)을 라벨로 구분한다(REQ-FUNC-067 통합 검색).
- "여행 조건 정리하기" CTA는 `/travel-tools`로 이동한다.

## Visual AC

- Hero 컨테이너 높이는 Desktop 520~600px를 넘지 않는다.
- Placeholder 문구를 사용하지 않는다(실제 예시 검색어를 힌트로 사용).

## Security/Privacy AC

- 검색어를 URL 쿼리 파라미터로 서버에 전달하지 않는다(REQ-FUNC-010 EXCLUDED — 클라이언트 상태로만 유지).

## Test Cases

- Playwright: 키워드 입력 후 제출 시 일치하는 여행지만 표시되는지 확인한다.
- Playwright: 결과 없음 검색어 입력 시 안내와 초기화 버튼이 나타나는지 확인한다(REQ-FUNC-005).

## Verify

Playwright(E2E-PUBLIC-SMOKE 내 검색 시나리오).

## Definition of Done

- 위 AC 충족
- DATA-DESTINATIONS 스키마와 필드명이 일치한다.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
