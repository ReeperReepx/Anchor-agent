"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PastMatch {
  week_of: string;
  partner_name: string;
  partner_goals: string[];
}

export default function MatchHistoryPage() {
  const [matches, setMatches] = useState<PastMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/match-dashboard");
      const data = await res.json();
      setMatches(data.past_matches ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-7 w-48" />
        <div className="rounded-[14px] border border-[#E5E5E5] bg-white p-[28px]">
          <div className="skeleton h-4 w-32 mb-4" />
          <div className="skeleton h-3 w-full mb-3" />
          <div className="skeleton h-3 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-[28px] font-semibold text-[#1D1D1F] tracking-[-0.02em]">
        Past Matches
      </h1>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-[#86868B] text-[16px]">
              No past matches yet. After your first week, your match history will show up here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {matches.length} match{matches.length !== 1 ? "es" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {matches.map((match, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-[#E5E5E5] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[14px] font-semibold text-[#86868B]">
                      {match.partner_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-[#1D1D1F]">{match.partner_name}</p>
                      <p className="text-[13px] text-[#86868B]">{match.partner_goals.join(", ")}</p>
                    </div>
                  </div>
                  <span className="text-[13px] text-[#86868B]">
                    Week of {new Date(match.week_of).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
