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
        <div className="rounded-[14px] border border-[#E8DDD3] bg-white p-[28px]">
          <div className="skeleton h-4 w-32 mb-4" />
          <div className="skeleton h-3 w-full mb-3" />
          <div className="skeleton h-3 w-3/4" />
        </div>
      </div>
    );
  }

  if (noPartner) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#2C2825] tracking-[-0.02em]">Partner Standup</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-[rgba(196,101,74,0.08)] border border-[rgba(196,101,74,0.15)] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(196,101,74,0.08)]">
              <svg
                className="w-7 h-7 text-[#C4654A]"
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
            <h2 className="text-[15px] font-semibold text-[#2C2825] mb-2">
              No partner yet
            </h2>
            <p className="text-[#8a7e74] text-sm mb-6 max-w-xs mx-auto">
              You&apos;ll be matched with a new accountability partner every week
              based on your goals and timezone.
            </p>
            <Button>Join matching queue</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#2C2825] tracking-[-0.02em]">Partner Standup</h1>
        <RotationBadge daysLeft={daysLeft} />
      </div>

      {partnerStandup && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[rgba(196,101,74,0.15)] flex items-center justify-center text-[#C4654A] text-sm font-semibold">
                  P
                </div>
                <CardTitle>Your partner&apos;s standup</CardTitle>
                <Badge variant="info">{partnerStandup.type}</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#8a7e74]">
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
    <div className="flex items-center gap-2 text-sm text-[#8a7e74]">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span>
        New partner in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
      </span>
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
            <p className="text-sm text-[#a89a8e]">
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
                      ? "bg-[#C4654A] text-white"
                      : "bg-[#F5F0E8] text-[#2C2825]"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p
                    className={`text-[11px] mt-1 ${
                      msg.from === "you" ? "text-white/60" : "text-[#a89a8e]"
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
            placeholder="Write a message..."
            className="flex-1 rounded-[10px] border border-[#E8DDD3] bg-white px-3 py-2.5 text-sm text-[#2C2825] placeholder-[#a89a8e] focus:outline-none focus:ring-2 focus:ring-[#C4654A]"
          />
          <Button type="submit" size="md">
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
