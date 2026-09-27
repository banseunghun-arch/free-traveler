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

`playwright.config.ts`/`tests/e2e/public-smoke.spec.ts`를 실제로 작성하면서 확정된 범위다(`docs/DECISION_LOG.md` DEC-018 — 이전 `E2E-PUBLIC-SMOKE`(비로그인 공개 흐름) + `E2E-TRAVEL-TOOLS`(항공·숙소 외부 이동) 2개 Task를 이 1개 파일로 합쳤다). Chromium 단일 브라우저(`devices["Desktop Chrome"]`)로 로그인 없이 접근 가능한 5개 흐름(E2E-001~005)을 순차 `test()` 블록으로 수행한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 7절 — Playwright 핵심 Smoke Test 범위(비로그인 관련 시나리오).

## Requirement Ref

- 없음

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-001, §SCR-002, §SCR-003.

## Depends On

- TASK-PAGE-SCR001
- TASK-PAGE-SCR002
- TASK-PAGE-SCR003

## Expected Files

- `tests/e2e/public-smoke.spec.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- **E2E-001** 메인 페이지(`/`)의 추천 여행지(국내·해외 Grid)와 주요 CTA(`여행 조건 정리하기`/`동행 더 보기`/`대표 이야기 더 보기`)가 보이는지 확인한다.
- **E2E-002** 대표 소개(`/about`)에 `free_traveler` 표기와 `50+`/`30+`(50회 이상 여행·30개국 이상) 수치가 보이는지 확인한다.
- **E2E-003** 여행 도구(`/travel-tools`)의 "항공편 찾기" 탭에서 비전달 고지 문구와 항공 외부 이동 링크의 `href`/`target="_blank"`/`rel="noopener"`를 확인한다.
- **E2E-004** 같은 화면의 "숙소 찾기" 탭에서 비전달 고지 문구와 숙소 외부 이동 링크의 `href`/`target="_blank"`/`rel="noopener"`를 확인한다.
- **E2E-005** "동행 구하기" 탭에 비로그인 상태로 진입 시 로그인 안내(문구 + 로그인 링크)가 보이는지 확인한다.
- Selector는 role/accessible name을 우선하고, 고정 문구가 없는 데이터 영역(여행지 Grid 등)만 `data-testid`를 쓴다(텍스트 위치·CSS 구조 금지).
- 항공·숙소 외부 이동 링크는 실제로 새 탭을 열어 그 사이트의 내용을 검사하지 않는다 — `href`/`target`/`rel` 속성만 확인한다.
- **Chromium 단일 브라우저**로만 실행한다. Firefox/WebKit 프로젝트를 추가하지 않는다(Skill Rule 13).

## Visual AC

- 해당 없음(테스트 코드).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 위 Functional AC의 E2E-001~005 각 시나리오를 순차 `test()` 블록으로 구현한다(`tests/e2e/public-smoke.spec.ts`).

## Verify

`npx playwright test --project=chromium tests/e2e/public-smoke.spec.ts` (`npm run test:e2e:public`).

## Definition of Done

- E2E-001~005 5개 시나리오가 모두 통과한다.

## Forbidden

- Firefox/WebKit 등 다른 브라우저 프로젝트를 추가하지 않는다.
- 별도의 회귀 스위트 파일을 추가로 만들지 않는다.
- 항공·숙소 외부 사이트를 실제로 열어 그 응답 내용을 검사하지 않는다.
- 이미지 출처 URL의 응답 상태(HTTP status)를 검사하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
