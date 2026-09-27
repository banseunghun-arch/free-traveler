import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase-server";

/**
 * POST /api/moderation/report
 * Submit a report for a post, profile, or request
 * Body: { targetType: "mate_post"|"profile"|"participation_request", targetId, reason }
 */
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    if (action === "report") {
      return handleReportSubmit(request);
    } else if (action === "block") {
      return handleBlockUser(request);
    } else if (action === "admin-queue") {
      return handleAdminQueue(request);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Moderation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleReportSubmit(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetType, targetId, reason } = body;

    if (!targetType || !targetId || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["mate_post", "profile", "participation_request"].includes(targetType)) {
      return NextResponse.json(
        { error: "Invalid target type" },
        { status: 400 }
      );
    }

    const client = await getServerClient();
    const user = (await client.auth.getUser()).data?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await client
      .from("reports")
      .insert([
        {
          target_type: targetType,
          target_id: targetId,
          reporter_id: user.id,
          reason,
          status: "OPEN",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to submit report" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleBlockUser(request: NextRequest) {
  try {
    const method = request.method;
    const body = await request.json();
    const { blockedUserId } = body;

    if (!blockedUserId) {
      return NextResponse.json(
        { error: "Missing blockedUserId" },
        { status: 400 }
      );
    }

    const client = await getServerClient();
    const user = (await client.auth.getUser()).data?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.id === blockedUserId) {
      return NextResponse.json(
        { error: "Cannot block yourself" },
        { status: 400 }
      );
    }

    if (method === "POST") {
      // Block user
      const { data, error } = await client
        .from("blocks")
        .insert([{ user_id: user.id, blocked_user_id: blockedUserId }])
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to block user" },
          { status: 500 }
        );
      }

      return NextResponse.json({ data }, { status: 201 });
    } else if (method === "DELETE") {
      // Unblock user
      const { error } = await client
        .from("blocks")
        .delete()
        .eq("user_id", user.id)
        .eq("blocked_user_id", blockedUserId);

      if (error) {
        return NextResponse.json(
          { error: "Failed to unblock user" },
          { status: 500 }
        );
      }

      return NextResponse.json({ status: "unblocked" });
    }

    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleAdminQueue(request: NextRequest) {
  try {
    const method = request.method;
    const body = await request.json();

    const client = await getServerClient();
    const user = (await client.auth.getUser()).data?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin status (simplified)
    const { data: profile } = await client
      .from("profiles")
      .select("style")
      .eq("id", user.id)
      .single();

    if (!profile?.style?.includes("admin")) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    if (method === "GET") {
      // Get pending reports
      const { data, error } = await client
        .from("reports")
        .select("*")
        .eq("status", "OPEN")
        .order("created_at", { ascending: true });

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch reports" },
          { status: 500 }
        );
      }

      return NextResponse.json({ data });
    } else if (method === "PATCH") {
      // Update report status
      const { reportId, status, resolutionReason } = body;

      if (!reportId || !status) {
        return NextResponse.json(
          { error: "Missing reportId or status" },
          { status: 400 }
        );
      }

      const { data, error } = await client
        .from("reports")
        .update({
          status,
          resolution_reason: resolutionReason,
          assigned_to: user.id,
          resolved_at: status !== "OPEN" ? new Date().toISOString() : null,
        })
        .eq("id", reportId)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to update report" },
          { status: 500 }
        );
      }

      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
