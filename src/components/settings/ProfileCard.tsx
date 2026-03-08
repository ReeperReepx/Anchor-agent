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
