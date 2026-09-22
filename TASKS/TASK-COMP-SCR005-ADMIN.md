# COMP-SCR005-ADMIN — Admin: 신고 큐+외부 URL 설정

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR005-ADMIN |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-005 |
| Route | /account |
| Page Entry | src/app/account/page.tsx (조립은 TASK-PAGE-SCR005 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 34 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Admin 역할 전용 블록. OPEN/REVIEWING/RESOLVED/DISMISSED 상태별 신고 큐와 항공/호텔/SNS 외부 URL(HTTPS만) 설정 Form만 포함한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 4절 "관리자 범위: 신고 상태 변경과 외부 URL 설정만"; 6.7절 REQ-FUNC-041, 042, 077.

## Requirement Ref

- REQ-FUNC-041
- REQ-FUNC-042
- REQ-FUNC-077

## Screen / Route / Page Entry

- Screen: SCR-005
- Route: /account
- Page Entry: src/app/account/page.tsx (조립은 TASK-PAGE-SCR005 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-005, `design-reference/D-001/DESIGN.md` §21(Do/Do Not — Admin 통계 대시보드 금지).

## Depends On

- API-BLOCK-REPORT
- API-ADMIN-URLS

## Expected Files

- `src/components/scr005/AdminPanel.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- OPEN/REVIEWING/RESOLVED/DISMISSED 상태별 필터 목록을 제공한다(REQ-FUNC-041).
- 경고·숨김·제한·기각 등 핵심 조치를 제공하고, 사유/담당자/시각을 `reports` 레코드 필드에 직접 기록한다(REQ-FUNC-042 축소, 별도 감사 로그 테이블 없음).
- 항공/호텔/SNS 외부 URL을 HTTPS만 허용해 설정한다(REQ-FUNC-077).

## Visual AC

- 통계 차트·KPI 그리드를 넣지 않는다(신고 큐+URL Form만).

## Security/Privacy AC

- Admin 역할만 접근 가능하다(RLS+서버 역할 검사).
- HTTP(비-HTTPS) URL은 저장 전 거부한다.

## Test Cases

- Playwright: 신고 상태 변경이 큐에 반영되는지 확인한다.
- Playwright: 잘못된(비-HTTPS) URL 저장이 차단되는지 확인한다.
- 통합 테스트: Admin이 아닌 사용자의 접근이 거부되는지 확인한다.

## Verify

Playwright(E2E-MATE-AUTH), Integration(TEST-RLS-BASIC).

## Definition of Done

- 위 AC 충족.

## Forbidden

- 통계 차트·대시보드·콘텐츠 CRUD·범용 감사 로그 화면을 추가하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
