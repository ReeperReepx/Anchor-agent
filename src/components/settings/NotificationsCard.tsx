"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function NotificationsCard() {
  const [prefs, setPrefs] = useState({
    dailyReminder: true,
    streakWarnings: true,
    partnerUpdates: false,
    weeklySummary: true,
  });

  function toggle(key: keyof typeof prefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  const items = [
    { key: "dailyReminder" as const, label: "Daily reminder", sub: "Email at your standup time" },
    { key: "streakWarnings" as const, label: "Streak warnings", sub: "Alert before you lose your streak" },
    { key: "partnerUpdates" as const, label: "Partner updates", sub: "When your partner completes a standup" },
    { key: "weeklySummary" as const, label: "Weekly summary email", sub: "Recap sent every Monday morning" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {items.map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#E5E5E5] last:border-b-0">
              <div>
                <div className="text-[13px] font-medium text-[#1D1D1F]">{item.label}</div>
                <div className="text-[11px] text-[#9CA3AF]">{item.sub}</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={prefs[item.key]}
                aria-label={`${item.label}: ${item.sub}`}
                onClick={() => toggle(item.key)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9500] focus-visible:ring-offset-2 ${
                  prefs[item.key] ? "bg-[#FF9500]" : "bg-[#D1D5DB]"
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  prefs[item.key] ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
