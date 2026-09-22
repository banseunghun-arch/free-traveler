# Free Traveler — Design Manifest

| 항목 | 내용 |
|---|---|
| Active Design Version | **D-001** |
| Status | **LOCKED** |
| Active File | `design-reference/D-001/DESIGN.md` |
| Vendor Reference | `design-reference/vendor/airbnb/DESIGN.md` (구조·톤 참고 전용, 상표 요소 미사용) |
| 갱신일 | 2026-09-19 |

---

## Approved Screens

Stitch Project ID `4691318911121922919` ("Free Traveler") 기준, `docs/STITCH_VALIDATION_REPORT.md`에서 검증 완료된 화면만 승인 상태다.

| Screen | 라우트 | Screen ID | 상태 |
|---|---|---|---|
| SCR-001 (Desktop) | `/` | `c2ed364593af4faab86e15fd3de95ebe` | Approved |
| SCR-001 (Mobile) | `/` | `091258f8c984436794df249c5be12e36` | Approved |
| SCR-002 | `/about` | `f7fdd6612f8d4a2394409fbd08986c0b` | Approved |
| SCR-003 (Desktop) | `/travel-tools` | `2cd776729402470ab163404bd254820c` | Approved |
| SCR-003 (Mobile) | `/travel-tools` | `549d79d85bfa4d95a198f4ecf3d217f8` | Approved |
| SCR-004 | `/mates` | `6c4ed1448ee64002b40c0b8562ddd844` | Approved |
| SCR-005 | `/account` | `548f5df2d44340debf9b91b6b86384d0` | Approved |

## Mobile Variants

- SCR-001
- SCR-003

(SCR-002, SCR-004, SCR-005는 Mobile 변형이 승인 목록에 없음 — 향후 필요 시 별도 승인 절차를 거쳐 이 매니페스트를 갱신한다.)

---

## 잠금(LOCKED) 정책

`Status: LOCKED`인 동안 다음을 지킨다:

1. `design-reference/D-001/DESIGN.md`의 토큰·규칙을 위반하는 화면은 승인하지 않는다.
2. Approved Screens 표에 없는 Screen ID는 정본으로 취급하지 않는다(Stitch 프로젝트 내 미승인 중복/숨김 화면 다수 존재 — 무시할 것).
3. 새 버전(D-002 등)이 필요하면 `design-reference/D-00N/DESIGN.md`를 새로 만들고, 이 매니페스트의 `Active Design Version`·`Active File`·`Status`를 갱신해 전환한다. 기존 D-001 파일은 이력 보존을 위해 삭제하지 않는다.
4. Design.md에 없는 임의 색상·폰트·컴포넌트를 화면에 추가하지 않는다.

---

## 참고 문서

- `docs/04_UIUX_PLAN.md` — D-001의 1차 원본 소스(Section 배치·상태 정의)
- `docs/03_UI_COVERAGE_ANALYSIS.md` — 요구사항 → 5-Screen 배치 근거
- `docs/STITCH_VALIDATION_REPORT.md` — Approved Screens의 검증 근거(콘텐츠·금지요소 재검사 내역)
