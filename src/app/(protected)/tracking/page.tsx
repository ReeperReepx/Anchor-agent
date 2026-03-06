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
      <h1 className="text-2xl font-semibold text-[#1D1D1F] tracking-[-0.02em]">Tracking</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[1px]">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1D1D1F]">
                {thisWeek?.completed ?? 0}
                <span className="text-lg text-[#9CA3AF]">/{thisWeek?.total ?? 5}</span>
              </span>
              <span className="text-sm text-[#9CA3AF]">days</span>
            </div>
            <div className="mt-2 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B85C42] rounded-full transition-all"
                style={{ width: `${weekPct}%` }}
              />
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">{weekPct}% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[1px]">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1D1D1F]">
                {thisMonth?.completed ?? 0}
                <span className="text-lg text-[#9CA3AF]">/{thisMonth?.total ?? 22}</span>
              </span>
              <span className="text-sm text-[#9CA3AF]">days</span>
            </div>
            <div className="mt-2 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#60A5FA] rounded-full transition-all"
                style={{ width: `${monthPct}%` }}
              />
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">{monthPct}% complete</p>
          </CardContent>
        </Card>

        <Card className="!bg-[rgba(184,92,66,0.08)] !border-[rgba(184,92,66,0.2)]">
          <CardHeader>
            <CardTitle className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[1px]">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#B85C42]">
                {streak?.current_streak ?? 0}
              </span>
              <span className="text-sm text-[#9CA3AF]">days</span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-2">
              Best: {streak?.longest_streak ?? 0} days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap data={heatmapData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyBars weeks={weeklyData} />
        </CardContent>
      </Card>
    </div>
  );
}
