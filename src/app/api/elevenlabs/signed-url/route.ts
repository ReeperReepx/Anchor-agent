import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!agentId || !apiKey) {
    return NextResponse.json(
      { error: "ElevenLabs not configured" },
      { status: 500 }
    );
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
    {
      headers: { "xi-api-key": apiKey },
    }
  );

  if (!response.ok) {
    console.error("ElevenLabs signed-url error:", response.status);
    return NextResponse.json(
      { error: "Failed to get conversation URL" },
      { status: 502 }
    );
  }

  const data = await response.json();
  return NextResponse.json({ signed_url: data.signed_url });
}
