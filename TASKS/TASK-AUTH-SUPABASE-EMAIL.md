# AUTH-SUPABASE-EMAIL — 이메일 가입·인증·로그인·로그아웃·재설정+성인확인

| 항목 | 내용 |
|---|---|
| Task ID | AUTH-SUPABASE-EMAIL |
| Category | auth |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 52 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Supabase Auth 이메일 플로우 전체(가입/인증/로그인/로그아웃/비밀번호 재설정)와 성인확인 상태 관리. `src/app/auth/callback`은 5개 Screen 수에 포함되지 않는 기술 Route다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.4절 REQ-FUNC-027, 028; 6.7절 REQ-FUNC-066.

## Requirement Ref

- REQ-FUNC-027
- REQ-FUNC-028
- REQ-FUNC-066

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

`design-reference/UI_CONTRACT.md` "기술 Route" 절(인증 콜백).

## Depends On

- DB-SCHEMA-BASE
- DB-RLS-BASE

## Expected Files

- `src/lib/auth.ts`(NEW)
- `src/app/auth/callback/route.ts (기술 Route)`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- Supabase Auth 이메일 가입/인증/로그인/로그아웃/비밀번호 재설정을 구현한다(REQ-FUNC-066).
- 쓰기 작업(동행글 작성 등)에는 이메일 인증 세션을 서버에서 요구한다(REQ-FUNC-027).
- 성인확인 상태는 `is_adult`, `adult_verified_at` 필드만 저장하고 생년월일 원본은 저장하지 않는다(REQ-FUNC-028).

## Visual AC

- 해당 없음(비-UI Task, UI는 COMP-SCR005-AUTH 소관).

## Security/Privacy AC

- 세션 검증은 서버 미들웨어에서 수행하고 클라이언트 판단에만 의존하지 않는다.

## Test Cases

- 통합 테스트: 비회원 상태로 쓰기 API POST 시 차단되는지 확인한다.
- Playwright: 가입~로그아웃 전 과정을 확인한다(PROJECT_SCOPE.md 7절 시나리오 4).

## Verify

E2E-MATE-AUTH, 통합 테스트.

## Definition of Done

- 위 AC 충족.

## Forbidden

- 생년월일 원본을 저장하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
