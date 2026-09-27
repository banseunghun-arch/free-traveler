import { NextRequest, NextResponse } from "next/server";
import { createBrowserClient } from "@/lib/auth";

/**
 * Auth Callback Route Handler
 *
 * Handles:
 * - Email confirmation (type=signup)
 * - Password reset (type=recovery)
 * - OAuth callbacks (type=pkce)
 *
 * This is a technical route that processes Supabase auth callbacks
 * and redirects to the appropriate screen.
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle errors from Supabase
  if (error) {
    const encodedError = encodeURIComponent(error);
    const encodedDescription = encodeURIComponent(errorDescription || "");
    return NextResponse.redirect(
      new URL(
        `/auth/error?error=${encodedError}&description=${encodedDescription}`,
        request.url
      )
    );
  }

  // If no code, redirect home
  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const client = createBrowserClient();

    // Exchange code for session
    const { data, error: exchangeError } =
      await client.auth.exchangeCodeForSession(code);

    if (exchangeError || !data.session) {
      throw new Error(exchangeError?.message || "Failed to exchange code");
    }

    // Store session in cookie
    const response = NextResponse.redirect(new URL("/account", request.url));

    // Set auth cookies for persistence
    response.cookies.set("sb-access-token", data.session.access_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    response.cookies.set(
      "sb-refresh-token",
      data.session.refresh_token || "",
      {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      }
    );

    // Store full session for later use
    response.cookies.set("sb-session", JSON.stringify(data.session), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const encodedMessage = encodeURIComponent(message);
    return NextResponse.redirect(
      new URL(
        `/auth/error?error=callback_failed&description=${encodedMessage}`,
        request.url
      )
    );
  }
}
