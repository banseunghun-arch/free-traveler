import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase-server";

/**
 * POST /api/participation
 * Submit a participation request
 * Body: { matePostId, message }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matePostId, message } = body;

    if (!matePostId) {
      return NextResponse.json(
        { error: "Missing matePostId" },
        { status: 400 }
      );
    }

    // Validate message length
    if (message && message.length > 500) {
      return NextResponse.json(
        { error: "Message must be 500 characters or less" },
        { status: 400 }
      );
    }

    const client = await getServerClient();
    const user = (await client.auth.getUser()).data?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if post exists
    const { data: post, error: postError } = await client
      .from("mate_posts")
      .select("id, author_id")
      .eq("id", matePostId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: "Mate post not found" },
        { status: 404 }
      );
    }

    // Cannot request to join own post
    if (post.author_id === user.id) {
      return NextResponse.json(
        { error: "You cannot request to join your own post" },
        { status: 400 }
      );
    }

    // Submit participation request
    // DB unique constraint will prevent duplicate PENDING/ACCEPTED
    const { data, error } = await client
      .from("participation_requests")
      .insert([
        {
          mate_post_id: matePostId,
          requester_id: user.id,
          message: message || null,
          status: "PENDING",
        },
      ])
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate request
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You already have a pending or accepted request for this post" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to submit request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/participation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/participation
 * Get participation requests for user's posts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matePostId = searchParams.get("matePostId");

    const client = await getServerClient();
    const user = (await client.auth.getUser()).data?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (matePostId) {
      // Get requests for specific post (author only)
      const { data: post } = await client
        .from("mate_posts")
        .select("author_id")
        .eq("id", matePostId)
        .single();

      if (!post || post.author_id !== user.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }

      const { data, error } = await client
        .from("participation_requests")
        .select("*")
        .eq("mate_post_id", matePostId)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch requests" },
          { status: 500 }
        );
      }

      return NextResponse.json({ data });
    }

    // Get all requests for user's posts
    const { data, error } = await client
      .from("participation_requests")
      .select("*")
      .eq("mate_post_id", (await client.from("mate_posts").select("id").eq("author_id", user.id)))
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch requests" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/participation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/participation/[id]
 * Update participation request status (approve/reject) - author only
 * Body: { status: "ACCEPTED" | "REJECTED" }
 */
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("id");

    if (!requestId) {
      return NextResponse.json({ error: "Missing request ID" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be ACCEPTED or REJECTED" },
        { status: 400 }
      );
    }

    const client = await getServerClient();
    const user = (await client.auth.getUser()).data?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the participation request
    const { data: participationReq, error: reqError } = await client
      .from("participation_requests")
      .select("mate_post_id")
      .eq("id", requestId)
      .single();

    if (reqError || !participationReq) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Check if user is the post author
    const { data: post } = await client
      .from("mate_posts")
      .select("author_id")
      .eq("id", participationReq.mate_post_id)
      .single();

    if (!post || post.author_id !== user.id) {
      return NextResponse.json(
        { error: "Only the post author can approve/reject requests" },
        { status: 403 }
      );
    }

    // Update request status
    const { data, error } = await client
      .from("participation_requests")
      .update({ status })
      .eq("id", requestId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("PATCH /api/participation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
