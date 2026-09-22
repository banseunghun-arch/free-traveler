# DATA-SAFETY — 국가별 안전정보 정적 데이터(8개 카테고리)

| 항목 | 내용 |
|---|---|
| Task ID | DATA-SAFETY |
| Category | data |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 45 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

게시된 모든 해외 국가에 대한 안전정보 정적 데이터. 8개 필수 카테고리를 고정 스키마로 갖는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.5절 REQ-FUNC-046~054(055·056 EXCLUDED 제외).

## Requirement Ref

- REQ-FUNC-046
- REQ-FUNC-047
- REQ-FUNC-048
- REQ-FUNC-049
- REQ-FUNC-050
- REQ-FUNC-051
- REQ-FUNC-052
- REQ-FUNC-053
- REQ-FUNC-054
- REQ-NF-027

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/D-001/DESIGN.md` §12(Drawer·Modal — 안전정보 표시 위치).

## Depends On

- 없음

## Expected Files

- `src/data/safety.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- `DATA-DESTINATIONS`의 해외 국가 목록과 1:1 커버리지를 갖는다(REQ-FUNC-046, REQ-NF-027).
- 8개 필수 카테고리(치안, 자연재해, 보건, 교통, 문화적 유의사항, 긴급연락처, 출입국, 기타)를 고정 필드로 갖는다(REQ-FUNC-047).
- 출처명·URL·확인일(`verified_at`)·편집자 필드를 갖는다(REQ-FUNC-048).
- 외교부 원문 URL 필드를 갖는다(REQ-FUNC-049, 새 탭 이동은 UI Task 소관).
- 경보 단계·범위(`scope_type`/`scope_text`) 필드를 갖는다(REQ-FUNC-051, 052).
- 현지·영사콜센터 긴급연락처 필드를 갖는다(REQ-FUNC-053).

## Visual AC

- `Lorem ipsum`/"준비 중"/"정보 확인 필요" 문자열을 포함하지 않는다.

## Security/Privacy AC

- 해당 없음(정적 데이터, 쓰기 API 없음).

## Test Cases

- 유닛 테스트: 여행지 데이터의 모든 해외 국가에 대응하는 안전정보가 존재하는지 확인한다(국가 커버리지 100%).
- 유닛 테스트: 8개 카테고리 필드가 모두 채워져 있는지 확인한다.

## Verify

DATA-VALIDATION-SCRIPT, 유닛 테스트.

## Definition of Done

- 위 AC 충족.

## Forbidden

- 안전정보 편집 UI/CRUD 화면을 만들지 않는다(REQ-FUNC-055 EXCLUDED).
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
