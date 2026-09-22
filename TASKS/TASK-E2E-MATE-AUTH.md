# E2E-MATE-AUTH — 인증+동행+관리자 흐름 스모크(Chromium 단일)

| 항목 | 내용 |
|---|---|
| Task ID | E2E-MATE-AUTH |
| Category | e2e |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 63 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

PROJECT_SCOPE.md 7절 시나리오 4·5·6·7(가입~신고/차단~관리자 처리)을 Chromium 단일 브라우저로 검증한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 7절 #4, #5, #6, #7.

## Requirement Ref

- 없음

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-004, §SCR-005.

## Depends On

- TASK-PAGE-SCR004
- TASK-PAGE-SCR005

## Expected Files

- `e2e/mate-auth.spec.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 이메일 가입 → 로그인 → 성인 확인 → 동행글 작성(연락처 패턴 차단 포함) → 게시(#4).
- 다른 계정으로 참가 요청 → 작성자 승인/거절 → 상태 반영 확인(#5).
- 신고 제출 → 접수 확인, 차단 후 상호 노출 제한 확인(#6).
- 관리자 탭에서 신고 상태 변경, 외부 URL 설정 변경(#7).
- **Chromium 단일 브라우저**로만 실행한다.

## Visual AC

- 해당 없음(테스트 코드).

## Security/Privacy AC

- 시나리오 내에서 연락처 패턴이 포함된 글 작성 시도가 차단되는지 확인한다.

## Test Cases

- 위 Functional AC의 각 시나리오를 순차 `test()` 블록으로 구현한다(DB-SEED-BASE 시드 계정 사용).

## Verify

`npx playwright test --project=chromium e2e/mate-auth.spec.ts`.

## Definition of Done

- 모든 시나리오가 통과한다.

## Forbidden

- 다른 브라우저 프로젝트를 추가하지 않는다.
- 별도 관리자 전용 회귀 스위트 파일을 추가로 만들지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
