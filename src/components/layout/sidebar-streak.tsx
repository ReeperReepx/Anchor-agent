"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function SidebarStreak() {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", user.id)
        .single();
      if (data) setStreak(data.current_streak);
    }
    load();
  }, []);

  if (streak === null) return null;

  return (
    <span className="inline-flex items-center gap-1 bg-[rgba(196,101,74,0.08)] text-[#C4654A] text-[11px] font-semibold px-2 py-0.5 rounded-full">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 23c-3.866 0-7-2.686-7-6 0-1.664.558-3.202 1.5-4.5.96-1.32 1.5-2.836 1.5-4.5 0-.414.336-.75.75-.75.267 0 .501.14.633.35C10.89 10.13 12 12.5 12 14c1.5-2 2-4.5 2-7 0-.414.336-.75.75-.75.2 0 .382.08.516.21C17.632 8.72 19 11.84 19 15c0 4.418-3.134 8-7 8z"/>
      </svg>
      {streak} day streak
    </span>
  );
}
