# Free Traveler — UI Coverage Analysis (03_UI_COVERAGE_ANALYSIS)

| 항목 | 내용 |
|---|---|
| Document ID | UICOV-TRAVEL-001 |
| 기준 문서 | `docs/01_PRD.md`, `docs/02_SRS_BASELINE.md`, `docs/PROJECT_SCOPE.md` |
| 작성일 | 2026-09-11 |
| 상태 | UI Coverage Baseline (04_UIUX_PLAN 선행 문서) |

---

## 1. 문서 목적

`docs/02_SRS_BASELINE.md`의 REQ-FUNC-001~080, REQ-NF-001~034 전 항목(114개)을 하나도 빠짐없이 추출하고, 각 항목을 UI 성격(UI_DIRECT/UI_STATE/NON_UI/OPERATIONS)과 `docs/PROJECT_SCOPE.md`의 구현 상태(IMPLEMENT/EXCLUDED)에 따라 정확히 5개의 고정 디자인 Screen에 배치한다. 이 문서는 `docs/04_UIUX_PLAN.md`보다 먼저 존재했어야 할 선행 산출물이며, 이번 작성으로 두 문서의 Screen·라우트 정의를 통일하는 기준이 된다.

### 1.1 분류 기준

| 분류 | 정의 |
|---|---|
| **UI_DIRECT** | 화면에 직접 렌더링되는 콘텐츠·구조·입력 요소를 정의하는 요구사항 |
| **UI_STATE** | 상호작용·시간 경과에 따라 화면 상태(Loading/Empty/Error/Unauthorized/경고 등)가 바뀌는 것을 정의하는 요구사항 |
| **NON_UI** | 화면에 직접 드러나지 않는 서버·보안·데이터 저장·정책 요구사항 |
| **OPERATIONS** | 화면이 아니라 콘텐츠 검수·테스트·배포·비용 등 운영·개발 프로세스에 해당하는 요구사항 |

UI_DIRECT·UI_STATE 항목만 5개 Screen 중 하나(또는 전역 공통)에 배치한다. NON_UI·OPERATIONS 항목과 EXCLUDED 항목은 배치 Screen을 "해당없음"으로 표기한다(제외 기능을 화면에 임의로 복원하지 않는다).

---

## 2. 5개 디자인 Screen 고정

| Screen | 라우트 | 배치 원칙 |
|---|---|---|
| **SCR-001** | `/` (홈) | 여행지 탐색(목록·필터·검색)과 여행지·안전정보 상세를 Drawer/Modal로 포함하는 발견 허브 |
| **SCR-002** | `/about` (대표 소개) | free_traveler 소개 전용 |
| **SCR-003** | `/travel-tools` (통합 여행 준비) | 항공·숙소·동행 "작성"을 3개 탭으로 배치 |
| **SCR-004** | `/mates` (동행 찾기) | 동행글 목록·필터와 상세 패널(신청 포함) |
| **SCR-005** | `/account` (계정·관리) | 로그인·프로필·내 활동·간단 관리자를 탭으로 배치 |

API Route, 인증 콜백, 404/500 등 오류 처리 라우트는 기술 Route로 취급하며 핵심 디자인 Screen 수(5개)에 포함하지 않는다(REQ-FUNC-078은 예외적으로 아래 표에 "기술 Route" 배치로 별도 표기한다).

> **라우트 변경 확정**: `docs/PROJECT_SCOPE.md`(2절)의 `/destinations/*`, `/flights`, `/hotels`, `/safety/*`, `/auth/*`, `/my/*`, `/admin/*`, `/mates/new`는 이 문서의 5-Screen 고정 모델로 흡수된다. 여행지·안전 상세는 SCR-001의 Drawer/Modal로, 항공·숙소·동행 작성은 SCR-003의 탭으로, 로그인·내 활동·관리자는 SCR-005의 탭으로 대체된다.

---

## 3. 요구사항 커버리지 표

> 열 구성: ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 상태 | 배치 Screen | 비고

### 3.1 F1 — Destination Guide (REQ-FUNC-001~010)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 목록 구분 표시 | UI_DIRECT | IMPLEMENT | SCR-001 | 메인 탐색 결과 탭 |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | UI_DIRECT | IMPLEMENT | SCR-001 | 별도 목록 화면 없이 메인 내 필터 패널 |
| REQ-FUNC-003 | 키워드 검색 | UI_DIRECT | IMPLEMENT | SCR-001 | 검색 Hero |
| REQ-FUNC-004 | 상세 필수 콘텐츠 항목 표시 | UI_DIRECT | IMPLEMENT | SCR-001 | 여행지 상세 Drawer/Modal |
| REQ-FUNC-005 | 결과 없음 안내·초기화 | UI_STATE | IMPLEMENT | SCR-001 | Empty 상태 |
| REQ-FUNC-006 | 해외 여행지 ↔ 안전정보 연결 | UI_DIRECT | IMPLEMENT | SCR-001 | 여행지 Drawer 내 안전정보 Drawer 전환 |
| REQ-FUNC-007 | 대표 이미지 alt·출처·작가·라이선스 | UI_DIRECT | IMPLEMENT(축소) | SCR-001 | alt만 필수(5절 정책) |
| REQ-FUNC-008 | 국내 10곳·해외 15개국 30개 도시 수량 검증 | OPERATIONS | IMPLEMENT | 해당없음(비UI) | 데이터 검증 스크립트, 화면 요소 아님 |
| REQ-FUNC-009 | 관련 여행지 추천 최대 6개 | UI_DIRECT | IMPLEMENT | SCR-001 | 상세 Drawer 하단 |
| REQ-FUNC-010 | 필터 상태 URL 반영·복원 | UI_STATE | EXCLUDED | 해당없음(제외 기능) | 화면 배치하지 않음 |

### 3.2 F2 — Flight Link-out (REQ-FUNC-011~018)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-011 | 국가·지역·출발일·귀국일 필수 입력 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 Form |
| REQ-FUNC-012 | 국가에 속한 지역만 선택 | UI_STATE | IMPLEMENT | SCR-003 | 항공 탭 Form 상태 |
| REQ-FUNC-013 | 과거·역전 날짜 차단 | UI_STATE | IMPLEMENT | SCR-003 | Validating 상태 |
| REQ-FUNC-014 | 요약 단계 표시 | UI_STATE | IMPLEMENT | SCR-003 | Form→Summary 상태 전환 |
| REQ-FUNC-015 | 비전달 고지 문구 | UI_DIRECT | IMPLEMENT | SCR-003 | 고정 안내 문구 |
| REQ-FUNC-016 | 외부 일반 URL 새 탭 이동 | UI_DIRECT | IMPLEMENT | SCR-003 | Action Card 버튼 |
| REQ-FUNC-017 | 입력값 서버 미저장 | NON_UI | IMPLEMENT | 해당없음(비UI) | 백엔드 정책, 화면 문구는 015가 담당 |
| REQ-FUNC-018 | URL 오류 시 이동 차단·재시도 | UI_STATE | IMPLEMENT | SCR-003 | Error 상태 |

### 3.3 F3 — Hotel Link-out (REQ-FUNC-019~026)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-019 | 국가·지역·체크인·체크아웃 필수 입력 | UI_DIRECT | IMPLEMENT | SCR-003 | 숙소 탭 Form |
| REQ-FUNC-020 | 국가에 속한 지역만 선택 | UI_STATE | IMPLEMENT | SCR-003 | 숙소 탭 Form 상태 |
| REQ-FUNC-021 | 과거/역전/동일 날짜 차단 | UI_STATE | IMPLEMENT | SCR-003 | Validating 상태 |
| REQ-FUNC-022 | 요약 표시 | UI_STATE | IMPLEMENT | SCR-003 | Form→Summary 상태 전환 |
| REQ-FUNC-023 | 비전달 고지 문구 | UI_DIRECT | IMPLEMENT | SCR-003 | 고정 안내 문구 |
| REQ-FUNC-024 | 외부 일반 URL 새 탭 이동 | UI_DIRECT | IMPLEMENT | SCR-003 | Action Card 버튼 |
| REQ-FUNC-025 | 입력값 서버 미저장 | NON_UI | IMPLEMENT | 해당없음(비UI) | 백엔드 정책 |
| REQ-FUNC-026 | URL 오류 시 이동 차단·재시도 | UI_STATE | IMPLEMENT | SCR-003 | Error 상태 |

### 3.4 F4 — Travel Mate (REQ-FUNC-027~045)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-027 | 쓰기 작업에 이메일 인증 세션 요구 | NON_UI | IMPLEMENT | 해당없음(비UI) | Unauthorized 상태는 SCR-003·004·005에 반영 |
| REQ-FUNC-028 | 성인 확인 요구, 생년월일 미저장 | NON_UI | IMPLEMENT | 해당없음(비UI) | 성인확인 절차 UI는 SCR-005 |
| REQ-FUNC-029 | 동행 프로필(닉네임·연령대·성별·스타일·소개) | UI_DIRECT | IMPLEMENT | SCR-005 | 프로필 관리 탭 |
| REQ-FUNC-030 | 조건별 동행글 필터(차단 사용자 제외) | UI_DIRECT | IMPLEMENT | SCR-004 | Filter Bar |
| REQ-FUNC-031 | 모집글 작성 필수 필드·검증 | UI_DIRECT | IMPLEMENT | SCR-003 | 동행 탭 작성 Form |
| REQ-FUNC-032 | 공개 연락처 패턴 탐지 | UI_STATE | IMPLEMENT | SCR-003 | 동행 탭 제출 차단 상태 |
| REQ-FUNC-033 | 연락처 비노출 | NON_UI | IMPLEMENT | 해당없음(비UI) | 응답 데이터 정책, SCR-004 상세에 자연히 반영 |
| REQ-FUNC-034 | 참가 메시지(500자) 비공개 제출 | UI_DIRECT | IMPLEMENT | SCR-004 | 상세 패널 신청 Form |
| REQ-FUNC-035 | 중복 PENDING/ACCEPTED 요청 차단 | UI_STATE | IMPLEMENT | SCR-004 | 신청 Form Error 상태 |
| REQ-FUNC-036 | 작성자 승인·거절 | UI_DIRECT | IMPLEMENT | SCR-005 | 내 활동 > 참가 요청 관리 탭 |
| REQ-FUNC-037 | 종료일 경과 시 자동 마감 | UI_STATE | IMPLEMENT | SCR-004 | 목록·상세 상태 배지(SCR-005 내 글에도 반영) |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | UI_DIRECT | IMPLEMENT | SCR-005 | 내 활동 > 내 글 관리 탭 |
| REQ-FUNC-039 | 글·사용자·요청 신고 | UI_DIRECT | IMPLEMENT | SCR-004 | 상세 패널 신고 트리거(접수 확인은 Toast) |
| REQ-FUNC-040 | 사용자 차단·해제 | UI_DIRECT | IMPLEMENT | SCR-004 | 트리거는 상세 패널, 목록 관리는 SCR-005 차단 목록 |
| REQ-FUNC-041 | 신고 큐(상태별 필터) | UI_DIRECT | IMPLEMENT | SCR-005 | 간단 관리자 탭 |
| REQ-FUNC-042 | 신고 처리 조치 기록 | UI_DIRECT | IMPLEMENT(축소) | SCR-005 | 간단 관리자 탭 |
| REQ-FUNC-043 | 참가/신고 처리 결과 알림 | UI_STATE | IMPLEMENT(축소) | SCR-004, SCR-005 | Toast(전역 컴포넌트, 발생 화면 기준) |
| REQ-FUNC-044 | RLS로 비공개 데이터 접근 제한 | NON_UI | IMPLEMENT | 해당없음(비UI) | 서버 정책 |
| REQ-FUNC-045 | 탈퇴 시 프로필 비식별화·개인정보 삭제 | NON_UI | EXCLUDED | 해당없음(제외 기능) | 화면 배치하지 않음 |

### 3.5 F5 — Country Safety (REQ-FUNC-046~056)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-046 | 게시 해외 국가 전체 안전 페이지 보유 | OPERATIONS | IMPLEMENT | 해당없음(비UI) | 콘텐츠 커버리지 검증 |
| REQ-FUNC-047 | 8개 필수 안전 카테고리 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer |
| REQ-FUNC-048 | 출처명·URL·확인일·편집자 기록 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer |
| REQ-FUNC-049 | 외교부 원문 새 탭 링크 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer |
| REQ-FUNC-050 | 7일 초과 stale 경고 | UI_STATE | IMPLEMENT | SCR-001 | 안전정보 Drawer 경고 상태 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | UI_STATE | IMPLEMENT | SCR-001 | 경보 단계에 따른 조건부 표시 |
| REQ-FUNC-052 | 국가/지역 경보 범위 구분 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer |
| REQ-FUNC-053 | 긴급연락처(현지·영사콜센터) | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer |
| REQ-FUNC-054 | 공식 판단 비대체 고지 | UI_DIRECT | IMPLEMENT | SCR-001, SCR-003 | 안전 Drawer + 항공 요약 고지 |
| REQ-FUNC-055 | Editor/Admin 안전 콘텐츠 CRUD 워크플로 | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | 정적 데이터 직접 편집으로 대체 |
| REQ-FUNC-056 | 안전정보 변경 이력 보존 | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | Git 이력으로 대체 |

### 3.6 F6 — About free_traveler (REQ-FUNC-057~063)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-057 | 대표명·50+ Trips·30+ Countries 표시 | UI_DIRECT | IMPLEMENT | SCR-002 | 지표 Section |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 표시 | UI_DIRECT | IMPLEMENT | SCR-002 | 소개 Section |
| REQ-FUNC-059 | 방문 권역 지도/국가 목록 | UI_DIRECT | IMPLEMENT | SCR-002 | 방문 국가 Section |
| REQ-FUNC-060 | 여행 타임라인 | UI_DIRECT | IMPLEMENT | SCR-002 | Timeline Section |
| REQ-FUNC-061 | 대표 이미지 메타데이터 | UI_DIRECT | IMPLEMENT(축소) | SCR-002 | alt만 필수(007과 동일 정책) |
| REQ-FUNC-062 | 문의·SNS 링크 | UI_DIRECT | IMPLEMENT(축소) | SCR-002 | 정적 고정 링크 |
| REQ-FUNC-063 | 추천 여행지 6개 연결 | UI_DIRECT | IMPLEMENT | SCR-002 | 추천 Section, 클릭 시 SCR-001 Drawer |

### 3.7 F7 — Common, Admin, Governance (REQ-FUNC-064~080)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-064 | 전역 내비게이션·푸터 | UI_DIRECT | IMPLEMENT | 전역(5개 Screen 공통) | Header/Footer |
| REQ-FUNC-065 | 320px~데스크톱 반응형 | UI_DIRECT | IMPLEMENT | 전역(5개 Screen 공통) | 레이아웃 규칙 |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | UI_DIRECT | IMPLEMENT | SCR-005 | 로그인 탭. 이메일 인증 콜백 자체는 기술 Route |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | UI_DIRECT | IMPLEMENT | SCR-001 | 검색 Hero 확장 |
| REQ-FUNC-068 | 여행지 즐겨찾기 | UI_DIRECT | IMPLEMENT | SCR-001, SCR-005 | 추가는 SCR-001 카드, 목록 관리는 SCR-005 |
| REQ-FUNC-069 | URL 공유 | UI_DIRECT | EXCLUDED | 해당없음(제외 기능) | 화면 배치하지 않음 |
| REQ-FUNC-070 | 공개 페이지 SEO 메타데이터 | NON_UI | IMPLEMENT | 해당없음(비UI) | `<head>` 메타, 화면 요소 아님 |
| REQ-FUNC-071 | 제한된 속성의 행동 분석 이벤트 | NON_UI | EXCLUDED | 해당없음(제외 기능) | 화면 배치하지 않음 |
| REQ-FUNC-072 | Editor/Admin 여행지 콘텐츠 CRUD | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | 정적 데이터 직접 편집으로 대체 |
| REQ-FUNC-073 | 미디어 업로드 메타데이터 필수 | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | 화면 배치하지 않음 |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | OPERATIONS | IMPLEMENT(축소) | 해당없음(비UI) | 데이터 검증 스크립트, 화면 아님 |
| REQ-FUNC-075 | 안전정보 stale 대시보드 | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | 대시보드 미생성(통계 화면 금지 원칙과도 부합) |
| REQ-FUNC-076 | 관리자 변경·신고 처리 감사 로그 | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | 화면 배치하지 않음 |
| REQ-FUNC-077 | 외부 URL 허용목록·HTTPS 설정 | UI_DIRECT | IMPLEMENT | SCR-005 | 간단 관리자 탭 |
| REQ-FUNC-078 | 404/500/권한없음/외부연결실패 복구 행동 | UI_STATE | IMPLEMENT | 기술 Route(5개 Screen 외) | 규칙 9에 따라 별도 디자인 Screen으로 세지 않음 |
| REQ-FUNC-079 | 폼·모달·탭·알림의 ARIA/시맨틱 처리 | UI_DIRECT | IMPLEMENT | 전역(5개 Screen 공통) | 공통 컴포넌트 규격 |
| REQ-FUNC-080 | 약관·정책·안전수칙 고지 및 동의 기록 | UI_DIRECT | IMPLEMENT | SCR-003 | 동행 작성 탭 동의 체크박스. 정책 본문 페이지는 5개 Screen 외 경량 정적 페이지 |

### 3.8 비기능 요구사항 — 성능 (REQ-NF-001~007)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-001 | LCP p75 ≤2.5s | NON_UI | IMPLEMENT | 해당없음(비UI) | 성능 목표, 화면 요소 아님 |
| REQ-NF-002 | INP p75 ≤200ms | NON_UI | IMPLEMENT | 해당없음(비UI) | 성능 목표 |
| REQ-NF-003 | CLS p75 ≤0.1 | NON_UI | IMPLEMENT | 해당없음(비UI) | 성능 목표 |
| REQ-NF-004 | 필터 응답 p95≤1s(동시 50명) | NON_UI | EXCLUDED | 해당없음(제외 기능) | 부하 테스트 제외 |
| REQ-NF-005 | 쓰기 API p95≤3s | NON_UI | IMPLEMENT | 해당없음(비UI) | 성능 목표 |
| REQ-NF-006 | 이미지 반응형·lazy load | UI_STATE | IMPLEMENT | 전역(5개 Screen 공통) | 이미지 로딩 시각적 상태 |
| REQ-NF-007 | Lighthouse CI 성능 예산 | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | CI 게이트 미구성 |

### 3.9 비기능 요구사항 — 신뢰성·복구 (REQ-NF-008~011)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-008 | 월간 가용성 ≥99.5% | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | 모니터링 체계 제외 |
| REQ-NF-009 | 내부 API 5xx ≤0.5% | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | 모니터링 체계 제외 |
| REQ-NF-010 | DB 백업 RPO/RTO | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | 자동 백업 체계 제외 |
| REQ-NF-011 | 외부/공식 링크 주1회 자동 검사·Admin 알림 | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | 장애 알림 자동화 제외 |

### 3.10 비기능 요구사항 — 보안·개인정보 (REQ-NF-012~018)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-012 | TLS 1.2 이상 | NON_UI | IMPLEMENT | 해당없음(비UI) | 인프라 설정 |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | NON_UI | IMPLEMENT | 해당없음(비UI) | 서버 정책 |
| REQ-NF-014 | CSRF 방어·SameSite 쿠키 | NON_UI | IMPLEMENT | 해당없음(비UI) | 서버 정책 |
| REQ-NF-015 | 입력 검증·XSS 차단 | NON_UI | IMPLEMENT | 해당없음(비UI) | 서버 정책(가시적 오류 문구는 각 Form의 UI_STATE가 담당) |
| REQ-NF-016 | 비밀키 환경변수 관리 | NON_UI | IMPLEMENT | 해당없음(비UI) | 인프라 설정 |
| REQ-NF-017 | 항공·호텔 원시 입력값 미보존 | NON_UI | IMPLEMENT | 해당없음(비UI) | 백엔드 정책(015/023과 연계) |
| REQ-NF-018 | 개인정보 내보내기·탈퇴·삭제 요청 | NON_UI | EXCLUDED | 해당없음(제외 기능) | 045와 동일 사유 |

### 3.11 비기능 요구사항 — 안전·모더레이션 (REQ-NF-019~022)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-019 | 신고 접수 응답 p95≤3s | NON_UI | IMPLEMENT | 해당없음(비UI) | 성능 목표(접수 확인 UI는 SCR-004 Toast) |
| REQ-NF-020 | 신고 1차 검토 24h 이내 90% | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | 운영 SLA 지표 |
| REQ-NF-021 | 글·요청·신고 속도 제한(429) | NON_UI | EXCLUDED | 해당없음(제외 기능) | Rate limit 미구현 |
| REQ-NF-022 | Moderator 조치 추적(감사 로그) | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | 범용 감사 로그 제외 |

### 3.12 비기능 요구사항 — 접근성 (REQ-NF-023~025)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-023 | WCAG 2.2 Level AA 목표 | UI_DIRECT | IMPLEMENT | 전역(5개 Screen 공통) | 디자인 시스템 규칙 |
| REQ-NF-024 | 자동 접근성 검사(axe) | OPERATIONS | IMPLEMENT | 해당없음(비UI) | 테스트 프로세스 |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | OPERATIONS | IMPLEMENT | 해당없음(비UI) | QA 프로세스 |

### 3.13 비기능 요구사항 — 콘텐츠·최신성·SEO·저작권 (REQ-NF-026~030)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | OPERATIONS | IMPLEMENT | 해당없음(비UI) | 콘텐츠 검증 |
| REQ-NF-027 | 해외 안전정보 커버리지 100% | OPERATIONS | IMPLEMENT | 해당없음(비UI) | 콘텐츠 검증 |
| REQ-NF-028 | 안전정보 7일 이내 확인 95%·초과 경고 100% | UI_STATE | IMPLEMENT(부분) | SCR-001 | 경고 표시는 050과 동일 Drawer, 95% 수치는 OPERATIONS 성격 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | 라이선스 워크플로 제외 |
| REQ-NF-030 | 공개 페이지 SEO 메타데이터 누락 0 | NON_UI | IMPLEMENT | 해당없음(비UI) | 070과 동일 |

### 3.14 비기능 요구사항 — 유지보수·모니터링·비용 (REQ-NF-031~034)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | 배치 Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-031 | TypeScript strict·lint·unit test | OPERATIONS | IMPLEMENT | 해당없음(비UI) | 개발 프로세스 |
| REQ-NF-032 | 구조화 로그 | OPERATIONS | IMPLEMENT(축소) | 해당없음(비UI) | 운영 로그 |
| REQ-NF-033 | 핵심 오류 5분 이내 알림 | OPERATIONS | EXCLUDED | 해당없음(제외 기능) | 장애 알림 자동화 제외 |
| REQ-NF-034 | 월 인프라 비용 10만원 이하 | OPERATIONS | IMPLEMENT | 해당없음(비UI) | 인프라 비용 관리 |

---

## 4. Screen별 사용자 목표·주요 영역·상태·이동 목적지

### SCR-001 `/` 홈

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 여행지를 탐색하고, 필요하면 안전정보를 확인한 뒤, 다음 행동(여행 준비/동행/대표소개)으로 넘어간다 |
| 주요 영역 | 검색·필터 Hero, 국내/해외 여행지 결과 Card, 테마 Chip, 국가 안전정보 Card, 여행지·안전정보 상세 Drawer/Modal, 최근 동행글 미리보기, 대표 소개 요약 |
| 상태 | Loading(카드 Skeleton), Success, Empty(동행글 미리보기 Section), Error(데이터 로드 실패 재시도) |
| 이동 목적지 | `/travel-tools`(여행 조건 정리), `/mates`(동행 더 보기), `/about`(대표 소개), 안전정보 Drawer 내부의 외교부 등 공식 출처(외부 새 탭) |

### SCR-002 `/about` 대표 소개

| 항목 | 내용 |
|---|---|
| 사용자 목표 | free_traveler의 경험과 편집 기준을 확인해 콘텐츠를 신뢰할 근거를 얻는다 |
| 주요 영역 | Hero, 여행 지표, 소개문, 여행 Timeline, 방문 국가 Chip, 사진 Gallery, 추천 여행지 |
| 상태 | Success 중심(정적 데이터), Loading(이미지), Error(이미지 로드 실패 시 대체) |
| 이동 목적지 | `/travel-tools`, `/mates`, 방문 국가 Chip·추천 여행지 클릭 시 SCR-001 상세 Drawer |

### SCR-003 `/travel-tools` 통합 여행 준비

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 항공·숙소 조건을 정리해 외부 사이트로 이동하거나, 동행 모집글을 작성한다 |
| 주요 영역 | Intro, 항공/숙소/동행 3탭, 조건 입력 Form, 입력 요약 Action Card, 비전달 고지·Tip, 동행 작성 Form 또는 로그인 안내 |
| 상태 | 탭별 독립 상태(Idle/Validating/Summary=Success/Error), 동행 탭은 Unauthorized 추가 |
| 이동 목적지 | 외부 항공/호텔 사이트(새 탭), 동행글 작성 완료 시 `/mates` 또는 `/account`(내 글 확인) |

### SCR-004 `/mates` 동행 찾기

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 조건에 맞는 동행글을 찾아 상세를 확인하고 참가를 신청한다 |
| 주요 영역 | Intro, Filter Bar, 목록 Card Grid(최대 8개 우선 노출), 상세 패널(Desktop 좌우 분할/Mobile Drawer), 신청 방법 안내, 안전 안내 |
| 상태 | Loading, Success, Empty(필터 결과 없음/전체 없음), Error, Unauthorized(신청·신고·차단 시도 시) |
| 이동 목적지 | `/travel-tools`(글쓰기는 동행 탭으로), `/account`(신청 후 상태 확인), 비로그인 시 `/account` |

### SCR-005 `/account` 계정·관리

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 로그인·가입하고, 내 프로필·글·참가 요청·즐겨찾기·차단을 관리하며, 관리자는 신고와 외부 URL을 처리한다 |
| 주요 영역 | Guest 탭(로그인/가입/비밀번호 재설정), Member 탭(프로필·성인확인 요약, 내 글, 참가 요청, 즐겨찾기, 차단 목록), Admin 탭(신고 큐, 외부 URL 설정) — 역할에 없는 탭은 렌더링하지 않음 |
| 상태 | Guest는 Unauthorized가 기본 진입 상태, Member·Admin은 Loading/Success/Empty/Error |
| 이동 목적지 | 로그인 성공 시 이전 화면 또는 SCR-001로 복귀, 새 동행글 작성은 `/travel-tools` 동행 탭으로 이동 |

---

## 5. 기술 Route (5개 Screen에 포함되지 않음)

| 유형 | 예시 | 비고 |
|---|---|---|
| API Route | `docs/02_SRS_BASELINE.md` 6.1절 API-01~17 | 데이터 CRUD·조회용 서버 엔드포인트, 화면 아님 |
| 인증 콜백 | Supabase Auth 이메일 인증/비밀번호 재설정 콜백 URL | REQ-FUNC-066의 백엔드 처리 구간 |
| 오류 처리 | 404, 500, 네트워크 실패 시 글로벌 오류 경계 | REQ-FUNC-078의 구현 위치, 5개 Screen과 별개 |
| 정책 정적 페이지 | 이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내(REQ-FUNC-080) | Footer 링크로 연결되는 경량 정적 텍스트 페이지로, 핵심 디자인 Screen으로 세지 않음 |

---

## 6. 검증

### 6.1 Requirement 총수 확인

| 구분 | 개수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **합계** | **114** |

3절의 각 표는 SRS 원문 번호 구간과 1:1로 대응하며, 어떤 REQ ID도 삭제하지 않았다.

### 6.2 EXCLUDED 항목 처리 확인

`docs/PROJECT_SCOPE.md`에서 EXCLUDED로 분류된 모든 항목(REQ-FUNC-010, 045, 055, 056, 069, 071~073, 075, 076 / REQ-NF-004, 007~011, 018, 020~022, 029, 033)은 이 문서에서도 배치 Screen을 "해당없음(제외 기능)"으로 유지했으며, 어떤 5개 Screen에도 기능으로 복원하지 않았다.

### 6.3 Screen 수 확인

핵심 디자인 Screen은 SCR-001~005 5개로 고정했다. 전역 공통 요구사항(Header/Footer, 반응형, WCAG, 이미지 로딩)은 특정 SCR 하나에 귀속시키지 않고 "전역(5개 Screen 공통)"으로 표기해 Screen 수 초과를 방지했다.

---

## 7. 후속 정합성 메모

이 문서의 5-Screen 고정 모델(특히 `/account` 통합, SCR-003 내 동행 작성, 별도 `/mates/new` 제거)은 2026-09-11 `docs/PROJECT_SCOPE.md` 2절과 `docs/04_UIUX_PLAN.md`(Header 내비게이션, SCR-003·004·005 본문, 공통 상태 정의)에 반영을 완료했다. 이후 Screen 구성이나 라우트를 변경할 때는 이 세 문서를 함께 갱신한다.
