---
description: Pre-flight readiness check for one Task before implementation — 8 checks, one of 5 status outcomes, never modifies code
---

# /prepare-task

Read-only pre-flight gate. This command **never modifies code** — it only reads, cross-checks, and reports one status. Implementation happens afterward, in a separate step, only if the result is `READY_TO_IMPLEMENT`.

## 입력

- `WAVE_ID` — 예: `W03`. 어느 Wave에서 이 Task를 실행하려는지.
- `TASK_ID` — 예: `TASK-PAGE-SCR003`, `COMP-SCR003-FLIGHT-FORM`.
- 선택된 상세 Task 파일 — 기본값은 `TASKS/TASK-<TASK_ID에서 앞의 TASK- 하나를 남기고 접은 이름>.md`(`gen-task-details.md`와 동일한 파일명 규칙). 사용자가 다른 경로를 직접 지정하면 그 경로를 우선한다.

인자가 하나라도 비어 있거나, `TASK_ID`가 `TASKS/00_TASK_LIST.md`에 없거나, 상세 Task 파일을 찾을 수 없으면 즉시 `BLOCKED_INPUT`으로 종료하고 나머지 검사를 진행하지 않는다.

## 절차

0. `traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)을 로드한다. `CLAUDE.md`의 Harness Marker·23개 규칙을 함께 참고한다.
1. `TASKS/00_TASK_LIST.md`와 선택된 `TASKS/TASK-<ID>.md`를 실제로 읽는다(캐시된 요약을 쓰지 않는다). Wave 계획 자료가 있다면(`TASKS/WAVE_PLAN.md` 또는 `TASKS/WAVE-<WAVE_ID>.md` 등) 그것도 읽는다.

## 검사 (실패 시 옆에 표시된 코드로 즉시 종료, 이후 검사는 생략)

| # | 검사 | 확인 내용 | 실패 시 출력 |
|---|---|---|---|
| 1 | Working Tree 상태 | `git status --porcelain` 실행. 결과가 비어 있지 않으면(추적되지 않는 파일 포함) 커밋되지 않은 변경이 이 Task의 Expected Files와 겹치거나 겹칠 위험이 있는지 확인한다 | `BLOCKED_DIRTY_TREE` |
| 2 | Task가 현재 Wave에 포함되는지 | Wave 계획 자료에서 `WAVE_ID`가 `TASK_ID`를 포함하는지 확인한다. Wave 계획 자료 자체가 없으면 이 검사를 통과시킬 근거가 없다 | `BLOCKED_INPUT` (Wave 계획 자료 없음 또는 이 Wave에 이 Task가 없음) |
| 3 | Depends On 완료 여부 | `TASKS/00_TASK_LIST.md`/상세 파일의 `Depends On` 각 항목에 대해, 그 Task의 Expected Files가 실제 파일 트리에 모두 존재하고(그리고 SCR-001처럼 "제거 대상 스타터"가 관련된 경우 스타터가 실제로 제거되었는지까지) 확인한다 | `BLOCKED_DEPENDENCY` |
| 4 | Expected Files | 이 Task의 Expected Files가 Task List와 상세 파일 사이에 서로 다르지 않은지, 각 경로가 이 Task의 Screen/Category와 맞는지(다른 Task의 Expected Files와 부당하게 겹치지 않는지) 확인한다 | `BLOCKED_INPUT` |
| 5 | SRS·Scope·Design·Screen Ref | 이 Task의 Requirement Ref가 `docs/06_SRS_UIUX_REVISED.md`/`docs/PROJECT_SCOPE.md`에 실제로 존재하는지, Screen/Route/Page Entry가 `design-reference/SCREEN_ROUTE_CONTRACT.json`과 일치하는지, Design Ref가 `design-reference/D-001/DESIGN.md`의 실제 절 번호를 가리키는지 확인한다. 참조 자체가 끊겨 있으면(존재하지 않는 REQ ID·Screen·절 번호) `BLOCKED_INPUT`, 참조는 유효하지만 승인된 5개 Screen/114개 Requirement 범위 밖을 가리키면 `BLOCKED_SCOPE` | `BLOCKED_INPUT` 또는 `BLOCKED_SCOPE` |
| 6 | 필요한 환경변수 이름 | 이 Task가 필요로 하는 환경변수 **이름**(예: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, 서버 전용 Supabase 키)이 `.env.local`/`.env`에 선언되어 있는지 이름만 확인한다(값은 절대 출력하지 않는다) | `BLOCKED_INPUT` |
| 7 | Secret 하드코딩 위험 | 이 Task가 수정할 기존 파일과 상세 Task 파일 본문에 API 키·토큰처럼 보이는 리터럴 문자열이 있는지 스캔하고, AC/Forbidden 절에 "Service Role Key를 Client에서 사용하지 않는다"(`CLAUDE.md` 규칙 15) 같은 금지 문구가 있는지 확인한다 | `BLOCKED_SCOPE` |
| 8 | EXCLUDED 범위 침범 여부 | 이 Task의 Requirement Ref에 `TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표에 있는 EXCLUDED ID가 섞여 있지 않은지, 이 Screen의 `forbidden_features`(`SCREEN_ROUTE_CONTRACT.json`)를 침범하는 내용이 AC에 없는지 확인한다 | `BLOCKED_SCOPE` |

## 출력

정확히 다음 5개 값 중 하나만 최종 결과로 출력한다(다른 문구로 대체하지 않는다):

- `READY_TO_IMPLEMENT` — 8개 검사를 모두 통과했다.
- `BLOCKED_INPUT` — 입력(WAVE_ID/TASK_ID/파일/참조/환경변수 이름)이 없거나 잘못됨.
- `BLOCKED_DEPENDENCY` — `Depends On`의 선행 Task가 아직 완료되지 않음.
- `BLOCKED_DIRTY_TREE` — Working Tree에 커밋되지 않은 변경이 있음.
- `BLOCKED_SCOPE` — EXCLUDED·`forbidden_features`·Secret 하드코딩 등 승인된 범위를 벗어남.

각 결과 뒤에는 반드시 다음을 덧붙인다:
1. 어느 검사(#1~8) 때문에 이 결과가 나왔는지.
2. 구체적인 원인(파일 경로, Task ID, 누락된 환경변수 이름 등 — 실제 값이 아니라 이름만).
3. `BLOCKED_*`인 경우, 사용자가 다음에 할 수 있는 조치(예: `git stash`로 Working Tree 정리, 선행 Task 완료, `.env.local`에 이름 추가, `/gen-task-details`로 참조 수정).

`READY_TO_IMPLEMENT`가 아닌 한, 어떤 코드도 작성·수정하지 않고 이 Command를 종료한다. 이 Command 자체도 `TASKS/**`, `src/**`, 그 외 어떤 파일도 수정하지 않는다 — 오직 읽고 판정만 한다.
