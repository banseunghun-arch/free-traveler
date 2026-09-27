#!/usr/bin/env python3
"""Pre-flight input validation for the Traveler task-generation pipeline.

Run before /gen-tasklist (see .claude/skills/traveler-project-pipeline/SKILL.md).

11 checks:
 1. package.json declares a Next.js dependency.
 2. src/app/page.tsx and src/app/layout.tsx exist.
 3. PRD / SRS / Project Scope / UI documents exist.
 4. design-reference/D-001/DESIGN.md exists and its Manifest reports LOCKED.
 5. SCREEN_ROUTE_CONTRACT.json parses as valid JSON.
 6. Screen count is exactly 5.
 7. SCR-001~005 are all present.
 8. Routes are exactly `/`, `/about`, `/travel-tools`, `/mates`, `/account`.
 9. Every page_entry follows the real Next.js App Router path shape
    (`src/app/.../page.tsx`).
10. docs/PROJECT_SCOPE.md mentions all 80 REQ-FUNC-* and all 34 REQ-NF-* IDs.
11. AWS / EC2 are not defined as an active (non-excluded) technology.

On success: prints `VALIDATE_INPUTS_PASS` and the number of checks that ran.
On failure: prints the missing file(s) / Screen(s) / Requirement ID(s) for
every failing check, then exits with status 1.

Usage:
    python scripts/validate_inputs.py
    python3 scripts/validate_inputs.py
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

EXPECTED_SCREEN_IDS = ["SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"]
EXPECTED_ROUTES = {"/", "/about", "/travel-tools", "/mates", "/account"}
PAGE_ENTRY_PATTERN = re.compile(r"^src/app/([\w\-]+/)*page\.tsx$")

CORE_DOCS = [
    "docs/01_PRD.md",
    "docs/02_SRS_BASELINE.md",
    "docs/PROJECT_SCOPE.md",
]
UI_DOCS = [
    "docs/03_UI_COVERAGE_ANALYSIS.md",
    "docs/04_UIUX_PLAN.md",
    "docs/05_UIUX_APPROVED.md",
    "docs/06_SRS_UIUX_REVISED.md",
    "docs/UIUX_TRACEABILITY.md",
    "design-reference/UI_CONTRACT.md",
]

EXCLUSION_MARKERS = ["제외", "않는다", "않음", "없음", "EXCLUDED", "구성하지 않"]


class Checks:
    def __init__(self) -> None:
        self.passed = 0
        self.total = 0
        self.failures: list[str] = []

    def run(self, number: int, name: str, fn) -> None:
        self.total += 1
        problems = fn()
        if problems:
            self.failures.append(f"[Check {number}] {name}")
            for p in problems:
                self.failures.append(f"    - {p}")
        else:
            self.passed += 1


def read(rel_path: str) -> str | None:
    path = REPO_ROOT / rel_path
    if not path.is_file():
        return None
    return path.read_text(encoding="utf-8", errors="ignore")


# --- Check 1 -----------------------------------------------------------
def check_nextjs_dependency() -> list[str]:
    text = read("package.json")
    if text is None:
        return ["package.json not found"]
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        return [f"package.json is not valid JSON: {exc}"]
    deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
    if "next" not in deps:
        return ["package.json has no 'next' dependency"]
    return []


# --- Check 2 -----------------------------------------------------------
def check_app_router_entrypoints() -> list[str]:
    problems = []
    for rel in ["src/app/page.tsx", "src/app/layout.tsx"]:
        if not (REPO_ROOT / rel).is_file():
            problems.append(f"missing: {rel}")
    return problems


# --- Check 3 -----------------------------------------------------------
def check_baseline_and_ui_docs() -> list[str]:
    problems = []
    for rel in CORE_DOCS + UI_DOCS:
        if not (REPO_ROOT / rel).is_file():
            problems.append(f"missing: {rel}")
    return problems


# --- Check 4 -----------------------------------------------------------
def check_design_locked() -> list[str]:
    problems = []
    design_text = read("design-reference/D-001/DESIGN.md")
    if design_text is None:
        problems.append("missing: design-reference/D-001/DESIGN.md")

    manifest_text = read("design-reference/DESIGN_MANIFEST.md")
    if manifest_text is None:
        problems.append("missing: design-reference/DESIGN_MANIFEST.md")
    elif "LOCKED" not in manifest_text:
        problems.append("design-reference/DESIGN_MANIFEST.md does not report Status: LOCKED")

    if design_text is not None and "LOCKED" not in design_text:
        problems.append("design-reference/D-001/DESIGN.md does not report Status: LOCKED")

    return problems


# --- Check 5 -----------------------------------------------------------
def check_screen_route_contract_json() -> tuple[list[str], dict | None]:
    text = read("design-reference/SCREEN_ROUTE_CONTRACT.json")
    if text is None:
        return ["missing: design-reference/SCREEN_ROUTE_CONTRACT.json"], None
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        return [f"SCREEN_ROUTE_CONTRACT.json failed to parse as JSON: {exc}"], None
    return [], data


# --- Check 6 -----------------------------------------------------------
def check_screen_count(contract: dict | None) -> list[str]:
    if contract is None:
        return ["SCREEN_ROUTE_CONTRACT.json unavailable (see Check 5)"]
    screens = contract.get("screens", [])
    if len(screens) != 5:
        return [f"expected exactly 5 screens, found {len(screens)}"]
    return []


# --- Check 7 -----------------------------------------------------------
def check_all_screens_present(contract: dict | None) -> list[str]:
    if contract is None:
        return ["SCREEN_ROUTE_CONTRACT.json unavailable (see Check 5)"]
    screens = contract.get("screens", [])
    found_ids = {s.get("screen_id") for s in screens}
    missing = [sid for sid in EXPECTED_SCREEN_IDS if sid not in found_ids]
    return [f"missing screen: {sid}" for sid in missing]


# --- Check 8 -----------------------------------------------------------
def check_routes(contract: dict | None) -> list[str]:
    if contract is None:
        return ["SCREEN_ROUTE_CONTRACT.json unavailable (see Check 5)"]
    screens = contract.get("screens", [])
    found_routes = {s.get("route") for s in screens}
    problems = []
    for route in sorted(EXPECTED_ROUTES - found_routes):
        problems.append(f"missing route: {route}")
    for route in sorted(found_routes - EXPECTED_ROUTES):
        problems.append(f"unexpected route: {route}")
    return problems


# --- Check 9 -----------------------------------------------------------
def check_page_entry_shape(contract: dict | None) -> list[str]:
    if contract is None:
        return ["SCREEN_ROUTE_CONTRACT.json unavailable (see Check 5)"]
    screens = contract.get("screens", [])
    problems = []
    for s in screens:
        entry = s.get("page_entry", "")
        if not PAGE_ENTRY_PATTERN.match(entry):
            problems.append(
                f"{s.get('screen_id')} page_entry '{entry}' does not match "
                "Next.js App Router shape 'src/app/.../page.tsx'"
            )
    return problems


# --- Check 10 ------------------------------------------------------------
def check_project_scope_requirement_coverage() -> list[str]:
    text = read("docs/PROJECT_SCOPE.md")
    if text is None:
        return ["missing: docs/PROJECT_SCOPE.md"]

    found_ids = set(re.findall(r"REQ-(?:FUNC|NF)-\d{3}", text))
    expected_func = {f"REQ-FUNC-{i:03d}" for i in range(1, 81)}
    expected_nf = {f"REQ-NF-{i:03d}" for i in range(1, 35)}

    missing_func = sorted(expected_func - found_ids)
    missing_nf = sorted(expected_nf - found_ids)

    problems = [f"missing from PROJECT_SCOPE.md: {rid}" for rid in missing_func + missing_nf]
    return problems


# --- Check 11 ------------------------------------------------------------
def check_no_active_aws_ec2() -> list[str]:
    text = read("docs/PROJECT_SCOPE.md")
    if text is None:
        return ["missing: docs/PROJECT_SCOPE.md"]

    problems = []
    for lineno, line in enumerate(text.splitlines(), start=1):
        if "AWS" in line or "EC2" in line:
            if not any(marker in line for marker in EXCLUSION_MARKERS):
                problems.append(
                    f"docs/PROJECT_SCOPE.md:{lineno} mentions AWS/EC2 without an "
                    f"exclusion marker (looks like an active technology): {line.strip()!r}"
                )
    return problems


def main() -> int:
    # Force UTF-8 stdout so any Korean console output survives on Windows,
    # where sys.stdout otherwise defaults to the system locale codepage
    # (e.g. cp949 on Korean Windows) and silently mis-encodes it.
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    checks = Checks()

    checks.run(1, "package.json has Next.js dependency", check_nextjs_dependency)
    checks.run(2, "src/app/page.tsx and layout.tsx exist", check_app_router_entrypoints)
    checks.run(3, "PRD/SRS/Project Scope/UI documents exist", check_baseline_and_ui_docs)
    checks.run(4, "D-001 DESIGN.md + LOCKED Manifest exist", check_design_locked)

    contract_problems, contract = check_screen_route_contract_json()
    checks.run(5, "SCREEN_ROUTE_CONTRACT.json parses as JSON", lambda: contract_problems)
    checks.run(6, "Screen count is exactly 5", lambda: check_screen_count(contract))
    checks.run(7, "SCR-001~005 all present", lambda: check_all_screens_present(contract))
    checks.run(8, "Routes match the 5 expected routes", lambda: check_routes(contract))
    checks.run(9, "Page Entry paths follow App Router shape", lambda: check_page_entry_shape(contract))

    checks.run(10, "PROJECT_SCOPE.md covers all 80 REQ-FUNC + 34 REQ-NF", check_project_scope_requirement_coverage)
    checks.run(11, "AWS/EC2 not defined as active technology", check_no_active_aws_ec2)

    if not checks.failures:
        print("VALIDATE_INPUTS_PASS")
        print(f"{checks.passed}/{checks.total} checks passed")
        return 0

    print("VALIDATE_INPUTS_FAIL")
    print(f"{checks.passed}/{checks.total} checks passed")
    print()
    for line in checks.failures:
        print(line)
    return 1


if __name__ == "__main__":
    sys.exit(main())
