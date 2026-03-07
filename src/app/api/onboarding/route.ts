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

  // Validate timezone
  try {
    Intl.DateTimeFormat(undefined, { timeZone: body.timezone.trim() });
  } catch {
    return NextResponse.json({ error: "Invalid timezone" }, { status: 400 });
  }

  // Validate standup_time format and range
  if (!/^\d{2}:\d{2}$/.test(body.standup_time)) {
    return NextResponse.json({ error: "Invalid standup_time format" }, { status: 400 });
  }
  const [hours, minutes] = body.standup_time.split(":").map(Number);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return NextResponse.json({ error: "Invalid standup_time value" }, { status: 400 });
  }

  // Validate preference enum
  const VALID_PREFS: string[] = ["solo", "shared", "both"];
  if (!VALID_PREFS.includes(body.preference)) {
    return NextResponse.json({ error: "Invalid preference" }, { status: 400 });
  }

  // Validate goal_categories
  if (!Array.isArray(body.goal_categories) || body.goal_categories.length > 10) {
    return NextResponse.json({ error: "Invalid goal_categories" }, { status: 400 });
  }
  for (const g of body.goal_categories) {
    if (typeof g !== "string" || g.length > 50) {
      return NextResponse.json({ error: "Invalid goal category" }, { status: 400 });
    }
  }

  const { error } = await supabase.from("users").upsert({
    id: user.id,
    email: user.email!,
    timezone: body.timezone.trim(),
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
