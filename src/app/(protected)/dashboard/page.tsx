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
  thisWeekCount: number;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { streak: null, recentStandups: [], userName: "", standupTime: null, totalCount: 0, thisWeekCount: 0 };

  // Calculate Monday of this week
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const mondayStr = monday.toISOString().split("T")[0];

  const [streakResult, recentResult, profileResult, countResult, weekCountResult] = await Promise.all([
    supabase.from("streaks").select("*").eq("user_id", user.id).single<Streak>(),
    supabase.from("standups").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3).returns<Standup[]>(),
    supabase.from("users").select("standup_time, goal_categories").eq("id", user.id).single<{ standup_time: string | null; goal_categories: string | null }>(),
    supabase.from("standups").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("standups").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("type", "daily").gte("date", mondayStr),
  ]);

  return {
    streak: streakResult.data,
    recentStandups: recentResult.data ?? [],
    userName: user.user_metadata?.name ?? user.email?.split("@")[0] ?? "",
    standupTime: profileResult.data?.standup_time ?? null,
    totalCount: countResult.count ?? 0,
    thisWeekCount: weekCountResult.count ?? 0,
  };
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const { streak, recentStandups, userName, standupTime, totalCount, thisWeekCount } = await getData();
  const completedDays = recentStandups.filter((s) => s.type === "daily").map((s) => s.date);

  // Determine AI insight
  let insight: { icon: React.ReactNode; title: string; message: string } | null = null;
  const currentStreak = streak?.current_streak ?? 0;
  const longestStreak = streak?.longest_streak ?? 0;

  if (currentStreak >= longestStreak && currentStreak > 0) {
    insight = {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B85C42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      title: "New personal record!",
      message: `${currentStreak} day streak — your longest ever. Keep the momentum going.`,
    };
  } else if (thisWeekCount >= 4) {
    insight = {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B85C42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      title: "Crushing it this week",
      message: `${thisWeekCount}/5 standups done. One more to go!`,
    };
  } else if (recentStandups.length > 0) {
    insight = {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B85C42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-gradient-to-r from-[rgba(184,92,66,0.04)] to-transparent rounded-[16px] px-6 py-5 -mx-1">
        <div>
          <h1 className="text-2xl font-semibold text-[#1D1D1F] tracking-[-0.02em]">
            {getGreeting()}{userName ? `, ${userName}` : ""}
          </h1>
          {standupTime && (
            <p className="text-sm text-[#6B7280] mt-1">
              Your next standup is at{" "}
              <span className="text-[#B85C42] font-medium">{standupTime}</span>
            </p>
          )}
        </div>
        <a href="/standup" className="inline-flex items-center gap-2 bg-[#B85C42] hover:bg-[#D4917F] text-white px-5 py-2.5 rounded-[12px] text-sm font-semibold transition-all shadow-[0_2px_12px_rgba(184,92,66,0.25)] hover:shadow-[0_4px_20px_rgba(184,92,66,0.35)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
          </svg>
          Start Standup
        </a>
      </div>

      {insight && (
        <div className="bg-gradient-to-br from-[rgba(184,92,66,0.06)] to-[rgba(184,92,66,0.02)] border border-[rgba(184,92,66,0.15)] rounded-[14px] p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[rgba(184,92,66,0.1)] flex items-center justify-center shrink-0">
            {insight.icon}
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-[#1D1D1F] mb-1">{insight.title}</h3>
            <p className="text-[13px] text-[#6B7280] leading-relaxed">{insight.message}</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[#6B7280]">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyProgress completedDays={completedDays} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="!bg-gradient-to-br !from-[rgba(184,92,66,0.07)] !to-[rgba(184,92,66,0.02)] !border-[rgba(184,92,66,0.2)] !shadow-[0_2px_16px_rgba(184,92,66,0.08)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[rgba(184,92,66,0.06)] rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader>
            <CardTitle className="text-[11px] font-semibold text-[#B85C42] uppercase tracking-[1px]">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-[#B85C42]">{streak?.current_streak ?? 0}</div>
              <p className="text-sm text-[#9CA3AF]">days</p>
            </div>
            <p className="text-[12px] text-[#2D8A56] mt-2 font-medium">Best: {streak?.longest_streak ?? 0} days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[1px]">Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-[#1D1D1F]">{streak?.longest_streak ?? 0}</div>
              <p className="text-sm text-[#9CA3AF]">days</p>
            </div>
            <p className="text-[12px] text-[#9CA3AF] mt-2">Personal record</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[1px]">Total Standups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-[#1D1D1F]">{totalCount}</div>
              <p className="text-sm text-[#9CA3AF]">completed</p>
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
              <div className="w-16 h-16 bg-[rgba(184,92,66,0.08)] border border-[rgba(184,92,66,0.15)] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(184,92,66,0.08)]">
                <svg className="w-7 h-7 text-[#B85C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" strokeWidth={2} />
                </svg>
              </div>
              <p className="text-[15px] font-semibold text-[#1D1D1F] mb-1">No standups yet</p>
              <p className="text-sm text-[#6B7280] mb-5">Start your first voice standup to begin tracking your daily progress.</p>
              <a href="/standup" className="inline-flex items-center gap-2 bg-[#B85C42] hover:bg-[#D4917F] text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all shadow-[0_2px_12px_rgba(184,92,66,0.3)]">
                Start your first standup
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {recentStandups.map((standup) => (
                <div
                  key={standup.id}
                  className={`flex items-start justify-between border-l-2 pl-4 pb-4 last:pb-0 ${
                    standup.type === "weekly" ? "border-l-[#FBBF24]" : "border-l-[#B85C42]"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={standup.type === "daily" ? "info" : "warning"}>
                        {standup.type}
                      </Badge>
                      <span className="text-sm text-[#6B7280]">{formatRelativeDate(standup.date)}</span>
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
    </div>
  );
}
