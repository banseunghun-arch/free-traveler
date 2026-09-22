# DATA-VALIDATION-SCRIPT — 데이터 수량·완전성 검증 스크립트(게시 전 완전성 게이트)

| 항목 | 내용 |
|---|---|
| Task ID | DATA-VALIDATION-SCRIPT |
| Category | data |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 47 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

관리자 UI 게이트 대신 코드 검증 스크립트로 콘텐츠 완전성을 보장한다(REQ-FUNC-074 축소). CI(CI-PIPELINE-BASE)에서 빌드/PR 시점에 실행한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.7절 REQ-FUNC-074(축소); 6.13절 REQ-NF-026, 027.

## Requirement Ref

- REQ-FUNC-008
- REQ-FUNC-074
- REQ-NF-026
- REQ-NF-027

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(검증 스크립트).

## Depends On

- DATA-DESTINATIONS
- DATA-SAFETY
- DATA-REPRESENTATIVE

## Expected Files

- `scripts/validate_content_data.mjs`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 국내 10곳 이상, 해외 15개국 30개 도시 이상을 검증한다(REQ-FUNC-008).
- 여행지 필수 필드(overview/highlights/itinerary/imageAlt 등) 누락을 검증한다(REQ-NF-026, 완전성 100%).
- 해외 안전정보 국가 커버리지 100%를 검증한다(REQ-NF-027).
- 검증 실패 시 누락 항목을 출력하고 non-zero exit code로 종료한다.

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 유닛 테스트: 의도적으로 필드를 누락시킨 fixture에서 스크립트가 실패를 정확히 보고하는지 확인한다.

## Verify

CI(CI-PIPELINE-BASE)에서 자동 실행.

## Definition of Done

- 위 AC 충족.
- CI에 스크립트가 연결되어 있다.

## Forbidden

- 관리자용 게시 승인 UI(DRAFT/REVIEW/PUBLISHED 워크플로)를 만들지 않는다(REQ-FUNC-055/072 EXCLUDED).
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
