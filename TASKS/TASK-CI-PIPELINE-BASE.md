# CI-PIPELINE-BASE — TypeScript strict·lint·unit test CI 게이트

| 항목 | 내용 |
|---|---|
| Task ID | CI-PIPELINE-BASE |
| Category | ci |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 64 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

PR/병합 전 필수 게이트: `tsconfig` strict 모드, ESLint, 유닛 테스트, `DATA-VALIDATION-SCRIPT`를 하나의 파이프라인으로 묶는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 6.14절 REQ-NF-031, 032(축소).

## Requirement Ref

- REQ-NF-031
- REQ-NF-032(축소)

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(CI 설정).

## Depends On

- TASK-PAGE-SCR001
- TASK-PAGE-SCR002
- TASK-PAGE-SCR003
- TASK-PAGE-SCR004
- TASK-PAGE-SCR005

## Expected Files

- `.github/workflows/ci.yml (또는 Vercel 빌드 설정)`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- `tsc --noEmit`(strict), ESLint, 유닛 테스트(`UNIT-*`), `DATA-VALIDATION-SCRIPT`를 순서대로 실행한다.
- 하나라도 실패하면 파이프라인이 실패로 종료된다.
- Vercel 기본 함수 로그로 구조화 로그를 대체한다(REQ-NF-032 축소, 별도 로그 수집 파이프라인 없음).

## Visual AC

- 해당 없음(비-UI Task).

## Security/Privacy AC

- 해당 없음.

## Test Cases

- 의도적으로 타입 오류/lint 오류를 주입해 파이프라인이 실패하는지 확인한다.

## Verify

CI 실행 로그로 직접 확인.

## Definition of Done

- 위 AC 충족.

## Forbidden

- 자동 Merge/Merge Runner를 구성하지 않는다(코드 변경은 사람이 검토·승인).
- 별도 로그 수집 인프라(EC2/AWS 등)를 구성하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
