import type { Streak } from "@/lib/types/database";

function getInsight(
  currentStreak: number,
  longestStreak: number,
  thisWeekCount: number,
  hasStandups: boolean
): { icon: React.ReactNode; title: string; message: string } | null {
  if (currentStreak >= longestStreak && currentStreak > 0) {
    return {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0071E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      title: "New personal record!",
      message: `${currentStreak} day streak, your longest ever. Keep the momentum going.`,
    };
  } else if (thisWeekCount >= 4) {
    return {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0071E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      title: "Crushing it this week",
      message: `${thisWeekCount}/5 standups done. One more to go!`,
    };
  } else if (hasStandups) {
    return {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0071E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      title: "You're building a habit",
      message: currentStreak > 0
        ? `${currentStreak} day streak and counting. Show up again tomorrow.`
        : "You've been showing up. Start a new streak today.",
    };
  }
  return null;
}

export function InsightCard({
  streak,
  thisWeekCount,
  hasStandups,
}: {
  streak: Streak | null;
  thisWeekCount: number;
  hasStandups: boolean;
}) {
  const currentStreak = streak?.current_streak ?? 0;
  const longestStreak = streak?.longest_streak ?? 0;
  const insight = getInsight(currentStreak, longestStreak, thisWeekCount, hasStandups);

  if (!insight) return null;

  return (
    <div className="bg-gradient-to-br from-[rgba(0,113,227,0.06)] to-[rgba(0,113,227,0.02)] border border-[rgba(0,113,227,0.15)] rounded-xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-[rgba(0,113,227,0.1)] flex items-center justify-center shrink-0">
        {insight.icon}
      </div>
      <div>
        <h3 className="text-[14px] font-semibold text-[#1D1D1F] mb-1">{insight.title}</h3>
        <p className="text-[13px] text-[#86868B] leading-relaxed">{insight.message}</p>
      </div>
    </div>
  );
}
