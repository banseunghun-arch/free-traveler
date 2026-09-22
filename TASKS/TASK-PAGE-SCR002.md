# TASK-PAGE-SCR002 — SCR-002 Page Owner — 대표 소개(`/about`) 조립

| 항목 | 내용 |
|---|---|
| Task ID | TASK-PAGE-SCR002 |
| Category | page_owner |
| Implementation Status | IMPLEMENT |
| Screen | SCR-002 |
| Route | /about |
| Page Entry | src/app/about/page.tsx |
| Priority | P1 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 2 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

`src/app/about/`는 아직 존재하지 않는다. free_traveler 대표 소개 정적 페이지를 새로 조립하는 Task이며, 모든 콘텐츠는 `DATA-REPRESENTATIVE` 단일 정적 데이터 소스에서 가져온다(SCR-001의 요약 블록과 수치가 일치해야 함).

## Project Scope

`docs/PROJECT_SCOPE.md` 3절 항목 4(free_traveler 대표 소개), 4절(정적 데이터로 관리, 관리자 CRUD 없음).

## Requirement Ref

- REQ-FUNC-057
- REQ-FUNC-058
- REQ-FUNC-059
- REQ-FUNC-060
- REQ-FUNC-061(축소)
- REQ-FUNC-062(축소)
- REQ-FUNC-063
- REQ-FUNC-064
- REQ-FUNC-065
- REQ-FUNC-079

## Screen / Route / Page Entry

- Screen: SCR-002
- Route: /about
- Page Entry: src/app/about/page.tsx

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-002(영역 순서 7개); `design-reference/D-001/DESIGN.md` §19(Section 순서·최소 콘텐츠 수).

## Depends On

- COMP-SCR002-PROFILE-HERO
- COMP-SCR002-TRAVEL-STATS
- COMP-SCR002-INTRO-PHILOSOPHY
- COMP-SCR002-TIMELINE
- COMP-SCR002-VISITED-COUNTRIES
- COMP-SCR002-GALLERY
- COMP-SCR002-RECOMMENDED-DEST
- COMP-GLOBAL-HEADER-FOOTER
- COMP-GLOBAL-DESIGN-TOKENS
- DATA-REPRESENTATIVE

## Expected Files

- `src/app/about/page.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- Section 순서: ①Profile Hero → ②여행 지표 → ③소개·철학 → ④Timeline 6개 → ⑤방문 국가 30개 → ⑥Gallery 8개 → ⑦기억에 남는 여행지 4개+CTA.
- 전 Section 데이터는 `DATA-REPRESENTATIVE`에서 가져오며, 홈(SCR-001) 요약 블록과 동일한 수치(50+ Trips/30+ Countries)를 표시한다(REQ-FUNC-057 페이지 간 일치).
- 최소 콘텐츠 수: Timeline 6개 이상, 방문 국가 Chip 30개, Gallery 사진 8장 이상, 추천 여행지 Card 4개.
- Mobile 변형은 미승인(Desktop 전용) — 320px까지는 반응형 원칙(REQ-FUNC-065)만 적용한다.

## Visual AC

- 큰 빈 영역 금지, Placeholder 문구(`Lorem ipsum`/"준비 중"/"정보 확인 필요") 금지, 빈 Card 금지.
- 정적 데이터 화면이므로 Empty State·Loading State는 해당 없음(`DATA-REPRESENTATIVE`는 빌드 타임에 확정되는 정적 데이터이므로 클라이언트 조회 지연이 발생하지 않음, 항상 Success) — 이미지 로드 실패 시 alt 유지한 대체 표시만 처리한다.

## Security/Privacy AC

- 해당 없음(비로그인 공개 정적 페이지, 쓰기 작업 없음).

## Test Cases

- Playwright: SCR-001과 SCR-002의 50+ Trips/30+ Countries 수치가 동일한지 확인한다.
- Playwright: Timeline 6개 이상, Gallery 8장 이상, 방문 국가 Chip 30개가 렌더링되는지 확인한다.
- Playwright: 추천 여행지 Card 4개 클릭 시 유효한 여행지 상세로 연결되는지 확인한다.

## Verify

Playwright(E2E-PUBLIC-SMOKE).

## Definition of Done

- 위 AC를 모두 만족한다.
- E2E-PUBLIC-SMOKE의 About 시나리오가 통과한다.

## Forbidden

- 통계 차트·대시보드를 추가하지 않는다.
- Mobile 전용 별도 레이아웃을 새로 설계하지 않는다(미승인).
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
