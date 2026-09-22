---
description: Implement exactly one READY_TO_IMPLEMENT Task within its Expected Files, verify it, and report — no commit/push/PR by default
---

# /implement-task

Implements **exactly one** Task. If asked to implement several Tasks at once, refuse and ask the user to invoke this command once per Task, in `Depends On` order (`CLAUDE.md` rule 7, Skill §10 — Wave 내부 Single Agent 순차 수행).

## 0. Gate — `prepare-task` must already say `READY_TO_IMPLEMENT`

1. Run `/prepare-task` for this exact `WAVE_ID`/`TASK_ID` if it hasn't already been run in this session for this Task, or if the working tree has changed since it last ran.
2. If the result is anything other than `READY_TO_IMPLEMENT` (`BLOCKED_INPUT`/`BLOCKED_DEPENDENCY`/`BLOCKED_DIRTY_TREE`/`BLOCKED_SCOPE`), **stop immediately** — do not read further, do not write or edit any file. Report the blocking status and the fix it named.

## 1. Load context

3. Load the `traveler-project-pipeline` Skill (`.claude/skills/traveler-project-pipeline/SKILL.md`) and `CLAUDE.md`; `CLAUDE.md` wins on overlap.
4. Read `TASKS/00_TASK_LIST.md`'s row/block for this Task and its full `TASKS/TASK-<ID>.md` detail file. Do not implement from memory of an earlier read.

## 2. Implement — strictly within Expected Files

5. Only create or modify files listed in this Task's **Expected Files**. Do not touch any other file, including other Tasks' Expected Files, config files, or files belonging to a different Screen — even if it looks like a small, related improvement (`CLAUDE.md` rule 8).
6. Follow the Functional AC, Visual AC, and Security/Privacy AC in the detail file exactly — implement what they require, nothing they don't ask for, and nothing listed under Forbidden.
7. **If this is a Page Owner Task**: assemble the real Page Entry (`page.tsx`) — actually compose the Section order from the Component Tasks it depends on, wire real data bindings and state, not a placeholder or a TODO-stubbed layout. If a same-screen Component Task this Page Owner depends on hasn't been implemented yet, stop and report `BLOCKED_DEPENDENCY`-equivalent instead of stubbing it in — do not fake a dependency's output.
8. Never add anything from `CLAUDE.md` rule 17 / Skill §12 regardless of how convenient it seems: no AWS/EC2 infrastructure, no ORM (Prisma, Drizzle, etc.), no auto-merge/auto-PR tooling.

## 3. Verify

9. Run the Unit Test(s) this Task's `Verify`/`Test Cases` reference (Vitest). If a referenced test file doesn't exist yet because its owning Task hasn't run, say so plainly — do not report an untested claim as passing.
10. Run the Playwright Chromium Smoke Task **only if** this Task is a Page Owner Task or is itself one of the 3 named E2E tasks (`E2E-PUBLIC-SMOKE` / `E2E-TRAVEL-TOOLS` / `E2E-MATE-AUTH`). For any other Task type (Component, Data, DB, Auth/API, non-E2E test, CI/manual), do not run Playwright.
11. Review `git status` / `git diff` before reporting: confirm every changed path is inside this Task's Expected Files and nothing else was touched.

## 4. Report (always, regardless of outcome)

12. Report exactly:
    - **변경 파일**: the full list of files created/modified, each tagged NEW or MODIFY.
    - **검증**: which Unit Test(s) ran and their result; whether Playwright ran (and why, per rule 10) and its result; if anything couldn't be verified yet (e.g. a dependency not yet implemented), say so explicitly.
    - **남은 제약**: anything this Task's AC calls for but couldn't be completed (missing dependency, missing env var, etc.), and anything intentionally deferred to a later Task.

## 5. Commit — never automatic, never pushed

13. By default, **do not commit, push, or open a PR** for this Task's changes — leave the working tree as-is for the user to review.
14. **Only if the user explicitly asks** in this conversation, create a single Task-scoped commit containing exactly this Task's Expected Files (nothing else staged), with a message naming the `TASK_ID`. Even then, never `git push` and never create a PR — `docs/DECISION_LOG.md` DEC-012 and `CLAUDE.md` rule 21 reserve Push/PR/Merge for the user to do manually.
