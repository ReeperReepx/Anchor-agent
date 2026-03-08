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

  // Check membership exists and user is not the owner
  const { data: membership } = await supabase
    .from("community_members")
    .select("id, role")
    .eq("community_id", community_id)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return NextResponse.json(
      { error: "Not a member of this community" },
      { status: 404 }
    );
  }

  if (membership.role === "owner") {
    return NextResponse.json(
      { error: "Owners cannot leave their community. Delete it instead." },
      { status: 400 }
    );
  }

  // Delete membership
  const { error: deleteError } = await supabase
    .from("community_members")
    .delete()
    .eq("community_id", community_id)
    .eq("user_id", user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to leave community" },
      { status: 500 }
    );
  }

  // Decrement member_count
  const { error: updateError } = await supabase.rpc("decrement_member_count", {
    cid: community_id,
  });

  // Fallback if RPC doesn't exist
  if (updateError) {
    const { data: community } = await supabase
      .from("communities")
      .select("member_count")
      .eq("id", community_id)
      .single();

    if (community) {
      await supabase
        .from("communities")
        .update({ member_count: Math.max(0, community.member_count - 1) })
        .eq("id", community_id);
    }
  }

  return NextResponse.json({ success: true });
}
