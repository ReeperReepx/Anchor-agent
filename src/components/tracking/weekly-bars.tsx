"use client";

interface WeekData {
  weekLabel: string;
  completed: number;
  total: number;
}

export function WeeklyBars({ weeks }: { weeks: WeekData[] }) {
  const maxTotal = Math.max(...weeks.map((w) => w.total), 1);

  return (
    <div className="space-y-2.5">
      {weeks.map((week) => {
        const pct = Math.round((week.completed / Math.max(week.total, 1)) * 100);
        const barWidth = (week.total / maxTotal) * 100;
        const isComplete = pct === 100;

        return (
          <div key={week.weekLabel} className="flex items-center gap-3">
            <span className="text-xs text-[#a89a8e] w-16 shrink-0 text-right">
              {week.weekLabel}
            </span>
            <div
              className="h-6 bg-[#F5F0E8] rounded-[5px] overflow-hidden relative"
              style={{ width: `${barWidth}%`, minWidth: "40px" }}
            >
              <div
                className={`h-full rounded-[5px] transition-all ${
                  isComplete
                    ? "shadow-[0_0_8px_rgba(45,138,86,0.3)]"
                    : ""
                }`}
                style={{
                  width: `${pct}%`,
                  background: isComplete
                    ? "linear-gradient(90deg, rgba(45,138,86,0.6), #2D8A56)"
                    : pct >= 60
                      ? "linear-gradient(90deg, rgba(196,101,74,0.4), #C4654A)"
                      : pct > 0
                        ? "linear-gradient(90deg, rgba(196,101,74,0.2), rgba(196,101,74,0.5))"
                        : "transparent",
                }}
              />
            </div>
            <span className={`text-xs w-12 shrink-0 font-medium ${
              isComplete ? "text-[#2D8A56]" : "text-[#a89a8e]"
            }`}>
              {week.completed}/{week.total}
            </span>
          </div>
        );
      })}
    </div>
  );
}
