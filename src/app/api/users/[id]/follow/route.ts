// Start: Real Follow/Unfollow API Route (auth-gated, writes to Supabase)
import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { id: followingId } = await context.params;

  if (!followingId) {
    return NextResponse.json({ error: "Missing target user id" }, { status: 400 });
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Sesi tidak sah. Sila log masuk." }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const supabase = getServerSupabase();

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return NextResponse.json({ error: "Sesi tidak sah. Sila log masuk." }, { status: 401 });
  }

  const followerId = userData.user.id;

  try {
    // Start: Verify target profile exists
    const { data: target, error: targetError } = await supabase
      .from("profiles")
      .select("user_id, followers_count")
      .eq("user_id", followingId)
      .maybeSingle();

    if (targetError) {
      return NextResponse.json({ error: targetError.message }, { status: 500 });
    }
    if (!target) {
      return NextResponse.json({ error: "Profil sasaran tidak dijumpai" }, { status: 404 });
    }
    // End: Verify target profile exists

    // Start: Insert follow edge (idempotent guard)
    const { error: insertError } = await supabase
      .from("follows")
      .upsert(
        { follower_id: followerId, following_id: followingId },
        { onConflict: "follower_id,following_id" }
      );

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    // End: Insert follow edge

    // Start: Increment follower count
    const currentFollowers = Number((target as { followers_count?: number }).followers_count ?? 0);
    const { error: updErr } = await supabase
      .from("profiles")
      .update({ followers_count: currentFollowers + 1 })
      .eq("user_id", followingId);

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }
    // End: Increment follower count

    return NextResponse.json({ isFollowing: true, followers: currentFollowers + 1 }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ralat tidak diketahui";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id: followingId } = await context.params;

  if (!followingId) {
    return NextResponse.json({ error: "Missing target user id" }, { status: 400 });
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Sesi tidak sah. Sila log masuk." }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const supabase = getServerSupabase();

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return NextResponse.json({ error: "Sesi tidak sah. Sila log masuk." }, { status: 401 });
  }

  const followerId = userData.user.id;

  try {
    // Start: Fetch current follower count before removal
    const { data: target, error: targetError } = await supabase
      .from("profiles")
      .select("followers_count")
      .eq("user_id", followingId)
      .maybeSingle();

    if (targetError) {
      return NextResponse.json({ error: targetError.message }, { status: 500 });
    }
    // End: Fetch current follower count

    // Start: Delete follow edge
    const { error: delErr } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId);

    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }
    // End: Delete follow edge

    // Start: Decrement follower count (floor at 0)
    const currentFollowers = Number((target as { followers_count?: number } | null)?.followers_count ?? 0);
    const next = Math.max(0, currentFollowers - 1);
    const { error: updErr } = await supabase
      .from("profiles")
      .update({ followers_count: next })
      .eq("user_id", followingId);

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }
    // End: Decrement follower count

    return NextResponse.json({ isFollowing: false, followers: next }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ralat tidak diketahui";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
// End: Real Follow/Unfollow API Route