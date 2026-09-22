# Free Traveler — Architecture

| 항목 | 내용 |
|---|---|
| Document ID | ARCH-TRAVEL-001 |
| 기준 문서 | `package.json`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `TASKS/TASK_MANIFEST.csv` |
| 작성일 | 2026-09-23 |
| 상태 | Architecture Baseline — 구현 착수 전 (현재 `src/app`는 create-next-app 기본 스타터만 존재) |

> 이 문서는 Traveler 프로젝트가 **무엇으로 만들어지고, 무엇으로 만들어지지 않는지**를 확정한다. 여기 기록된 경계 밖의 기술·서비스를 임의로 도입하지 않는다.

---

## 1. 플랫폼·언어

| 항목 | 값 | 근거 |
|---|---|---|
| 프레임워크 | Next.js **App Router** 16.3.4 | `package.json` (`next`) |
| 언어 | **TypeScript** ^5, strict 모드 | `package.json`(`typescript`), `tsconfig.json` |
| UI 라이브러리 | React 19.2.8 / react-dom 19.2.8 | `package.json` |
| 스타일 | Tailwind CSS v4(`@tailwindcss/postcss`) | `package.json`, `design-reference/D-001/DESIGN.md` |
| Lint | ESLint 9 + `eslint-config-next` | `package.json` |
| **ORM** | **사용하지 않음(Prisma 등 미사용)** — Supabase JS 클라이언트로 직접 쿼리 | 15절 |

Pages Router, `getServerSideProps`/`getStaticProps` 등 구버전 Next.js 패턴은 사용하지 않는다. 모든 라우트는 `src/app/**`의 App Router 규칙(`page.tsx`, `layout.tsx`, `route.ts`)을 따른다.

---

## 2. Screen 구성 — 핵심 화면 4개 · 보조 화면 1개

`design-reference/SCREEN_ROUTE_CONTRACT.json`(`schema_version: traveler-screen-route-v1`)이 유일한 정본이다.

| Screen | 이름 | Route | Tier | Mobile 승인 |
|---|---|---|---|---|
| SCR-001 | 메인 홈 | `/` | **핵심(core)** | 승인됨 |
| SCR-002 | 대표 소개 | `/about` | **보조(secondary)** | 미승인(Desktop 전용) |
| SCR-003 | 통합 여행 준비 | `/travel-tools` | **핵심(core)** | 승인됨 |
| SCR-004 | 동행 찾기 | `/mates` | **핵심(core)** | 미승인(반응형만) |
| SCR-005 | 계정·관리 | `/account` | **핵심(core)** | 미승인(Desktop 전용) |

완료 조건(`SCREEN_ROUTE_CONTRACT.json` `completion_checks`): Route 5개 고유, Page Entry 5개 고유, `tier_distribution = {core: 4, secondary: 1}`. 이 5개 외 화면을 구성하지 않는다(기존 검토안이었던 `/destinations/*`, `/flights`, `/hotels`, `/safety/*`, `/auth/*`, `/my/*`, `/admin/*`, `/mates/new`는 5개 Screen의 탭/Drawer로 통합되었으며 별도 라우트를 만들지 않는다 — `docs/PROJECT_SCOPE.md` 2절).

---

## 3. Server Component와 Client Component 구분

**기본 원칙**: 모든 `page.tsx`는 **Server Component로 시작**한다. 상호작용(입력, 로컬 상태, 이벤트 핸들러, 브라우저 API)이 필요한 하위 Component만 파일 최상단에 `"use client"`를 선언한다. Server Component는 정적 데이터(`src/data/**`)를 직접 import하거나 Server 전용 Supabase 클라이언트로 조회하고, Client Component에 props로 결과를 내려준다.

| 구분 | 대상 | 이유 |
|---|---|---|
| **Server Component** | `TASK-PAGE-SCR001`(`src/app/page.tsx`) 등 5개 Page Owner 자체 | Section 배치·정적 데이터 바인딩만 수행, 상호작용 없음 |
| Server Component | `COMP-SCR002-*`(About의 Hero/지표/Timeline/Gallery/추천 여행지) | 정적 데이터(`DATA-REPRESENTATIVE`)만 렌더링, 상태 없음 |
| Server Component | `COMP-SCR001-DOMESTIC-GRID` / `INTL-GRID` / `THEME-CHIPS` | 정적 데이터 렌더링(단, 즐겨찾기 하트 버튼 자체는 Client 하위 컴포넌트) |
| Server Component | `COMP-GLOBAL-HEADER-FOOTER`, 오류 페이지(`not-found.tsx`/`error.tsx`) | 정적 내비게이션, 상호작용 없음 |
| **Client Component**(`"use client"`) | `COMP-SCR003-FLIGHT-FORM`, `COMP-SCR003-HOTEL-FORM`, `COMP-SCR003-INTRO-TABS`, `COMP-SCR003-MATE-COMPOSER` | Form 입력·검증·탭 전환 상태 보유(4절) |
| Client Component | `COMP-SCR001-SEARCH-HERO` | 검색어·필터 입력 상태 |
| Client Component | `COMP-SCR004-FILTER-BAR`, `COMP-SCR004-APPLY-FLOW`, `COMP-SCR004-REPORT-BLOCK` | Filter 상태, 신청 Form, 신고/차단 다이얼로그 |
| Client Component | `COMP-SCR005-AUTH`, `COMP-SCR005-ADMIN`, `COMP-SCR005-MY-ACTIVITY`(수정/삭제/승인 액션) | 로그인 Form, 관리자 Form, 액션 버튼 상태 |
| Client Component | `COMP-GLOBAL-FAVORITES` 사용부(하트 토글), `COMP-GLOBAL-TOAST`, `COMP-GLOBAL-EMPTY-STATE-BLOCK`(CTA 클릭 핸들러 필요 시) | `localStorage` 접근, 이벤트 핸들러, 자동 소멸 타이머 |
| **Route Handler**(`route.ts`, Server 전용) | `src/app/api/**`(`API-MATE-POSTS`, `API-PARTICIPATION`, `API-BLOCK-REPORT`, `API-ADMIN-URLS`), `src/app/auth/callback/route.ts` | 인증 세션 검사·RLS 경유 DB 쓰기는 서버에서만 수행 |

---

## 4. 항공·숙소 입력 Form — Client Component 일시 상태만 사용

- `COMP-SCR003-FLIGHT-FORM`, `COMP-SCR003-HOTEL-FORM`은 **Client Component**이며, 국가·지역·출발일(체크인)·귀국일(체크아웃) 값을 오직 React `useState`(컴포넌트 로컬 상태)로만 보관한다.
- 탭 전환·페이지 이동·새로고침 시 값이 사라지는 **일시 상태**이며, `localStorage`/`sessionStorage`/쿠키에도 영구 저장하지 않는다.

## 5. 항공·숙소 입력값 — API·DB·URL·로그 전송 금지

- 이 입력값을 대상으로 하는 **Route Handler(API)를 만들지 않는다** — 서버로 `fetch` 요청을 보내지 않는다.
- 이 입력값을 저장하는 **DB 테이블을 만들지 않는다**(8절의 6개 테이블에 포함되지 않음).
- 이 입력값을 **URL 쿼리 파라미터**(`router.push({query})`, `searchParams` 등)에 싣지 않는다 — 외부 항공/호텔 사이트로 이동하는 링크도 쿼리 파라미터 없이 연다(`target="_blank" rel="noopener noreferrer"`).
- 이 입력값을 **로그·분석 이벤트**(콘솔, Vercel 함수 로그, 향후 도입될 어떤 Analytics도)에 기록하지 않는다.
- 근거: `docs/PROJECT_SCOPE.md` 6.2/6.3절 REQ-FUNC-017/025, 6.10절 REQ-NF-017.

---

## 6. 여행지·안전정보·대표 소개 — `src/data` 정적 데이터

| 데이터 | 파일 | 관리 방식 |
|---|---|---|
| 여행지(국내 10곳·해외 15개국 30개 도시) | `src/data/destinations.ts` | TypeScript 정적 모듈, Git으로 버전 관리, DB 접근 없음 |
| 국가별 안전정보(8개 카테고리) | `src/data/safety.ts` | 동일 |
| free_traveler 대표 소개 | `src/data/representative.ts` | 동일 |

- 관리자 CRUD 화면·게시 워크플로(DRAFT/REVIEW/PUBLISHED)를 만들지 않는다 — 코드 리뷰와 `scripts/validate_content_data.mjs`(`DATA-VALIDATION-SCRIPT`)로 수량·완전성만 검증한다.
- 이미지 필드는 URL + `alt` 텍스트만 가지며 출처·작가·라이선스 메타데이터 필드는 두지 않는다.
- 근거: `docs/PROJECT_SCOPE.md` 4절.

---

## 7. Supabase 범위 — Auth와 동행 기능 중심

Supabase는 **① 이메일 인증(Auth)** 과 **② 동행(Mate) 관련 기능**의 저장소로만 사용한다. 여행지·안전정보·대표 소개는 Supabase에 저장하지 않는다(6절).

- **Auth**: 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정, 성인확인 상태(`is_adult`/`adult_verified_at`만 저장, 생년월일 원본 미저장) — `AUTH-SUPABASE-EMAIL`.
- **동행 기능**: 동행글 CRUD, 참가 요청, 차단, 신고, 관리자 외부 URL 설정 — `API-MATE-POSTS`/`API-PARTICIPATION`/`API-BLOCK-REPORT`/`API-ADMIN-URLS`.

### 8. DB — 정확히 6개 Table

| Table | 핵심 컬럼(요약) |
|---|---|
| `profiles` | 닉네임, 연령대, 성별, 스타일, 소개, `is_adult`, `adult_verified_at` |
| `mate_posts` | 제목, 국가, 지역, 시작일, 종료일, 모집 인원, 설명, 상태, 작성자 |
| `participation_requests` | 동행글 ID, 요청자 ID, 메시지(500자), 상태(PENDING/ACCEPTED/REJECTED) |
| `blocks` | 차단한 사용자 ID, 차단된 사용자 ID |
| `reports` | 대상 유형/ID, 신고자 ID, 사유, 상태(OPEN/REVIEWING/RESOLVED/DISMISSED), 처리 사유/담당자/시각 |
| `external_urls` | 키(flight/hotel/sns), URL, 수정자, 수정 시각 |

이 6개를 넘는 테이블(감사 로그, 즐겨찾기 등)을 만들지 않는다 — 즐겨찾기는 `localStorage`로만 관리한다(`COMP-GLOBAL-FAVORITES`, 6절과 별개). 근거: `DB-SCHEMA-BASE`, `docs/PROJECT_SCOPE.md` 4절.

### 9. Browser·Server Supabase Client 이원화

| 클라이언트 | 파일 | 키 | 사용 위치 |
|---|---|---|---|
| Browser Client | `src/lib/supabase-client.ts` | `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client Component(로그인 Form, 세션 구독) |
| Server Client | `src/lib/db.ts` | 위와 동일 URL + 서버 전용 키(서비스 롤 또는 세션 쿠키 기반) | Server Component, Route Handler(`src/app/api/**`) |

서버 전용 키는 Vercel 환경변수로만 관리하고 클라이언트 번들에 포함하지 않는다(`DB-ACCESS`, REQ-NF-016).

### 10. 간단한 RLS 원칙

| Table | 원칙 |
|---|---|
| `profiles` | 본인만 수정, 공개 필드는 전체 조회 가능 |
| `mate_posts` | 조회는 공개(로그인 불필요), 수정/삭제는 작성자만 |
| `participation_requests` | 작성자·요청자만 조회, 작성자만 상태 변경 |
| `blocks` / `reports` | 본인 또는 Admin만 조회 |
| `external_urls` | Admin만 쓰기, 값은 서버 사이드에서만 사용(클라이언트에 직접 노출하지 않음) |

모든 정책은 Supabase RLS로 **서버에서** 강제하며 클라이언트 검증에만 의존하지 않는다. 근거: `DB-RLS-BASE`, `docs/PROJECT_SCOPE.md` 6.4/6.10절(REQ-FUNC-044, REQ-NF-013~015).

### 11. Prisma·ORM 미사용

Supabase JS 클라이언트(`@supabase/supabase-js`, `@supabase/ssr`)로 직접 쿼리한다. Prisma·Drizzle 등 별도 ORM, 별도 마이그레이션 도구를 도입하지 않는다 — 스키마는 `supabase/migrations/*.sql`로 직접 관리한다(`DB-SCHEMA-BASE`).

---

## 12. 테스트 — Vitest + Playwright Chromium Smoke

| 계층 | 도구 | 대상 |
|---|---|---|
| Unit | **Vitest** | `UNIT-TRAVEL-DATES`, `UNIT-CONTACT-DETECTION`, `UNIT-MATE-STATE` |
| Integration | **Vitest** | `TEST-RLS-BASIC`(RLS 권한별 부정 접근) |
| E2E | **Playwright, Chromium 단일 브라우저만** | `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` — 정확히 이 3개 Smoke Task만 존재한다 |

Firefox/WebKit 등 멀티 브라우저 매트릭스, 별도 회귀 스위트를 추가하지 않는다. Jest는 사용하지 않는다.

---

## 13. CI/CD — GitHub Actions + Vercel Preview

- **GitHub Actions**(`CI-PIPELINE-BASE`, `.github/workflows/ci.yml`): PR마다 TypeScript strict 빌드, ESLint, Vitest, `scripts/validate_content_data.mjs`를 실행한다. 하나라도 실패하면 머지 대상에서 제외된다(사람이 검토·승인 — 15절).
- **Vercel**: 브랜치 Push마다 **Preview Deployment**를 생성하고, `main` 병합 시 Production으로 승격한다. 별도 컨테이너/오케스트레이션 설정을 두지 않는다(Next.js App Router는 Vercel이 자동 인식).
- 릴리즈 직전 수동 점검은 `RELEASE-CHECK-VERCEL-SUPABASE`(`docs/RELEASE_CHECKLIST.md`)로 수행한다.

---

## 14. AWS·EC2 미사용

Vercel(호스팅/Functions) + Supabase(Auth/DB) 관리형 스택만 사용한다. EC2, ECS, Lambda(AWS), S3 등 AWS 인프라를 별도로 구성하지 않는다. 근거: `docs/PROJECT_SCOPE.md` 5절, 6.14절(REQ-NF-034 — 월 인프라 비용 10만원 이하).

## 15. 자동 Merge 미사용

모든 코드 변경은 CI 통과 후에도 **사람이 검토·승인**한다. 자동 Merge Runner, 머지 러너, 병합 자동화 봇을 구성하지 않는다. 근거: `docs/PROJECT_SCOPE.md` 5절.

---

## Page Entry

| Screen | Page Entry |
|---|---|
| SCR-001 | `src/app/page.tsx` |
| SCR-002 | `src/app/about/page.tsx` |
| SCR-003 | `src/app/travel-tools/page.tsx` |
| SCR-004 | `src/app/mates/page.tsx` |
| SCR-005 | `src/app/account/page.tsx` |

5개 Page Entry 외의 `page.tsx`를 5개 Screen 수 안에 추가하지 않는다. 5개 Screen 수에 포함되지 않는 기술 Route(인증 콜백, `src/app/api/**`, `not-found.tsx`, `error.tsx`, 정책 정적 페이지)는 별도로 존재할 수 있다(`SCREEN_ROUTE_CONTRACT.json` `technical_routes`).

---

## 프로젝트 범위에서 제외되는 서비스

다음 서비스는 이 프로젝트의 아키텍처에 포함하지 않는다. 필요성이 재검토되기 전까지 도입하지 않는다.

| 제외 서비스 | 사유 | 대체 수단 |
|---|---|---|
| **CMS**(전체 콘텐츠 관리 시스템) | 콘텐츠 규모가 작아 게시 워크플로 UI를 만들 개발 비용이 목표 대비 과함(`docs/PROJECT_SCOPE.md` 5절) | `src/data/**` 정적 파일 직접 편집 + `DATA-VALIDATION-SCRIPT` |
| **외부 Email 공급자**(SendGrid, Postmark 등 발송 전용 서비스) | 이메일 발급·발송 비용/설정 없이 동일한 사용자 가치 제공(`docs/PROJECT_SCOPE.md` 5절) | 참가/신고 처리 결과는 인앱 **Toast**로 대체(`COMP-GLOBAL-TOAST`, REQ-FUNC-043). Supabase Auth 자체의 기본 인증 메일(가입 확인·비밀번호 재설정)은 별도 Email 공급자 연동이 아니라 Auth 기능의 일부로만 사용한다 |
| **Monitoring/APM**(Datadog, Sentry 등 전용 모니터링 파이프라인) | 장애 알림·SLA 모니터링 체계 구축은 별도 단계의 과제(`docs/PROJECT_SCOPE.md` 5절, REQ-NF-008/009/011) | Vercel 기본 함수 로그만 사용, 수동 점검(`RELEASE-CHECK-VERCEL-SUPABASE`, `MANUAL-PERFORMANCE-CHECK`)으로 대체 |

---

## 착수 차단(Setup Blockers)

아래 항목은 2026-09-23 기준 저장소를 직접 확인한 결과, **실제로 존재하지 않아** 구현 착수 전 준비가 필요한 것만 기록한다(추측·일반론 제외).

| 구분 | 누락 항목 | 필요 이유 |
|---|---|---|
| 환경변수 | `NEXT_PUBLIC_SUPABASE_URL` | 현재 `.env*` 파일이 저장소에 하나도 없음 — Browser/Server Supabase Client(9절) 초기화에 필수 |
| 환경변수 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 동일 — Browser Client 인증에 필수 |
| 환경변수 | Supabase 서버 전용 키(서비스 롤 또는 서버 세션 키) | 동일 — Server Client(9절), RLS 우회가 필요한 관리자 작업에 필수 |
| 패키지 | `@supabase/supabase-js`, `@supabase/ssr`(또는 동등 패키지) | `package.json`에 미설치 — `AUTH-SUPABASE-EMAIL`, `DB-ACCESS` 등 Supabase 연동 Task 전부의 선행 조건 |
| 패키지 | `vitest` | `package.json`에 미설치 — 12절 Unit/Integration Test Task 전부의 선행 조건 |
| 패키지 | `@playwright/test` | `package.json`에 미설치 — 12절 E2E Task 전부의 선행 조건 |
| 디렉터리/설정 | `.github/workflows/` | 저장소에 존재하지 않음 — `CI-PIPELINE-BASE` 작성 전 디렉터리 생성 필요 |
| 디렉터리 | `supabase/` (마이그레이션 폴더) | 존재하지 않음 — `DB-SCHEMA-BASE` 착수 전 생성 필요 |

위 목록에 없는 파일·디렉터리(`src/data`, `src/lib`, `src/components`, `src/app/api` 등)는 각 구현 Task가 스스로 생성하는 신규 산출물이며, 별도 사전 준비가 필요한 착수 차단 요인이 아니다.
