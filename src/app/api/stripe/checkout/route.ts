import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, PLANS } from "@/lib/stripe";
import type { PlanKey, BillingInterval } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
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
      return NextResponse.json({ error: "Price not configured — missing Stripe price ID for this plan" }, { status: 500 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe secret key not configured" }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const promoCouponId = process.env.STRIPE_MARCH_COUPON_ID;
    const promoEnd = new Date("2026-04-01T00:00:00Z");
    const maybePromo = promoCouponId && new Date() < promoEnd;

    // Run independent queries in parallel
    const [{ data: existingSub }, promoSlots] = await Promise.all([
      supabase
        .from("subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .single(),
      maybePromo
        ? supabase
            .from("subscriptions")
            .select("*", { count: "exact", head: true })
            .in("status", ["active", "trialing"])
        : Promise.resolve({ count: null }),
    ]);

    let customerId = existingSub?.stripe_customer_id;

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email!,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
    }

    const promoActive = maybePromo && ((promoSlots.count ?? 0) < 10);

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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
