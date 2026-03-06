import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.subscription_details?.metadata?.user_id
        ?? session.metadata?.user_id;
      const tier = session.subscription_details?.metadata?.tier
        ?? session.metadata?.tier
        ?? "standard";

      if (userId) {
        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          tier: tier as "standard" | "premium",
          status: "trialing",
          trial_ends_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object;
      const userId = sub.metadata?.user_id;

      if (userId) {
        const status = sub.status === "active"
          ? "active"
          : sub.status === "trialing"
          ? "trialing"
          : sub.status === "canceled"
          ? "canceled"
          : "expired";

        await supabase
          .from("subscriptions")
          .update({
            status,
            current_period_end: new Date(
              sub.current_period_end * 1000
            ).toISOString(),
          })
          .eq("user_id", userId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const userId = sub.metadata?.user_id;

      if (userId) {
        await supabase
          .from("subscriptions")
          .update({ status: "expired" })
          .eq("user_id", userId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
