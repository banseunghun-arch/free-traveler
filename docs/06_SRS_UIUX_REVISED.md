# Free Traveler — SRS UI/UX Revised Mapping (06_SRS_UIUX_REVISED)

| 항목 | 내용 |
|---|---|
| Document ID | SRSREV-TRAVEL-001 |
| 기준 문서 | `docs/02_SRS_BASELINE.md`(원본, 변경 없음), `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md` |
| 목적 | REQ-FUNC-001~080, REQ-NF-001~034 **114개 전부**를 승인된 5개 Screen(Route) 구조에 재매핑한다 |
| 작성일 | 2026-09-19 |
| 상태 | Revised — Requirement 삭제 없음 |

> 이 문서는 `docs/02_SRS_BASELINE.md`의 원문을 대체하지 않는다. 원문 요구사항 텍스트는 그대로 유지되며, 이 문서는 "그 요구사항이 어느 Screen/Route에서 어떤 형태로 구현되는가"만 개정한다. 행 단위 상세 추적(Task, Test, 구현 Status)은 `docs/UIUX_TRACEABILITY.md`를 참조한다.

---

## 1. 5-Screen 구조 확정

| Screen | Route | 통합된 기존 Route |
|---|---|---|
| SCR-001 | `/` | `/destinations/*`, `/safety/*` |
| SCR-002 | `/about` | (신규 통합 없음, 기존 그대로) |
| SCR-003 | `/travel-tools` | `/flights`, `/hotels`, `/mates/new` |
| SCR-004 | `/mates` | (목록·상세만, 작성은 SCR-003으로 이동) |
| SCR-005 | `/account` | `/auth/*`, `/my/*`, `/admin/*` |

---

## 2. F1 — Destination Guide (REQ-FUNC-001~010)

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 목록 구분 표시 | IMPLEMENT | SCR-001 `/` |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | IMPLEMENT | SCR-001 `/` |
| REQ-FUNC-003 | 키워드 검색 | IMPLEMENT | SCR-001 `/` |
| REQ-FUNC-004 | 상세 필수 콘텐츠 항목 표시 | IMPLEMENT | SCR-001 `/` (상세 Drawer) |
| REQ-FUNC-005 | 결과 없음 안내·초기화 | IMPLEMENT | SCR-001 `/` |
| REQ-FUNC-006 | 해외 여행지 ↔ 안전정보 연결 | IMPLEMENT | SCR-001 `/` (Drawer 전환) |
| REQ-FUNC-007 | 대표 이미지 alt(축소: 출처·작가·라이선스 제외) | IMPLEMENT(축소) | SCR-001 `/` |
| REQ-FUNC-008 | 국내 10곳·해외 15개국 30개 도시 수량 검증 | IMPLEMENT | 해당없음(비UI, OPERATIONS) |
| REQ-FUNC-009 | 관련 여행지 추천 최대 6개 | IMPLEMENT | SCR-001 `/` (상세 Drawer 하단) |
| REQ-FUNC-010 | 필터 상태 URL 반영·복원 | **EXCLUDED** | 해당없음(제외 기능) |

## 3. F2 — Flight Link-out (REQ-FUNC-011~018)

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-FUNC-011 | 국가·지역·출발일·귀국일 필수 입력 | IMPLEMENT | SCR-003 `/travel-tools` (항공편 탭) |
| REQ-FUNC-012 | 국가에 속한 지역만 선택 | IMPLEMENT | SCR-003 `/travel-tools` |
| REQ-FUNC-013 | 과거·역전 날짜 차단 | IMPLEMENT | SCR-003 `/travel-tools` |
| REQ-FUNC-014 | 요약 단계 표시 | IMPLEMENT | SCR-003 `/travel-tools` |
| REQ-FUNC-015 | 비전달 고지 문구 | IMPLEMENT | SCR-003 `/travel-tools` |
| REQ-FUNC-016 | 외부 일반 URL 새 탭 이동 | IMPLEMENT | SCR-003 `/travel-tools` |
| REQ-FUNC-017 | 입력값 서버 미저장 | IMPLEMENT | 해당없음(비UI) |
| REQ-FUNC-018 | URL 오류 시 이동 차단·재시도 | IMPLEMENT | SCR-003 `/travel-tools` |

## 4. F3 — Hotel Link-out (REQ-FUNC-019~026)

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-FUNC-019 | 국가·지역·체크인·체크아웃 필수 입력 | IMPLEMENT | SCR-003 `/travel-tools` (숙소 탭) |
| REQ-FUNC-020 | 국가에 속한 지역만 선택 | IMPLEMENT | SCR-003 `/travel-tools` |
| REQ-FUNC-021 | 과거/역전/동일 날짜 차단 | IMPLEMENT | SCR-003 `/travel-tools` |
| REQ-FUNC-022 | 요약 표시 | IMPLEMENT | SCR-003 `/travel-tools` |
| REQ-FUNC-023 | 비전달 고지 문구 | IMPLEMENT | SCR-003 `/travel-tools` |
| REQ-FUNC-024 | 외부 일반 URL 새 탭 이동 | IMPLEMENT | SCR-003 `/travel-tools` |
| REQ-FUNC-025 | 입력값 서버 미저장 | IMPLEMENT | 해당없음(비UI) |
| REQ-FUNC-026 | URL 오류 시 이동 차단·재시도 | IMPLEMENT | SCR-003 `/travel-tools` |

## 5. F4 — Travel Mate (REQ-FUNC-027~045)

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-FUNC-027 | 쓰기 작업에 이메일 인증 세션 요구 | IMPLEMENT | 해당없음(비UI) |
| REQ-FUNC-028 | 성인 확인 요구, 생년월일 미저장 | IMPLEMENT | 해당없음(비UI) |
| REQ-FUNC-029 | 동행 프로필(닉네임·연령대·성별·스타일·소개) | IMPLEMENT | SCR-005 `/account` (Member 탭) |
| REQ-FUNC-030 | 조건별 동행글 필터(차단 사용자 제외) | IMPLEMENT | SCR-004 `/mates` |
| REQ-FUNC-031 | 모집글 작성 필수 필드·검증 | IMPLEMENT | SCR-003 `/travel-tools` (동행 탭) |
| REQ-FUNC-032 | 공개 연락처 패턴 탐지 | IMPLEMENT | SCR-003 `/travel-tools` (동행 탭) |
| REQ-FUNC-033 | 연락처 비노출 | IMPLEMENT | 해당없음(비UI) |
| REQ-FUNC-034 | 참가 메시지(500자) 비공개 제출 | IMPLEMENT | SCR-004 `/mates` (상세 패널) |
| REQ-FUNC-035 | 중복 PENDING/ACCEPTED 요청 차단 | IMPLEMENT | SCR-004 `/mates` |
| REQ-FUNC-036 | 작성자 승인·거절 | IMPLEMENT | SCR-005 `/account` (Member 탭) |
| REQ-FUNC-037 | 종료일 경과 시 자동 마감 | IMPLEMENT | SCR-004 `/mates` |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | IMPLEMENT | SCR-005 `/account` (Member 탭) |
| REQ-FUNC-039 | 글·사용자·요청 신고 | IMPLEMENT | SCR-004 `/mates` |
| REQ-FUNC-040 | 사용자 차단·해제 | IMPLEMENT | SCR-004 `/mates` (트리거) / SCR-005 `/account` (목록 관리) |
| REQ-FUNC-041 | 신고 큐(상태별 필터) | IMPLEMENT | SCR-005 `/account` (Admin 탭) |
| REQ-FUNC-042 | 신고 처리 조치 기록 | IMPLEMENT(축소) | SCR-005 `/account` (Admin 탭) |
| REQ-FUNC-043 | 참가/신고 처리 결과 알림 | IMPLEMENT(축소) | SCR-004 `/mates`, SCR-005 `/account` |
| REQ-FUNC-044 | RLS로 비공개 데이터 접근 제한 | IMPLEMENT | 해당없음(비UI) |
| REQ-FUNC-045 | 탈퇴 시 프로필 비식별화·개인정보 삭제 | **EXCLUDED** | 해당없음(제외 기능) |

## 6. F5 — Country Safety (REQ-FUNC-046~056)

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-FUNC-046 | 게시 해외 국가 전체 안전 페이지 보유 | IMPLEMENT | 해당없음(비UI, OPERATIONS) |
| REQ-FUNC-047 | 8개 필수 안전 카테고리 | IMPLEMENT | SCR-001 `/` (안전정보 Drawer) |
| REQ-FUNC-048 | 출처명·URL·확인일·편집자 기록 | IMPLEMENT | SCR-001 `/` |
| REQ-FUNC-049 | 외교부 원문 새 탭 링크 | IMPLEMENT | SCR-001 `/` |
| REQ-FUNC-050 | 7일 초과 stale 경고 | IMPLEMENT | SCR-001 `/` |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | IMPLEMENT | SCR-001 `/` |
| REQ-FUNC-052 | 국가/지역 경보 범위 구분 | IMPLEMENT | SCR-001 `/` |
| REQ-FUNC-053 | 긴급연락처(현지·영사콜센터) | IMPLEMENT | SCR-001 `/` |
| REQ-FUNC-054 | 공식 판단 비대체 고지 | IMPLEMENT | SCR-001 `/`, SCR-003 `/travel-tools` |
| REQ-FUNC-055 | Editor/Admin 안전 콘텐츠 CRUD 워크플로 | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-FUNC-056 | 안전정보 변경 이력 보존 | **EXCLUDED** | 해당없음(제외 기능) |

## 7. F6 — About free_traveler (REQ-FUNC-057~063)

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-FUNC-057 | 대표명·50+ Trips·30+ Countries 표시 | IMPLEMENT | SCR-002 `/about` |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 표시 | IMPLEMENT | SCR-002 `/about` |
| REQ-FUNC-059 | 방문 권역 지도/국가 목록 | IMPLEMENT | SCR-002 `/about` |
| REQ-FUNC-060 | 여행 타임라인 | IMPLEMENT | SCR-002 `/about` |
| REQ-FUNC-061 | 대표 이미지 메타데이터(축소) | IMPLEMENT(축소) | SCR-002 `/about` |
| REQ-FUNC-062 | 문의·SNS 링크 | IMPLEMENT(축소) | SCR-002 `/about` |
| REQ-FUNC-063 | 추천 여행지 6개 연결 | IMPLEMENT | SCR-002 `/about` |

## 8. F7 — Common, Admin, Governance (REQ-FUNC-064~080)

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-FUNC-064 | 전역 내비게이션·푸터 | IMPLEMENT | 전역(5개 Screen 공통, `layout.tsx`) |
| REQ-FUNC-065 | 320px~데스크톱 반응형 | IMPLEMENT | 전역(공통) |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | IMPLEMENT | SCR-005 `/account` (Guest 탭) |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | IMPLEMENT | SCR-001 `/` |
| REQ-FUNC-068 | 여행지 즐겨찾기 | IMPLEMENT | SCR-001 `/` (추가), SCR-005 `/account` (목록 관리) |
| REQ-FUNC-069 | URL 공유 | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-FUNC-070 | 공개 페이지 SEO 메타데이터 | IMPLEMENT | 해당없음(비UI) |
| REQ-FUNC-071 | 제한된 속성의 행동 분석 이벤트 | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-FUNC-072 | Editor/Admin 여행지 콘텐츠 CRUD | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-FUNC-073 | 미디어 업로드 메타데이터 필수 | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | IMPLEMENT(축소) | 해당없음(비UI) |
| REQ-FUNC-075 | 안전정보 stale 대시보드 | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-FUNC-076 | 관리자 변경·신고 처리 감사 로그 | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-FUNC-077 | 외부 URL 허용목록·HTTPS 설정 | IMPLEMENT | SCR-005 `/account` (Admin 탭) |
| REQ-FUNC-078 | 404/500/권한없음/외부연결실패 복구 행동 | IMPLEMENT | 기술 Route(5개 Screen 외) |
| REQ-FUNC-079 | 폼·모달·탭·알림의 ARIA/시맨틱 처리 | IMPLEMENT | 전역(공통) |
| REQ-FUNC-080 | 약관·정책·안전수칙 고지 및 동의 기록 | IMPLEMENT | SCR-003 `/travel-tools` (동행 탭 동의) |

## 9. 비기능 요구사항 — 성능 (REQ-NF-001~007)

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-NF-001 | LCP p75 ≤2.5s | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-002 | INP p75 ≤200ms | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-003 | CLS p75 ≤0.1 | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-004 | 필터 응답 p95≤1s(동시 50명) | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-NF-005 | 쓰기 API p95≤3s | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-006 | 이미지 반응형·lazy load | IMPLEMENT | 전역(공통) |
| REQ-NF-007 | Lighthouse CI 성능 예산 | **EXCLUDED** | 해당없음(제외 기능) |

## 10. 비기능 요구사항 — 신뢰성·복구 (REQ-NF-008~011) — 전부 EXCLUDED

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-NF-008 | 월간 가용성 ≥99.5% | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-NF-009 | 내부 API 5xx ≤0.5% | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-NF-010 | DB 백업 RPO/RTO | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-NF-011 | 외부/공식 링크 주1회 자동 검사·Admin 알림 | **EXCLUDED** | 해당없음(제외 기능) |

## 11. 비기능 요구사항 — 보안·개인정보 (REQ-NF-012~018)

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-NF-012 | TLS 1.2 이상 | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-014 | CSRF 방어·SameSite 쿠키 | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-015 | 입력 검증·XSS 차단 | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-016 | 비밀키 환경변수 관리 | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-017 | 항공·호텔 원시 입력값 미보존 | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-018 | 개인정보 내보내기·탈퇴·삭제 요청 | **EXCLUDED** | 해당없음(제외 기능) |

## 12. 비기능 요구사항 — 안전·모더레이션 (REQ-NF-019~022)

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-NF-019 | 신고 접수 응답 p95≤3s | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-020 | 신고 1차 검토 24h 이내 90% | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-NF-021 | 글·요청·신고 속도 제한(429) | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-NF-022 | Moderator 조치 추적(감사 로그) | **EXCLUDED** | 해당없음(제외 기능) |

## 13. 비기능 요구사항 — 접근성 (REQ-NF-023~025)

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-NF-023 | WCAG 2.2 Level AA 목표 | IMPLEMENT | 전역(공통) |
| REQ-NF-024 | 자동 접근성 검사(axe) | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | IMPLEMENT | 해당없음(비UI) |

## 14. 비기능 요구사항 — 콘텐츠·최신성·SEO·저작권 (REQ-NF-026~030)

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-027 | 해외 안전정보 커버리지 100% | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-028 | 안전정보 7일 이내 확인 95%·초과 경고 100% | IMPLEMENT(부분) | SCR-001 `/` |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-NF-030 | 공개 페이지 SEO 메타데이터 누락 0 | IMPLEMENT | 해당없음(비UI) |

## 15. 비기능 요구사항 — 유지보수·모니터링·비용 (REQ-NF-031~034)

| ID | 요약 | PROJECT_SCOPE | Screen / Route |
|---|---|---|---|
| REQ-NF-031 | TypeScript strict·lint·unit test | IMPLEMENT | 해당없음(비UI) |
| REQ-NF-032 | 구조화 로그 | IMPLEMENT(축소) | 해당없음(비UI) |
| REQ-NF-033 | 핵심 오류 5분 이내 알림 | **EXCLUDED** | 해당없음(제외 기능) |
| REQ-NF-034 | 월 인프라 비용 10만원 이하 | IMPLEMENT | 해당없음(비UI) |

---

## 16. 검증

| 구분 | 개수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **합계(삭제 없음 확인)** | **114** |
| EXCLUDED | 22 (REQ-FUNC: 010,045,055,056,069,071,072,073,075,076 / REQ-NF: 004,007,008,009,010,011,018,020,021,022,029,033) |
| IMPLEMENT 계열(IMPLEMENT/축소/부분) | 92 |

모든 REQ ID가 2~15절에 정확히 1회씩 등장하며, 어떤 항목도 삭제되지 않았다. 행 단위 Task/Test/구현 Status는 `docs/UIUX_TRACEABILITY.md`를 따른다.
