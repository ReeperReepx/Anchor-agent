import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWeekStart } from "@/lib/utils/week";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weekOf = getWeekStart();

  // Get current week's match
  const { data: currentMatch } = await supabase
    .from("matches")
    .select("*")
    .eq("week_of", weekOf)
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .in("status", ["pending", "active"])
    .limit(1)
    .single();

  let partner = null;
  if (currentMatch && currentMatch.status === "active") {
    const partnerId =
      currentMatch.user_a_id === user.id
        ? currentMatch.user_b_id
        : currentMatch.user_a_id;

    if (partnerId) {
      const { data: partnerData } = await supabase
        .from("users")
        .select("name, email, timezone, goal_categories")
        .eq("id", partnerId)
        .single();

      partner = partnerData;
    }
  }

  // Get past matches (last 8 weeks)
  const { data: pastMatches } = await supabase
    .from("matches")
    .select("*")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .eq("status", "ended")
    .order("week_of", { ascending: false })
    .limit(8);

  // Fetch partner details for past matches
  const pastWithPartners = [];
  if (pastMatches) {
    for (const match of pastMatches) {
      const partnerId =
        match.user_a_id === user.id ? match.user_b_id : match.user_a_id;
      if (partnerId) {
        const { data: p } = await supabase
          .from("users")
          .select("name, goal_categories")
          .eq("id", partnerId)
          .single();
        pastWithPartners.push({
          week_of: match.week_of,
          partner_name: p?.name ?? "Unknown",
          partner_goals: p?.goal_categories ?? [],
        });
      }
    }
  }

  return NextResponse.json({
    current_match: currentMatch
      ? {
          status: currentMatch.status,
          week_of: currentMatch.week_of,
          matched_at: currentMatch.matched_at,
          partner,
        }
      : null,
    past_matches: pastWithPartners,
  });
}
