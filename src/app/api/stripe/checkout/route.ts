import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, PLANS } from "@/lib/stripe";
import type { PlanKey, BillingInterval } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { plan: string; interval?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const plan = body.plan as PlanKey;
  if (!PLANS[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const interval: BillingInterval = body.interval === "annual" ? "annual" : "monthly";
  const priceId = interval === "annual" ? PLANS[plan].annualPriceId : PLANS[plan].priceId;

  if (!priceId) {
    return NextResponse.json({ error: "Price not configured" }, { status: 500 });
  }

  // Check if user already has a Stripe customer ID
  const { data: existingSub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  let customerId = existingSub?.stripe_customer_id;

  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email!,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  // Apply March promo coupon if active and env var is set
  const promoCouponId = process.env.STRIPE_MARCH_COUPON_ID;
  const promoEnd = new Date("2026-04-01T00:00:00Z");
  const promoActive = promoCouponId && new Date() < promoEnd;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionParams: any = {
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 7,
      metadata: { supabase_user_id: user.id, plan, interval },
    },
    success_url: `${appUrl}/dashboard?subscribed=true`,
    cancel_url: `${appUrl}/pricing`,
    metadata: { supabase_user_id: user.id, plan, interval },
  };

  if (promoActive) {
    sessionParams.discounts = [{ coupon: promoCouponId }];
  }

  const session = await getStripe().checkout.sessions.create(sessionParams);

  return NextResponse.json({ url: session.url });
}
