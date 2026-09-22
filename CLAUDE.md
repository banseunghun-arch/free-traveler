# CLAUDE.md — Free Traveler

이 파일은 이 저장소에서 작업하는 모든 Agent(Claude Code 포함)를 위한 정본 규칙이다. 다른 Agent 규칙 파일(`AGENTS.md` 등)을 참조하지 않고, 필요한 규칙을 이 파일 안에 직접 기록한다.

## Harness Marker

```
HARNESS_SCHEMA=traveler-screen-route-v1
DESIGN_PATH=design-reference/D-001/DESIGN.md
SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json
PROJECT_SCOPE=docs/PROJECT_SCOPE.md
PLAYWRIGHT_ENABLED=true
PLAYWRIGHT_SCOPE=chromium-smoke
AUTO_MERGE=false
AWS_ENABLED=false
```

## 필수 규칙

1. 작업 전 `package.json`과 현재 Next.js 문서를 확인한다.
2. SRS 정본은 `docs/06_SRS_UIUX_REVISED.md`다.
3. Scope 분류 정본은 `docs/PROJECT_SCOPE.md`다.
4. 디자인 정본은 `design-reference/D-001/DESIGN.md`다.
5. Screen 정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`이다.
6. `/run-wave WXX`를 표준 개발 명령으로 사용한다.
7. Wave 내부 Task를 Depends On 순서로 한 번에 하나만 구현한다.
8. 현재 Task의 Expected Files 밖 파일은 수정하지 않는다.
9. Page Owner Task는 Page Entry에서 Component를 실제 조립한다.
10. SCR-001 완료 시 Next.js Starter를 제거한다.
11. SCR-003은 항공·숙소·동행 탭을 모두 조립한다.
12. 항공·숙소 입력값은 서버·DB·URL·로그·분석으로 보내지 않는다.
13. Supabase 쓰기는 Auth·동행·신고·설정 범위로 제한한다.
14. RLS를 우회하는 Client 코드를 작성하지 않는다.
15. Service Role Key를 Client에서 사용하지 않는다.
16. 여행지·안전·대표는 정적 Data를 사용한다.
17. Prisma·ORM·AWS·EC2를 추가하지 않는다.
18. Playwright는 핵심 Smoke만 작성한다.
19. EXCLUDED 기능을 임의로 구현하지 않는다.
20. destructive Git 명령을 임의로 사용하지 않는다.
21. 자동 PR·자동 Merge를 실행하지 않는다.
22. 사람의 Preview 확인 후 다음 화면 Wave로 진행한다.
23. 작업 완료 시 변경 파일·검증 결과·남은 제한사항을 보고한다.

## Task 완료 순서

Task 읽기 → 입력 확인 → 구현 → 관련 포맷·Unit Test → 필요 시 Playwright → Diff 확인 → 완료 보고
