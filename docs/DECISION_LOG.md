# Free Traveler — Decision Log

| 항목 | 내용 |
|---|---|
| Document ID | DECLOG-TRAVEL-001 |
| 기준 문서 | `docs/ARCHITECTURE.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`, `design-reference/DESIGN_MANIFEST.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `.claude/skills/traveler-project-pipeline/SKILL.md`, `TASKS/00_TASK_LIST.md`, `scripts/audit_tasks.py` |
| 작성일 | 2026-09-23 |
| 상태 | DEC-009·DEC-016은 DEC-018로 SUPERSEDED, 그 외 전 항목 CONFIRMED |

> 이 문서는 프로젝트 진행 중 확정된 결정을 번호를 매겨 기록한다. 이후 결정을 뒤집으려면 새 DEC 항목을 추가하고 이전 항목의 상태를 SUPERSEDED로 표시하며, 기존 항목을 삭제하지 않는다.

---

## DEC-001 — 실제 개발 루트는 `traveler/app`

- **결정**: 이 저장소에서 Next.js 애플리케이션의 실제 개발 루트(모든 상대 경로의 기준)는 `traveler/app`이다.
- **배경**: `package.json`, `src/app/**`, `TASKS/**`, `docs/**`, `design-reference/**`가 모두 이 디렉터리를 기준으로 존재하며, Task List·Task 상세 파일의 `Expected Files` 경로(`src/...`, `scripts/...`, `supabase/...`)는 이 루트에 대한 상대 경로다.
- **영향**: 앞으로 작성되는 모든 문서·Task·CI 설정의 경로 표기는 `traveler/app`을 루트로 가정한다. 이 경로 밖(리포지토리 최상위 등)에 애플리케이션 코드를 두지 않는다.
- **상태**: CONFIRMED

## DEC-002 — 디자인 Screen은 핵심 4개·보조 1개

- **결정**: 승인된 Screen은 정확히 5개이며, SCR-001(홈)·SCR-003(통합 여행 준비)·SCR-004(동행 찾기)·SCR-005(계정·관리)를 핵심(core), SCR-002(대표 소개)를 보조(secondary)로 고정한다.
- **근거 문서**: `design-reference/SCREEN_ROUTE_CONTRACT.json`(`completion_checks.tier_distribution = {core:4, secondary:1}`), `design-reference/UI_CONTRACT.md`.
- **영향**: 6개 이상의 Screen을 만들지 않는다. Page Owner Task는 Screen당 정확히 1개(`scripts/audit_tasks.py` Check 5)이며, 이 5개 Screen 수에 포함되지 않는 것은 "기술 Route"로만 취급한다.
- **상태**: CONFIRMED

## DEC-003 — `/travel-tools`에 항공·숙소·동행 작성을 통합

- **결정**: 항공편 조건 입력, 숙소 조건 입력, 동행글 작성을 별도 라우트(`/flights`, `/hotels`, `/mates/new`)로 두지 않고 SCR-003(`/travel-tools`)의 3개 탭("항공편 찾기"/"숙소 찾기"/"동행 구하기")으로 통합한다.
- **배경**: 조각난 라우트 대신 "여행 준비"라는 단일 사용자 흐름으로 묶어 이동 경로를 단순화한다.
- **근거 문서**: `docs/PROJECT_SCOPE.md` 2절, `design-reference/SCREEN_ROUTE_CONTRACT.json`(SCR-003 `sections.tabs_flight_hotel_mate`), `TASKS/TASK-PAGE-SCR003.md`.
- **영향**: `/mates`(SCR-004)는 동행글 작성 기능 없이 목록·필터·상세·참가·신고/차단만 담당한다.
- **상태**: CONFIRMED

## DEC-004 — 여행지·안전·대표는 정적 TypeScript Data

- **결정**: 여행지, 국가별 안전정보, free_traveler 대표 소개는 DB 테이블이 아닌 `src/data/**`의 정적 TypeScript 데이터로 관리한다.
- **배경**: 콘텐츠 규모가 작아 CMS·관리자 CRUD·게시 워크플로를 구축할 개발 비용이 목표 대비 과하다.
- **근거 문서**: `docs/PROJECT_SCOPE.md` 4절·5절, `TASKS/TASK-DATA-DESTINATIONS.md`/`TASK-DATA-SAFETY.md`/`TASK-DATA-REPRESENTATIVE.md`, `docs/ARCHITECTURE.md` 6절.
- **영향**: 콘텐츠 수정은 Git 커밋으로 이루어지며, 완전성은 `scripts/validate_content_data.mjs`(`DATA-VALIDATION-SCRIPT`)로 검증한다.
- **상태**: CONFIRMED

## DEC-005 — Supabase는 Auth와 동행 기능 중심

- **결정**: Supabase의 역할을 ① 이메일 인증(Auth) ② 동행(Mate) 관련 기능(작성·참가·차단·신고·관리자 URL 설정)으로 한정한다.
- **배경**: 여행지·안전·대표 콘텐츠(DEC-004)까지 Supabase에 넣지 않음으로써 백엔드 책임 범위를 명확히 좁힌다.
- **근거 문서**: `docs/PROJECT_SCOPE.md` 3절, `docs/ARCHITECTURE.md` 7절.
- **영향**: Supabase 스키마·RLS 설계는 6개 테이블(DEC-006)의 범위를 넘지 않는다.
- **상태**: CONFIRMED

## DEC-006 — DB는 6개 Table로 제한

- **결정**: Supabase Postgres 스키마는 정확히 `profiles`, `mate_posts`, `participation_requests`, `blocks`, `reports`, `external_urls` 6개 테이블로 제한한다.
- **배경**: 즐겨찾기(`localStorage`)·감사 로그(Git 이력으로 대체) 등은 별도 테이블 없이 대체 수단으로 처리해 스키마를 최소화한다.
- **근거 문서**: `docs/PROJECT_SCOPE.md` 4절, `.claude/skills/traveler-project-pipeline/SKILL.md` Rule 10, `TASKS/TASK-DB-SCHEMA-BASE.md`, `scripts/audit_tasks.py` Check 11·12.
- **영향**: 7번째 테이블(감사 로그, 즐겨찾기 등)을 추가하는 Task는 생성하지 않으며, `audit_tasks.py`가 이를 자동 검사한다.
- **상태**: CONFIRMED

## DEC-007 — 항공·숙소 입력은 Browser Memory에만 유지

- **결정**: 항공·숙소 조건 입력값(국가·지역·날짜 등)은 Client Component의 React 상태(Browser Memory)로만 보관하고, 서버 API·DB·URL 쿼리 파라미터·로그 어디에도 전달·저장하지 않는다.
- **배경**: 개인 여행 계획 정보를 불필요하게 서버에 남기지 않아 프라이버시 노출면을 줄인다.
- **근거 문서**: `docs/PROJECT_SCOPE.md` 6.2/6.3절(REQ-FUNC-017, 025), 6.10절(REQ-NF-017), `docs/ARCHITECTURE.md` 4·5절, `TASKS/TASK-COMP-SCR003-FLIGHT-FORM.md`/`TASK-COMP-SCR003-HOTEL-FORM.md`.
- **영향**: 이 값을 위한 Route Handler·DB 마이그레이션을 만들지 않는다. `scripts/audit_tasks.py` Check 13이 관련 Task의 AC에 비저장 원칙이 명시되어 있는지 검사한다.
- **상태**: CONFIRMED

## DEC-008 — Airbnb `DESIGN.md`는 vendor 참고본, D-001이 실제 정본

- **결정**: Airbnb를 참고해 작성된 `DESIGN.md` 원본은 **vendor 참고본**(디자인 발상의 출발점)일 뿐이며, Traveler 전용으로 재작성한 **`design-reference/D-001/DESIGN.md`가 실제 구현 정본**이다.
- **배경**: 코랄 브랜드(`#D03E1B`, Airbnb Rausch `#ff385c`와 구분), Inter+한글 폰트, Traveler 전용 컴포넌트 규칙 등은 D-001에만 존재하며 vendor 참고본에는 없다.
- **근거 문서**: `design-reference/DESIGN_MANIFEST.md`(Active Design Version: D-001, Status: LOCKED, Vendor Reference 경로 별도 명시), `docs/STITCH_VALIDATION_REPORT.md`.
- **영향**: 구현·리뷰 시 색상·타이포·컴포넌트 규칙에 대한 이견이 있으면 항상 D-001을 우선하며, vendor 참고본의 문구·색상·상표를 그대로 가져오지 않는다(Airbnb 상표 금지 원칙과 직결).
- **상태**: CONFIRMED

## DEC-009 — Playwright는 Chromium Smoke만 필수

- **결정**: Playwright E2E는 Chromium 단일 브라우저의 Smoke Test로만 구성하며, 정확히 `E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH` 3개 Task만 필수로 둔다.
- **배경**: 멀티 브라우저 매트릭스나 화면별 세분화된 회귀 스위트는 이번 단계의 검증 목표(핵심 흐름 동작 확인) 대비 유지비용이 과하다.
- **근거 문서**: `.claude/skills/traveler-project-pipeline/SKILL.md` Rule 13(원 규칙은 "정확히 1개"였으나, 이후 `docs/PROJECT_SCOPE.md` 7절의 10개 시나리오를 3개 영역으로 나눈 명시적 Task 목록 요청으로 이 3개 Task 구성으로 갱신됨), `docs/ARCHITECTURE.md` 12절, `scripts/audit_tasks.py` Check 15.
- **영향**: Firefox/WebKit 프로젝트, 화면별 개별 E2E 파일을 추가하지 않는다.
- **상태**: SUPERSEDED by DEC-018 (Task ID·파일 구성이 바뀌었으나 "Chromium 단일 브라우저만 사용"이라는 원칙 자체는 DEC-018에도 그대로 남아 있다)

## DEC-010 — 사용자의 개발 실행 단위는 Wave

- **결정**: 사용자가 실제 구현 작업을 실행하는 단위는 개별 Task가 아니라 **Wave**(여러 Task를 묶은 실행 배치)다.
- **배경**: `TASKS/00_TASK_LIST.md`의 67개 구현 Task는 `Depends On`으로 서로 연결되어 있어(`scripts/audit_tasks.py` Check 3·4가 누락·순환을 검사), 의존성이 없는 Task들을 하나의 Wave로 묶어 순서대로 진행하는 편이 진행 상황을 파악하기 쉽다.
- **영향**: 향후 Wave 계획 문서(예: `TASKS/WAVE_PLAN.md` 등)를 별도로 요청받으면 이 Task 그래프를 기준으로 Wave를 분할한다. 이 문서 자체는 Wave 분할표를 만들지 않는다(요청 시 별도 작업으로 처리).
- **상태**: CONFIRMED

## DEC-011 — Single Agent가 Wave 내부 Task를 순차 수행

- **결정**: 하나의 Wave 안에서는 여러 Agent를 동시에 병렬 투입하지 않고, **Single Agent가 Task를 순차적으로** 수행한다.
- **배경**: 동일 파일(예: `src/app/page.tsx`, 공용 Component)을 여러 Agent가 동시에 수정하면 충돌·중복 작업이 발생하므로, Wave 내부에서는 순차 실행으로 일관성을 보장한다.
- **영향**: Wave 실행 계획을 세울 때 병렬 Agent 분배를 전제로 설계하지 않는다. Task 간 `Depends On` 순서를 그대로 실행 순서로 사용한다.
- **상태**: CONFIRMED

## DEC-012 — PR·Merge는 사용자가 수동 수행

- **결정**: Pull Request 생성과 Merge는 자동화하지 않고 사용자가 직접 수행한다.
- **배경**: 코드 변경은 사람이 검토·승인하는 절차를 유지한다.
- **근거 문서**: `docs/PROJECT_SCOPE.md` 5절("무인 자동 Merge Runner" 제외), `docs/ARCHITECTURE.md` 15절, `.claude/skills/traveler-project-pipeline/SKILL.md` Rule 14, `scripts/audit_tasks.py` Check 16.
- **영향**: CI(`CI-PIPELINE-BASE`)는 빌드·Lint·테스트 게이트까지만 담당하며, 통과 후 자동으로 Merge하는 워크플로·봇을 구성하지 않는다.
- **상태**: CONFIRMED

## DEC-013 — EC2·AWS는 사용하지 않음

- **결정**: 별도 AWS 인프라(EC2, ECS, Lambda, S3 등)를 구성하지 않고 Vercel + Supabase 관리형 스택만 사용한다.
- **배경**: 별도 인프라 운영 비용을 만들지 않고 월 인프라 비용을 10만원 이하로 유지한다.
- **근거 문서**: `docs/PROJECT_SCOPE.md` 5절·6.14절(REQ-NF-034), `docs/ARCHITECTURE.md` 14절, `scripts/validate_inputs.py` Check 11, `scripts/audit_tasks.py` Check 16.
- **영향**: EC2/AWS 인프라 구성을 요구하는 Task·CI 스텝을 만들지 않는다.
- **상태**: CONFIRMED

## DEC-014 — 제외 기능은 EXCLUDED로 관리

- **결정**: 이번 단계에서 구현하지 않는 Requirement는 추적표에서 삭제하지 않고 `Implementation Status = EXCLUDED`로 명시적으로 남기며, 제외 사유를 함께 기록한다.
- **배경**: 114개 Requirement(REQ-FUNC 80개 + REQ-NF 34개) 전수를 항상 추적 가능한 상태로 유지하고, "빠뜨린 것"과 "의도적으로 제외한 것"을 구분한다.
- **근거 문서**: `docs/UIUX_TRACEABILITY.md`, `TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표(22개 EXCLUDED 항목), `.claude/skills/traveler-project-pipeline/SKILL.md` Rule 15·16, `scripts/audit_tasks.py` Check 17·18.
- **영향**: EXCLUDED 항목에 대해서는 구현 Task·상세 파일을 만들지 않으며(Check 18), 향후 재검토 시 이 문서에 새 DEC 항목을 추가해 상태를 변경한다.
- **상태**: CONFIRMED

---

## DEC-015 — DB 6개 Table 명칭은 기존 정의(participation_requests·external_urls)를 그대로 유지

- **결정**: 2026-09-23 Task 문서 감사 요청에서 DB 범위가 `profiles`/`mate_posts`/`mate_applications`/`blocks`/`reports`/`app_settings`로 재기술되었으나, 이는 DEC-006에서 이미 확정한 6개 테이블(`profiles`/`mate_posts`/`participation_requests`/`blocks`/`reports`/`external_urls`)과 동일한 6개 개념을 가리키는 것으로 확인했다. `docs/01_PRD.md`, `docs/02_SRS_BASELINE.md`, `docs/06_SRS_UIUX_REVISED.md` 어디에도 `mate_applications`/`app_settings`라는 이름이 실제로 쓰인 적이 없어, 두 이름 집합이 서로 다른 소스에서 유래한 충돌이 아니라 같은 6개 테이블을 가리키는 표현 차이임을 확인했다.
- **배경**: 이미 67개 구현 Task 상세 파일·`SKILL.md`·`scripts/audit_tasks.py`·`TASK_AUDIT_REPORT.md`가 전부 `participation_requests`/`external_urls` 명칭으로 완성되어 있어, 실제 스키마 변경 근거 없이 명칭만 바꾸는 전면 rename은 불필요한 위험(15개 이상 파일 동시 수정, 회귀 가능성)만 키운다.
- **근거 문서**: `docs/DECISION_LOG.md` DEC-006, `.claude/skills/traveler-project-pipeline/SKILL.md` §10, `scripts/audit_tasks.py`(`ALLOWED_DB_TABLES`), `TASKS/TASK-DB-SCHEMA-BASE.md`.
- **영향**: `participation_requests`(동행 참가 신청)·`external_urls`(관리자 외부 URL 설정) 명칭을 그대로 유지한다. 향후 실제로 테이블명을 바꿔야 할 근거(예: 실제 Supabase 스키마가 다른 이름으로 먼저 생성됨)가 생기면 이 항목을 SUPERSEDED로 표시하고 새 DEC 항목과 함께 전체 파일을 일괄 갱신한다.
- **상태**: CONFIRMED

## DEC-016 — Playwright "핵심 흐름 5~7개"는 기존 3개 Task·9개 시나리오로 충족

- **결정**: 2026-09-23 Task 문서 감사 요청은 "Playwright Chromium 핵심 흐름 5~7개"의 존재를 확인하라고 요청했다. DEC-009에서 확정한 `E2E-PUBLIC-SMOKE`(시나리오 #1·#8·#9)/`E2E-TRAVEL-TOOLS`(#2·#3)/`E2E-MATE-AUTH`(#4·#5·#6·#7) 3개 Task 파일을 실제로 열어 확인한 결과, 3개 파일 안에 총 9개의 구분된 핵심 흐름(시나리오)이 이미 순차 `test()` 블록으로 정의되어 있어 "5~7개 핵심 흐름"이라는 요구를 Task 파일 개수가 아닌 흐름 개수 기준으로 이미 충족한다고 판단한다.
- **배경**: DEC-009는 Task **파일** 개수를 정확히 3개로 고정한 결정이며, 화면별/시나리오별로 Task 파일을 잘게 쪼개는 것은 유지비용 대비 이득이 없다는 근거로 이미 확정되어 있다. 새 요청의 "5~7개"를 Task 파일 개수로 해석해 DEC-009를 뒤집을 만한 새로운 근거(예: 시나리오 자체가 누락됨)는 발견되지 않았다.
- **근거 문서**: `docs/DECISION_LOG.md` DEC-009, `TASKS/TASK-E2E-PUBLIC-SMOKE.md`/`TASK-E2E-TRAVEL-TOOLS.md`/`TASK-E2E-MATE-AUTH.md`(Functional AC의 개별 시나리오 목록), `docs/PROJECT_SCOPE.md` 7절.
- **영향**: Playwright Task 파일 개수(3개)는 그대로 유지한다. 시나리오를 추가로 쪼개 Task 파일을 5~7개로 늘리는 작업은 하지 않는다.
- **상태**: SUPERSEDED by DEC-018 (실제로 `playwright.config.ts`/`tests/e2e/*.spec.ts`를 작성하면서 3개 Task·9개 시나리오가 아니라 2개 Task·7개 Test ID 구조로 다시 정리됨)

## DEC-017 — Wave 분할·`WAVE_PLAN.md`/`WAVE_STATE.json`은 `scripts/build_waves.py`가 생성

- **결정**: `TASKS/WAVE_PLAN.md`·`TASKS/WAVE_STATE.json`·`TASKS/TASK_DAG.md`는 사람이 손으로 작성하지 않고 `scripts/build_waves.py`가 `TASKS/TASK_MANIFEST.csv`·Task 상세 파일·`design-reference/SCREEN_ROUTE_CONTRACT.json`으로부터 생성한다. Wave는 고정된 10개 Wave Group(①Scaffold/Harness ②공통 UI·정적 데이터 ③Supabase Auth·DB·RLS ④~⑧SCR-001~005 ⑨Unit·Playwright·접근성·CI ⑩Vercel Preview·Release) 순서를 먼저 따르고, 그 안에서 의존성 위상 정렬 + Task ID 알파벳 순 동일 Wave 배치 가능 여부(같은 Wave에 있으려면 의존 대상 Task ID가 알파벳상 먼저여야 함, 아니면 다음 Wave로 넘어감) + 같은 파일을 건드리는 Task 분리 규칙으로 Wave 경계를 정한다. Screen별 Page Owner는 항상 그 Screen의 마지막 Wave를 닫는 마지막 Task로 배치된다.
- **배경**: DEC-010/DEC-011이 확정한 "Wave 단위 실행·Wave 내부 순차 수행"을 실제로 기계적으로 산출하려면, 67개 Task의 실제 `Depends On` 그래프를 읽어 자동으로 나누는 도구가 필요했다. 특히 Task ID 알파벳 순 실행 규칙(CLAUDE.md 규칙 7)과 의존성 순서가 항상 일치하지 않는 실제 사례(`DB-RLS-BASE`가 `DB-SCHEMA-BASE`에 의존하지만 ID는 더 앞섬 등)가 다수 발견되어, 수작업 Wave 분할표는 오류 위험이 컸다.
- **근거 문서**: `scripts/build_waves.py`, `TASKS/TASK_DAG.md`, `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.json`, `.claude/commands/run-wave.md`(Wave 자료 절).
- **영향**: 이후 Task 구성이 바뀌면(`00_TASK_LIST.md`/상세 파일 수정 후 `/audit-tasks`) `scripts/build_waves.py`를 다시 실행해 Wave 구성을 재생성한다. `TASKS/WAVE_PLAN.md`를 직접 손으로 고치지 않는다.
- **상태**: CONFIRMED

## DEC-018 — Playwright E2E는 `tests/e2e/`의 2개 파일·7개 Test ID(E2E-001~007) 구조로 재정리

- **결정**: `playwright.config.ts`와 `tests/e2e/public-smoke.spec.ts`/`tests/e2e/auth-smoke.spec.ts`를 실제로 작성하면서, Playwright E2E Task 구성을 DEC-009/DEC-016이 확정했던 `E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH` 3개 Task·`e2e/` 폴더·9개 시나리오 구조에서, **`E2E-PUBLIC-SMOKE`(비로그인 공개 흐름, E2E-001~005) + `E2E-AUTH-SMOKE`(로그인 흐름 골격, E2E-006~007)** 2개 Task·`tests/e2e/` 폴더·7개 Test ID 구조로 변경한다. 옛 `E2E-TRAVEL-TOOLS`는 `E2E-PUBLIC-SMOKE`에 합쳐졌고, 옛 `E2E-MATE-AUTH`는 `E2E-AUTH-SMOKE`로 이름이 바뀌었다.
- **배경**: 실제 테스트 코드를 작성하는 단계에서 사용자가 Test ID·파일 배치·Selector 규칙(role/label/test id 우선, 외부 사이트 내용 미검사)을 구체적으로 지정했고, 이 요청이 이전 DEC-009/DEC-016보다 더 구체적이고 최신이므로 이를 정본으로 삼는다.
- **범위 축소(솔직히 기록)**: 옛 9개 시나리오 중 `#9`(404/외부 연결 실패 오류 화면 복구), `#6`(신고→접수, 차단→노출 제한), `#7`(관리자 신고 처리·외부 URL 설정)은 새 7개 Test ID(E2E-001~007)에 대응 항목이 없다 — 즉 이 3개 흐름은 더 이상 자동화된 Playwright Smoke로 검증되지 않는다. 필요해지면 별도 Task로 다시 추가하는 것으로 하고, 지금은 조용히 덮지 않고 이 기록에 남긴다.
- **근거 문서**: `playwright.config.ts`, `tests/e2e/public-smoke.spec.ts`, `tests/e2e/auth-smoke.spec.ts`, `TASKS/TASK-E2E-PUBLIC-SMOKE.md`, `TASKS/TASK-E2E-AUTH-SMOKE.md`, `scripts/audit_tasks.py`(`REQUIRED_E2E_IDS`), `scripts/validate_waves.py` Check 6.
- **영향**: `TASKS/00_TASK_LIST.md`의 E2E Task는 이제 2개(Seq 61~62)이고, 전체 Task 수는 67 → **66**으로 줄었다. `TASKS/TASK-E2E-TRAVEL-TOOLS.md`/`TASKS/TASK-E2E-MATE-AUTH.md` 파일은 삭제했다. `scripts/build_waves.py`를 다시 실행해 `TASKS/TASK_MANIFEST.csv`·`TASK_DAG.md`·`WAVE_PLAN.md`·`WAVE_STATE.json`을 이 구조로 재생성한다.
- **상태**: CONFIRMED

## 요약 표

| ID | 한 줄 요약 |
|---|---|
| DEC-001 | 개발 루트 = `traveler/app` |
| DEC-002 | Screen 5개(핵심 4·보조 1) |
| DEC-003 | `/travel-tools`에 항공·숙소·동행 작성 통합 |
| DEC-004 | 여행지·안전·대표 = `src/data` 정적 TypeScript |
| DEC-005 | Supabase = Auth + 동행 기능만 |
| DEC-006 | DB 6개 Table 제한 |
| DEC-007 | 항공·숙소 입력 = Browser Memory만 |
| DEC-008 | Airbnb `DESIGN.md` = vendor 참고본, D-001 = 정본 |
| DEC-009 | ~~Playwright = Chromium Smoke 3개 Task만~~ → DEC-018로 대체 |
| DEC-010 | 실행 단위 = Wave |
| DEC-011 | Wave 내부 = Single Agent 순차 수행 |
| DEC-012 | PR·Merge = 사용자 수동 |
| DEC-013 | EC2·AWS 미사용 |
| DEC-014 | 제외 기능 = EXCLUDED로 추적 유지 |
| DEC-015 | DB 6개 Table 명칭은 기존 정의(participation_requests·external_urls) 유지 |
| DEC-016 | ~~Playwright "5~7개 핵심 흐름" = 기존 3개 Task·9개 시나리오로 충족~~ → DEC-018로 대체 |
| DEC-017 | Wave 분할은 `scripts/build_waves.py`가 자동 생성(수작업 금지) |
| DEC-018 | Playwright E2E = `tests/e2e/` 2개 Task·7개 Test ID(E2E-001~007) |
