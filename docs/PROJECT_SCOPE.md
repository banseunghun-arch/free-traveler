# Free Traveler — 프로젝트 구현 범위 정의서 (PROJECT_SCOPE)

| 항목 | 내용 |
|---|---|
| Document ID | SCOPE-TRAVEL-001 |
| 기준 문서 | `docs/01_PRD.md` (PRD-TRAVEL-001), `docs/02_SRS_BASELINE.md` (SRS-TRAVEL-001), `docs/03_UI_COVERAGE_ANALYSIS.md`(UICOV-TRAVEL-001) |
| 기준 코드 | `package.json`, `src/app` |
| 작성일 | 2026-09-10 |
| 상태 | Implementation Scope Baseline |

---

## 1. 문서 목적

이 문서는 PRD·SRS에 정의된 전체 요구사항 중 이번 단계에서 **직접 구현하는 범위**와 **제외하는 범위**를 확정한다. REQ-FUNC-001~080, REQ-NF-001~034 전 항목을 한 번씩 분류하며, 어떤 항목도 표에서 삭제하지 않는다.

- **IMPLEMENT**: 구현하고 테스트한다.
- **EXCLUDED**: 이번 단계에서 만들지 않으며, 표에 제외 사유를 기록한다.

---

## 2. 화면 구성

`docs/03_UI_COVERAGE_ANALYSIS.md`가 확정한 **5개 고정 디자인 Screen**으로 구성한다. 여행지 검색·필터·상세와 안전정보는 홈(SCR-001)의 목록과 Drawer/Modal로 통합하고, 항공·호텔 입력과 동행글 작성은 여행 준비(SCR-003)의 탭으로, 로그인·내 활동·관리자는 계정(SCR-005)의 탭으로 통합한다. 기존에 검토했던 `/destinations/*`, `/flights`, `/hotels`, `/safety/*`, `/auth/*`, `/my/*`, `/admin/*`, `/mates/new`는 별도 라우트로 두지 않는다.

| Screen | 화면 | 라우트 | 비고 |
|---|---|---|---|
| SCR-001 | 홈 | `/` | 여행지 검색·필터·상세 Drawer/Modal, 안전정보 Drawer, 최근 동행글 미리보기, 대표 소개 요약 포함 |
| SCR-002 | 대표 소개 | `/about` | free_traveler 소개 |
| SCR-003 | 통합 여행 준비 | `/travel-tools` | 항공/숙소/동행 작성 3개 탭. 조건 입력·검증·요약·외부 이동, 동행글 작성 Form |
| SCR-004 | 동행 찾기 | `/mates` | 목록·필터, 상세 패널(신청 포함). 작성은 SCR-003 동행 탭으로 이동(`/mates/new` 폐지) |
| SCR-005 | 계정·관리 | `/account` | Guest(로그인/가입/비밀번호 재설정), Member(프로필·내 글·참가요청·즐겨찾기·차단), Admin(신고 처리·외부 URL 설정) 탭. 역할에 없는 탭은 렌더링하지 않음 |

---

## 3. 반드시 직접 구현하는 기능

| # | 기능 | 관련 요구사항 |
|---|---|---|
| 1 | 5개 고정 화면(SCR-001~005) | REQ-FUNC-064, 065, 078, 079 |
| 2 | 여행지 검색·필터·상세 패널 | REQ-FUNC-001~009 |
| 3 | 국가 안전정보 패널 | REQ-FUNC-046~054 |
| 4 | free_traveler 대표 소개 | REQ-FUNC-057~063 |
| 5 | 항공·숙소 입력·검증·요약·외부 이동 | REQ-FUNC-011~026 |
| 6 | Supabase 이메일 인증과 성인 확인 | REQ-FUNC-027, 028, 066 |
| 7 | 동행글 작성·조회·수정·마감 | REQ-FUNC-029~033, 037, 038 |
| 8 | 참가 요청·승인·거절 | REQ-FUNC-034~036, 043 |
| 9 | 간단한 차단·신고 | REQ-FUNC-039~042, 044 |
| 10 | 내 활동과 간단한 관리자 탭 | REQ-FUNC-041, 042, 068, 077 |
| 11 | Playwright 핵심 Smoke Test | 7절 참조 |
| 12 | Vercel 배포 | REQ-NF-034, 8절 참조 |

---

## 4. 구현 방식

- **여행지·안전·대표 콘텐츠**: `src/data`의 정적 TypeScript/JSON 데이터로 관리한다. 관리자용 CRUD 화면과 게시 상태(DRAFT/REVIEW/PUBLISHED) 워크플로는 만들지 않고, 데이터 형태 자체를 코드 리뷰·데이터 검증 스크립트로 검수한다.
- **즐겨찾기**: 서버에 저장하지 않고 브라우저 `localStorage`에만 보관한다.
- **참가 요청·신고 알림**: 실제 이메일 발송 없이 Toast 또는 화면 내 상태(뱃지, 목록 상태값)로 대체한다.
- **동행글 자동 마감**: 배치 작업을 두지 않고, 목록·상세 조회 시점에 `end_date` 경과 여부를 계산해 마감 상태로 표시한다.
- **안전정보 최신성(stale)**: 별도 대시보드 없이, 페이지 렌더링 시 `verified_at`과 현재 시각의 차이(7일 기준)를 계산해 경고를 표시한다.
- **이미지**: 자체 스토리지·업로드 없이 일반 인터넷 이미지 URL과 `alt` 텍스트만 데이터에 기록한다. 출처·작가·라이선스 메타데이터 필드는 두지 않는다.
- **관리자 범위**: 신고 상태 변경(OPEN/REVIEWING/RESOLVED/DISMISSED)과 항공·호텔·SNS 등 외부 URL 설정만 다룬다. 콘텐츠 CRUD, 미디어 승인, 감사 로그 화면은 두지 않는다.

---

## 5. 제외 기능

| 제외 항목 | 사유 |
|---|---|
| 전체 콘텐츠 CMS | 콘텐츠 규모가 작아 정적 데이터 파일 관리로 충분하고, 게시 워크플로 UI를 만들 개발 비용이 이번 단계 목표 대비 과함 |
| 미디어 업로드·라이선스 승인 워크플로 | 이미지 URL + alt 텍스트만 쓰는 정책으로 대체해 업로드·심사 인프라를 없앰 |
| 범용 감사 로그 | 별도 `AUDIT_LOG` 테이블·화면 없이, 필요한 최소 이력(신고 처리 사유 등)은 대상 레코드 자체 필드로만 남김 |
| 자동 백업·장애 알림·부하 테스트 | 운영 모니터링 체계 구축은 별도 단계의 과제이며 이번 단계 목표(기능 구현·검증)를 벗어남 |
| 외부 이메일 사업자 연동 | 이메일 발급·발송 비용/설정 없이 Toast·화면 상태로 동일한 사용자 가치를 제공 |
| EC2·AWS 인프라 | Vercel + Supabase 관리형 스택으로 충분하며 별도 인프라 운영 비용을 만들지 않음 |
| 무인 자동 Merge Runner | 코드 변경은 사람이 검토·승인하는 절차를 유지 |

---

## 6. 요구사항 매핑 표

> 범례: **처리 방법** 열은 IMPLEMENT의 구현 방식, EXCLUDED의 제외 사유를 함께 담는다.

### 6.1 F1 — Destination Guide (REQ-FUNC-001~010)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-FUNC-001 | 국내·해외 목록 구분 표시 | IMPLEMENT | `scope` 필드로 정적 데이터를 국내/해외로 구분해 탭 렌더링 | Playwright: 탭 전환 시 목록 구성 검증 |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | IMPLEMENT | 클라이언트에서 정적 데이터를 AND 조건으로 필터링 | Playwright: 복수 필터 조합 결과 확인 |
| REQ-FUNC-003 | 키워드 검색 | IMPLEMENT | 여행지명·국가명·테마에 대한 클라이언트 부분 일치 검색 | Playwright: 검색어/결과 없음 케이스 확인 |
| REQ-FUNC-004 | 상세 필수 콘텐츠 항목 표시 | IMPLEMENT | 정적 데이터 스키마(overview/highlights/itinerary 등) 정의, 데이터 검증 스크립트로 누락 필드 체크(CMS 게시 게이트 아님) | 유닛 테스트(데이터 스키마 검증) |
| REQ-FUNC-005 | 결과 없음 안내·초기화 | IMPLEMENT | 빈 결과 시 안내 문구와 필터 초기화 버튼 표시 | Playwright: 빈 결과 시나리오 확인 |
| REQ-FUNC-006 | 해외 여행지 ↔ 안전정보 연결 | IMPLEMENT | 여행지 데이터의 `countryCode`로 여행지 Drawer 안에서 안전정보 Drawer로 전환(별도 라우트 없음) | Playwright: 상세→안전정보 Drawer 전환 확인 |
| REQ-FUNC-007 | 대표 이미지 대체텍스트·출처·작가·라이선스 | IMPLEMENT(축소) | alt 텍스트만 필수로 관리, 출처/작가/라이선스 필드는 5절 제외 정책에 따라 제외 | 데이터 스키마 검증(alt 필수 체크) |
| REQ-FUNC-008 | 국내 10곳·해외 15개국 30개 도시 이상 검증 | IMPLEMENT | 데이터 검증 스크립트로 시드 수량 카운트 | 유닛 테스트(수량 검증) |
| REQ-FUNC-009 | 관련 여행지 추천 최대 6개 | IMPLEMENT | 동일 국가·테마 기준 정적 데이터 필터링으로 하단 추천 표시 | Playwright: 상세 페이지 추천 영역 확인 |
| REQ-FUNC-010 | 필터 상태 URL 반영·복원 | EXCLUDED | Should 우선순위 부가 기능으로 1~12 핵심 범위 밖. 필터는 클라이언트 상태로만 유지 | 코드 리뷰(URL 동기화 로직 부재 확인) |

### 6.2 F2 — Flight Link-out (REQ-FUNC-011~018)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-FUNC-011 | 국가·지역·출발일·귀국일 필수 입력 | IMPLEMENT | 클라이언트 폼(라벨·도움말·오류 영역 포함) | Playwright: 필드 렌더링·오류 표시 확인 |
| REQ-FUNC-012 | 국가에 속한 지역만 선택 | IMPLEMENT | 국가 변경 시 지역 옵션 재계산, 기존 값 초기화 | Playwright: 국가 변경 시 지역값 리셋 확인 |
| REQ-FUNC-013 | 과거 출발일·역전 날짜 차단 | IMPLEMENT | 클라이언트 검증 로직으로 제출 차단 | 유닛 테스트 + Playwright 경계값 확인 |
| REQ-FUNC-014 | 요약 단계 표시 | IMPLEMENT | 검증 통과 후 요약 화면(브라우저 세션 상태 유지) | Playwright: 폼→요약 이동·값 유지 확인 |
| REQ-FUNC-015 | 비전달 고지 문구 | IMPLEMENT | 폼·요약 화면에 고정 안내 문구 배치 | Playwright: 문구 노출 확인 |
| REQ-FUNC-016 | 외부 일반 URL 새 탭 이동 | IMPLEMENT | `target="_blank" rel="noopener noreferrer"`, 쿼리 파라미터 없음 | Playwright: 새 탭·URL 무쿼리 확인 |
| REQ-FUNC-017 | 입력값 서버 미저장 | IMPLEMENT | 서버 API를 두지 않고 클라이언트 상태로만 처리 | 코드 리뷰(서버 저장 로직 부재) + 네트워크 탭 확인 |
| REQ-FUNC-018 | URL 오류 시 이동 차단·재시도 | IMPLEMENT | 환경변수 URL 미설정/형식 오류 시 오류 안내와 재시도 버튼 | Playwright: URL 미설정 시나리오 확인 |

### 6.3 F3 — Hotel Link-out (REQ-FUNC-019~026)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-FUNC-019 | 국가·지역·체크인·체크아웃 필수 입력 | IMPLEMENT | Flight 폼과 동일 패턴의 클라이언트 폼 | Playwright: 필드·오류 표시 확인 |
| REQ-FUNC-020 | 국가에 속한 지역만 선택 | IMPLEMENT | 국가 변경 시 지역 옵션 재계산 | Playwright: 지역값 리셋 확인 |
| REQ-FUNC-021 | 과거/역전/동일 날짜 차단 | IMPLEMENT | 클라이언트 검증 로직 | 유닛 테스트 + Playwright 경계값 확인 |
| REQ-FUNC-022 | 요약 표시 | IMPLEMENT | 검증 통과 후 요약 화면 | Playwright: 요약값 일치 확인 |
| REQ-FUNC-023 | 비전달 고지 문구 | IMPLEMENT | 폼·요약 화면 고정 안내 | Playwright: 문구 노출 확인 |
| REQ-FUNC-024 | 외부 일반 URL 새 탭 이동 | IMPLEMENT | `noopener,noreferrer`, 쿼리 없음 | Playwright: 새 탭·URL 확인 |
| REQ-FUNC-025 | 입력값 서버 미저장 | IMPLEMENT | 서버 API 없이 클라이언트 상태 처리 | 코드 리뷰 + 네트워크 탭 확인 |
| REQ-FUNC-026 | URL 오류 시 이동 차단·재시도 | IMPLEMENT | 오류 안내·재시도, 입력값 유지 | Playwright: URL 오류 시나리오 확인 |

### 6.4 F4 — Travel Mate (REQ-FUNC-027~045)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-FUNC-027 | 쓰기 작업에 이메일 인증 세션 요구 | IMPLEMENT | Supabase Auth 세션 검사 미들웨어 | 통합 테스트: 비회원 POST 차단 확인 |
| REQ-FUNC-028 | 성인 확인 상태 요구, 생년월일 미저장 | IMPLEMENT | `is_adult`, `adult_verified_at`만 저장 | 통합 테스트: 스키마·정책 확인 |
| REQ-FUNC-029 | 동행 프로필(닉네임·연령대·성별·스타일·소개) | IMPLEMENT | 프로필 폼, 닉네임/연령대/스타일 필수, 성별 선택 | Playwright: 프로필 작성 흐름 확인 |
| REQ-FUNC-030 | 조건별 동행글 필터(차단 사용자 제외) | IMPLEMENT | 필터 로직 + 차단 관계 조회로 제외 | Playwright: 필터·차단 제외 확인 |
| REQ-FUNC-031 | 모집글 작성 필수 필드·검증 | IMPLEMENT | 폼 검증(필수값·날짜 역전·과거 종료일 차단) | Playwright + 유닛 테스트 |
| REQ-FUNC-032 | 공개 연락처 패턴 탐지 | IMPLEMENT | 정규식 기반 전화번호·이메일·메신저ID 탐지, 제출 차단·수정 안내 | 유닛 테스트: 탐지율 기준 테스트셋 |
| REQ-FUNC-033 | 연락처 비노출 | IMPLEMENT | 응답 데이터에 연락처 필드 자체를 포함하지 않음 | 통합 테스트: 응답 페이로드 검사 |
| REQ-FUNC-034 | 참가 메시지(500자) 비공개 제출 | IMPLEMENT | PENDING 상태로 저장, 작성자·요청자만 조회 | Playwright + RLS 정책 검토 |
| REQ-FUNC-035 | 중복 PENDING/ACCEPTED 요청 차단 | IMPLEMENT | DB unique 제약 + UI 오류 처리 | 통합 테스트: 중복 요청 시나리오 |
| REQ-FUNC-036 | 작성자 승인·거절 | IMPLEMENT | 작성자 권한 검사 후 상태 전이 | Playwright + 통합 테스트: 비작성자 403 |
| REQ-FUNC-037 | 종료일 경과 시 자동 마감 | IMPLEMENT | 배치 없이 조회 시 `end_date` 경과 여부 계산해 CLOSED로 표시 | 유닛 테스트: 날짜 경계 계산 |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | IMPLEMENT | 작성자 전용 액션, 승인 요청자 존재 시 경고 | Playwright: 마감/수정/삭제 흐름 |
| REQ-FUNC-039 | 글·사용자·요청 신고 | IMPLEMENT | 사유 코드+설명 제출, 접수 ID 표시 | Playwright: 신고 제출 흐름 |
| REQ-FUNC-040 | 사용자 차단·해제 | IMPLEMENT | 차단 관계 저장, 상호 노출 제한 로직 | Playwright + 통합 테스트: 노출 제한 확인 |
| REQ-FUNC-041 | 신고 큐(상태별 필터) | IMPLEMENT | 관리자 탭에서 OPEN/REVIEWING/RESOLVED/DISMISSED 필터 목록 제공 | Playwright: 관리자 신고 큐 필터 확인 |
| REQ-FUNC-042 | 신고 처리 조치 기록 | IMPLEMENT(축소) | 경고·숨김·제한·기각 등 핵심 조치만 제공, 사유/담당자/시각은 `REPORT` 레코드 필드에 직접 기록(별도 감사 로그 테이블 없음) | 통합 테스트: 상태 변경 필드 확인 |
| REQ-FUNC-043 | 참가/신고 처리 결과 알림 | IMPLEMENT(축소) | 이메일 발송 없이 인앱 Toast·화면 상태로 알림 | Playwright: 상태 변경 시 Toast 노출 확인 |
| REQ-FUNC-044 | RLS로 비공개 데이터 접근 제한 | IMPLEMENT | Supabase RLS 정책으로 본인/작성자/Moderator·Admin만 접근 | 통합 테스트: 권한별 부정 접근 시도 |
| REQ-FUNC-045 | 탈퇴 시 프로필 비식별화·개인정보 30일 삭제 | EXCLUDED | 자동 삭제 배치·법적 보존 예외 처리는 범용 백오피스 자동화 영역으로 1~12 범위 밖. 계정은 상태값 변경(비활성화) 수준까지만 지원 | 코드 리뷰(자동 삭제 배치 부재 확인) |

### 6.5 F5 — Country Safety (REQ-FUNC-046~056)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-FUNC-046 | 게시 해외 국가 전체 안전 페이지 보유 | IMPLEMENT | 정적 안전 데이터와 여행지 국가 목록 일치 검증 스크립트 | 유닛 테스트: 국가 커버리지 검증 |
| REQ-FUNC-047 | 8개 필수 안전 카테고리 | IMPLEMENT | 정적 데이터 스키마에 8개 카테고리 필드 고정 | 데이터 스키마 검증 |
| REQ-FUNC-048 | 출처명·URL·확인일·편집자 기록 | IMPLEMENT | 정적 데이터 필드로 관리, 공개 페이지에 노출 | 데이터 스키마 검증 + Playwright |
| REQ-FUNC-049 | 외교부 원문 새 탭 링크 | IMPLEMENT | `noopener,noreferrer` 외부 링크 | Playwright: 링크 속성·새 탭 확인 |
| REQ-FUNC-050 | 7일 초과 stale 경고 | IMPLEMENT | 렌더링 시 `verified_at` 대비 현재 시각 계산해 경고 표시 | Playwright: stale 케이스 렌더링 확인 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | IMPLEMENT | 경보 단계·범위를 텍스트 라벨로 상단 고정 표시 | Playwright: 경보 단계별 렌더링 확인 |
| REQ-FUNC-052 | 국가/지역 경보 범위 구분 | IMPLEMENT | `scope_type`/`scope_text` 필드로 구분 렌더링 | 데이터 스키마 검증 |
| REQ-FUNC-053 | 긴급연락처(현지·영사콜센터) | IMPLEMENT | 정적 데이터의 연락처 필드 표시 | Playwright: 연락처 섹션 노출 확인 |
| REQ-FUNC-054 | 공식 판단 비대체 고지 | IMPLEMENT | 안전 패널·항공 요약에 고정 고지 문구 | Playwright: 고지 문구 노출 확인 |
| REQ-FUNC-055 | Editor/Admin 안전 콘텐츠 작성·검수·게시 워크플로 | EXCLUDED | 전체 콘텐츠 CMS 제외 대상. 안전정보도 여행지와 동일하게 `src/data` 정적 파일로 직접 작성/수정 | 코드 리뷰(전용 편집 UI 부재 확인) |
| REQ-FUNC-056 | 안전정보 변경 이력 보존 | EXCLUDED | 범용 감사 로그 제외 대상. 정적 파일 변경 이력은 Git 커밋 이력으로 대체 | 코드 리뷰(Git 이력으로 대체 확인) |

### 6.6 F6 — About free_traveler (REQ-FUNC-057~063)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-FUNC-057 | 대표명·50+ Trips·30+ Countries 표시 | IMPLEMENT | 단일 정적 데이터 소스(`representative.ts`)에서 값을 가져와 대표 페이지·홈에 공통 사용 | Playwright: 페이지 간 수치 일치 확인 |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 표시 | IMPLEMENT | PRD 확정 소개문을 정적 데이터로 그대로 반영 | Playwright: 텍스트 노출 확인 |
| REQ-FUNC-059 | 방문 권역 지도/국가 목록(30개국 이상) | IMPLEMENT | 정적 국가 목록 렌더링(지도 또는 리스트 형태) | 데이터 검증(국가 수 ≥30) |
| REQ-FUNC-060 | 여행 타임라인 | IMPLEMENT | 정적 타임라인 데이터(연도·장소·요약) 렌더링 | Playwright: 타임라인 항목 확인 |
| REQ-FUNC-061 | 대표 이미지 메타데이터 | IMPLEMENT(축소) | alt 텍스트+이미지 URL만 관리(출처/작가/라이선스 필드 제외, 007과 동일 정책) | 데이터 스키마 검증(alt 필수) |
| REQ-FUNC-062 | 문의·SNS 링크 | IMPLEMENT(축소) | 관리자 설정이 아닌 정적 데이터의 고정 링크로 관리, 빈 값은 렌더링하지 않음 | Playwright: 링크 노출/숨김 확인 |
| REQ-FUNC-063 | 추천 여행지 6개 연결 | IMPLEMENT | 정적 데이터로 추천 슬러그 6개 지정, 공개 여행지만 연결 | Playwright: 추천 링크 유효성 확인 |

### 6.7 F7 — Common, Admin, Governance (REQ-FUNC-064~080)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-FUNC-064 | 전역 내비게이션·푸터 | IMPLEMENT | 공통 레이아웃 컴포넌트(`layout.tsx`)에 내비게이션·푸터 배치 | Playwright: 전 페이지 내비게이션 노출 확인 |
| REQ-FUNC-065 | 320px~데스크톱 반응형 | IMPLEMENT | Tailwind CSS 반응형 유틸리티로 레이아웃 구성 | Playwright: 뷰포트별 스크린샷/레이아웃 확인 |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | IMPLEMENT | Supabase Auth 이메일 플로우 사용 | Playwright: 가입~로그아웃 전 과정 확인 |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | IMPLEMENT | 정적 데이터 대상 클라이언트 검색, 결과 유형 라벨 표시 | Playwright: 통합 검색 결과 확인 |
| REQ-FUNC-068 | 여행지 즐겨찾기 | IMPLEMENT | `localStorage`에 슬러그 목록 저장, 내 활동 탭에서 조회 | Playwright: 즐겨찾기 추가/해제 확인 |
| REQ-FUNC-069 | URL 공유(Web Share API/복사) | EXCLUDED | Should 우선순위 부가 기능으로 1~12 범위 밖 | 코드 리뷰(공유 버튼 부재 확인) |
| REQ-FUNC-070 | 공개 페이지 SEO 메타데이터 | IMPLEMENT | Next.js Metadata API로 title/description/canonical/OG 설정 | 자동 메타 검사 스크립트 |
| REQ-FUNC-071 | 제한된 속성의 행동 분석 이벤트 | EXCLUDED | 커스텀 이벤트 분석 파이프라인은 1~12 범위 밖 | 코드 리뷰(분석 SDK 미포함 확인) |
| REQ-FUNC-072 | Editor/Admin 여행지 콘텐츠 CRUD | EXCLUDED | 전체 콘텐츠 CMS 제외 대상. `src/data` 직접 편집으로 대체 | 코드 리뷰(CRUD UI 부재 확인) |
| REQ-FUNC-073 | 미디어 업로드 시 메타데이터 필수 | EXCLUDED | 미디어 업로드·라이선스 워크플로 제외 대상 | 코드 리뷰(업로드 기능 부재 확인) |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | IMPLEMENT(축소) | 관리자 UI 게이트 대신 데이터 검증 스크립트(유닛 테스트)로 빌드/PR 시점에 완전성 확인 | 유닛 테스트: 완전성 검증 스크립트 |
| REQ-FUNC-075 | 안전정보 stale 대시보드 | EXCLUDED | 전체 콘텐츠 CMS 제외 대상. stale 표시는 050에서 페이지 단위로 처리 | 코드 리뷰(대시보드 부재 확인) |
| REQ-FUNC-076 | 관리자 변경·신고 처리 감사 로그 | EXCLUDED | 범용 감사 로그 제외 대상. 신고 처리 이력은 042의 레코드 필드로 최소 대체 | 코드 리뷰(AUDIT_LOG 부재 확인) |
| REQ-FUNC-077 | 외부 URL 허용목록·HTTPS 설정 | IMPLEMENT | 관리자 탭에서 항공/호텔/SNS 외부 URL을 HTTPS만 허용해 설정 | Playwright: 잘못된 URL 저장 차단 확인 |
| REQ-FUNC-078 | 404/500/권한없음/외부연결실패 복구 행동 | IMPLEMENT | 공통 오류 페이지·컴포넌트에 홈/이전/재시도 버튼 제공 | Playwright: 각 오류 상황 진입 확인 |
| REQ-FUNC-079 | 폼·모달·탭·알림의 ARIA/시맨틱 처리 | IMPLEMENT | shadcn/ui 접근성 프리미티브와 시맨틱 HTML 사용 | axe 자동 검사(Playwright 통합) + 키보드 수동 확인 |
| REQ-FUNC-080 | 약관·정책·안전수칙 고지 및 동의 기록 | IMPLEMENT | 정책 페이지 제공, 동행글 작성 시 안전수칙 동의 체크와 동의 시각 저장 | Playwright: 동의 없이 제출 차단 확인 |

### 6.8 비기능 요구사항 — 성능 (REQ-NF-001~007)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-NF-001 | LCP p75 ≤2.5s | IMPLEMENT | Next.js 이미지 최적화·정적 렌더링을 설계 목표로 적용(정식 RUM 측정 체계는 미구축) | 수동 Lighthouse 점검 |
| REQ-NF-002 | INP p75 ≤200ms | IMPLEMENT | 경량 클라이언트 상호작용 설계(정식 필드 데이터 수집 제외) | 수동 Lighthouse 점검 |
| REQ-NF-003 | CLS p75 ≤0.1 | IMPLEMENT | 이미지 크기 고정, 레이아웃 시프트 최소화 | 수동 Lighthouse 점검 |
| REQ-NF-004 | 필터 응답 p95≤1s(동시 50명) | EXCLUDED | 부하 테스트 제외 대상. 정적 데이터 기반 단일 사용자 응답성만 확인 | 코드 리뷰(부하 테스트 미구성 확인) |
| REQ-NF-005 | 쓰기 API p95≤3s | IMPLEMENT | Supabase 단순 쓰기 경로로 설계, 별도 부하 테스트 없이 기능 테스트 중 응답시간 관찰 | Playwright 실행 로그의 응답시간 관찰 |
| REQ-NF-006 | 이미지 반응형·lazy load | IMPLEMENT | Next.js `Image` 컴포넌트 사용, LCP 이미지는 priority 처리 | 코드 리뷰 |
| REQ-NF-007 | Lighthouse CI 성능 예산 | EXCLUDED | CI 성능 게이트 자동화는 범위 밖(부하/모니터링 인프라 제외와 동일 맥락). 필요 시 수동 점검으로 대체 | 코드 리뷰(CI 게이트 미구성 확인) |

### 6.9 비기능 요구사항 — 신뢰성·복구 (REQ-NF-008~011)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-NF-008 | 월간 가용성 ≥99.5% | EXCLUDED | 장애 알림·SLA 모니터링 체계 제외 대상. Vercel/Supabase 관리형 인프라 가용성에 의존 | 코드 리뷰(모니터링 부재 확인) |
| REQ-NF-009 | 내부 API 5xx ≤0.5% | EXCLUDED | 부하/장애 모니터링 체계 제외 대상 | 코드 리뷰(모니터링 부재 확인) |
| REQ-NF-010 | DB 백업 RPO≤24h/RTO≤8h | EXCLUDED | 자동 백업·장애 대응 체계 제외 대상. Supabase 기본 백업에 의존 | 코드 리뷰(별도 백업 체계 부재 확인) |
| REQ-NF-011 | 외부/공식 링크 주1회 자동 검사·Admin 알림 | EXCLUDED | 장애 알림 자동화 제외 대상. Playwright 스모크 테스트 실행 시 수동 확인으로 대체 | 코드 리뷰(자동 점검 잡 부재 확인) |

### 6.10 비기능 요구사항 — 보안·개인정보 (REQ-NF-012~018)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-NF-012 | TLS 1.2 이상 | IMPLEMENT | Vercel/Supabase 기본 제공 HTTPS 사용 | 배포 설정 확인 |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | IMPLEMENT | Supabase RLS 정책 + 서버 측 역할 검사 | 통합 테스트: 권한별 부정 접근 |
| REQ-NF-014 | CSRF 방어·SameSite 쿠키 | IMPLEMENT | Next.js Server Actions 기본 보호 + SameSite 쿠키 설정 | 통합 테스트: CSRF 시나리오 |
| REQ-NF-015 | 입력 검증·XSS 차단 | IMPLEMENT | 서버/클라이언트 입력 검증, React 기본 이스케이프 활용 | 통합 테스트: XSS 페이로드 검증 |
| REQ-NF-016 | 비밀키 환경변수 관리 | IMPLEMENT | 모든 비밀값은 Vercel 환경변수로 관리, 클라이언트 번들 미포함 | 빌드 산출물 검사 |
| REQ-NF-017 | 항공·호텔 원시 입력값 미보존 | IMPLEMENT | 서버 API·로그·분석 이벤트에 원시 입력값을 전달하지 않음(F2/F3와 동일) | 네트워크·코드 리뷰 |
| REQ-NF-018 | 개인정보 내보내기·탈퇴·삭제 요청 | EXCLUDED | 045와 동일 사유로 자동화 파이프라인·감사 로그 제외. 계정 상태 변경 수준까지만 지원 | 코드 리뷰(파이프라인 부재 확인) |

### 6.11 비기능 요구사항 — 안전·모더레이션 (REQ-NF-019~022)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-NF-019 | 신고 접수 응답 p95≤3s | IMPLEMENT | 단순 Supabase insert 경로로 설계 | Playwright: 신고 제출 응답시간 관찰 |
| REQ-NF-020 | 신고 1차 검토 24h 이내 90% | EXCLUDED | 코드로 보장할 수 없는 운영 SLA 지표. 신고 큐 UI(041)로 운영자 대응을 지원하는 것까지만 구현 | 코드 리뷰(운영 지표는 범위 밖 명시) |
| REQ-NF-021 | 글·요청·신고 속도 제한(429) | EXCLUDED | 별도 속도 제한 미들웨어는 1~12 범위 밖 | 코드 리뷰(rate limit 미구현 확인) |
| REQ-NF-022 | Moderator 조치 추적(감사 로그 누락 0) | EXCLUDED | 범용 감사 로그 제외 대상. 042의 `REPORT` 레코드 필드로 최소 추적만 유지 | 코드 리뷰(레코드 필드 확인) |

### 6.12 비기능 요구사항 — 접근성 (REQ-NF-023~025)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-NF-023 | WCAG 2.2 Level AA 목표 | IMPLEMENT | 시맨틱 HTML + shadcn/ui 접근성 프리미티브 사용 | axe 자동 검사 + 수동 점검 |
| REQ-NF-024 | 자동 접근성 검사(axe) | IMPLEMENT | Playwright + axe-core 통합으로 핵심 화면 스캔 | Playwright(axe) 스모크 테스트 |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | IMPLEMENT | 핵심 UC(`docs/02_SRS_BASELINE.md` 3.6절 UC-01~09)에 대한 수동 QA 체크리스트 수행 | 수동 QA 체크리스트 |

### 6.13 비기능 요구사항 — 콘텐츠·최신성·SEO·저작권 (REQ-NF-026~030)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | IMPLEMENT | 004/074의 데이터 검증 스크립트로 확인 | 유닛 테스트 |
| REQ-NF-027 | 해외 안전정보 커버리지 100% | IMPLEMENT | 046의 국가 커버리지 검증 스크립트로 확인 | 유닛 테스트 |
| REQ-NF-028 | 안전정보 7일 이내 확인 95%·초과 경고 100% | IMPLEMENT(부분) | 초과 시 경고 로직(050)은 구현하되, 95% 수치 자체는 운영 시점 데이터로 코드가 보장하지 않음 | Playwright: stale 경고 렌더링 확인 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | EXCLUDED | 라이선스 승인 워크플로 제외 대상. alt 텍스트 필수 기준으로 대체 | 코드 리뷰(라이선스 필드 부재 확인) |
| REQ-NF-030 | 공개 페이지 SEO 메타데이터 누락 0 | IMPLEMENT | 070과 동일 Metadata API 적용 | 자동 메타 검사 스크립트 |

### 6.14 비기능 요구사항 — 유지보수·모니터링·비용 (REQ-NF-031~034)

| ID | 요구사항 요약 | 상태 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|:---:|---|---|
| REQ-NF-031 | TypeScript strict·lint·unit test | IMPLEMENT | `tsconfig` strict 모드, ESLint, 유닛 테스트를 병합 전 필수 통과로 설정 | CI(lint/build/test) 실행 |
| REQ-NF-032 | 구조화 로그 | IMPLEMENT(축소) | 별도 로그 수집 파이프라인 없이 Vercel 기본 함수 로그를 활용 | 코드 리뷰(로그 출력 형식 확인) |
| REQ-NF-033 | 핵심 오류 5분 이내 알림 | EXCLUDED | 장애 알림 자동화 제외 대상 | 코드 리뷰(알림 연동 부재 확인) |
| REQ-NF-034 | 월 인프라 비용 10만원 이하 | IMPLEMENT | Vercel + Supabase 무료/저가 티어로 구성, EC2·AWS 등 별도 인프라 없음 | 배포 구성·요금제 확인 |

---

## 7. Playwright 핵심 Smoke Test 범위

다음 흐름을 최소 스모크 테스트로 커버한다.

1. 여행지 목록 → 필터 → 상세 → 안전정보 패널 이동
2. 항공 조건 입력 → 검증 오류 → 유효 입력 → 요약 → 외부 새 탭 이동
3. 호텔 조건 입력 → 검증 오류 → 유효 입력 → 요약 → 외부 새 탭 이동
4. 이메일 가입 → 로그인 → 성인 확인 → 동행글 작성(연락처 패턴 차단 포함) → 게시
5. 다른 계정으로 참가 요청 → 작성자 승인/거절 → 상태 반영 확인
6. 신고 제출 → 접수 확인, 차단 후 상호 노출 제한 확인
7. 관리자 탭에서 신고 상태 변경, 외부 URL 설정 변경
8. 대표 소개 페이지 수치·소개 일치 확인
9. 404/외부 연결 실패 등 오류 화면 복구 행동 확인
10. 핵심 화면에 대한 axe 접근성 검사(REQ-NF-024)

---

## 8. Vercel 배포

- `app` 디렉터리를 Vercel 프로젝트로 배포한다.
- 외부 URL(항공/호텔/SNS), Supabase 접속 정보는 Vercel 환경변수로 관리한다(REQ-FUNC-077, REQ-NF-016).
- 별도 EC2·AWS 인프라, 자동 백업·알림 파이프라인은 구성하지 않는다(5절 제외 기능).
