# COMP-SCR002-INTRO-PHILOSOPHY — 소개·철학 2~4문단

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR002-INTRO-PHILOSOPHY |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-002 |
| Route | /about |
| Page Entry | src/app/about/page.tsx (조립은 TASK-PAGE-SCR002 소관) |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 16 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

About Section 3. PRD에서 확정된 소개문·철학·편집 원칙을 그대로 반영하는 텍스트 블록.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.6절 REQ-FUNC-058 — PRD 확정 소개문을 정적 데이터로 그대로 반영.

## Requirement Ref

- REQ-FUNC-058

## Screen / Route / Page Entry

- Screen: SCR-002
- Route: /about
- Page Entry: src/app/about/page.tsx (조립은 TASK-PAGE-SCR002 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-002.

## Depends On

- DATA-REPRESENTATIVE

## Expected Files

- `src/components/scr002/IntroPhilosophy.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 소개·시작 이유·철학을 2~4문단으로 표시한다.

## Visual AC

- 본문 가독성을 위해 한 줄 65자 내외로 폭을 제한한다.
- Placeholder 문구를 사용하지 않는다.

## Security/Privacy AC

- 해당 없음.

## Test Cases

- Playwright: 소개 문단 2~4개가 렌더링되는지 확인한다.

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
