import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WeeklyOverview } from "@/components/dashboard/weekly-overview";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentStandupsList } from "@/components/dashboard/recent-standups-list";
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
  const { streak, recentStandups, userName, standupTime, totalCount } = await getData();
  const completedDays = recentStandups.filter((s) => s.type === "daily").map((s) => s.date);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-[-0.02em]">
            {getGreeting()}{userName ? `, ${userName}` : ""}
          </h1>
          {standupTime && (
            <p className="text-sm text-[#86868B] mt-1">
              Next standup at{" "}
              <span className="text-[#FF9500] font-semibold">{standupTime}</span>
            </p>
          )}
        </div>
        <a href="/standup" className="inline-flex items-center justify-center gap-2 bg-[#1D1D1F] hover:bg-[#333] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
          </svg>
          Start Standup
        </a>
      </div>

      <StatsCards streak={streak} totalCount={totalCount} />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[#86868B]">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyOverview completedDays={completedDays} />
        </CardContent>
      </Card>

      <RecentStandupsList standups={recentStandups} />
    </div>
  );
}
