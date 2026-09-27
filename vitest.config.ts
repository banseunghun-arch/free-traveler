import { defineConfig } from "vitest/config";

// Traveler Unit Test scope: only src/** and tests/unit/** are Vitest's
// concern. tests/e2e/**, the top-level e2e/** (Playwright specs) and
// tests/rls/** (Supabase RLS integration tests, run separately against a
// real DB) are excluded so `npm run test:unit` never picks them up.
// passWithNoTests keeps this a clean exit while no Unit Test exists yet.
export default defineConfig({
  test: {
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: [
      "node_modules/**",
      ".next/**",
      "e2e/**",
      "tests/e2e/**",
      "tests/rls/**",
    ],
    passWithNoTests: true,
  },
});
