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
      <Card className="!bg-gradient-to-br !from-[rgba(184,92,66,0.07)] !to-[rgba(184,92,66,0.02)] !border-[rgba(184,92,66,0.2)] !shadow-[0_2px_16px_rgba(184,92,66,0.08)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-[rgba(184,92,66,0.06)] rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardHeader>
          <CardTitle className="text-[11px] font-semibold text-[#B85C42] uppercase tracking-[1px]">Current Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-bold text-[#B85C42]">{streak?.current_streak ?? 0}</div>
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
            <div className="text-2xl sm:text-3xl font-bold text-[#1D1D1F]">{streak?.longest_streak ?? 0}</div>
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
            <div className="text-2xl sm:text-3xl font-bold text-[#1D1D1F]">{totalCount}</div>
            <p className="text-sm text-[#9CA3AF]">completed</p>
          </div>
          <p className="text-[12px] text-[#2D8A56] mt-2">Keep it up!</p>
        </CardContent>
      </Card>
    </div>
  );
}
