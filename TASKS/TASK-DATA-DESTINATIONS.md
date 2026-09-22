# DATA-DESTINATIONS — 여행지 정적 데이터(국내 10곳·해외 15개국 30개 도시)

| 항목 | 내용 |
|---|---|
| Task ID | DATA-DESTINATIONS |
| Category | data |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 44 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

여행지 정적 데이터. Skill Rule 11에 따라 DB가 아닌 TypeScript 정적 파일로 관리한다. 국내 10곳, 해외 15개국 30개 도시 이상을 포함한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 4절(정적 데이터로 관리, CRUD 화면 없음); 6.1절 REQ-FUNC-001~009.

## Requirement Ref

- REQ-FUNC-001
- REQ-FUNC-002
- REQ-FUNC-003
- REQ-FUNC-004
- REQ-FUNC-005
- REQ-FUNC-006
- REQ-FUNC-007
- REQ-FUNC-009

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/D-001/DESIGN.md` §9(Destination Card) — 스키마가 Card 표시 항목과 일치해야 한다.

## Depends On

- 없음

## Expected Files

- `src/data/destinations.ts`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 각 여행지는 `scope`(domestic/international), `countryCode`, `overview`, `highlights`, `itinerary`, `imageUrl`, `imageAlt`, `themes` 필드를 갖는다(REQ-FUNC-004 필수 콘텐츠 항목).
- 국내 10곳 이상, 해외 15개국 30개 도시 이상을 포함한다(REQ-FUNC-008/REQ-NF-026과 함께 DATA-VALIDATION-SCRIPT로 수량 검증).
- 해외 여행지는 `countryCode`로 `DATA-SAFETY`와 연결 가능해야 한다(REQ-FUNC-006).

## Visual AC

- 모든 이미지 필드는 alt 텍스트를 필수로 갖는다(REQ-FUNC-007 축소 — 출처/작가/라이선스 필드 없음).
- `Lorem ipsum`/"준비 중"/"정보 확인 필요" 문자열을 포함하지 않는다.

## Security/Privacy AC

- 해당 없음(정적 데이터, 쓰기 API 없음).

## Test Cases

- 유닛 테스트: 국내 10곳 이상, 해외 15개국 30개 도시 이상인지 카운트한다(REQ-FUNC-008).
- 유닛 테스트: 모든 항목에 alt 텍스트가 존재하는지 확인한다.

## Verify

DATA-VALIDATION-SCRIPT, 유닛 테스트.

## Definition of Done

- 위 AC 충족.

## Forbidden

- 출처·작가·라이선스 메타데이터 필드를 추가하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
