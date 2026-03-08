"use client";

interface WeekData {
  weekLabel: string;
  completed: number;
  total: number;
}

export function WeeklyBars({ weeks }: { weeks: WeekData[] }) {
  return (
    <div className="flex items-end justify-between gap-1.5 h-[200px] min-w-0">
      {weeks.map((week) => {
        const pct = Math.min(
          Math.round((week.completed / Math.max(week.total, 1)) * 100),
          100
        );
        const isComplete = pct === 100;

        return (
          <div
            key={week.weekLabel}
            className="flex-1 min-w-0 flex flex-col items-center h-full justify-end gap-1.5"
          >
            <span className="text-[11px] font-semibold text-[#1D1D1F]">
              {week.completed}/{week.total}
            </span>
            <div className="w-full max-w-[48px] h-full bg-[#F0F0F0] rounded-t-lg overflow-hidden relative flex flex-col justify-end">
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${
                  isComplete ? "shadow-[0_0_8px_rgba(52,199,89,0.3)]" : ""
                }`}
                style={{
                  height: `${pct}%`,
                  background: isComplete
                    ? "linear-gradient(180deg, #34C759, rgba(52,199,89,0.5))"
                    : pct >= 60
                      ? "linear-gradient(180deg, var(--accent), rgba(212,137,10,0.4))"
                      : pct > 0
                        ? "linear-gradient(180deg, rgba(212,137,10,0.5), rgba(212,137,10,0.2))"
                        : "transparent",
                }}
              />
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#9CA3AF] font-medium truncate w-full text-center">
              {week.weekLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}
