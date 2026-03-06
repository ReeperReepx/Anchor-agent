import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface CalendarSyncBody {
  standup_time: string; // HH:MM format
  timezone: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "Google Calendar not configured" },
      { status: 503 }
    );
  }

  let body: CalendarSyncBody;
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

  // Parse standup time
  const [hours, minutes] = body.standup_time.split(":").map(Number);

  // Build recurring event
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + 10); // 10 min block

  // Google Calendar API event payload
  const event = {
    summary: "Anchor — Daily Standup",
    description:
      "Your daily voice standup with Anchor. Open the app and start talking.",
    start: {
      dateTime: startDate.toISOString(),
      timeZone: body.timezone,
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: body.timezone,
    },
    recurrence: ["RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR"],
    reminders: {
      useDefault: false,
      overrides: [{ method: "popup", minutes: 5 }],
    },
  };

  // TODO: Exchange user's OAuth token for Google Calendar access
  // For now, return the event payload that would be sent
  // In production: use googleapis package with user's refresh token

  return NextResponse.json({
    success: true,
    event,
    message:
      "Calendar event payload ready. Connect Google OAuth to create the event.",
  });
}
