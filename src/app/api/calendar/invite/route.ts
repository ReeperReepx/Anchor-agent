import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateStandupICS } from "@/lib/utils/ics";

interface InviteBody {
  standup_time: string;
  timezone: string;
  name: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: InviteBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.standup_time || !/^\d{2}:\d{2}$/.test(body.standup_time)) {
    return NextResponse.json({ error: "Invalid standup_time format" }, { status: 400 });
  }

  if (!body.timezone || typeof body.timezone !== "string") {
    return NextResponse.json({ error: "Invalid timezone" }, { status: 400 });
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: body.timezone });
  } catch {
    return NextResponse.json({ error: "Invalid timezone" }, { status: 400 });
  }

  if (!body.name || typeof body.name !== "string" || body.name.length > 100) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  const ics = generateStandupICS({
    standupTime: body.standup_time,
    timezone: body.timezone,
    name: body.name,
  });

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="anchor-standup.ics"',
    },
  });
}
