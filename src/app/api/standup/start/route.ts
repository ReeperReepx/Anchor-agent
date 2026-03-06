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

  let type: "daily" | "weekly" = "daily";
  try {
    const body = await request.json();
    if (body.type === "weekly") type = "weekly";
  } catch {
    // No body or invalid JSON — default to daily
  }

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return standup ID and ElevenLabs config placeholder
  return NextResponse.json({
    standup_id: standup.id,
    agent_id: process.env.ELEVENLABS_AGENT_ID ?? null,
  });
}
