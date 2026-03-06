import { Card, CardContent } from "@/components/ui/card";
import { formatRelativeDate, formatDuration } from "@/lib/utils/formatting";
import { createClient } from "@/lib/supabase/server";
import type { Standup } from "@/lib/types/database";

async function getStandups(): Promise<Standup[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("standups")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<Standup[]>();

  return data ?? [];
}

export default async function HistoryPage() {
  const standups = await getStandups();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#2C2825] tracking-[-0.02em]">Standup History</h1>

      {standups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-[rgba(196,101,74,0.08)] border border-[rgba(196,101,74,0.15)] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(196,101,74,0.08)]">
              <svg className="w-7 h-7 text-[#C4654A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-[#2C2825] mb-1">No standups yet</p>
            <p className="text-sm text-[#8a7e74] mb-5">Complete your first standup to see it here.</p>
            <a href="/standup" className="inline-flex items-center gap-2 bg-[#C4654A] hover:bg-[#D4856A] text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all shadow-[0_2px_12px_rgba(196,101,74,0.3)]">
              Start a standup
            </a>
          </CardContent>
        </Card>
      ) : (
        <Card className="!p-0 divide-y divide-[#E8DDD3]">
          {standups.map((standup) => (
            <div
              key={standup.id}
              className="px-6 py-4 hover:bg-[#FAF6F1] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    standup.type === "weekly" ? "bg-[#C4900A]" : "bg-[#C4654A]"
                  }`} />
                  <span className="text-[13px] font-medium text-[#2C2825] capitalize">{standup.type}</span>
                  <span className="text-[13px] text-[#a89a8e]">{formatRelativeDate(standup.date)}</span>
                </div>
                {standup.duration_seconds && (
                  <span className="text-[12px] text-[#a89a8e]">{formatDuration(standup.duration_seconds)}</span>
                )}
              </div>
              {standup.done_summary && (
                <p className="text-sm text-[#5a524a] line-clamp-2 mb-2">{standup.done_summary}</p>
              )}
              <div className="flex gap-1.5">
                {standup.done_summary && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[rgba(45,138,86,0.08)] text-[#2D8A56]">Done</span>
                )}
                {standup.planned_summary && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[rgba(59,111,196,0.08)] text-[#3B6FC4]">Planned</span>
                )}
                {standup.blockers_summary && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[rgba(196,48,48,0.08)] text-[#C43030]">Blockers</span>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
