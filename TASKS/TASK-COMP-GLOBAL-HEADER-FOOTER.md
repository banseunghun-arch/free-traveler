# COMP-GLOBAL-HEADER-FOOTER — 전역 Header/Footer(5개 Screen 공통)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-GLOBAL-HEADER-FOOTER |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | src/app/layout.tsx |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 36 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

`src/app/layout.tsx`에 배치되는 5개 Screen 공통 내비게이션·푸터. 정책 정적 페이지(이용약관 등) 링크도 Footer에 포함한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.7절 REQ-FUNC-064 — 공통 레이아웃 컴포넌트에 내비게이션·푸터 배치.

## Requirement Ref

- REQ-FUNC-064

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: src/app/layout.tsx

## Design Ref

`design-reference/D-001/DESIGN.md` §7(Header·Footer).

## Depends On

- COMP-GLOBAL-DESIGN-TOKENS

## Expected Files

- `src/components/shared/Header.tsx`(NEW)
- `src/components/shared/Footer.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 5개 Screen(`/`, `/about`, `/travel-tools`, `/mates`, `/account`)으로의 내비게이션 링크를 제공한다.
- Footer에 이용약관/개인정보 처리방침/동행 안전수칙/콘텐츠 면책 안내 링크를 포함한다.

## Visual AC

- 모든 페이지에서 동일한 Header/Footer가 렌더링된다.

## Security/Privacy AC

- 해당 없음.

## Test Cases

- Playwright: 5개 Route 모두에서 Header/Footer가 렌더링되는지 확인한다.

## Verify

Playwright(E2E-PUBLIC-SMOKE).

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
