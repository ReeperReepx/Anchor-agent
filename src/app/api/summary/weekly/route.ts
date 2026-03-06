import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWeekStart } from "@/lib/utils/week";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const weekOf = searchParams.get("week_of") || getWeekStart();

  // Get all standups from the requested week
  const weekEnd = new Date(weekOf);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const { data: standups } = await supabase
    .from("standups")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", weekOf)
    .lt("date", weekEnd.toISOString().split("T")[0])
    .not("done_summary", "is", null)
    .order("date", { ascending: true });

  if (!standups || standups.length === 0) {
    return NextResponse.json({
      summary: null,
      message: "No standups found for this week.",
    });
  }

  // Build context for the LLM
  const standupContext = standups
    .map(
      (s, i) =>
        `Day ${i + 1} (${s.date}):\n` +
        `  Done: ${s.done_summary || "N/A"}\n` +
        `  Planned: ${s.planned_summary || "N/A"}\n` +
        `  Blockers: ${s.blockers_summary || "N/A"}`
    )
    .join("\n\n");

  // Get user profile for personalization
  const { data: profile } = await supabase
    .from("users")
    .select("goal_categories")
    .eq("id", user.id)
    .single();

  const goals = profile?.goal_categories?.join(", ") || "general";

  const prompt = `You are Anchor, an accountability AI for solopreneurs. Generate a concise weekly summary for the user based on their daily standups this week.

User's goals: ${goals}
Week of: ${weekOf}
Number of standups: ${standups.length}/5

${standupContext}

Write a weekly summary with these sections:
1. **Wins** — What they accomplished (2-3 bullet points, specific)
2. **Patterns** — What you noticed about their work habits (consistency, focus areas, blockers that recurred)
3. **Next week** — Suggested focus based on what's planned and what's been blocked
4. **Streak check** — A one-liner about their consistency (${standups.length}/5 days)

Keep it direct, under 250 words. No fluff. Match the tone to someone building a ${goals} business.`;

  // Check if OpenAI or Anthropic API key is available
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

  if (!hasOpenAI && !hasAnthropic) {
    // Return the raw data without LLM processing
    return NextResponse.json({
      summary: null,
      raw_standups: standups,
      prompt,
      message:
        "No LLM API key configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY to enable weekly summaries.",
    });
  }

  let summaryText: string;

  if (hasAnthropic) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    summaryText = data.content?.[0]?.text || "Failed to generate summary.";
  } else {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 512,
      }),
    });
    const data = await res.json();
    summaryText =
      data.choices?.[0]?.message?.content || "Failed to generate summary.";
  }

  // Store in dedicated weekly_summaries table
  await supabase.from("weekly_summaries").upsert({
    user_id: user.id,
    week_of: weekOf,
    summary: summaryText,
    standup_count: standups.length,
  });

  return NextResponse.json({
    summary: summaryText,
    week_of: weekOf,
    standup_count: standups.length,
  });
}
