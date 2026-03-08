"use client";

import { useState } from "react";

interface ActivityHeatmapProps {
  data: Record<string, number>;
}

type TimeRange = "3m" | "6m" | "1y";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const RANGE_WEEKS: Record<TimeRange, number> = {
  "3m": 12,
  "6m": 26,
  "1y": 52,
};

function getColor(value: number): string {
  if (value === 0) return "bg-[#E5E5E5]";
  if (value === 1) return "bg-accent/20";
  if (value === 2) return "bg-accent/40";
  if (value === 3) return "bg-accent/70";
  return "bg-accent";
}

function getTooltip(value: number, dateStr: string): string {
  if (value === 0) return `${dateStr}: No standup`;
  if (value === 1) return `${dateStr}: Daily standup`;
  if (value === 2) return `${dateStr}: Daily + Weekly`;
  return `${dateStr}: ${value} sessions`;
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const [range, setRange] = useState<TimeRange>("3m");
  const numWeeks = RANGE_WEEKS[range];
  const today = new Date();
  const weeks: { date: Date; dateStr: string; value: number }[][] = [];

  for (let w = numWeeks - 1; w >= 0; w--) {
    const week: { date: Date; dateStr: string; value: number }[] = [];
    const refMonday = new Date(today);
    refMonday.setDate(today.getDate() - today.getDay() + 1 - w * 7);

    for (let d = 0; d < 7; d++) {
      const date = new Date(refMonday);
      date.setDate(refMonday.getDate() + d);
      const dateStr = date.toISOString().split("T")[0];
      const isFuture = date > today;
      week.push({
        date,
        dateStr,
        value: isFuture ? -1 : (data[dateStr] || 0),
      });
    }
    weeks.push(week);
  }

  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const month = week[0].date.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({
        label: week[0].date.toLocaleDateString("en-US", { month: "short" }),
        col: i,
      });
      lastMonth = month;
    }
  });

  return (
    <div>
      {/* Range toggle */}
      <div className="flex items-center justify-end gap-1 mb-4">
        {(["3m", "6m", "1y"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-2.5 py-1 rounded-md text-[13px] font-medium transition-colors ${
              range === r
                ? "bg-accent text-white"
                : "text-[#9CA3AF] hover:text-[#1D1D1F] hover:bg-[#F0F0F0]"
            }`}
          >
            {r === "3m" ? "3 months" : r === "6m" ? "6 months" : "1 year"}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        {/* Month labels */}
        <div className="flex ml-8 mb-1 gap-0">
          {monthLabels.map((m, i) => {
            const nextCol = monthLabels[i + 1]?.col ?? numWeeks;
            const span = nextCol - m.col;
            return (
              <div
                key={`${m.label}-${m.col}`}
                className="text-[13px] text-[#9CA3AF]"
                style={{ width: `${span * 16}px` }}
              >
                {m.label}
              </div>
            );
          })}
        </div>

        <div className="flex gap-0">
          {/* Day labels */}
          <div className="flex flex-col gap-[2px] mr-1.5 pt-0">
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="h-[14px] text-[12px] text-[#9CA3AF] flex items-center justify-end pr-0.5"
                style={{ width: "24px" }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[2px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[2px]">
                {week.map((day) => (
                  <div
                    key={day.dateStr}
                    className={`w-[14px] h-[14px] rounded-[3px] transition-transform duration-150 hover:scale-[1.4] hover:z-10 relative cursor-default ${
                      day.value === -1
                        ? "bg-transparent"
                        : getColor(day.value)
                    } ${day.value >= 3 ? "shadow-[0_0_6px_rgba(181,115,8,0.3)]" : ""}`}
                    title={day.value === -1 ? "" : getTooltip(day.value, day.dateStr)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3 text-[13px] text-[#9CA3AF]">
          <span>Less</span>
          <div className="w-[14px] h-[14px] rounded-[3px] bg-[#E5E5E5]" />
          <div className="w-[14px] h-[14px] rounded-[3px] bg-accent/20" />
          <div className="w-[14px] h-[14px] rounded-[3px] bg-accent/40" />
          <div className="w-[14px] h-[14px] rounded-[3px] bg-accent/70" />
          <div className="w-[14px] h-[14px] rounded-[3px] bg-accent" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
