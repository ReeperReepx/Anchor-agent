"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { OnboardingData } from "./types";
import {
  StepWelcome,
  StepName,
  StepSchedule,
  StepGoals,
  StepPreference,
  StepAccountability,
  StepComplete,
} from "./steps";

const TOTAL_STEPS = 6;

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    standup_time: "09:00",
    goal_categories: [],
    preference: "solo",
    accountability_style: "direct",
  });
  const router = useRouter();

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleCalendarDownload() {
    const res = await fetch("/api/calendar/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        standup_time: data.standup_time,
        timezone: data.timezone,
        name: data.name,
      }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "anchor-standup.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleComplete() {
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("users").upsert({
        id: user.id,
        email: user.email!,
        name: data.name,
        timezone: data.timezone,
        standup_time: data.standup_time,
        goal_categories: data.goal_categories,
        preference: data.preference,
        accountability_style: data.accountability_style,
        onboarded_at: new Date().toISOString(),
      });

      await supabase.from("streaks").upsert({
        user_id: user.id,
        current_streak: 0,
        longest_streak: 0,
        last_standup_date: null,
      });
    }

    router.push("/dashboard");
  }

  const canProceed = (() => {
    switch (step) {
      case 1:
        return data.name.trim().length > 0;
      case 3:
        return data.goal_categories.length > 0;
      default:
        return true;
    }
  })();

  const stepProps = { data, setData, next };

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex flex-col">
      {step > 0 && step < TOTAL_STEPS && (
        <div className="px-6 pt-6">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => {
                const stepNum = i + 1;
                const isDone = step > stepNum;
                const isActive = step === stepNum;
                return (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isDone
                        ? "w-8 bg-[#C4654A]"
                        : isActive
                          ? "w-8 bg-[#C4654A] shadow-[0_0_8px_rgba(196,101,74,0.4)]"
                          : "w-2 bg-[#E8DDD3]"
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-center text-[13px] text-[#a89a8e]">
              Step <span className="text-[#C4654A] font-medium">{step}</span> of {TOTAL_STEPS - 1}
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          {step === 0 && <StepWelcome next={next} />}
          {step === 1 && <StepName {...stepProps} canProceed={canProceed} />}
          {step === 2 && <StepSchedule {...stepProps} />}
          {step === 3 && <StepGoals {...stepProps} />}
          {step === 4 && <StepPreference {...stepProps} />}
          {step === 5 && <StepAccountability {...stepProps} />}
          {step === 6 && (
            <StepComplete
              data={data}
              loading={loading}
              onComplete={handleComplete}
              onCalendarDownload={handleCalendarDownload}
            />
          )}

          {step > 0 && step < 6 && (
            <div className="flex items-center justify-between mt-10">
              <button
                onClick={back}
                className="text-sm text-[#8a7e74] hover:text-[#2C2825] transition-colors"
              >
                Back
              </button>
              <Button onClick={next} disabled={!canProceed}>
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
