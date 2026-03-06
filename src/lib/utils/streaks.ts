import type { Streak } from "@/lib/types/database";

export function calculateStreakUpdate(
  streak: Streak,
  todayDate: string
): Pick<Streak, "current_streak" | "longest_streak" | "last_standup_date"> {
  const today = new Date(todayDate);
  const lastDate = streak.last_standup_date
    ? new Date(streak.last_standup_date)
    : null;

  if (lastDate && isSameDay(today, lastDate)) {
    return {
      current_streak: streak.current_streak,
      longest_streak: streak.longest_streak,
      last_standup_date: streak.last_standup_date,
    };
  }

  const isConsecutive = lastDate && isDayBefore(lastDate, today);
  const newCurrent = isConsecutive ? streak.current_streak + 1 : 1;
  const newLongest = Math.max(streak.longest_streak, newCurrent);

  return {
    current_streak: newCurrent,
    longest_streak: newLongest,
    last_standup_date: todayDate,
  };
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDayBefore(earlier: Date, later: Date): boolean {
  const diff = new Date(
    later.getFullYear(),
    later.getMonth(),
    later.getDate()
  ).getTime() -
    new Date(
      earlier.getFullYear(),
      earlier.getMonth(),
      earlier.getDate()
    ).getTime();
  return diff === 86400000;
}
