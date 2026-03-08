"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { User, UserPreference } from "@/lib/types/database";

const inputClasses =
  "w-full rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-3.5 py-2.5 text-[16px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#B57308]/30 focus:border-[#B57308] focus:bg-white transition-all";

export function PreferencesCard({
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
            <label className="block text-[16px] font-medium text-[#86868B] mb-1">
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
            <label className="block text-[16px] font-medium text-[#86868B] mb-1">
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
            <label className="block text-[16px] font-medium text-[#86868B] mb-1">
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
            <Button type="submit" loading={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
            {saved && (
              <span className="text-[16px] text-[#34C759]">Saved!</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
