import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
          <div className="relative pl-6">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-1 bottom-1 w-[2px] bg-[#F0F0F0] rounded-full" />

            <div className="space-y-5">
              {standups.map((standup) => {
                const isDaily = standup.type === "daily";
                return (
                  <div key={standup.id} className="relative">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        isDaily
                          ? "bg-[#FF9500] shadow-[0_0_0_2px_#FF9500]"
                          : "bg-[#FBBF24] shadow-[0_0_0_2px_#FBBF24]"
                      }`}
                    />

                    {/* Content */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-0.5 rounded-md ${
                              isDaily
                                ? "bg-[rgba(255,149,0,0.1)] text-[#FF9500]"
                                : "bg-[rgba(251,191,36,0.1)] text-[#D97706]"
                            }`}
                          >
                            {standup.type}
                          </span>
                          <span className="text-[11px] text-[#CACACA]">
                            {formatRelativeDate(standup.date)}
                          </span>
                        </div>
                        {standup.done_summary && (
                          <p className="text-[13px] text-[#6E6E73] leading-relaxed line-clamp-2">
                            {standup.done_summary}
                          </p>
                        )}
                      </div>
                      {standup.duration_seconds && (
                        <span className="text-[11px] text-[#CACACA] shrink-0 mt-0.5">
                          {formatDuration(standup.duration_seconds)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
