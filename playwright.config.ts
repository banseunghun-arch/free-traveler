import { defineConfig, devices } from "@playwright/test";

// Traveler E2E scope: Chromium only (CLAUDE.md rule 18 / SKILL.md Rule 13 /
// DEC-009) — a single "chromium" project using the Desktop Chrome device
// profile, so `--project=chromium` in package.json's test:e2e /
// test:e2e:public always resolves.
const PREVIEW_URL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = PREVIEW_URL || "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // PLAYWRIGHT_BASE_URL(Vercel Preview 등 실제 배포 URL)이 지정되면 그 URL을
  // 그대로 테스트하고, 로컬(값 없음)에서만 `npm run dev`를 띄운다.
  webServer: PREVIEW_URL
    ? undefined
    : {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
