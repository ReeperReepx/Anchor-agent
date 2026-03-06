import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { WeeklySummary, MonthlySummary } from "@/lib/types/database";

async function getSummaries() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { weekly: [], monthly: [] };

  const [weeklyResult, monthlyResult] = await Promise.all([
    supabase
      .from("weekly_summaries")
      .select("*")
      .eq("user_id", user.id)
      .order("week_of", { ascending: false })
      .limit(12)
      .returns<WeeklySummary[]>(),
    supabase
      .from("monthly_summaries")
      .select("*")
      .eq("user_id", user.id)
      .order("month_of", { ascending: false })
      .limit(12)
      .returns<MonthlySummary[]>(),
  ]);

  return {
    weekly: weeklyResult.data ?? [],
    monthly: monthlyResult.data ?? [],
  };
}

function formatMonth(dateStr: string): string {
  const d = new Date(dateStr + "-01");
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatWeek(dateStr: string): string {
  const d = new Date(dateStr);
  const end = new Date(d);
  end.setDate(d.getDate() + 4);
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export default async function SummariesPage() {
  const { weekly, monthly } = await getSummaries();
  const hasAny = weekly.length > 0 || monthly.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#1D1D1F] tracking-[-0.02em]">Summaries</h1>
        <p className="text-[13px] text-[#6B7280] mt-1">AI-generated insights from your standups</p>
      </div>

      {!hasAny ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-[rgba(184,92,66,0.08)] border border-[rgba(184,92,66,0.15)] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(184,92,66,0.08)]">
              <svg className="w-7 h-7 text-[#B85C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-[#1D1D1F] mb-1">No summaries yet</p>
            <p className="text-sm text-[#6B7280] mb-1">Weekly and monthly summaries are generated automatically after you complete standups.</p>
            <p className="text-xs text-[#9CA3AF]">Complete a full week of standups to get your first summary.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Monthly Summaries */}
          {monthly.length > 0 && (
            <section>
              <h2 className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[1px] mb-4">Monthly</h2>
              <div className="space-y-3">
                {monthly.map((s) => (
                  <Card key={s.id} className="hover:border-[#B85C42]/30 transition-colors">
                    <CardContent>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-[#B85C42] shrink-0" />
                          <span className="text-[15px] font-semibold text-[#1D1D1F]">
                            {formatMonth(s.month_of)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[12px] text-[#9CA3AF]">
                          <span>{s.standup_count} standups</span>
                          {s.streak_best != null && (
                            <span className="text-[#B85C42] font-medium">{s.streak_best}-day best streak</span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-[#4B5563] leading-relaxed">{s.summary}</p>
                      {s.highlights && (
                        <div className="mt-3 pt-3 border-t border-[#E5E5E5]">
                          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-[1px] mb-1.5">Highlights</p>
                          <p className="text-sm text-[#4B5563] leading-relaxed">{s.highlights}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Weekly Summaries */}
          {weekly.length > 0 && (
            <section>
              <h2 className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[1px] mb-4">Weekly</h2>
              <Card className="!p-0 divide-y divide-[#E5E5E5]">
                {weekly.map((s) => (
                  <div key={s.id} className="px-6 py-4 hover:bg-[#F8F7F4] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3B6FC4] shrink-0" />
                        <span className="text-[13px] font-medium text-[#1D1D1F]">
                          {formatWeek(s.week_of)}
                        </span>
                      </div>
                      <span className="text-[12px] text-[#9CA3AF]">{s.standup_count} standups</span>
                    </div>
                    <p className="text-sm text-[#4B5563] leading-relaxed">{s.summary}</p>
                  </div>
                ))}
              </Card>
            </section>
          )}
        </>
      )}
    </div>
  );
}
