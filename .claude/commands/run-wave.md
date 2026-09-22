---
description: Standard development command — drive one Wave of Tasks end-to-end via prepare-task + implement-task, no auto Branch/PR/Merge
---

# /run-wave

The standard development command (`CLAUDE.md` rule 6). Orchestrates `/prepare-task` and `/implement-task` over one Wave's Tasks, one Task at a time (`CLAUDE.md` rule 7, Skill §10). **Never creates a Git branch, never opens a PR, never merges** — that stays manual (`docs/DECISION_LOG.md` DEC-012, `CLAUDE.md` rules 6/21).

## Wave 자료 (이 Command가 읽고 갱신하는 파일)

`TASKS/WAVE_PLAN.md`와 `TASKS/WAVE_STATE.json`은 사람이 손으로 쓰는 파일이 아니라 **`scripts/build_waves.py`가 `TASKS/TASK_MANIFEST.csv`·Task 상세 파일·`design-reference/SCREEN_ROUTE_CONTRACT.json`으로부터 생성**한다(`TASKS/TASK_DAG.md`도 같은 실행이 함께 만든다). `/run-wave`는 이 두 파일을 실제 Wave 구성의 정본으로 그대로 신뢰하며, Wave ID나 Task 순서를 스스로 다시 추론하지 않는다.

- **`TASKS/WAVE_PLAN.md`** — `build_waves.py`가 산출한 계획. Wave별 Task ID 목록(이미 의존성 순서로 정렬됨)과 각 Wave의 `Preview Checkpoint`(예/아니오)를 표로 담는다. 이 Command는 이 파일을 **읽기만** 한다 — 존재하지 않으면 즉시 `WAVE_PLAN_MISSING`을 출력하고 중단한다(`python scripts/build_waves.py`를 먼저 실행하라고 안내하며, 임의로 Wave를 추론하지 않는다).
- **`TASKS/WAVE_STATE.json`** — 이 Command가 진행 상황을 기록하는 상태 파일. `build_waves.py`가 만드는 최초 구조는 다음과 같다.
  ```json
  {
    "schema_version": "traveler-wave-state-v1",
    "generated_at": "...",
    "waves": [
      {
        "wave_id": "W09",
        "title": "SCR-001 Component와 Page Owner",
        "task_ids": ["COMP-SCR001-INTL-GRID", "...", "TASK-PAGE-SCR001"],
        "status": "pending",
        "checkpoint_required": true,
        "checkpoint_result": null,
        "tasks": [
          { "task_id": "COMP-SCR001-INTL-GRID", "status": "READY", "updated_at": null, "note": "" }
        ]
      }
    ]
  }
  ```
  Wave 전체 상태(`waves[].status`)는 `pending|in_progress|blocked|completed` 중 하나이고, Wave 내부 개별 Task 상태(`waves[].tasks[].status`)는 이 Command와 `/prepare-task`가 계속 써 온 `READY|IN_PROGRESS|DONE|BLOCKED_INPUT|BLOCKED_DEPENDENCY|BLOCKED_DIRTY_TREE|BLOCKED_SCOPE` 어휘를 그대로 쓴다. `/run-wave`는 `task_ids`에 등재된 순서(=Task ID 알파벳 순, `build_waves.py`가 이미 의존성과 충돌하지 않게 보장함)대로 `tasks[]`에서 다음 `READY` Task를 고른다. 파일이 없으면 새로 추론하지 말고 `python scripts/build_waves.py` 재실행을 안내한다.

## 지원 명령

### `/run-wave W03` — 지정한 Wave 실행

1. `TASKS/WAVE_PLAN.md`와 `TASKS/WAVE_STATE.json`을 읽는다(없으면 위 규칙대로 처리).
2. `W03`에 속한 Task 중 `status: "READY"`인 것을 `Depends On` 순서(같은 Wave 안에서 먼저 오는 것)로 **하나** 고른다. `READY` Task가 없으면(전부 DONE이거나 전부 BLOCKED_*) 7·8단계로 넘어간다.
3. 고른 Task에 대해 `/prepare-task`의 8개 검사를 그대로 수행한다. 결과가 `READY_TO_IMPLEMENT`가 아니면 `WAVE_STATE.json`의 그 Task 상태를 해당 `BLOCKED_*` 값으로 갱신하고, 이 Task는 건너뛰어 같은 Wave의 다음 후보로 넘어간다(자동으로 막힌 Task를 반복 재시도하지 않는다).
4. `READY_TO_IMPLEMENT`면 `/implement-task`의 규칙 그대로 이 Task **하나**만 구현한다(Expected Files 안에서만, Functional/Visual/Security AC 준수, Page Owner는 실제 조립, AWS·EC2·ORM·자동 Merge 금지). 진행 중에는 `WAVE_STATE.json`의 상태를 `IN_PROGRESS`로 둔다.
5. 이 Task에 관련된 검증(Unit Test, 그리고 Page Owner/지정 E2E Task라면 Playwright Chromium Smoke)이 **PASS**하면 `WAVE_STATE.json`의 상태를 `DONE`으로 갱신한다. PASS하지 않으면 `BLOCKED_DEPENDENCY`로 표시하고 원인을 기록한 뒤 이 Task를 중단한다(다음 Task로 넘어가지 않고 종료 — 실패를 넘기고 계속 진행하지 않는다).
6. 방금 완료한 Task가 `TASKS/WAVE_PLAN.md`에서 `Preview Checkpoint: 예`로 표시되어 있으면 8단계로 간다. 아니면 같은 Wave에서 다음 `READY` Task를 골라 2~6단계를 반복한다.
7. 같은 Wave의 모든 Task가 `DONE`이면(그리고 Preview Checkpoint에 걸리지 않았으면) `WAVE_COMPLETE`를 출력하고 종료한다.
8. Preview Checkpoint에 걸렸으면(6단계) `WAITING_FOR_PREVIEW`를 출력하고 종료한다 — 사람이 Preview를 확인하기 전에는 같은 Wave의 나머지 Task나 다음 Wave로 자동 진행하지 않는다(`CLAUDE.md` 규칙 22).

각 종료 시 항상 보고한다: 이번 실행에서 `DONE`이 된 Task 목록, `BLOCKED_*`로 건너뛴 Task와 사유, 남아 있는 `READY` Task 수.

### `/run-wave status` — 읽기 전용 현황 보고

- `TASKS/WAVE_PLAN.md`·`TASKS/WAVE_STATE.json`만 읽고, `/prepare-task`나 `/implement-task`는 호출하지 않는다.
- Wave별로 Task 상태(READY/IN_PROGRESS/DONE/BLOCKED_*) 개수와, 가장 최근에 `WAITING_FOR_PREVIEW`로 멈춘 Wave가 있는지를 보고한다.
- 아무 파일도 갱신하지 않는다.

### `/run-wave resume` — 마지막으로 진행 중이던 Wave 이어서 실행

- `TASKS/WAVE_STATE.json`에서 `IN_PROGRESS` 또는 아직 `READY`가 남아 있는 가장 최근 Wave를 찾아 `WAVE_ID`로 자동 지정한다.
- 그 Wave가 `WAITING_FOR_PREVIEW`로 멈춰 있었다면, **사용자에게 Preview 확인 여부를 먼저 물은 뒤** 확인을 받은 경우에만 `/run-wave <해당 WAVE_ID>`와 동일하게 2~8단계를 계속한다. 확인 없이 자동으로 다음 Task를 진행하지 않는다.
- 어느 Wave도 진행 중이 아니면(전부 `DONE`이거나 `TASKS/WAVE_STATE.json` 자체가 없으면) 그 사실을 보고하고 종료한다.

### `/run-wave dry-run W03` — 미리보기(코드 변경 없음)

- `/implement-task`를 호출하지 않고 `WAVE_STATE.json`도 갱신하지 않는다 — 오직 읽기와 판정만 한다.
- 지정한 Wave의 Task를 `Depends On` 순서로 순회하며 각각 `/prepare-task`의 8개 검사만 수행하고, 실제로 실행했다면 어떤 순서로 `READY_TO_IMPLEMENT`가 이어지는지, 어느 Task에서 처음 막히는지(`BLOCKED_*`), Preview Checkpoint가 어디에 걸리는지를 표로 보고한다.
- 이 서브커맨드는 어떤 파일도 쓰지 않는다(계획 확인용).

## 공통 제약

- 자동 Git Branch 생성, 자동 PR 생성, 자동 Merge를 이 Command의 어떤 서브커맨드도 수행하지 않는다.
- `implement-task`가 사용자의 명시적 요청에 따라 Task 단위 Commit까지 하더라도, `run-wave`는 그 이상(Push/PR/Merge)을 대신하지 않는다.
- Wave 진행 중 어떤 이유로든 검증이 실패하면 다음 Task로 넘어가지 않고 그 자리에서 멈춰 사람이 볼 수 있게 보고한다.
