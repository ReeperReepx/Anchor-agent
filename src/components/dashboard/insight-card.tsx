import type { Streak } from "@/lib/types/database";

function getInsight(
  currentStreak: number,
  longestStreak: number,
  thisWeekCount: number,
  hasStandups: boolean
): { emoji: string; title: string; message: string } | null {
  if (currentStreak >= longestStreak && currentStreak > 0) {
    return {
      emoji: "\uD83D\uDD25",
      title: "New personal record!",
      message: `${currentStreak} day streak, your longest ever. Keep the momentum going.`,
    };
  } else if (thisWeekCount >= 4) {
    return {
      emoji: "\uD83D\uDD25",
      title: "Crushing it this week",
      message: `${thisWeekCount}/5 standups done. One more to go!`,
    };
  } else if (hasStandups) {
    return {
      emoji: "\uD83D\uDD25",
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
    <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center shrink-0 text-xl">
        {insight.emoji}
      </div>
      <div>
        <h3 className="text-[14px] font-semibold text-[#1D1D1F] mb-1">{insight.title}</h3>
        <p className="text-[13px] text-[#86868B] leading-relaxed">{insight.message}</p>
      </div>
    </div>
  );
}
