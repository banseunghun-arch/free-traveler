# COMP-SCR004-POST-DETAIL — 상세(Desktop 좌우분할/Mobile Drawer)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR004-POST-DETAIL |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-004 |
| Route | /mates |
| Page Entry | src/app/mates/page.tsx (조립은 TASK-PAGE-SCR004 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 28 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Section 4. 목록에서 선택한 동행글 상세를 Desktop은 좌우 분할, Mobile은 전체화면 Drawer로 표시한다. 연락처 필드는 응답 데이터 자체에 포함하지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.4절 REQ-FUNC-033 — 응답 데이터에 연락처 필드 자체를 포함하지 않음.

## Requirement Ref

- REQ-FUNC-033

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: /mates
- Page Entry: src/app/mates/page.tsx (조립은 TASK-PAGE-SCR004 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-004, `design-reference/D-001/DESIGN.md` §11(Mate Post Card), §15(Desktop·Mobile 규칙).

## Depends On

- API-MATE-POSTS

## Expected Files

- `src/components/scr004/PostDetail.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 제목·국가·지역·기간·모집인원·설명·작성자 프로필 요약을 표시한다.
- Desktop은 목록과 동시 표시(좌우 분할), Mobile은 Drawer로 전환한다.

## Visual AC

- 연락처 관련 필드/텍스트를 렌더링하지 않는다(데이터 자체에 없음).

## Security/Privacy AC

- API 응답 페이로드에 연락처 필드가 존재하지 않는지 통합 테스트로 확인한다.

## Test Cases

- 통합 테스트: 상세 API 응답에 연락처 필드가 없는지 확인한다.
- Playwright: Desktop 좌우분할/Mobile Drawer 전환을 확인한다.

## Verify

Playwright(E2E-MATE-AUTH).

## Definition of Done

- 위 AC 충족.

## Forbidden

- 연락처 필드를 API 응답에 포함하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
