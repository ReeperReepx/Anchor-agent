import { createClient } from "@/lib/supabase/server";
import type { Standup } from "@/lib/types/database";
import { HistoryList } from "@/components/history/history-list";

async function getStandups(): Promise<Standup[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("standups")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<Standup[]>();

  return data ?? [];
}

export default async function HistoryPage() {
  const standups = await getStandups();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold text-[#1D1D1F] tracking-[-0.02em]">Standup History</h1>
        <p className="text-[16px] text-[#6B7280] mt-1">Browse and search your past standups</p>
      </div>
      <HistoryList standups={standups} />
    </div>
  );
}
