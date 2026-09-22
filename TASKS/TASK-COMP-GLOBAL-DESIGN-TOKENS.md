# COMP-GLOBAL-DESIGN-TOKENS — `design-reference/D-001/DESIGN.md` 토큰을 Tailwind 테마로 반영

| 항목 | 내용 |
|---|---|
| Task ID | COMP-GLOBAL-DESIGN-TOKENS |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 35 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

모든 화면·Component가 참조하는 기반 Task. `design-reference/D-001/DESIGN.md`에 LOCKED된 Color/Typography/Spacing/Radius/Shadow 토큰을 Tailwind 테마 값과 CSS 변수로 반영한다.

## Project Scope

해당 없음 — 디자인 정본 반영 작업(Requirement Ref 미연결).

## Requirement Ref

- 없음

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/D-001/DESIGN.md` §2(Color Token), §3(Typography), §4(Spacing), §5(Radius), §6(Shadow).

## Depends On

- 없음

## Expected Files

- `tailwind.config.ts`(MODIFY/NEW)
- `src/app/globals.css`(MODIFY)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- DESIGN.md §2~§6에 정의된 모든 토큰 값을 Tailwind 테마(`tailwind.config.ts`) 또는 CSS 변수(`globals.css`)로 반영한다.
- 코랄 브랜드 색(`#D03E1B`)을 사용하고 Airbnb Rausch(`#ff385c`)를 사용하지 않는다.

## Visual AC

- Inter 폰트 + 한글 시스템 폰트 폴백을 설정한다.

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 코드 리뷰: 토큰 값이 DESIGN.md와 1:1 일치하는지 확인한다.
- 코드 리뷰: 하드코딩된 미토큰 색상값이 없는지 확인한다.

## Verify

코드 리뷰 + CI(CI-PIPELINE-BASE)의 lint 통과.

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb Rausch(#ff385c) 등 상표 연상 색상을 사용하지 않는다.
- 토큰 없이 임의의 색상/간격 값을 하드코딩하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
