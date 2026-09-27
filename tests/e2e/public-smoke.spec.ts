import { test, expect } from "@playwright/test";

/**
 * Public Smoke — no login required (SCR-001, SCR-002, SCR-003).
 *
 * Selector priority: role + accessible name first, then a stable
 * `data-testid` for content that has no fixed literal copy (e.g. a
 * data-driven destination grid). Never CSS structure or text position.
 *
 * `data-testid` contract the corresponding Component/Page Owner Task must
 * satisfy (see TASKS/TASK-COMP-SCR001-*.md / TASK-COMP-SCR003-*.md):
 *   - destinations-domestic          COMP-SCR001-DOMESTIC-GRID section
 *   - destinations-international     COMP-SCR001-INTL-GRID section
 *   - representative-stats           COMP-SCR002-TRAVEL-STATS block
 *   - travel-input-disclaimer        "입력값은 서버로 전송되지 않는다" 고지 문구
 *   - flight-external-link           COMP-SCR003-FLIGHT-FORM 외부 이동 링크
 *   - hotel-external-link            COMP-SCR003-HOTEL-FORM 외부 이동 링크
 *   - mate-composer-login-notice     COMP-SCR003-MATE-COMPOSER 비로그인 안내
 *
 * External sites (the flight/hotel/mate target) are never opened or
 * inspected here — only the disclaimer text and the outbound href/target/rel
 * attributes are checked (per this Task's Selector 규칙).
 */

test.describe("E2E-001~005 Public Smoke", () => {
  test("E2E-001 메인 페이지의 추천 여행지와 주요 CTA", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("destinations-domestic")).toBeVisible();
    await expect(page.getByTestId("destinations-international")).toBeVisible();

    await expect(
      page.getByRole("link", { name: "여행 조건 정리하기" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "동행 더 보기" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "대표 이야기 더 보기" }),
    ).toBeVisible();
  });

  test("E2E-002 대표 소개의 free_traveler, 50회 이상, 30개국 이상", async ({
    page,
  }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("heading", { name: /free_traveler/i }),
    ).toBeVisible();

    const stats = page.getByTestId("representative-stats");
    await expect(stats).toBeVisible();
    await expect(stats).toContainText(/50\+/);
    await expect(stats).toContainText(/30\+/);
  });

  test("E2E-003 여행 도구의 항공 외부 이동 안내와 href", async ({ page }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "항공편 찾기" }).click();

    await expect(page.getByTestId("travel-input-disclaimer")).toBeVisible();

    const flightLink = page.getByTestId("flight-external-link");
    await expect(flightLink).toBeVisible();
    await expect(flightLink).toHaveAttribute("target", "_blank");
    await expect(flightLink).toHaveAttribute("rel", /noopener/);
    const href = await flightLink.getAttribute("href");
    expect(href, "항공 외부 이동 링크에 href가 있어야 한다").toBeTruthy();
    // 실제 항공 사이트를 열거나 그 내용을 검사하지 않는다 — href 존재만 확인한다.
  });

  test("E2E-004 여행 도구의 숙소 외부 이동 안내와 href", async ({ page }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "숙소 찾기" }).click();

    await expect(page.getByTestId("travel-input-disclaimer")).toBeVisible();

    const hotelLink = page.getByTestId("hotel-external-link");
    await expect(hotelLink).toBeVisible();
    await expect(hotelLink).toHaveAttribute("target", "_blank");
    await expect(hotelLink).toHaveAttribute("rel", /noopener/);
    const href = await hotelLink.getAttribute("href");
    expect(href, "숙소 외부 이동 링크에 href가 있어야 한다").toBeTruthy();
    // 실제 숙소 사이트를 열거나 그 내용을 검사하지 않는다 — href 존재만 확인한다.
  });

  test("E2E-005 비로그인 동행글 작성의 로그인 안내", async ({ page }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "동행 구하기" }).click();

    await expect(page.getByTestId("mate-composer-login-notice")).toBeVisible();
    await expect(page.getByRole("link", { name: /로그인/ })).toBeVisible();
  });
});
