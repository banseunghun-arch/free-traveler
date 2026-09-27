---
description: Standard development command — drive one Wave of Tasks end-to-end via prepare-task + implement-task, no auto Branch/PR/Merge
---

# /run-wave

The standard development command (`CLAUDE.md` rule 6). Orchestrates `/prepare-task` and `/implement-task` over one Wave's Tasks, one Task at a time (`CLAUDE.md` rule 7, Skill §10). **Never creates a Git branch, never opens a PR, never merges** — that stays manual (`docs/DECISION_LOG.md` DEC-012, `CLAUDE.md` rules 6/21).

## 입력

```
/run-wave <WAVE_ID> [--dry-run | --resume | --status]
```

- **`WAVE_ID`** (필수) — `TASKS/WAVE_PLAN.md`에 실제로 있는 Wave ID(예: `W09`). 존재하지 않으면 `UNKNOWN_WAVE_ID`를 출력하고 중단한다.
- **`--dry-run`**, **`--resume`**, **`--status`** — 선택, 서로 배타적(동시에 두 개를 주지 않는다). 아무 옵션도 없으면 "기본 동작"(아래)을 수행한다.

## Wave 자료 (이 Command가 읽고 갱신하는 파일)

`TASKS/WAVE_PLAN.md`와 `TASKS/WAVE_STATE.json`은 사람이 손으로 쓰는 파일이 아니라 **`scripts/build_waves.py`가 `TASKS/TASK_MANIFEST.csv`·Task 상세 파일·`design-reference/SCREEN_ROUTE_CONTRACT.json`으로부터 생성**한다(`TASKS/TASK_DAG.md`도 같은 실행이 함께 만든다). `/run-wave`는 이 두 파일을 실제 Wave 구성의 정본으로 그대로 신뢰하며, Wave ID나 Task 순서를 스스로 다시 추론하지 않는다.

- **`TASKS/WAVE_PLAN.md`** — `build_waves.py`가 산출한 계획. Wave별 Task ID 목록(이미 의존성 순서로 정렬됨)과 각 Wave의 `Preview Checkpoint`(예/아니오)를 표로 담는다. 이 Command는 이 파일을 **읽기만** 한다 — 존재하지 않으면 즉시 `WAVE_PLAN_MISSING`을 출력하고 중단한다(`python scripts/build_waves.py`를 먼저 실행하라고 안내하며, 임의로 Wave를 추론하지 않는다).
- **`TASKS/WAVE_STATE.json`** — 이 Command가 진행 상황을 기록하는 상태 파일:
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
  **용어 대응(중요)**: 이 문서와 사용자 요청에서 말하는 "pending Task"는 JSON의 Task 상태 `"READY"`를 가리키고, "blocked Task"는 `BLOCKED_INPUT`/`BLOCKED_DEPENDENCY`/`BLOCKED_DIRTY_TREE`/`BLOCKED_SCOPE` 중 하나를, "완료"는 `"DONE"`을 가리킨다 — `/prepare-task`가 정의한 어휘를 그대로 쓴다. Wave 전체 상태(`waves[].status`)는 `pending|in_progress|blocked|completed` 그대로 쓴다.
  `/run-wave`는 `task_ids`에 등재된 순서(=Task ID 알파벳 순, `build_waves.py`가 이미 의존성과 충돌하지 않게 보장함)대로 `tasks[]`를 본다. 파일이 없으면 새로 추론하지 말고 `python scripts/build_waves.py` 재실행을 안내한다.

## 동작

### `--status` — 읽기 전용 현황 보고

- `TASKS/WAVE_PLAN.md`·`TASKS/WAVE_STATE.json`만 읽는다. `/prepare-task`·`/implement-task`를 호출하지 않고, 어떤 파일도 갱신하지 않는다.
- 지정한 `WAVE_ID`의 Wave 상태(`pending|in_progress|blocked|completed`)와, 그 안의 각 Task ID·상태(`READY|IN_PROGRESS|DONE|BLOCKED_*`)를 표로 보여준다.
- Checkpoint가 필요한 Wave면 `checkpoint_required`/`checkpoint_result` 값도 함께 보여준다.

### `--dry-run` — 미리보기(무엇도 수정하지 않음)

- `/prepare-task`·`/implement-task`를 호출하지 않고 `WAVE_STATE.json`도 갱신하지 않는다 — 읽기와 판정만 한다.
- 지정한 Wave의 `task_ids` 순서를 따라가며, 이번에 실제로 실행했다면 **어떤 Task가 먼저 선택되고, 그 Task의 Expected Files는 무엇이고, 어떤 최소 검증(Unit/Playwright/없음)이 걸리고, Preview Checkpoint가 걸리는 지점이 어디인지**를 표로 보고한다.
- 이미 `DONE`인 Task, 아직 `READY`인 Task, `BLOCKED_*`인 Task를 구분해서 보여준다.

### 기본 동작 — 지정한 Wave를 실행

1. `TASKS/WAVE_PLAN.md`·`TASKS/WAVE_STATE.json`을 읽는다(없으면 위 규칙대로 중단).
2. **규칙 1(선행 Wave 게이트)**: `TASKS/WAVE_PLAN.md`의 Wave 목록에서 `WAVE_ID` 바로 앞 Wave를 찾는다. 그 Wave의 `status`가 `completed`가 아니면(첫 Wave는 이 검사를 건너뜀) `BLOCKED_PREVIOUS_WAVE_NOT_COMPLETE`를 출력하고 **아무 Task도 건드리지 않고** 종료한다.
3. **이미 `blocked`인 Wave 보호**: `WAVE_ID`의 현재 `status`가 이미 `blocked`이면, 기본 동작은 자동으로 재시도하지 않는다 — 어느 Task가 왜 막혔는지를 보고하고 `--resume`으로 다시 시도하라고 안내한 뒤 종료한다(조용히 같은 실패를 반복하지 않기 위함).
4. Wave의 `task_ids` 순서대로 `status: "READY"`(=pending)인 Task를 **하나** 고른다. `READY` Task가 없으면 8단계로 넘어간다.
5. 고른 Task에 `/prepare-task`의 8개 검사를 그대로 수행한다.
   - `READY_TO_IMPLEMENT`가 아니면: 이 Task의 상태를 해당 `BLOCKED_*` 값으로 갱신하고, **규칙 2에 따라 Wave 전체의 `status`를 `blocked`로 기록한 뒤 즉시 멈춘다**(다음 Task로 넘어가지 않는다 — 옛 버전처럼 건너뛰고 계속하지 않는다, 같은 Wave의 뒤 Task가 이 Task에 의존할 수 있기 때문).
   - `READY_TO_IMPLEMENT`면 6단계로 간다.
6. `/implement-task`의 규칙 그대로 이 Task **하나**만 구현한다(Expected Files 안에서만, Functional/Visual/Security AC 준수, Page Owner는 실제 조립, AWS·EC2·ORM·자동 Merge 금지). 진행 중에는 이 Task 상태를 `IN_PROGRESS`로 둔다.
7. **규칙 3(최소 검증)**: 이 Task에 지정된 최소 검증을 실행한다 — Unit Test는 항상, Playwright Chromium Smoke는 이 Task가 Page Owner이거나 지정된 E2E Task(`E2E-PUBLIC-SMOKE`/`E2E-AUTH-SMOKE`)일 때만(`implement-task.md` 규칙 10). **PASS**하면 이 Task 상태를 `DONE`으로 갱신하고 4단계로 돌아가 같은 Wave의 다음 `READY` Task를 계속 처리한다. PASS하지 않으면 `BLOCKED_DEPENDENCY`로 표시하고, 규칙 2에 따라 Wave 전체를 `blocked`로 기록한 뒤 멈춘다.
8. 같은 Wave의 모든 Task가 `DONE`이 되면: **규칙 4**에 따라 `checkpoint_required`를 확인한다.
   - `false`면 Wave `status`를 `completed`로 갱신하고 `WAVE_COMPLETE`를 출력하고 종료한다.
   - `true`이고 `checkpoint_result`가 아직 `CONFIRMED`가 아니면, **규칙 5**에 따라 사람에게 "Vercel Preview(또는 로컬 브라우저)로 이 Wave의 화면을 확인했는가"를 명시적으로 묻는다. 확인을 받으면 `checkpoint_result: "CONFIRMED"`, `status: "completed"`로 갱신하고 `WAVE_COMPLETE`를 출력한다. 확인을 받지 못했으면(또는 이번 실행에서 방금 모든 Task가 끝난 참이라 아직 못 물어봤으면) `WAITING_FOR_PREVIEW`를 출력하고 **다음 Wave를 자동 실행하지 않고** 종료한다.

### `--resume` — 첫 pending 또는 blocked Task부터 다시 시작

- 기본 동작과 같은 단계(1~8)를 그대로 따르되, **3단계("이미 blocked인 Wave 보호")를 건너뛴다** — Wave가 `blocked` 상태여도 막혔던 Task(및 그 뒤에 이어지는 `READY` Task)부터 다시 시도하는 것이 이 옵션의 목적이다.
- Wave의 모든 Task가 이미 `DONE`이고 `checkpoint_required: true`, `checkpoint_result`가 아직 `CONFIRMED`가 아닌 상태에서 `--resume`을 실행하면, 8단계의 사람 확인 절차만 다시 수행한다(Task를 다시 구현하지 않는다).
- 막혔던 Task가 이번에도 `READY_TO_IMPLEMENT`가 아니면, 다시 그 자리에서 멈추고 같은 이유를 보고한다(무한 재시도하지 않음 — 사람이 원인을 고친 뒤 다시 `--resume`을 호출해야 한다).

## 공통 제약

- 자동 Git Branch 생성, 자동 PR 생성, 자동 Merge를 이 Command의 어떤 동작도 수행하지 않는다(**규칙 6**).
- `implement-task`가 사용자의 명시적 요청에 따라 Task 단위 Commit까지 하더라도, `run-wave`는 그 이상(Push/PR/Merge)을 대신하지 않는다.
- Wave 진행 중 어떤 이유로든 검증이 실패하거나 Task가 막히면 다음 Task로 넘어가지 않고 그 자리에서 멈춰 사람이 볼 수 있게 보고한다(**규칙 2**).
- Preview Checkpoint가 필요한 Wave는 사람의 확인 없이 다음 Wave로 자동 진행하지 않는다(**규칙 5**, `CLAUDE.md` 규칙 22).

## 종료 보고 (기본 동작·`--resume` 공통)

매 실행 종료 시 다음 5가지를 항상 보고한다:

1. **완료 Task** — 이번 실행에서 새로 `DONE`이 된 Task ID 목록(없으면 "없음").
2. **변경 파일** — 이번 실행에서 `/implement-task`가 실제로 수정·생성한 파일 목록(Task별 Expected Files 기준으로 취합).
3. **통과한 검사** — Task별로 실행되고 PASS한 Unit Test/Playwright Smoke 이름.
4. **남은 수동 Browser 확인** — 이 Wave 또는 아직 도달하지 못한 이후 Wave 중 `checkpoint_required: true`이면서 `checkpoint_result`가 `CONFIRMED`가 아닌 것이 있으면 그 Wave ID를 명시(없으면 "없음").
5. **다음에 입력할 명령** — 상황별로 정확히 하나를 제시한다: 막혔으면 `/run-wave <WAVE_ID> --resume`(원인을 고친 뒤), Preview 대기 중이면 확인 후 `/run-wave <WAVE_ID> --resume`, 이 Wave가 완료됐으면 `TASKS/WAVE_PLAN.md`상 다음 Wave ID로 `/run-wave <다음 WAVE_ID>`.

`--dry-run`/`--status`는 위 5개 대신 각자의 미리보기/현황 표만 보고한다(둘 다 상태를 바꾸지 않으므로 "다음에 입력할 명령"은 있으면 참고로만 덧붙인다).
