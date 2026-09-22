# COMP-SCR003-HOTEL-FORM — 숙소 조건 입력+검증+요약+외부이동+비전달고지+Tip3

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR003-HOTEL-FORM |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-003 |
| Route | /travel-tools |
| Page Entry | src/app/travel-tools/page.tsx (조립은 TASK-PAGE-SCR003 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 23 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

숙소 찾기 탭 전체(입력→검증→요약→외부 이동)를 구현하는 Component. F3(REQ-FUNC-019~026) 전체를 담당하며 FlightForm과 동일 패턴이다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.3절 F3 — Hotel Link-out 전 항목.

## Requirement Ref

- REQ-FUNC-019
- REQ-FUNC-020
- REQ-FUNC-021
- REQ-FUNC-022
- REQ-FUNC-023
- REQ-FUNC-024
- REQ-FUNC-025
- REQ-FUNC-026

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: /travel-tools
- Page Entry: src/app/travel-tools/page.tsx (조립은 TASK-PAGE-SCR003 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-003, `design-reference/D-001/DESIGN.md` §10(Form·Tabs).

## Depends On

- COMP-GLOBAL-DESIGN-TOKENS

## Expected Files

- `src/components/scr003/HotelForm.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 국가·지역·체크인·체크아웃을 필수 입력으로 받는다(REQ-FUNC-019).
- 국가 변경 시 지역 옵션을 재계산한다(REQ-FUNC-020).
- 과거/역전/동일 날짜(체크인=체크아웃)를 클라이언트 검증으로 차단한다(REQ-FUNC-021, UNIT-TRAVEL-DATES 로직 재사용).
- 검증 통과 후 요약을 표시한다(REQ-FUNC-022).
- 비전달 고지 문구를 고정 배치한다(REQ-FUNC-023).
- "호텔 보러 가기" 버튼은 새 탭(`noopener,noreferrer`)으로 쿼리 없이 이동한다(REQ-FUNC-024).
- 외부 URL 오류 시 재시도 버튼과 함께 입력값을 유지한다(REQ-FUNC-026).
- Tip 3개를 표시한다.

## Visual AC

- 입력 오류는 필드 옆에 즉시 표시한다.

## Security/Privacy AC

- 입력값을 서버 API·DB·URL 쿼리 어디에도 저장/전달하지 않는다(REQ-FUNC-025).

## Test Cases

- 유닛 테스트(UNIT-TRAVEL-DATES): 체크인=체크아웃(동일 날짜) 입력이 거부되는지 확인한다.
- Playwright: 유효 입력 → 요약 → 외부 새 탭 이동을 확인한다.
- Playwright: URL 오류 시나리오에서 입력값이 유지된 채 재시도 버튼이 나타나는지 확인한다.

## Verify

Playwright(E2E-TRAVEL-TOOLS), Unit(UNIT-TRAVEL-DATES).

## Definition of Done

- 위 AC 충족.

## Forbidden

- 실시간 호텔 가격을 표시하지 않는다.
- 입력값을 저장하는 API Route를 만들지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
