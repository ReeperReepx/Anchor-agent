import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Streak } from "@/lib/types/database";

export function StatsCards({
  streak,
  totalCount,
}: {
  streak: Streak | null;
  totalCount: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="relative overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <CardTitle className="text-[11px] font-semibold text-[#FF9500] uppercase tracking-[1px]">Current Streak</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-bold text-[#FF9500]">{streak?.current_streak ?? 0}</div>
            <p className="text-sm text-[#9CA3AF]">days</p>
          </div>
          <p className="text-[12px] text-[#34C759] mt-2 font-medium">Best: {streak?.longest_streak ?? 0} days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[1px]">Longest Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-bold text-[#1D1D1F]">{streak?.longest_streak ?? 0}</div>
            <p className="text-sm text-[#9CA3AF]">days</p>
          </div>
          <p className="text-[12px] text-[#9CA3AF] mt-2">Personal record</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[1px]">Total Standups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-bold text-[#1D1D1F]">{totalCount}</div>
            <p className="text-sm text-[#9CA3AF]">completed</p>
          </div>
          <p className="text-[12px] text-[#34C759] mt-2">Keep it up!</p>
        </CardContent>
      </Card>
    </div>
  );
}
