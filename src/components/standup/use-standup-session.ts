"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import type { StandupType } from "@/lib/types/database";
import type { SessionState } from "./standup-constants";

export function useStandupSession() {
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
  const [access, setAccess] = useState<{
    hasAccess: boolean;
    isGrandfathered: boolean;
    tier: string | null;
    loading: boolean;
  }>({ hasAccess: true, isGrandfathered: false, tier: null, loading: true });
  const [maxMinutes, setMaxMinutes] = useState<number>(10);
  const maxMinutesRef = useRef<number>(10);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const standupIdRef = useRef<string | null>(null);
  const transcriptRef = useRef<string[]>([]);
  const wasActiveRef = useRef(false);
  const questionStepRef = useRef(0);
  const endingRef = useRef(false);

  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => r.json())
      .then((data) => {
        setAccess({
          hasAccess: data.hasAccess || data.isGrandfathered,
          isGrandfathered: data.isGrandfathered,
          tier: data.tier,
          loading: false,
        });
      })
      .catch(() => setAccess((prev) => ({ ...prev, loading: false })));
  }, []);

  const conversation = useConversation({
    onConnect: () => {
      if (process.env.NODE_ENV === "development") console.log("[Anchor] ElevenLabs connected");
      wasActiveRef.current = true;
      setState("active");
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      const maxMs = (maxMinutesRef.current + 0.5) * 60 * 1000;
      maxTimerRef.current = setTimeout(() => {
        if (wasActiveRef.current && !endingRef.current) {
          endingRef.current = true;
          conversation.endSession();
        }
      }, maxMs);
    },
    onDisconnect: async (details) => {
      if (process.env.NODE_ENV === "development") console.log("[Anchor] ElevenLabs disconnected", details);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (maxTimerRef.current) {
        clearTimeout(maxTimerRef.current);
        maxTimerRef.current = null;
      }

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
      if (message.source === "user" || message.source === "ai") {
        const role = message.source === "user" ? "You" : "Anchor";
        transcriptRef.current.push(`${role}: ${message.message}`);
        setLiveMessages((prev) => [...prev.slice(-4), { role, text: message.message }]);

        if (message.source === "ai") {
          const msg = message.message.toLowerCase();

          if (msg.includes("what's next") || msg.includes("what are you planning") || msg.includes("plan for today") || msg.includes("what do you want to") || msg.includes("priorities")) {
            questionStepRef.current = Math.max(questionStepRef.current, 1);
            setQuestionStep(questionStepRef.current);
          } else if (msg.includes("blocker") || msg.includes("blocking") || msg.includes("stuck") || msg.includes("obstacle") || msg.includes("in the way") || msg.includes("challenge")) {
            questionStepRef.current = Math.max(questionStepRef.current, 2);
            setQuestionStep(questionStepRef.current);
          }

          const goodbyePhrases = [
            "have a great", "have a good", "good luck", "go crush it",
            "talk to you", "see you", "until next time", "that's a wrap",
            "standup is done", "standup complete", "all done", "you're all set",
            "catch you", "take care",
          ];
          if (goodbyePhrases.some((phrase) => msg.includes(phrase)) && !endingRef.current) {
            endingRef.current = true;
            setTimeout(() => {
              conversation.endSession();
            }, 3000);
          }
        }
      }
    },
    onError: (err) => {
      if (process.env.NODE_ENV === "development") console.error("[Anchor] ElevenLabs error:", err);
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
      if (maxTimerRef.current) clearTimeout(maxTimerRef.current);
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
    endingRef.current = false;
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }

    try {
      const startRes = await fetch("/api/standup/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: standupType }),
      });
      if (!startRes.ok) {
        const body = await startRes.json().catch(() => ({}));
        throw new Error(body.error || "Failed to start session");
      }
      const { standup_id, max_minutes: serverMaxMinutes } = await startRes.json();
      standupIdRef.current = standup_id;
      const sessionMaxMinutes = serverMaxMinutes || 10;
      setMaxMinutes(sessionMaxMinutes);
      maxMinutesRef.current = sessionMaxMinutes;

      const urlRes = await fetch("/api/elevenlabs/signed-url");
      if (!urlRes.ok) {
        const body = await urlRes.json().catch(() => ({}));
        throw new Error(body.error || "Failed to connect to voice agent");
      }
      const { signed_url } = await urlRes.json();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch (micErr) {
        throw new Error("Microphone access denied. Please allow mic access and try again.");
      }

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
      if (process.env.NODE_ENV === "development") console.error("[Anchor] Start error:", err);
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

  const canWeekly = access.isGrandfathered || access.tier === "founder";

  return {
    standupType,
    setStandupType,
    state,
    setState,
    elapsed,
    error,
    questionStep,
    liveMessages,
    completionData,
    access,
    maxMinutes,
    canWeekly,
    conversation,
    startSession,
    endSession,
    formatTimer,
  };
}
