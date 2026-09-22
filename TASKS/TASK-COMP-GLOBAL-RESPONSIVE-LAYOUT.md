# COMP-GLOBAL-RESPONSIVE-LAYOUT — 320px~Desktop 반응형 그리드 유틸+이미지 lazy load

| 항목 | 내용 |
|---|---|
| Task ID | COMP-GLOBAL-RESPONSIVE-LAYOUT |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 40 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

320px(Mobile)부터 Desktop까지 반응형 Grid 유틸과 Next.js `Image` 컴포넌트 기반 lazy load 설정.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.7절 REQ-FUNC-065; 6.8절 REQ-NF-006.

## Requirement Ref

- REQ-FUNC-065
- REQ-NF-006

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/D-001/DESIGN.md` §15(Desktop·Mobile 규칙), §16(Page Section 최대 폭과 상하 여백).

## Depends On

- COMP-GLOBAL-DESIGN-TOKENS

## Expected Files

- `src/components/shared/ResponsiveGrid.tsx`(NEW)
- `next.config.ts`(MODIFY(image 설정))

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- Tailwind 반응형 유틸리티로 320px~Desktop 레이아웃을 지원한다.
- 이미지에 Next.js `Image` 컴포넌트를 사용하고 LCP 이미지는 `priority`, 나머지는 lazy load 처리한다.

## Visual AC

- 320px 폭에서도 가로 스크롤이 발생하지 않는다.

## Security/Privacy AC

- 해당 없음.

## Test Cases

- Playwright: 320px/768px/1440px 뷰포트에서 레이아웃 스크린샷을 확인한다.

## Verify

Playwright(뷰포트별 확인, MANUAL-A11Y-CHECK와 연계).

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
