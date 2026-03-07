"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelativeDate, formatDuration } from "@/lib/utils/formatting";
import type { Standup } from "@/lib/types/database";

type TypeFilter = "all" | "daily" | "weekly";
type TimeFilter = "all" | "this_week" | "this_month";

function getStartOfWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday = start of week
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getStartOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function HistoryList({ standups }: { standups: Standup[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    const weekStart = getStartOfWeek();
    const monthStart = getStartOfMonth();

    return standups.filter((s) => {
      // Type filter
      if (typeFilter !== "all" && s.type !== typeFilter) return false;

      // Time filter
      if (timeFilter === "this_week") {
        if (new Date(s.date) < weekStart) return false;
      } else if (timeFilter === "this_month") {
        if (new Date(s.date) < monthStart) return false;
      }

      // Search
      if (query) {
        const haystack = [s.done_summary, s.planned_summary, s.blockers_summary]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [standups, search, typeFilter, timeFilter]);

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  if (standups.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 bg-[rgba(184,92,66,0.08)] border border-[rgba(184,92,66,0.15)] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(184,92,66,0.08)]">
            <svg className="w-7 h-7 text-[#B85C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[15px] font-semibold text-[#1D1D1F] mb-1">No standups yet</p>
          <p className="text-sm text-[#6B7280] mb-5">Complete your first standup to see it here.</p>
          <a
            href="/standup"
            className="inline-flex items-center gap-2 bg-[#B85C42] hover:bg-[#D4917F] text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all shadow-[0_2px_12px_rgba(184,92,66,0.3)]"
          >
            Start a standup
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search standups..."
          className="w-full rounded-[10px] border border-[#E5E5E5] bg-[#FAFAFA] pl-9 pr-3 py-2.5 text-sm text-[#1D1D1F] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#B85C42]/30 focus:border-[#B85C42] focus:bg-white transition-all"
        />
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "daily", "weekly"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all ${
              typeFilter === t
                ? "bg-[#B85C42] text-white border border-[#B85C42] shadow-[0_2px_8px_rgba(184,92,66,0.25)]"
                : "bg-white border border-[#E5E5E5] text-[#6B7280] hover:border-[#B85C42]/30"
            }`}
          >
            {t === "all" ? "All" : t === "daily" ? "Daily" : "Weekly"}
          </button>
        ))}

        <div className="w-px h-5 bg-[#E5E5E5] mx-1" />

        {(["this_week", "this_month"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTimeFilter(timeFilter === t ? "all" : t)}
            className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all ${
              timeFilter === t
                ? "bg-[#B85C42] text-white border border-[#B85C42] shadow-[0_2px_8px_rgba(184,92,66,0.25)]"
                : "bg-white border border-[#E5E5E5] text-[#6B7280] hover:border-[#B85C42]/30"
            }`}
          >
            {t === "this_week" ? "This week" : "This month"}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-[#6B7280]">No standups match your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="!p-0 divide-y divide-[#E5E5E5]">
          {filtered.map((standup) => {
            const isExpanded = expanded.has(standup.id);

            return (
              <div key={standup.id}>
                <button
                  type="button"
                  onClick={() => toggleExpanded(standup.id)}
                  className="w-full text-left px-4 sm:px-6 py-4 hover:bg-[#F8F7F4] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          standup.type === "weekly" ? "bg-[#C4900A]" : "bg-[#B85C42]"
                        }`}
                      />
                      <span className="text-[13px] font-medium text-[#1D1D1F] capitalize">
                        {standup.type}
                      </span>
                      <span className="text-[13px] text-[#9CA3AF]">
                        {formatRelativeDate(standup.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {standup.duration_seconds && (
                        <span className="text-[12px] text-[#9CA3AF]">
                          {formatDuration(standup.duration_seconds)}
                        </span>
                      )}
                      <svg
                        className={`w-4 h-4 text-[#9CA3AF] transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {!isExpanded && standup.done_summary && (
                    <p className="text-sm text-[#4B5563] line-clamp-2 mb-2">
                      {standup.done_summary}
                    </p>
                  )}

                  <div className="flex gap-1.5">
                    {standup.done_summary && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[rgba(45,138,86,0.08)] text-[#2D8A56]">
                        Done
                      </span>
                    )}
                    {standup.planned_summary && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[rgba(59,111,196,0.08)] text-[#3B6FC4]">
                        Planned
                      </span>
                    )}
                    {standup.blockers_summary && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[rgba(196,48,48,0.08)] text-[#C43030]">
                        Blockers
                      </span>
                    )}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-5 space-y-3">
                    {standup.done_summary && (
                      <div className="border-l-2 border-[rgba(45,138,86,0.4)] pl-3 py-1">
                        <p className="text-[12px] font-semibold text-[#2D8A56] mb-1">Done</p>
                        <p className="text-sm text-[#4B5563] leading-relaxed whitespace-pre-line">
                          {standup.done_summary}
                        </p>
                      </div>
                    )}
                    {standup.planned_summary && (
                      <div className="border-l-2 border-[rgba(59,111,196,0.4)] pl-3 py-1">
                        <p className="text-[12px] font-semibold text-[#3B6FC4] mb-1">Planned</p>
                        <p className="text-sm text-[#4B5563] leading-relaxed whitespace-pre-line">
                          {standup.planned_summary}
                        </p>
                      </div>
                    )}
                    {standup.blockers_summary && (
                      <div className="border-l-2 border-[rgba(196,48,48,0.4)] pl-3 py-1">
                        <p className="text-[12px] font-semibold text-[#C43030] mb-1">Blockers</p>
                        <p className="text-sm text-[#4B5563] leading-relaxed whitespace-pre-line">
                          {standup.blockers_summary}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
