#!/usr/bin/env python3
"""Audit the generated Wave plan (TASKS/WAVE_PLAN.md + TASKS/WAVE_STATE.json)
against TASKS/TASK_MANIFEST.csv's real dependency graph.

This is a read-only audit of scripts/build_waves.py's *output*, not a trust
of its internals — it recomputes wave/position ordering directly from
TASKS/WAVE_PLAN.md and TASKS/WAVE_STATE.json and cross-checks every
dependency edge in TASKS/TASK_MANIFEST.csv against that ordering, so a bug
in build_waves.py would still be caught here.

Reads:
    TASKS/WAVE_PLAN.md
    TASKS/WAVE_STATE.json
    TASKS/TASK_MANIFEST.csv

Writes: nothing. This script never edits TASKS/** or application code; if it
reports FAIL, the Wave documents/manifest are fixed by hand and this script
is re-run to confirm.

Checks (see the audit request that produced this script):
    1. Every Task in TASK_MANIFEST.csv appears in exactly one Wave.
    2. Every dependency sits earlier in the same Wave, or in an earlier
       Wave, than the Task that depends on it.
    3. Each of the 5 Page Owner Tasks is the last Task of the last Wave in
       its screen's Wave Group.
    4. TASK-PAGE-SCR003 comes after COMP-SCR003-INTRO-TABS,
       COMP-SCR003-FLIGHT-FORM, COMP-SCR003-HOTEL-FORM and
       COMP-SCR003-MATE-COMPOSER.
    5. TASK-PAGE-SCR004 comes after COMP-SCR004-POST-LIST,
       COMP-SCR004-POST-DETAIL and COMP-SCR004-APPLY-FLOW.
    6. E2E-PUBLIC-SMOKE / E2E-TRAVEL-TOOLS / E2E-MATE-AUTH each come after
       all 5 Page Owner Tasks.
    7. RELEASE-CHECK-VERCEL-SUPABASE comes after every Task it actually
       depends on (per TASK_MANIFEST.csv's Depends On column).
    8. The Wave ID -> Task ID list in TASKS/WAVE_PLAN.md matches
       TASKS/WAVE_STATE.json exactly (same Waves, same Tasks, same order).
    9. No EC2/AWS/auto-Merge Task is present in either Wave document.

On success: prints VALIDATE_WAVES_PASS and the check count, exit 0.
On failure: prints VALIDATE_WAVES_FAIL with the failing check(s) and exact
reason, exit 1.

Usage:
    python scripts/validate_waves.py
    python3 scripts/validate_waves.py
"""

from __future__ import annotations

import csv
import io
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TASKS_DIR = REPO_ROOT / "TASKS"
WAVE_PLAN_MD = TASKS_DIR / "WAVE_PLAN.md"
WAVE_STATE_JSON = TASKS_DIR / "WAVE_STATE.json"
MANIFEST_CSV = TASKS_DIR / "TASK_MANIFEST.csv"

FORBIDDEN_KEYWORDS = ["EC2", "AWS", "자동 Merge", "Merge Runner", "머지 러너"]
NON_LIST_CELL_VALUES = {"", "—", "-", "N/A", "없음"}


class CheckResult:
    def __init__(self, number: int, name: str) -> None:
        self.number = number
        self.name = name
        self.messages: list[str] = []

    def fail(self, msg: str) -> None:
        self.messages.append(msg)

    @property
    def ok(self) -> bool:
        return not self.messages


class Audit:
    def __init__(self) -> None:
        self.results: list[CheckResult] = []

    def run(self, number: int, name: str, fn) -> CheckResult:
        r = CheckResult(number, name)
        fn(r)
        self.results.append(r)
        return r

    @property
    def ok(self) -> bool:
        return all(r.ok for r in self.results)


def read_text(path: Path) -> str:
    if not path.is_file():
        raise SystemExit(f"required input missing: {path.relative_to(REPO_ROOT)}")
    return path.read_text(encoding="utf-8")


def split_cell(cell: str | None) -> list[str]:
    cell = (cell or "").strip()
    if cell in NON_LIST_CELL_VALUES:
        return []
    return [p.strip() for p in cell.split(";") if p.strip()]


# --- load inputs -----------------------------------------------------------

WAVE_ROW_RE = re.compile(
    r"^\|\s*(W\d+)\s*\|\s*(.*?)\s*\|\s*(\d+)\s*\|\s*(.*?)\s*\|\s*(예|아니오)\s*\|\s*$",
    re.MULTILINE,
)


def parse_wave_plan_md(text: str) -> list[dict]:
    waves = []
    for m in WAVE_ROW_RE.finditer(text):
        wave_id, title, count_s, task_cell, checkpoint = m.groups()
        task_ids = [t.strip() for t in task_cell.split(";") if t.strip()]
        waves.append({
            "wave_id": wave_id,
            "title": title,
            "count": int(count_s),
            "task_ids": task_ids,
            "checkpoint_required": checkpoint == "예",
        })
    return waves


def load_wave_state(text: str) -> list[dict]:
    data = json.loads(text)
    return data.get("waves", [])


def load_manifest(text: str) -> dict[str, dict]:
    reader = csv.DictReader(io.StringIO(text))
    tasks: dict[str, dict] = {}
    for row in reader:
        tid = (row.get("Task ID") or "").strip()
        if not tid:
            continue
        tasks[tid] = {
            "id": tid,
            "category": (row.get("Category") or "").strip(),
            "screen": (row.get("Screen") or "").strip(),
            "depends_on": split_cell(row.get("Depends On")),
            "wave_id": (row.get("wave_id") or "").strip(),
        }
    return tasks


# --- position index used by checks 2, 3, 4, 5, 6, 7 -------------------------

def build_position_index(waves: list[dict]) -> tuple[dict[str, int], dict[str, int]]:
    """From the Wave-document order (list index = execution order of Waves,
    and task_ids order within a Wave = execution order of Tasks), return
    (wave_index_of[task_id], position_in_wave_of[task_id])."""
    wave_index_of: dict[str, int] = {}
    position_in_wave_of: dict[str, int] = {}
    for w_idx, wave in enumerate(waves):
        for pos, tid in enumerate(wave["task_ids"]):
            wave_index_of[tid] = w_idx
            position_in_wave_of[tid] = pos
    return wave_index_of, position_in_wave_of


def before(wave_index_of, position_in_wave_of, dep: str, dependent: str) -> bool:
    """True if dep is validly ordered before dependent (earlier Wave, or
    same Wave at an earlier position)."""
    if dep not in wave_index_of or dependent not in wave_index_of:
        return False
    wd, wt = wave_index_of[dep], wave_index_of[dependent]
    if wd < wt:
        return True
    if wd == wt:
        return position_in_wave_of[dep] < position_in_wave_of[dependent]
    return False


def main() -> int:
    plan_text = read_text(WAVE_PLAN_MD)
    state_text = read_text(WAVE_STATE_JSON)
    manifest_text = read_text(MANIFEST_CSV)

    plan_waves = parse_wave_plan_md(plan_text)
    state_waves = load_wave_state(state_text)
    tasks = load_manifest(manifest_text)

    if not plan_waves:
        raise SystemExit("could not parse any Wave row out of TASKS/WAVE_PLAN.md")
    if not state_waves:
        raise SystemExit("TASKS/WAVE_STATE.json has no waves[]")
    if not tasks:
        raise SystemExit("TASKS/TASK_MANIFEST.csv has no data rows")

    wave_index_of, position_in_wave_of = build_position_index(plan_waves)
    all_task_ids = set(tasks.keys())

    audit = Audit()

    # --- Check 1: every Task in exactly one Wave ---------------------------
    def check_1(r: CheckResult) -> None:
        seen_count: dict[str, int] = {}
        for wave in plan_waves:
            for tid in wave["task_ids"]:
                seen_count[tid] = seen_count.get(tid, 0) + 1
        missing = sorted(all_task_ids - set(seen_count))
        extra = sorted(set(seen_count) - all_task_ids)
        duplicated = sorted(tid for tid, c in seen_count.items() if c > 1)
        if missing:
            r.fail(f"Task(s) in TASK_MANIFEST.csv but in no Wave: {missing}")
        if extra:
            r.fail(f"Task ID(s) in a Wave but not in TASK_MANIFEST.csv: {extra}")
        if duplicated:
            r.fail(f"Task ID(s) placed in more than one Wave: {duplicated}")

    audit.run(1, "모든 Task가 정확히 한 Wave에 들어갔는가", check_1)

    # --- Check 2: dependency ordering ---------------------------------------
    def check_2(r: CheckResult) -> None:
        for tid, task in tasks.items():
            for dep in task["depends_on"]:
                if dep not in all_task_ids:
                    r.fail(f"{tid}: Depends On references unknown Task ID {dep!r}")
                    continue
                if not before(wave_index_of, position_in_wave_of, dep, tid):
                    r.fail(
                        f"{tid} depends on {dep}, but {dep} is not ordered before it "
                        f"(wave {wave_index_of.get(dep)} vs {wave_index_of.get(tid)})"
                    )

    audit.run(2, "모든 dependency가 같은 Wave의 앞 Task 또는 앞 Wave에 있는가", check_2)

    # --- Check 3: Page Owner is the last Task of the last Wave in its group -
    def check_3(r: CheckResult) -> None:
        page_owners = {tid: t for tid, t in tasks.items() if t["category"] == "page_owner"}
        if len(page_owners) != 5:
            r.fail(f"expected exactly 5 page_owner Tasks, found {len(page_owners)}: {sorted(page_owners)}")
        for tid, task in page_owners.items():
            screen = task["screen"]
            if tid not in wave_index_of:
                r.fail(f"{tid}: not found in any Wave")
                continue
            own_wave_idx = wave_index_of[tid]
            own_wave = plan_waves[own_wave_idx]
            if own_wave["task_ids"][-1] != tid:
                r.fail(f"{tid}: not the last Task of its Wave {own_wave['wave_id']} ({own_wave['task_ids']})")
            # find every Wave that contains a Task belonging to the same screen
            same_screen_waves = [
                w_idx for w_idx, wave in enumerate(plan_waves)
                if any(tasks.get(t2, {}).get("screen") == screen for t2 in wave["task_ids"])
            ]
            if same_screen_waves and max(same_screen_waves) != own_wave_idx:
                later = plan_waves[max(same_screen_waves)]["wave_id"]
                r.fail(f"{tid}: a later Wave ({later}) still contains {screen} Tasks after this Page Owner's Wave ({own_wave['wave_id']})")

    audit.run(3, "Page Owner 5개가 각 Screen 그룹의 마지막 Wave, 마지막 Task에 있는가", check_3)

    # --- Check 4: SCR-003 Page Owner after its 4 named components ----------
    def check_4(r: CheckResult) -> None:
        required = [
            "COMP-SCR003-INTRO-TABS",
            "COMP-SCR003-FLIGHT-FORM",
            "COMP-SCR003-HOTEL-FORM",
            "COMP-SCR003-MATE-COMPOSER",
        ]
        for dep in required:
            if not before(wave_index_of, position_in_wave_of, dep, "TASK-PAGE-SCR003"):
                r.fail(f"TASK-PAGE-SCR003 is not ordered after {dep}")

    audit.run(4, "SCR-003 Page Owner가 여행 입력·항공·숙소·동행 작성 Component 뒤에 있는가", check_4)

    # --- Check 5: SCR-004 Page Owner after its 3 named components ----------
    def check_5(r: CheckResult) -> None:
        required = ["COMP-SCR004-POST-LIST", "COMP-SCR004-POST-DETAIL", "COMP-SCR004-APPLY-FLOW"]
        for dep in required:
            if not before(wave_index_of, position_in_wave_of, dep, "TASK-PAGE-SCR004"):
                r.fail(f"TASK-PAGE-SCR004 is not ordered after {dep}")

    audit.run(5, "SCR-004 Page Owner가 목록·상세·신청 Component 뒤에 있는가", check_5)

    # --- Check 6: Playwright Tasks after all 5 Page Owners ------------------
    def check_6(r: CheckResult) -> None:
        page_owner_ids = ["TASK-PAGE-SCR001", "TASK-PAGE-SCR002", "TASK-PAGE-SCR003", "TASK-PAGE-SCR004", "TASK-PAGE-SCR005"]
        for e2e_id in ["E2E-PUBLIC-SMOKE", "E2E-TRAVEL-TOOLS", "E2E-MATE-AUTH"]:
            if e2e_id not in wave_index_of:
                r.fail(f"{e2e_id}: not found in any Wave")
                continue
            for po in page_owner_ids:
                if not before(wave_index_of, position_in_wave_of, po, e2e_id):
                    r.fail(f"{e2e_id} is not ordered after {po}")

    audit.run(6, "Playwright Task가 5개 Page Owner 뒤에 있는가", check_6)

    # --- Check 7: Vercel Preview/Release Task after its real dependencies ---
    def check_7(r: CheckResult) -> None:
        tid = "RELEASE-CHECK-VERCEL-SUPABASE"
        if tid not in tasks:
            r.fail(f"{tid}: not found in TASK_MANIFEST.csv")
            return
        deps = tasks[tid]["depends_on"]
        if not deps:
            r.fail(f"{tid}: has no Depends On in TASK_MANIFEST.csv — cannot confirm it follows required infra Tasks")
        for dep in deps:
            if not before(wave_index_of, position_in_wave_of, dep, tid):
                r.fail(f"{tid} is not ordered after its dependency {dep}")

    audit.run(7, "Vercel Preview 확인 Task가 필요한 인프라 Task 뒤에 있는가", check_7)

    # --- Check 8: WAVE_PLAN.md <-> WAVE_STATE.json consistency -------------
    def check_8(r: CheckResult) -> None:
        plan_by_id = {w["wave_id"]: w["task_ids"] for w in plan_waves}
        state_by_id = {w.get("wave_id"): w.get("task_ids", []) for w in state_waves}
        if set(plan_by_id) != set(state_by_id):
            r.fail(
                f"Wave ID sets differ — WAVE_PLAN.md: {sorted(plan_by_id)}, "
                f"WAVE_STATE.json: {sorted(k for k in state_by_id if k)}"
            )
        for wave_id in sorted(set(plan_by_id) & set(state_by_id)):
            if plan_by_id[wave_id] != state_by_id[wave_id]:
                r.fail(
                    f"{wave_id}: Task list differs — WAVE_PLAN.md {plan_by_id[wave_id]} "
                    f"vs WAVE_STATE.json {state_by_id[wave_id]}"
                )
        # also cross-check each Wave's inner tasks[] task_id set matches task_ids
        for wave in state_waves:
            inner_ids = [t.get("task_id") for t in wave.get("tasks", [])]
            if inner_ids != wave.get("task_ids", []):
                r.fail(f"{wave.get('wave_id')}: WAVE_STATE.json tasks[] order/membership differs from task_ids")

    audit.run(8, "Wave ID와 Task 목록이 WAVE_PLAN.md와 WAVE_STATE.json에서 일치하는가", check_8)

    # --- Check 9: no EC2/AWS/auto-Merge Task in either Wave document -------
    def check_9(r: CheckResult) -> None:
        for label, text in (("TASKS/WAVE_PLAN.md", plan_text), ("TASKS/WAVE_STATE.json", state_text)):
            for kw in FORBIDDEN_KEYWORDS:
                if kw in text:
                    r.fail(f"{label} contains forbidden keyword {kw!r}")
        for tid in all_task_ids:
            upper = tid.upper()
            if "EC2" in upper or "AWS" in upper or "MERGE" in upper:
                r.fail(f"Task ID looks EC2/AWS/Merge-related: {tid}")

    audit.run(9, "EC2·AWS·자동 Merge Task가 섞이지 않았는가", check_9)

    if audit.ok:
        print("VALIDATE_WAVES_PASS")
        print(f"{len(audit.results)}/{len(audit.results)} checks passed")
        return 0

    print("VALIDATE_WAVES_FAIL")
    passed = sum(1 for r in audit.results if r.ok)
    print(f"{passed}/{len(audit.results)} checks passed")
    print()
    for r in audit.results:
        if not r.ok:
            print(f"[Check {r.number}] {r.name}")
            for m in r.messages:
                print(f"    - {m}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
