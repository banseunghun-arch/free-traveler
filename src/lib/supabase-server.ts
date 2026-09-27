import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function getSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return { supabaseUrl, supabaseAnonKey };
}

/**
 * Server client — Uses service role key for server-side operations
 * Can bypass RLS (use carefully)
 * NOTE: Service role key is never exposed to the browser
 * NOTE: This file is server-only due to cookies() import
 */
export async function getServerClient(): Promise<SupabaseClient> {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set on the server. Cannot create server client."
    );
  }

  const { supabaseUrl: url } = getSupabaseConfig();
  const cookieStore = await cookies();
  const client = createClient(url, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  // Set up request context with user session for RLS
  const sessionCookie = cookieStore.get("sb-session");
  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value);
      // Inject user context for RLS evaluation
      if (session?.user?.id) {
        client.auth.setSession(session);
      }
    } catch (e) {
      // Ignore invalid session cookies
    }
  }

  return client;
}
