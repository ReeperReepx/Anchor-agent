"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-16 my-8">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all ${active ? "bg-[#C4654A]" : "bg-[#E8DDD3]"}`}
          style={{
            height: active ? undefined : "8px",
            animation: active ? `wave 1.2s ease-in-out infinite` : "none",
            animationDelay: `${i * 0.06}s`,
          }}
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startSession = useCallback(async () => {
    setState("connecting");
    setError(null);

    try {
      const res = await fetch("/api/standup/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: standupType }),
      });
      if (!res.ok) throw new Error("Failed to start session");

      setState("active");
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }, [standupType]);

  const endSession = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      await fetch("/api/standup/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration_seconds: elapsed }),
      });
      setState("completed");
    } catch {
      setState("error");
      setError("Failed to save standup");
    }
  }, [elapsed]);

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

            {/* Mic-centric CTA */}
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
            <p className="text-[#8a7e74]">Preparing your standup...</p>
          </>
        )}

        {state === "active" && (
          <>
            <div className="text-xs text-[#C4654A] uppercase tracking-[1px] font-medium mb-6">
              {info.title}
            </div>
            <div className="text-6xl font-mono font-bold text-[#2C2825] mb-2">
              {formatTimer(elapsed)}
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 bg-[#2D8A56] rounded-full animate-pulse" />
              <span className="text-sm text-[#8a7e74]">Session active</span>
            </div>

            <WaveformBars active={true} />

            <p className="text-sm text-[#a89a8e] mb-8">
              Speak naturally. The AI is listening.
            </p>
            <Button variant="secondary" onClick={endSession} className="px-10">
              End Session
            </Button>
          </>
        )}

        {state === "completed" && (
          <>
            <div className="w-16 h-16 bg-[rgba(45,138,86,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#2D8A56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2C2825] mb-2">{info.title} complete</h2>
            <p className="text-[#8a7e74] mb-8">Duration: {formatTimer(elapsed)}</p>
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
