# COMP-SCR003-INTRO-TABS — Intro(이용 순서 3단계) + Tabs 셸(탭 전환 상태)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR003-INTRO-TABS |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-003 |
| Route | /travel-tools |
| Page Entry | src/app/travel-tools/page.tsx (조립은 TASK-PAGE-SCR003 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 21 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Intro(이용 순서 3단계 요약)와 "항공편 찾기/숙소 찾기/동행 구하기" 3탭 셸을 제공한다. 탭 콘텐츠 자체는 각 COMP-SCR003-FLIGHT-FORM/HOTEL-FORM/MATE-COMPOSER가 담당하고, 이 Component는 탭 전환 상태(활성 탭, 각 탭의 독립 상태 보존)만 관리한다.

## Project Scope

해당 없음 — UI_CONTRACT.md §SCR-003 디자인 규정(탭 정확히 3개).

## Requirement Ref

- 없음

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: /travel-tools
- Page Entry: src/app/travel-tools/page.tsx (조립은 TASK-PAGE-SCR003 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-003, `design-reference/D-001/DESIGN.md` §10(Form·Tabs).

## Depends On

- COMP-GLOBAL-DESIGN-TOKENS

## Expected Files

- `src/components/scr003/IntroTabs.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- "항공편 찾기"/"숙소 찾기"/"동행 구하기" 정확히 3개 탭을 렌더링한다.
- 탭 전환 시 다른 탭의 입력·검증·완료 상태가 초기화되지 않고 유지된다.
- Intro에 이용 순서 3단계를 요약한다.

## Visual AC

- Mobile은 탭을 가로 스크롤 또는 3등분으로 배치한다.

## Security/Privacy AC

- 해당 없음.

## Test Cases

- Playwright: 탭 전환 후 되돌아왔을 때 이전 입력값이 유지되는지 확인한다.

## Verify

Playwright(E2E-TRAVEL-TOOLS).

## Definition of Done

- 위 AC 충족.

## Forbidden

- 탭을 3개 초과로 늘리지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
