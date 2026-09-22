# COMP-GLOBAL-ERROR-PAGES — 404/500/권한없음/외부연결실패 복구 행동(기술 Route)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-GLOBAL-ERROR-PAGES |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 43 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

5개 Screen 수에 포함되지 않는 기술 Route(UI_CONTRACT.md "기술 Route" 절)로서, 404/500/권한없음/외부연결실패 상황에 홈/이전/재시도 버튼을 제공한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.7절 REQ-FUNC-078.

## Requirement Ref

- REQ-FUNC-078

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/UI_CONTRACT.md` "기술 Route" 절; `design-reference/D-001/DESIGN.md` §14(Loading·Empty·Error 상태).

## Depends On

- COMP-GLOBAL-DESIGN-TOKENS

## Expected Files

- `src/app/not-found.tsx`(NEW)
- `src/app/error.tsx`(NEW)
- `src/app/global-error.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 404 페이지는 홈으로 이동 버튼을 제공한다.
- 500/글로벌 오류 페이지는 재시도 버튼을 제공한다.
- 외부 연결(항공/호텔/외교부 링크) 실패는 해당 Component 내에서 재시도 버튼으로 처리한다(FLIGHT-FORM/HOTEL-FORM/SAFETY-GRID와 연계).

## Visual AC

- 오류 페이지도 Header/Footer를 유지한다.

## Security/Privacy AC

- 해당 없음.

## Test Cases

- Playwright: 존재하지 않는 경로 접근 시 404 페이지가 표시되는지 확인한다.

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
