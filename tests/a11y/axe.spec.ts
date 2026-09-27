import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

/**
 * Accessibility Automated Scan — axe-core integration with Playwright.
 *
 * Scans 5 Free Traveler screens for WCAG 2.1 Level AA violations.
 * Does NOT auto-fix; reports violations for manual review.
 *
 * Run: npx playwright test tests/a11y/axe.spec.ts
 */

interface Screen {
  name: string;
  path: string;
}

const SCREENS: Screen[] = [
  { name: "메인 (SCR-001)", path: "/" },
  { name: "대표 소개 (SCR-002)", path: "/about" },
  { name: "여행 도구 (SCR-003)", path: "/travel-tools" },
  { name: "동행 찾기 (SCR-004)", path: "/mates" },
  { name: "계정 (SCR-005)", path: "/account" },
];

test.describe("A11Y — axe-core automated scan", () => {
  SCREENS.forEach((screen: Screen) => {
    test(`${screen.name} — critical/serious violations check`, async ({ page }) => {
      await page.goto(screen.path);
      await injectAxe(page);

      const results = await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: {
          html: true,
        },
      } as any);

      // Collect violations by impact level
      const violations = (results as any)?.violations || [];
      const critical = violations.filter((v: { impact: string }) => v.impact === "critical");
      const serious = violations.filter((v: { impact: string }) => v.impact === "serious");

      if (critical.length > 0 || serious.length > 0) {
        console.error(`❌ ${screen.name} — Violations detected:`);
        critical.forEach((v: { id: string; help: string }) => {
          console.error(`  CRITICAL: ${v.id} — ${v.help}`);
        });
        serious.forEach((v: { id: string; help: string }) => {
          console.error(`  SERIOUS: ${v.id} — ${v.help}`);
        });
      }

      // Assert 0 critical/serious violations
      expect(
        critical.length + serious.length,
        `${screen.name}에서 critical/serious 접근성 위반이 발견되었습니다. 위반 사항을 확인하고 수정하세요.`,
      ).toBe(0);
    });
  });
});
