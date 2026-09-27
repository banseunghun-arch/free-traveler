import { test, expect } from "@playwright/test";

/**
 * Auth Smoke — 골격(skeleton). 로그인 사용자 흐름(SCR-003 동행 작성 →
 * SCR-004 목록/상세, SCR-004 참가 신청 → SCR-005 내 활동)의 단계만
 * 미리 outline한다. 정확한 Selector는 AUTH-SUPABASE-EMAIL/COMP-SCR005-AUTH
 * 등 실제 구현이 끝난 뒤 다시 맞춘다.
 *
 * E2E_TEST_EMAIL / E2E_TEST_PASSWORD(DB-SEED-BASE 시드 계정) 환경변수가
 * 없으면 이 파일(Auth Smoke)만 명시적으로 skip한다 —
 * tests/e2e/public-smoke.spec.ts는 이 조건과 무관하게 계속 실행된다.
 */

const EMAIL = process.env.E2E_TEST_EMAIL;
const PASSWORD = process.env.E2E_TEST_PASSWORD;

test.describe("E2E-006~007 Auth Smoke", () => {
  test.skip(
    !EMAIL || !PASSWORD,
    "E2E_TEST_EMAIL/E2E_TEST_PASSWORD가 없어 인증이 필요한 Auth Smoke를 건너뜀 (Public Smoke는 영향받지 않음)",
  );

  test.beforeEach(async ({ page }) => {
    await test.step("시드 계정으로 로그인", async () => {
      await page.goto("/account");
      await page.getByRole("textbox", { name: "이메일" }).fill(EMAIL!);
      await page.getByRole("textbox", { name: "비밀번호" }).fill(PASSWORD!);
      await page.getByRole("button", { name: "로그인" }).click();
    });
  });

  test("E2E-006 로그인 사용자의 동행글 작성과 목록·상세 확인", async ({
    page,
  }) => {
    const title = `E2E-006 테스트 동행글 ${Date.now()}`;

    await test.step("SCR-003 동행 구하기 탭에서 동행글 작성", async () => {
      await page.goto("/travel-tools");
      await page.getByRole("tab", { name: "동행 구하기" }).click();
      await page.getByRole("textbox", { name: "제목" }).fill(title);
      await page.getByRole("button", { name: "동행글 등록" }).click();
    });

    await test.step("SCR-004 목록에서 확인", async () => {
      await page.goto("/mates");
      await expect(page.getByRole("link", { name: title })).toBeVisible();
    });

    await test.step("SCR-004 상세에서 확인", async () => {
      await page.getByRole("link", { name: title }).click();
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    });
  });

  test("E2E-007 동행글 신청과 계정 화면의 내 활동 확인", async ({ page }) => {
    await test.step("SCR-004에서 참가 신청", async () => {
      await page.goto("/mates");
      await page.getByTestId("mate-post-card").first().click();
      await page.getByRole("button", { name: "참가 신청" }).click();
      await page
        .getByRole("textbox", { name: "신청 메시지" })
        .fill("E2E-007 테스트 참가 신청입니다.");
      await page.getByRole("button", { name: "신청 보내기" }).click();
      await expect(page.getByRole("status")).toContainText(/신청/);
    });

    await test.step("SCR-005 내 활동에서 확인", async () => {
      await page.goto("/account");
      await expect(
        page.getByTestId("my-activity-participation-requests"),
      ).toBeVisible();
    });
  });
});
