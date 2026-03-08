import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeDate, formatDuration } from "@/lib/utils/formatting";
import type { Standup } from "@/lib/types/database";

export function RecentStandupsList({ standups }: { standups: Standup[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Standups</CardTitle>
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
          <div className="space-y-4">
            {standups.map((standup) => (
              <div
                key={standup.id}
                className={`flex items-start justify-between border-l-2 pl-4 pb-4 last:pb-0 ${
                  standup.type === "weekly" ? "border-l-[#FBBF24]" : "border-l-[#FF9500]"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={standup.type === "daily" ? "info" : "warning"}>
                      {standup.type}
                    </Badge>
                    <span className="text-sm text-[#86868B]">{formatRelativeDate(standup.date)}</span>
                  </div>
                  {standup.done_summary && (
                    <p className="mt-1.5 text-sm text-[#4B5563] line-clamp-2">{standup.done_summary}</p>
                  )}
                </div>
                {standup.duration_seconds && (
                  <span className="text-xs text-[#9CA3AF] ml-4 shrink-0">{formatDuration(standup.duration_seconds)}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
