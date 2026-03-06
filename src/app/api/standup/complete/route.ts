import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateStreakUpdate } from "@/lib/utils/streaks";
import type { Streak } from "@/lib/types/database";

interface CompleteBody {
  standup_id?: string;
  transcript?: string;
  audio_url?: string;
  duration_seconds?: number;
  done_summary?: string;
  planned_summary?: string;
  blockers_summary?: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: CompleteBody = await request.json();

  // Find the most recent incomplete standup for this user
  const { data: standup } = await supabase
    .from("standups")
    .select("id")
    .eq("user_id", user.id)
    .is("transcript", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const standupId = body.standup_id ?? standup?.id;

  if (!standupId) {
    return NextResponse.json(
      { error: "No active standup found" },
      { status: 404 }
    );
  }

  // Update standup with results
  const { error: updateError } = await supabase
    .from("standups")
    .update({
      transcript: body.transcript ?? "Standup completed",
      audio_url: body.audio_url,
      duration_seconds: body.duration_seconds,
      done_summary: body.done_summary,
      planned_summary: body.planned_summary,
      blockers_summary: body.blockers_summary,
    })
    .eq("id", standupId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Update streak
  const today = new Date().toISOString().split("T")[0];
  const { data: currentStreak } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", user.id)
    .single<Streak>();

  if (currentStreak) {
    const streakUpdate = calculateStreakUpdate(currentStreak, today);
    await supabase
      .from("streaks")
      .update(streakUpdate)
      .eq("user_id", user.id);
  }

  return NextResponse.json({ success: true });
}
