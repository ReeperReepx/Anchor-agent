"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/lib/types/database";
import { ProfileCard } from "@/components/settings/ProfileCard";
import { PreferencesCard } from "@/components/settings/PreferencesCard";
import { NotificationsCard } from "@/components/settings/NotificationsCard";
import { SubscriptionCard } from "@/components/settings/SubscriptionCard";

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
      <div className="space-y-6">
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#C46B50] to-[#B85C42] flex items-center justify-center text-white text-sm font-semibold shadow-[0_2px_8px_rgba(184,92,66,0.25)]">
          {profile.email?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#1D1D1F] tracking-[-0.02em]">Settings</h1>
          <p className="text-[13px] text-[#6B7280]">{profile.email}</p>
        </div>
      </div>

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
