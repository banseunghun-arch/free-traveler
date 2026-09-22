# COMP-GLOBAL-A11Y — ARIA/시맨틱 공통 처리, 키보드 포커스 링

| 항목 | 내용 |
|---|---|
| Task ID | COMP-GLOBAL-A11Y |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 41 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Form·Modal·Tabs·Alert 등 공용 컴포넌트에 ARIA/시맨틱 속성과 키보드 포커스 표시를 공통 적용한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.7절 REQ-FUNC-079; 6.12절 REQ-NF-023(WCAG 2.2 AA 목표).

## Requirement Ref

- REQ-FUNC-079
- REQ-NF-023

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(접근성 유틸리티, DESIGN.md 토큰의 포커스 색상 재사용).

## Depends On

- COMP-GLOBAL-DESIGN-TOKENS

## Expected Files

- `src/components/shared/* (공통 속성)`(MODIFY)
- `src/lib/a11y.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- Form 오류는 `aria-describedby`로 연결한다.
- Modal/Drawer는 `role="dialog"`+포커스 트랩을 갖는다.
- Tabs는 `role="tablist"`/`role="tab"`/`aria-selected`를 사용한다.

## Visual AC

- 모든 상호작용 요소에 시각적으로 구분되는 키보드 포커스 링을 표시한다.

## Security/Privacy AC

- 해당 없음.

## Test Cases

- axe 자동 검사(MANUAL-A11Y-CHECK)로 핵심 화면을 스캔한다.
- 수동 키보드 내비게이션 검사(Tab/Shift+Tab/Esc)를 수행한다.

## Verify

MANUAL-A11Y-CHECK.

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
