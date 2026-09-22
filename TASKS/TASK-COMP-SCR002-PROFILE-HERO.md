# COMP-SCR002-PROFILE-HERO — Profile Hero

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR002-PROFILE-HERO |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-002 |
| Route | /about |
| Page Entry | src/app/about/page.tsx (조립은 TASK-PAGE-SCR002 소관) |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 14 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

About Section 1. 대표 사진과 소개 문장을 표시하는 비-풀스크린 Hero.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.6절 REQ-FUNC-061(축소) — alt 텍스트만 관리, 출처/작가/라이선스 필드 제외.

## Requirement Ref

- REQ-FUNC-061(축소)

## Screen / Route / Page Entry

- Screen: SCR-002
- Route: /about
- Page Entry: src/app/about/page.tsx (조립은 TASK-PAGE-SCR002 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-002, `design-reference/D-001/DESIGN.md` §17(Hero 높이 규칙 — 비풀스크린).

## Depends On

- DATA-REPRESENTATIVE

## Expected Files

- `src/components/scr002/ProfileHero.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 대표 사진 + 소개 한 문장을 표시한다.

## Visual AC

- 풀스크린(100vh) Hero를 사용하지 않는다.
- 이미지에 실제 인물/장소를 설명하는 alt 텍스트가 있다.

## Security/Privacy AC

- 해당 없음.

## Test Cases

- Playwright: Hero 이미지와 문장이 렌더링되는지 확인한다.

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
