# Free Traveler — Project State

| 항목 | 내용 |
|---|---|
| Document ID | STATE-TRAVEL-001 |
| 작성일 / 최종 갱신 | 2026-09-23 |
| 상태 | **LIVE** — 이 문서는 스냅샷이 아니라 진행 상황에 따라 계속 갱신되는 살아있는 문서다 |

> 이 문서는 프로젝트의 현재 상태를 한눈에 보기 위한 것이다. `/run-wave`, `/prepare-task`, `/release-check` 등을 실행한 뒤에는 해당 필드를 그 결과로 갱신한다. 값을 추측해서 채우지 않는다 — 확인되지 않은 진행 상황은 이전 값 그대로 두거나 "미확인"으로 남긴다.

---

## 필드

| 필드 | 값 |
|---|---|
| **Harness Schema** | `traveler-screen-route-v1` (`design-reference/SCREEN_ROUTE_CONTRACT.json`) |
| **Design Version** | D-001 — Status: LOCKED (`design-reference/DESIGN_MANIFEST.md`) |
| **Scope Mode** | Baseline 확정 (`docs/PROJECT_SCOPE.md`) — REQ-FUNC 80 + REQ-NF 34 = 114개 중 IMPLEMENT 92 / EXCLUDED 22 |
| **Current Wave** | W01 — `TASKS/WAVE_PLAN.md`/`TASKS/WAVE_STATE.json`이 `scripts/build_waves.py`로 생성됨(총 17개 Wave), 아직 시작 전(`status: pending`) |
| **Current Task** | N/A — 진행 중인 Task 없음(W01의 첫 Task는 `COMP-GLOBAL-DESIGN-TOKENS`) |
| **Completed Tasks** | 0 / 67 (`TASKS/00_TASK_LIST.md` 기준 구현 Task 67개, 상세 파일까지만 생성됨 — 구현 코드는 아직 없음) |
| **Blocked Tasks** | N/A — 아직 `/prepare-task`로 평가된 Task 없음 |
| **Latest CI** | NONE — `.github/workflows/`가 아직 없어 `CI-PIPELINE-BASE`가 구성되지 않음 |
| **Supabase State** | NOT_CONFIGURED — `.env*` 없음, `supabase/` 디렉터리 없음, `@supabase/supabase-js`/`@supabase/ssr` 미설치 |
| **Vercel Preview URL** | NONE — 배포 이력 없음 |
| **Screen Checkpoints** | 아래 표 참조 — 전체 PENDING |
| **Playwright State** | NOT_RUN — `@playwright/test` 미설치, `e2e/**` 없음 |
| **Deferred Items** | 아래 "Deferred Items" 절 참조 |
| **Next Action** | 아래 "Next Action" 절 참조 |

---

## Screen Checkpoints

| Screen | Route | 상태 |
|---|---|---|
| SCR-001 | `/` | PENDING |
| SCR-002 | `/about` | PENDING |
| SCR-003 | `/travel-tools` | PENDING |
| SCR-004 | `/mates` | PENDING |
| SCR-005 | `/account` | PENDING |
| FINAL | — | PENDING |

각 Screen 체크포인트는 해당 Page Owner Task가 `DONE`이고 사람이 Vercel Preview를 확인한 뒤 `CONFIRMED`로 갱신한다(`CLAUDE.md` 규칙 22). `FINAL`은 5개 Screen 체크포인트가 모두 `CONFIRMED`이고 `/release-check`가 `RELEASE_READY`를 낸 뒤에만 `CONFIRMED`로 갱신한다.

---

## Deferred Items

- `TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표에 있는 EXCLUDED Requirement 22건(REQ-FUNC-010/045/055/056/069/071/072/073/075/076, REQ-NF-004/007/008/009/010/011/018/020/021/022/029/033) — 사유와 후속 방향은 그 표를 참조.
- `docs/ARCHITECTURE.md`의 "착수 차단" 목록(환경변수 3종, `@supabase/supabase-js`/`@supabase/ssr`, `vitest`, `@playwright/test`, `.github/workflows/`, `supabase/`) — 아직 해소되지 않음.

---

## Next Action

1. `docs/ARCHITECTURE.md`의 착수 차단 항목을 해소한다: Supabase 프로젝트 생성 후 `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`/서버 전용 키를 `.env.local`에 기록하고, `@supabase/supabase-js`·`@supabase/ssr`·`vitest`·`@playwright/test`를 설치하고, `.github/workflows/`와 `supabase/` 디렉터리를 만든다.
2. 위 항목이 끝나면 `/run-wave W01`로 시작한다(`TASKS/WAVE_PLAN.md`·`TASKS/WAVE_STATE.json`은 이미 `scripts/build_waves.py`로 생성되어 있음 — W01~W17, Page Owner는 각각 W09/W11/W12/W13/W14에서 Wave의 마지막 Task로 배치됨, 자세한 내용은 `TASKS/WAVE_PLAN.md` 참조).
