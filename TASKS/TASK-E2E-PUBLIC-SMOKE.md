# E2E-PUBLIC-SMOKE — 비로그인 공개 흐름 스모크(Chromium 단일)

| 항목 | 내용 |
|---|---|
| Task ID | E2E-PUBLIC-SMOKE |
| Category | e2e |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 61 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Skill Rule 13에 따라 Playwright는 Chromium 단일 브라우저 Smoke Test 1개 파일로만 구성한다. 이 파일은 `docs/PROJECT_SCOPE.md` 7절 시나리오 1·8·9(+axe 검사 일부)를 순차 수행한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 7절 — Playwright 핵심 Smoke Test 범위(비로그인 관련 시나리오).

## Requirement Ref

- 없음

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-001, §SCR-002.

## Depends On

- TASK-PAGE-SCR001
- TASK-PAGE-SCR002
- COMP-GLOBAL-ERROR-PAGES

## Expected Files

- `e2e/public-smoke.spec.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 여행지 목록 → 필터 → 상세 → 안전정보 패널 이동 시나리오(PROJECT_SCOPE 7절 #1).
- 대표 소개 페이지 수치·소개 일치 확인(#8).
- 404/외부 연결 실패 등 오류 화면 복구 행동 확인(#9).
- **Chromium 단일 브라우저**로만 실행한다. Firefox/WebKit 프로젝트를 추가하지 않는다(Skill Rule 13).

## Visual AC

- 해당 없음(테스트 코드).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 위 Functional AC의 각 시나리오를 순차 `test()` 블록으로 구현한다.

## Verify

`npx playwright test --project=chromium e2e/public-smoke.spec.ts`.

## Definition of Done

- 모든 시나리오가 통과한다.

## Forbidden

- Firefox/WebKit 등 다른 브라우저 프로젝트를 추가하지 않는다.
- 별도의 회귀 스위트 파일을 추가로 만들지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
