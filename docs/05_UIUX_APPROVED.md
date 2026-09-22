# Free Traveler — UI/UX Approved Baseline (05_UIUX_APPROVED)

| 항목 | 내용 |
|---|---|
| Document ID | UIUXAPPR-TRAVEL-001 |
| 기준 문서 | `docs/02_SRS_BASELINE.md`, `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json` |
| 디자인 정본 | `design-reference/D-001/DESIGN.md` (Status: LOCKED) |
| Stitch 검증 근거 | `docs/STITCH_VALIDATION_REPORT.md` (Project ID `4691318911121922919`) |
| 작성일 | 2026-09-19 |
| 상태 | Approved — Implementation Not Started |

> 이 문서는 5개 디자인 Screen이 **승인(Approved)** 되었음을 기록한다. 승인은 "디자인·콘텐츠·라우트 계약이 확정되었다"는 의미이며, **실제 코드 구현이 완료되었다는 뜻이 아니다.** 현재 `src/app`에는 create-next-app 기본 스타터 외 구현 코드가 없다(`design-reference/UI_CONTRACT.md` 확인 사항 참조).

---

## 1. 승인된 5개 Screen

| Screen | Route | Page Entry | Tier | Mobile 변형 |
|---|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | 핵심 | 승인됨 |
| SCR-002 | `/about` | `src/app/about/page.tsx` | 보조 | 미승인 |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 핵심 | 승인됨 |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | 핵심 | 미승인 |
| SCR-005 | `/account` | `src/app/account/page.tsx` | 핵심 | 미승인 |

승인 Screen ID(Stitch)는 `docs/STITCH_VALIDATION_REPORT.md`의 최종 Canonical 표를 따른다.

---

## 2. 기존 공개 Route → 5개 Screen 통합 매핑

`docs/PROJECT_SCOPE.md` 2절과 `docs/03_UI_COVERAGE_ANALYSIS.md` 2절에서 확정한 통합안을 그대로 승인한다. 아래 왼쪽 Route는 **별도 화면으로 만들지 않으며**, 오른쪽 5개 Screen의 탭·패널·Drawer·Modal로 흡수된다.

| 기존에 검토됐던 개별 Route | 통합 위치 | 통합 형태 |
|---|---|---|
| `/destinations/*` (여행지 목록·상세) | SCR-001 | 같은 화면의 목록 + 상세 Drawer/Modal |
| `/safety/*` (국가 안전정보) | SCR-001 | 여행지 상세 Drawer 내부 안전정보 Drawer → Modal 확장 |
| `/flights` | SCR-003 | "항공편 찾기" 탭 |
| `/hotels` | SCR-003 | "숙소 찾기" 탭 |
| `/mates/new` (동행글 작성) | SCR-003 | "동행 구하기" 탭 (별도 라우트 폐지) |
| `/auth/*` (로그인·가입·비밀번호 재설정) | SCR-005 | Guest 탭 |
| `/my/*` (내 활동) | SCR-005 | Member 탭 |
| `/admin/*` (관리자) | SCR-005 | Admin 탭 |

**규칙 준수 확인**
- `/travel-tools`는 항공·숙소·동행 작성 3개 탭을 모두 포함한다. — 충족(`design-reference/UI_CONTRACT.md` SCR-003 절)
- `/account`는 인증·프로필·내 활동·간단 관리자를 모두 포함한다. — 충족(SCR-005 절, 역할별 탭)

---

## 3. UI Route Contract

`design-reference/SCREEN_ROUTE_CONTRACT.json`(schema `traveler-screen-route-v1`)을 이 승인 문서의 라우트 계약으로 채택한다. 요약:

| 검증 항목 | 결과 |
|---|---|
| Route 중복 없음 | PASS |
| Page Entry 중복 없음 | PASS |
| Screen 수 정확히 5 | PASS |
| 핵심 4 · 보조 1 구분 | PASS (핵심: SCR-001·003·004·005 / 보조: SCR-002) |
| 기술 Route가 Screen 수에서 제외됨 | PASS (`auth_callback`, `api_route`, `not_found`) |
| 전 Screen `page_owner_task_required=true` | PASS |
| 전 Screen `preview_required=true` | PASS |
| SCR-001 `starter_template_forbidden=true` | PASS (현재 위반 상태 — 구현 시 반드시 교체) |

---

## 4. Release Acceptance Criteria

이 UI/UX 베이스라인을 "구현 착수 가능" 상태로 릴리스하기 위한 조건이다. 전부 충족되어야 하며, 하나라도 미충족 시 상태는 `NOT_RELEASED`로 유지한다.

| # | 기준 | 현재 상태 |
|---|---|---|
| 1 | REQ-FUNC-001~080, REQ-NF-001~034 총 114개 요구사항 중 어떤 것도 삭제되지 않았다 | 충족 — `docs/06_SRS_UIUX_REVISED.md`, `docs/UIUX_TRACEABILITY.md`에서 114개 전수 확인 |
| 2 | 5개 디자인 Screen이 Stitch에서 콘텐츠 검증(PASS)을 통과했다 | 충족 — `docs/STITCH_VALIDATION_REPORT.md` |
| 3 | 디자인 토큰이 D-001로 잠금(LOCKED)되어 있다 | 충족 — `design-reference/D-001/DESIGN.md` |
| 4 | UI Contract와 Screen Route Contract가 존재하고 완료 조건을 통과했다 | 충족 — 3절 |
| 5 | EXCLUDED 항목이 전부 명시적 사유와 함께 표시되어 있다 | 충족 — `docs/06_SRS_UIUX_REVISED.md`, `docs/UIUX_TRACEABILITY.md` |
| 6 | 어떤 요구사항도 "구현 완료"로 허위 기록되지 않았다 | 충족 — 모든 IMPLEMENT 항목의 Traceability `Status`는 `NOT_STARTED` |
| 7 | Task가 아직 생성되지 않은 항목은 `PENDING_TASK_GENERATION`으로 기록되어 있다 | 충족 — `docs/UIUX_TRACEABILITY.md` 전체 행 |

**현재 릴리스 상태**: 1~7 전부 충족 → **UI/UX Baseline은 Approved / Implementation Not Started** 상태로 릴리스 가능. 실제 코드 구현은 이 문서의 범위 밖이며, Task 생성 후 별도로 진행한다.

---

## 5. 참고 문서

- `docs/02_SRS_BASELINE.md` — 원본 요구사항(변경 없음)
- `docs/PROJECT_SCOPE.md` — IMPLEMENT/EXCLUDED 범위 결정
- `docs/03_UI_COVERAGE_ANALYSIS.md` — 5-Screen 배치 최초 근거
- `docs/06_SRS_UIUX_REVISED.md` — 화면 매핑을 반영한 SRS 개정본
- `docs/UIUX_TRACEABILITY.md` — 114개 요구사항 전수 추적 매트릭스
