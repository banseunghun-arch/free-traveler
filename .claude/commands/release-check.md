---
description: Pre-release gate — 7 checks across Task/Wave state, CI, Playwright, Supabase, Vercel Preview, and EXCLUDED scope; verdict is RELEASE_READY or RELEASE_BLOCKED
---

# /release-check

Read-only release gate. This command does not edit `TASKS/**` or any application source, does not deploy, does not push, and does not merge — it only inspects real evidence and reports one verdict. Anything it cannot verify directly in this environment is treated as **blocking**, never assumed to pass.

## 검사

### 1. Task·Wave 상태

- `TASKS/WAVE_STATE.json`을 읽는다. 없으면 이 검사는 통과할 수 없다(Wave 진행 상태를 확인할 근거가 없음).
- `TASKS/00_TASK_LIST.md`의 모든 구현 Task ID가 `WAVE_STATE.json`에 존재하는지 확인한다(빠진 Task는 상태 불명 = 통과 불가).
- 하나라도 `status`가 `BLOCKED_*`(`prepare-task`의 4가지 값 중 하나)로 남아 있으면 이 검사는 실패한다.

### 2. 5개 Page Owner DONE

- `TASK-PAGE-SCR001`~`TASK-PAGE-SCR005` 5개 모두 `WAVE_STATE.json`에서 `status: "DONE"`인지 확인한다.
- 보조로, 각 Page Entry(`src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/travel-tools/page.tsx`, `src/app/mates/page.tsx`, `src/app/account/page.tsx`)가 실제로 존재하고 `src/app/page.tsx`가 더 이상 create-next-app 기본 스타터가 아닌지 파일 내용을 직접 읽어 확인한다(상태 파일과 실제 파일이 어긋나면 실패로 처리).

### 3. CI PASS

- 가능하면 `gh`(GitHub CLI)로 최신 커밋/브랜치의 CI 워크플로(`CI-PIPELINE-BASE`, `.github/workflows/ci.yml`) 실행 결과를 조회한다(`gh run list`/`gh api` 등).
- `gh`를 쓸 수 없거나 인증되어 있지 않으면, CI 결과를 추측하지 않는다 — 사람에게 최신 CI 실행 링크/상태를 확인해 달라고 요청하고, 확인 전까지 이 검사는 미해결(=실패로 집계)로 둔다.

### 4. Playwright Smoke PASS

- `E2E-PUBLIC-SMOKE`, `E2E-AUTH-SMOKE` 2개 Chromium Smoke Task(`tests/e2e/public-smoke.spec.ts`, `tests/e2e/auth-smoke.spec.ts`)의 최근 실행 결과를 확인한다.
- 이 명령 실행 시점에 로컬에서 직접 재실행할 수 있으면 `npx playwright test --project=chromium`으로 실제 실행해 결과를 확인한다(테스트 실행은 애플리케이션 코드 수정이 아니므로 허용된다). 실행할 수 없는 환경이면(브라우저 미설치 등) 왜 실행할 수 없었는지 밝히고 이 검사를 미해결로 둔다 — 통과했다고 가정하지 않는다.
- `E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD`가 없어 `E2E-AUTH-SMOKE`가 skip된 경우, 그 자체는 실패가 아니다 — `E2E-PUBLIC-SMOKE`가 실제로 PASS했는지만 확인하고, `E2E-AUTH-SMOKE`가 skip이 아니라 FAIL인 경우에만 이 검사를 실패로 처리한다(DEC-018).

### 5. Supabase 6개 Table·기본 RLS 확인 기록

- `TASKS/TASK_AUDIT_REPORT.md`(`scripts/audit_tasks.py` Check 11/12)에서 `profiles`/`mate_posts`/`participation_requests`/`blocks`/`reports`/`external_urls` 6개 테이블이 Task 정의상 정확히 존재하는지 확인한다(정의상 확인).
- 실제 Supabase 프로젝트에도 이 6개 테이블과 RLS 정책이 적용되어 있다는 **기록**(예: `docs/RELEASE_CHECKLIST.md`의 체크 항목, `TEST-RLS-BASIC` 통과 로그, 또는 `supabase db` 조회 결과)이 있어야 통과한다 — Task 정의만 맞고 실제 DB에 적용됐다는 증거가 없으면 이 검사는 미해결로 둔다.

### 6. Vercel Preview Checkpoint

- `TASKS/WAVE_PLAN.md`/`TASKS/WAVE_STATE.json`에서 이번 릴리스에 포함되는 Wave(들)에 `Preview Checkpoint`가 있었다면, 그 시점에 사람이 실제로 Vercel Preview를 확인했다는 기록이 있는지 확인한다.
- Vercel CLI가 설치·인증되어 있으면 최근 Preview 배포 목록을 조회해 존재를 확인한다. 그렇지 않으면 사람에게 "이 릴리스 대상 Wave의 Preview를 직접 확인했는가"를 명시적으로 확인받기 전까지 이 검사를 미해결로 둔다.

### 7. EXCLUDED 목록

- `TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표를 읽어 EXCLUDED Requirement 전체 목록(ID + 사유)을 보고에 그대로 포함한다.
- `TASKS/TASK_AUDIT_REPORT.md`의 Check 17(114개 Requirement 전수 반영)·Check 18(EXCLUDED 상세 구현 파일 미생성)이 PASS 상태인지 확인한다. 하나라도 FAIL이면 이 검사는 실패한다.

## 판정

- **`RELEASE_READY`**: 위 7개 검사가 **전부** 실제 증거로 확인되어 통과했을 때만 출력한다.
- **`RELEASE_BLOCKED`**: 하나라도 실패했거나, 증거 부족으로 확인할 수 없어 미해결로 남은 검사가 있으면 출력한다. "확인할 수 없음"은 통과가 아니라 항상 `RELEASE_BLOCKED` 사유로 취급한다.

두 경우 모두 다음을 함께 보고한다:
1. 7개 검사 각각의 PASS/FAIL/미해결 상태.
2. `RELEASE_BLOCKED`인 경우, 실패·미해결 검사별 구체적 사유와 무엇을 확인/수행해야 다음 재실행에서 통과할 수 있는지.
3. 7절의 EXCLUDED 목록 전체(릴리스 노트에 그대로 옮길 수 있도록).

## 제약

- 이 Command는 `TASKS/**`, `src/**`를 포함한 어떤 파일도 수정하지 않는다 — 검증을 위해 테스트를 실행하는 것은 예외로 허용하되, 그 결과로 코드를 고치지 않는다.
- 이 Command는 배포·Merge·Push를 스스로 수행하지 않는다.
- 불확실한 항목을 사람에게 확인받지 않고 임의로 통과 처리하지 않는다.
