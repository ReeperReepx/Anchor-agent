"use client";

import { useEffect, useState } from "react";

interface WeeklyOverviewProps {
  completedDays: string[];
}

interface ScoreEntry {
  date: string;
  productivity_score: number;
}

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getLast5Days() {
  const days: { date: string; label: string; dateStr: string }[] = [];
  const now = new Date();
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const dateStr = d.toISOString().split("T")[0];
    const label = i === 0 ? "Today" : SHORT_DAYS[d.getDay()];
    days.push({ date: dateStr, label, dateStr });
  }
  return days;
}

export function WeeklyOverview({ completedDays }: WeeklyOverviewProps) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const last5 = getLast5Days();
  const from = last5[0].dateStr;
  const to = last5[4].dateStr;

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

  // Map date string -> score
  const scoreMap = new Map<string, number>();
  for (const entry of scores) {
    scoreMap.set(entry.date, entry.productivity_score);
  }

  // Build per-day data
  const dayData = last5.map((day, i) => {
    const isCompleted = completedDays.includes(day.dateStr);
    const isToday = i === 4;
    const score = scoreMap.get(day.dateStr) ?? null;
    const pct = score !== null ? score : null;
    return { ...day, isCompleted, isToday, score, pct, idx: i };
  });

  const completedCount = dayData.filter((d) => d.isCompleted).length;
  const scoredDays = dayData.filter((d) => d.pct !== null);
  const avgPercent = scoredDays.length > 0
    ? Math.round(scoredDays.reduce((sum, d) => sum + d.pct!, 0) / scoredDays.length)
    : null;

  // SVG sparkline dimensions
  const W = 400;
  const H = 64;
  const PAD_X = 32;
  const PAD_TOP = 10;
  const PAD_BOT = 4;
  const usableW = W - PAD_X * 2;
  const usableH = H - PAD_TOP - PAD_BOT;

  // Build sparkline points — only for days with scores
  const points: { x: number; y: number; pct: number; isToday: boolean }[] = [];
  for (const d of dayData) {
    const x = PAD_X + (d.idx / 4) * usableW;
    if (d.pct !== null) {
      const y = PAD_TOP + usableH - (d.pct / 100) * usableH;
      points.push({ x, y, pct: d.pct, isToday: d.isToday });
    }
  }

  // Polyline path
  const linePath = points.map((p) => `${p.x},${p.y}`).join(" ");
  // Area fill path
  const areaPath = points.length >= 2
    ? `M ${points[0].x} ${points[0].y} ${points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`
    : "";

  if (loading) {
    return (
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <div className="h-8 w-16 rounded-lg bg-[#F0F0F0] animate-pulse" />
          <div className="h-5 w-24 rounded bg-[#F0F0F0] animate-pulse" />
        </div>
        <div className="h-16 rounded-xl bg-[#F5F5F7] animate-pulse mb-3" />
        <div className="flex justify-between">
          {last5.map((d) => <div key={d.dateStr} className="h-3 w-6 rounded bg-[#F0F0F0] animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header: big score + completion count */}
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[28px] font-extrabold text-[#FF9500] leading-none tracking-tight">
            {avgPercent !== null ? `${avgPercent}%` : "--"}
          </span>
          <span className="text-[12px] text-[#86868B] font-medium">productivity</span>
        </div>
        <span className="text-[12px] text-[#86868B]">
          Last 5 days &middot; <span className="font-bold text-[#1D1D1F]">{completedCount}</span> completed
        </span>
      </div>

      {/* Sparkline chart */}
      <div className="relative mb-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16" preserveAspectRatio="none">
          {/* Subtle grid lines */}
          <line x1={PAD_X} y1={PAD_TOP} x2={W - PAD_X} y2={PAD_TOP} stroke="#F5F5F7" strokeWidth="1" />
          <line x1={PAD_X} y1={PAD_TOP + usableH / 2} x2={W - PAD_X} y2={PAD_TOP + usableH / 2} stroke="#F5F5F7" strokeWidth="1" />
          <line x1={PAD_X} y1={PAD_TOP + usableH} x2={W - PAD_X} y2={PAD_TOP + usableH} stroke="#F5F5F7" strokeWidth="1" />

          {/* Area fill */}
          {areaPath && (
            <path d={areaPath} fill="url(#sparkGradient)" />
          )}

          {/* Line */}
          {points.length >= 2 && (
            <polyline
              points={linePath}
              fill="none"
              stroke="#FF9500"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Gradient def */}
          <defs>
            <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9500" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FF9500" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Dots for scored days */}
          {points.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={p.isToday ? "5" : "4"}
              fill="white"
              stroke="#FF9500"
              strokeWidth={p.isToday ? "2.5" : "2"}
            />
          ))}

          {/* Vertical tick marks for all 5 days */}
          {dayData.map((d) => {
            const x = PAD_X + (d.idx / 4) * usableW;
            return (
              <line
                key={d.dateStr}
                x1={x} y1={H - 1} x2={x} y2={H - 4}
                stroke={d.isCompleted ? "#FF9500" : d.isToday ? "#FF9500" : "#E5E5E5"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>

      {/* Day labels + per-day scores */}
      <div className="flex justify-between px-1">
        {dayData.map((d) => (
          <div key={d.dateStr} className="flex flex-col items-center gap-0.5">
            <span className={`text-[10px] font-semibold ${
              d.isToday ? "text-[#FF9500]" : d.isCompleted ? "text-[#1D1D1F]" : "text-[#CACACA]"
            }`}>
              {d.label}
            </span>
            <span className={`text-[10px] font-medium ${
              d.pct !== null && d.pct >= 80 ? "text-[#34C759]" :
              d.pct !== null ? "text-[#FF9500]" :
              d.isToday ? "text-[#FF9500]" :
              "text-[#E0E0E0]"
            }`}>
              {d.isToday && d.pct === null ? "now" : d.pct !== null ? `${d.pct}%` : "--"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
