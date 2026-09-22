---
name: traveler-project-pipeline
description: Traveler PRD/SRS에서 Task를 생성·상세화·감사하고 5개 Screen과 Wave 개발을 지원하는 프로젝트 Skill
---

# Traveler Project Pipeline

이 Skill은 Traveler(Free Traveler) 프로젝트에서 Task를 생성·상세화·감사하고, 5개 Screen 구현과 Wave 단위 개발을 지원하기 위한 규칙을 담는다. 이 Skill은 루트 `CLAUDE.md`의 전역 규칙을 보충할 뿐 대체하지 않는다 — 두 문서가 같은 주제를 다룰 때는 항상 `CLAUDE.md`가 우선한다(특히 Harness Marker, Wave 실행, Auto-Merge/AWS 금지).

---

## 1. 입력 문서 목록 (정본 순서)

1. `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen 목록의 유일한 정본(`HARNESS_SCHEMA=traveler-screen-route-v1`).
2. `design-reference/D-001/DESIGN.md` — 디자인 정본(토큰·컴포넌트·Section 규칙, Status: LOCKED).
3. `design-reference/UI_CONTRACT.md` — Screen별 영역·Component·상태·이동·금지 기능.
4. `docs/06_SRS_UIUX_REVISED.md` — SRS 정본, Requirement → Screen/Route 매핑.
5. `docs/PROJECT_SCOPE.md` — Scope 분류 정본, IMPLEMENT/EXCLUDED 원문과 확인 방법.
6. `docs/UIUX_TRACEABILITY.md` — 114개 Requirement 전수와 Implementation Status.
7. `docs/ARCHITECTURE.md` — 구현 경계(Server/Client 구분, Supabase 범위, 제외 서비스).
8. `docs/DECISION_LOG.md` — 확정된 프로젝트 결정(DEC-001~014).
9. `TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md`, `TASKS/TASK_MANIFEST.csv` — Task 정본과 상세.
10. 실제 `package.json`, `src/app/**` 파일 트리 — Task/Wave 실행 시점에 반드시 재조회한다. 문서에 적힌 예상 경로를 그대로 베끼지 않는다.

이 중 하나라도 없거나 스키마가 다르면 `scripts/validate_inputs.py`가 실패해야 하며, 실패 시 어떤 Task도 생성·실행하지 않는다.

---

## 2. 5개 Screen과 Page Entry

Screen·Route·Page Entry·Tier는 오직 `design-reference/SCREEN_ROUTE_CONTRACT.json`만 신뢰한다.

| Screen | Route | Page Entry | Tier |
|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | 핵심(core) |
| SCR-002 | `/about` | `src/app/about/page.tsx` | 보조(secondary) |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 핵심(core) |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | 핵심(core) |
| SCR-005 | `/account` | `src/app/account/page.tsx` | 핵심(core) |

핵심 4개·보조 1개 구성이며, 이 5개 외의 Screen(Page Owner Task)을 만들지 않는다. 5개 수에 포함되지 않는 기술 Route(인증 콜백, `src/app/api/**`, `not-found.tsx`, `error.tsx`, 정책 정적 페이지)는 별도로 존재할 수 있다.

---

## 3. IMPLEMENT·EXCLUDED 상태 처리 규칙

- `docs/PROJECT_SCOPE.md`/`docs/UIUX_TRACEABILITY.md`의 모든 Requirement(REQ-FUNC 80개 + REQ-NF 34개 = 114개)는 `IMPLEMENT`(`IMPLEMENT(축소)`/`IMPLEMENT(부분)` 포함) 또는 `EXCLUDED` 중 하나로 분류되어 있어야 한다.
- `IMPLEMENT`인 Requirement는 최소 1개 이상의 Task `Requirement Ref`에 연결되어야 한다.
- `EXCLUDED`인 Requirement는 `TASKS/00_TASK_LIST.md`의 `NON_IMPLEMENTATION` 표에 ID·사유와 함께 남기고, 구현 Task·상세 파일을 만들지 않는다(11절과 연동).
- 하나라도 Task에도 없고 `NON_IMPLEMENTATION`에도 없으면 감사 실패다(`scripts/audit_tasks.py` Check 17).

---

## 4. Task List·상세 Task 형식

- **Task List**(`TASKS/00_TASK_LIST.md`): Seq, Task ID, 제목, Category, Implementation Status, Requirement Ref, Screen, Route, Page Entry, Depends On, Expected Files, Functional AC, Visual AC, Security/Privacy AC, Verify, Priority를 모두 포함한다. Page Owner 5개는 개별 블록으로, 나머지는 Category별 표로 기록한다.
- **상세 Task**(`TASKS/TASK-<ID>.md`, Task ID당 정확히 1개): Context, Project Scope, Requirement Ref, Screen/Route/Page Entry, Design Ref, Depends On, Expected Files, Functional AC, Visual AC, Security/Privacy AC, Test Cases, Verify, Definition of Done, Forbidden 14개 절을 모두 포함한다.
- **Manifest**(`TASKS/TASK_MANIFEST.csv`): Task ID, Category, Screen, Route, Page Entry, Requirement Ref, Depends On, Expected Files, Detail File Exists 열을 갖는다.
- Task List의 구현 Task ID와 `TASKS/TASK-*.md` 파일명은 항상 1:1이어야 한다(`scripts/audit_tasks.py` Check 1).

---

## 5. Page Owner·Component 분리 규칙

- **Page Owner Task**: Screen당 정확히 1개, Page Entry(`page.tsx`)에서 Component를 **실제로 조립**한다(Section 순서 배치, 데이터 바인딩, 상태 분기). 하위 Component 자체의 구현은 Page Owner의 범위가 아니다.
- **Component Task**: 재사용 가능한 단위(Card, Form, Tabs, Drawer 등) 하나를 구현한다. 특정 Screen에 종속되지 않는 전역 Component(Header/Footer, Empty State, Toast, Design Tokens 등)도 존재한다.
- Page Owner의 `Depends On`에는 같은 Screen 태그를 가진 모든 Component Task ID가 포함되어야 한다(전역 Component는 예외 — 모든 Page Owner가 의존 가능).
- Component Task만 있고 Page Owner Task가 없는 Screen(component-only screen)은 만들지 않는다.
- SCR-001 Page Owner는 create-next-app 기본 스타터 제거 AC를 반드시 포함한다.
- SCR-003 Page Owner는 "항공편 찾기"/"숙소 찾기"/"동행 구하기" 3개 탭을 실제로 조립하는 AC를 반드시 포함한다.
- SCR-005 Page Owner는 Guest/Member/Admin 역할별 상태 조립 AC를 반드시 포함한다(역할에 없는 탭은 렌더링하지 않는 조건부 로직).

---

## 6. DB 6개 Table과 정적 Data 경계

- Supabase DB는 정확히 6개 테이블로 제한한다: `profiles`, `mate_posts`, `participation_requests`, `blocks`, `reports`, `external_urls`. 7번째 테이블(감사 로그, 즐겨찾기 등)을 추가하는 Task를 만들지 않는다.
- 여행지·국가별 안전정보·free_traveler 대표 소개는 DB가 아니라 `src/data/**`의 정적 TypeScript 데이터로 관리한다(`DATA-DESTINATIONS`/`DATA-SAFETY`/`DATA-REPRESENTATIVE`).
- 즐겨찾기는 `localStorage`로만 관리하며 DB 테이블을 두지 않는다.
- 정적 데이터의 수량·완전성은 `scripts/validate_content_data.mjs`(`DATA-VALIDATION-SCRIPT`)로 검증하며, 관리자 CRUD·게시 워크플로 UI를 만들지 않는다.

---

## 7. 외부 입력 비저장 불변조건

- 항공·숙소 조건 입력값(국가·지역·날짜 등)은 Client Component의 React 상태(Browser Memory)로만 유지하는 **일시 상태**다.
- 이 값을 서버 API(Route Handler)로 전송하지 않고, DB에 저장하지 않고, URL 쿼리 파라미터에 싣지 않고, 로그·분석 이벤트에 남기지 않는다.
- 관련 Task(`COMP-SCR003-FLIGHT-FORM`, `COMP-SCR003-HOTEL-FORM` 등)의 Security/Privacy AC에는 이 불변조건이 항상 명시되어야 하며, `scripts/audit_tasks.py` Check 13이 이를 검사한다.
- 외부 항공/호텔 사이트로의 이동은 새 탭(`target="_blank" rel="noopener noreferrer"`)으로만 열고 쿼리 파라미터를 붙이지 않는다.

---

## 8. 기본 Auth·성인·RLS 규칙

- Supabase Auth는 이메일 가입/인증/로그인/로그아웃/비밀번호 재설정을 담당한다(`AUTH-SUPABASE-EMAIL`).
- 성인확인은 `is_adult`, `adult_verified_at` 필드만 저장하고 생년월일 원본은 저장하지 않는다.
- RLS는 최소한 다음을 지킨다: `profiles`는 본인만 수정, `mate_posts`는 조회 공개·수정은 작성자만, `participation_requests`/`blocks`/`reports`는 당사자 또는 Admin만, `external_urls`는 Admin만 쓰기.
- 모든 권한 검사는 서버(RLS + Route Handler)에서 강제한다. **RLS를 우회하는 Client 코드를 작성하지 않는다.**
- **Service Role Key를 Client Component/브라우저 번들에서 사용하지 않는다** — 서버 전용 Supabase Client(`src/lib/db.ts`)에서만 사용한다.

---

## 9. Playwright Chromium Smoke 범위

- Playwright는 `PLAYWRIGHT_SCOPE=chromium-smoke` 범위를 지킨다: 정확히 `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` 3개 Task만 존재한다(`docs/DECISION_LOG.md` DEC-009).
- 세 Task 모두 Chromium 단일 브라우저만 사용한다. Firefox/WebKit 매트릭스, 화면별 개별 회귀 스위트, 추가 E2E 파일을 만들지 않는다.
- `docs/PROJECT_SCOPE.md` 7절의 10개 시나리오는 이 3개 Task 안에서 영역별로 나누어 순차 수행한다.

---

## 10. Wave 내부 순차 실행

- 사용자의 표준 개발 명령은 `/run-wave WXX`이며, 실행 단위는 Wave다(`docs/DECISION_LOG.md` DEC-010).
- Wave 내부 Task는 `Depends On` 순서를 따라 **한 번에 하나만** 구현한다 — 여러 Task를 동시에 병렬로 건드리지 않는다(Single Agent 순차 수행, DEC-011).
- 각 Task는 4절의 완료 순서(Task 읽기 → 입력 확인 → 구현 → 관련 포맷·Unit Test → 필요 시 Playwright → Diff 확인 → 완료 보고)를 그대로 따른다(`CLAUDE.md` 참조).
- 현재 Task의 `Expected Files` 밖 파일은 수정하지 않는다.
- 사람이 Preview를 확인한 뒤에만 다음 화면(Screen) 단위 Wave로 진행한다 — 확인 전에 다음 Wave를 임의로 시작하지 않는다.

---

## 11. EXCLUDED 보호

- `Implementation Status = EXCLUDED`인 Requirement에 대해 구현 Task·상세 파일(`TASKS/TASK-*.md`)을 만들지 않는다.
- Task ID가 EXCLUDED Requirement ID와 겹치지 않아야 하며, 어떤 Task의 `Requirement Ref`에도 EXCLUDED ID가 등장하지 않아야 한다(`scripts/audit_tasks.py` Check 18).
- EXCLUDED 항목은 삭제하지 않고 `NON_IMPLEMENTATION` 표/추적표에 계속 남겨 두어, 향후 재검토 시 `docs/DECISION_LOG.md`에 새 DEC 항목을 추가하는 방식으로만 상태를 바꾼다.

---

## 12. AWS·EC2·자동 Merge 금지

- `AWS_ENABLED=false` — EC2·AWS 인프라를 구성하는 Task를 만들지 않는다. Vercel + Supabase 관리형 스택만 사용한다.
- `AUTO_MERGE=false` — 자동 PR 생성·자동 Merge·Merge Runner를 실행하지 않는다. PR과 Merge는 사람이 수동으로 수행한다(`docs/DECISION_LOG.md` DEC-012).
- Prisma 등 별도 ORM을 추가하지 않는다 — Supabase JS 클라이언트로 직접 쿼리한다.
- destructive Git 명령(`reset --hard`, `push --force`, `clean -f` 등)을 임의로 사용하지 않는다.

---

## Task 개수에 대한 원칙

Task 개수는 정보 제공용일 뿐 완료 조건이 아니다. `scripts/audit_tasks.py`는 Task 개수를 출력만 하고 pass/fail 판정에 사용하지 않는다. 완료 조건은 위 1~12절과 `CLAUDE.md`의 23개 필수 규칙이 실제로 충족되었는가이다.
