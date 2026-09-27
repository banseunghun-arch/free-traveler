# COMP-SCR004-INTRO-CTA — Intro+"동행글 쓰기" CTA

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR004-INTRO-CTA |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-004 |
| Route | /mates |
| Page Entry | src/app/mates/page.tsx (조립은 TASK-PAGE-SCR004 소관) |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 25 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Section 1. 짧은 Intro와 "동행글 쓰기" CTA. 비로그인 상태에서는 `/account`로, 로그인 상태에서는 `/travel-tools`(동행 탭)로 연결한다.

## Project Scope

해당 없음 — UI_CONTRACT.md §SCR-004 디자인 규정.

## Requirement Ref

- 없음

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: /mates
- Page Entry: src/app/mates/page.tsx (조립은 TASK-PAGE-SCR004 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-004.

## Depends On

- COMP-GLOBAL-DESIGN-TOKENS

## Expected Files

- `src/components/scr004/IntroCta.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- CTA는 인증 상태에 따라 `/account` 또는 `/travel-tools`(동행 탭)로 분기한다.

## Visual AC

- CTA는 상시 노출한다(스크롤 여부와 무관).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- Playwright: 비로그인/로그인 상태별 CTA 목적지가 올바른지 확인한다.

## Verify

Playwright(E2E-AUTH-SMOKE).

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
