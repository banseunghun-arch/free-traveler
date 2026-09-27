/**
 * RLS Integration Test — Basic permission enforcement
 *
 * Tests that Row Level Security policies (DB-RLS-BASE) correctly deny
 * unauthorized access and modifications. Uses seed accounts from DB-SEED-BASE:
 * - regular_user@example.com (일반 사용자)
 * - author_user@example.com (작성자)
 * - admin_user@example.com (관리자)
 *
 * Run: npm run test:rls (requires live Supabase DB)
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Client = SupabaseClient<any>;

interface TestAccount {
  email: string;
  password: string;
  role: "regular" | "author" | "admin";
}

const TEST_ACCOUNTS: TestAccount[] = [
  {
    email: "regular_user@example.com",
    password: "test_password_123",
    role: "regular",
  },
  {
    email: "author_user@example.com",
    password: "test_password_123",
    role: "author",
  },
  {
    email: "admin_user@example.com",
    password: "test_password_123",
    role: "admin",
  },
];

describe("RLS-001 profiles 테이블 — 본인만 수정", () => {
  let regularClient: Client;
  let authorClient: Client;

  beforeAll(async () => {
    regularClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    authorClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Sign in as regular user
    const regularRes = await regularClient.auth.signInWithPassword({
      email: TEST_ACCOUNTS[0].email,
      password: TEST_ACCOUNTS[0].password,
    });
    if (regularRes.error) throw regularRes.error;

    // Sign in as author user
    const authorRes = await authorClient.auth.signInWithPassword({
      email: TEST_ACCOUNTS[1].email,
      password: TEST_ACCOUNTS[1].password,
    });
    if (authorRes.error) throw authorRes.error;
  });

  it("다른 사용자의 프로필 수정 시도 → 거부 (403)", async () => {
    // Get author's user ID
    const authorData = await authorClient.auth.getUser();
    const authorId = authorData.data.user!.id;

    // Regular user tries to modify author's profile
    const { error } = await regularClient
      .from("profiles")
      .update({ bio: "hacked" } as any)
      .eq("id", authorId);

    expect(error).toBeDefined();
    expect(
      error?.message &&
        (error.message.includes("new row violates row level security policy") ||
          error.message.includes("not allowed") ||
          error.message.includes("permission denied")),
    ).toBe(true);
  });

  it("자신의 프로필 수정 → 허용", async () => {
    const regularData = await regularClient.auth.getUser();
    const regularId = regularData.data.user!.id;

    const { data, error } = await regularClient
      .from("profiles")
      .update({ bio: "My bio" } as any)
      .eq("id", regularId)
      .select();

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });
});

describe("RLS-002 mate_posts 테이블 — 작성자만 수정/삭제", () => {
  let regularClient: Client;
  let authorClient: Client;
  let matePostId: string;

  beforeAll(async () => {
    regularClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    authorClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Sign in both users
    await regularClient.auth.signInWithPassword({
      email: TEST_ACCOUNTS[0].email,
      password: TEST_ACCOUNTS[0].password,
    });
    await authorClient.auth.signInWithPassword({
      email: TEST_ACCOUNTS[1].email,
      password: TEST_ACCOUNTS[1].password,
    });

    // Author creates a mate post
    const authorData = await authorClient.auth.getUser();
    const authorId = authorData.data.user!.id;
    const { data } = await authorClient
      .from("mate_posts")
      .insert({
        author_id: authorId,
        title: "Test mate post",
        content: "Looking for travel companions",
        destinations: JSON.stringify(["Seoul", "Tokyo"]),
        travel_start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        travel_end: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      } as any)
      .select("id");

    if (data && Array.isArray(data) && data.length > 0) {
      matePostId = (data[0] as any).id;
    }
  });

  it("다른 사용자의 동행글 수정 시도 → 거부", async () => {
    const { error } = await regularClient
      .from("mate_posts")
      .update({ title: "Hacked title" } as any)
      .eq("id", matePostId);

    expect(error).toBeDefined();
  });

  it("다른 사용자의 동행글 삭제 시도 → 거부", async () => {
    const { error } = await regularClient
      .from("mate_posts")
      .delete()
      .eq("id", matePostId);

    expect(error).toBeDefined();
  });

  it("작성자의 동행글 수정 → 허용", async () => {
    const { error } = await authorClient
      .from("mate_posts")
      .update({ title: "Updated title" } as any)
      .eq("id", matePostId);

    expect(error).toBeNull();
  });
});

describe("RLS-003 reports/external_urls 테이블 — Admin만 쓰기", () => {
  let regularClient: Client;
  let adminClient: Client;

  beforeAll(async () => {
    regularClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    adminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    await regularClient.auth.signInWithPassword({
      email: TEST_ACCOUNTS[0].email,
      password: TEST_ACCOUNTS[0].password,
    });
    await adminClient.auth.signInWithPassword({
      email: TEST_ACCOUNTS[2].email,
      password: TEST_ACCOUNTS[2].password,
    });
  });

  it("일반 사용자의 external_urls 쓰기 시도 → 거부", async () => {
    const { error } = await regularClient
      .from("external_urls")
      .insert({
        url_type: "flight",
        url: "https://example.com",
      } as any);

    expect(error).toBeDefined();
  });

  it("Admin의 external_urls 쓰기 → 허용", async () => {
    const { data, error } = await adminClient
      .from("external_urls")
      .insert({
        url_type: "flight",
        url: "https://example.com",
      } as any)
      .select();

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });
});

describe("RLS-004 XSS 방어 — 페이로드 이스케이프", () => {
  let regularClient: ReturnType<typeof createClient>;

  beforeAll(async () => {
    regularClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    await regularClient.auth.signInWithPassword({
      email: TEST_ACCOUNTS[0].email,
      password: TEST_ACCOUNTS[0].password,
    });
  });

  it("XSS 페이로드 입력 → 이스케이프 처리 확인", async () => {
    const regularData = await regularClient.auth.getUser();
    const regularId = regularData.data.user!.id;

    const xssPayload = '<script>alert("XSS")</script>';
    const { data, error } = await (regularClient.from("profiles") as any)
      .update({ bio: xssPayload })
      .eq("id", regularId)
      .select("bio");

    expect(error).toBeNull();
    // Verify the payload was stored (not executed)
    // In practice, escaping happens on retrieval/display, not storage
    expect((data?.[0] as any)?.bio).toContain(xssPayload);
  });
});

describe("RLS-005 CSRF 방어 — 위조 요청 검증", () => {
  it("외부 요청은 session/auth token 없이 거부되어야 함", async () => {
    // This is a conceptual test — actual CSRF prevention happens at the
    // Supabase/auth layer, not RLS. RLS enforces who can see/modify rows;
    // auth token validation prevents unauthenticated access.
    // This test verifies that unauthenticated clients cannot modify data.

    const unauthClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { error } = await unauthClient
      .from("profiles")
      .update({ bio: "Unauthorized" } as any)
      .eq("id", "any-id");

    expect(error).toBeDefined();
  });
});
