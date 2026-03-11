import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWeekStart } from "@/lib/utils/week";

/**
 * Weekly matching cron — runs every Monday.
 * 1. Ends all active matches from previous weeks
 * 2. Fetches all matching-product users with active subs
 * 3. Groups by primary goal category, shuffles, pairs
 * 4. Leftover from each group goes into a "misc" pool, paired across goals
 * 5. If there's a final leftover (odd total), they get a pending match
 *
 * Protected by CRON_SECRET header.
 */
export async function POST(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const weekOf = getWeekStart();

  // 1. End all active matches (from any previous week)
  const { error: endError } = await supabase
    .from("matches")
    .update({ status: "ended" })
    .eq("status", "active");

  if (endError) {
    console.error("Failed to end active matches:", endError);
  }

  // Also end any stale pending matches from previous weeks
  await supabase
    .from("matches")
    .update({ status: "ended" })
    .eq("status", "pending")
    .neq("week_of", weekOf);

  // 2. Fetch all matching-product users with active subscriptions
  //    Also include grandfathered users (created before cutoff)
  const GRANDFATHER_CUTOFF = "2026-03-07T23:00:00Z";

  const { data: matchingUsers, error: usersError } = await supabase
    .from("users")
    .select("id, goal_categories, email, name, timezone")
    .eq("product_type", "matching")
    .not("onboarded_at", "is", null);

  if (usersError || !matchingUsers) {
    console.error("Failed to fetch matching users:", usersError);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  // Filter to users with active subscriptions or grandfathered
  const eligibleUsers = [];
  for (const u of matchingUsers) {
    // Check if grandfathered
    const { data: fullUser } = await supabase
      .from("users")
      .select("created_at")
      .eq("id", u.id)
      .single();

    const isGrandfathered = fullUser && fullUser.created_at < GRANDFATHER_CUTOFF;

    if (isGrandfathered) {
      eligibleUsers.push(u);
      continue;
    }

    // Check subscription
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status, trial_ends_at")
      .eq("user_id", u.id)
      .single();

    const hasAccess =
      sub &&
      (sub.status === "active" ||
        (sub.status === "trialing" &&
          sub.trial_ends_at &&
          new Date(sub.trial_ends_at) > new Date()));

    if (hasAccess) {
      eligibleUsers.push(u);
    }
  }

  if (eligibleUsers.length < 2) {
    // Not enough users to match — if there's exactly 1, create a pending match
    if (eligibleUsers.length === 1) {
      const user = eligibleUsers[0];
      await supabase.from("matches").insert({
        user_a_id: user.id,
        goal_category: user.goal_categories?.[0] || "Other",
        week_of: weekOf,
        status: "pending",
      });
    }
    return NextResponse.json({
      matched: 0,
      pending: eligibleUsers.length,
      message: "Not enough users to match",
    });
  }

  // 3. Group by primary goal category, shuffle within groups
  const groups: Record<string, typeof eligibleUsers> = {};
  for (const user of eligibleUsers) {
    const primaryGoal = user.goal_categories?.[0] || "Other";
    if (!groups[primaryGoal]) groups[primaryGoal] = [];
    groups[primaryGoal].push(user);
  }

  // Shuffle each group
  for (const key of Object.keys(groups)) {
    shuffle(groups[key]);
  }

  // 4. Pair within each group, collect leftovers
  const pairs: [typeof eligibleUsers[0], typeof eligibleUsers[0]][] = [];
  const leftovers: typeof eligibleUsers = [];

  for (const users of Object.values(groups)) {
    let i = 0;
    while (i + 1 < users.length) {
      pairs.push([users[i], users[i + 1]]);
      i += 2;
    }
    if (i < users.length) {
      leftovers.push(users[i]);
    }
  }

  // 5. Pair leftovers across goal categories
  shuffle(leftovers);
  let i = 0;
  while (i + 1 < leftovers.length) {
    pairs.push([leftovers[i], leftovers[i + 1]]);
    i += 2;
  }

  // 6. Insert all pairs as active matches
  let matchedCount = 0;
  for (const [a, b] of pairs) {
    // Use the shared goal category if they have one, otherwise the first user's
    const sharedGoal = a.goal_categories?.find((g: string) =>
      b.goal_categories?.includes(g)
    ) || a.goal_categories?.[0] || "Other";

    const { error } = await supabase.from("matches").insert({
      user_a_id: a.id,
      user_b_id: b.id,
      goal_category: sharedGoal,
      week_of: weekOf,
      status: "active",
      matched_at: new Date().toISOString(),
    });

    if (!error) matchedCount++;
  }

  // 7. If there's a final leftover (odd total), create a pending match
  let pendingCount = 0;
  if (i < leftovers.length) {
    const user = leftovers[i];
    await supabase.from("matches").insert({
      user_a_id: user.id,
      goal_category: user.goal_categories?.[0] || "Other",
      week_of: weekOf,
      status: "pending",
    });
    pendingCount = 1;
  }

  return NextResponse.json({
    matched: matchedCount * 2,
    pairs: matchedCount,
    pending: pendingCount,
    week_of: weekOf,
  });
}

/** Fisher-Yates shuffle in place */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
