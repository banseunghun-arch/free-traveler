# COMP-GLOBAL-FAVORITES — 즐겨찾기 `localStorage` 로직(추가/해제/조회)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-GLOBAL-FAVORITES |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 39 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

여행지 즐겨찾기를 서버에 저장하지 않고 브라우저 `localStorage`에만 보관하는 공용 로직(DB 테이블 없음).

## Project Scope

`docs/PROJECT_SCOPE.md` 4절 "즐겨찾기는 서버에 저장하지 않고 브라우저 localStorage에만 보관".

## Requirement Ref

- REQ-FUNC-068

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(순수 로직 유틸).

## Depends On

- 없음

## Expected Files

- `src/lib/favorites.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 여행지 슬러그 목록을 `localStorage`에 추가/해제/조회하는 함수를 제공한다.
- SSR 환경(서버 렌더링 시 `window` 없음)에서 안전하게 동작한다(try/catch 또는 존재 체크).

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 서버로 즐겨찾기 데이터를 전송하지 않는다.

## Test Cases

- 유닛 테스트: 추가/해제/조회가 `localStorage`에 정확히 반영되는지 확인한다.
- 유닛 테스트: `localStorage` 접근 불가 환경에서도 오류 없이 동작하는지 확인한다.

## Verify

유닛 테스트.

## Definition of Done

- 위 AC 충족.

## Forbidden

- 즐겨찾기를 위한 DB 테이블(7번째 테이블)을 만들지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
