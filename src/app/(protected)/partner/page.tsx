"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StandupSummary } from "@/components/standup/standup-summary";
import { formatRelativeDate, formatDuration } from "@/lib/utils/formatting";
import { daysUntilRotation } from "@/lib/utils/week";
import type { Standup } from "@/lib/types/database";

interface ChatMessage {
  id: string;
  from: "you" | "partner";
  text: string;
  time: string;
}

export default function PartnerPage() {
  const [partnerStandup, setPartnerStandup] = useState<Standup | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [noPartner, setNoPartner] = useState(false);
  const [daysLeft, setDaysLeft] = useState(daysUntilRotation());

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/partner");
      const data = await res.json();
      if (!data.standup) {
        setNoPartner(true);
      } else {
        setPartnerStandup(data.standup);
        if (data.days_until_rotation) {
          setDaysLeft(data.days_until_rotation);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setChat((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        from: "you",
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      },
    ]);
    setNewMessage("");
  }

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

  if (noPartner) {
    return <JoinQueueView />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#1D1D1F] tracking-[-0.02em]">Collaborative Standups</h1>
        <RotationBadge daysLeft={daysLeft} />
      </div>

      {partnerStandup && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[rgba(255,149,0,0.15)] flex items-center justify-center text-[#FF9500] text-sm font-semibold shrink-0">
                  P
                </div>
                <CardTitle>Your partner&apos;s standup</CardTitle>
                <Badge variant="info">{partnerStandup.type}</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#86868B] pl-10 sm:pl-0">
                {partnerStandup.duration_seconds && (
                  <span>
                    {formatDuration(partnerStandup.duration_seconds)}
                  </span>
                )}
                <span>{formatRelativeDate(partnerStandup.date)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <StandupSummary
              done={partnerStandup.done_summary}
              planned={partnerStandup.planned_summary}
              blockers={partnerStandup.blockers_summary}
            />
          </CardContent>
        </Card>
      )}

      <ChatThread
        chat={chat}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSend={handleSend}
      />
    </div>
  );
}

function RotationBadge({ daysLeft }: { daysLeft: number }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#86868B]">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span>
        New partner in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

function JoinQueueView() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [joined, setJoined] = useState(false);

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function handleJoin() {
    if (selectedDays.length === 0) return;
    // TODO: POST to /api/partner/join with selectedDays
    setJoined(true);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#1D1D1F] tracking-[-0.02em]">Collaborative Standups</h1>
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 bg-[rgba(255,149,0,0.08)] border border-[rgba(255,149,0,0.15)] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(255,149,0,0.08)]">
            <svg
              className="w-7 h-7 text-[#FF9500]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          {joined ? (
            <>
              <h2 className="text-[15px] font-semibold text-[#1D1D1F] mb-2">
                You&apos;re in the queue!
              </h2>
              <p className="text-[#86868B] text-sm mb-2 max-w-sm mx-auto">
                We&apos;ll match you with another solopreneur for collaborative standups on{" "}
                <span className="font-medium text-[#1D1D1F]">{selectedDays.join(", ")}</span>.
              </p>
              <p className="text-[12px] text-[#9CA3AF]">You&apos;ll be notified when your match is ready.</p>
            </>
          ) : (
            <>
              <h2 className="text-[15px] font-semibold text-[#1D1D1F] mb-2">
                Join a collaborative standup
              </h2>
              <p className="text-[#86868B] text-sm mb-6 max-w-sm mx-auto">
                Get matched with another solopreneur for joint standup sessions.
                You&apos;ll each do your standup separately, then see each other&apos;s summaries.
              </p>

              <div className="mb-6">
                <p className="text-[13px] font-medium text-[#1D1D1F] mb-3">
                  Which days do you want joint sessions?
                </p>
                <div className="flex items-center justify-center gap-2">
                  {WEEKDAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`w-12 h-12 rounded-xl text-sm font-semibold transition-all ${
                        selectedDays.includes(day)
                          ? "bg-[#FF9500] text-white shadow-[0_2px_8px_rgba(255,149,0,0.3)]"
                          : "bg-[#F5F5F7] text-[#86868B] hover:bg-[#EEEEEF]"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[12px] text-[#9CA3AF] mb-6">Partners see each other&apos;s standup summaries, never recordings.</p>
              <Button onClick={handleJoin} disabled={selectedDays.length === 0}>
                Join the queue
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ChatThread({
  chat,
  newMessage,
  setNewMessage,
  onSend,
}: {
  chat: ChatMessage[];
  newMessage: string;
  setNewMessage: (v: string) => void;
  onSend: (e: React.FormEvent) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
          {chat.length === 0 ? (
            <p className="text-sm text-[#9CA3AF]">
              No messages yet. Say something about their standup.
            </p>
          ) : (
            chat.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "you" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-[12px] px-4 py-2.5 ${
                    msg.from === "you"
                      ? "bg-[#FF9500] text-white"
                      : "bg-[#F0F0F0] text-[#1D1D1F]"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p
                    className={`text-[11px] mt-1 ${
                      msg.from === "you" ? "text-white/60" : "text-[#9CA3AF]"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={onSend} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                onSend(e);
              }
            }}
            placeholder="Write a message... (Ctrl+Enter to send)"
            aria-label="Message to partner"
            className="flex-1 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF9500]/30 focus:border-[#FF9500] focus:bg-white transition-all"
          />
          <Button type="submit" size="md">
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
