import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ActivityHeatmap } from "@/components/tracking/activity-heatmap";
import { WeeklyBars } from "@/components/tracking/weekly-bars";
import type { Standup, Streak } from "@/lib/types/database";

interface WeekData {
  weekLabel: string;
  completed: number;
  total: number;
}

function getWeekdayCount(start: Date, end: Date): number {
  let count = 0;
  const d = new Date(start);
  while (d <= end) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

function buildWeeklyData(standups: Standup[]): WeekData[] {
  const weeks: WeekData[] = [];
  const now = new Date();

  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1 - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 4); // Friday

    if (weekEnd > now) {
      weekEnd.setTime(now.getTime());
    }

    const label = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const startStr = weekStart.toISOString().split("T")[0];
    const endStr = weekEnd.toISOString().split("T")[0];

    const completed = standups.filter(
      (s) => s.type === "daily" && s.date >= startStr && s.date <= endStr
    ).length;

    const total = getWeekdayCount(weekStart, weekEnd);

    weeks.push({ weekLabel: label, completed, total: Math.max(total, 1) });
  }

  return weeks;
}

function buildHeatmapData(standups: Standup[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of standups) {
    map[s.date] = (map[s.date] || 0) + (s.type === "weekly" ? 2 : 1);
  }
  return map;
}

async function getTrackingData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { standups: [], streak: null };

  const twelveWeeksAgo = new Date();
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
  const cutoff = twelveWeeksAgo.toISOString().split("T")[0];

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  const weekStartStr = weekStart.toISOString().split("T")[0];
  const todayStr = now.toISOString().split("T")[0];

  const [standupResult, streakResult, weekCountResult, monthCountResult] = await Promise.all([
    supabase
      .from("standups")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", cutoff)
      .order("date", { ascending: true })
      .returns<Standup[]>(),
    supabase.from("streaks").select("*").eq("user_id", user.id).single<Streak>(),
    supabase
      .from("standups")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("type", "daily")
      .gte("date", weekStartStr)
      .lte("date", todayStr),
    supabase
      .from("standups")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("type", "daily")
      .gte("date", monthStart)
      .lte("date", todayStr),
  ]);

  const weekdaysThisWeek = getWeekdayCount(weekStart, now);
  const monthDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekdaysThisMonth = getWeekdayCount(monthDate, now);

  return {
    standups: standupResult.data ?? [],
    streak: streakResult.data,
    thisWeek: { completed: weekCountResult.count ?? 0, total: weekdaysThisWeek },
    thisMonth: { completed: monthCountResult.count ?? 0, total: weekdaysThisMonth },
  };
}

export default async function TrackingPage() {
  const { standups, streak, thisWeek, thisMonth } = await getTrackingData();
  const heatmapData = buildHeatmapData(standups);
  const weeklyData = buildWeeklyData(standups);

  const weekPct = thisWeek ? Math.round((thisWeek.completed / Math.max(thisWeek.total, 1)) * 100) : 0;
  const monthPct = thisMonth ? Math.round((thisMonth.completed / Math.max(thisMonth.total, 1)) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#1D1D1F] tracking-[-0.02em]">Tracking</h1>
        <div className="flex items-center gap-2 text-[13px] text-[#86868B]">
          <svg className="w-4 h-4 text-[#FF9500]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 23c-3.866 0-7-2.686-7-6 0-1.664.558-3.202 1.5-4.5.96-1.32 1.5-2.836 1.5-4.5 0-.414.336-.75.75-.75.267 0 .501.14.633.35C10.89 10.13 12 12.5 12 14c1.5-2 2-4.5 2-7 0-.414.336-.75.75-.75.2 0 .382.08.516.21C17.632 8.72 19 11.84 19 15c0 4.418-3.134 8-7 8z"/>
          </svg>
          <span className="font-semibold text-[#FF9500]">{streak?.current_streak ?? 0}</span> day streak
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* This Week */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[1px]">This Week</span>
              <span className="text-[12px] font-medium text-[#9CA3AF]">{weekPct}%</span>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
                {thisWeek?.completed ?? 0}
              </span>
              <span className="text-lg text-[#9CA3AF]">/{thisWeek?.total ?? 5}</span>
              <span className="text-sm text-[#9CA3AF]">days</span>
            </div>
            <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all bg-gradient-to-r from-[#FF9500]/60 to-[#FF9500]"
                style={{ width: `${weekPct}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[1px]">This Month</span>
              <span className="text-[12px] font-medium text-[#9CA3AF]">{monthPct}%</span>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
                {thisMonth?.completed ?? 0}
              </span>
              <span className="text-lg text-[#9CA3AF]">/{thisMonth?.total ?? 22}</span>
              <span className="text-sm text-[#9CA3AF]">days</span>
            </div>
            <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all bg-gradient-to-r from-[#60A5FA]/60 to-[#60A5FA]"
                style={{ width: `${monthPct}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="relative overflow-hidden">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-[#FF9500] uppercase tracking-[1px]">Current Streak</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#FF9500]">
                {streak?.current_streak ?? 0}
              </span>
              <span className="text-sm text-[#9CA3AF]">days</span>
            </div>
            <p className="text-[12px] text-[#34C759] font-medium">
              Best: {streak?.longest_streak ?? 0} days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#86868B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap data={heatmapData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#86868B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Weekly Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyBars weeks={weeklyData} />
        </CardContent>
      </Card>
    </div>
  );
}
