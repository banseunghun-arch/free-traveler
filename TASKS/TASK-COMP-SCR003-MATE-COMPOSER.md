# COMP-SCR003-MATE-COMPOSER — 동행 작성 Form 또는 로그인 안내+안전 안내(연락처 탐지 포함)

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR003-MATE-COMPOSER |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-003 |
| Route | /travel-tools |
| Page Entry | src/app/travel-tools/page.tsx (조립은 TASK-PAGE-SCR003 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 24 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

동행 구하기 탭. 비로그인/미인증 사용자에게는 로그인·성인확인 안내를, 인증된 회원에게는 동행글 작성 Form을 제공한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.4절 REQ-FUNC-027, 028, 031, 032; 3절 항목 7.

## Requirement Ref

- REQ-FUNC-027
- REQ-FUNC-028
- REQ-FUNC-031
- REQ-FUNC-032
- REQ-FUNC-080

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: /travel-tools
- Page Entry: src/app/travel-tools/page.tsx (조립은 TASK-PAGE-SCR003 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-003, `design-reference/D-001/DESIGN.md` §10(Form·Tabs).

## Depends On

- AUTH-SUPABASE-EMAIL
- API-MATE-POSTS

## Expected Files

- `src/components/scr003/MateComposer.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 이메일 인증 세션이 없으면 로그인 안내 + `/account` CTA를 표시한다(REQ-FUNC-027).
- 성인확인이 안 된 인증 사용자는 성인확인 안내를 표시한다(REQ-FUNC-028).
- 인증+성인확인 완료 회원에게는 제목·국가·지역·기간·모집인원·설명·안전수칙 동의 Form을 제공한다(REQ-FUNC-031).
- 제출 전 전화번호·이메일·메신저ID 등 공개 연락처 패턴을 정규식으로 탐지해 제출을 차단하고 수정 안내를 표시한다(REQ-FUNC-032).
- 안전수칙 동의 체크 없이는 제출이 차단되며, 제출 시 동의 시각을 함께 기록한다(REQ-FUNC-080).

## Visual AC

- 비로그인 상태를 빈 화면이 아닌 완성형 Unauthorized 안내로 표시한다.

## Security/Privacy AC

- `API-MATE-POSTS`를 통해 서버 측에서도 인증 세션을 재검증한다(클라이언트 검증만으로 우회되지 않게).

## Test Cases

- 유닛 테스트(UNIT-CONTACT-DETECTION): 전화번호/이메일/메신저ID 패턴이 포함된 설명 제출 시 차단되는지 확인한다.
- Playwright: 비로그인 상태에서 안내+CTA가 나타나는지 확인한다.
- Playwright: 안전수칙 동의 없이 제출 시 차단되는지 확인한다.

## Verify

Playwright(E2E-MATE-AUTH), Unit(UNIT-CONTACT-DETECTION).

## Definition of Done

- 위 AC 충족.

## Forbidden

- 생년월일 원본을 저장하지 않는다(REQ-FUNC-028 — is_adult/adult_verified_at만 저장).
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
