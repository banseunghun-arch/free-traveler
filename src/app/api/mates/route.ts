import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase-server";
import { containsContactInfo, validateDates } from "@/lib/contact-detection";
import { MatePost } from "@/lib/db";

/**
 * GET /api/mates
 * List all mate posts with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");
    const status = searchParams.get("status");

    const client = await getServerClient();
    let query = client.from("mate_posts").select("*");

    if (country) {
      query = query.eq("country", country);
    }

    const { data: posts, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: 500 }
      );
    }

    // Calculate status and apply filter
    const processedPosts = (posts || [])
      .map((post) => ({
        ...post,
        status: calculatePostStatus(post),
      }))
      .filter((post) => !status || post.status === status);

    return NextResponse.json({ data: processedPosts });
  } catch (error) {
    console.error("GET /api/mates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mates
 * Create a new mate post
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, country, region, start_date, end_date, recruitment_count, description } =
      body;

    // Validation
    if (!title || !country || !start_date || !end_date || !recruitment_count) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate dates
    const dateValidation = validateDates(start_date, end_date);
    if (!dateValidation.valid) {
      return NextResponse.json(
        { error: dateValidation.error },
        { status: 400 }
      );
    }

    // Check for contact info in description
    if (description && containsContactInfo(description)) {
      return NextResponse.json(
        {
          error: "Contact information (phone, email, messenger ID) is not allowed in post description",
        },
        { status: 400 }
      );
    }

    const client = await getServerClient();
    const user = (await client.auth.getUser()).data?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await client
      .from("mate_posts")
      .insert([
        {
          title,
          country,
          region: region || null,
          start_date,
          end_date,
          recruitment_count,
          description: description || null,
          status: "OPEN",
          author_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: { ...data, status: calculatePostStatus(data) } },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/mates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Calculate post status based on end_date
 */
function calculatePostStatus(
  post: any
): "OPEN" | "CLOSED" | "FULL" {
  if (post.status === "FULL") return "FULL";

  const endDate = new Date(post.end_date);
  const now = new Date();

  return endDate < now ? "CLOSED" : "OPEN";
}
