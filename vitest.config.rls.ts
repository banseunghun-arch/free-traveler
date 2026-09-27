import { defineConfig } from "vitest/config";

// Separate Vitest config for RLS integration tests.
// These tests require a live Supabase database and are excluded from unit tests.
// Run with: npm run test:rls

export default defineConfig({
  test: {
    include: ["tests/rls/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
    passWithNoTests: true,
  },
});
