# Free Traveler — UI Implementation Contract

| 항목 | 내용 |
|---|---|
| Document ID | UICONTRACT-TRAVEL-001 |
| 기준 문서 | `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md` |
| 대상 프레임워크 | Next.js App Router |
| 현재 `src/app` 구조 | `layout.tsx`, `page.tsx`(create-next-app 기본 스타터, 아직 미교체), `globals.css`만 존재 |
| 작성일 | 2026-09-19 |
| 상태 | Implementation Contract Baseline |

> 이 문서는 승인된 5개 Screen을 실제 Next.js 라우트/페이지로 옮길 때 지켜야 할 계약이다. 여기 기록되지 않은 영역·컴포넌트·이동 경로를 임의로 추가하지 않는다. 값의 출처는 `design-reference/D-001/DESIGN.md`(토큰·컴포넌트 규칙)와 `docs/04_UIUX_PLAN.md`(Section 배치·상태)다.

---

## SCR-001 — 메인 홈 (핵심)

| 항목 | 내용 |
|---|---|
| Screen ID | SCR-001 |
| Route | `/` |
| Page Entry | `src/app/page.tsx` |
| Tier | 핵심(Core) |

**영역 순서(Section, 7개)**
1. 검색 Hero — 검색창 + 계절·기간 Filter + "여행 조건 정리하기" CTA
2. 국내 인기 여행지 — Card Grid 6개
3. 해외 인기 여행지 — Card Grid 6개
4. 여행 동기·테마 — Chip 6개
5. 국가별 주의사항 — Card 6개 + 안전정보 Drawer 연결
6. 최근 동행글 — Card 3개 또는 완성형 Empty State
7. free_traveler 요약 — 좌우 분할, 50+ Trips/30+ Countries + `/about` CTA

**주요 Component**: 알약형 검색바, Filter 컨트롤, Destination Card(§9), Chip, Country Card + Drawer/Modal(§12), Empty State Block, Toast(즐겨찾기 토글 피드백 선택적)

**상태**: Loading(2~6 Section Skeleton) · Success · Empty(Section 6만) · Error(Section 2·3·5 개별 재시도 배너) · Unauthorized 없음(전체 공개)

**사용자 행동**
- 검색어·필터 제출 → 같은 화면(`/?q=`) 내 결과로 스크롤/필터링
- 여행지 Card 클릭 → 같은 화면 상세 Drawer 오픈
- 하트 아이콘 클릭 → 즐겨찾기 추가/해제(`localStorage`, 로그인 불필요)
- 테마 Chip 클릭 → 여행지 결과 Section 필터링
- 국가 Card 클릭 → 안전정보 Drawer(요약) → "자세히 보기" → Modal 확장(8개 카테고리)

**다른 화면으로의 이동**
- → SCR-003 `/travel-tools` ("여행 조건 정리하기")
- → SCR-004 `/mates` ("동행 더 보기")
- → SCR-002 `/about` ("대표 이야기 더 보기")
- → SCR-005 `/account` (비로그인 상태에서 동행글 쓰기 CTA 클릭 시)

**Desktop·Mobile 규칙**: Hero 520~600px(Desktop, 다음 Section 시작부가 보여야 함) · Card Grid Desktop 3×2 / Mobile 1열 가로 스크롤 · Mobile 변형 승인됨(`091258f8c984436794df249c5be12e36`)

**금지 기능**
- `starter_template_forbidden=true` — 현재 `src/app/page.tsx`의 create-next-app 기본 템플릿(Next.js 로고, "Deploy Now" 등)을 그대로 두지 않는다.
- Airbnb 상표, 예약·결제 UI, 별점, 광고, 실시간 가격, Lorem ipsum/"준비 중"/"정보 확인 필요", 빈 Card

---

## SCR-002 — 대표 소개 (보조)

| 항목 | 내용 |
|---|---|
| Screen ID | SCR-002 |
| Route | `/about` |
| Page Entry | `src/app/about/page.tsx` |
| Tier | 보조(Secondary) |

**영역 순서(Section, 7개)**
1. Hero — 대표 사진 + 소개 문장
2. 여행 지표 — 50+ Trips / 30+ Countries / 권역 요약 카드 2~3개
3. 소개 — 자기소개·시작 이유·철학 2~4문단
4. 여행 Timeline — 6개 이상 시점
5. 방문 국가 — 30개국, 권역별 Chip
6. 여행 사진 Gallery — 8장 이상(장소명 alt 필수)
7. 기억에 남는 여행지 — Card 4개 + CTA Banner

**주요 Component**: Hero image, Stat Card, Timeline(세로/스택형), Chip(권역 그룹), Gallery Grid, Destination Card, CTA Banner

**상태**: Success 중심(정적 데이터) · Loading(이미지 지연 로드 Skeleton) · Error(이미지 로드 실패 시 대체 플레이스홀더 + alt 유지) · Empty/Unauthorized 없음

**사용자 행동**
- 방문 국가 Chip 클릭 → 해당 국가 안전정보/여행지로 연결
- 추천 여행지 Card 클릭 → 상세로 연결
- CTA Banner 클릭

**다른 화면으로의 이동**
- → SCR-001 `/` (방문 국가 Chip·추천 여행지 클릭 시 상세 Drawer)
- → SCR-003 `/travel-tools` ("여행 조건 정리하기")
- → SCR-004 `/mates` ("동행 찾아보기")

**Desktop·Mobile 규칙**: Hero 비-풀스크린. **Mobile 변형 미승인**(현재 Desktop만 승인 상태 — `docs/STITCH_VALIDATION_REPORT.md` 기준).

**금지 기능**: Airbnb 상표, 예약·결제 UI, 별점, 광고, Lorem ipsum류 문구, 통계 차트/대시보드

---

## SCR-003 — 통합 여행 준비 (핵심)

| 항목 | 내용 |
|---|---|
| Screen ID | SCR-003 |
| Route | `/travel-tools` |
| Page Entry | `src/app/travel-tools/page.tsx` |
| Tier | 핵심(Core) |

**영역 순서(Section, 6개)**
1. Intro — 이용 순서 3단계 요약
2. 탭 — "항공편 찾기" / "숙소 찾기" / "동행 구하기" 정확히 3개
3. 조건 입력 Form — 국가·지역·출발일(체크인)·귀국일(체크아웃)
4. 입력 요약 + 외부 이동 Action Card — "항공편/호텔 보러 가기"(새 탭, `noopener,noreferrer`)
5. 비전달 고지 + Tip — 입력값 미전달 고지 + 안전정보 재확인 고지 + Tip 3개
6. 동행 탭 콘텐츠 — 비로그인: 로그인/성인확인 안내 + `/account` CTA. 로그인·성인확인 회원: 작성 Form(제목·국가·지역·기간·모집인원·설명·안전수칙 동의)

**주요 Component**: Tabs, Form(Input/Select/DatePicker), Action Card, 외부 링크 버튼, 동의 체크박스, 안내 배너

**상태**: 탭별 독립 — 항공/숙소 탭: Idle → Validating(오류 표시) → Summary(Success) → Error(외부 URL 문제 시 재시도) · 동행 탭: Unauthorized(Guest) / Idle·Validating·Success(Member)

**사용자 행동**
- 탭 전환(입력·검증·완료 상태 독립 유지)
- 국가 선택 → 지역 옵션 재계산, 날짜 검증(과거·역전 차단)
- 외부 사이트로 새 탭 이동
- 동행글 작성 제출(안전수칙 동의 필수)

**다른 화면으로의 이동**
- → 외부 항공/호텔 사이트(새 탭)
- → SCR-004 `/mates` (동행글 작성 완료 후) 또는 → SCR-005 `/account` (내 글 확인)
- → SCR-005 `/account` (비로그인 시 동행 탭 CTA)

**Desktop·Mobile 규칙**: **Mobile 변형 승인됨**(`549d79d85bfa4d95a198f4ecf3d217f8`) — Form 필드 세로 재배치, 탭은 가로 스크롤 또는 3등분

**금지 기능**: 예약·결제 UI, 입력값 서버 저장(REQ-FUNC-017/025 — 클라이언트 상태로만 처리), 실시간 항공권/호텔 가격 표시, Airbnb 상표, Lorem ipsum류 문구

---

## SCR-004 — 동행 찾기 (핵심)

| 항목 | 내용 |
|---|---|
| Screen ID | SCR-004 |
| Route | `/mates` |
| Page Entry | `src/app/mates/page.tsx` |
| Tier | 핵심(Core) |

**영역 순서(Section, 6개)**
1. Intro — "동행글 쓰기" CTA(비로그인 시 `/account`로 연결)
2. Filter + 결과 요약 — 국가·지역·기간·모집 상태 + "총 N개의 모집글이 있어요"
3. 동행글 목록 — 최대 8개 우선 노출 + "더 보기" 페이지네이션
4. 목록+상세 — Desktop 좌우 분할 / Mobile 목록→상세 전체화면 Drawer
5. 참가 신청 방법 — 3단계(조건 확인 → 비공개 메시지 → 작성자 승인)
6. 안전 안내 + CTA Banner — 신고·차단 방법 안내 + "여행 조건도 함께 정리하기"

**주요 Component**: Filter Bar, Mate Post Card(§11), 좌우 분할 패널/Drawer, 3단계 번호 안내, CTA Banner, 신고/차단 트리거

**상태**: Loading(목록 Skeleton) · Success · Empty(필터 결과 없음/전체 없음 — "조건에 맞는 동행글이 없어요" + 필터 초기화 + 이용 방법 3단계 + 글쓰기 CTA) · Error(재시도) · Unauthorized(신청·신고·차단 시도 시에만, 열람은 Guest도 가능)

**사용자 행동**
- 필터 적용
- Card 클릭 → 상세(Desktop 동시 표시 / Mobile Drawer)
- 참가 신청 제출(로그인 필요)
- 신고/차단 트리거

**다른 화면으로의 이동**
- → SCR-003 `/travel-tools` (동행 탭으로 글쓰기)
- → SCR-005 `/account` (신청 후 상태 확인, 비로그인 시 안내)

**Desktop·Mobile 규칙**: Desktop 좌우 분할 / Mobile Drawer 전환. **별도 Mobile Screen 승인 없음**(반응형 처리, `docs/STITCH_VALIDATION_REPORT.md`에 SCR-004 Mobile 변형 미포함 명시).

**금지 기능**: 연락처 노출(응답 데이터에 필드 자체 미포함), 예약·결제 UI, 별점, Airbnb 상표

---

## SCR-005 — 계정·관리 (핵심)

| 항목 | 내용 |
|---|---|
| Screen ID | SCR-005 |
| Route | `/account` |
| Page Entry | `src/app/account/page.tsx` |
| Tier | 핵심(Core) |

**영역 순서(역할별 탭 — Guest/Member/Admin, 역할에 없는 탭은 렌더링하지 않음)**
- **Guest**: 계정 기능 Intro → 로그인/가입/비밀번호 재설정 Card → 로그인 후 가능한 기능 안내 → 보안 안내
- **Member**: 프로필·성인확인 요약 → 내 글 → 참가 요청(보낸/받은) → 즐겨찾기 → 차단 목록 → 새 동행글 작성 CTA(상시 노출)
- **Admin**: 관리 Intro → 신고 상태 변경(OPEN/REVIEWING/RESOLVED/DISMISSED 큐) → 외부 URL 설정(HTTPS만 허용)

**주요 Component**: 로그인/가입/재설정 Form, 프로필 요약 카드, 내 글 Card(상태 배지), 참가 요청 목록(상태 배지), 즐겨찾기 Card, 차단 목록+해제 버튼, 신고 큐, 외부 URL Form

**상태**: Guest = Unauthorized가 기본 진입 상태 · Member/Admin = Loading/Success/Empty("아직 쓴 글이 없어요" 등 + CTA)/Error(저장 실패)

**사용자 행동**
- 로그인/가입/비밀번호 재설정
- 내 글 수정·마감·삭제
- 참가 요청 승인/거절
- 즐겨찾기 관리, 차단 해제
- (Admin) 신고 상태 변경, 외부 URL 저장

**다른 화면으로의 이동**
- 로그인 성공 시 이전 화면 또는 → SCR-001 `/`
- 새 동행글 작성 → SCR-003 `/travel-tools`(동행 탭)

**Desktop·Mobile 규칙**: **Mobile 변형 미승인**(Desktop만 승인 상태)

**금지 기능**: 복잡한 관리자 통계 대시보드(차트·KPI 그리드 금지 — 신고 큐·URL 설정 Form만), 콘텐츠 CRUD 화면, 범용 감사 로그 화면, Airbnb 상표, Lorem ipsum류 문구

---

## 기술 Route (5개 Screen 수에 미포함)

| 유형 | 예시 |
|---|---|
| 인증 콜백 | Supabase Auth 이메일 인증/비밀번호 재설정 콜백 |
| API Route | `src/app/api/**` (데이터 CRUD·조회 서버 엔드포인트) |
| 오류 처리 | `not-found.tsx`(404), 글로벌 오류 경계(500) |
| 정책 정적 페이지 | 이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내(Footer 링크, 경량 정적 텍스트) |

---

## 완료 조건 체크

| 조건 | 결과 |
|---|---|
| Route 중복 없음 | PASS — `/`, `/about`, `/travel-tools`, `/mates`, `/account` 5개 모두 고유 |
| Page Entry 중복 없음 | PASS — 5개 파일 경로 모두 고유 |
| Screen 수 5 | PASS |
| 핵심 4개·보조 1개 구분 존재 | PASS — 핵심: SCR-001·003·004·005, 보조: SCR-002 |
