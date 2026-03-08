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
  const { days } = body as { days: string[] };

  if (!Array.isArray(days) || days.length === 0) {
    return NextResponse.json(
      { error: "At least one day must be selected" },
      { status: 400 }
    );
  }

  const validDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const allValid = days.every((d) => validDays.includes(d));
  if (!allValid) {
    return NextResponse.json(
      { error: "Invalid day selection" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("partner_queue")
    .upsert(
      {
        user_id: user.id,
        selected_days: days,
        status: "waiting",
        joined_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    return NextResponse.json(
      { error: "Failed to join queue" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
