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
          <CardTitle className="text-[13px] font-medium text-[#86868B]">Current Streak 🔥</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-[30px] font-bold text-accent leading-none">{streak?.current_streak ?? 0}</div>
          <p className="text-[13px] text-[#86868B] mt-1.5">days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-[13px] font-medium text-[#86868B]">Longest Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-[30px] font-bold text-[#1D1D1F] leading-none">{streak?.longest_streak ?? 0}</div>
          <p className="text-[13px] text-[#86868B] mt-1.5">days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-[13px] font-medium text-[#86868B]">Total Standups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-[30px] font-bold text-[#1D1D1F] leading-none">{totalCount}</div>
          <p className="text-[13px] text-[#86868B] mt-1.5">completed</p>
        </CardContent>
      </Card>
    </div>
  );
}
