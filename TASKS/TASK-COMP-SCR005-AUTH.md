# COMP-SCR005-AUTH — Guest: 로그인/가입/비밀번호 재설정+기능안내+보안안내

| 항목 | 내용 |
|---|---|
| Task ID | COMP-SCR005-AUTH |
| Category | component |
| Implementation Status | IMPLEMENT |
| Screen | SCR-005 |
| Route | /account |
| Page Entry | src/app/account/page.tsx (조립은 TASK-PAGE-SCR005 소관) |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 31 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Guest 역할 전용 블록. 계정 기능 Intro → 로그인/가입/비밀번호 재설정 Card → 로그인 후 가능한 기능 안내 → 보안 안내 순서로 구성한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.7절 REQ-FUNC-066 — Supabase Auth 이메일 플로우.

## Requirement Ref

- REQ-FUNC-066

## Screen / Route / Page Entry

- Screen: SCR-005
- Route: /account
- Page Entry: src/app/account/page.tsx (조립은 TASK-PAGE-SCR005 소관)

## Design Ref

`design-reference/UI_CONTRACT.md` §SCR-005.

## Depends On

- AUTH-SUPABASE-EMAIL

## Expected Files

- `src/components/scr005/AuthPanel.tsx`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정을 제공한다.
- 로그인 후 가능한 기능(동행글 작성, 참가 신청 등) 안내를 표시한다.

## Visual AC

- Form 오류는 필드 옆에 즉시 표시한다.

## Security/Privacy AC

- 비밀번호는 Supabase Auth를 통해서만 처리하고 자체 저장하지 않는다.
- 보안 안내(비밀번호 정책 등)를 표시한다.

## Test Cases

- Playwright: 가입→이메일 인증 안내→로그인 전 과정을 확인한다.
- Playwright: 비밀번호 재설정 요청 흐름을 확인한다.

## Verify

Playwright(E2E-AUTH-SMOKE).

## Definition of Done

- 위 AC 충족.

## Forbidden

- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
