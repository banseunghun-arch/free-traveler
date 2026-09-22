# Free Traveler Design System — D-001 (Design Canon)

| 항목 | 내용 |
|---|---|
| Document ID | DESIGN-D001-TRAVEL-001 |
| 버전 | D-001 |
| 상태 | **LOCKED** |
| 기준 문서 | `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md` |
| 참고(구조·톤만) | `design-reference/vendor/airbnb/DESIGN.md` — 상표 요소(Rausch #ff385c, Airbnb Cereal, 말풍선 로고 등)는 제외하고 형태 언어만 참고 |
| 승인된 Stitch Screen | SCR-001~005 (Mobile 변형: SCR-001, SCR-003) — `docs/STITCH_VALIDATION_REPORT.md` 기준 |
| 작성일 | 2026-09-19 |

> 이 문서는 Free Traveler UI의 **단일 정본(Single Source of Truth)** 이다. 여기 없는 값·컴포넌트를 화면에 추가할 수 없으며, 추가가 필요하면 이 문서를 먼저 갱신(버전 승격)한 뒤 적용한다.

---

## 1. Visual Theme

흰 배경(bg.canvas) 위에 짙은 잉크 텍스트, 단일 포인트 컬러(코랄)만 쓰는 절제된 사진 중심 마켓플레이스 톤. Airbnb의 **구조적 패턴**(알약형 검색바, 둥근 사진 카드, 단일 Shadow Tier, Header/Footer 그리드, 반응형 컬럼 축소 전략)만 참고하고, Rausch 레드·Airbnb Cereal 서체·말풍선 로고·Homes/Experiences/Services 탭 구조 등 **상표·고유 패턴은 사용하지 않는다.** 이 제품은 예약 대행 마켓플레이스가 아니라 "탐색 + 연결(외부 이동)" 서비스이므로, 예약/결제/장바구니 UI가 존재하지 않는다는 점이 Airbnb류 UI와의 가장 큰 구조적 차이다.

---

## 2. Color Token

| 토큰 | 값 | 용도 |
|---|---|---|
| `color.bg.canvas` | `#FFFFFF` | 페이지 기본 배경 |
| `color.bg.soft` | `#F7F6F4` | Section 교차 배경(짝수 Section 등) |
| `color.text.ink` | `#262626` | 제목·본문 기본 텍스트(순검정 아님) |
| `color.text.body` | `#4B4B4B` | 보조 본문 텍스트 |
| `color.text.muted` | `#767676` | 캡션, 메타 정보 |
| `color.border.hairline` | `#E5E3E0` | 카드·구분선 1px 테두리 |
| `color.brand.coral` | `#D03E1B` | 주요 CTA 배경·활성 탭 텍스트·브랜드 포인트(흰 배경 대비 4.79:1, WCAG AA 통과) |
| `color.brand.coral-active` | `#B23417` | 코랄 버튼 press 상태 |
| `color.brand.coral-bright` | `#FF6B4A` | 장식용 강조 전용(아이콘 하이라이트) — 대비 2.82:1로 텍스트·버튼 배경 금지 |
| `color.brand.coral-tint` | `#FFE8E0` | 코랄 배경 위 아이콘, 배지 배경 |
| `color.brand.coral-disabled` | `#FFD3C2` | 비활성 CTA |
| `color.semantic.danger` | `#D7263D` | 오류, 중대 여행경보, 신고·차단 경고 — 코랄과 절대 혼용 금지 |
| `color.semantic.warning` | 텍스트 `#B45309` / 배경 `#FFF4E0` | 안전정보 stale 경고 |
| `color.semantic.success` | 텍스트 `#1A7F5A` / 배경 `#E6F6EF` | 참가 승인, 제출 완료 |
| `color.semantic.info-link` | `#2563EB` | 외부 공식 출처 링크 |
| `color.focus.ring` | `#1D4ED8`, 2px, offset 2px | 키보드 포커스 |

**규칙**: 위 표에 없는 색상은 임의로 추가하지 않는다. 새 색상이 꼭 필요하면 이 문서에 토큰으로 먼저 등록(버전 승격)한 뒤 사용한다.

---

## 3. Typography

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
| `type.micro` | 12/16px | 600 | 배지, 상태 라벨(`모집중`, `마감` 등) |

Inter는 Google Fonts 오픈소스 서체다. **Proprietary(라이선스 제한) 폰트 파일은 사용하지 않는다** — 시스템 한글 폰트 fallback으로 대체한다.

---

## 4. Spacing

| 토큰 | 값 |
|---|---|
| `space.xs / sm / md / lg / xl / 2xl` | 4 / 8 / 12 / 16 / 24 / 32px |
| `space.section-desktop` | 64~96px (Section 상하 여백) |
| `space.section-mobile` | 40~64px |

---

## 5. Radius

| 토큰 | 값 |
|---|---|
| `radius.sm` | 8px — 버튼, 인풋 |
| `radius.md` | 12px — Card |
| `radius.lg` | 16px — Hero 패널, Drawer 모서리 |
| `radius.full` | 9999px — Chip, 아바타, 원형 버튼, 검색바 |

---

## 6. Shadow

단일 Shadow Tier만 사용한다(Airbnb 구조 참고 — 입체감을 제한하는 방식).

```
shadow.card: 0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.08)
```

사용처: Card hover, Drawer, Dropdown. **2단계 이상의 Elevation(그림자 단계)을 만들지 않는다.**

---

## 7. Header · Footer (5개 화면 공통)

**Header** — `height: 72px`(Desktop) / `56px`(Mobile), 흰 배경 + 하단 1px hairline, sticky.
- 좌: "Free Traveler" 텍스트 워드마크(아이콘 없음)
- 중앙: 여행지(`/`) / 여행 준비(`/travel-tools`) / 동행 찾기(`/mates`) / 대표소개(`/about`)
- 우: 비로그인 시 "로그인" → `/account`, 로그인 시 프로필 아바타 → `/account`
- Mobile: 로고 + 햄버거 → 전체 화면 내비게이션 시트

**Footer** — 흰 배경, 3단(Desktop) / 1단(Mobile).
- 서비스 / 정책(이용약관·개인정보처리방침·동행 안전수칙·콘텐츠 면책) / 고객지원
- 하단 밴드: 저작권 + "Free Traveler는 항공·호텔 예약을 대행하지 않으며 외부 사이트로 안내합니다" 고지

---

## 8. Search · Filter

- **검색바**: 알약형(`radius.full`), 흰 배경, 1px hairline, 정지 시 `shadow.card`. 여행지명·국가명·테마 키워드와 국가별 안전정보를 함께 검색.
- **Filter Bar**(SCR-004): 국가·지역·기간·모집 상태 필터. 결과 위에 "총 N개의 모집글이 있어요" 요약 문장 병기.
- **계절·기간 Filter**(SCR-001 Hero): 검색창과 인라인 결합, 제출 시 같은 화면 내 결과로 스크롤.

---

## 9. Destination Card

- `radius.md`, `shadow.card`(hover 시에만), 사진 + 제목 + 메타 2~3줄.
- 우상단 즐겨찾기 하트 아이콘(로그인 불필요, `localStorage`).
- 국내/해외 Grid는 Desktop 3×2, Mobile 1열 가로 스크롤.
- 사진 alt는 실제 장소를 설명하는 구체적 텍스트("치앙마이 도이수텝 사원의 황금 불탑" 등 — "여행 사진" 같은 일반 표현 금지).

---

## 10. Form · Tabs

- **Tabs**: 밑줄형, 활성 탭은 코랄 텍스트 + 코랄 밑줄, 비활성은 muted 텍스트. SCR-003은 "항공편 찾기 / 숙소 찾기 / 동행 구하기" 정확히 3탭이며 각 탭은 입력·검증·완료 상태를 독립적으로 유지한다.
- **Form(Input/Select/DatePicker)**: `radius.sm`, 포커스 시 2px ink 테두리 + focus ring. 국가 선택 시 지역 옵션이 재계산되고, 과거·역전 날짜는 제출을 차단한다.
- 폼 제출 실패 시 오류는 `color.semantic.danger`로, 코랄과 절대 혼용하지 않는다.

---

## 11. Mate Post Card (동행글 Card)

- 제목, 국가·기간, 모집 인원, 모집 상태 배지(`모집중`/`마감` — 색상 + 텍스트 라벨 병기, `type.micro`).
- 연락처는 절대 노출하지 않는다(비공개 메시지 시스템으로만 연결).
- SCR-004 목록은 최대 8개 우선 노출 후 "더 보기" 페이지네이션.
- SCR-004는 Desktop에서 목록(좌)+상세(우) 동시 분할, Mobile은 목록 → 상세 전체화면 Drawer로 전환.

---

## 12. Drawer · Modal

- Desktop: 사이드 패널(480px 폭). Mobile: 전체화면.
- 열림 시 포커스 이동, `Esc` 및 닫기 버튼으로 복귀 가능.
- 여행지 상세 Drawer 내부에서 "자세히 보기" 선택 시 안전정보 Drawer가 Modal로 확장되어 8개 필수 카테고리를 표시한다(별도 라우트 없음).

---

## 13. Alert · Toast

- **Toast**: 화면 우하단(Desktop) / 상단(Mobile). 참가 요청 접수, 신고 접수 등 즉시성 알림에만 사용.
- **Alert(안전정보)**: 7일 초과 stale 시 `color.semantic.warning`, 중대 경보는 상단 고정 텍스트 표시. 배지는 항상 색상 + 텍스트 라벨을 함께 표기한다(색맹 사용자 대응).

---

## 14. Loading · Empty · Error 상태

| 상태 | 처리 방식 |
|---|---|
| Loading | Card·목록 형태를 유지하는 회색 블록 Skeleton, 문구 없이 형태만 유지 |
| Success | 정상 콘텐츠 표시 |
| Empty | "데이터 없음"만 보여주지 않는다 — **안내 문장 + 이용 방법 + 다음 행동 CTA를 항상 함께 표시** |
| Error | 실패 사유를 짧은 문장으로 안내 + 재시도 버튼(동일 탭 유지) |
| Unauthorized | 로그인/성인 확인 필요 이유 안내 + `/account` 이동 CTA |

---

## 15. Desktop · Mobile 규칙

| 구간 | 폭 | 주요 변화 |
|---|---|---|
| Mobile | 360~743px(기준 390px) | Header 로고+햄버거, Card 1열, Filter는 Bottom Sheet, 상세는 전체화면 Drawer |
| Tablet | 744~1127px | Card 2열, Header 내비게이션 일부 노출 |
| Desktop | 1128~1439px | Card 3~4열, Header 전체 내비게이션 |
| Wide Desktop(기준) | 1440px | 콘텐츠 폭 1240px 고정, 좌우 여백 흡수 |

반응형 전략은 **컬럼 수만 줄이고 행을 줄바꿈하지 않는 Grid Collapsing**을 따른다.

---

## 16. Page Section 최대 폭과 상하 여백

- **Desktop 설계 기준폭**: 1440px. **콘텐츠 최대 폭**: 1200~1280px(기준 1240px), 뷰포트가 늘어날수록 좌우 여백이 흡수.
- **Mobile 설계 기준폭**: 390px, 좌우 여백 16px.
- **Section 상하 여백**: Desktop 64~96px / Mobile 40~64px.

---

## 17. Hero 높이 규칙

Hero는 **풀스크린 높이를 차지하지 않는다.** Desktop 기준 520~600px로 제한해, 1440px 화면에서 스크롤 없이 **다음 Section의 시작부가 보이도록** 한다. Hero 직후에 긴 빈 공간이 있어서는 안 된다.

---

## 18. Section 제목·설명·본문·CTA 계층과 시각적 리듬

- 모든 Section은 **제목 → 1~3문장 설명 → 실제 콘텐츠 또는 명확한 CTA** 순서를 갖는다.
- 제목·설명은 완성된 한국어 문장으로 작성한다.
- 같은 화면 안에서 Card Grid만 반복 배치하지 않는다 — **Hero, Card Grid, 좌우 분할, Chip 목록, 3단계 안내, CTA Banner를 교차 사용**해 화면당 최소 2개 이상의 서로 다른 패턴을 쓴다.
- 짝수 Section은 `color.bg.soft` 배경으로 시각적 리듬을 만든다(선택적).

---

## 19. 화면별 Section 순서와 최소 콘텐츠 수

| Screen | Section 수 | 순서 및 최소 콘텐츠 수 |
|---|---|---|
| **SCR-001** (`/`) | 7 | ①검색 Hero ②국내 인기 여행지 Card×6 ③해외 인기 여행지 Card×6 ④여행 동기·테마 Chip×6 ⑤국가별 주의사항 Card×6+안전정보 Drawer ⑥최근 동행글 Card×3 또는 완성형 Empty State ⑦free_traveler 요약(50+ Trips/30+ Countries)+`/about` CTA |
| **SCR-002** (`/about`) | 7 | ①Hero ②여행 지표(50+Trips/30+Countries) ③소개 2~4문단 ④Timeline 6개 이상 ⑤방문 국가 30개국 권역별 Chip ⑥Gallery 사진 8장 이상(장소명 alt 필수) ⑦기억에 남는 여행지 Card×4+CTA |
| **SCR-003** (`/travel-tools`) | 6 | ①Intro(이용 순서 3단계) ②탭 3개(항공편 찾기/숙소 찾기/동행 구하기) ③조건 입력 Form ④입력 요약+외부 이동 Action Card ⑤비전달 고지+Tip 3개 ⑥동행 탭(로그인 안내 또는 작성 Form+안전 안내) |
| **SCR-004** (`/mates`) | 6 | ①Intro+글쓰기 CTA ②Filter+결과 요약 ③동행글 목록(최대 8개 우선 노출) ④목록+상세(Desktop 분할/Mobile Drawer) ⑤참가 신청 3단계 안내 ⑥안전 안내+CTA Banner |
| **SCR-005** (`/account`) | 역할별 탭 | Guest(계정 기능 Intro, 로그인/가입/비밀번호 재설정, 로그인 후 기능 안내, 보안 안내) / Member(프로필·성인확인 요약, 내 글, 참가 요청, 즐겨찾기, 차단 목록, 새 동행글 작성 CTA) / Admin(관리 Intro, 신고 상태 변경, 외부 URL 설정). **역할에 없는 탭은 렌더링하지 않는다.** |

Mobile 변형은 SCR-001, SCR-003에 대해서만 존재하며, 위와 동일한 Section 순서·콘텐츠 수를 유지하되 Card는 1열/가로 스크롤로 재배치한다.

---

## 20. 완성형 Empty State와 Placeholder 문구 금지 규칙

- 데이터가 없는 상태도 **안내 문장 + 이용 방법 + 다음 행동 CTA**를 항상 함께 표시한다("빈 화면"처럼 보이지 않게).
- **금지 문구**: `Lorem ipsum`, `준비 중`, `정보 확인 필요`, 의미 없는 반복 문구.
- **금지 요소**: 내용 없는 빈 Card, 과도한 빈 여백.
- 모든 제목·설명은 자연스러운 한국어 완성 문장으로 작성한다.

---

## 21. Do / Do Not

### Do
- 코랄(`color.brand.coral`) 포인트 컬러 1개만 브랜드 액센트로 사용한다.
- 사진 중심 Card + 절제된 배색 구조를 유지한다.
- Empty 상태에 항상 안내+이용방법+CTA를 포함한다.
- 안전정보·경보·차단 등 위험 신호는 `semantic.danger`/`semantic.warning`으로 코랄과 구분한다.
- 이미지 alt에 실제 장소를 명시한다.
- Section마다 서로 다른 시각 패턴을 교차 배치한다.
- 모든 인터랙티브 요소에 최소 44×44px 터치 영역을 확보한다.

### Do Not
- **Airbnb 상표 요소** 사용 금지: Rausch 레드(#ff385c), Airbnb Cereal 서체, 말풍선 로고, Homes/Experiences/Services 탭 패턴.
- **구매·예약·결제 UI** 금지: "예약하기"/"Reserve" 버튼, 장바구니, 결제 폼, 예약 확정 플로우. Free Traveler는 외부 사이트로 링크만 연결하며 자체적으로 예약·결제하지 않는다.
- **별점·리뷰 점수 위젯** 금지.
- **광고·스폰서 배너, 실시간 항공권/호텔 최저가 표시** 금지(외부 사이트 안내 문구는 허용).
- **복잡한 관리자 통계 대시보드** 금지(차트, KPI 그리드 없음) — Admin은 신고 큐와 외부 URL 설정 Form만 갖는다.
- **Proprietary Font 파일** 사용 금지 — Inter(오픈소스) + 시스템 한글 fallback만 사용한다.
- **이 문서에 없는 임의 색상 토큰 추가** 금지 — 필요 시 이 문서를 먼저 갱신한다.
- `Lorem ipsum`, `준비 중`, `정보 확인 필요` 등 미완성 placeholder 문구 금지.

---

## 22. 변경 이력

| 버전 | 날짜 | 내용 |
|---|---|---|
| D-001 | 2026-09-19 | 최초 작성. `docs/04_UIUX_PLAN.md` + 승인된 Stitch Screen(SCR-001~005) 기준으로 정본화, LOCKED 상태로 고정 |
