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
    <Card className="p-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Standups</CardTitle>
          {thisWeekCount > 0 && (
            <span className="text-[13px] text-[#86868B] bg-[#F5F5F7] px-2.5 py-1 rounded-md font-medium">
              {thisWeekCount} this week
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {standups.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-accent-subtle border border-accent/15 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_24px_rgba(181,115,8,0.08)]">
              <svg className="w-9 h-9 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" strokeWidth={2} />
              </svg>
            </div>
            <p className="text-[18px] font-semibold text-[#1D1D1F] mb-1.5">No standups yet</p>
            <p className="text-[15px] text-[#86868B] mb-6">Start your first voice standup to begin tracking your daily progress.</p>
            <a href="/standup" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl text-[15px] font-semibold transition-all shadow-[0_2px_12px_rgba(181,115,8,0.3)]">
              Start your first standup
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            {groupByDate(standups).map((group) => (
              <div key={group.label}>
                {/* Date header */}
                <p className="text-[13px] font-bold text-[#86868B] uppercase tracking-[0.5px] mb-2.5">
                  {group.label}
                </p>

                {/* Entries */}
                <div className="divide-y divide-[#F0F0F0]">
                  {group.items.map((standup) => {
                    const isDaily = standup.type === "daily";
                    const score = standup.productivity_score;
                    const scorePercent = score ?? 0;

                    return (
                      <div
                        key={standup.id}
                        className="flex items-center gap-3.5 py-3"
                      >
                        {/* Status dot */}
                        <div
                          className={`w-3 h-3 rounded-full shrink-0 ${
                            isDaily ? "bg-accent" : "bg-[#FBBF24]"
                          }`}
                        />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {standup.done_summary ? (
                            <p className="text-[15px] text-[#1D1D1F] leading-snug line-clamp-2">
                              {standup.done_summary}
                            </p>
                          ) : (
                            <p className="text-[15px] text-[#86868B] italic">No summary</p>
                          )}
                        </div>

                        {/* Type badge */}
                        <span className="text-[12px] font-semibold text-accent bg-accent-subtle px-2.5 py-1 rounded shrink-0 capitalize">
                          {standup.type}
                        </span>

                        {/* Score bar */}
                        {score ? (
                          <div className="w-[75px] h-[7px] bg-[#F0F0F0] rounded-[3px] overflow-hidden shrink-0">
                            <div
                              className="h-full rounded-[3px] bg-accent"
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
