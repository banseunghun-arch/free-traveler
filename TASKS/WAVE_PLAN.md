# Free Traveler — Wave Plan

| 항목 | 내용 |
|---|---|
| Document ID | WAVEPLAN-TRAVEL-001 |
| 생성 도구 | `scripts/build_waves.py` (재실행 시 이 문서를 덮어쓴다) |
| 생성 시각 | 2026-09-22T20:58:46Z |
| 총 Wave 수 | 17 |
| 총 Task 수 | 67 |

> Wave ID는 이 문서 생성 전에 미리 고정하지 않는다. `scripts/build_waves.py`가 실제로 산출한 Wave ID가 정본이며, `/run-wave`·`/prepare-task`·`TASKS/WAVE_STATE.json`은 이 문서를 그대로 따른다. Wave 안에서도 Task는 Task ID 알파벳 순으로 한 번에 하나씩 실행한다(CLAUDE.md 규칙 7).

---

## Wave 목록

| Wave ID | Wave Group | Task 수 | Task ID(실행 순서) | Preview Checkpoint |
|---|---|---|---|---|
| W01 | 공통 UI(D-001 디자인 토큰 기반)·정적 데이터·Layout | 1 | COMP-GLOBAL-DESIGN-TOKENS | 아니오 |
| W02 | 공통 UI(D-001 디자인 토큰 기반)·정적 데이터·Layout | 7 | COMP-GLOBAL-A11Y; COMP-GLOBAL-EMPTY-STATE-BLOCK; COMP-GLOBAL-ERROR-PAGES; COMP-GLOBAL-FAVORITES; COMP-GLOBAL-HEADER-FOOTER; COMP-GLOBAL-RESPONSIVE-LAYOUT; COMP-GLOBAL-SEO-META | 아니오 |
| W03 | 공통 UI(D-001 디자인 토큰 기반)·정적 데이터·Layout | 5 | COMP-GLOBAL-TOAST; DATA-DESTINATIONS; DATA-REPRESENTATIVE; DATA-SAFETY; DATA-VALIDATION-SCRIPT | 아니오 |
| W04 | Supabase Auth, 6개 Table, 기본 RLS | 1 | DB-SCHEMA-BASE | 아니오 |
| W05 | Supabase Auth, 6개 Table, 기본 RLS | 1 | DB-RLS-BASE | 아니오 |
| W06 | Supabase Auth, 6개 Table, 기본 RLS | 2 | AUTH-SUPABASE-EMAIL; DB-ACCESS | 아니오 |
| W07 | Supabase Auth, 6개 Table, 기본 RLS | 5 | API-ADMIN-URLS; API-BLOCK-REPORT; API-MATE-POSTS; API-PARTICIPATION; DB-SEED-BASE | 아니오 |
| W08 | SCR-001 Component와 Page Owner | 3 | COMP-SCR001-ABOUT-SUMMARY; COMP-SCR001-DEST-DETAIL-DRAWER; COMP-SCR001-DOMESTIC-GRID | 아니오 |
| W09 | SCR-001 Component와 Page Owner | 6 | COMP-SCR001-INTL-GRID; COMP-SCR001-MATE-PREVIEW; COMP-SCR001-SAFETY-GRID; COMP-SCR001-SEARCH-HERO; COMP-SCR001-THEME-CHIPS; TASK-PAGE-SCR001 | 예 |
| W10 | SCR-002 Component와 Page Owner | 7 | COMP-SCR002-GALLERY; COMP-SCR002-INTRO-PHILOSOPHY; COMP-SCR002-PROFILE-HERO; COMP-SCR002-RECOMMENDED-DEST; COMP-SCR002-TIMELINE; COMP-SCR002-TRAVEL-STATS; COMP-SCR002-VISITED-COUNTRIES | 아니오 |
| W11 | SCR-002 Component와 Page Owner | 1 | TASK-PAGE-SCR002 | 예 |
| W12 | SCR-003 Component와 Page Owner | 5 | COMP-SCR003-FLIGHT-FORM; COMP-SCR003-HOTEL-FORM; COMP-SCR003-INTRO-TABS; COMP-SCR003-MATE-COMPOSER; TASK-PAGE-SCR003 | 예 |
| W13 | SCR-004 Component와 Page Owner | 7 | COMP-SCR004-APPLY-FLOW; COMP-SCR004-FILTER-BAR; COMP-SCR004-INTRO-CTA; COMP-SCR004-POST-DETAIL; COMP-SCR004-POST-LIST; COMP-SCR004-REPORT-BLOCK; TASK-PAGE-SCR004 | 예 |
| W14 | SCR-005 Component와 Page Owner | 5 | COMP-SCR005-ADMIN; COMP-SCR005-AUTH; COMP-SCR005-MY-ACTIVITY; COMP-SCR005-PROFILE; TASK-PAGE-SCR005 | 예 |
| W15 | Unit·Playwright·접근성·CI | 7 | CI-PIPELINE-BASE; E2E-MATE-AUTH; E2E-PUBLIC-SMOKE; E2E-TRAVEL-TOOLS; MANUAL-A11Y-CHECK; MANUAL-PERFORMANCE-CHECK; TEST-RLS-BASIC | 아니오 |
| W16 | Unit·Playwright·접근성·CI | 3 | UNIT-CONTACT-DETECTION; UNIT-MATE-STATE; UNIT-TRAVEL-DATES | 아니오 |
| W17 | Vercel Preview와 Release 확인 | 1 | RELEASE-CHECK-VERCEL-SUPABASE | 예 |

---

## Page Owner Wave 위치

| Screen | Page Owner Task ID | Wave ID | 해당 Wave의 마지막 Task 여부 |
|---|---|---|---|
| SCR-001 | TASK-PAGE-SCR001 | W09 | 예 |
| SCR-002 | TASK-PAGE-SCR002 | W11 | 예 |
| SCR-003 | TASK-PAGE-SCR003 | W12 | 예 |
| SCR-004 | TASK-PAGE-SCR004 | W13 | 예 |
| SCR-005 | TASK-PAGE-SCR005 | W14 | 예 |

