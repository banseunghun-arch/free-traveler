#!/usr/bin/env python3
"""Validate that the Traveler Claude Code harness itself is wired up correctly.

Checks that CLAUDE.md, the traveler-project-pipeline Skill, the 7 pipeline
Commands, and the Harness Marker / core rule text they must contain all
actually exist and say what they must say. This is a harness-integrity check,
not a content/requirement-coverage check (see scripts/validate_inputs.py and
scripts/audit_tasks.py for those).

11 of the 13 checks are pure existence/text checks; Checks 5 and 6 additionally
cross-check that the paths named in CLAUDE.md's Harness Marker actually resolve
on disk and (Check 6) that SCREEN_ROUTE_CONTRACT.json's own schema_version
matches the HARNESS_SCHEMA marker.

On success: prints VALIDATE_HARNESS_PASS and the number of checks that ran.
On failure: prints the missing file(s)/rule(s) for every failing check, then
exits with status 1.

Usage:
    python scripts/validate_harness.py
    python3 scripts/validate_harness.py
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

CLAUDE_MD = REPO_ROOT / "CLAUDE.md"
SKILL_MD = REPO_ROOT / ".claude" / "skills" / "traveler-project-pipeline" / "SKILL.md"
COMMANDS_DIR = REPO_ROOT / ".claude" / "commands"

REQUIRED_COMMANDS = [
    "gen-tasklist.md",
    "gen-task-details.md",
    "audit-tasks.md",
    "prepare-task.md",
    "implement-task.md",
    "run-wave.md",
    "release-check.md",
]

HARNESS_SCHEMA_VALUE = "traveler-screen-route-v1"
DESIGN_PATH_VALUE = "design-reference/D-001/DESIGN.md"
SCREEN_CONTRACT_VALUE = "design-reference/SCREEN_ROUTE_CONTRACT.json"

ALLOWED_DB_TABLES = [
    "profiles",
    "mate_posts",
    "participation_requests",
    "blocks",
    "reports",
    "external_urls",
]


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


CLAUDE_TEXT = read("CLAUDE.md") or ""
SKILL_TEXT = read(".claude/skills/traveler-project-pipeline/SKILL.md") or ""
COMBINED_TEXT = CLAUDE_TEXT + "\n" + SKILL_TEXT


# --- Check 1 -----------------------------------------------------------
def check_claude_md_exists() -> list[str]:
    if not CLAUDE_MD.is_file():
        return ["missing: CLAUDE.md"]
    return []


# --- Check 2 -----------------------------------------------------------
def check_skill_file_exists() -> list[str]:
    if not SKILL_MD.is_file():
        return ["missing: .claude/skills/traveler-project-pipeline/SKILL.md"]
    return []


# --- Check 3 -----------------------------------------------------------
def check_seven_commands_exist() -> list[str]:
    problems = []
    for name in REQUIRED_COMMANDS:
        if not (COMMANDS_DIR / name).is_file():
            problems.append(f"missing: .claude/commands/{name}")
    return problems


# --- Check 4 -----------------------------------------------------------
def check_harness_schema_marker() -> list[str]:
    if f"HARNESS_SCHEMA={HARNESS_SCHEMA_VALUE}" not in CLAUDE_TEXT:
        return [f"CLAUDE.md does not declare 'HARNESS_SCHEMA={HARNESS_SCHEMA_VALUE}'"]
    return []


# --- Check 5 -----------------------------------------------------------
def check_design_path_matches() -> list[str]:
    problems = []
    if f"DESIGN_PATH={DESIGN_PATH_VALUE}" not in CLAUDE_TEXT:
        problems.append(f"CLAUDE.md does not declare 'DESIGN_PATH={DESIGN_PATH_VALUE}'")
    if not (REPO_ROOT / DESIGN_PATH_VALUE).is_file():
        problems.append(f"marker path does not exist on disk: {DESIGN_PATH_VALUE}")
    return problems


# --- Check 6 -----------------------------------------------------------
def check_screen_contract_matches() -> list[str]:
    problems = []
    if f"SCREEN_CONTRACT={SCREEN_CONTRACT_VALUE}" not in CLAUDE_TEXT:
        problems.append(f"CLAUDE.md does not declare 'SCREEN_CONTRACT={SCREEN_CONTRACT_VALUE}'")

    contract_path = REPO_ROOT / SCREEN_CONTRACT_VALUE
    if not contract_path.is_file():
        problems.append(f"marker path does not exist on disk: {SCREEN_CONTRACT_VALUE}")
        return problems

    try:
        data = json.loads(contract_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        problems.append(f"{SCREEN_CONTRACT_VALUE} failed to parse as JSON: {exc}")
        return problems

    if data.get("schema_version") != HARNESS_SCHEMA_VALUE:
        problems.append(
            f"{SCREEN_CONTRACT_VALUE} schema_version '{data.get('schema_version')}' "
            f"!= HARNESS_SCHEMA marker '{HARNESS_SCHEMA_VALUE}'"
        )
    return problems


# --- Check 7 -----------------------------------------------------------
def check_page_owner_five_rule() -> list[str]:
    needed = ["Page Owner", "5"]
    if not all(k in COMBINED_TEXT for k in needed):
        return ["no Page Owner / 5-per-screen rule text found in CLAUDE.md or SKILL.md"]
    if "정확히 1개" not in COMBINED_TEXT and "정확히 5개" not in COMBINED_TEXT:
        return ["no explicit 'exactly 1 per screen / exactly 5' Page Owner rule text found"]
    return []


# --- Check 8 -----------------------------------------------------------
def check_db_six_table_scope() -> list[str]:
    missing = [t for t in ALLOWED_DB_TABLES if t not in COMBINED_TEXT]
    if missing:
        return [f"DB 6-table scope not fully named in CLAUDE.md/SKILL.md, missing: {missing}"]
    return []


# --- Check 9 -----------------------------------------------------------
def check_external_input_non_persistence_rule() -> list[str]:
    markers = ["서버", "URL", "로그"]
    if not all(m in COMBINED_TEXT for m in markers):
        return ["external-input non-persistence rule text incomplete in CLAUDE.md/SKILL.md"]
    if "항공" not in COMBINED_TEXT and "숙소" not in COMBINED_TEXT:
        return ["external-input non-persistence rule does not name flight/hotel input"]
    return []


# --- Check 10 ------------------------------------------------------------
def check_playwright_chromium_smoke_rule() -> list[str]:
    problems = []
    if "PLAYWRIGHT_ENABLED=true" not in CLAUDE_TEXT:
        problems.append("CLAUDE.md does not declare 'PLAYWRIGHT_ENABLED=true'")
    if "PLAYWRIGHT_SCOPE=chromium-smoke" not in CLAUDE_TEXT:
        problems.append("CLAUDE.md does not declare 'PLAYWRIGHT_SCOPE=chromium-smoke'")
    if "Chromium" not in COMBINED_TEXT and "chromium" not in COMBINED_TEXT:
        problems.append("no Chromium Smoke rule text found in CLAUDE.md/SKILL.md")
    return problems


# --- Check 11 ------------------------------------------------------------
def check_auto_merge_false() -> list[str]:
    if "AUTO_MERGE=false" not in CLAUDE_TEXT:
        return ["CLAUDE.md does not declare 'AUTO_MERGE=false'"]
    return []


# --- Check 12 ------------------------------------------------------------
def check_aws_enabled_false() -> list[str]:
    if "AWS_ENABLED=false" not in CLAUDE_TEXT:
        return ["CLAUDE.md does not declare 'AWS_ENABLED=false'"]
    return []


# --- Check 13 ------------------------------------------------------------
def check_excluded_protection_rule() -> list[str]:
    if "EXCLUDED" not in COMBINED_TEXT:
        return ["no EXCLUDED-protection rule text found in CLAUDE.md/SKILL.md"]
    if "임의로 구현하지 않는다" not in CLAUDE_TEXT and "구현 Task" not in SKILL_TEXT:
        return ["EXCLUDED text found, but no explicit 'do not implement EXCLUDED' protection rule"]
    return []


def main() -> int:
    checks = Checks()

    checks.run(1, "CLAUDE.md 존재", check_claude_md_exists)
    checks.run(2, "Claude Code Skill 파일 존재", check_skill_file_exists)
    checks.run(3, "7개 Command 존재", check_seven_commands_exist)
    checks.run(4, "traveler-screen-route-v1 Marker 존재", check_harness_schema_marker)
    checks.run(5, "D-001 DESIGN 경로 일치", check_design_path_matches)
    checks.run(6, "Screen Contract 경로 일치", check_screen_contract_matches)
    checks.run(7, "Page Owner 5개 규칙 존재", check_page_owner_five_rule)
    checks.run(8, "DB Table 6개 기본 범위 존재", check_db_six_table_scope)
    checks.run(9, "외부 입력 비저장 규칙 존재", check_external_input_non_persistence_rule)
    checks.run(10, "Playwright Chromium Smoke 규칙 존재", check_playwright_chromium_smoke_rule)
    checks.run(11, "AUTO_MERGE=false", check_auto_merge_false)
    checks.run(12, "AWS_ENABLED=false", check_aws_enabled_false)
    checks.run(13, "EXCLUDED 보호 규칙 존재", check_excluded_protection_rule)

    if not checks.failures:
        print("VALIDATE_HARNESS_PASS")
        print(f"{checks.passed}/{checks.total} checks passed")
        return 0

    print("VALIDATE_HARNESS_FAIL")
    print(f"{checks.passed}/{checks.total} checks passed")
    print()
    for line in checks.failures:
        print(line)
    return 1


if __name__ == "__main__":
    sys.exit(main())
