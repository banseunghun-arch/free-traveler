# COMP-SCR001-SAFETY-GRID — 국가별 주의사항 Card 6개 + 안전정보 Drawer(8개 카테고리)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR001-SAFETY-GRID |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-001 |
| Route | / |
| Page Entry | src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 11 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

홈 Section 5. 국가별 안전정보를 요약 Card 6개로 노출하고, 클릭 시 8개 필수 카테고리(REQ-FUNC-047)를 담은 상세 Drawer/Modal로 확장한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.5절 REQ-FUNC-046~054(EXCLUDED 055·056 제외).

## Requirement Ref

- REQ-FUNC-047
- REQ-FUNC-048
- REQ-FUNC-049
- REQ-FUNC-050
- REQ-FUNC-051
- REQ-FUNC-052
- REQ-FUNC-053
- REQ-FUNC-054
- REQ-NF-028(부분)

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: /
- Page Entry: src/app/page.tsx (조립은 TASK-PAGE-SCR001 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-001; `design-reference/D-001/DESIGN.md` §9(Destination Card), §12(Drawer·Modal).

## Depends On

- DATA-SAFETY

## Expected Files

- `src/components/scr001/CountrySafetyGrid.tsx`(NEW)
- `src/components/scr001/SafetyDrawer.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 국가 Card 6개를 표시하고, 클릭 시 안전정보 Drawer(요약)를 연 뒤 "자세히 보기"로 Modal(8개 카테고리 전체)을 확장한다.
- 출처명·URL·확인일·편집자를 표시한다(REQ-FUNC-048).
- 외교부 원문 링크는 새 탭(`noopener,noreferrer`)으로 연다(REQ-FUNC-049).
- `verified_at` 기준 7일 초과 시 stale 경고를 렌더링 시점에 계산해 표시한다(REQ-FUNC-050).
- 중대 경보 단계·범위를 상단 텍스트 라벨로 고정 표시하고(REQ-FUNC-051), 국가/지역 경보 범위를 구분한다(REQ-FUNC-052).
- 현지·영사콜센터 긴급연락처를 표시한다(REQ-FUNC-053).
- "공식 판단을 대체하지 않는다" 고지 문구를 고정 배치한다(REQ-FUNC-054).

## Visual AC

- 8개 카테고리 중 누락된 항목이 있어도 빈 섹션으로 남기지 않고 데이터 자체가 완전해야 한다(DATA-SAFETY 검증 스크립트로 사전 보증).

## Security/Privacy AC

- 해당 없음(읽기 전용 정적 데이터).

## Test Cases

- Playwright: stale(7일 초과) 안전정보 국가에서 경고가 렌더링되는지 확인한다.
- Playwright: 외교부 원문 링크가 새 탭으로 열리는지 확인한다.
- 데이터 스키마 검증: 8개 카테고리 필드가 모두 존재하는지 확인한다.

## Verify

Playwright(E2E-PUBLIC-SMOKE), 데이터 스키마 검증(DATA-VALIDATION-SCRIPT).

## Definition of Done

- 위 AC 충족.
- DATA-SAFETY 스키마가 8개 카테고리를 모두 포함한다.

## Forbidden

- 별도 안전정보 대시보드/통계 화면을 만들지 않는다(REQ-FUNC-075 EXCLUDED).
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
