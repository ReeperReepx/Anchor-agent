import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWeekStart } from "@/lib/utils/week";

interface MatchBody {
  goal_category: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: MatchBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.goal_category || typeof body.goal_category !== "string") {
    return NextResponse.json({ error: "Missing goal_category" }, { status: 400 });
  }

  // Get the requesting user's product type
  const { data: profile } = await supabase
    .from("users")
    .select("product_type")
    .eq("id", user.id)
    .single();

  const userProductType = profile?.product_type ?? "standup";

  const weekOf = getWeekStart();

  // Check if user already has a match for this week
  const { data: existingMatch } = await supabase
    .from("matches")
    .select("*")
    .eq("week_of", weekOf)
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .in("status", ["pending", "active"])
    .limit(1)
    .single();

  if (existingMatch) {
    return NextResponse.json({
      match: existingMatch,
      matched: existingMatch.status === "active",
      already_queued: existingMatch.status === "pending",
    });
  }

  // End any previous active matches for this user
  await supabase
    .from("matches")
    .update({ status: "ended" })
    .eq("status", "active")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`);

  // Get IDs of users with the same product type to filter pending matches
  // This prevents standup-partner users from matching with matching-only users
  const { data: sameProductUsers } = await supabase
    .from("users")
    .select("id")
    .eq("product_type", userProductType)
    .neq("id", user.id);

  const sameProductIds = (sameProductUsers ?? []).map((u) => u.id);

  // Look for a pending match this week with same goal category and same product type
  let pendingMatch = null;
  if (sameProductIds.length > 0) {
    const { data } = await supabase
      .from("matches")
      .select("*")
      .eq("goal_category", body.goal_category)
      .eq("week_of", weekOf)
      .is("user_b_id", null)
      .eq("status", "pending")
      .in("user_a_id", sameProductIds)
      .limit(1)
      .single();
    pendingMatch = data;
  }

  if (pendingMatch) {
    const { data: match, error } = await supabase
      .from("matches")
      .update({
        user_b_id: user.id,
        status: "active",
        matched_at: new Date().toISOString(),
      })
      .eq("id", pendingMatch.id)
      .select()
      .single();

    if (error) {
      console.error("Match update error:", error);
      return NextResponse.json({ error: "Failed to create match" }, { status: 500 });
    }

    return NextResponse.json({ match, matched: true });
  }

  // No match found — create pending entry for this week
  const { data: match, error } = await supabase
    .from("matches")
    .insert({
      user_a_id: user.id,
      goal_category: body.goal_category,
      week_of: weekOf,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Match insert error:", error);
    return NextResponse.json({ error: "Failed to create match" }, { status: 500 });
  }

  return NextResponse.json({ match, matched: false, queued: true });
}
