"use client";

interface WeeklyProgressProps {
  completedDays: string[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function WeeklyProgress({ completedDays }: WeeklyProgressProps) {
  const today = new Date();
  const todayDay = today.getDay();

  return (
    <div className="flex items-center gap-3">
      {DAYS.map((day, i) => {
        const dayIndex = i + 1;
        const isCompleted = completedDays.some((d) => {
          const date = new Date(d);
          return date.getDay() === dayIndex;
        });
        const isToday = todayDay === dayIndex;

        return (
          <div key={day} className="flex flex-col items-center gap-1.5">
            <span className={`text-[11px] font-medium ${isToday ? "text-[#2C2825]" : "text-[#a89a8e]"}`}>
              {day}
            </span>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isCompleted
                  ? "bg-[#C4654A] text-[#2C2825]"
                  : isToday
                  ? "border-2 border-[#C4654A] text-[#C4654A]"
                  : "bg-[#E8DDD3] text-[#a89a8e]"
              }`}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
