# Free Traveler — UI/UX Traceability Matrix

| 항목 | 내용 |
|---|---|
| Document ID | TRACE-TRAVEL-001 |
| 기준 문서 | `docs/02_SRS_BASELINE.md`, `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/06_SRS_UIUX_REVISED.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json` |
| 작성일 | 2026-09-19 |
| 범위 | REQ-FUNC-001~080, REQ-NF-001~034 (총 114개, 전수) |

**열 정의**
- **Requirement**: 원본 SRS ID (`docs/02_SRS_BASELINE.md` 기준, 변경 없음)
- **Implementation Status**: `docs/PROJECT_SCOPE.md`의 범위 결정(IMPLEMENT / IMPLEMENT(축소) / IMPLEMENT(부분) / EXCLUDED)
- **Screen**: 승인된 5개 Screen 중 배치 위치, 또는 해당없음(비UI)/해당없음(제외 기능)/전역(공통)/기술 Route
- **Route**: Screen의 Next.js 라우트(해당 없으면 `N/A`)
- **Page Entry**: 라우트의 실제 파일 경로(해당 없으면 `N/A`)
- **Task**: 구현 Task ID. Task가 아직 생성되지 않았으므로 전 행 `PENDING_TASK_GENERATION`
- **Test**: 검증 방법(`docs/PROJECT_SCOPE.md` "확인 방법" 그대로)
- **Status**: 현재 실제 빌드 상태. **`src/app`에 create-next-app 기본 스타터 외 구현 코드가 없으므로, EXCLUDED가 아닌 모든 행은 정직하게 `NOT_STARTED`로 기록한다.** 구현 완료를 허위로 기록하지 않는다.

---

## F1 — Destination Guide (REQ-FUNC-001~010)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 탭 전환 시 목록 구성 검증 | NOT_STARTED |
| REQ-FUNC-002 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 복수 필터 조합 결과 확인 | NOT_STARTED |
| REQ-FUNC-003 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 검색어/결과 없음 케이스 확인 | NOT_STARTED |
| REQ-FUNC-004 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 유닛 테스트(데이터 스키마 검증) | NOT_STARTED |
| REQ-FUNC-005 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 빈 결과 시나리오 확인 | NOT_STARTED |
| REQ-FUNC-006 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 상세→안전정보 Drawer 전환 확인 | NOT_STARTED |
| REQ-FUNC-007 | IMPLEMENT(축소) | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 데이터 스키마 검증(alt 필수 체크) | NOT_STARTED |
| REQ-FUNC-008 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 유닛 테스트(수량 검증) | NOT_STARTED |
| REQ-FUNC-009 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 상세 페이지 추천 영역 확인 | NOT_STARTED |
| REQ-FUNC-010 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(URL 동기화 로직 부재 확인) | EXCLUDED |

## F2 — Flight Link-out (REQ-FUNC-011~018)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-011 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 필드 렌더링·오류 표시 확인 | NOT_STARTED |
| REQ-FUNC-012 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 국가 변경 시 지역값 리셋 확인 | NOT_STARTED |
| REQ-FUNC-013 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 유닛 테스트 + Playwright 경계값 확인 | NOT_STARTED |
| REQ-FUNC-014 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 폼→요약 이동·값 유지 확인 | NOT_STARTED |
| REQ-FUNC-015 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 문구 노출 확인 | NOT_STARTED |
| REQ-FUNC-016 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 새 탭·URL 무쿼리 확인 | NOT_STARTED |
| REQ-FUNC-017 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(서버 저장 로직 부재) + 네트워크 탭 확인 | NOT_STARTED |
| REQ-FUNC-018 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: URL 미설정 시나리오 확인 | NOT_STARTED |

## F3 — Hotel Link-out (REQ-FUNC-019~026)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-019 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 필드·오류 표시 확인 | NOT_STARTED |
| REQ-FUNC-020 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 지역값 리셋 확인 | NOT_STARTED |
| REQ-FUNC-021 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 유닛 테스트 + Playwright 경계값 확인 | NOT_STARTED |
| REQ-FUNC-022 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 요약값 일치 확인 | NOT_STARTED |
| REQ-FUNC-023 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 문구 노출 확인 | NOT_STARTED |
| REQ-FUNC-024 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 새 탭·URL 확인 | NOT_STARTED |
| REQ-FUNC-025 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 + 네트워크 탭 확인 | NOT_STARTED |
| REQ-FUNC-026 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: URL 오류 시나리오 확인 | NOT_STARTED |

## F4 — Travel Mate (REQ-FUNC-027~045)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-027 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 통합 테스트: 비회원 POST 차단 확인 | NOT_STARTED |
| REQ-FUNC-028 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 통합 테스트: 스키마·정책 확인 | NOT_STARTED |
| REQ-FUNC-029 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 프로필 작성 흐름 확인 | NOT_STARTED |
| REQ-FUNC-030 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 필터·차단 제외 확인 | NOT_STARTED |
| REQ-FUNC-031 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright + 유닛 테스트 | NOT_STARTED |
| REQ-FUNC-032 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 유닛 테스트: 탐지율 기준 테스트셋 | NOT_STARTED |
| REQ-FUNC-033 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 통합 테스트: 응답 페이로드 검사 | NOT_STARTED |
| REQ-FUNC-034 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright + RLS 정책 검토 | NOT_STARTED |
| REQ-FUNC-035 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 통합 테스트: 중복 요청 시나리오 | NOT_STARTED |
| REQ-FUNC-036 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright + 통합 테스트: 비작성자 403 | NOT_STARTED |
| REQ-FUNC-037 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 유닛 테스트: 날짜 경계 계산 | NOT_STARTED |
| REQ-FUNC-038 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 마감/수정/삭제 흐름 | NOT_STARTED |
| REQ-FUNC-039 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 신고 제출 흐름 | NOT_STARTED |
| REQ-FUNC-040 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright + 통합 테스트: 노출 제한 확인 | NOT_STARTED |
| REQ-FUNC-041 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 관리자 신고 큐 필터 확인 | NOT_STARTED |
| REQ-FUNC-042 | IMPLEMENT(축소) | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | 통합 테스트: 상태 변경 필드 확인 | NOT_STARTED |
| REQ-FUNC-043 | IMPLEMENT(축소) | SCR-004, SCR-005 | `/mates`, `/account` | `src/app/mates/page.tsx`, `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 상태 변경 시 Toast 노출 확인 | NOT_STARTED |
| REQ-FUNC-044 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 통합 테스트: 권한별 부정 접근 시도 | NOT_STARTED |
| REQ-FUNC-045 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(자동 삭제 배치 부재 확인) | EXCLUDED |

## F5 — Country Safety (REQ-FUNC-046~056)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-046 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 유닛 테스트: 국가 커버리지 검증 | NOT_STARTED |
| REQ-FUNC-047 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 데이터 스키마 검증 | NOT_STARTED |
| REQ-FUNC-048 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 데이터 스키마 검증 + Playwright | NOT_STARTED |
| REQ-FUNC-049 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 링크 속성·새 탭 확인 | NOT_STARTED |
| REQ-FUNC-050 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: stale 케이스 렌더링 확인 | NOT_STARTED |
| REQ-FUNC-051 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 경보 단계별 렌더링 확인 | NOT_STARTED |
| REQ-FUNC-052 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 데이터 스키마 검증 | NOT_STARTED |
| REQ-FUNC-053 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 연락처 섹션 노출 확인 | NOT_STARTED |
| REQ-FUNC-054 | IMPLEMENT | SCR-001, SCR-003 | `/`, `/travel-tools` | `src/app/page.tsx`, `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 고지 문구 노출 확인 | NOT_STARTED |
| REQ-FUNC-055 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(전용 편집 UI 부재 확인) | EXCLUDED |
| REQ-FUNC-056 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(Git 이력으로 대체 확인) | EXCLUDED |

## F6 — About free_traveler (REQ-FUNC-057~063)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-057 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 페이지 간 수치 일치 확인 | NOT_STARTED |
| REQ-FUNC-058 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 텍스트 노출 확인 | NOT_STARTED |
| REQ-FUNC-059 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | 데이터 검증(국가 수 ≥30) | NOT_STARTED |
| REQ-FUNC-060 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 타임라인 항목 확인 | NOT_STARTED |
| REQ-FUNC-061 | IMPLEMENT(축소) | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | 데이터 스키마 검증(alt 필수) | NOT_STARTED |
| REQ-FUNC-062 | IMPLEMENT(축소) | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 링크 노출/숨김 확인 | NOT_STARTED |
| REQ-FUNC-063 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 추천 링크 유효성 확인 | NOT_STARTED |

## F7 — Common, Admin, Governance (REQ-FUNC-064~080)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-064 | IMPLEMENT | 전역(공통) | 전체 공통 | `src/app/layout.tsx` | PENDING_TASK_GENERATION | Playwright: 전 페이지 내비게이션 노출 확인 | NOT_STARTED |
| REQ-FUNC-065 | IMPLEMENT | 전역(공통) | 전체 공통 | `src/app/layout.tsx` | PENDING_TASK_GENERATION | Playwright: 뷰포트별 스크린샷/레이아웃 확인 | NOT_STARTED |
| REQ-FUNC-066 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 가입~로그아웃 전 과정 확인 | NOT_STARTED |
| REQ-FUNC-067 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 통합 검색 결과 확인 | NOT_STARTED |
| REQ-FUNC-068 | IMPLEMENT | SCR-001, SCR-005 | `/`, `/account` | `src/app/page.tsx`, `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 즐겨찾기 추가/해제 확인 | NOT_STARTED |
| REQ-FUNC-069 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(공유 버튼 부재 확인) | EXCLUDED |
| REQ-FUNC-070 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 자동 메타 검사 스크립트 | NOT_STARTED |
| REQ-FUNC-071 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(분석 SDK 미포함 확인) | EXCLUDED |
| REQ-FUNC-072 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(CRUD UI 부재 확인) | EXCLUDED |
| REQ-FUNC-073 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(업로드 기능 부재 확인) | EXCLUDED |
| REQ-FUNC-074 | IMPLEMENT(축소) | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 유닛 테스트: 완전성 검증 스크립트 | NOT_STARTED |
| REQ-FUNC-075 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(대시보드 부재 확인) | EXCLUDED |
| REQ-FUNC-076 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(AUDIT_LOG 부재 확인) | EXCLUDED |
| REQ-FUNC-077 | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 잘못된 URL 저장 차단 확인 | NOT_STARTED |
| REQ-FUNC-078 | IMPLEMENT | 기술 Route | 기술 Route | N/A | PENDING_TASK_GENERATION | Playwright: 각 오류 상황 진입 확인 | NOT_STARTED |
| REQ-FUNC-079 | IMPLEMENT | 전역(공통) | 전체 공통 | `src/app/layout.tsx` | PENDING_TASK_GENERATION | axe 자동 검사(Playwright 통합) + 키보드 수동 확인 | NOT_STARTED |
| REQ-FUNC-080 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 동의 없이 제출 차단 확인 | NOT_STARTED |

## NF — 성능 (REQ-NF-001~007)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-001 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 수동 Lighthouse 점검 | NOT_STARTED |
| REQ-NF-002 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 수동 Lighthouse 점검 | NOT_STARTED |
| REQ-NF-003 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 수동 Lighthouse 점검 | NOT_STARTED |
| REQ-NF-004 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(부하 테스트 미구성 확인) | EXCLUDED |
| REQ-NF-005 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | Playwright 실행 로그의 응답시간 관찰 | NOT_STARTED |
| REQ-NF-006 | IMPLEMENT | 전역(공통) | 전체 공통 | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 코드 리뷰 | NOT_STARTED |
| REQ-NF-007 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(CI 게이트 미구성 확인) | EXCLUDED |

## NF — 신뢰성·복구 (REQ-NF-008~011)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-008 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(모니터링 부재 확인) | EXCLUDED |
| REQ-NF-009 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(모니터링 부재 확인) | EXCLUDED |
| REQ-NF-010 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(별도 백업 체계 부재 확인) | EXCLUDED |
| REQ-NF-011 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(자동 점검 잡 부재 확인) | EXCLUDED |

## NF — 보안·개인정보 (REQ-NF-012~018)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-012 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 배포 설정 확인 | NOT_STARTED |
| REQ-NF-013 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 통합 테스트: 권한별 부정 접근 | NOT_STARTED |
| REQ-NF-014 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 통합 테스트: CSRF 시나리오 | NOT_STARTED |
| REQ-NF-015 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 통합 테스트: XSS 페이로드 검증 | NOT_STARTED |
| REQ-NF-016 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 빌드 산출물 검사 | NOT_STARTED |
| REQ-NF-017 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 네트워크·코드 리뷰 | NOT_STARTED |
| REQ-NF-018 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(파이프라인 부재 확인) | EXCLUDED |

## NF — 안전·모더레이션 (REQ-NF-019~022)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-019 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | Playwright: 신고 제출 응답시간 관찰 | NOT_STARTED |
| REQ-NF-020 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(운영 지표는 범위 밖 명시) | EXCLUDED |
| REQ-NF-021 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(rate limit 미구현 확인) | EXCLUDED |
| REQ-NF-022 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(레코드 필드 확인) | EXCLUDED |

## NF — 접근성 (REQ-NF-023~025)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-023 | IMPLEMENT | 전역(공통) | 전체 공통 | `src/app/layout.tsx` | PENDING_TASK_GENERATION | axe 자동 검사 + 수동 점검 | NOT_STARTED |
| REQ-NF-024 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | Playwright(axe) 스모크 테스트 | NOT_STARTED |
| REQ-NF-025 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 수동 QA 체크리스트 | NOT_STARTED |

## NF — 콘텐츠·최신성·SEO·저작권 (REQ-NF-026~030)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-026 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 유닛 테스트 | NOT_STARTED |
| REQ-NF-027 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 유닛 테스트 | NOT_STARTED |
| REQ-NF-028 | IMPLEMENT(부분) | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: stale 경고 렌더링 확인 | NOT_STARTED |
| REQ-NF-029 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(라이선스 필드 부재 확인) | EXCLUDED |
| REQ-NF-030 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 자동 메타 검사 스크립트 | NOT_STARTED |

## NF — 유지보수·모니터링·비용 (REQ-NF-031~034)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-031 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | CI(lint/build/test) 실행 | NOT_STARTED |
| REQ-NF-032 | IMPLEMENT(축소) | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(로그 출력 형식 확인) | NOT_STARTED |
| REQ-NF-033 | EXCLUDED | 해당없음(제외 기능) | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(알림 연동 부재 확인) | EXCLUDED |
| REQ-NF-034 | IMPLEMENT | 해당없음(비UI) | N/A | N/A | PENDING_TASK_GENERATION | 배포 구성·요금제 확인 | NOT_STARTED |

---

## 검증 요약

| 구분 | 개수 |
|---|---:|
| 전체 Requirement | 114 |
| EXCLUDED | 22 |
| IMPLEMENT 계열(Status=NOT_STARTED) | 92 |
| 구현 완료(Status=DONE)로 기록된 항목 | **0** — 현재 `src/app`에 실제 구현 코드가 없으므로 정직하게 0건 |
| Task가 생성된 항목 | **0** — 전 행 `PENDING_TASK_GENERATION` |

이 매트릭스는 `docs/02_SRS_BASELINE.md`의 114개 요구사항을 하나도 삭제하지 않고 전수 포함한다. Task 생성 후에는 해당 행의 `Task` 열만 실제 Task ID로 갱신하고, 코드 구현이 실제로 완료된 행만 `Status`를 `DONE`으로 갱신한다(허위 기록 금지).
