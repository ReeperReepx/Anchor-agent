"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { GOAL_OPTIONS, INPUT_CLASSES } from "../types";

const TOTAL_STEPS = 3;

interface MatchingOnboardingData {
  name: string;
  timezone: string;
  goal_categories: string[];
  preferred_day: string;
}

export default function MatchingOnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MatchingOnboardingData>({
    name: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    goal_categories: [],
    preferred_day: "Wednesday",
  });
  const router = useRouter();

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
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
        goal_categories: data.goal_categories,
        product_type: "matching",
        onboarded_at: new Date().toISOString(),
        // Not needed for matching but schema requires them
        standup_time: null,
        preference: null,
        accountability_style: null,
        pain_points: [],
      });

      // Auto-enter matching queue
      await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal_category: data.goal_categories[0] || "Other",
        }),
      });
    }

    router.push("/match-dashboard");
  }

  const canProceed = (() => {
    switch (step) {
      case 1:
        return data.name.trim().length > 0;
      case 2:
        return data.goal_categories.length > 0;
      default:
        return true;
    }
  })();

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
      {step > 0 && step <= TOTAL_STEPS && (
        <div className="px-6 pt-6">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                const progressNum = i + 1;
                const isDone = step > progressNum;
                const isActive = step === progressNum;
                return (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isDone
                        ? "w-8 bg-[#0071E3]"
                        : isActive
                          ? "w-8 bg-[#0071E3] shadow-[0_0_8px_rgba(0,113,227,0.4)]"
                          : "w-2 bg-[#E5E5E5]"
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-center text-[13px] text-[#9CA3AF]">
              Step <span className="text-[#0071E3] font-medium">{step}</span> of {TOTAL_STEPS}
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          {/* Welcome */}
          {step === 0 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(0,113,227,0.08)] border border-[rgba(0,113,227,0.15)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_24px_rgba(0,113,227,0.08)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0071E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h1 className="text-[32px] font-bold text-[#1D1D1F] tracking-[-0.02em] mb-3">
                Welcome to Anchor Matching
              </h1>
              <p className="text-[#86868B] text-base mb-10 max-w-sm mx-auto leading-relaxed">
                Three quick questions and you&apos;ll be matched with a founder for a weekly call.
              </p>
              <Button size="lg" onClick={next} className="bg-[#0071E3] hover:bg-[#0077ED]">
                Let&apos;s go
              </Button>
            </div>
          )}

          {/* Step 1: Name + Timezone */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">
                What should we call you?
              </h2>
              <p className="text-[#86868B] text-sm mb-8">
                Your match will see your name.
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Your first name"
                  autoFocus
                  className={INPUT_CLASSES}
                  onKeyDown={(e) => e.key === "Enter" && canProceed && next()}
                />
                <div>
                  <label className="block text-sm text-[#86868B] mb-2">Timezone</label>
                  <select
                    value={data.timezone}
                    onChange={(e) => setData({ ...data, timezone: e.target.value })}
                    className={INPUT_CLASSES}
                  >
                    {Intl.supportedValuesOf("timeZone").map((tz) => (
                      <option key={tz} value={tz}>
                        {tz.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">
                What are you building?
              </h2>
              <p className="text-[#86868B] text-sm mb-8">
                We&apos;ll match you with founders building similar things.
              </p>
              <div className="flex flex-wrap gap-2">
                {GOAL_OPTIONS.map((goal) => {
                  const selected = data.goal_categories.includes(goal);
                  return (
                    <button
                      key={goal}
                      onClick={() =>
                        setData({
                          ...data,
                          goal_categories: selected
                            ? data.goal_categories.filter((g) => g !== goal)
                            : [...data.goal_categories, goal],
                        })
                      }
                      className={`px-4 py-2.5 rounded-[10px] text-sm font-medium transition-all ${
                        selected
                          ? "bg-[#0071E3] text-white shadow-[0_2px_8px_rgba(0,113,227,0.3)]"
                          : "bg-[#F0F0F0] text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E5E5E5]"
                      }`}
                    >
                      {goal}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Preferred call day + done */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">
                Preferred call day?
              </h2>
              <p className="text-[#86868B] text-sm mb-8">
                Pick the day that works best for a 15-30 min call. You and your match will coordinate the exact time.
              </p>
              <div className="flex flex-wrap gap-2 mb-10">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                  <button
                    key={day}
                    onClick={() => setData({ ...data, preferred_day: day })}
                    className={`px-5 py-3 rounded-[10px] text-sm font-medium transition-all ${
                      data.preferred_day === day
                        ? "bg-[#0071E3] text-white shadow-[0_2px_8px_rgba(0,113,227,0.3)]"
                        : "bg-[#F0F0F0] text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E5E5E5]"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <Button
                size="lg"
                onClick={handleComplete}
                disabled={loading}
                className="w-full bg-[#0071E3] hover:bg-[#0077ED]"
              >
                {loading ? "Setting up..." : "Find my match"}
              </Button>
            </div>
          )}

          {/* Navigation */}
          {step > 0 && step < 3 && (
            <div className="flex items-center justify-between mt-10">
              <button
                onClick={back}
                className="text-sm text-[#86868B] hover:text-[#1D1D1F] transition-colors"
              >
                Back
              </button>
              <Button onClick={next} disabled={!canProceed} className="bg-[#0071E3] hover:bg-[#0077ED]">
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
