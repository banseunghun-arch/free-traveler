# COMP-GLOBAL-EMPTY-STATE-BLOCK — 완성형 Empty State 공용 블록(안내+방법+CTA)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-GLOBAL-EMPTY-STATE-BLOCK |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 37 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

모든 화면의 데이터 없음 상태에서 재사용하는 공용 Empty State 블록. Skill Rule 20(완성형 Empty State 필수)을 코드 레벨에서 강제한다.

## Project Scope

해당 없음 — 디자인 규정(`design-reference/D-001/DESIGN.md` §20).

## Requirement Ref

- 없음

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/D-001/DESIGN.md` §20(완성형 Empty State와 Placeholder 문구 금지 규칙).

## Depends On

- COMP-GLOBAL-DESIGN-TOKENS

## Expected Files

- `src/components/shared/EmptyState.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 안내 문장, 이용 방법(단계), CTA 버튼을 props로 받아 조합한다.
- 세 요소(안내/방법/CTA) 중 하나라도 비어 있으면 렌더링을 거부하는 개발 경고를 출력한다(빈 Empty State 방지).

## Visual AC

- `Lorem ipsum`, "준비 중", "정보 확인 필요" 문구를 기본값으로 갖지 않는다(호출부에서 반드시 실제 문구를 전달해야 함).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 유닛 테스트: 필수 props 누락 시 개발 경고가 발생하는지 확인한다.

## Verify

코드 리뷰 + 각 사용처의 Playwright 시나리오.

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
