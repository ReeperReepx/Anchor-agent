"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { User } from "@/lib/types/database";

export function ProfileCard({ profile }: { profile: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#86868B]">Email</span>
            <span className="text-[#1D1D1F]">{profile.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#86868B]">Member since</span>
            <span className="text-[#1D1D1F]">
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#86868B]">Goals</span>
            <div className="flex gap-1.5">
              {profile.goal_categories.map((g) => (
                <span
                  key={g}
                  className="bg-[rgba(255,149,0,0.1)] text-[#FF9500] text-xs px-2 py-0.5 rounded-full"
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
