import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import type { SubscriptionTier, SubscriptionStatus } from "@/lib/types/database";

// Use service role key for webhook — no user context
function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function mapStripeStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "canceled":
    case "unpaid":
    case "past_due":
      return "canceled";
    default:
      return "expired";
  }
}

async function handleSubscriptionEvent(subscription: Stripe.Subscription) {
  const supabase = getAdminSupabase();
  const userId = subscription.metadata.supabase_user_id;
  const plan = (subscription.metadata.plan || "builder") as SubscriptionTier;

  if (!userId) {
    console.error("[Stripe Webhook] No supabase_user_id in subscription metadata");
    return;
  }

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      tier: plan,
      status: mapStripeStatus(subscription.status),
      trial_ends_at: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      current_period_end: subscription.items.data[0]?.current_period_end
        ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
        : null,
    },
    { onConflict: "user_id" }
  );
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== "subscription" || !session.subscription) return;

  const subscription = await getStripe().subscriptions.retrieve(
    session.subscription as string
  );

  // Ensure metadata is set from the checkout session
  if (!subscription.metadata.supabase_user_id && session.metadata?.supabase_user_id) {
    await getStripe().subscriptions.update(subscription.id, {
      metadata: {
        supabase_user_id: session.metadata.supabase_user_id,
        plan: session.metadata.plan || "builder",
      },
    });
    subscription.metadata.supabase_user_id = session.metadata.supabase_user_id;
    subscription.metadata.plan = session.metadata.plan || "builder";
  }

  await handleSubscriptionEvent(subscription);
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await handleSubscriptionEvent(event.data.object as Stripe.Subscription);
      break;
  }

  return NextResponse.json({ received: true });
}
