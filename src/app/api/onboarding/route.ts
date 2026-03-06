import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UserPreference } from "@/lib/types/database";

interface OnboardingBody {
  timezone: string;
  standup_time: string;
  goal_categories: string[];
  preference: UserPreference;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: OnboardingBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.timezone || !body.standup_time || !body.preference) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!/^\d{2}:\d{2}$/.test(body.standup_time)) {
    return NextResponse.json({ error: "Invalid standup_time format" }, { status: 400 });
  }

  const { error } = await supabase.from("users").upsert({
    id: user.id,
    email: user.email!,
    timezone: body.timezone,
    standup_time: body.standup_time,
    goal_categories: body.goal_categories,
    preference: body.preference,
    onboarded_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }

  // Initialize streak record
  await supabase.from("streaks").upsert({
    user_id: user.id,
    current_streak: 0,
    longest_streak: 0,
    last_standup_date: null,
  });

  return NextResponse.json({ success: true });
}
