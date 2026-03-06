"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { User, UserPreference } from "@/lib/types/database";

const inputClasses =
  "w-full rounded-lg border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#B85C42] focus:border-[#B85C42]";

export default function SettingsPage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single<User>();
        if (data) setProfile(data);
      }
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    const supabase = createClient();
    await supabase
      .from("users")
      .update({
        timezone: profile.timezone,
        standup_time: profile.standup_time,
        preference: profile.preference,
      })
      .eq("id", profile.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!profile) {
    return (
      <div className="max-w-lg space-y-6">
        <div className="skeleton h-7 w-32" />
        <div className="rounded-[14px] border border-[#E5E5E5] bg-white p-[28px]">
          <div className="skeleton h-4 w-24 mb-4" />
          <div className="skeleton h-3 w-full mb-3" />
          <div className="skeleton h-3 w-3/4 mb-3" />
          <div className="skeleton h-3 w-1/2" />
        </div>
        <div className="rounded-[14px] border border-[#E5E5E5] bg-white p-[28px]">
          <div className="skeleton h-4 w-28 mb-4" />
          <div className="skeleton h-10 w-full mb-3" />
          <div className="skeleton h-10 w-full mb-3" />
          <div className="skeleton h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-[#1D1D1F] tracking-[-0.02em]">Settings</h1>

      <ProfileCard profile={profile} />

      <PreferencesCard
        profile={profile}
        setProfile={setProfile}
        onSave={handleSave}
        saving={saving}
        saved={saved}
      />

      <NotificationsCard />

      <SubscriptionCard />
    </div>
  );
}

function ProfileCard({ profile }: { profile: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">Email</span>
            <span className="text-[#1D1D1F]">{profile.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">Member since</span>
            <span className="text-[#1D1D1F]">
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">Goals</span>
            <div className="flex gap-1.5">
              {profile.goal_categories.map((g) => (
                <span
                  key={g}
                  className="bg-[rgba(184,92,66,0.1)] text-[#B85C42] text-xs px-2 py-0.5 rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PreferencesCard({
  profile,
  setProfile,
  onSave,
  saving,
  saved,
}: {
  profile: User;
  setProfile: (u: User) => void;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">
              Timezone
            </label>
            <select
              value={profile.timezone ?? ""}
              onChange={(e) =>
                setProfile({ ...profile, timezone: e.target.value })
              }
              className={inputClasses}
            >
              <option value="">Select timezone</option>
              {Intl.supportedValuesOf("timeZone").map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">
              Standup Time
            </label>
            <input
              type="time"
              value={profile.standup_time ?? ""}
              onChange={(e) =>
                setProfile({ ...profile, standup_time: e.target.value })
              }
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">
              Standup Mode
            </label>
            <select
              value={profile.preference ?? ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  preference: e.target.value as UserPreference,
                })
              }
              className={inputClasses}
            >
              <option value="solo">Solo</option>
              <option value="shared">Shared</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
            {saved && (
              <span className="text-sm text-[#2D8A56]">Saved!</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function NotificationsCard() {
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
                onClick={() => toggle(item.key)}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  prefs[item.key] ? "bg-[#B85C42]" : "bg-[#E5E5E5]"
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  prefs[item.key] ? "translate-x-4" : "translate-x-0"
                }`} />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SubscriptionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#6B7280]">Plan</span>
            <span className="bg-[rgba(45,138,86,0.1)] text-[#2D8A56] text-xs font-medium px-2.5 py-0.5 rounded-full uppercase tracking-[1px]">
              Early Access
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">Status</span>
            <span className="text-[#2D8A56]">Active — Free</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
