import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ActivityHeatmap } from "@/components/tracking/activity-heatmap";
import { WeeklyBars } from "@/components/tracking/weekly-bars";
import { RingGauge } from "@/components/tracking/ring-gauge";
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

function getMondayOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  // getDay(): 0=Sun,1=Mon,...,6=Sat. For Sunday, go back 6 days; otherwise go back (day-1) days.
  const diff = day === 0 ? 6 : day - 1;
  date.setDate(date.getDate() - diff);
  return date;
}

function buildWeeklyData(standups: Standup[]): WeekData[] {
  const weeks: WeekData[] = [];
  const now = new Date();
  const thisMonday = getMondayOfWeek(now);

  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(thisMonday);
    weekStart.setDate(thisMonday.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 4); // Friday

    if (weekEnd > now) {
      weekEnd.setTime(now.getTime());
    }

    const label = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const startStr = weekStart.toISOString().split("T")[0];
    const endStr = weekEnd.toISOString().split("T")[0];

    const uniqueDates = new Set(
      standups
        .filter((s) => s.type === "daily" && s.date >= startStr && s.date <= endStr)
        .map((s) => s.date)
    );
    const total = Math.max(getWeekdayCount(weekStart, weekEnd), 1);
    const completed = Math.min(uniqueDates.size, total);

    weeks.push({ weekLabel: label, completed, total });
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

function countUniqueDates(standups: Standup[], startDate: string, endDate: string): number {
  const dates = new Set<string>();
  for (const s of standups) {
    if (s.type === "daily" && s.date >= startDate && s.date <= endDate) {
      dates.add(s.date);
    }
  }
  return dates.size;
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
  const weekStart = getMondayOfWeek(now);
  const weekStartStr = weekStart.toISOString().split("T")[0];
  const todayStr = now.toISOString().split("T")[0];

  const [standupResult, streakResult] = await Promise.all([
    supabase
      .from("standups")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", cutoff)
      .order("date", { ascending: true })
      .returns<Standup[]>(),
    supabase.from("streaks").select("*").eq("user_id", user.id).single<Streak>(),
  ]);

  const allStandups = standupResult.data ?? [];

  const weekdaysThisWeek = Math.max(getWeekdayCount(weekStart, now), 1);
  const monthDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekdaysThisMonth = Math.max(getWeekdayCount(monthDate, now), 1);

  const weekCompleted = countUniqueDates(allStandups, weekStartStr, todayStr);
  const monthCompleted = countUniqueDates(allStandups, monthStart, todayStr);

  return {
    standups: allStandups,
    streak: streakResult.data,
    thisWeek: { completed: Math.min(weekCompleted, weekdaysThisWeek), total: weekdaysThisWeek },
    thisMonth: { completed: Math.min(monthCompleted, weekdaysThisMonth), total: weekdaysThisMonth },
  };
}

export default async function TrackingPage() {
  const { standups, streak, thisWeek, thisMonth } = await getTrackingData();
  const heatmapData = buildHeatmapData(standups);
  const weeklyData = buildWeeklyData(standups);

  const weekPct = thisWeek ? Math.min(Math.round((thisWeek.completed / Math.max(thisWeek.total, 1)) * 100), 100) : 0;
  const monthPct = thisMonth ? Math.min(Math.round((thisMonth.completed / Math.max(thisMonth.total, 1)) * 100), 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#1D1D1F] tracking-[-0.02em]">Tracking</h1>
        <div className="flex items-center gap-2 text-[16px] text-[#86868B]">
          <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 23c-3.866 0-7-2.686-7-6 0-1.664.558-3.202 1.5-4.5.96-1.32 1.5-2.836 1.5-4.5 0-.414.336-.75.75-.75.267 0 .501.14.633.35C10.89 10.13 12 12.5 12 14c1.5-2 2-4.5 2-7 0-.414.336-.75.75-.75.2 0 .382.08.516.21C17.632 8.72 19 11.84 19 15c0 4.418-3.134 8-7 8z"/>
          </svg>
          <span className="font-semibold text-accent">{streak?.current_streak ?? 0}</span> day streak
        </div>
      </div>

      {/* Stat Cards - Ring Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center gap-5">
              <RingGauge percentage={weekPct} color="#B57308">
                <span className="text-[16px] font-bold text-[#1D1D1F]">{weekPct}%</span>
              </RingGauge>
              <div>
                <h3 className="text-[13px] font-semibold text-[#86868B] uppercase tracking-[1px] mb-1">
                  This Week
                </h3>
                <div className="text-[28px] font-bold text-[#1D1D1F] leading-none">
                  {thisWeek?.completed ?? 0}
                  <span className="text-[18px] text-[#9CA3AF] font-medium"> / {thisWeek?.total ?? 5} days</span>
                </div>
                {weekPct >= 60 && (
                  <p className="text-[13px] text-[#34C759] font-medium mt-1">On track</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-5">
              <RingGauge percentage={monthPct} color="#60A5FA">
                <span className="text-[16px] font-bold text-[#1D1D1F]">{monthPct}%</span>
              </RingGauge>
              <div>
                <h3 className="text-[13px] font-semibold text-[#86868B] uppercase tracking-[1px] mb-1">
                  This Month
                </h3>
                <div className="text-[28px] font-bold text-[#1D1D1F] leading-none">
                  {thisMonth?.completed ?? 0}
                  <span className="text-[18px] text-[#9CA3AF] font-medium"> / {thisMonth?.total ?? 22} days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-5">
              <RingGauge percentage={100} color="#34C759">
                <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 23c-3.866 0-7-2.686-7-6 0-1.664.558-3.202 1.5-4.5.96-1.32 1.5-2.836 1.5-4.5 0-.414.336-.75.75-.75.267 0 .501.14.633.35C10.89 10.13 12 12.5 12 14c1.5-2 2-4.5 2-7 0-.414.336-.75.75-.75.2 0 .382.08.516.21C17.632 8.72 19 11.84 19 15c0 4.418-3.134 8-7 8z"/>
                </svg>
              </RingGauge>
              <div>
                <h3 className="text-[13px] font-semibold text-accent uppercase tracking-[1px] mb-1">
                  Current Streak
                </h3>
                <div className="text-[28px] font-bold text-accent leading-none">
                  {streak?.current_streak ?? 0}
                  <span className="text-[18px] text-[#9CA3AF] font-medium"> days</span>
                </div>
                <p className="text-[13px] text-[#34C759] font-medium mt-1">
                  Best: {streak?.longest_streak ?? 0} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Heatmap + Weekly Completion side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#86868B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Weekly Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="min-w-0">
            <WeeklyBars weeks={weeklyData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
