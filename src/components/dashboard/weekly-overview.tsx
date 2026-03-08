"use client";

import { useEffect, useState } from "react";

interface WeeklyOverviewProps {
  completedDays: string[];
}

interface ScoreEntry {
  date: string;
  productivity_score: number;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  return {
    from: monday.toISOString().split("T")[0],
    to: friday.toISOString().split("T")[0],
    monday,
  };
}

export function WeeklyOverview({ completedDays }: WeeklyOverviewProps) {
  const today = new Date();
  const todayDay = today.getDay();
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { from, to } = getWeekRange();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/standup/scores?from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setScores(data);
        else setScores([]);
      })
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, [from, to]);

  const scoreMap = new Map<number, number>();
  for (const entry of scores) {
    const date = new Date(entry.date + "T00:00:00");
    scoreMap.set(date.getDay(), entry.productivity_score);
  }

  const scoredDays = scores.filter((s) => s.productivity_score);
  const avgScore = scoredDays.length > 0
    ? scoredDays.reduce((sum, s) => sum + s.productivity_score, 0) / scoredDays.length
    : null;
  const avgPercent = avgScore ? Math.round((avgScore / 4) * 100) : null;

  const completedCount = DAYS.filter((_, i) => {
    const dayIndex = i + 1;
    return completedDays.some((d) => new Date(d).getDay() === dayIndex);
  }).length;

  return (
    <div>
      {/* Segment blocks */}
      <div className="flex gap-2 mb-4">
        {DAYS.map((day, i) => {
          const dayIndex = i + 1;
          const isCompleted = completedDays.some((d) => new Date(d).getDay() === dayIndex);
          const isToday = todayDay === dayIndex;
          const isPast = dayIndex < todayDay && !isCompleted;
          const isFuture = dayIndex > todayDay;

          return (
            <div
              key={day}
              className={`flex-1 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${
                isCompleted
                  ? "bg-[#FF9500] text-white"
                  : isToday
                  ? "bg-white border-2 border-[#FF9500] text-[#FF9500]"
                  : isPast
                  ? "bg-[#F0F0F0] text-[#CACACA]"
                  : "bg-[#F5F5F7] text-[#CACACA]"
              }`}
            >
              <span className={`text-[10px] font-semibold ${isCompleted ? "text-white/70" : ""}`}>
                {day.charAt(0)}
              </span>
              {isCompleted ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : isPast ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#86868B]">
          <span className="font-bold text-[#1D1D1F]">{completedCount}</span> of 5 completed
        </p>
        {loading ? (
          <div className="w-10 h-5 rounded bg-[#F0F0F0] animate-pulse" />
        ) : avgPercent !== null ? (
          <span className="text-xl font-extrabold text-[#FF9500] tracking-tight">{avgPercent}%</span>
        ) : (
          <span className="text-lg font-semibold text-[#D0D0D0]">--</span>
        )}
      </div>
    </div>
  );
}
