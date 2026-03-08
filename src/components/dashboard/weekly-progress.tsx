"use client";

interface WeeklyProgressProps {
  completedDays: string[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function WeeklyProgress({ completedDays }: WeeklyProgressProps) {
  const today = new Date();
  const todayDay = today.getDay();

  return (
    <div className="flex items-center justify-between">
      {DAYS.map((day, i) => {
        const dayIndex = i + 1;
        const isCompleted = completedDays.some((d) => {
          const date = new Date(d);
          return date.getDay() === dayIndex;
        });
        const isToday = todayDay === dayIndex;
        const isPast = dayIndex < todayDay && !isCompleted;

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
            {isToday && (
              <div className="w-1 h-1 rounded-full bg-[#0071E3]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
