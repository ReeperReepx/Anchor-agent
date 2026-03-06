"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { StandupType } from "@/lib/types/database";

type SessionState = "idle" | "connecting" | "active" | "completed" | "error";

const SESSION_INFO: Record<StandupType, { title: string; description: string; cap: string }> = {
  daily: {
    title: "Daily Standup",
    description: "Three questions. Five minutes. What you did, what\u2019s next, what\u2019s blocking you.",
    cap: "5-10 min",
  },
  weekly: {
    title: "Weekly Planning",
    description: "A deeper session. Review your week, set goals, dig into blockers.",
    cap: "Up to 45 min",
  },
};

function WaveformBars({ active, getVolume }: { active: boolean; getVolume?: () => number }) {
  const [levels, setLevels] = useState<number[]>(Array(20).fill(8));

  useEffect(() => {
    if (!active || !getVolume) return;
    const interval = setInterval(() => {
      const vol = getVolume();
      setLevels(
        Array.from({ length: 20 }, (_, i) => {
          const base = vol * 64;
          const variance = Math.sin(Date.now() / 200 + i * 0.5) * 12;
          return Math.max(4, Math.min(64, base + variance));
        })
      );
    }, 80);
    return () => clearInterval(interval);
  }, [active, getVolume]);

  return (
    <div className="flex items-center justify-center gap-[3px] h-16 my-8">
      {levels.map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-100 ${active ? "bg-[#C4654A]" : "bg-[#E8DDD3]"}`}
          style={{ height: active ? `${h}px` : "8px" }}
        />
      ))}
    </div>
  );
}

export default function StandupPage() {
  const [standupType, setStandupType] = useState<StandupType>("daily");
  const [state, setState] = useState<SessionState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [questionStep, setQuestionStep] = useState(0);
  const [liveMessages, setLiveMessages] = useState<Array<{ role: string; text: string }>>([]);
  const [completionData, setCompletionData] = useState<{
    done: string | null;
    planned: string | null;
    blockers: string | null;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const standupIdRef = useRef<string | null>(null);
  const transcriptRef = useRef<string[]>([]);
  const wasActiveRef = useRef(false);
  const questionStepRef = useRef(0);
  const router = useRouter();

  const conversation = useConversation({
    onConnect: () => {
      console.log("[Anchor] ElevenLabs connected");
      wasActiveRef.current = true;
      setState("active");
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    },
    onDisconnect: async (details) => {
      console.log("[Anchor] ElevenLabs disconnected, wasActive:", wasActiveRef.current, "details:", details);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Only complete if we actually had an active session
      if (!wasActiveRef.current) {
        setState("error");
        setError("Voice connection lost before session started");
        return;
      }
      wasActiveRef.current = false;

      const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

      try {
        const completeRes = await fetch("/api/standup/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            standup_id: standupIdRef.current,
            transcript: transcriptRef.current.join("\n"),
            duration_seconds: durationSeconds,
          }),
        });

        // Try to get summaries from the response
        if (completeRes.ok) {
          const result = await completeRes.json().catch(() => null);
          if (result?.done_summary || result?.planned_summary || result?.blockers_summary) {
            setCompletionData({
              done: result.done_summary,
              planned: result.planned_summary,
              blockers: result.blockers_summary,
            });
          }
        }

        setState("completed");
      } catch {
        setState("error");
        setError("Failed to save standup");
      }
    },
    onMessage: (message) => {
      console.log("[Anchor] Message:", message.source, message.message);
      if (message.source === "user" || message.source === "ai") {
        const role = message.source === "user" ? "You" : "Anchor";
        transcriptRef.current.push(`${role}: ${message.message}`);
        setLiveMessages((prev) => [...prev.slice(-4), { role, text: message.message }]);

        // Detect question transitions from AI messages
        if (message.source === "ai") {
          const msg = message.message.toLowerCase();
          if (msg.includes("what's next") || msg.includes("what are you planning") || msg.includes("plan for today") || msg.includes("what do you want to") || msg.includes("priorities")) {
            questionStepRef.current = Math.max(questionStepRef.current, 1);
            setQuestionStep(questionStepRef.current);
          } else if (msg.includes("blocker") || msg.includes("blocking") || msg.includes("stuck") || msg.includes("obstacle") || msg.includes("in the way") || msg.includes("challenge")) {
            questionStepRef.current = Math.max(questionStepRef.current, 2);
            setQuestionStep(questionStepRef.current);
          }
        }
      }
    },
    onError: (err) => {
      console.error("[Anchor] ElevenLabs error:", err);
      setError(typeof err === "string" ? err : "Voice connection error");
      setState("error");
      wasActiveRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    },
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startSession = useCallback(async () => {
    setState("connecting");
    setError(null);
    setElapsed(0);
    setQuestionStep(0);
    setLiveMessages([]);
    setCompletionData(null);
    questionStepRef.current = 0;
    transcriptRef.current = [];
    wasActiveRef.current = false;

    try {
      // 1. Create the standup record in DB
      const startRes = await fetch("/api/standup/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: standupType }),
      });
      if (!startRes.ok) {
        const body = await startRes.json().catch(() => ({}));
        throw new Error(body.error || "Failed to start session");
      }
      const { standup_id } = await startRes.json();
      standupIdRef.current = standup_id;
      console.log("[Anchor] Standup created:", standup_id);

      // 2. Get signed URL for ElevenLabs
      const urlRes = await fetch("/api/elevenlabs/signed-url");
      if (!urlRes.ok) {
        const body = await urlRes.json().catch(() => ({}));
        throw new Error(body.error || "Failed to connect to voice agent");
      }
      const { signed_url } = await urlRes.json();
      console.log("[Anchor] Got signed URL, starting conversation...");

      // 3. Request mic permission explicitly first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream — we just needed the permission grant
        stream.getTracks().forEach((t) => t.stop());
        console.log("[Anchor] Mic permission granted");
      } catch (micErr) {
        throw new Error("Microphone access denied. Please allow mic access and try again.");
      }

      // 4. Fetch user context for agent dynamic variables
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "there";
      let goals = "";
      let streak = "0";
      let lastDone = "none";

      if (user) {
        const [profileRes, streakRes, lastStandupRes] = await Promise.all([
          supabase.from("users").select("goal_categories").eq("id", user.id).single(),
          supabase.from("streaks").select("current_streak").eq("user_id", user.id).single(),
          supabase.from("standups")
            .select("planned_summary")
            .eq("user_id", user.id)
            .not("planned_summary", "is", null)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
        ]);

        goals = (profileRes.data?.goal_categories ?? []).join(", ") || "none";
        streak = String(streakRes.data?.current_streak ?? 0);
        lastDone = lastStandupRes.data?.planned_summary || "none";
      }

      console.log("[Anchor] Dynamic vars:", { name: userName, goals, streak, last_done: lastDone });

      // 5. Start ElevenLabs conversation with dynamic variables
      await conversation.startSession({
        signedUrl: signed_url,
        dynamicVariables: {
          name: userName,
          goals,
          streak,
          last_done: lastDone,
        },
      });
    } catch (err) {
      console.error("[Anchor] Start error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }, [standupType, conversation]);

  const endSession = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const info = SESSION_INFO[standupType];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md text-center">
        {state === "idle" && (
          <>
            <div className="flex gap-2 justify-center mb-10">
              {(["daily", "weekly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setStandupType(t)}
                  className={`px-5 py-2 rounded-[10px] text-sm font-medium transition-colors ${
                    standupType === t
                      ? "bg-[#C4654A] text-white"
                      : "bg-[#F5F0E8] text-[#8a7e74] hover:text-[#2C2825]"
                  }`}
                >
                  {t === "daily" ? "Daily" : "Weekly"}
                </button>
              ))}
            </div>

            <h1 className="text-3xl font-semibold text-[#2C2825] tracking-[-0.02em] mb-3">{info.title}</h1>
            <p className="text-[#8a7e74] mb-1">{info.description}</p>
            <p className="text-[13px] text-[#a89a8e] mb-10">{info.cap}</p>

            <button
              onClick={startSession}
              className="group relative w-28 h-28 mx-auto rounded-full bg-[#C4654A] text-white flex items-center justify-center transition-all hover:bg-[#D4856A] active:scale-95 shadow-[0_4px_24px_rgba(196,101,74,0.35)] hover:shadow-[0_6px_32px_rgba(196,101,74,0.5)]"
              style={{ animation: "mic-pulse 2.5s ease-in-out infinite" }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
              </svg>
            </button>
            <p className="text-[13px] text-[#a89a8e] mt-4">Tap to start</p>

            <button
              onClick={() => router.push("/dashboard")}
              className="block mx-auto mt-4 text-sm text-[#a89a8e] hover:text-[#8a7e74] transition-colors"
            >
              Back to dashboard
            </button>
          </>
        )}

        {state === "connecting" && (
          <>
            <WaveformBars active={true} />
            <p className="text-[#8a7e74]">Connecting to your AI standup partner...</p>
          </>
        )}

        {state === "active" && (
          <>
            <div className="text-xs text-[#C4654A] uppercase tracking-[1px] font-medium mb-6">
              {info.title}
            </div>

            <div className="flex items-center justify-center gap-0 mb-6">
              {["Done", "Planned", "Blockers"].map((label, i) => (
                <React.Fragment key={label}>
                  {i > 0 && (
                    <div className={`w-10 h-0.5 ${questionStep >= i ? "bg-[#2D8A56]" : "bg-[#E8DDD3]"}`} />
                  )}
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-3 h-3 rounded-full border-2 transition-all ${
                      questionStep > i
                        ? "bg-[#2D8A56] border-[#2D8A56]"
                        : questionStep === i
                        ? "border-[#C4654A] shadow-[0_0_0_4px_rgba(196,101,74,0.15)]"
                        : "border-[#E8DDD3]"
                    }`} />
                    <span className={`text-[10px] font-medium ${
                      questionStep > i ? "text-[#2D8A56]" : questionStep === i ? "text-[#C4654A]" : "text-[#a89a8e]"
                    }`}>{label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div className="text-6xl font-mono font-bold text-[#2C2825] mb-2">
              {formatTimer(elapsed)}
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 bg-[#2D8A56] rounded-full animate-pulse" />
              <span className="text-sm text-[#8a7e74]">
                {conversation.isSpeaking ? "Anchor is speaking..." : "Listening..."}
              </span>
            </div>

            <WaveformBars
              active={true}
              getVolume={conversation.isSpeaking ? conversation.getOutputVolume : conversation.getInputVolume}
            />

            {liveMessages.length > 0 && (
              <div className="bg-[#F5F0E8] rounded-[12px] px-4 py-3 text-left max-h-[100px] overflow-y-auto mb-4">
                {liveMessages.slice(-3).map((msg, i) => (
                  <div key={i} className="text-[13px] mb-1 last:mb-0">
                    <span className={`font-medium ${msg.role === "Anchor" ? "text-[#C4654A]" : "text-[#8a7e74]"}`}>
                      {msg.role}:
                    </span>{" "}
                    <span className="text-[#5a524a]">{msg.text}</span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-[#a89a8e] mb-8">
              Speak naturally. Anchor is listening.
            </p>
            <Button variant="secondary" onClick={endSession} className="px-10">
              End Session
            </Button>
          </>
        )}

        {state === "completed" && (
          <>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[rgba(45,138,86,0.1)] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#2D8A56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#2C2825]">{info.title} complete</h2>
              <span className="text-sm text-[#8a7e74]">{formatTimer(elapsed)}</span>
            </div>

            {completionData && (completionData.done || completionData.planned || completionData.blockers) && (
              <div className="bg-[#F5F0E8] rounded-[14px] p-5 text-left mb-8 space-y-4">
                {completionData.done && (
                  <div className="pl-3 border-l-2 border-[rgba(45,138,86,0.4)]">
                    <div className="text-[10px] font-semibold text-[#2D8A56] uppercase tracking-[0.5px] mb-1">What you got done</div>
                    <p className="text-[13px] text-[#5a524a] leading-relaxed">{completionData.done}</p>
                  </div>
                )}
                {completionData.planned && (
                  <div className="pl-3 border-l-2 border-[rgba(59,111,196,0.4)]">
                    <div className="text-[10px] font-semibold text-[#3B6FC4] uppercase tracking-[0.5px] mb-1">What&apos;s next</div>
                    <p className="text-[13px] text-[#5a524a] leading-relaxed">{completionData.planned}</p>
                  </div>
                )}
                {completionData.blockers && (
                  <div className="pl-3 border-l-2 border-[rgba(196,48,48,0.4)]">
                    <div className="text-[10px] font-semibold text-[#C43030] uppercase tracking-[0.5px] mb-1">Blockers</div>
                    <p className="text-[13px] text-[#5a524a] leading-relaxed">{completionData.blockers}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button onClick={() => router.push("/dashboard")} className="px-10">
                Back to Dashboard
              </Button>
              <Button variant="ghost" onClick={() => router.push("/history")}>
                View History
              </Button>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <div className="w-16 h-16 bg-[rgba(239,68,68,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-[#EF4444] mb-6">{error}</p>
            <Button variant="secondary" onClick={() => setState("idle")}>
              Try again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
