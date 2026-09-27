# COMP-SCR005-PROFILE — Member: 프로필·성인확인 요약

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR005-PROFILE |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-005 |
| Route | /account |
| Page Entry | src/app/account/page.tsx (조립은 TASK-PAGE-SCR005 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 32 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Member 역할 전용 블록. 닉네임·연령대·성별·스타일·소개와 성인확인 상태 요약을 표시하고 수정 Form을 제공한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.4절 REQ-FUNC-029 — 닉네임/연령대/스타일 필수, 성별 선택.

## Requirement Ref

- REQ-FUNC-029

## Screen / Route / Page Entry

- Screen: SCR-005
- Route: /account
- Page Entry: src/app/account/page.tsx (조립은 TASK-PAGE-SCR005 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-005.

## Depends On

- DB-ACCESS

## Expected Files

- `src/components/scr005/ProfileSummary.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 닉네임·연령대·스타일을 필수로, 성별을 선택으로 입력받는다.
- 성인확인 상태(`is_adult`/`adult_verified_at`)를 요약 표시한다.

## Visual AC

- 필수 필드 미입력 시 저장을 차단하고 안내한다.

## Security/Privacy AC

- 본인 프로필만 조회/수정 가능하다(RLS).
- 생년월일 원본은 저장하지 않는다.

## Test Cases

- Playwright: 프로필 작성 흐름을 확인한다.
- 통합 테스트: 타인 프로필 수정 시도가 차단되는지 확인한다.

## Verify

Playwright(E2E-AUTH-SMOKE), Integration(TEST-RLS-BASIC).

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
