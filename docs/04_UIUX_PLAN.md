# Free Traveler — UI·UX 계획 (04_UIUX_PLAN)

| 항목 | 내용 |
|---|---|
| Document ID | UIUX-TRAVEL-001 |
| 기준 문서 | `docs/01_PRD.md`, `docs/02_SRS_BASELINE.md`, `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md` |
| 디자인 참고 | `design-reference/vendor/airbnb/DESIGN.md` (구조·톤 참고용, 상표 요소 미사용) |
| 작성일 | 2026-09-10 (2026-09-11 라우트 정합성 갱신, 2026-09-17 디자인 참고 경로 갱신) |
| 상태 | UI/UX Baseline |

> `docs/03_UI_COVERAGE_ANALYSIS.md`가 이후 작성되어 SCR-001~005의 라우트와 Screen 경계가 확정되었다(`/account` 통합, `/mates/new` 폐지 등). 이 문서는 해당 확정안에 맞춰 갱신되었다.

---

## 1. 문서 목적

이 문서는 Free Traveler의 5개 화면(SCR-001~005)에 대해 공통 디자인 시스템, Section 배치, 상태(Loading/Success/Empty/Error/Unauthorized)를 정의한다. `docs/PROJECT_SCOPE.md`가 정한 구현 범위(IMPLEMENT 항목)만을 화면으로 구체화하며, 새로운 기능 범위를 추가하지 않는다.

---

## 2. 브랜드와 디자인 원칙

### 2.1 Airbnb 참고 범위

`design-reference/vendor/airbnb/DESIGN.md`에서는 다음 **구조적 패턴만** 참고하고, Rausch 색상(#ff385c), Airbnb Cereal 서체, 말풍선 로고 등 상표 요소는 사용하지 않는다.

- 사진 중심 Card + 1개 포인트 컬러만 쓰는 절제된 배색 구조
- 알약형 검색바, 둥근 Card, 원형 아이콘 버튼 등 "각진 모서리 없음" 형태 언어
- 단일 Shadow Tier(그림자 단계 1개)로 입체감을 제한하는 방식
- Header 80px 높이, Footer 3단 링크 컬럼 구조
- 반응형 전략: 컬럼 수를 줄이되 행을 줄바꿈하지 않는 Grid Collapsing

### 2.2 색상 토큰

흰 배경 + 짙은 회색 텍스트 + 코랄 포인트 원칙에 따라 Airbnb의 Rausch와 구분되는 자체 코랄을 정의한다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `color.bg.canvas` | `#FFFFFF` | 페이지 기본 배경 |
| `color.bg.soft` | `#F7F6F4` | Section 교차 배경(짝수 Section 등) |
| `color.text.ink` | `#262626` | 제목·본문 기본 텍스트(짙은 회색, 순검정 아님) |
| `color.text.body` | `#4B4B4B` | 보조 본문 텍스트 |
| `color.text.muted` | `#767676` | 캡션, 메타 정보 |
| `color.border.hairline` | `#E5E3E0` | 카드·구분선 1px 테두리 |
| `color.brand.coral` | `#D03E1B` | 주요 CTA 배경·활성 탭 텍스트·브랜드 포인트(흰 배경 대비 4.79:1로 WCAG AA 통과) |
| `color.brand.coral-active` | `#B23417` | 코랄 버튼 press 상태(더 어둡게) |
| `color.brand.coral-bright` | `#FF6B4A` | 장식용 강조 전용(아이콘 하이라이트, 일러스트, 텍스트가 얹히지 않는 큰 배경 블록) — 흰 배경 대비 2.82:1로 텍스트·버튼 배경에는 사용하지 않음 |
| `color.brand.coral-tint` | `#FFE8E0` | 코랄 배경 위 아이콘, 배지 배경 |
| `color.brand.coral-disabled` | `#FFD3C2` | 비활성 CTA |
| `color.semantic.danger` | `#D7263D` | 오류, 중대 여행경보, 신고·차단 관련 경고(코랄과 명확히 구분되는 적색) |
| `color.semantic.warning` | `#B45309` (텍스트) / `#FFF4E0` (배경) | 안전정보 stale 경고, 주의 안내 |
| `color.semantic.success` | `#1A7F5A` (텍스트) / `#E6F6EF` (배경) | 참가 승인, 제출 완료 등 |
| `color.semantic.info-link` | `#2563EB` | 외교부 등 공식 출처 외부 링크, 정책 링크 |
| `color.focus.ring` | `#1D4ED8`, 2px, offset 2px | 키보드 포커스 표시(색상만으로 상태를 구분하지 않도록 항상 텍스트 라벨 병기) |

> 오류·경고·안전정보는 코랄이 아닌 `danger`/`warning` 토큰을 사용해 "브랜드 CTA"와 "위험 신호"가 시각적으로 섞이지 않게 한다.
> **대비 검증**: `color.brand.coral`(#D03E1B)은 흰 배경 위 흰 텍스트 버튼 기준 대비비 4.79:1로 REQ-NF-023(WCAG 2.2 AA, 4.5:1 기준)을 통과한다. 애초 후보였던 `#FF6B4A`는 2.82:1로 기준 미달이라 텍스트·버튼 배경에서 제외하고 `coral-bright`로 격하했다.

### 2.3 타이포그래피

한글 본문은 Inter + 시스템 한글 폰트 fallback을 사용한다.

```
font-family: "Inter", -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", sans-serif;
```

| 토큰 | 크기/행간 | 굵기 | 용도 |
|---|---|---|---|
| `type.display.xl` | 32/40px | 700 | Desktop Hero 제목 |
| `type.display.lg` | 26/34px | 700 | Desktop Section 제목(H2) |
| `type.display.md` | 22/30px | 600 | Mobile Hero·Section 제목 |
| `type.title` | 18/26px | 600 | Card 제목, Drawer 제목 |
| `type.body` | 16/24px | 400 | 본문, 설명 문단 |
| `type.body-sm` | 14/20px | 400 | Card 메타, 캡션, 날짜 |
| `type.button` | 16/24px | 600 | 버튼·탭 라벨 |
| `type.micro` | 12/16px | 600 | 배지, 상태 라벨(예: `모집중`, `마감`) |

### 2.4 형태·간격·Elevation

| 토큰 | 값 |
|---|---|
| `radius.sm` (버튼·인풋) | 8px |
| `radius.md` (Card) | 12px |
| `radius.lg` (Hero 패널, Drawer 모서리) | 16px |
| `radius.full` (Chip, 아바타, 원형 버튼) | 9999px |
| `space.xs / sm / md / lg / xl / 2xl` | 4 / 8 / 12 / 16 / 24 / 32px |
| `space.section-desktop` | 64~96px (Section 상하 여백) |
| `space.section-mobile` | 40~64px |
| `shadow.card` | `0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.08)` (단일 Tier, Card hover·Drawer·Dropdown에만 사용) |

### 2.5 접근성 공통 규칙

- 모든 인터랙티브 요소는 최소 44×44px 터치 영역을 확보한다(아이콘 버튼은 시각적 크기가 작아도 히트 영역을 44px로 확장).
- 키보드 포커스는 `color.focus.ring`으로 표시하고, Tab 순서는 시각적 순서와 일치시킨다.
- 여행경보 단계, 모집 상태 등은 색상 배지와 함께 텍스트 라벨을 항상 병기한다(색맹 사용자 대응).
- Drawer·Modal은 열림 시 포커스를 이동시키고, `Esc`와 닫기 버튼으로 복귀 가능해야 한다.

---

## 3. 레이아웃 기준

| 기준 | 값 |
|---|---|
| Desktop 설계 기준폭 | **1440px** |
| Mobile 설계 기준폭 | **390px** |
| Desktop 콘텐츠 최대 폭 | 1200~1280px(기준 1240px), 좌우 여백은 뷰포트가 늘어날수록 흡수 |
| Mobile 좌우 여백 | 16px |
| Desktop Section 상하 여백 | 64~96px |
| Mobile Section 상하 여백 | 40~64px, Card는 1열 |
| Hero 높이 | 풀 스크린 높이를 차지하지 않음. Desktop 기준 520~600px로 제한해 1440px 화면에서 다음 Section 시작부가 보이도록 함 |

### 3.1 반응형 구간

| 구간 | 폭 | 주요 변화 |
|---|---|---|
| Mobile | 360~743px(기준 390px) | Header는 로고+햄버거, Card 1열, Filter는 Bottom Sheet, 상세는 전체 화면 Drawer |
| Tablet | 744~1127px | Card 2열, Header 내비게이션 일부 노출 |
| Desktop | 1128~1439px | Card 3~4열, Header 전체 내비게이션 |
| Wide Desktop(기준) | 1440px | 콘텐츠 폭 1240px 고정, 좌우 여백 흡수 |

### 3.2 Header / Footer (5개 화면 공통)

**Header** (`height: 72px` Desktop / `56px` Mobile, 흰 배경 + 하단 1px hairline, sticky)
- 좌: "Free Traveler" 워드마크(텍스트 로고, 아이콘 없음)
- 중앙: 여행지(`/`) / 여행 준비(`/travel-tools`) / 동행 찾기(`/mates`) / 대표소개(`/about`) 내비게이션 — 안전정보는 별도 메뉴 없이 여행지 상세 Drawer에서 접근
- 우: 계정 영역(비로그인 시 "로그인" → `/account`, 로그인 시 프로필 아바타 → `/account` 드롭다운)
- Mobile: 로고 + 햄버거. 탭하면 전체 화면 내비게이션 시트

**Footer** (흰 배경, 3단 컬럼 Desktop / 1단 Mobile)
- 서비스: 여행지, 항공·호텔·동행 찾기, 동행 찾기, 대표 소개
- 정책: 이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내
- 고객지원: 문의, 신고 안내
- 하단 밴드: 저작권 문구, "Free Traveler는 항공·호텔 예약을 대행하지 않으며 외부 사이트로 안내합니다" 고지

---

## 4. 상태 정의 원칙

Dashboard·복잡한 통계 화면은 만들지 않는다. 상태는 화면마다 필요한 것만 정의한다.

| 상태 | 기본 처리 방식 |
|---|---|
| Loading | Card·목록 형태를 유지하는 Skeleton(회색 블록), 문구 없이 형태만 유지 |
| Success | 정상 콘텐츠 표시 |
| Empty | "데이터 없음"만 보여주지 않고, 안내 문장 + 이용 방법 + 다음 행동 CTA를 항상 함께 표시 |
| Error | 실패 사유를 짧은 문장으로 안내하고 재시도 버튼 제공(동일 탭 유지) |
| Unauthorized | 로그인/성인 확인이 필요한 이유를 안내하고 `/account`로 이동하는 CTA 제공 |

---

## 5. 화면별 상세

### 5.1 SCR-001 — 홈 (`/`)

**목적**: 여행지 발견 → 조건 정리(`/travel-tools`) → 동행(`/mates`) → 대표 신뢰(`/about`)로 이어지는 진입점. **Section 7개.**
**관련 요구사항**: REQ-FUNC-001~003, 006, 046, 057, 064 등(`docs/PROJECT_SCOPE.md` 2절 SCR-001, `docs/03_UI_COVERAGE_ANALYSIS.md` 4절 SCR-001 참조)

| # | Section | 패턴 | 콘텐츠 | CTA / 이동 |
|---|---|---|---|---|
| 1 | 검색 Hero | Hero(비-풀스크린) | "어디로 떠날까요? 국가, 도시, 테마로 여행지를 검색해 보세요." 검색창(여행지명·국가명·테마 키워드와 국가별 안전정보 페이지를 함께 검색, REQ-FUNC-067) + 계절·기간 Filter 컨트롤(REQ-FUNC-002, 제출 시 같은 화면(`/?q=`)에서 결과 Section으로 스크롤·필터링) | 검색창 옆 "여행 조건 정리하기" 버튼 → `/travel-tools` |
| 2 | 국내 인기 여행지 | Card Grid 3×2(Desktop) / 1열 가로 스크롤(Mobile) | "가까운 곳에서도 충분히 낯선 하루를 만날 수 있어요." 국내 여행지 6개 Card(사진, 지역명, 한 줄 요약, 우상단 즐겨찾기 하트 아이콘 — REQ-FUNC-068) | Card 클릭 → 같은 화면 상세 Drawer, 하트 아이콘 클릭 → 즐겨찾기 추가/해제(로그인 불필요, `localStorage`) |
| 3 | 해외 인기 여행지 | Card Grid 3×2 / 1열 | "첫 해외여행부터 다섯 번째 도쿄까지, 검증된 여행지만 모았어요." 해외 여행지 6개 Card(즐겨찾기 하트 아이콘 포함) | Card 클릭 → 같은 화면 상세 Drawer, 하트 아이콘 클릭 → 즐겨찾기 추가/해제 |
| 4 | 여행 동기·테마 | Chip 목록 | "무엇을 위한 여행인가요?" 휴양·액티비티·미식·가족여행·나 홀로·문화탐방 등 6개 Chip | Chip 클릭 → 같은 화면의 여행지 결과 Section을 테마로 필터링 |
| 5 | 국가별 주의사항 | Card Grid 3×2 + Drawer | "떠나기 전 최소한으로 확인할 것들." 국가 6개 Card(국기·경보단계 라벨·최종 확인일) | Card 클릭 → 같은 화면의 안전정보 Drawer(요약)에서 "자세히 보기" 선택 시 Drawer가 Modal로 확장되어 8개 카테고리 전문 표시(별도 라우트 없음) |
| 6 | 최근 동행글 | Card ×3 또는 Empty State | 데이터 있으면 최근 모집중 글 3개 Card(제목, 국가·기간, 모집 인원). 데이터 없으면 "아직 등록된 동행글이 없어요" + 이용 방법(로그인→성인확인→글쓰기) 3단계 + 글쓰기 CTA | "동행 더 보기" → `/mates`, 비로그인 시 글쓰기 CTA는 `/account`로 연결 |
| 7 | free_traveler 요약 | 좌우 분할 | 좌: 대표 사진(alt: "동남아 사원 앞에 선 free_traveler의 여행 사진"), 우: "50회 넘게 떠나고, 30개국 넘게 걸었습니다." + `50+ Trips` `30+ Countries` 수치, 소개 한 문단 | "대표 이야기 더 보기" → `/about` |

**상태**: Loading(2~6 Section Skeleton) · Success · Empty(Section 6만 해당) · Error(여행지 데이터 로드 실패 시 Section 2·3·5 개별 재시도 배너). Unauthorized 없음(전체 공개).

---

### 5.2 SCR-002 — 대표 소개 (`/about`)

**목적**: `free_traveler`의 경험과 편집 기준을 신뢰하도록 소개. **Section 7개.**
**관련 요구사항**: REQ-FUNC-057~063

| # | Section | 패턴 | 콘텐츠 | CTA |
|---|---|---|---|---|
| 1 | Hero | Hero(비-풀스크린) | 대표 사진(alt: "파리 에펠탑을 배경으로 걷고 있는 free_traveler")과 "많이 본 여행보다 감당할 수 있는 속도로 이해한 여행을 씁니다." | 없음(신뢰 형성용) |
| 2 | 여행 지표 | 통계 Card 2~3개 | `50+ Trips`, `30+ Countries`, "아시아·유럽·북미·오세아니아" 여행 권역 요약 | 없음 |
| 3 | 소개 | 좌우 분할 텍스트 | 자기소개, 여행을 시작한 이유, 여행 철학을 2~4개 문단으로 구성(인용구 스타일로 철학 문장 강조) | 없음 |
| 4 | 여행 Timeline | 세로 Timeline(Desktop) / 스택형(Mobile) | 6개 이상 시점(연도, 장소, 한 줄 회고) | 없음 |
| 5 | 방문 국가 | Chip/목록(권역별 그룹) | 아시아·유럽·북미·오세아니아로 묶은 30개국 Chip | Chip 클릭 → `/`(SCR-001)로 이동해 해당 국가의 안전정보 Drawer를 열거나 관련 여행지로 연결 |
| 6 | 여행 사진 Gallery | 모자이크 Grid(8장 이상) | 서로 다른 장소의 사진 8장 이상, 각 alt에 실제 장소 명시(예: "발리 우붓 계단식 논") | 없음 |
| 7 | 기억에 남는 여행지 | Card Grid 4개 + CTA Banner | 추천 여행지 4개 Card | "여행 조건 정리하기" `/travel-tools`, "동행 찾아보기" `/mates` |

**상태**: Success 중심(정적 데이터). Loading(이미지 지연 로드 Skeleton). Error(이미지 로드 실패 시 대체 플레이스홀더 + alt 유지). Empty/Unauthorized 없음.

---

### 5.3 SCR-003 — 통합 여행 준비 (`/travel-tools`)

**목적**: 항공·숙소 조건 입력 후 요약·외부 이동, 동행 구하기 진입을 한 화면에서 안내. **Section 6개.**
**관련 요구사항**: REQ-FUNC-011~026, 027~031, 080
**라우트 확정**: `docs/03_UI_COVERAGE_ANALYSIS.md`가 `/travel-tools`를 항공·숙소·동행 작성 3개 탭으로 고정했고, `docs/PROJECT_SCOPE.md`도 이에 맞춰 갱신되었다. 대상 요구사항(REQ-FUNC-011~026)과 검증 범위는 동일하며, 화면 구성만 통합한다.

| # | Section | 패턴 | 콘텐츠 |
|---|---|---|---|
| 1 | Intro | 텍스트 Section | "항공·숙소는 조건만 정리해 외부 사이트로 안내하고, 동행은 이 화면에서 바로 구할 수 있어요." 이용 순서 3단계 요약 |
| 2 | 탭 | Tabs | `항공편 찾기` / `숙소 찾기` / `동행 구하기` 3개 탭, 각 탭은 입력·검증·완료 상태를 독립적으로 유지 |
| 3 | 조건 입력 Form | Form(항공·숙소 탭 공용 패턴) | 국가·지역·출발일(체크인)·귀국일(체크아웃) 입력, 실시간 검증 오류 |
| 4 | 입력 요약 + 외부 이동 | Action Card | 국가·지역·기간 요약 카드 + "항공편 보러 가기"/"호텔 보러 가기" 버튼(새 탭, `noopener,noreferrer`) |
| 5 | 비전달 고지 + Tip | 3단계/번호 안내 | "입력값은 외부 사이트로 전달되지 않습니다" 고지 + "안전정보는 참고용이며 출국 전 공식 출처에서 재확인하세요"(REQ-FUNC-054) + 항공·숙소 찾기 Tip 3개(예: "가격은 날짜에 따라 달라지니 외부 사이트에서 2~3일 범위로 비교해 보세요") |
| 6 | 동행 탭 콘텐츠 | 조건부 Form/안내 | 비로그인: "동행 글을 쓰려면 로그인과 성인 확인이 필요해요" 안내 + `/account` CTA. 로그인·성인확인 회원: 이 탭 안에서 완결되는 동행글 작성 Form(제목·국가·지역·기간·모집인원·설명·안전수칙 동의) + 안전 안내(연락처 비공개, 신고·차단 가능) |

**상태(탭별로 분리)**
- 항공편 탭: Idle → Validating(오류 표시) → Summary(Success) → Error(외부 URL 문제 시 재시도)
- 숙소 탭: 항공편 탭과 동일 구조
- 동행 탭: Unauthorized(Guest) / Idle·Validating·Success(Member, 안전수칙 동의 포함)

---

### 5.4 SCR-004 — 동행 찾기 (`/mates`)

**목적**: 조건에 맞는 동행글 탐색과 신청. **Section 6개.**
**관련 요구사항**: REQ-FUNC-029~040

| # | Section | 패턴 | 콘텐츠 |
|---|---|---|---|
| 1 | Intro | 텍스트 Section + CTA | "일정과 스타일이 맞는 동행을 찾아보세요. 연락처는 공개되지 않습니다." + "동행글 쓰기" CTA(→ `/travel-tools` 동행 구하기 탭, 비로그인 시 `/account`로 연결) |
| 2 | Filter + 결과 요약 | Filter Bar | 국가·지역·기간·모집 상태 필터, "총 N개의 모집글이 있어요" 결과 요약 문장 |
| 3 | 동행글 목록 | Card Grid(최대 8개 우선 노출) | 데이터가 있으면 모집중 글을 최신순 최대 8개 Card로 노출, 이후 "더 보기" 페이지네이션 |
| 4 | 목록+상세 | 좌우 분할(Desktop) / 목록→상세 Drawer(Mobile) | Desktop은 좌측 목록·우측 상세 패널 동시 표시, Mobile은 Card 탭 시 전체 화면 Drawer로 상세 표시 |
| 5 | 참가 신청 방법 | 3단계 안내 | ① 조건 확인 → ② 비공개 메시지로 참가 요청 → ③ 작성자 승인 후 연결 |
| 6 | 안전 안내 + CTA Banner | CTA Banner | "공개 연락처 요청, 금전 요구는 즉시 신고해 주세요." 신고·차단 방법 안내 + "여행 조건도 함께 정리하기" `/travel-tools` CTA |

**상태**: Loading(목록 Skeleton) · Success · **Empty**(필터 결과 없음 또는 전체 데이터 없음 모두 "조건에 맞는 동행글이 없어요" + 필터 초기화 버튼 + 이용 방법 3단계 + 글쓰기 CTA를 함께 표시) · Error(목록 로드 실패 재시도) · Unauthorized(신청 또는 글쓰기 이동 시도 시에만 `/account` 안내, 열람 자체는 Guest도 가능)

---

### 5.5 SCR-005 — 계정·관리 (`/account`)

**목적**: 역할(Guest/Member/Admin)에 따라 필요한 기능만 노출하는 단일 계정 허브. 화면 성격상 7/6 Section 규칙 대신 **역할별 탭 구성**을 따른다.
**공통 규칙**: 하나의 라우트(`/account`) 안에서 역할에 따라 탭 구성이 달라지며, 역할에 없는 탭·블록은 렌더링하지 않는다. Dashboard·통계 화면 없음.

**Guest 탭**

| 블록 | 내용 |
|---|---|
| 계정 기능 Intro | "로그인하면 동행글 작성, 참가 요청, 즐겨찾기를 이용할 수 있어요." |
| 로그인 / 가입 / 비밀번호 재설정 Card | 3개 Card 또는 Tab 전환형 Form |
| 로그인 후 가능한 기능 | Chip 또는 목록: 동행글 작성, 참가 요청, 즐겨찾기, 내 활동 관리 |
| 보안 안내 | 개인정보 처리방침 링크, "성인(만 19세 이상) 확인은 가입 후 별도로 진행됩니다" 안내 |

**Member 탭**

| 블록 | 내용 | Empty 처리 |
|---|---|---|
| 프로필·성인 확인 요약 | 닉네임, 연령대, 성인 확인 상태 배지 | — |
| 내 글 | 내가 쓴 동행글 목록(상태 배지: 모집중/마감) | "아직 쓴 글이 없어요" + 글쓰기 CTA(→ `/travel-tools` 동행 구하기 탭) |
| 참가 요청 | 보낸 요청 / 받은 요청 탭, 상태(PENDING/ACCEPTED/REJECTED). 받은 요청 탭에서 작성자가 승인·거절 | "받은 요청이 없어요" 안내 |
| 즐겨찾기 | 즐겨찾기한 여행지 Card | "즐겨찾기한 여행지가 없어요" + `/`(메인) 이동 CTA |
| 차단 목록 | 차단한 사용자 목록, 해제 버튼 | "차단한 사용자가 없어요" 안내 |
| 새 동행글 작성 CTA | 상시 노출 버튼 → `/travel-tools`(동행 구하기 탭) | — |

**Admin 탭**

| 블록 | 내용 |
|---|---|
| 관리 Intro | "관리자는 신고 처리와 외부 사이트 주소 설정만 담당합니다." (콘텐츠 CRUD·통계 없음을 명시) |
| 신고 상태 변경 | 신고 큐 목록(OPEN/REVIEWING/RESOLVED/DISMISSED 필터), 상세에서 조치 선택 |
| 외부 URL 설정 | 항공·호텔·SNS 외부 URL 입력 Form(HTTPS만 허용, 저장 전 검증) |

**상태**: Guest(Unauthorized가 기본값 자체), Member(Loading/Success/Empty 중심), Admin(Loading/Success/Empty(신고 없음 시 "처리할 신고가 없어요")/Error(저장 실패)).

---

## 6. 공통 컴포넌트 목록

| 컴포넌트 | 설명 |
|---|---|
| Header / Footer | 3절 참조, 5개 화면 공통 |
| Card(여행지/동행글/국가) | `radius.md`, `shadow.card`(hover 시), 사진+제목+메타 2~3줄 |
| Drawer | Desktop 사이드 패널(480px 폭) / Mobile 전체화면. 열림 시 포커스 이동, `Esc` 닫기 |
| Chip | `radius.full`, 선택 시 코랄 배경 + 흰 텍스트, 비선택 시 hairline 테두리 |
| Tabs | 밑줄형 활성 탭(코랄), 비활성은 muted 텍스트 |
| Form(Input/Select/DatePicker) | `radius.sm`, 포커스 시 2px ink 테두리 + focus ring |
| Button(Primary/Secondary/Tertiary) | Primary는 코랄 배경, Secondary는 ink 아웃라인, Tertiary는 텍스트형 |
| Toast | 화면 우하단(Desktop)/상단(Mobile), 참가 요청·신고 접수 등 알림에 사용(REQ-FUNC-043) |
| Empty State Block | 아이콘 없이 제목+설명 1~2문장+CTA로 구성, 빈 여백 최소화 |
| Badge(경보·모집상태) | 색상 + 텍스트 라벨 병기 |

---

## 7. 콘텐츠 작성 규칙

- 모든 제목·설명은 완성된 한국어 문장으로 작성하고, `준비 중`·`정보 확인 필요`·Lorem ipsum을 사용하지 않는다.
- 데이터가 없는 상태도 4절의 Empty 원칙에 따라 안내 문장 + 이용 방법 + CTA를 반드시 포함한다.
- 인터넷 사진은 장소가 드러나는 구체적 alt 텍스트를 쓴다(예: "치앙마이 도이수텝 사원의 황금 불탑" — "여행 사진" 같은 일반 표현 금지).

---

## 8. Section 패턴 사용 현황(중복 점검)

| 패턴 | 사용 화면·Section |
|---|---|
| Hero(비-풀스크린) | SCR-001 §1, SCR-002 §1 |
| Card Grid | SCR-001 §2·3·5, SCR-002 §7, SCR-004 §3 |
| 좌우 분할 | SCR-001 §7, SCR-002 §3, SCR-004 §4 |
| Chip 목록 | SCR-001 §4, SCR-002 §5 |
| 3단계/번호 안내 | SCR-003 §5, SCR-004 §5 |
| CTA Banner | SCR-002 §7, SCR-004 §6 |
| Tabs | SCR-003 §2 |
| Timeline | SCR-002 §4 |
| Gallery(모자이크) | SCR-002 §6 |
| Filter Bar | SCR-004 §2 |

같은 화면 안에서 Card Grid만 반복되지 않도록 화면당 최소 2개 이상의 서로 다른 패턴을 교차 배치했다.

---

## 9. 다음 단계

- 이 문서의 Section·상태 정의는 `docs/PROJECT_SCOPE.md` 7절 Playwright Smoke Test 시나리오와 1:1로 매핑되어야 한다(예: SCR-004 §4 좌우 분할/Drawer 동작은 Smoke 시나리오 5 "참가 요청" 흐름에서 함께 검증).
- `/travel-tools`, `/account` 통합 라우트는 `docs/03_UI_COVERAGE_ANALYSIS.md`와 `docs/PROJECT_SCOPE.md` 2절에 반영을 완료했다. 이후 라우트를 변경할 때는 세 문서를 함께 갱신한다.
