# COMP-GLOBAL-SEO-META — 공개 페이지 SEO 메타데이터(Next.js Metadata API)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-GLOBAL-SEO-META |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 42 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

5개 공개 Screen에 대해 Next.js Metadata API로 title/description/canonical/OG 태그를 설정한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.7절 REQ-FUNC-070; 6.13절 REQ-NF-030.

## Requirement Ref

- REQ-FUNC-070
- REQ-NF-030

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(SEO 메타데이터).

## Depends On

- 없음

## Expected Files

- `src/app/layout.tsx`(MODIFY)
- `각 page.tsx의 generateMetadata`(MODIFY)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 5개 Screen 모두 고유한 title/description/canonical/OG 태그를 갖는다.

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 자동 메타 검사 스크립트: 5개 Route 모두 메타데이터 누락이 0건인지 확인한다.

## Verify

자동 메타 검사 스크립트.

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
