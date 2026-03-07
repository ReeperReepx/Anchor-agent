interface StandupSummaries {
  done_summary: string | null;
  planned_summary: string | null;
  blockers_summary: string | null;
}

export async function summarizeTranscript(
  transcript: string
): Promise<StandupSummaries> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey || !transcript || transcript.length < 20) {
    return { done_summary: null, planned_summary: null, blockers_summary: null };
  }

  const prompt = `You are Anchor, an AI standup assistant. Extract structured summaries from this standup transcript.

Transcript:
${transcript}

Return a JSON object with exactly these three keys:
- "done_summary": What they accomplished (1-3 sentences, specific)
- "planned_summary": What they plan to do next (1-3 sentences, specific)
- "blockers_summary": Any blockers or challenges mentioned (1-2 sentences, or null if none)

Be concise and specific. Use their actual words/projects. If a section wasn't discussed, use null.
Return ONLY valid JSON, no markdown or extra text.`;

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      console.error("[AI] DeepSeek error:", res.status, await res.text());
      return { done_summary: null, planned_summary: null, blockers_summary: null };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return { done_summary: null, planned_summary: null, blockers_summary: null };
    }

    // Parse JSON — handle markdown code blocks if returned
    const jsonStr = content.replace(/^```json?\s*/, "").replace(/\s*```$/, "");
    const parsed = JSON.parse(jsonStr);

    return {
      done_summary: parsed.done_summary || null,
      planned_summary: parsed.planned_summary || null,
      blockers_summary: parsed.blockers_summary || null,
    };
  } catch (err) {
    console.error("[AI] Summarization failed:", err);
    return { done_summary: null, planned_summary: null, blockers_summary: null };
  }
}
