"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { daysUntilRotation } from "@/lib/utils/week";

interface Partner {
  name: string;
  email: string;
  timezone: string;
  goal_categories: string[];
}

interface CurrentMatch {
  status: "pending" | "active";
  week_of: string;
  matched_at: string | null;
  partner: Partner | null;
}

interface PastMatch {
  week_of: string;
  partner_name: string;
  partner_goals: string[];
}

export default function MatchDashboardPage() {
  const [currentMatch, setCurrentMatch] = useState<CurrentMatch | null>(null);
  const [pastMatches, setPastMatches] = useState<PastMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/match-dashboard");
      const data = await res.json();
      setCurrentMatch(data.current_match);
      setPastMatches(data.past_matches ?? []);
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

  const daysLeft = daysUntilRotation();

  function buildCalendarLink(partner: Partner) {
    const title = encodeURIComponent("Anchor: Weekly Founder Call");
    const details = encodeURIComponent(
      `Weekly call with ${partner.name} via Anchor.\n\nThey're building: ${partner.goal_categories.join(", ")}\nTimezone: ${partner.timezone}`
    );
    const attendee = encodeURIComponent(partner.email);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&add=${attendee}&dur=0030`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#1D1D1F] tracking-[-0.02em]">
          Your Match
        </h1>
        <div className="flex items-center gap-2 text-[16px] text-[#86868B]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>New match in {daysLeft} day{daysLeft !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Current match */}
      {currentMatch?.status === "active" && currentMatch.partner ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0071E3]/10 flex items-center justify-center text-[#0071E3] text-[18px] font-bold">
                  {currentMatch.partner.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <div>
                  <CardTitle>{currentMatch.partner.name}</CardTitle>
                  <p className="text-[14px] text-[#86868B] mt-0.5">
                    {currentMatch.partner.timezone?.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
              <Badge variant="success">Matched</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* What they're building */}
              <div>
                <p className="text-[13px] text-[#86868B] font-medium uppercase tracking-wider mb-2">Building</p>
                <div className="flex flex-wrap gap-2">
                  {currentMatch.partner.goal_categories.map((goal) => (
                    <span
                      key={goal}
                      className="px-3 py-1.5 rounded-lg bg-[#F5F5F7] text-[13px] font-medium text-[#1D1D1F]"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div>
                <p className="text-[13px] text-[#86868B] font-medium uppercase tracking-wider mb-2">Contact</p>
                <p className="text-[15px] text-[#1D1D1F]">{currentMatch.partner.email}</p>
              </div>

              {/* Action */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={buildCalendarLink(currentMatch.partner)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-[#0071E3] hover:bg-[#0077ED]" size="lg">
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Schedule Call via Google Calendar
                    </span>
                  </Button>
                </a>
                <a href={`mailto:${currentMatch.partner.email}?subject=Anchor%20Weekly%20Call&body=Hey%20${encodeURIComponent(currentMatch.partner.name ?? "")}%2C%0A%0ALet's%20find%20a%20time%20for%20our%20weekly%20Anchor%20call%20this%20week!`}>
                  <Button variant="secondary" size="lg" className="w-full">
                    Send Email
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : currentMatch?.status === "pending" ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-[rgba(0,113,227,0.08)] border border-[rgba(0,113,227,0.15)] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-[#0071E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-[18px] font-semibold text-[#1D1D1F] mb-2">
              Finding your match...
            </h2>
            <p className="text-[#86868B] text-[16px] max-w-sm mx-auto">
              You&apos;re in the queue. We&apos;ll match you with another founder as soon as one&apos;s available — usually within a day or two.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-[rgba(0,113,227,0.08)] border border-[rgba(0,113,227,0.15)] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-[#0071E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-[18px] font-semibold text-[#1D1D1F] mb-2">
              No match this week yet
            </h2>
            <p className="text-[#86868B] text-[16px] max-w-sm mx-auto mb-6">
              New matches go out every Monday. Check back soon!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tips card */}
      <Card>
        <CardHeader>
          <CardTitle>Call tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-[15px] text-[#4B5563]">
            <li className="flex items-start gap-2">
              <span className="text-[#0071E3] mt-0.5">1.</span>
              <span>Share what you shipped this week and what&apos;s next</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0071E3] mt-0.5">2.</span>
              <span>Ask about their biggest blocker — you might have the answer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0071E3] mt-0.5">3.</span>
              <span>Set one commitment each for next week</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0071E3] mt-0.5">4.</span>
              <span>Keep it to 15-30 min — short and focused beats long and rambly</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Past matches */}
      {pastMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastMatches.map((match, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-[#E5E5E5] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[13px] font-semibold text-[#86868B]">
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
