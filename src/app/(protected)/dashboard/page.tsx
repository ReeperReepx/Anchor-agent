import { Card } from "@/components/ui/card";
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
  const fiveDaysAgo = new Date(now);
  fiveDaysAgo.setDate(now.getDate() - 4);
  fiveDaysAgo.setHours(0, 0, 0, 0);
  const fiveDaysAgoStr = fiveDaysAgo.toISOString().split("T")[0];

  const [streakResult, recentResult, profileResult, countResult] = await Promise.all([
    supabase.from("streaks").select("*").eq("user_id", user.id).single<Streak>(),
    supabase.from("standups").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5).returns<Standup[]>(),
    supabase.from("users").select("standup_time, goal_categories").eq("id", user.id).single<{ standup_time: string | null; goal_categories: string | null }>(),
    supabase.from("standups").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  return {
    streak: streakResult.data,
    recentStandups: recentResult.data ?? [],
    userName: user.user_metadata?.name ?? user.email?.split("@")[0] ?? "",
    standupTime: profileResult.data?.standup_time ?? null,
    totalCount: countResult.count ?? 0,
    thisWeekCount: 0,
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
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-[-0.02em]">
          {getGreeting()}{userName ? `, ${userName}` : ""}
        </h1>
        {standupTime && (
          <p className="text-[16px] text-[#86868B] mt-1.5">
            Your standup is scheduled for{" "}
            <span className="text-[#86868B] font-medium">{standupTime}</span>
          </p>
        )}
      </div>

      <StatsCards streak={streak} totalCount={totalCount} />

      <Card className="p-6">
        <WeeklyOverview completedDays={completedDays} />
      </Card>

      <RecentStandupsList standups={recentStandups} />
    </div>
  );
}
