"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { StandupType } from "@/lib/types/database";
import { SESSION_INFO } from "./standup-constants";

export function SessionCompletedView({
  standupType,
  elapsed,
  completionData,
  formatTimer,
}: {
  standupType: StandupType;
  elapsed: number;
  completionData: { done: string | null; planned: string | null; blockers: string | null } | null;
  formatTimer: (s: number) => string;
}) {
  const router = useRouter();
  const info = SESSION_INFO[standupType];

  return (
    <>
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[rgba(45,138,86,0.1)] rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-[#2D8A56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#1D1D1F]">{info.title} complete</h2>
        <span className="text-sm text-[#6B7280]">{formatTimer(elapsed)}</span>
      </div>

      {completionData && (completionData.done || completionData.planned || completionData.blockers) && (
        <div className="bg-[#F0F0F0] rounded-xl p-5 text-left mb-8 space-y-4">
          {completionData.done && (
            <div className="pl-3 border-l-2 border-[rgba(45,138,86,0.4)]">
              <div className="text-[10px] font-semibold text-[#2D8A56] uppercase tracking-[0.5px] mb-1">What you got done</div>
              <p className="text-[13px] text-[#4B5563] leading-relaxed">{completionData.done}</p>
            </div>
          )}
          {completionData.planned && (
            <div className="pl-3 border-l-2 border-[rgba(59,111,196,0.4)]">
              <div className="text-[10px] font-semibold text-[#3B6FC4] uppercase tracking-[0.5px] mb-1">What&apos;s next</div>
              <p className="text-[13px] text-[#4B5563] leading-relaxed">{completionData.planned}</p>
            </div>
          )}
          {completionData.blockers && (
            <div className="pl-3 border-l-2 border-[rgba(196,48,48,0.4)]">
              <div className="text-[10px] font-semibold text-[#C43030] uppercase tracking-[0.5px] mb-1">Blockers</div>
              <p className="text-[13px] text-[#4B5563] leading-relaxed">{completionData.blockers}</p>
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
  );
}
