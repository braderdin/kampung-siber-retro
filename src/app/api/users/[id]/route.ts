// Start: Real Profile API Route (GET authentic UserProfile from Supabase)
import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { mapRowToProfile, ProfileRow, Badge } from "@/lib/profile-types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing user identifier" }, { status: 400 });
  }

  try {
    const supabase = getServerSupabase();

    // Start: Resolve profile row by id OR username (both supported)
    const isUuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const column = isUuidLike ? "user_id" : "username";

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, user_id, username, display_name, email, avatar_url, bio, location, website, created_at, last_active, reputation, is_verified, is_premium, followers_count, following_count, posts_count, views_count, twitter, github, instagram, linkedin"
      )
      .eq(column, id)
      .maybeSingle();
    // End: Resolve profile row by id OR username

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Profile tidak dijumpai" }, { status: 404 });
    }

    // Start: Resolve follow state + badges (best-effort, never fatal)
    const row = data as ProfileRow;
    let isFollowing = false;
    let badges: Badge[] = [];

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabase.auth.getUser(token);
      const viewerId = userData?.user?.id;

      if (viewerId && isUuidLike) {
        const { data: followRow } = await supabase
          .from("follows")
          .select("id")
          .eq("follower_id", viewerId)
          .eq("following_id", id)
          .maybeSingle();
        isFollowing = Boolean(followRow);
      }
    }

    const { data: badgeRows } = await supabase
      .from("user_badges")
      .select("id, name, icon, tier")
      .eq(isUuidLike ? "user_id" : "username", id)
      .limit(20);

    if (Array.isArray(badgeRows)) {
      badges = badgeRows as Badge[];
    }
    // End: Resolve follow state + badges

    const profile = mapRowToProfile(row, { isFollowing, badges });

    return NextResponse.json(profile, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ralat tidak diketahui";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
// End: Real Profile API Route