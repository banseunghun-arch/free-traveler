# RELEASE-CHECK-VERCEL-SUPABASE — Vercel 배포·Supabase 연결·환경변수·비용 확인(Manual/Release Check)

| 항목 | 내용 |
|---|---|
| Task ID | RELEASE-CHECK-VERCEL-SUPABASE |
| Category | ci |
| Implementation Status | IMPLEMENT |
| Screen | 해당 없음(전역/인프라 Task) |
| Route | 해당 없음 |
| Page Entry | 해당 없음 |
| Priority | P0 |
| 출처 | `TASKS/00_TASK_LIST.md` Seq 65 |

> 이 파일은 개발 가능한 단위로 작성된 상세 Task 정의다. 여기 기록되지 않은 범위를 임의로 추가하지 않는다.

## Context

Vercel 배포 전 최종 수동 점검 체크리스트. 8절(Vercel 배포)의 요건을 확인 항목으로 문서화한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 8절 — Vercel 배포, 환경변수 관리, 비용 제약.

## Requirement Ref

- REQ-NF-005
- REQ-NF-012
- REQ-NF-016
- REQ-NF-019
- REQ-NF-034

## Screen / Route / Page Entry

- Screen: 해당 없음(전역/인프라 Task)
- Route: 해당 없음
- Page Entry: 해당 없음

## Design Ref

해당 없음(운영 체크리스트).

## Depends On

- CI-PIPELINE-BASE
- E2E-PUBLIC-SMOKE
- E2E-TRAVEL-TOOLS
- E2E-MATE-AUTH

## Expected Files

- `docs/RELEASE_CHECKLIST.md`(NEW)

> 이 목록 밖의 파일을 수정하지 않는다.

## Functional AC

- Vercel 프로젝트 연결·Supabase 접속 정보가 환경변수로 설정되어 있는지 확인한다.
- EC2·AWS 등 별도 인프라가 구성되지 않았는지 확인한다(REQ-NF-034, 월 인프라 비용 10만원 이하).
- 쓰기 API 응답시간(REQ-NF-005), 신고 접수 응답시간(REQ-NF-019)을 Playwright 실행 로그로 관찰한다.

## Visual AC

- 해당 없음(체크리스트 문서).

## Security/Privacy AC

- 모든 비밀키가 Vercel 환경변수로만 관리되는지 확인한다(REQ-NF-016).

## Test Cases

- 체크리스트 항목별 수동 확인.

## Verify

수동 배포 점검.

## Definition of Done

- 체크리스트 전 항목 확인 완료.

## Forbidden

- EC2·AWS 등 별도 인프라를 구성하지 않는다.
- Airbnb 상표/로고/색상(Rausch #ff385c 등)을 사용하지 않는다.
- 예약·결제 UI, 별점, 광고, 실시간 가격 표시를 추가하지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구를 남기지 않는다.
- Expected Files 목록 밖의 파일을 생성·수정하지 않는다.
- EC2·AWS 등 별도 인프라 구성, 무인 자동 Merge/Merge Runner를 만들지 않는다.
