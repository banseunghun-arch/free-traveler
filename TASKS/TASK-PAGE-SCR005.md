# TASK-PAGE-SCR005 — SCR-005 Page Owner — 계정·관리(`/account`) 조립

| 항목 | 내용 |
|---|---|
| Task ID | TASK-PAGE-SCR005 |
| Category | page_owner |
| Implementation Status | IMPLEMENT |
| Screen | SCR-005 |
| Route | /account |
| Page Entry | src/app/account/page.tsx |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 5 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

`src/app/account/`는 아직 존재하지 않는다. 이 Route는 Guest/Member/Admin 3가지 역할을 하나의 페이지에서 조건부로 렌더링해야 하며(Skill Rule 9), 역할 판별은 서버 세션 기준으로 한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 2절 SCR-005 정의("역할에 없는 탭은 렌더링하지 않음"); 3절 항목 6·10; 4절 관리자 범위(신고 상태 변경 + 외부 URL 설정만).

## Requirement Ref

- REQ-FUNC-064
- REQ-FUNC-065
- REQ-FUNC-066
- REQ-FUNC-079

## Screen / Route / Page Entry

- Screen: SCR-005
- Route: /account
- Page Entry: src/app/account/page.tsx

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-005(역할별 영역); `design-reference/D-001/DESIGN.md` §19, §21(Do/Do Not — Admin 통계 대시보드 금지).

## Depends On

- COMP-SCR005-AUTH
- COMP-SCR005-PROFILE
- COMP-SCR005-MY-ACTIVITY
- COMP-SCR005-ADMIN
- AUTH-SUPABASE-EMAIL
- API-MATE-POSTS
- API-PARTICIPATION
- API-BLOCK-REPORT
- API-ADMIN-URLS
- COMP-GLOBAL-FAVORITES
- COMP-GLOBAL-HEADER-FOOTER
- COMP-GLOBAL-EMPTY-STATE-BLOCK
- COMP-GLOBAL-TOAST
- COMP-GLOBAL-DESIGN-TOKENS

## Expected Files

- `src/app/account/page.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- Guest/Member/Admin 역할별 탭 렌더링 분기를 **실제로 조립**한다. 역할에 없는 탭·블록은 렌더링하지 않는다(조건부 렌더링 로직을 코드로 구현, 문서상 언급만으로 대체하지 않는다).
- 현재 역할의 Intro → 핵심 작업 → 도움말/다음 행동 순서를 지킨다: Guest(계정 기능 Intro→로그인/가입/재설정→기능 안내→보안 안내), Member(프로필 요약→내 글→참가 요청→즐겨찾기→차단 목록→작성 CTA), Admin(관리 Intro→신고 큐→외부 URL 설정).
- Member "내 글" 없음/참가 요청 없음/즐겨찾기 없음/차단 없음은 각각 완성형 Empty State.

## Visual AC

- 큰 빈 영역·Placeholder 문구·빈 Card 금지.
- Admin에 차트·KPI 그리드를 넣지 않는다(신고 큐+URL Form만).
- 역할 판별(`AUTH-SUPABASE-EMAIL` 세션 확인)과 Member/Admin 데이터 조회 중에는 Loading 상태를 표시한다. 확인이 끝나기 전까지 Guest Empty/Unauthorized 상태로 오인되는 화면을 보여주지 않는다.

## Security/Privacy AC

- Guest는 Unauthorized가 기본 진입 상태다.
- Member/Admin 데이터는 RLS로 본인/작성자/Admin만 접근한다(REQ-FUNC-044, REQ-NF-013).
- 외부 URL은 HTTPS만 허용하고 저장 전 검증한다(REQ-FUNC-077).

## Test Cases

- Playwright: Guest로 진입 시 Member/Admin 탭이 렌더링되지 않는지 확인한다.
- Playwright: Member로 로그인 시 Admin 전용 UI(신고 큐, URL 설정)가 보이지 않는지 확인한다.
- Playwright: Admin으로 로그인 시 신고 큐 상태 변경과 외부 URL HTTPS 검증이 동작하는지 확인한다.
- Playwright: Member "내 글" 0건일 때 Empty State가 나타나는지 확인한다.
- Playwright: 역할 판별 세션 확인 중 Loading 상태가 나타나고, 확인 후 Guest/Member/Admin 중 올바른 화면으로 전환되는지 확인한다.
- 통합 테스트(TEST-RLS-BASIC): 다른 사용자의 프로필/내 글에 대한 접근이 거부되는지 확인한다.

## Verify

Playwright(E2E-MATE-AUTH), Integration(TEST-RLS-BASIC).

## Definition of Done

- 위 AC를 모두 만족한다.
- TEST-RLS-BASIC이 통과한다.
- Guest/Member/Admin 조건부 렌더링이 코드로 구현되어 있다(문서 언급만이 아님).

## Forbidden

- Admin에 통계 차트·대시보드·콘텐츠 CRUD·범용 감사 로그 화면을 추가하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
