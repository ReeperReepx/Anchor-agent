import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { community_id } = body as { community_id: string };

  if (!community_id) {
    return NextResponse.json(
      { error: "Community ID is required" },
      { status: 400 }
    );
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from("community_members")
    .select("id")
    .eq("community_id", community_id)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Already a member of this community" },
      { status: 409 }
    );
  }

  // Insert membership
  const { error: memberError } = await supabase
    .from("community_members")
    .insert({
      community_id,
      user_id: user.id,
      role: "member",
      joined_at: new Date().toISOString(),
    });

  if (memberError) {
    return NextResponse.json(
      { error: "Failed to join community" },
      { status: 500 }
    );
  }

  // Increment member_count
  const { error: updateError } = await supabase.rpc("increment_member_count", {
    cid: community_id,
  });

  // Fallback if RPC doesn't exist: fetch and update
  if (updateError) {
    const { data: community } = await supabase
      .from("communities")
      .select("member_count")
      .eq("id", community_id)
      .single();

    if (community) {
      await supabase
        .from("communities")
        .update({ member_count: community.member_count + 1 })
        .eq("id", community_id);
    }
  }

  return NextResponse.json({ success: true });
}
