"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useStandupSession } from "@/components/standup/use-standup-session";
import { WaveformBars } from "@/components/standup/waveform-bars";
import { SessionIdleView } from "@/components/standup/session-idle-view";
import { SessionActiveView } from "@/components/standup/session-active-view";
import { SessionCompletedView } from "@/components/standup/session-completed-view";
import { SessionErrorView } from "@/components/standup/session-error-view";

export default function StandupPage() {
  const router = useRouter();
  const {
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
  } = useStandupSession();

  if (access.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <span className="spinner text-[#B85C42]" style={{ width: 24, height: 24 }} />
        <p className="text-sm text-[#6B7280]">Loading your session...</p>
      </div>
    );
  }

  if (!access.hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-semibold text-[#1D1D1F] mb-3">Subscribe to continue</h1>
          <p className="text-[#6B7280] mb-8">Choose a plan to start your daily standups.</p>
          <Button variant="primary" className="w-full" onClick={() => router.push("/pricing")}>
            View Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md text-center">
        {state === "idle" && (
          <SessionIdleView
            standupType={standupType}
            setStandupType={setStandupType}
            canWeekly={canWeekly}
            startSession={startSession}
          />
        )}

        {state === "connecting" && (
          <>
            <WaveformBars active={true} />
            <p className="text-[#6B7280]">Connecting to your AI standup partner...</p>
          </>
        )}

        {state === "active" && (
          <SessionActiveView
            standupType={standupType}
            elapsed={elapsed}
            questionStep={questionStep}
            isSpeaking={conversation.isSpeaking}
            getVolume={conversation.isSpeaking ? conversation.getOutputVolume : conversation.getInputVolume}
            liveMessages={liveMessages}
            maxMinutes={maxMinutes}
            endSession={endSession}
            formatTimer={formatTimer}
          />
        )}

        {state === "completed" && (
          <SessionCompletedView
            standupType={standupType}
            elapsed={elapsed}
            completionData={completionData}
            formatTimer={formatTimer}
          />
        )}

        {state === "error" && (
          <SessionErrorView error={error} onRetry={() => setState("idle")} />
        )}
      </div>
    </div>
  );
}
