import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase-server";
import { ServerDB } from "@/lib/db";

/**
 * GET /api/admin/urls
 * Retrieve all external URLs (flight, hotel, SNS)
 */
export async function GET(request: NextRequest) {
  try {
    const db = await ServerDB.create();

    // Retrieve from database
    const client = await getServerClient();
    const { data, error } = await client
      .from("external_urls")
      .select("*");

    if (error) {
      return NextResponse.json(
        { error: "Failed to retrieve URLs" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/urls error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/urls
 * Create or update an external URL
 * Body: { key: "flight" | "hotel" | "sns", url: string }
 */
export async function POST(request: NextRequest) {
  try {
    const db = await ServerDB.create();
    const body = await request.json();
    const { key, url } = body;

    // Validate input
    if (!key || !url) {
      return NextResponse.json(
        { error: "Missing required fields: key, url" },
        { status: 400 }
      );
    }

    if (!["flight", "hotel", "sns"].includes(key)) {
      return NextResponse.json(
        { error: "Invalid key. Must be 'flight', 'hotel', or 'sns'" },
        { status: 400 }
      );
    }

    // Validate HTTPS
    if (!url.startsWith("https://")) {
      return NextResponse.json(
        { error: "URL must start with https://" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const client = await getServerClient();

    // Check if URL already exists for this key
    const { data: existing } = await client
      .from("external_urls")
      .select("id")
      .eq("key", key)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await client
        .from("external_urls")
        .update({
          url,
          updated_at: new Date().toISOString(),
        })
        .eq("key", key)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to update URL" },
          { status: 500 }
        );
      }

      return NextResponse.json({ data });
    } else {
      // Create new
      const { data, error } = await client
        .from("external_urls")
        .insert([{ key, url }])
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to create URL" },
          { status: 500 }
        );
      }

      return NextResponse.json({ data }, { status: 201 });
    }
  } catch (error) {
    console.error("POST /api/admin/urls error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/urls
 * Update an external URL
 * Body: { key: string, url: string }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, url } = body;

    if (!key || !url) {
      return NextResponse.json(
        { error: "Missing required fields: key, url" },
        { status: 400 }
      );
    }

    if (!url.startsWith("https://")) {
      return NextResponse.json(
        { error: "URL must start with https://" },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const client = await getServerClient();
    const { data, error } = await client
      .from("external_urls")
      .update({ url, updated_at: new Date().toISOString() })
      .eq("key", key)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "URL not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("PUT /api/admin/urls error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
