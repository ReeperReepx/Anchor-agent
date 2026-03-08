"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import type { StandupType } from "@/lib/types/database";
import { SESSION_INFO } from "./standup-constants";
import { WaveformBars } from "./waveform-bars";

export function SessionActiveView({
  standupType,
  elapsed,
  questionStep,
  isSpeaking,
  getVolume,
  liveMessages,
  maxMinutes,
  endSession,
  formatTimer,
}: {
  standupType: StandupType;
  elapsed: number;
  questionStep: number;
  isSpeaking: boolean;
  getVolume?: () => number;
  liveMessages: Array<{ role: string; text: string }>;
  maxMinutes: number;
  endSession: () => void;
  formatTimer: (s: number) => string;
}) {
  const info = SESSION_INFO[standupType];

  return (
    <>
      <div className="text-xs text-[#FF9500] uppercase tracking-[1px] font-medium mb-6">
        {info.title}
      </div>

      <div className="flex items-center justify-center gap-0 mb-6">
        {["Done", "Planned", "Blockers"].map((label, i) => (
          <React.Fragment key={label}>
            {i > 0 && (
              <div className={`w-10 h-0.5 ${questionStep >= i ? "bg-[#34C759]" : "bg-[#E5E5E5]"}`} />
            )}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-3 h-3 rounded-full border-2 transition-all ${
                questionStep > i
                  ? "bg-[#34C759] border-[#34C759]"
                  : questionStep === i
                  ? "border-[#FF9500] shadow-[0_0_0_4px_rgba(255,149,0,0.15)]"
                  : "border-[#E5E5E5]"
              }`} />
              <span className={`text-[10px] font-medium ${
                questionStep > i ? "text-[#34C759]" : questionStep === i ? "text-[#FF9500]" : "text-[#9CA3AF]"
              }`}>{label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="text-5xl sm:text-6xl font-mono font-bold text-[#1D1D1F] mb-2">
        {formatTimer(elapsed)}
      </div>
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-2.5 h-2.5 bg-[#34C759] rounded-full animate-pulse" />
        <span className="text-sm text-[#86868B]">
  {isSpeaking ? "Anchor is speaking..." : "Listening..."}
        </span>
      </div>

      <WaveformBars active={true} getVolume={getVolume} />

      {liveMessages.length > 0 && (
        <div className="bg-[#F0F0F0] rounded-[12px] px-3 sm:px-4 py-3 text-left max-h-[100px] overflow-y-auto mb-4">
          {liveMessages.slice(-3).map((msg, i) => (
            <div key={i} className="text-[13px] mb-1 last:mb-0">
              <span className={`font-medium ${msg.role === "Anchor" ? "text-[#FF9500]" : "text-[#86868B]"}`}>
                {msg.role}:
              </span>{" "}
              <span className="text-[#4B5563]">{msg.text}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-[#9CA3AF] mb-2">
        Speak naturally. Anchor is listening.
      </p>
      {elapsed >= maxMinutes * 60 - 60 && elapsed < maxMinutes * 60 && (
        <p className="text-xs text-[#FF9500] mb-2 animate-pulse">
          Less than 1 minute remaining
        </p>
      )}
      <p className="text-[11px] text-[#D1D5DB] mb-6">
        {maxMinutes} min max
      </p>
      <Button variant="secondary" onClick={endSession} className="px-10">
        End Session
      </Button>
    </>
  );
}
