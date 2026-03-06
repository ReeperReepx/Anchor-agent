import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeeklyProgress } from "@/components/dashboard/weekly-progress";
import { formatRelativeDate, formatDuration } from "@/lib/utils/formatting";
import { createClient } from "@/lib/supabase/server";
import type { Standup, Streak } from "@/lib/types/database";

async function getData(): Promise<{
  streak: Streak | null;
  recentStandups: Standup[];
  userName: string;
  standupTime: string | null;
  totalCount: number;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { streak: null, recentStandups: [], userName: "", standupTime: null, totalCount: 0 };

  const [streakResult, recentResult, profileResult, countResult] = await Promise.all([
    supabase.from("streaks").select("*").eq("user_id", user.id).single<Streak>(),
    supabase.from("standups").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3).returns<Standup[]>(),
    supabase.from("users").select("standup_time, goal_categories").eq("id", user.id).single(),
    supabase.from("standups").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  return {
    streak: streakResult.data,
    recentStandups: recentResult.data ?? [],
    userName: user.user_metadata?.name ?? user.email?.split("@")[0] ?? "",
    standupTime: profileResult.data?.standup_time ?? null,
    totalCount: countResult.count ?? 0,
  };
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const { streak, recentStandups, userName, standupTime, totalCount } = await getData();
  const completedDays = recentStandups.filter((s) => s.type === "daily").map((s) => s.date);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#2C2825] tracking-[-0.02em]">
            {getGreeting()}{userName ? `, ${userName}` : ""}
          </h1>
          {standupTime && (
            <p className="text-sm text-[#8a7e74] mt-1">
              Your next standup is at{" "}
              <span className="text-[#C4654A] font-medium">{standupTime}</span>
            </p>
          )}
        </div>
        <a href="/standup" className="inline-flex items-center gap-2 bg-[#C4654A] hover:bg-[#D4856A] text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all shadow-[0_2px_12px_rgba(196,101,74,0.3)] hover:shadow-[0_4px_16px_rgba(196,101,74,0.4)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
          </svg>
          Start Standup
        </a>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[#8a7e74]">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyProgress completedDays={completedDays} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="!bg-[rgba(196,101,74,0.06)] !border-[rgba(196,101,74,0.2)] !shadow-[0_2px_16px_rgba(196,101,74,0.08)]">
          <CardHeader>
            <CardTitle className="text-[11px] font-semibold text-[#8a7e74] uppercase tracking-[1px]">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-[#C4654A]">{streak?.current_streak ?? 0}</div>
              <p className="text-sm text-[#a89a8e]">days</p>
            </div>
            <p className="text-[12px] text-[#2D8A56] mt-2">Best: {streak?.longest_streak ?? 0} days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-[11px] font-semibold text-[#8a7e74] uppercase tracking-[1px]">Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-[#2C2825]">{streak?.longest_streak ?? 0}</div>
              <p className="text-sm text-[#a89a8e]">days</p>
            </div>
            <p className="text-[12px] text-[#a89a8e] mt-2">Personal record</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-[11px] font-semibold text-[#8a7e74] uppercase tracking-[1px]">Total Standups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-[#2C2825]">{totalCount}</div>
              <p className="text-sm text-[#a89a8e]">completed</p>
            </div>
            <p className="text-[12px] text-[#2D8A56] mt-2">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Standups</CardTitle>
        </CardHeader>
        <CardContent>
          {recentStandups.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-16 h-16 bg-[rgba(196,101,74,0.08)] border border-[rgba(196,101,74,0.15)] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(196,101,74,0.08)]">
                <svg className="w-7 h-7 text-[#C4654A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" strokeWidth={2} />
                </svg>
              </div>
              <p className="text-[15px] font-semibold text-[#2C2825] mb-1">No standups yet</p>
              <p className="text-sm text-[#8a7e74] mb-5">Start your first voice standup to begin tracking your daily progress.</p>
              <a href="/standup" className="inline-flex items-center gap-2 bg-[#C4654A] hover:bg-[#D4856A] text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all shadow-[0_2px_12px_rgba(196,101,74,0.3)]">
                Start your first standup
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {recentStandups.map((standup) => (
                <div
                  key={standup.id}
                  className={`flex items-start justify-between border-l-2 pl-4 pb-4 last:pb-0 ${
                    standup.type === "weekly" ? "border-l-[#FBBF24]" : "border-l-[#C4654A]"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={standup.type === "daily" ? "info" : "warning"}>
                        {standup.type}
                      </Badge>
                      <span className="text-sm text-[#8a7e74]">{formatRelativeDate(standup.date)}</span>
                    </div>
                    {standup.done_summary && (
                      <p className="mt-1.5 text-sm text-[#5a524a] line-clamp-2">{standup.done_summary}</p>
                    )}
                  </div>
                  {standup.duration_seconds && (
                    <span className="text-xs text-[#a89a8e] ml-4 shrink-0">{formatDuration(standup.duration_seconds)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
