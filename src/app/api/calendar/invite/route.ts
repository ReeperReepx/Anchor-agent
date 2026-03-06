import { NextResponse } from "next/server";
import { generateStandupICS } from "@/lib/utils/ics";

interface InviteBody {
  standup_time: string;
  timezone: string;
  name: string;
}

export async function POST(request: Request) {
  const body: InviteBody = await request.json();

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
