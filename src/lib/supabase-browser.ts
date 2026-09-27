import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return { supabaseUrl, supabaseAnonKey };
}

/**
 * Browser client — Uses public anon key for client-side operations
 * Subject to RLS policies
 */
let browserClientInstance: SupabaseClient | null = null;

export function getBrowserClient(): SupabaseClient {
  if (!browserClientInstance) {
    const { supabaseUrl: url, supabaseAnonKey: key } = getSupabaseConfig();
    browserClientInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserClientInstance;
}

/**
 * Verify that sensitive keys are not exposed to browser
 */
export function verifyNoServerKeysInClient(): boolean {
  const hasServiceKey = typeof window !== "undefined" &&
    (window as any).__SUPABASE_SERVICE_KEY__;

  return !hasServiceKey;
}
