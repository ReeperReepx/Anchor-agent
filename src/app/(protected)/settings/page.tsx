"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { User, UserPreference } from "@/lib/types/database";

const inputClasses =
  "w-full rounded-lg border border-[#E8DDD3] bg-white px-3 py-2.5 text-sm text-[#2C2825] focus:outline-none focus:ring-2 focus:ring-[#C4654A] focus:border-[#C4654A]";

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
        <div className="rounded-[14px] border border-[#E8DDD3] bg-white p-[28px]">
          <div className="skeleton h-4 w-24 mb-4" />
          <div className="skeleton h-3 w-full mb-3" />
          <div className="skeleton h-3 w-3/4 mb-3" />
          <div className="skeleton h-3 w-1/2" />
        </div>
        <div className="rounded-[14px] border border-[#E8DDD3] bg-white p-[28px]">
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
      <h1 className="text-2xl font-semibold text-[#2C2825] tracking-[-0.02em]">Settings</h1>

      <ProfileCard profile={profile} />

      <PreferencesCard
        profile={profile}
        setProfile={setProfile}
        onSave={handleSave}
        saving={saving}
        saved={saved}
      />

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
            <span className="text-[#8a7e74]">Email</span>
            <span className="text-[#2C2825]">{profile.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8a7e74]">Member since</span>
            <span className="text-[#2C2825]">
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8a7e74]">Goals</span>
            <div className="flex gap-1.5">
              {profile.goal_categories.map((g) => (
                <span
                  key={g}
                  className="bg-[rgba(196,101,74,0.1)] text-[#C4654A] text-xs px-2 py-0.5 rounded-full"
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
            <label className="block text-sm font-medium text-[#8a7e74] mb-1">
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
            <label className="block text-sm font-medium text-[#8a7e74] mb-1">
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
            <label className="block text-sm font-medium text-[#8a7e74] mb-1">
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

function SubscriptionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#8a7e74]">Plan</span>
            <span className="bg-[rgba(45,138,86,0.1)] text-[#2D8A56] text-xs font-medium px-2.5 py-0.5 rounded-full uppercase tracking-[1px]">
              Early Access
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8a7e74]">Status</span>
            <span className="text-[#2D8A56]">Active — Free</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
