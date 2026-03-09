import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PROMO_CAP = 10;

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  const supabase = getAdminSupabase();

  const { count, error } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .in("status", ["active", "trialing"]);

  if (error) {
    return NextResponse.json({ remaining: 0, total: PROMO_CAP }, { status: 500 });
  }

  const taken = count ?? 0;
  const remaining = Math.max(0, PROMO_CAP - taken);

  return NextResponse.json(
    { remaining, total: PROMO_CAP },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    }
  );
}
