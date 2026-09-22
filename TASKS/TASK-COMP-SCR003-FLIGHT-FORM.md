# COMP-SCR003-FLIGHT-FORM — 항공 조건 입력+검증+요약+외부이동+비전달고지+Tip3

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR003-FLIGHT-FORM |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-003 |
| Route | /travel-tools |
| Page Entry | src/app/travel-tools/page.tsx (조립은 TASK-PAGE-SCR003 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 22 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

항공편 찾기 탭 전체(입력→검증→요약→외부 이동)를 구현하는 Component. F2(REQ-FUNC-011~018) 전체를 담당한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.2절 F2 — Flight Link-out 전 항목.

## Requirement Ref

- REQ-FUNC-011
- REQ-FUNC-012
- REQ-FUNC-013
- REQ-FUNC-014
- REQ-FUNC-015
- REQ-FUNC-016
- REQ-FUNC-017
- REQ-FUNC-018

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: /travel-tools
- Page Entry: src/app/travel-tools/page.tsx (조립은 TASK-PAGE-SCR003 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-003, `design-reference/D-001/DESIGN.md` §10(Form·Tabs).

## Depends On

- COMP-GLOBAL-DESIGN-TOKENS

## Expected Files

- `src/components/scr003/FlightForm.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 국가·지역·출발일·귀국일을 필수 입력으로 받는다(REQ-FUNC-011).
- 국가 변경 시 지역 옵션을 재계산하고 기존 지역값을 초기화한다(REQ-FUNC-012).
- 과거 출발일·역전 날짜(귀국일<출발일)를 클라이언트 검증으로 제출 차단한다(REQ-FUNC-013, UNIT-TRAVEL-DATES와 동일 로직 사용).
- 검증 통과 후 요약 화면을 표시하고 값은 브라우저 세션(탭) 상태로 유지한다(REQ-FUNC-014).
- 폼·요약 화면에 비전달 고지 문구를 고정 배치한다(REQ-FUNC-015).
- "항공편 보러 가기" 버튼은 `target="_blank" rel="noopener noreferrer"`로 외부 URL을 열고 쿼리 파라미터를 붙이지 않는다(REQ-FUNC-016).
- 외부 URL 환경변수 미설정/형식 오류 시 오류 안내와 재시도 버튼을 표시한다(REQ-FUNC-018).
- Tip 3개(찾기 팁)를 표시한다.

## Visual AC

- 입력 오류는 필드 옆에 즉시 표시한다(빈 오류 영역 방치 금지).

## Security/Privacy AC

- 입력값을 서버 API·DB·URL 쿼리 어디에도 저장/전달하지 않는다(REQ-FUNC-017) — 클라이언트 상태(React state)로만 유지한다.

## Test Cases

- 유닛 테스트(UNIT-TRAVEL-DATES): 과거/역전/동일 날짜 입력이 거부되는지 확인한다.
- Playwright: 국가 변경 시 지역 옵션이 재계산되는지 확인한다.
- Playwright: 유효 입력 → 요약 → 외부 새 탭 이동, URL에 쿼리 파라미터가 없는지 확인한다.
- Playwright: 외부 URL 미설정 시나리오에서 오류 안내+재시도가 나타나는지 확인한다.
- 네트워크 탭 확인: 폼 제출 시 서버 API 호출이 없는지 확인한다.

## Verify

Playwright(E2E-TRAVEL-TOOLS), Unit(UNIT-TRAVEL-DATES).

## Definition of Done

- 위 AC 충족.
- UNIT-TRAVEL-DATES 통과.

## Forbidden

- 실시간 항공권 가격을 표시하지 않는다.
- 입력값을 저장하는 API Route를 만들지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
