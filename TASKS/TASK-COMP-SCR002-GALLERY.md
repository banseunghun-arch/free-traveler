# COMP-SCR002-GALLERY — 여행 사진 Gallery 8장 이상

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR002-GALLERY |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-002 |
| Route | /about |
| Page Entry | src/app/about/page.tsx (조립은 TASK-PAGE-SCR002 소관) |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 19 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

About Section 6. 여행 사진 8장 이상을 Grid로 표시하며 장소명 alt 텍스트를 필수로 갖는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.6절 REQ-FUNC-061(축소) — alt 텍스트만 관리.

## Requirement Ref

- REQ-FUNC-061(축소)

## Screen / Route / Page Entry

- Screen: SCR-002
- Route: /about
- Page Entry: src/app/about/page.tsx (조립은 TASK-PAGE-SCR002 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-002.

## Depends On

- DATA-REPRESENTATIVE

## Expected Files

- `src/components/scr002/PhotoGallery.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 사진 8장 이상을 Grid로 표시한다.
- 각 사진은 장소명을 설명하는 alt 텍스트를 갖는다.

## Visual AC

- 이미지 로드 실패 시 alt 유지한 대체 표시를 사용한다.

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 데이터 검증: 사진 8장 이상, alt 텍스트 누락 없음을 확인한다.

## Verify

데이터 검증(DATA-VALIDATION-SCRIPT).

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
