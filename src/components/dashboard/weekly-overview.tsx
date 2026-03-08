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

function scoreColor(score: number | null): string {
  if (!score) return "bg-[#E5E5E5]";
  if (score === 1) return "bg-[#0071E3]/30";
  if (score === 2) return "bg-[#0071E3]/55";
  if (score === 3) return "bg-[#0071E3]/80";
  return "bg-[#0071E3]";
}

function scoreLabel(score: number | null): string {
  if (!score) return "";
  if (score === 1) return "Low";
  if (score === 2) return "Fair";
  if (score === 3) return "Good";
  return "Great";
}

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
  const { from, to, monday } = getWeekRange();

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

  // Build score lookup by weekday index (1=Mon, 5=Fri)
  const scoreMap = new Map<number, number>();
  for (const entry of scores) {
    const date = new Date(entry.date + "T00:00:00");
    const dayOfWeek = date.getDay();
    scoreMap.set(dayOfWeek, entry.productivity_score);
  }

  // Calculate weekly average
  const scoredDays = scores.filter((s) => s.productivity_score);
  const avgScore = scoredDays.length > 0
    ? scoredDays.reduce((sum, s) => sum + s.productivity_score, 0) / scoredDays.length
    : null;
  const avgPercent = avgScore ? Math.round((avgScore / 4) * 100) : null;

  return (
    <div className="flex items-center gap-6">
      {/* Day circles with productivity */}
      <div className="flex items-center justify-between flex-1">
        {DAYS.map((day, i) => {
          const dayIndex = i + 1;
          const isCompleted = completedDays.some((d) => {
            const date = new Date(d);
            return date.getDay() === dayIndex;
          });
          const isToday = todayDay === dayIndex;
          const isPast = dayIndex < todayDay && !isCompleted;
          const score = scoreMap.get(dayIndex) ?? null;

          return (
            <div key={day} className="flex flex-col items-center gap-2">
              <span className={`text-[11px] font-medium ${isToday ? "text-[#1D1D1F]" : "text-[#9CA3AF]"}`}>
                {day}
              </span>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? "bg-gradient-to-b from-[#34C759] to-[#30D158] text-white shadow-[0_2px_8px_rgba(52,199,89,0.3)]"
                    : isToday
                    ? "border-2 border-[#0071E3] text-[#0071E3] shadow-[0_0_0_4px_rgba(0,113,227,0.08)]"
                    : isPast
                    ? "bg-[#F0F0F0] text-[#D0D0D0]"
                    : "bg-[#F0F0F0] text-[#9CA3AF]"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isPast ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : null}
              </div>
              {/* Productivity score dot */}
              {isCompleted && score ? (
                <div className={`w-2 h-2 rounded-full ${scoreColor(score)}`} title={`Productivity: ${scoreLabel(score)}`} />
              ) : isToday ? (
                <div className="w-1 h-1 rounded-full bg-[#0071E3]" />
              ) : (
                <div className="w-2 h-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-px h-14 bg-[#E5E5E5]" />

      {/* Weekly productivity average */}
      <div className="flex flex-col items-center gap-1 min-w-[72px]">
        {loading ? (
          <div className="w-10 h-6 rounded bg-[#F0F0F0] animate-pulse" />
        ) : avgPercent !== null ? (
          <>
            <span className="text-2xl font-bold text-[#0071E3] tracking-tight">{avgPercent}%</span>
            <span className="text-[10px] text-[#9CA3AF] font-medium">Productivity</span>
          </>
        ) : (
          <>
            <span className="text-lg font-semibold text-[#D0D0D0]">--</span>
            <span className="text-[10px] text-[#9CA3AF] font-medium">Productivity</span>
          </>
        )}
      </div>
    </div>
  );
}
