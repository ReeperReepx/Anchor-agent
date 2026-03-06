import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface CheckoutBody {
  tier: "standard" | "premium";
}

const PRICE_IDS: Record<string, string> = {
  standard: process.env.STRIPE_STANDARD_PRICE_ID ?? "",
  premium: process.env.STRIPE_PREMIUM_PRICE_ID ?? "",
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: CheckoutBody = await request.json();
  const priceId = PRICE_IDS[body.tier];

  if (!priceId) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  // Dynamic import so the app doesn't crash without stripe installed
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Check for existing customer
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  let customerId = subscription?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
  }

  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/dashboard?checkout=canceled`,
    subscription_data: {
      trial_period_days: 7,
      metadata: { user_id: user.id, tier: body.tier },
    },
  });

  return NextResponse.json({ url: session.url });
}
