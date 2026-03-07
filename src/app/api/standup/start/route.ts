import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/subscription";
import { PLAN_LIMITS } from "@/lib/stripe";
import type { PlanLimitKey } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let type: "daily" | "weekly" = "daily";
  try {
    const body = await request.json();
    if (body.type === "weekly") type = "weekly";
  } catch {
    // No body or invalid JSON — default to daily
  }

  // Check subscription access
  const access = await getUserAccess(supabase, user.id);

  if (!access.hasAccess) {
    return NextResponse.json(
      { error: "Active subscription required", code: "NO_SUBSCRIPTION" },
      { status: 403 }
    );
  }

  // Get plan limits
  const limitKey: PlanLimitKey = access.isGrandfathered
    ? "grandfathered"
    : (access.tier as PlanLimitKey) || "builder";
  const limits = PLAN_LIMITS[limitKey];

  // Gate weekly behind founder/grandfathered
  if (type === "weekly" && !limits.weeklyEnabled) {
    return NextResponse.json(
      { error: "Weekly planning requires the Founder plan", code: "WEEKLY_LOCKED" },
      { status: 403 }
    );
  }

  // Check monthly standup count for daily standups
  if (type === "daily") {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { count } = await supabase
      .from("standups")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("type", "daily")
      .gte("created_at", monthStart);

    if ((count ?? 0) >= limits.dailyStandupsPerMonth) {
      return NextResponse.json(
        {
          error: `You've reached your ${limits.dailyStandupsPerMonth} standup limit this month. Upgrade for more.`,
          code: "MONTHLY_LIMIT",
        },
        { status: 403 }
      );
    }
  }

  const maxMinutes = type === "daily" ? limits.dailyMaxMinutes : limits.weeklyMaxMinutes;

  const today = new Date().toISOString().split("T")[0];
  const { data: standup, error } = await supabase
    .from("standups")
    .insert({
      user_id: user.id,
      type,
      date: today,
    })
    .select()
    .single();

  if (error) {
    console.error("Standup start error:", error);
    return NextResponse.json({ error: "Failed to start standup" }, { status: 500 });
  }

  return NextResponse.json({
    standup_id: standup.id,
    agent_id: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? null,
    max_minutes: maxMinutes,
  });
}
