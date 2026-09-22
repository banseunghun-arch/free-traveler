#!/usr/bin/env python3
"""Build the Wave execution plan for the Traveler task pipeline.

Reads:
    TASKS/TASK_MANIFEST.csv
    TASKS/TASK-*.md                      (see note below)
    design-reference/SCREEN_ROUTE_CONTRACT.json

Note on input path: the spec that requested this script names
TASKS/details/TASK-*.md as an input, but no TASKS/details/ directory exists
in this repo. The real /gen-task-details output is flat TASKS/TASK-<ID>.md
files (verified against scripts/audit_tasks.py, which reads the same flat
location). This script reads that real, flat location instead of inventing a
details/ directory that nothing else in the pipeline produces.

Writes:
    TASKS/TASK_DAG.md
    TASKS/WAVE_PLAN.md
    TASKS/WAVE_STATE.json
    TASKS/TASK_MANIFEST.csv              (rewritten in place with a wave_id
                                           column added; every other column
                                           and row is preserved exactly as
                                           read)

Rules implemented (see the request that produced this script):
    1. Circular dependencies are detected across the *entire* 67-task graph
       (Kahn's algorithm); any cycle aborts the build before anything is
       written.
    2. A dependency is never placed in a Wave that comes after the Wave of
       the task that depends on it. This is enforced twice: once coarsely by
       processing the 10 Wave Groups in a fixed order (checked explicitly —
       see check_group_order()), and once at Task granularity inside each
       group (topological order + the same-Wave check in rule 6 below).
    3. Each Wave holds 4-7 Tasks by default. This is a soft target, not a
       hard rule: rules 2, 4, 5 and 6 always win over hitting the target
       size, and the last Wave of a group may fall outside the range.
    4. A screen's Page Owner Task always closes the last Wave of that
       screen's Wave Group (build_wave_sequence() force-closes the current
       Wave immediately after appending a page_owner Task).
    5. Two Tasks that both touch the same Expected File are never placed in
       the same Wave (checked against TASK_MANIFEST.csv's Expected Files
       column).
    6. Within one Wave, Tasks execute one at a time in plain Task-ID
       alphabetical order (CLAUDE.md rule 7 / .claude/commands/run-wave.md).
       Because Task IDs are not always alphabetically consistent with
       dependency order (e.g. DB-RLS-BASE depends on DB-SCHEMA-BASE but
       sorts before it), this script checks, for every dependency edge, that
       the dependency's Task ID sorts strictly before the dependent's Task
       ID whenever both land in the same Wave; if not, the dependent Task is
       pushed into a new Wave instead of silently accepting a wrong
       execution order.
    7. No multi-pass "try again up to N times" auto-fix machinery: Wave
       assignment is a single deterministic forward pass (see
       build_wave_sequence()) that provably terminates in at most
       len(group_tasks) Wave-closes.
    8. This script never touches Git and never creates a branch, PR, or
       merge; it only reads TASKS/**/design-reference/** and writes the four
       artifacts listed above.

On success: prints BUILD_WAVES_PASS plus the cyclic-dependency count, the
per-Wave Task count, and each Page Owner's Wave position, then exits 0.

On failure (a cycle, a Task that cannot be classified into any of the 10
Wave Groups, a Depends On edge that cannot be resolved to a real Task ID, a
Wave Group processed out of the fixed order, or a Depends On mismatch
between TASK_MANIFEST.csv and a Task's own detail file): prints
BUILD_WAVES_FAIL with the exact reason and exits 1. No output file is
written on failure — a bad run never leaves a partially-correct Wave plan on
disk.

Usage:
    python scripts/build_waves.py
    python3 scripts/build_waves.py
"""

from __future__ import annotations

import csv
import io
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TASKS_DIR = REPO_ROOT / "TASKS"
MANIFEST_CSV = TASKS_DIR / "TASK_MANIFEST.csv"
SCREEN_ROUTE_CONTRACT_JSON = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
DAG_MD = TASKS_DIR / "TASK_DAG.md"
WAVE_PLAN_MD = TASKS_DIR / "WAVE_PLAN.md"
WAVE_STATE_JSON = TASKS_DIR / "WAVE_STATE.json"

MAX_WAVE_SIZE = 7
MIN_WAVE_SIZE_HINT = 4  # informational only; never used to force a split

GROUP_1_10_TITLES = {
    1: "Scaffold, 문서, Harness 확인",
    2: "공통 UI(D-001 디자인 토큰 기반)·정적 데이터·Layout",
    3: "Supabase Auth, 6개 Table, 기본 RLS",
    9: "Unit·Playwright·접근성·CI",
    10: "Vercel Preview와 Release 확인",
}
RELEASE_CHECK_TASK_ID = "RELEASE-CHECK-VERCEL-SUPABASE"
NON_LIST_CELL_VALUES = {"", "—", "-", "N/A", "없음"}


class BuildError(Exception):
    """Raised for any condition that must abort the build without writing output."""


def read_text(path: Path, what: str) -> str:
    if not path.is_file():
        raise BuildError(f"required input missing: {what} ({path.relative_to(REPO_ROOT)})")
    return path.read_text(encoding="utf-8")


def split_cell(cell: str | None) -> list[str]:
    cell = (cell or "").strip()
    if cell in NON_LIST_CELL_VALUES:
        return []
    return [p.strip() for p in cell.split(";") if p.strip()]


# --- Step 1: load TASKS/TASK_MANIFEST.csv -------------------------------

def load_manifest() -> tuple[dict, list[str]]:
    text = read_text(MANIFEST_CSV, "TASKS/TASK_MANIFEST.csv")
    reader = csv.DictReader(io.StringIO(text))
    fieldnames = list(reader.fieldnames or [])
    for required in ("Task ID", "Category", "Screen", "Depends On", "Expected Files", "Detail File Exists"):
        if required not in fieldnames:
            raise BuildError(f"TASK_MANIFEST.csv is missing required column: {required}")

    tasks: dict[str, dict] = {}
    raw_rows: list[dict] = []
    for row in reader:
        tid = (row.get("Task ID") or "").strip()
        if not tid:
            continue
        if tid in tasks:
            raise BuildError(f"duplicate Task ID in TASK_MANIFEST.csv: {tid}")
        raw_rows.append(row)
        tasks[tid] = {
            "id": tid,
            "category": (row.get("Category") or "").strip(),
            "screen": (row.get("Screen") or "").strip(),
            "depends_on": split_cell(row.get("Depends On")),
            "expected_files": set(split_cell(row.get("Expected Files"))),
            "detail_file_exists": (row.get("Detail File Exists") or "").strip().lower(),
        }
    if not tasks:
        raise BuildError("TASK_MANIFEST.csv has no data rows")

    # every Depends On id must resolve to a real Task ID in this same manifest
    for tid, task in tasks.items():
        for dep in task["depends_on"]:
            if dep not in tasks:
                raise BuildError(f"{tid}: Depends On references unknown Task ID {dep!r}")

    return tasks, raw_rows


# --- Step 2: cross-check each Task's own detail file --------------------

DEPENDS_HEADING_RE = re.compile(r"^##\s+Depends On\s*$", re.MULTILINE)
NEXT_HEADING_RE = re.compile(r"^##\s+\S", re.MULTILINE)
BULLET_RE = re.compile(r"^-\s*(\S.*?)\s*$", re.MULTILINE)


def detail_filename(task_id: str) -> str:
    """TASKS/TASK-<ID>.md, with a leading 'TASK-' collapsed to one (so
    TASK-PAGE-SCR001's own file is TASK-PAGE-SCR001.md, not
    TASK-TASK-PAGE-SCR001.md) — same rule /gen-task-details already uses."""
    return f"{task_id}.md" if task_id.startswith("TASK-") else f"TASK-{task_id}.md"


def cross_check_detail_files(tasks: dict) -> None:
    for tid, task in tasks.items():
        if task["detail_file_exists"] != "yes":
            raise BuildError(
                f"{tid}: TASK_MANIFEST.csv Detail File Exists={task['detail_file_exists']!r} "
                "(run /gen-task-details and /audit-tasks before build_waves.py)"
            )
        detail_path = TASKS_DIR / detail_filename(tid)
        text = read_text(detail_path, f"{tid} detail file")
        m = DEPENDS_HEADING_RE.search(text)
        if not m:
            raise BuildError(f"{tid}: detail file has no '## Depends On' section ({detail_path.name})")
        rest = text[m.end():]
        nxt = NEXT_HEADING_RE.search(rest)
        section = rest[: nxt.start()] if nxt else rest
        bullets = [b.strip() for b in BULLET_RE.findall(section)]
        detail_ids = {b for b in bullets if b not in NON_LIST_CELL_VALUES}
        manifest_ids = set(task["depends_on"])
        if detail_ids != manifest_ids:
            raise BuildError(
                f"{tid}: Depends On mismatch — TASK_MANIFEST.csv has {sorted(manifest_ids)}, "
                f"{detail_path.name} has {sorted(detail_ids)}"
            )


# --- Step 3: cycle detection over the full 67-task graph -----------------

def detect_cycle(tasks: dict) -> list[str]:
    """Kahn's algorithm over the full graph. Returns the list of Task IDs
    still stuck with a positive in-degree after the algorithm stalls (empty
    list means no cycle)."""
    indegree = {tid: 0 for tid in tasks}
    dependents: dict[str, list[str]] = {tid: [] for tid in tasks}
    for tid, task in tasks.items():
        for dep in task["depends_on"]:
            indegree[tid] += 1
            dependents[dep].append(tid)

    ready = sorted(tid for tid, d in indegree.items() if d == 0)
    resolved = 0
    while ready:
        nxt = ready.pop(0)
        resolved += 1
        for dependent in dependents[nxt]:
            indegree[dependent] -= 1
            if indegree[dependent] == 0:
                ready.append(dependent)
        ready.sort()

    if resolved == len(tasks):
        return []
    return sorted(tid for tid, d in indegree.items() if d > 0)


# --- Step 4: classify every Task into one of the 10 Wave Groups -----------

def load_screen_order() -> list[str]:
    text = read_text(SCREEN_ROUTE_CONTRACT_JSON, "design-reference/SCREEN_ROUTE_CONTRACT.json")
    data = json.loads(text)
    screens = data.get("screens", [])
    ids = [s["screen_id"] for s in screens]
    if ids != ["SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"]:
        raise BuildError(f"unexpected screen order/list in SCREEN_ROUTE_CONTRACT.json: {ids}")
    return ids


def classify(tasks: dict, screen_order: list[str]) -> dict[str, int]:
    # Wave Group 4..8 map 1:1 to SCREEN_ROUTE_CONTRACT.json's screens[] order.
    screen_to_group = {screen_id: 4 + i for i, screen_id in enumerate(screen_order)}
    group_of: dict[str, int] = {}
    unclassified: list[str] = []

    for tid, task in tasks.items():
        category = task["category"]
        screen = task["screen"]
        if tid == RELEASE_CHECK_TASK_ID:
            group_of[tid] = 10
        elif category in {"unit_test", "integration_test", "e2e", "ci", "manual"}:
            group_of[tid] = 9
        elif category in {"db", "auth", "api"}:
            group_of[tid] = 3
        elif category == "data":
            group_of[tid] = 2
        elif category in {"page_owner", "component"}:
            if not screen:
                group_of[tid] = 2  # global component
            elif screen in screen_to_group:
                group_of[tid] = screen_to_group[screen]
            else:
                unclassified.append(tid)
        else:
            unclassified.append(tid)

    if unclassified:
        raise BuildError(f"could not classify into a Wave Group: {sorted(unclassified)}")
    return group_of


def check_group_order(tasks: dict, group_of: dict[str, int]) -> None:
    violations = []
    for tid, task in tasks.items():
        for dep in task["depends_on"]:
            if group_of[dep] > group_of[tid]:
                violations.append(f"{tid}(group {group_of[tid]}) depends on {dep}(group {group_of[dep]})")
    if violations:
        raise BuildError("Wave Group order violated by dependency edge(s): " + "; ".join(violations))


# --- Step 5: build the Wave sequence within one group ---------------------

def topo_order_group(group_task_ids: list[str], tasks: dict) -> list[str]:
    ids = set(group_task_ids)
    indegree = {tid: 0 for tid in group_task_ids}
    dependents: dict[str, list[str]] = {tid: [] for tid in group_task_ids}
    for tid in group_task_ids:
        for dep in tasks[tid]["depends_on"]:
            if dep in ids:
                indegree[tid] += 1
                dependents[dep].append(tid)

    ready = sorted(tid for tid, d in indegree.items() if d == 0)
    order: list[str] = []
    while ready:
        nxt = ready.pop(0)
        order.append(nxt)
        for dependent in dependents[nxt]:
            indegree[dependent] -= 1
            if indegree[dependent] == 0:
                ready.append(dependent)
        ready.sort()
    assert len(order) == len(group_task_ids), "group-local cycle (should be impossible after global cycle check)"
    return order


def build_wave_sequence(order: list[str], tasks: dict, page_owner_ids: set[str]) -> list[list[str]]:
    waves: list[list[str]] = []
    current: list[str] = []
    current_files: set[str] = set()

    for tid in order:
        deps_in_current = [d for d in tasks[tid]["depends_on"] if d in current]
        id_order_violated = any(d >= tid for d in deps_in_current)
        file_conflict = bool(tasks[tid]["expected_files"] & current_files)
        size_exceeded = len(current) >= MAX_WAVE_SIZE

        if current and (id_order_violated or file_conflict or size_exceeded):
            waves.append(current)
            current, current_files = [], set()

        current.append(tid)
        current_files |= tasks[tid]["expected_files"]

        if tid in page_owner_ids:
            # Rule 4: a screen's Page Owner always closes its Wave.
            waves.append(current)
            current, current_files = [], set()

    if current:
        waves.append(current)
    return waves


def verify_wave_sequence(waves: list[list[str]], tasks: dict) -> None:
    """Defensive re-check of rules 2/5/6 against the waves actually built."""
    wave_of = {tid: i for i, wave in enumerate(waves) for tid in wave}
    for tid, task in tasks.items():
        if tid not in wave_of:
            continue
        for dep in task["depends_on"]:
            if dep not in wave_of:
                continue
            if wave_of[dep] > wave_of[tid]:
                raise BuildError(f"rule 2 violated after build: {dep} placed after {tid} which depends on it")
            if wave_of[dep] == wave_of[tid] and dep >= tid:
                raise BuildError(
                    f"rule 6 violated after build: {dep} and {tid} share a Wave but "
                    f"Task-ID order would run {tid} before its dependency {dep}"
                )
    for wave in waves:
        seen_files: dict[str, str] = {}
        for tid in wave:
            for f in tasks[tid]["expected_files"]:
                if f in seen_files and seen_files[f] != tid:
                    raise BuildError(f"rule 5 violated after build: {seen_files[f]} and {tid} share Wave and file {f}")
                seen_files[f] = tid


# --- Step 6: assemble the full plan across all 10 groups ------------------

def build_plan(tasks: dict, group_of: dict[str, int], screen_order: list[str]) -> list[dict]:
    page_owner_ids = {tid for tid, t in tasks.items() if t["category"] == "page_owner"}
    group_titles = dict(GROUP_1_10_TITLES)
    for i, screen_id in enumerate(screen_order):
        group_titles[4 + i] = f"{screen_id} Component와 Page Owner"

    plan: list[dict] = []
    wave_counter = 0
    for group_id in range(1, 11):
        group_task_ids = sorted(tid for tid, g in group_of.items() if g == group_id)
        if not group_task_ids:
            continue  # e.g. Group 1: no Task IDs exist yet for scaffold/harness
        order = topo_order_group(group_task_ids, tasks)
        waves = build_wave_sequence(order, tasks, page_owner_ids)
        for wave_tasks in waves:
            wave_counter += 1
            plan.append({
                "wave_id": f"W{wave_counter:02d}",
                "group_id": group_id,
                "title": group_titles[group_id],
                "task_ids": wave_tasks,
            })

    all_waves = [w["task_ids"] for w in plan]
    verify_wave_sequence(all_waves, tasks)

    # checkpoint: any Wave containing a Page Owner, plus the final Wave overall
    for i, wave in enumerate(plan):
        has_page_owner = any(tid in page_owner_ids for tid in wave["task_ids"])
        wave["checkpoint_required"] = bool(has_page_owner or i == len(plan) - 1)

    return plan


# --- Step 7: write outputs -------------------------------------------------

def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def write_task_dag_md(tasks: dict, group_of: dict[str, int], plan: list[dict], screen_order: list[str]) -> None:
    lines = []
    lines.append("# Free Traveler — Task Dependency DAG")
    lines.append("")
    lines.append("| 항목 | 내용 |")
    lines.append("|---|---|")
    lines.append("| Document ID | DAG-TRAVEL-001 |")
    lines.append("| 생성 도구 | `scripts/build_waves.py` |")
    lines.append(f"| 생성 시각 | {now_iso()} |")
    lines.append(f"| 소스 Task 수 | {len(tasks)} |")
    lines.append("| 순환 의존성 수 | 0 |")
    lines.append(f"| 총 Wave 수 | {len(plan)} |")
    lines.append("")
    lines.append("> 이 문서는 `scripts/build_waves.py`가 매 실행마다 재생성한다. 손으로 편집하지 않는다.")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Wave Group 분류")
    lines.append("")
    lines.append("| Group | 제목 | Task 수 | 분류 규칙 |")
    lines.append("|---|---|---|---|")
    group_titles = dict(GROUP_1_10_TITLES)
    for i, screen_id in enumerate(screen_order):
        group_titles[4 + i] = f"{screen_id} Component와 Page Owner"
    rule_text = {
        1: "Task 없음(Scaffold/Harness는 CLAUDE.md·SKILL.md·scripts/validate_harness.py로 이미 검증됨)",
        2: "category=data, 또는 category=component이면서 Screen 없음(전역 Component)",
        3: "category in {db, auth, api}",
        9: "category in {unit_test, integration_test, e2e, ci, manual} (RELEASE-CHECK-VERCEL-SUPABASE 제외)",
        10: f"Task ID == {RELEASE_CHECK_TASK_ID}",
    }
    for i, screen_id in enumerate(screen_order):
        rule_text[4 + i] = f"Screen == {screen_id} (category in {{page_owner, component}})"
    for group_id in range(1, 11):
        count = sum(1 for g in group_of.values() if g == group_id)
        lines.append(f"| {group_id} | {group_titles[group_id]} | {count} | {rule_text[group_id]} |")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 순환 의존성 검사")
    lines.append("")
    lines.append("Kahn 위상 정렬로 전체 67개 Task가 모두 정렬됨 — 순환 의존성 0건.")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Dependency Edge 목록")
    lines.append("")
    lines.append("| Task ID | Wave Group | Depends On |")
    lines.append("|---|---|---|")
    for tid in sorted(tasks):
        deps = "; ".join(tasks[tid]["depends_on"]) or "—"
        lines.append(f"| {tid} | {group_of[tid]} | {deps} |")
    lines.append("")
    DAG_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_wave_plan_md(tasks: dict, plan: list[dict], screen_order: list[str]) -> None:
    page_owner_wave = {}
    for wave in plan:
        for tid in wave["task_ids"]:
            if tasks[tid]["category"] == "page_owner":
                page_owner_wave[tid] = wave["wave_id"]

    lines = []
    lines.append("# Free Traveler — Wave Plan")
    lines.append("")
    lines.append("| 항목 | 내용 |")
    lines.append("|---|---|")
    lines.append("| Document ID | WAVEPLAN-TRAVEL-001 |")
    lines.append("| 생성 도구 | `scripts/build_waves.py` (재실행 시 이 문서를 덮어쓴다) |")
    lines.append(f"| 생성 시각 | {now_iso()} |")
    lines.append(f"| 총 Wave 수 | {len(plan)} |")
    lines.append(f"| 총 Task 수 | {len(tasks)} |")
    lines.append("")
    lines.append(
        "> Wave ID는 이 문서 생성 전에 미리 고정하지 않는다. `scripts/build_waves.py`가 실제로 "
        "산출한 Wave ID가 정본이며, `/run-wave`·`/prepare-task`·`TASKS/WAVE_STATE.json`은 이 문서를 그대로 따른다. "
        "Wave 안에서도 Task는 Task ID 알파벳 순으로 한 번에 하나씩 실행한다(CLAUDE.md 규칙 7)."
    )
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Wave 목록")
    lines.append("")
    lines.append("| Wave ID | Wave Group | Task 수 | Task ID(실행 순서) | Preview Checkpoint |")
    lines.append("|---|---|---|---|---|")
    for wave in plan:
        task_list = "; ".join(wave["task_ids"])
        checkpoint = "예" if wave["checkpoint_required"] else "아니오"
        lines.append(f"| {wave['wave_id']} | {wave['title']} | {len(wave['task_ids'])} | {task_list} | {checkpoint} |")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Page Owner Wave 위치")
    lines.append("")
    lines.append("| Screen | Page Owner Task ID | Wave ID | 해당 Wave의 마지막 Task 여부 |")
    lines.append("|---|---|---|---|")
    for screen_id in screen_order:
        tid = f"TASK-PAGE-{screen_id.replace('-', '')}"
        wid = page_owner_wave.get(tid, "—")
        is_last = "예"
        for wave in plan:
            if wave["wave_id"] == wid:
                is_last = "예" if wave["task_ids"][-1] == tid else "아니오"
        lines.append(f"| {screen_id} | {tid} | {wid} | {is_last} |")
    lines.append("")
    WAVE_PLAN_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_wave_state_json(plan: list[dict]) -> None:
    waves = []
    for wave in plan:
        waves.append({
            "wave_id": wave["wave_id"],
            "title": wave["title"],
            "task_ids": wave["task_ids"],
            "status": "pending",
            "checkpoint_required": wave["checkpoint_required"],
            "checkpoint_result": None,
            # Additive beyond the requested minimum fields: per-task status,
            # kept in the same vocabulary .claude/commands/prepare-task.md and
            # run-wave.md already use, so those commands can resume Task by
            # Task inside a Wave instead of only tracking Wave-level status.
            "tasks": [
                {"task_id": tid, "status": "READY", "updated_at": None, "note": ""}
                for tid in wave["task_ids"]
            ],
        })
    payload = {
        "schema_version": "traveler-wave-state-v1",
        "generated_at": now_iso(),
        "waves": waves,
    }
    WAVE_STATE_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def rewrite_manifest_with_wave_id(raw_rows: list[dict], tasks: dict, plan: list[dict]) -> None:
    wave_of: dict[str, str] = {}
    for wave in plan:
        for tid in wave["task_ids"]:
            wave_of[tid] = wave["wave_id"]

    text = read_text(MANIFEST_CSV, "TASKS/TASK_MANIFEST.csv")
    reader = csv.DictReader(io.StringIO(text))
    fieldnames = list(reader.fieldnames or [])
    if "wave_id" not in fieldnames:
        fieldnames = fieldnames + ["wave_id"]

    out = io.StringIO()
    writer = csv.DictWriter(out, fieldnames=fieldnames, lineterminator="\n")
    writer.writeheader()
    for row in raw_rows:
        tid = (row.get("Task ID") or "").strip()
        row = dict(row)
        row["wave_id"] = wave_of.get(tid, "")
        writer.writerow(row)
    MANIFEST_CSV.write_text(out.getvalue(), encoding="utf-8")


# --- main ------------------------------------------------------------------

def main() -> int:
    try:
        tasks, raw_rows = load_manifest()
        cross_check_detail_files(tasks)

        cyclic = detect_cycle(tasks)
        if cyclic:
            raise BuildError(f"circular dependency detected among: {cyclic}")

        screen_order = load_screen_order()
        group_of = classify(tasks, screen_order)
        check_group_order(tasks, group_of)

        plan = build_plan(tasks, group_of, screen_order)

        write_task_dag_md(tasks, group_of, plan, screen_order)
        write_wave_plan_md(tasks, plan, screen_order)
        write_wave_state_json(plan)
        rewrite_manifest_with_wave_id(raw_rows, tasks, plan)
    except BuildError as exc:
        print("BUILD_WAVES_FAIL")
        print(str(exc))
        return 1

    page_owner_ids = {tid for tid, t in tasks.items() if t["category"] == "page_owner"}
    wave_of = {tid: w["wave_id"] for w in plan for tid in w["task_ids"]}

    print("BUILD_WAVES_PASS")
    print("순환 의존성 수: 0")
    print(f"총 Wave 수: {len(plan)} (Task {len(tasks)}개)")
    print("Wave별 Task 수:")
    for wave in plan:
        checkpoint = " [Preview Checkpoint]" if wave["checkpoint_required"] else ""
        print(f"  {wave['wave_id']} ({wave['title']}): {len(wave['task_ids'])}개{checkpoint}")
    print("Page Owner 위치:")
    for tid in sorted(page_owner_ids):
        print(f"  {tid} -> {wave_of[tid]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
