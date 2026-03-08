"use client";

import { useRouter } from "next/navigation";
import type { StandupType } from "@/lib/types/database";
import { SESSION_INFO } from "./standup-constants";

export function SessionIdleView({
  standupType,
  setStandupType,
  canWeekly,
  startSession,
}: {
  standupType: StandupType;
  setStandupType: (t: StandupType) => void;
  canWeekly: boolean;
  startSession: () => void;
}) {
  const router = useRouter();
  const info = SESSION_INFO[standupType];

  return (
    <>
      <div className="flex gap-2 justify-center mb-10">
        {(["daily", "weekly"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              if (t === "weekly" && !canWeekly) return;
              setStandupType(t);
            }}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              standupType === t
                ? "bg-[#B85C42] text-white"
                : t === "weekly" && !canWeekly
                  ? "bg-[#F0F0F0] text-[#D1D5DB] cursor-not-allowed"
                  : "bg-[#F0F0F0] text-[#6B7280] hover:text-[#1D1D1F]"
            }`}
            title={t === "weekly" && !canWeekly ? "Founder plan required" : undefined}
          >
            {t === "daily" ? "Daily" : "Weekly"}
            {t === "weekly" && !canWeekly && (
              <span className="ml-1 text-[10px] text-[#9CA3AF]">PRO</span>
            )}
          </button>
        ))}
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-[-0.02em] mb-3">{info.title}</h1>
      <p className="text-[#6B7280] mb-1">{info.description}</p>
      <p className="text-[13px] text-[#9CA3AF] mb-10">{info.cap}</p>

      <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[rgba(184,92,66,0.06)] animate-[mic-pulse_2.5s_ease-in-out_infinite]" />
        <div className="absolute inset-3 rounded-full bg-[rgba(184,92,66,0.08)]" />
        <button
          onClick={startSession}
          aria-label="Start standup session"
          className="relative w-28 h-28 rounded-full bg-gradient-to-b from-[#C46B50] to-[#B85C42] text-white flex items-center justify-center transition-all hover:from-[#D4917F] hover:to-[#C46B50] active:scale-95 shadow-[0_4px_24px_rgba(184,92,66,0.35),0_8px_40px_rgba(184,92,66,0.15)] hover:shadow-[0_6px_32px_rgba(184,92,66,0.5)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B85C42]/50"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
          </svg>
        </button>
      </div>
      <p className="text-[13px] text-[#9CA3AF] mt-4">Tap to start</p>
      <p className="text-[11px] text-[#D1D5DB] mt-1">Microphone access required</p>

      <button
        onClick={() => router.push("/dashboard")}
        className="block mx-auto mt-4 text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
      >
        Back to dashboard
      </button>
    </>
  );
}
