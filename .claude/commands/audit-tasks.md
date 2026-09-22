---
description: Run scripts/audit_tasks.py's 18 checks against TASKS/00_TASK_LIST.md + TASKS/TASK-*.md and report the result
---

# /audit-tasks

1. Load the `traveler-project-pipeline` Skill (`.claude/skills/traveler-project-pipeline/SKILL.md`) so check failures can be explained against the right section/rule, not just repeated verbatim.
2. Run `python scripts/audit_tasks.py` (retry with `python3` if `python` is not found or resolves to the Windows Store stub). If neither runs a real interpreter in this environment, do not claim the audit passed — re-implement the same 18 checks faithfully (e.g. in Node) against the actual `TASKS/00_TASK_LIST.md` and `TASKS/TASK-*.md` files, run that, and tell the user this substitution was necessary.
3. The script reads real files (`TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md`, `docs/PROJECT_SCOPE.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`) and writes two outputs: `TASKS/TASK_MANIFEST.csv` and `TASKS/TASK_AUDIT_REPORT.md`. Confirm both were (re)written, and do not hand-edit either — they are generated, not authored.
4. Print the script's full output, not a summary — it already reports pass/fail per numbered check (1–18).
5. If it prints `AUDIT_PASS`: state clearly that the audit passed, report the check count and the informational task count (reminding that the task count is not itself a completion condition), and point to `TASKS/TASK_AUDIT_REPORT.md` for the per-check detail.
6. If it prints `AUDIT_FAIL` or exits non-zero: **never ignore this and never report the command as complete.** List every failing check by number and message exactly as the script reported it, and name the specific file (`TASKS/00_TASK_LIST.md` row or `TASKS/TASK-<ID>.md`) each failure points to.
7. This command only reads and reports — it never edits `TASKS/00_TASK_LIST.md` or `TASKS/TASK-*.md`, and it never writes application/implementation source code. If failures are found, direct the user to `/gen-task-details` (or `/gen-tasklist` for a structural issue such as a missing Page Owner or a broken dependency) to fix the underlying content, then re-run `/audit-tasks` — do not attempt to patch the failure by loosening a check in `scripts/audit_tasks.py` itself.
