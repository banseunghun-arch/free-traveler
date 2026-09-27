# E2E-AUTH-SMOKE — 로그인 사용자 동행글 작성·신청 스모크(Chromium 단일, 골격)

| 항목 | 내용 |
|---|---|
| Task ID | E2E-AUTH-SMOKE |
| Category | e2e |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 62 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

`docs/DECISION_LOG.md` DEC-018에 따라 옛 `E2E-MATE-AUTH`(가입·성인확인·동행 작성·참가·신고/차단·관리자 URL)를 대체한다. 실제로는 `tests/e2e/auth-smoke.spec.ts`에 **골격**만 작성되어 있으며, DB-SEED-BASE 시드 계정을 가리키는 `E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD` 환경변수가 없으면 이 Task **하나만** 명시적으로 skip된다(`E2E-PUBLIC-SMOKE`는 영향받지 않는다).

## Project Scope

`docs/PROJECT_SCOPE.md` 7절 — Playwright 핵심 Smoke Test 범위(로그인 필요 시나리오, DEC-018로 범위 축소됨: 신고/차단·관리자 URL 설정은 이 Task로 자동 검증하지 않는다).

## Requirement Ref

- 없음

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-003, §SCR-004, §SCR-005.

## Depends On

- TASK-PAGE-SCR003
- TASK-PAGE-SCR004
- TASK-PAGE-SCR005
- AUTH-SUPABASE-EMAIL
- API-MATE-POSTS
- API-PARTICIPATION
- DB-SEED-BASE

## Expected Files

- `tests/e2e/auth-smoke.spec.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- **E2E-006** 시드 계정으로 로그인 → `/travel-tools`의 "동행 구하기" 탭에서 동행글을 작성 → `/mates` 목록과 상세에서 방금 작성한 글이 보이는지 확인한다.
- **E2E-007** `/mates`에서 동행글에 참가 신청 → 신청 결과 안내(Toast/상태 문구)를 확인 → `/account`의 내 활동(참가 요청) 영역에서 확인한다.
- Selector는 role/accessible name을 우선하고, 고정 문구가 없는 목록 Card만 `data-testid`를 쓴다.
- `E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD` 환경변수가 없으면 `test.skip(...)`으로 이 파일 전체를 skip한다(개별 test가 아니라 `test.describe` 단위로 명시적 skip).
- **Chromium 단일 브라우저**로만 실행한다.

## Visual AC

- 해당 없음(테스트 코드).

## Security/Privacy AC

- 시드 계정 자격증명은 코드에 하드코딩하지 않고 환경변수로만 주입한다.

## Test Cases

- 위 Functional AC의 E2E-006~007을 `test.step`으로 단계를 나눈 골격으로 구현한다(`tests/e2e/auth-smoke.spec.ts`). 정확한 Selector는 `COMP-SCR005-AUTH`/`COMP-SCR003-MATE-COMPOSER` 등 실제 구현 완료 후 다시 맞춘다.

## Verify

`E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD` 설정 후 `npx playwright test --project=chromium tests/e2e/auth-smoke.spec.ts`. 설정하지 않으면 `2 skipped`로 종료되는 것이 정상이다.

## Definition of Done

- 환경변수가 있을 때 E2E-006~007이 통과한다.
- 환경변수가 없을 때 이 파일만 명시적으로 skip되고 `E2E-PUBLIC-SMOKE`는 영향받지 않는다.

## Forbidden

- 신고·차단·관리자 URL 설정 시나리오를 이 Task에 추가하지 않는다(DEC-018로 자동 검증 범위에서 제외됨 — 필요 시 별도 Task로 새로 제안한다).
- Firefox/WebKit 등 다른 브라우저 프로젝트를 추가하지 않는다.
- 별도 관리자 전용 회귀 스위트 파일을 추가로 만들지 않는다.
- 시드 계정 자격증명을 코드에 하드코딩하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
