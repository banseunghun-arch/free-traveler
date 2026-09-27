#!/usr/bin/env python3
"""Check that the Traveler Screen/Route contract is honored, at three
different depths depending on how far Wave implementation has progressed.

Reads:
    design-reference/SCREEN_ROUTE_CONTRACT.json
    TASKS/TASK_MANIFEST.csv
    src/app/**                          (only in --mode=ci / --mode=release)
    docs/preview-checks/SCR-00N.md      (only in --mode=release)

Writes: nothing. Read-only contract check.

Modes:
    --mode=plan     Page Owner + route PLAN only (SCREEN_ROUTE_CONTRACT.json
                    + TASK_MANIFEST.csv). Never touches src/app, so it can run
                    before any screen has been implemented.
    --mode=ci       Everything --mode=plan checks, plus the real src/app
                    tree: each fixed screen's Page Entry file must actually
                    exist, and the forbidden-new-page scan (check 4) also
                    scans real directories, not just planned Expected Files.
    --mode=release  Everything --mode=ci checks, plus: a Preview Checkpoint
                    record (docs/preview-checks/SCR-00N.md) must exist for
                    every one of the 5 fixed screens.

Checks (numbered as in the request that produced this script):
    1. Exactly the 5 fixed screens exist (SCREEN_ROUTE_CONTRACT.json's
       screens[] and, in ci/release mode, an implemented Page Entry file for
       each). No screen is missing, and no 6th screen has appeared anywhere
       (SCREEN_ROUTE_CONTRACT.json or TASK_MANIFEST.csv's Screen column).
    2. Each of the 5 screens has exactly one Page Owner Task.
    3. A technical route (/auth/callback, /api/**, not-found) is never
       counted as a user-facing screen.
    4. Destination detail and safety info were not turned into their own
       Page (no src/app/destinations/** or src/app/safety/** — those stay
       Drawer/Modal content inside SCR-001 per DEC-004 / TASK-PAGE-SCR001's
       Forbidden section). Checked against TASK_MANIFEST.csv's Expected
       Files in every mode, and against the real src/app tree in ci/release
       mode.
    5. TASK-PAGE-SCR003 depends on both a travel-input component
       (flight/hotel) and the mate-post-writing component.
    6. --mode=release only: docs/preview-checks/SCR-001.md..SCR-005.md all
       exist (one human-confirmed Preview Checkpoint record per screen).

Every failure is reported with the file it concerns, the Screen ID it
concerns (or N/A for a cross-cutting issue), and a concrete fix hint.

On success: prints SCREEN_CONTRACT_PASS, the mode, and the check count,
exit 0.
On failure: prints SCREEN_CONTRACT_FAIL with every failing item, exit 1.

Usage:
    python scripts/check_screen_contract.py --mode=plan
    python3 scripts/check_screen_contract.py --mode=ci
    python3 scripts/check_screen_contract.py --mode=release
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SCREEN_ROUTE_CONTRACT_JSON = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_CSV = REPO_ROOT / "TASKS" / "TASK_MANIFEST.csv"
SRC_APP_DIR = REPO_ROOT / "src" / "app"
PREVIEW_CHECKS_DIR = REPO_ROOT / "docs" / "preview-checks"

FIXED_SCREENS = {
    "SCR-001": "/",
    "SCR-002": "/about",
    "SCR-003": "/travel-tools",
    "SCR-004": "/mates",
    "SCR-005": "/account",
}
SCREEN_ORDER = ["SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"]

# design-reference/SCREEN_ROUTE_CONTRACT.json's technical_routes[].type values,
# expressed as the route forms the request gave: /auth/callback, /api/**, not-found.
TECHNICAL_ROUTE_PATTERNS = [
    re.compile(r"^/auth/callback/?$"),
    re.compile(r"^/api(/.*)?$"),
    re.compile(r"^not-found$"),
]

FORBIDDEN_NEW_PAGE_SEGMENTS = ["destinations", "destination", "safety"]
NON_LIST_CELL_VALUES = {"", "—", "-", "N/A", "없음"}


class Failure:
    def __init__(self, number: int, file: str, screen_id: str, message: str, hint: str) -> None:
        self.number = number
        self.file = file
        self.screen_id = screen_id
        self.message = message
        self.hint = hint

    def render(self) -> str:
        return (
            f"[Check {self.number}] file={self.file} screen={self.screen_id}: {self.message}\n"
            f"    hint: {self.hint}"
        )


class Report:
    def __init__(self, mode: str) -> None:
        self.mode = mode
        self.failures: list[Failure] = []
        self.checks_run: set[int] = set()

    def mark(self, number: int) -> None:
        self.checks_run.add(number)

    def fail(self, number: int, file: str, screen_id: str, message: str, hint: str) -> None:
        self.mark(number)
        self.failures.append(Failure(number, file, screen_id, message, hint))

    @property
    def ok(self) -> bool:
        return not self.failures


def is_technical_route(route: str) -> bool:
    route = (route or "").strip()
    return any(p.match(route) for p in TECHNICAL_ROUTE_PATTERNS)


def split_cell(cell: str | None) -> list[str]:
    cell = (cell or "").strip()
    if cell in NON_LIST_CELL_VALUES:
        return []
    return [p.strip() for p in cell.split(";") if p.strip()]


def load_screen_contract() -> dict:
    if not SCREEN_ROUTE_CONTRACT_JSON.is_file():
        raise SystemExit(f"required input missing: {SCREEN_ROUTE_CONTRACT_JSON.relative_to(REPO_ROOT)}")
    return json.loads(SCREEN_ROUTE_CONTRACT_JSON.read_text(encoding="utf-8"))


def load_manifest() -> dict[str, dict]:
    if not MANIFEST_CSV.is_file():
        raise SystemExit(f"required input missing: {MANIFEST_CSV.relative_to(REPO_ROOT)}")
    text = MANIFEST_CSV.read_text(encoding="utf-8")
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
            "route": (row.get("Route") or "").strip(),
            "page_entry": (row.get("Page Entry") or "").strip(),
            "depends_on": split_cell(row.get("Depends On")),
            "expected_files": split_cell(row.get("Expected Files")),
        }
    return tasks


# --- Check 1: exactly the 5 fixed screens ----------------------------------

def check_1(report: Report, contract: dict, tasks: dict) -> None:
    report.mark(1)
    screens = contract.get("screens", [])
    seen = {s.get("screen_id"): s.get("route") for s in screens}

    for screen_id, expected_route in FIXED_SCREENS.items():
        if screen_id not in seen:
            report.fail(
                1, "design-reference/SCREEN_ROUTE_CONTRACT.json", screen_id,
                "고정 화면이 screens[]에 없음",
                f"SCREEN_ROUTE_CONTRACT.json에 {screen_id} 항목(route={expected_route})을 추가한다.",
            )
            continue
        if seen[screen_id] != expected_route:
            report.fail(
                1, "design-reference/SCREEN_ROUTE_CONTRACT.json", screen_id,
                f"route가 {seen[screen_id]!r}로 되어 있음(기대값 {expected_route!r})",
                f"{screen_id}의 route를 {expected_route!r}로 고정한다.",
            )

    extra = set(seen) - set(FIXED_SCREENS)
    if extra:
        report.fail(
            1, "design-reference/SCREEN_ROUTE_CONTRACT.json", "N/A",
            f"고정 5개 화면 밖의 Screen이 등록되어 있음: {sorted(extra)}",
            "고정 5개 화면(SCR-001~SCR-005) 외의 Screen 항목을 SCREEN_ROUTE_CONTRACT.json에서 제거한다.",
        )

    manifest_screens = {t["screen"] for t in tasks.values() if t["screen"]}
    stray = manifest_screens - set(FIXED_SCREENS)
    if stray:
        report.fail(
            1, "TASKS/TASK_MANIFEST.csv", "N/A",
            f"고정 5개 화면 밖의 Screen 값이 Task에 쓰여 있음: {sorted(stray)}",
            "해당 Task의 Screen 열을 고정 5개 화면 중 하나로 고치거나 전역 Component(빈 값)로 되돌린다.",
        )

    count = contract.get("completion_checks", {}).get("screen_count")
    if count != 5:
        report.fail(
            1, "design-reference/SCREEN_ROUTE_CONTRACT.json", "N/A",
            f"completion_checks.screen_count가 {count!r}(기대값 5)",
            "completion_checks.screen_count를 5로 고친다.",
        )

    if report.mode in {"ci", "release"}:
        for screen_id, expected_route in FIXED_SCREENS.items():
            s = next((s for s in screens if s.get("screen_id") == screen_id), None)
            if not s:
                continue
            page_entry = s.get("page_entry", "")
            if not page_entry:
                continue
            path = REPO_ROOT / page_entry
            if not path.is_file():
                report.fail(
                    1, page_entry, screen_id,
                    "Page Entry 파일이 아직 구현되지 않음",
                    f"{screen_id}의 Page Owner Task를 완료해 {page_entry}를 만든다(--mode=plan에서는 이 검사를 건너뜀).",
                )


# --- Check 2: exactly one Page Owner per screen -----------------------------

def check_2(report: Report, tasks: dict) -> None:
    report.mark(2)
    for screen_id in SCREEN_ORDER:
        owners = [
            t for t in tasks.values()
            if t["category"] == "page_owner" and t["screen"] == screen_id
        ]
        if len(owners) == 0:
            report.fail(
                2, "TASKS/TASK_MANIFEST.csv", screen_id,
                "Page Owner Task가 없음",
                f"{screen_id}에 category=page_owner인 Task를 정확히 1개 추가한다.",
            )
        elif len(owners) > 1:
            report.fail(
                2, "TASKS/TASK_MANIFEST.csv", screen_id,
                f"Page Owner Task가 {len(owners)}개임: {sorted(t['id'] for t in owners)}",
                f"{screen_id}의 Page Owner Task를 정확히 1개로 합친다.",
            )


# --- Check 3: technical routes are never counted as a screen ---------------

def check_3(report: Report, contract: dict, tasks: dict) -> None:
    report.mark(3)
    for s in contract.get("screens", []):
        route = s.get("route", "")
        if is_technical_route(route):
            report.fail(
                3, "design-reference/SCREEN_ROUTE_CONTRACT.json", s.get("screen_id", "N/A"),
                f"기술 경로({route})가 사용자 화면 screens[]에 포함되어 있음",
                "이 항목을 screens[]에서 빼고 technical_routes[]로 옮긴다.",
            )

    for t in contract.get("technical_routes", []):
        if t.get("included_in_screen_count") is not False:
            report.fail(
                3, "design-reference/SCREEN_ROUTE_CONTRACT.json", "N/A",
                f"technical_routes 항목 {t.get('type')}의 included_in_screen_count가 false가 아님",
                "technical_routes[].included_in_screen_count를 false로 고정한다.",
            )

    for tid, t in tasks.items():
        if t["category"] == "page_owner" and is_technical_route(t["route"]):
            report.fail(
                3, "TASKS/TASK_MANIFEST.csv", t["screen"] or "N/A",
                f"{tid}: Page Owner Task의 Route({t['route']})가 기술 경로 패턴과 일치함",
                "이 Task를 Page Owner(화면)이 아니라 기술 Route Task로 재분류하거나 Route를 고친다.",
            )

    if report.mode in {"ci", "release"}:
        auth_callback = SRC_APP_DIR / "auth" / "callback"
        if auth_callback.is_dir():
            has_page = (auth_callback / "page.tsx").is_file()
            if has_page:
                report.fail(
                    3, "src/app/auth/callback/page.tsx", "N/A",
                    "기술 경로(auth callback)에 page.tsx가 있어 사용자 화면처럼 보일 수 있음",
                    "src/app/auth/callback에는 route.ts(Route Handler)만 두고 page.tsx를 만들지 않는다.",
                )


# --- Check 4: destination detail / safety info were not made into new Pages -

def check_4(report: Report, tasks: dict) -> None:
    report.mark(4)

    def path_is_forbidden(p: str) -> bool:
        norm = p.replace("\\", "/").lower()
        parts = [seg for seg in norm.split("/") if seg]
        if "app" not in parts:
            return False
        after_app = parts[parts.index("app") + 1:]
        return bool(after_app) and after_app[0] in FORBIDDEN_NEW_PAGE_SEGMENTS

    for tid, t in tasks.items():
        for f in t["expected_files"]:
            if path_is_forbidden(f):
                report.fail(
                    4, "TASKS/TASK_MANIFEST.csv", t["screen"] or "SCR-001",
                    f"{tid}의 Expected Files에 별도 여행지/안전정보 Page 경로가 있음: {f}",
                    "여행지 상세·안전정보는 SCR-001의 Drawer/Modal Component로만 만들고, 새 app 라우트 파일을 Expected Files에서 뺀다(DEC-004).",
                )

    if report.mode in {"ci", "release"} and SRC_APP_DIR.is_dir():
        for child in SRC_APP_DIR.iterdir():
            if child.is_dir() and child.name.lower() in FORBIDDEN_NEW_PAGE_SEGMENTS:
                report.fail(
                    4, str(child.relative_to(REPO_ROOT)), "SCR-001",
                    "여행지 상세·안전정보가 별도 Page 디렉터리로 실제 생성됨",
                    f"{child.relative_to(REPO_ROOT)} 디렉터리를 삭제하고 SCR-001의 Drawer/Modal Component로 옮긴다(DEC-004, TASK-PAGE-SCR001 Forbidden 절).",
                )


# --- Check 5: SCR-003 Page Owner covers both travel-input and mate-post ----

def check_5(report: Report, tasks: dict) -> None:
    report.mark(5)
    owner_id = "TASK-PAGE-SCR003"
    owner = tasks.get(owner_id)
    if not owner:
        report.fail(
            5, "TASKS/TASK_MANIFEST.csv", "SCR-003",
            f"{owner_id}를 찾을 수 없음",
            "SCR-003 Page Owner Task를 TASK_MANIFEST.csv에 등록한다.",
        )
        return

    deps = owner["depends_on"]
    has_travel_input = any(("FLIGHT" in d.upper() or "HOTEL" in d.upper()) for d in deps)
    has_mate_compose = any("MATE-COMPOSER" in d.upper() or "MATE_COMPOSER" in d.upper() for d in deps)

    if not has_travel_input:
        report.fail(
            5, "TASKS/TASK_MANIFEST.csv", "SCR-003",
            f"{owner_id}의 Depends On에 항공·숙소 여행 입력 Component가 없음: {deps}",
            "COMP-SCR003-FLIGHT-FORM/COMP-SCR003-HOTEL-FORM을 Depends On에 추가한다.",
        )
    if not has_mate_compose:
        report.fail(
            5, "TASKS/TASK_MANIFEST.csv", "SCR-003",
            f"{owner_id}의 Depends On에 동행 작성 Component가 없음: {deps}",
            "COMP-SCR003-MATE-COMPOSER를 Depends On에 추가한다.",
        )


# --- Check 6 (release only): Preview Checkpoint records ---------------------

def check_6(report: Report) -> None:
    report.mark(6)
    for screen_id in SCREEN_ORDER:
        path = PREVIEW_CHECKS_DIR / f"{screen_id}.md"
        if not path.is_file():
            report.fail(
                6, str(path.relative_to(REPO_ROOT)), screen_id,
                "release 검사에 필요한 Preview Checkpoint 기록이 없음",
                f"사람이 Vercel Preview로 {screen_id}를 확인한 뒤 {path.relative_to(REPO_ROOT)}를 작성한다.",
            )


def main() -> int:
    # Force UTF-8 stdout so Korean console output survives on Windows, where
    # sys.stdout otherwise defaults to the system locale codepage (e.g.
    # cp949 on Korean Windows) and silently mis-encodes it.
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=["plan", "ci", "release"], default="plan")
    args = parser.parse_args()

    contract = load_screen_contract()
    tasks = load_manifest()

    report = Report(args.mode)
    check_1(report, contract, tasks)
    check_2(report, tasks)
    check_3(report, contract, tasks)
    check_4(report, tasks)
    check_5(report, tasks)
    if args.mode == "release":
        check_6(report)

    if report.ok:
        print("SCREEN_CONTRACT_PASS")
        print(f"mode={args.mode}, {len(report.checks_run)} checks run")
        return 0

    print("SCREEN_CONTRACT_FAIL")
    print(f"mode={args.mode}, {len(report.checks_run)} checks run, {len(report.failures)} failure(s)")
    print()
    for f in report.failures:
        print(f.render())
    return 1


if __name__ == "__main__":
    sys.exit(main())
