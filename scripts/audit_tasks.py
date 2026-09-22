#!/usr/bin/env python3
"""Final audit for the Traveler task pipeline (18 checks).

Reads:
    TASKS/00_TASK_LIST.md
    TASKS/TASK-*.md
    docs/PROJECT_SCOPE.md
    design-reference/SCREEN_ROUTE_CONTRACT.json

Writes:
    TASKS/TASK_MANIFEST.csv      -- one row per implementation task
    TASKS/TASK_AUDIT_REPORT.md   -- all 18 checks, PASS/FAIL + detail

On success: prints "AUDIT_PASS" and the number of checks that ran, exit 0.
On failure: prints "AUDIT_FAIL" with per-check detail, exit 1.

Usage:
    python scripts/audit_tasks.py
    python3 scripts/audit_tasks.py
"""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TASK_LIST_MD = REPO_ROOT / "TASKS" / "00_TASK_LIST.md"
TASKS_DIR = REPO_ROOT / "TASKS"
PROJECT_SCOPE_MD = REPO_ROOT / "docs" / "PROJECT_SCOPE.md"
SCREEN_ROUTE_CONTRACT_JSON = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_CSV = TASKS_DIR / "TASK_MANIFEST.csv"
REPORT_MD = TASKS_DIR / "TASK_AUDIT_REPORT.md"

EXPECTED_SCREENS = ["SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"]

ALLOWED_DB_TABLES = {
    "profiles",
    "mate_posts",
    "participation_requests",
    "blocks",
    "reports",
    "external_urls",
}
# Check 12 wording is "does not GREATLY exceed the 6 base tables" (softer than
# an earlier strict "exactly 6, no more"), so a small buffer is tolerated
# before this is treated as a real scope violation.
DB_TABLE_EXTRA_TOLERANCE = 1
FORBIDDEN_TABLE_HINTS = ["audit_log", "AUDIT_LOG", "favorites 테이블", "favorites table"]

REQUIRED_DB_TASK_IDS = ["DB-SCHEMA-BASE", "DB-RLS-BASE", "DB-ACCESS", "DB-SEED-BASE"]
REQUIRED_E2E_IDS = ["E2E-PUBLIC-SMOKE", "E2E-TRAVEL-TOOLS", "E2E-MATE-AUTH"]

FORBIDDEN_KEYWORDS = ["EC2", "AWS", "자동 Merge", "Merge Runner", "머지 러너"]
# A line that both names a forbidden concept AND negates it (e.g. the standard
# "Forbidden" section boilerplate "EC2·AWS ... 구성하지 않는다") is compliant,
# not a violation -- only flag lines that lack a negation marker.
NEGATION_MARKERS = ["지 않", "않음", "금지", "없다", "없음", "말 것"]

REQ_ID_PATTERN = re.compile(r"REQ-(?:FUNC|NF)-\d{3}")
# DB task detail files declare one table per bullet as "- `table_name`(columns...)."
# Only the FIRST backticked token on a bullet line is a table name; later
# backticked tokens on the same line are column names (e.g. `is_adult`) and
# must not be counted as extra tables.
TABLE_NAME_TOKEN = re.compile(r"^-\s*`([a-z][a-z0-9_]*)`", re.MULTILINE)


# ---------------------------------------------------------------------------
# Result plumbing: exactly one entry per numbered check, in order.
# ---------------------------------------------------------------------------

class CheckResult:
    def __init__(self, number: int, name: str) -> None:
        self.number = number
        self.name = name
        self.messages: list[str] = []
        self.info: list[str] = []

    def fail(self, msg: str) -> None:
        self.messages.append(msg)

    def note(self, msg: str) -> None:
        self.info.append(msg)

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


# ---------------------------------------------------------------------------
# Parsing TASKS/00_TASK_LIST.md
# ---------------------------------------------------------------------------

SECTION_HEADER_RE = re.compile(r"^##\s+(.*)$")
PAGE_OWNER_BLOCK_RE = re.compile(r"^###\s+Seq\s+\d+\s+—\s+(TASK-PAGE-SCR\d{3})\s*$")
TABLE_ROW_RE = re.compile(
    r"^\|\s*(\d+)\s*\|\s*([A-Z][A-Z0-9\-]+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(\S+)\s*\|\s*$"
)


def _split_list_cell(cell: str) -> list[str]:
    if not cell or cell.strip() in ("—", "-", "없음", "N/A"):
        return []
    return [p.strip() for p in cell.split(",") if p.strip()]


def _first_backtick_path(cell: str) -> str:
    m = re.search(r"`([^`]+)`", cell or "")
    return m.group(1) if m else ""


def parse_task_list(text: str) -> tuple[list[dict], list[dict]]:
    tasks: list[dict] = []
    excluded: list[dict] = []

    lines = text.splitlines()
    i = 0
    current_section = ""
    in_non_impl_table = False

    while i < len(lines):
        line = lines[i]

        m_section = SECTION_HEADER_RE.match(line)
        if m_section:
            current_section = m_section.group(1)
            in_non_impl_table = current_section.startswith("NON_IMPLEMENTATION")
            i += 1
            continue

        if in_non_impl_table and line.strip().startswith("|"):
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) >= 2 and re.fullmatch(r"REQ-(?:FUNC|NF)-\d{3}", cells[0]):
                excluded.append({"id": cells[0], "reason": cells[1]})
            i += 1
            continue

        m_owner = PAGE_OWNER_BLOCK_RE.match(line)
        if m_owner:
            block_lines = []
            i += 1
            while i < len(lines) and not lines[i].startswith("### Seq") and not lines[i].startswith("## ") and lines[i].strip() != "---":
                block_lines.append(lines[i])
                i += 1
            block = "\n".join(block_lines)

            def field(name: str) -> str:
                m = re.search(rf"- \*\*{name}\*\*:\s*(.+)", block)
                return m.group(1).strip() if m else ""

            task_id = field("Task ID")
            tasks.append({
                "id": task_id,
                "title": field("제목"),
                "type": field("Category"),
                "screen": field("Screen"),
                "route": field("Route").strip("`"),
                "page_entry": field("Page Entry").strip("`"),
                "expected_files": [_first_backtick_path(field("Expected Files"))],
                "depends_on": _split_list_cell(field("Depends On")),
                "requirement_ids": REQ_ID_PATTERN.findall(field("Requirement Ref")),
            })
            continue

        m_row = TABLE_ROW_RE.match(line)
        if m_row:
            _, task_id, title, col4, dep_cell, files_cell, _prio = m_row.groups()
            if not re.match(r"^[A-Z]", task_id):
                i += 1
                continue

            section = current_section
            screen = None
            m_scr = re.search(r"(SCR-\d{3})", section)
            if m_scr:
                screen = m_scr.group(1)

            if section.startswith("Component Task"):
                ttype = "component"
            elif section.startswith("Global/Shared Component"):
                ttype = "component"
            elif section.startswith("Data Task"):
                ttype = "data"
            elif section.startswith("DB Task"):
                ttype = "db"
            elif section.startswith("Auth/API Task"):
                ttype = "auth" if task_id.startswith("AUTH-") else "api"
            elif section.startswith("Unit Test Task"):
                ttype = "unit_test"
            elif section.startswith("Integration/RLS Test Task"):
                ttype = "integration_test"
            elif section.startswith("E2E"):
                ttype = "e2e"
            elif section.startswith("CI/Release/Manual"):
                ttype = "ci" if task_id.startswith(("CI-", "RELEASE-")) else "manual"
            else:
                ttype = "unknown"

            tasks.append({
                "id": task_id,
                "title": title,
                "type": ttype,
                "screen": screen,
                "route": None,
                "page_entry": None,
                "expected_files": [p.strip() for p in re.findall(r"`([^`]+)`", files_cell)],
                "depends_on": _split_list_cell(dep_cell),
                "requirement_ids": REQ_ID_PATTERN.findall(col4),
            })
            i += 1
            continue

        i += 1

    return tasks, excluded


def detail_filename(task_id: str) -> str:
    stripped = task_id[len("TASK-"):] if task_id.startswith("TASK-") else task_id
    return f"TASK-{stripped}.md"


def load_detail_texts(tasks: list[dict]) -> dict[str, str]:
    texts: dict[str, str] = {}
    if not TASKS_DIR.is_dir():
        return texts
    for t in tasks:
        p = TASKS_DIR / detail_filename(t["id"])
        if p.is_file():
            texts[t["id"]] = p.read_text(encoding="utf-8", errors="ignore")
    return texts


def load_all_114_requirement_ids() -> set[str]:
    return {f"REQ-FUNC-{i:03d}" for i in range(1, 81)} | {f"REQ-NF-{i:03d}" for i in range(1, 35)}


def load_screen_route_contract() -> dict:
    return json.loads(SCREEN_ROUTE_CONTRACT_JSON.read_text(encoding="utf-8"))


# ---------------------------------------------------------------------------
# The 18 checks
# ---------------------------------------------------------------------------

def check_01_list_to_detail_parity(r: CheckResult, tasks: list[dict], detail_texts: dict[str, str]) -> None:
    task_ids = {t["id"] for t in tasks if t.get("id")}
    if not TASKS_DIR.is_dir():
        r.fail("TASKS/ directory does not exist.")
        return
    actual_files = {p.name for p in TASKS_DIR.glob("TASK-*.md")}
    expected_files = {detail_filename(tid) for tid in task_ids}
    missing = sorted(expected_files - actual_files)
    orphans = sorted(actual_files - expected_files)
    if missing:
        r.fail(f"Tasks with no detail file: {missing}")
    if orphans:
        r.fail(f"Orphan detail files with no matching Task List entry: {orphans}")
    if not missing and not orphans:
        r.note(f"{len(task_ids)} Task List IDs <-> {len(actual_files)} TASK-*.md files, 1:1 OK.")


def check_02_duplicate_ids(r: CheckResult, tasks: list[dict]) -> None:
    ids = [t["id"] for t in tasks if t.get("id")]
    dupes = sorted({i for i in ids if ids.count(i) > 1})
    if dupes:
        r.fail(f"Duplicate Task IDs: {dupes}")
    else:
        r.note(f"No duplicate Task IDs among {len(ids)} tasks.")


def check_03_depends_on_missing(r: CheckResult, tasks: list[dict]) -> None:
    known = {t["id"] for t in tasks if t.get("id")}
    problems = []
    for t in tasks:
        for dep in t.get("depends_on", []):
            if dep not in known:
                problems.append(f"{t['id']} -> unknown '{dep}'")
    if problems:
        for p in problems:
            r.fail(p)
    else:
        r.note("All Depends On references resolve to a known Task ID.")


def check_04_dependency_cycles(r: CheckResult, tasks: list[dict]) -> None:
    known = {t["id"] for t in tasks if t.get("id")}
    graph = {t["id"]: [d for d in t.get("depends_on", []) if d in known] for t in tasks if t.get("id")}

    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in graph}
    cycle_path: list[str] = []

    def dfs(node: str, stack: list[str]) -> bool:
        color[node] = GRAY
        stack.append(node)
        for nxt in graph.get(node, []):
            if color.get(nxt, WHITE) == GRAY:
                idx = stack.index(nxt)
                cycle_path.extend(stack[idx:] + [nxt])
                return True
            if color.get(nxt, WHITE) == WHITE:
                if dfs(nxt, stack):
                    return True
        stack.pop()
        color[node] = BLACK
        return False

    found = False
    for tid in graph:
        if color[tid] == WHITE:
            if dfs(tid, []):
                found = True
                break

    if found:
        r.fail(f"Dependency cycle detected: {' -> '.join(cycle_path)}")
    else:
        r.note("No dependency cycles detected.")


def check_05_page_owner_per_screen(r: CheckResult, tasks: list[dict]) -> dict[str, dict]:
    owners = [t for t in tasks if t.get("type") == "page_owner"]
    by_screen: dict[str, list[dict]] = {}
    for t in owners:
        by_screen.setdefault(t.get("screen"), []).append(t)

    for screen in EXPECTED_SCREENS:
        count = len(by_screen.get(screen, []))
        if count != 1:
            r.fail(f"{screen} has {count} page_owner task(s), expected exactly 1.")

    extra_screens = set(by_screen) - set(EXPECTED_SCREENS)
    if extra_screens:
        r.fail(f"page_owner tasks found for unexpected screen(s): {sorted(extra_screens)}")

    if r.ok:
        r.note("All 5 screens have exactly 1 Page Owner task.")

    return {s: by_screen[s][0] for s in EXPECTED_SCREENS if by_screen.get(s)}


def check_06_route_page_entry_expected_files(r: CheckResult, owner_by_screen: dict[str, dict], contract: dict) -> None:
    contract_by_id = {s["screen_id"]: s for s in contract.get("screens", [])}
    for screen in EXPECTED_SCREENS:
        owner = owner_by_screen.get(screen)
        c = contract_by_id.get(screen)
        if not owner or not c:
            r.fail(f"{screen}: cannot cross-check (missing owner task or contract entry).")
            continue
        if owner.get("route") != c.get("route"):
            r.fail(f"{screen}: Task List Route '{owner.get('route')}' != contract Route '{c.get('route')}'.")
        if owner.get("page_entry") != c.get("page_entry"):
            r.fail(f"{screen}: Task List Page Entry '{owner.get('page_entry')}' != contract Page Entry '{c.get('page_entry')}'.")
        ef = owner.get("expected_files", [])
        if not ef or c.get("page_entry") not in ef[0]:
            r.fail(f"{screen}: Expected Files '{ef}' does not reference contract Page Entry '{c.get('page_entry')}'.")
    if r.ok:
        r.note("Route / Page Entry / Expected Files consistent across Task List and SCREEN_ROUTE_CONTRACT.json for all 5 screens.")


def check_07_component_only_screen(r: CheckResult, tasks: list[dict]) -> None:
    owners_screens = {t["screen"] for t in tasks if t.get("type") == "page_owner"}
    component_screens = {t["screen"] for t in tasks if t.get("type") == "component" and t.get("screen")}
    orphan_screens = component_screens - owners_screens
    unknown_screens = component_screens - set(EXPECTED_SCREENS)
    if orphan_screens:
        r.fail(f"Screen(s) with Component tasks but no Page Owner task: {sorted(orphan_screens)}")
    if unknown_screens:
        r.fail(f"Component task(s) tagged with a screen outside the 5 approved screens: {sorted(unknown_screens)}")
    if r.ok:
        r.note("No component-only screens; all Component screen tags are among the 5 approved screens.")


def check_08_scr001_starter_removal_ac(r: CheckResult, detail_texts: dict[str, str]) -> None:
    text = detail_texts.get("TASK-PAGE-SCR001", "")
    if not text:
        r.fail("TASK-PAGE-SCR001 detail file not found.")
        return
    if "스타터" not in text and "starter" not in text.lower():
        r.fail("TASK-PAGE-SCR001 has no create-next-app starter-removal AC.")
    else:
        r.note("TASK-PAGE-SCR001 contains a starter-removal AC.")


def check_09_scr003_three_tabs_ac(r: CheckResult, detail_texts: dict[str, str]) -> None:
    text = detail_texts.get("TASK-PAGE-SCR003", "")
    if not text:
        r.fail("TASK-PAGE-SCR003 detail file not found.")
        return
    required = ["항공편 찾기", "숙소 찾기", "동행 구하기"]
    missing = [k for k in required if k not in text]
    if missing:
        r.fail(f"TASK-PAGE-SCR003 is missing tab-assembly AC for: {missing}")
    else:
        r.note("TASK-PAGE-SCR003 contains an AC assembling all 3 named tabs.")


def check_10_scr005_role_state_ac(r: CheckResult, detail_texts: dict[str, str]) -> None:
    text = detail_texts.get("TASK-PAGE-SCR005", "")
    if not text:
        r.fail("TASK-PAGE-SCR005 detail file not found.")
        return
    required = ["Guest", "Member", "Admin"]
    missing = [k for k in required if k not in text]
    if missing:
        r.fail(f"TASK-PAGE-SCR005 is missing role-assembly AC for: {missing}")
    else:
        r.note("TASK-PAGE-SCR005 contains an AC assembling Guest/Member/Admin role states.")


def check_11_db_core_tasks_exist(r: CheckResult, tasks: list[dict]) -> None:
    ids = {t["id"] for t in tasks if t.get("type") == "db"}
    missing = [tid for tid in REQUIRED_DB_TASK_IDS if tid not in ids]
    if missing:
        r.fail(f"Required DB tasks missing: {missing}")
    else:
        r.note(f"All required DB tasks present: {REQUIRED_DB_TASK_IDS}")


def check_12_db_table_scope(r: CheckResult, tasks: list[dict], detail_texts: dict[str, str]) -> None:
    db_tasks = [t for t in tasks if t.get("type") == "db"]
    if not db_tasks:
        r.fail("No DB tasks found to check table scope against.")
        return

    mentioned: set[str] = set()
    forbidden_hits: list[str] = []
    for t in db_tasks:
        text = detail_texts.get(t["id"], "")
        mentioned |= set(TABLE_NAME_TOKEN.findall(text))
        for hint in FORBIDDEN_TABLE_HINTS:
            if hint in text:
                forbidden_hits.append(f"{t['id']} references forbidden table hint '{hint}'")

    extras = sorted(mentioned - ALLOWED_DB_TABLES)
    for h in forbidden_hits:
        r.fail(h)
    if len(extras) > DB_TABLE_EXTRA_TOLERANCE:
        r.fail(f"DB task table scope exceeds the 6 base tables by more than the tolerance ({DB_TABLE_EXTRA_TOLERANCE}): extra identifiers {extras}")
    elif extras:
        r.note(f"DB table scope within tolerance: {len(extras)} extra identifier(s) noted (not tables): {extras}")

    missing_base = sorted(ALLOWED_DB_TABLES - mentioned)
    if missing_base:
        r.fail(f"Base tables not mentioned in any DB task: {missing_base}")
    if r.ok:
        r.note(f"DB table scope OK: base 6 tables present, {len(extras)} extra identifier(s) (<= tolerance {DB_TABLE_EXTRA_TOLERANCE}).")


def check_13_external_input_non_persistence_ac(r: CheckResult, tasks: list[dict], detail_texts: dict[str, str]) -> None:
    relevant = [
        t for t in tasks
        if any(k in t.get("title", "") for k in ["항공", "숙소", "호텔", "flight", "hotel", "Flight", "Hotel"])
        and "URL" not in t.get("title", "")
        and not t.get("id", "").startswith("API-ADMIN")
    ]
    if not relevant:
        r.fail("No flight/hotel input tasks found to check non-persistence AC against.")
        return
    accepted_phrases = ["저장하지 않", "전달하지 않", "전송하지 않", "전송되지 않", "persist"]
    checked = 0
    for t in relevant:
        text = detail_texts.get(t["id"], "")
        if not text:
            continue
        if "서버" not in text and "server" not in text.lower():
            continue
        checked += 1
        if not any(p in text or p.lower() in text.lower() for p in accepted_phrases):
            r.fail(f"{t['id']} touches flight/hotel input handling but lacks a non-persistence AC.")
    if r.ok:
        r.note(f"External input non-persistence AC present ({checked}/{len(relevant)} relevant tasks carry server-facing wording, all guarded).")


def check_14_auth_adult_rls_ac(r: CheckResult, detail_texts: dict[str, str]) -> None:
    auth_text = detail_texts.get("AUTH-SUPABASE-EMAIL", "")
    rls_text = detail_texts.get("DB-RLS-BASE", "")
    if not auth_text:
        r.fail("AUTH-SUPABASE-EMAIL detail file not found.")
    else:
        if "인증" not in auth_text and "Auth" not in auth_text:
            r.fail("AUTH-SUPABASE-EMAIL has no authentication AC.")
        if "성인" not in auth_text:
            r.fail("AUTH-SUPABASE-EMAIL has no adult-verification AC.")
    if not rls_text:
        r.fail("DB-RLS-BASE detail file not found.")
    else:
        if "RLS" not in rls_text:
            r.fail("DB-RLS-BASE has no baseline RLS AC.")
    if r.ok:
        r.note("Auth / adult-verification / baseline RLS ACs all present.")


def check_15_playwright_chromium_smoke(r: CheckResult, tasks: list[dict], detail_texts: dict[str, str]) -> None:
    e2e_tasks = {t["id"]: t for t in tasks if t.get("type") == "e2e"}
    missing = [tid for tid in REQUIRED_E2E_IDS if tid not in e2e_tasks]
    if missing:
        r.fail(f"Required Playwright/E2E task(s) missing: {missing}")
        return
    for tid in REQUIRED_E2E_IDS:
        text = detail_texts.get(tid, "")
        if not text:
            r.fail(f"{tid} detail file not found.")
            continue
        if "chromium" not in text.lower():
            r.fail(f"{tid} does not specify Chromium as the target browser.")
        for line in text.splitlines():
            lowered_line = line.lower()
            for other in ["firefox", "webkit", "safari"]:
                if other in lowered_line and not any(neg in line for neg in NEGATION_MARKERS):
                    r.fail(f"{tid} mentions '{other}' outside a negation — must be Chromium-only: {line.strip()!r}")
    if r.ok:
        r.note(f"Playwright Chromium Smoke Task(s) present and Chromium-only: {REQUIRED_E2E_IDS}")


def check_16_no_forbidden_infra_tasks(r: CheckResult, tasks: list[dict], detail_texts: dict[str, str]) -> None:
    for t in tasks:
        title_and_id = f"{t.get('title', '')} {t.get('id', '')}"
        for kw in FORBIDDEN_KEYWORDS:
            if kw in title_and_id:
                r.fail(f"{t.get('id')} references forbidden concept '{kw}' in its title/ID.")
        text = detail_texts.get(t.get("id", ""), "")
        for line in text.splitlines():
            for kw in FORBIDDEN_KEYWORDS:
                if kw in line and not any(neg in line for neg in NEGATION_MARKERS):
                    r.fail(f"{t.get('id')} references forbidden concept '{kw}' without negation: {line.strip()!r}")
    if r.ok:
        r.note("No AWS / EC2 / auto-merge implementation tasks detected.")


def check_17_requirement_coverage(r: CheckResult, tasks: list[dict], excluded_entries: list[dict], scope_text: str) -> None:
    expected = load_all_114_requirement_ids()
    found_in_scope = set(REQ_ID_PATTERN.findall(scope_text))
    missing_from_scope = sorted(expected - found_in_scope)
    if missing_from_scope:
        r.fail(f"docs/PROJECT_SCOPE.md does not mention: {missing_from_scope}")

    covered_by_tasks: set[str] = set()
    for t in tasks:
        covered_by_tasks |= set(t.get("requirement_ids", []))
    excluded_ids = {e["id"] for e in excluded_entries}

    overlap = sorted(covered_by_tasks & excluded_ids)
    if overlap:
        r.fail(f"Requirement(s) marked EXCLUDED but also attached to an implementation task: {overlap}")

    all_accounted = covered_by_tasks | excluded_ids
    missing = sorted(expected - all_accounted)
    if missing:
        r.fail(f"{len(missing)} requirement(s) have no task and are not in NON_IMPLEMENTATION: {missing}")

    no_reason = [e["id"] for e in excluded_entries if not e.get("reason")]
    if no_reason:
        r.fail(f"NON_IMPLEMENTATION entries missing a reason for: {no_reason}")

    if r.ok:
        r.note(
            f"REQ-FUNC 80 + REQ-NF 34 = 114/114 accounted for "
            f"({len(covered_by_tasks)} on tasks, {len(excluded_ids)} EXCLUDED)."
        )


def check_18_excluded_have_no_detail_file(r: CheckResult, tasks: list[dict], excluded_entries: list[dict], detail_texts: dict[str, str]) -> None:
    excluded_ids = {e["id"] for e in excluded_entries}
    implementation_ids = {t["id"] for t in tasks if t.get("id")}

    # (a) no implementation task ID equals or is literally derived from an EXCLUDED requirement ID
    overlap_ids = sorted(implementation_ids & excluded_ids)
    if overlap_ids:
        r.fail(f"Task ID(s) collide with an EXCLUDED requirement ID: {overlap_ids}")

    # (b) no generated detail file references an EXCLUDED requirement in its own Requirement Ref section
    for tid, text in detail_texts.items():
        m = re.search(r"## Requirement Ref\s*\n(.*?)\n##", text, re.DOTALL)
        section = m.group(1) if m else text
        mentioned = set(REQ_ID_PATTERN.findall(section))
        bad = sorted(mentioned & excluded_ids)
        if bad:
            r.fail(f"{tid} detail file's Requirement Ref lists EXCLUDED requirement(s): {bad}")

    # (c) no orphan TASK-*.md file exists beyond the implementation task set (covered again here
    #     specifically for EXCLUDED-named files, e.g. a stray TASK-REQ-FUNC-XXX.md)
    if TASKS_DIR.is_dir():
        stray = [
            p.name for p in TASKS_DIR.glob("TASK-*.md")
            if any(rid in p.name for rid in excluded_ids)
        ]
        if stray:
            r.fail(f"Detail file(s) appear to implement an EXCLUDED requirement by filename: {stray}")

    if r.ok:
        r.note(f"No detail implementation file exists for any of the {len(excluded_ids)} EXCLUDED requirements.")


# ---------------------------------------------------------------------------
# Output: CSV manifest + Markdown report
# ---------------------------------------------------------------------------

def load_wave_id_map() -> dict[str, str]:
    """Read TASKS/WAVE_STATE.json (written by scripts/build_waves.py) if it
    exists, and return {task_id: wave_id}. This is the single source of
    truth for the wave_id column below — audit_tasks.py never assigns Wave
    IDs itself, it only preserves what build_waves.py already decided so
    that re-running the audit doesn't silently wipe the column."""
    wave_state_path = TASKS_DIR / "WAVE_STATE.json"
    if not wave_state_path.is_file():
        return {}
    try:
        data = json.loads(wave_state_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}
    mapping: dict[str, str] = {}
    for wave in data.get("waves", []):
        wave_id = wave.get("wave_id", "")
        for tid in wave.get("task_ids", []):
            mapping[tid] = wave_id
    return mapping


def write_manifest_csv(tasks: list[dict], detail_texts: dict[str, str]) -> None:
    TASKS_DIR.mkdir(parents=True, exist_ok=True)
    wave_id_map = load_wave_id_map()
    with MANIFEST_CSV.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow([
            "Task ID", "Category", "Screen", "Route", "Page Entry",
            "Requirement Ref", "Depends On", "Expected Files", "Detail File Exists",
            "wave_id",
        ])
        for t in sorted(tasks, key=lambda x: x.get("id", "")):
            w.writerow([
                t.get("id", ""),
                t.get("type", ""),
                t.get("screen") or "",
                t.get("route") or "",
                t.get("page_entry") or "",
                ";".join(t.get("requirement_ids", [])),
                ";".join(t.get("depends_on", [])),
                ";".join(t.get("expected_files", [])),
                "yes" if t.get("id") in detail_texts else "no",
                wave_id_map.get(t.get("id", ""), ""),
            ])


def write_report_md(audit: Audit, task_count: int) -> None:
    TASKS_DIR.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Traveler Task Pipeline — Final Audit Report",
        "",
        "| 항목 | 내용 |",
        "|---|---|",
        "| 대상 | `TASKS/00_TASK_LIST.md` + `TASKS/TASK-*.md` |",
        f"| Task 수(정보 제공용, 통과 기준 아님) | {task_count} |",
        f"| 검사 수 | {len(audit.results)} |",
        f"| 결과 | {'AUDIT_PASS' if audit.ok else 'AUDIT_FAIL'} |",
        "",
        "## 검사별 결과",
        "",
        "| # | 검사 | 결과 | 비고 |",
        "|---|---|---|---|",
    ]
    for res in audit.results:
        status = "PASS" if res.ok else "FAIL"
        note = " / ".join(res.info) if res.ok else " / ".join(res.messages)
        note = note.replace("|", "\\|")
        lines.append(f"| {res.number} | {res.name} | {status} | {note} |")

    fails = [res for res in audit.results if not res.ok]
    if fails:
        lines.append("")
        lines.append("## 실패 상세")
        for res in fails:
            lines.append(f"\n### [{res.number}] {res.name}")
            for m in res.messages:
                lines.append(f"- {m}")

    REPORT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    audit = Audit()

    if not TASK_LIST_MD.is_file():
        r = CheckResult(1, "Task List <-> Detail file 1:1")
        r.fail("TASKS/00_TASK_LIST.md does not exist.")
        audit.results.append(r)
        write_report_md(audit, 0)
        print("AUDIT_FAIL")
        return 1

    text = TASK_LIST_MD.read_text(encoding="utf-8", errors="ignore")
    tasks, excluded_entries = parse_task_list(text)
    detail_texts = load_detail_texts(tasks)
    scope_text = PROJECT_SCOPE_MD.read_text(encoding="utf-8", errors="ignore") if PROJECT_SCOPE_MD.is_file() else ""
    contract = load_screen_route_contract() if SCREEN_ROUTE_CONTRACT_JSON.is_file() else {"screens": []}

    audit.run(1, "Task List 구현 ID ↔ 상세 Task 파일 1:1", lambda r: check_01_list_to_detail_parity(r, tasks, detail_texts))
    audit.run(2, "중복 Task ID 0", lambda r: check_02_duplicate_ids(r, tasks))
    audit.run(3, "Depends On 누락 0", lambda r: check_03_depends_on_missing(r, tasks))
    audit.run(4, "Dependency Cycle 0", lambda r: check_04_dependency_cycles(r, tasks))

    owner_by_screen: dict[str, dict] = {}
    def _r5(r: CheckResult) -> None:
        nonlocal owner_by_screen
        owner_by_screen = check_05_page_owner_per_screen(r, tasks)
    audit.run(5, "Screen 5개 모두 Page Owner 정확히 1개", _r5)

    audit.run(6, "Route·Page Entry·Expected Files 일치", lambda r: check_06_route_page_entry_expected_files(r, owner_by_screen, contract))
    audit.run(7, "Component-only Screen 0", lambda r: check_07_component_only_screen(r, tasks))
    audit.run(8, "SCR-001 Starter 제거 AC 존재", lambda r: check_08_scr001_starter_removal_ac(r, detail_texts))
    audit.run(9, "SCR-003 세 탭 조립 AC 존재", lambda r: check_09_scr003_three_tabs_ac(r, detail_texts))
    audit.run(10, "SCR-005 역할별 상태 조립 AC 존재", lambda r: check_10_scr005_role_state_ac(r, detail_texts))
    audit.run(11, "DB Schema·RLS·Access·Seed Task 존재", lambda r: check_11_db_core_tasks_exist(r, tasks))
    audit.run(12, "DB Table 범위가 6개 기본 테이블을 크게 넘지 않음", lambda r: check_12_db_table_scope(r, tasks, detail_texts))
    audit.run(13, "외부 입력 비저장 AC 존재", lambda r: check_13_external_input_non_persistence_ac(r, tasks, detail_texts))
    audit.run(14, "Auth·성인·기본 RLS AC 존재", lambda r: check_14_auth_adult_rls_ac(r, detail_texts))
    audit.run(15, "Playwright Chromium Smoke Task 존재", lambda r: check_15_playwright_chromium_smoke(r, tasks, detail_texts))
    audit.run(16, "AWS·EC2·자동 Merge 구현 Task 0", lambda r: check_16_no_forbidden_infra_tasks(r, tasks, detail_texts))
    audit.run(17, "REQ-FUNC 80개 + REQ-NF 34개가 Task 또는 EXCLUDED 표에 존재", lambda r: check_17_requirement_coverage(r, tasks, excluded_entries, scope_text))
    audit.run(18, "EXCLUDED 상세 구현 파일이 생성되지 않음", lambda r: check_18_excluded_have_no_detail_file(r, tasks, excluded_entries, detail_texts))

    write_manifest_csv(tasks, detail_texts)
    write_report_md(audit, len(tasks))

    if audit.ok:
        print("AUDIT_PASS")
        print(f"{len(audit.results)}/{len(audit.results)} checks passed")
        return 0

    print("AUDIT_FAIL")
    failed = [r for r in audit.results if not r.ok]
    print(f"{len(audit.results) - len(failed)}/{len(audit.results)} checks passed")
    print()
    for res in failed:
        print(f"[Check {res.number}] {res.name}")
        for m in res.messages:
            print(f"    - {m}")
    print()
    print(f"See {REPORT_MD.relative_to(REPO_ROOT)} and {MANIFEST_CSV.relative_to(REPO_ROOT)} for full detail.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
