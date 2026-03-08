"use client";

import { useEffect, useState } from "react";

interface ScoreEntry {
  date: string;
  productivity_score: number;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function getMonthRange(year: number, month: number) {
  const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const to = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { from, to, lastDay };
}

function scoreColor(score: number | null): string {
  if (!score) return "bg-[#E5E5E5]";
  if (score === 1) return "bg-[#B85C42]/30";
  if (score === 2) return "bg-[#B85C42]/55";
  if (score === 3) return "bg-[#B85C42]/80";
  return "bg-[#B85C42]";
}

export function ProductivityHeatmap() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { from, to } = getMonthRange(year, month);
    setLoading(true);
    fetch(`/api/standup/scores?from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setScores(data);
        else setScores([]);
      })
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, [year, month]);

  const { lastDay } = getMonthRange(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  // Convert Sunday=0 to Monday-based (Mon=0, Sun=6)
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Build score lookup by day number
  const scoreMap = new Map<number, number>();
  for (const entry of scores) {
    const day = parseInt(entry.date.split("-")[2], 10);
    scoreMap.set(day, entry.productivity_score);
  }

  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const todayDate = today.getDate();

  // Build grid cells: offset blanks + days
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= lastDay; d++) cells.push(d);

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
  };

  const canGoNext = !(year === today.getFullYear() && month === today.getMonth());

  // Calculate average score for the month
  const scoredDays = scores.filter((s) => s.productivity_score);
  const avgScore = scoredDays.length > 0
    ? (scoredDays.reduce((sum, s) => sum + s.productivity_score, 0) / scoredDays.length).toFixed(1)
    : null;

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-7 h-7 rounded-lg hover:bg-[#F0F0F0] flex items-center justify-center transition-colors"
          aria-label="Previous month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-[13px] font-semibold text-[#1D1D1F]">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="w-7 h-7 rounded-lg hover:bg-[#F0F0F0] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-[5px] mb-1">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="text-[10px] text-[#9CA3AF] text-center font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-[5px]">
        {loading
          ? Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-[5px] bg-[#F0F0F0] animate-pulse" />
            ))
          : cells.map((day, i) => {
              if (day === null) {
                return <div key={i} />;
              }
              const score = scoreMap.get(day) ?? null;
              const isToday = isCurrentMonth && day === todayDate;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-[5px] ${scoreColor(score)} ${
                    isToday ? "ring-2 ring-[#B85C42]/40" : ""
                  } transition-colors`}
                  title={score ? `${MONTHS[month]} ${day}: Score ${score}/4` : `${MONTHS[month]} ${day}: No standup`}
                />
              );
            })}
      </div>

      {/* Legend + stats */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-[#9CA3AF]">Less</span>
          <div className="w-3 h-3 rounded-[3px] bg-[#B85C42]/30" />
          <div className="w-3 h-3 rounded-[3px] bg-[#B85C42]/55" />
          <div className="w-3 h-3 rounded-[3px] bg-[#B85C42]/80" />
          <div className="w-3 h-3 rounded-[3px] bg-[#B85C42]" />
          <span className="text-[9px] text-[#9CA3AF]">More</span>
        </div>
        {avgScore && (
          <span className="text-[11px] text-[#6B7280]">
            Avg: <span className="font-semibold text-[#1D1D1F]">{avgScore}</span>/4
          </span>
        )}
      </div>
    </div>
  );
}
