import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ error: "Missing from/to params" }, { status: 400 });
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return NextResponse.json({ error: "Invalid date format (YYYY-MM-DD)" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("standups")
    .select("date, productivity_score")
    .eq("user_id", user.id)
    .gte("date", from)
    .lte("date", to)
    .not("productivity_score", "is", null)
    .order("date", { ascending: true });

  if (error) {
    console.error("Scores fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }

  return NextResponse.json(data);
}
