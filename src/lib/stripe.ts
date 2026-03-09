import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

export const PLAN_LIMITS = {
  builder: {
    dailyStandupsPerMonth: 30,
    dailyMaxMinutes: 10,
    weeklyEnabled: false,
    weeklyMaxMinutes: 0,
  },
  founder: {
    dailyStandupsPerMonth: 60,
    dailyMaxMinutes: 15,
    weeklyEnabled: true,
    weeklyMaxMinutes: 45,
  },
  grandfathered: {
    dailyStandupsPerMonth: 30,
    dailyMaxMinutes: 10,
    weeklyEnabled: true,
    weeklyMaxMinutes: 45,
  },
} as const;

export type PlanLimitKey = keyof typeof PLAN_LIMITS;

export const PLANS = {
  builder: {
    name: "Builder",
    price: 20,
    priceId: process.env.STRIPE_BUILDER_PRICE_ID || "",
    annualPriceId: process.env.STRIPE_BUILDER_ANNUAL_PRICE_ID || "",
    features: [
      "30 daily standups/month (10 min each)",
      "AI-generated summaries",
      "Accountability partner matching",
      "Full transcript history",
      "Calendar sync",
    ],
  },
  founder: {
    name: "Founder",
    price: 40,
    priceId: process.env.STRIPE_FOUNDER_PRICE_ID || "",
    annualPriceId: process.env.STRIPE_FOUNDER_ANNUAL_PRICE_ID || "",
    features: [
      "Everything in Builder",
      "60 daily standups/month (15 min each)",
      "Weekly planning sessions (45 min)",
      "Monthly deep-dive summaries",
      "Priority partner matching",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
export type BillingInterval = "monthly" | "annual";
