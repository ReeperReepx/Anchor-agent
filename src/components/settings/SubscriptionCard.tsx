"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function SubscriptionCard() {
  const [access, setAccess] = useState<{
    hasAccess: boolean;
    isGrandfathered: boolean;
    isTrial: boolean;
    tier: string | null;
    trialDaysLeft: number | null;
  } | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/subscription");
      if (res.ok) {
        setAccess(await res.json());
      }
    }
    load();
  }, []);

  async function openPortal() {
    setPortalLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url && typeof data.url === "string") {
      try {
        const parsed = new URL(data.url);
        if (parsed.hostname.endsWith("stripe.com")) {
          window.location.href = data.url;
          return;
        }
      } catch { /* invalid URL */ }
    }
    setPortalLoading(false);
  }

  const planLabel = access?.isGrandfathered
    ? "Grandfathered"
    : access?.tier
      ? access.tier.charAt(0).toUpperCase() + access.tier.slice(1)
      : "None";

  const statusLabel = access?.isGrandfathered
    ? "Active (Free)"
    : access?.isTrial
      ? `Trial: ${access.trialDaysLeft} day${access.trialDaysLeft !== 1 ? "s" : ""} left`
      : access?.hasAccess
        ? "Active"
        : "Inactive";

  const statusColor = access?.hasAccess || access?.isGrandfathered ? "#34C759" : "#0071E3";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#86868B]">Plan</span>
            <span className="bg-[rgba(52,199,89,0.1)] text-[#34C759] text-xs font-medium px-2.5 py-0.5 rounded-full uppercase tracking-[1px]">
              {planLabel}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#86868B]">Status</span>
            <span style={{ color: statusColor }}>{statusLabel}</span>
          </div>
          {access && !access.isGrandfathered && access.hasAccess && (
            <Button
              variant="secondary"
              className="w-full mt-2"
              onClick={openPortal}
              disabled={portalLoading}
            >
              {portalLoading ? <><span className="spinner spinner-sm" /> Loading...</> : "Manage Subscription"}
            </Button>
          )}
          {access && !access.hasAccess && !access.isGrandfathered && (
            <Button
              variant="primary"
              className="w-full mt-2"
              onClick={() => window.location.href = "/pricing"}
            >
              Choose a Plan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
