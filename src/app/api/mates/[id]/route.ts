import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase-server";
import { containsContactInfo } from "@/lib/contact-detection";

/**
 * GET /api/mates/[id]
 * Get a single mate post
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const client = await getServerClient();
    const { data: post, error } = await client
      .from("mate_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Calculate status
    const status = calculatePostStatus(post);

    return NextResponse.json({ data: { ...post, status } });
  } catch (error) {
    console.error(`GET /api/mates/[id] error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/mates/[id]
 * Update a mate post (author only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, recruitment_count } = body;

    const client = await getServerClient();
    const user = (await client.auth.getUser()).data?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get post and check ownership
    const { data: post, error: getError } = await client
      .from("mate_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (getError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.author_id !== user.id) {
      return NextResponse.json(
        { error: "Only the author can edit this post" },
        { status: 403 }
      );
    }

    // Validate description for contact info
    if (description && containsContactInfo(description)) {
      return NextResponse.json(
        {
          error: "Contact information (phone, email, messenger ID) is not allowed",
        },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (recruitment_count !== undefined) {
      updates.recruitment_count = recruitment_count;
    }

    const { data, error } = await client
      .from("mate_posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { ...data, status: calculatePostStatus(data) } });
  } catch (error) {
    console.error(`PATCH /api/mates/[id] error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/mates/[id]/close
 * Manually close a mate post (author only)
 * Called via PUT with ?action=close
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action !== "close") {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const client = await getServerClient();
    const user = (await client.auth.getUser()).data?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get post and check ownership
    const { data: post } = await client
      .from("mate_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.author_id !== user.id) {
      return NextResponse.json(
        { error: "Only the author can close this post" },
        { status: 403 }
      );
    }

    // Check for accepted participation requests
    const { data: acceptedRequests } = await client
      .from("participation_requests")
      .select("id")
      .eq("mate_post_id", id)
      .eq("status", "ACCEPTED");

    const { data, error } = await client
      .from("mate_posts")
      .update({ status: "CLOSED" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to close post" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { ...data, status: "CLOSED" },
      warning: acceptedRequests && acceptedRequests.length > 0
        ? `This post has ${acceptedRequests.length} accepted participation request(s)`
        : undefined,
    });
  } catch (error) {
    console.error(`PUT /api/mates/[id] error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/mates/[id]
 * Delete a mate post (author only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const client = await getServerClient();
    const user = (await client.auth.getUser()).data?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get post and check ownership
    const { data: post } = await client
      .from("mate_posts")
      .select("author_id")
      .eq("id", id)
      .single();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.author_id !== user.id) {
      return NextResponse.json(
        { error: "Only the author can delete this post" },
        { status: 403 }
      );
    }

    const { error } = await client
      .from("mate_posts")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "deleted" });
  } catch (error) {
    console.error(`DELETE /api/mates/[id] error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Calculate post status based on end_date
 */
function calculatePostStatus(post: any): "OPEN" | "CLOSED" | "FULL" {
  if (post.status === "FULL") return "FULL";

  const endDate = new Date(post.end_date);
  const now = new Date();

  return endDate < now ? "CLOSED" : "OPEN";
}
