---
description: Expand TASKS/00_TASK_LIST.md into 1:1 TASKS/TASK-<ID>.md detail files, then run the audit and never ignore its result
---

# /gen-task-details

1. Load the `traveler-project-pipeline` Skill (`.claude/skills/traveler-project-pipeline/SKILL.md`); defer to `CLAUDE.md` wherever the two overlap.
2. Require that `TASKS/00_TASK_LIST.md` exists — if not, stop and tell the user to run `/gen-tasklist` first. Read the actual file in full; do not work from a remembered summary of an earlier version.
3. Parse every implementation task out of `TASKS/00_TASK_LIST.md` (the 5 Page Owner blocks and every Category table row) in Seq order. Do not invent a task that isn't listed there.
4. Before writing, re-check the real file tree (`src/app/**`, `src/**`) so each Expected Files entry reflects what actually exists now (NEW vs. MODIFY), per the Skill's re-check rule.
5. For every implementation task, write exactly one detail file at `TASKS/TASK-<ID>.md` (filename = `TASK-` + the task's own ID, collapsing a leading `TASK-` the ID already has to one — e.g. `TASK-PAGE-SCR001.md`, `TASK-COMP-SCR001-SEARCH-HERO.md`). If a detail file already exists for a task ID still present in the list, overwrite it so it stays in sync — never leave a stale duplicate copy.
6. Each detail file must contain, in this order, the 14 sections from the Skill's §4: Context, Project Scope, Requirement Ref, Screen/Route/Page Entry, Design Ref, Depends On, Expected Files, Functional AC, Visual AC, Security/Privacy AC, Test Cases, Verify, Definition of Done, Forbidden. In particular:
   - Requirement Ref lists fully-qualified `REQ-FUNC-NNN`/`REQ-NF-NNN` IDs only (no bare trailing numbers).
   - Page Owner tasks: full Section order + minimum content counts from `design-reference/UI_CONTRACT.md`, a no-placeholder/complete-Empty-State AC, and (SCR-001 only) an explicit create-next-app starter-removal AC, (SCR-003 only) an AC assembling all 3 named tabs, (SCR-005 only) an AC assembling Guest/Member/Admin role states (Skill §5).
   - DB tasks: only the 6 allowed tables (Skill §6) — never introduce a 7th.
   - Flight/hotel-related tasks: the non-persistence invariant from Skill §7 (never sent to server/DB/URL/log).
   - Auth/RLS tasks: the baseline from Skill §8 (adult-verification fields only, RLS never bypassed client-side, Service Role Key never in client code).
   - The 3 named E2E tasks: Chromium-only, no other browser mentioned outside an explicit negation (Skill §9).
7. Do not create a detail file for any requirement listed as EXCLUDED in `TASKS/00_TASK_LIST.md`'s `NON_IMPLEMENTATION` table (Skill §11) — they stay list-only.
8. Delete any `TASKS/TASK-*.md` file whose name doesn't correspond to a current implementation task ID (orphan cleanup) — this is a routine, expected part of keeping 1:1 correspondence, not a destructive action requiring separate confirmation, but list what you removed in the completion report.
9. Do not write any application/implementation source code (`src/**`, `supabase/**`, `.github/**`, etc.) in this step — only `TASKS/TASK-*.md` files.
10. After all detail files are written, run `/audit-tasks` (or `python`/`python3 scripts/audit_tasks.py` directly if that command isn't available) and report its full output. **Never report this command as complete if the audit fails or errors** — if it fails, state clearly what failed (check number + message), fix the mismatch in the task list or the detail files, and re-run the audit until it passes. Never weaken or skip an audit check to force a pass.
