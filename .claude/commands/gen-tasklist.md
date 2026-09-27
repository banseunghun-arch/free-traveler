---
description: Generate or refresh TASKS/00_TASK_LIST.md for the Traveler implementation pipeline from the approved UI/UX + SRS baseline
---

# /gen-tasklist

1. Load the `traveler-project-pipeline` Skill (`.claude/skills/traveler-project-pipeline/SKILL.md`) and follow its 12 sections. Where it and `CLAUDE.md` overlap, `CLAUDE.md`'s Harness Marker and 23 rules win.
2. Run `python scripts/validate_inputs.py` (retry with `python3` if `python` resolves to the Windows Store stub or isn't found). If it prints `VALIDATE_INPUTS_FAIL` or exits non-zero, stop and report the failures verbatim — do not generate a task list against invalid/missing inputs.
3. Read the actual files, in the order given in the Skill's §1: `design-reference/SCREEN_ROUTE_CONTRACT.json`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`, `docs/ARCHITECTURE.md`, `docs/DECISION_LOG.md`. Do not rely on memory of a prior run — re-read them.
4. List the actual current `package.json` and `src/app/**` file tree (Skill §1, rule: never assume a path exists). Note which of the 5 Page Entry files already exist and what they currently contain.
5. If `TASKS/00_TASK_LIST.md` already exists, read it first so the regeneration is a deliberate update, not a blind overwrite that silently drops manual edits.
6. Build the task set per the Skill:
   - Exactly 5 Page Owner tasks, one per Screen in `SCREEN_ROUTE_CONTRACT.json` (§2, §5).
   - Component tasks (screen-tagged) and global/shared Component tasks, per §5.
   - Data tasks for destinations, country safety, and representative content as **static `src/data/**` TypeScript**, never DB tasks (§6).
   - DB tasks covering only the 6 tables named in §6 — never a 7th table.
   - Auth/API tasks scoped to Auth, mate posts, participation, block/report, external URL settings (§8) — never a Route Handler that persists flight/hotel search input (§7).
   - Test tasks: Unit (`UNIT-TRAVEL-DATES`, `UNIT-CONTACT-DETECTION`, `UNIT-MATE-STATE`), Integration (`TEST-RLS-BASIC`), and exactly the 2 named Chromium-only E2E tasks (`E2E-PUBLIC-SMOKE`, `E2E-AUTH-SMOKE`) per §9/DEC-018 — never more, never a multi-browser matrix.
   - CI/Release/Manual tasks (lint/build/test gate, release checklist, a11y check, performance check).
   - Never an EC2/AWS/auto-merge task (§12).
7. For every task, set `Depends On` per §5 (a Page Owner depends on every Component task sharing its screen tag, plus any global Component/Data/API tasks it uses).
8. Attach `Requirement Ref` to each task by cross-referencing `docs/UIUX_TRACEABILITY.md` — use the fully-qualified `REQ-FUNC-NNN` / `REQ-NF-NNN` form every time (never a bare trailing number in a comma list). Every one of the 114 requirements must end up either attached to a task (IMPLEMENT) or listed in the `NON_IMPLEMENTATION` table with its reason (EXCLUDED) — Skill §3.
9. Write (or rewrite) `TASKS/00_TASK_LIST.md` in the format from Skill §4: a summary block (total + per-category counts), the `NON_IMPLEMENTATION` table, the 5 Page Owner blocks, then Category tables for the rest.
10. Do not write `TASKS/TASK-*.md` detail files in this step — that is `/gen-task-details`. Do not write any application/implementation source code (`src/**` beyond what already exists, `supabase/**`, etc.) — this command only produces the one Markdown task list.
11. Report to the user: total task count (informational only, never a pass/fail gate), the 5 Page Owner task IDs, and the number of `NON_IMPLEMENTATION` entries. Direct the user to `/gen-task-details` next.
