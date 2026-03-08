import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatRelativeDate, formatDuration } from "@/lib/utils/formatting";
import type { Standup } from "@/lib/types/database";

function groupByDate(standups: Standup[]): { label: string; items: Standup[] }[] {
  const groups: { label: string; items: Standup[] }[] = [];
  for (const s of standups) {
    const label = formatRelativeDate(s.date);
    const existing = groups.find((g) => g.label === label);
    if (existing) {
      existing.items.push(s);
    } else {
      groups.push({ label, items: [s] });
    }
  }
  return groups;
}

export function RecentStandupsList({ standups }: { standups: Standup[] }) {
  const thisWeekCount = standups.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Standups</CardTitle>
          {thisWeekCount > 0 && (
            <span className="text-[11px] text-[#86868B] bg-[#F5F5F7] px-2 py-0.5 rounded-md font-medium">
              {thisWeekCount} this week
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {standups.length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-16 h-16 bg-[rgba(255,149,0,0.08)] border border-[rgba(255,149,0,0.15)] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(255,149,0,0.08)]">
              <svg className="w-7 h-7 text-[#FF9500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" strokeWidth={2} />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-[#1D1D1F] mb-1">No standups yet</p>
            <p className="text-sm text-[#86868B] mb-5">Start your first voice standup to begin tracking your daily progress.</p>
            <a href="/standup" className="inline-flex items-center gap-2 bg-[#FF9500] hover:bg-[#FFa526] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_2px_12px_rgba(255,149,0,0.3)]">
              Start your first standup
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            {groupByDate(standups).map((group) => (
              <div key={group.label}>
                {/* Date header */}
                <p className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[0.5px] mb-2 pl-0.5">
                  {group.label}
                </p>

                {/* Entries */}
                <div className="space-y-0.5">
                  {group.items.map((standup) => {
                    const isDaily = standup.type === "daily";
                    const score = standup.productivity_score;
                    const scorePercent = score ?? 0;

                    return (
                      <div
                        key={standup.id}
                        className="flex items-start gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-[#FAFAFA] transition-colors"
                      >
                        {/* Status circle */}
                        <div
                          className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isDaily ? "bg-[#FF9500]" : "bg-[#FBBF24]"
                          }`}
                        >
                          <svg className="w-2.5 h-2.5" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {standup.done_summary ? (
                            <p className="text-[13px] text-[#1D1D1F] font-medium leading-snug line-clamp-2">
                              {standup.done_summary}
                            </p>
                          ) : (
                            <p className="text-[13px] text-[#86868B] italic">No summary</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-[#CACACA] capitalize">{standup.type}</span>
                            {standup.duration_seconds && (
                              <>
                                <span className="w-[2px] h-[2px] rounded-full bg-[#E5E5E5]" />
                                <span className="text-[10px] text-[#CACACA]">
                                  {formatDuration(standup.duration_seconds)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Score bar */}
                        {score ? (
                          <div className="w-12 h-1 bg-[#F0F0F0] rounded-full overflow-hidden shrink-0 mt-2">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#FF9500] to-[#FFB340]"
                              style={{ width: `${scorePercent}%` }}
                            />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
