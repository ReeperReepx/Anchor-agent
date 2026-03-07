import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/subscription";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access = await getUserAccess(supabase, user.id);

  return NextResponse.json({
    hasAccess: access.hasAccess,
    isGrandfathered: access.isGrandfathered,
    isTrial: access.isTrial,
    tier: access.tier,
    trialDaysLeft: access.trialDaysLeft,
  });
}
