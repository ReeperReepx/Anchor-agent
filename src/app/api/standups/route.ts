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
  const parsedLimit = parseInt(searchParams.get("limit") ?? "20");
  const parsedOffset = parseInt(searchParams.get("offset") ?? "0");
  const limit = Math.min(Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 20, 100);
  const offset = Number.isFinite(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;
  const type = searchParams.get("type");

  let query = supabase
    .from("standups")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (type === "daily" || type === "weekly") {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Standups fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch standups" }, { status: 500 });
  }

  return NextResponse.json({ standups: data });
}
