import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function createServerClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  const client = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });

  // Get session from cookies
  const sessionCookie = cookieStore.get("sb-session");
  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value);
      // Set auth context for RLS
      await client.auth.setSession(session);
    } catch (e) {
      // Invalid session cookie
    }
  }

  return client;
}

export async function getCurrentUser() {
  const client = createBrowserClient();
  const { data, error } = await client.auth.getUser();

  if (error || !data?.user) {
    return null;
  }

  return data.user;
}

export async function getCurrentSession() {
  const client = createBrowserClient();
  const { data } = await client.auth.getSession();
  return data?.session || null;
}

export async function signUpWithEmail(email: string, password: string) {
  const client = createBrowserClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const client = createBrowserClient();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const client = createBrowserClient();
  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function resetPassword(email: string) {
  const client = createBrowserClient();
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?type=recovery`,
  });

  if (error) {
    throw error;
  }
}

export async function updatePassword(newPassword: string) {
  const client = createBrowserClient();
  const { error } = await client.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }
}

export async function createProfile(
  userId: string,
  nickname: string
) {
  const client = createBrowserClient();
  const { error } = await client.from("profiles").insert([
    {
      id: userId,
      nickname,
      is_adult: false,
      adult_verified_at: null,
    },
  ]);

  if (error) {
    throw error;
  }
}

export async function updateAdultStatus(
  userId: string,
  isAdult: boolean
) {
  const client = createBrowserClient();
  const { error } = await client
    .from("profiles")
    .update({
      is_adult: isAdult,
      adult_verified_at: isAdult ? new Date().toISOString() : null,
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function getProfile(userId: string) {
  const client = createBrowserClient();
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function verifySession() {
  try {
    const session = await getCurrentSession();
    return !!session;
  } catch {
    return false;
  }
}
