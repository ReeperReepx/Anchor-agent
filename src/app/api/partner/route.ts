import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWeekStart, daysUntilRotation } from "@/lib/utils/week";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weekOf = getWeekStart();

  // Find active match for this week
  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .eq("status", "active")
    .eq("week_of", weekOf)
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .limit(1)
    .single();

  if (!match) {
    return NextResponse.json({ partner: null, standup: null });
  }

  const partnerId =
    match.user_a_id === user.id ? match.user_b_id : match.user_a_id;

  // Get partner's latest completed standup from this week
  const { data: partnerStandup } = await supabase
    .from("standups")
    .select("*")
    .eq("user_id", partnerId)
    .gte("date", weekOf)
    .not("transcript", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({
    partner_id: partnerId,
    standup: partnerStandup,
    week_of: weekOf,
    days_until_rotation: daysUntilRotation(),
  });
}
