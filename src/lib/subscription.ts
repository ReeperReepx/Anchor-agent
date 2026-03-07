import { SupabaseClient } from "@supabase/supabase-js";
import type { Subscription, SubscriptionTier } from "@/lib/types/database";

// Users created before this date are grandfathered (free forever)
// Set to the moment Stripe billing went live
const GRANDFATHER_CUTOFF = "2026-03-07T23:00:00Z";

export interface AccessInfo {
  hasAccess: boolean;
  isGrandfathered: boolean;
  isTrial: boolean;
  tier: SubscriptionTier | "grandfathered" | null;
  subscription: Subscription | null;
  trialDaysLeft: number | null;
}

export async function getUserAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<AccessInfo> {
  // Check if user is grandfathered
  const { data: user } = await supabase
    .from("users")
    .select("created_at")
    .eq("id", userId)
    .single();

  if (user && user.created_at < GRANDFATHER_CUTOFF) {
    return {
      hasAccess: true,
      isGrandfathered: true,
      isTrial: false,
      tier: "grandfathered",
      subscription: null,
      trialDaysLeft: null,
    };
  }

  // Check subscription
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single<Subscription>();

  if (!sub) {
    return {
      hasAccess: false,
      isGrandfathered: false,
      isTrial: false,
      tier: null,
      subscription: null,
      trialDaysLeft: null,
    };
  }

  // Active subscription
  if (sub.status === "active") {
    return {
      hasAccess: true,
      isGrandfathered: false,
      isTrial: false,
      tier: sub.tier,
      subscription: sub,
      trialDaysLeft: null,
    };
  }

  // Trial
  if (sub.status === "trialing" && sub.trial_ends_at) {
    const trialEnd = new Date(sub.trial_ends_at);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const hasAccess = trialEnd > now;
    return {
      hasAccess,
      isGrandfathered: false,
      isTrial: true,
      tier: sub.tier,
      subscription: sub,
      trialDaysLeft: daysLeft,
    };
  }

  // Canceled or expired
  return {
    hasAccess: false,
    isGrandfathered: false,
    isTrial: false,
    tier: sub.tier,
    subscription: sub,
    trialDaysLeft: null,
  };
}

export function canAccessWeeklyPlanning(access: AccessInfo): boolean {
  if (access.isGrandfathered) return true;
  return access.hasAccess && access.tier === "founder";
}
