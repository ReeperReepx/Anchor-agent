import { describe, it, expect } from "vitest";
import type {
  User,
  Standup,
  Streak,
  Match,
  Message,
  WeeklySummary,
  Subscription,
  StandupType,
  UserPreference,
  AccountabilityStyle,
  MatchStatus,
  SubscriptionTier,
  SubscriptionStatus,
} from "../database";

describe("Database types", () => {
  it("User type has correct shape with name and accountability_style", () => {
    const user: User = {
      id: "uuid",
      email: "test@example.com",
      name: "Preet",
      timezone: "America/New_York",
      standup_time: "09:00",
      goal_categories: ["fitness", "coding"],
      preference: "solo",
      accountability_style: "direct",
      pain_points: [],
      product_type: "standup",
      onboarded_at: "2024-01-01T00:00:00Z",
      created_at: "2024-01-01T00:00:00Z",
    };
    expect(user.id).toBeDefined();
    expect(user.name).toBe("Preet");
    expect(user.accountability_style).toBe("direct");
    expect(user.goal_categories).toHaveLength(2);
  });

  it("User allows null name and accountability_style", () => {
    const user: User = {
      id: "uuid",
      email: "test@example.com",
      name: null,
      timezone: null,
      standup_time: null,
      goal_categories: [],
      preference: null,
      accountability_style: null,
      pain_points: [],
      product_type: "standup",
      onboarded_at: null,
      created_at: "2024-01-01T00:00:00Z",
    };
    expect(user.name).toBeNull();
    expect(user.accountability_style).toBeNull();
  });

  it("Standup type has correct shape", () => {
    const standup: Standup = {
      id: "uuid",
      user_id: "user-uuid",
      type: "daily",
      date: "2024-01-15",
      transcript: "some transcript",
      audio_url: null,
      duration_seconds: 300,
      done_summary: "did stuff",
      planned_summary: "will do stuff",
      blockers_summary: null,
      productivity_score: null,
      score_reasoning: null,
      created_at: "2024-01-15T09:00:00Z",
    };
    expect(standup.type).toBe("daily");
  });

  it("Streak type has correct shape", () => {
    const streak: Streak = {
      id: "uuid",
      user_id: "user-uuid",
      current_streak: 5,
      longest_streak: 10,
      last_standup_date: "2024-01-15",
    };
    expect(streak.current_streak).toBe(5);
  });

  it("Match type has correct shape with weekly rotation", () => {
    const match: Match = {
      id: "uuid",
      user_a_id: "user-a",
      user_b_id: "user-b",
      goal_category: "fitness",
      week_of: "2024-01-15",
      status: "active",
      matched_at: "2024-01-15T09:00:00Z",
      created_at: "2024-01-01T00:00:00Z",
    };
    expect(match.status).toBe("active");
    expect(match.week_of).toBe("2024-01-15");
  });

  it("Match type allows null user_b_id for pending matches", () => {
    const match: Match = {
      id: "uuid",
      user_a_id: "user-a",
      user_b_id: null,
      goal_category: "fitness",
      week_of: "2024-01-15",
      status: "pending",
      matched_at: null,
      created_at: "2024-01-01T00:00:00Z",
    };
    expect(match.user_b_id).toBeNull();
    expect(match.status).toBe("pending");
    expect(match.matched_at).toBeNull();
  });

  it("Message type has correct shape", () => {
    const msg: Message = {
      id: "uuid",
      match_id: "match-uuid",
      sender_id: "user-uuid",
      body: "Great work today!",
      created_at: "2024-01-15T09:00:00Z",
    };
    expect(msg.body).toBe("Great work today!");
  });

  it("WeeklySummary type has correct shape", () => {
    const summary: WeeklySummary = {
      id: "uuid",
      user_id: "user-uuid",
      week_of: "2024-01-15",
      summary: "You shipped 3 features this week...",
      standup_count: 4,
      created_at: "2024-01-21T00:00:00Z",
    };
    expect(summary.standup_count).toBe(4);
    expect(summary.week_of).toBe("2024-01-15");
  });

  it("Subscription type has correct shape", () => {
    const sub: Subscription = {
      id: "uuid",
      user_id: "user-uuid",
      stripe_customer_id: "cus_123",
      stripe_subscription_id: "sub_123",
      tier: "founder",
      status: "active",
      trial_ends_at: null,
      current_period_end: "2024-02-01T00:00:00Z",
    };
    expect(sub.tier).toBe("founder");
  });

  it("type unions are valid", () => {
    const standupTypes: StandupType[] = ["daily", "weekly"];
    const preferences: UserPreference[] = ["solo", "shared", "both"];
    const styles: AccountabilityStyle[] = ["gentle", "direct", "drill"];
    const matchStatuses: MatchStatus[] = ["pending", "active", "paused", "ended"];
    const tiers: SubscriptionTier[] = ["builder", "founder"];
    const subStatuses: SubscriptionStatus[] = [
      "trialing",
      "active",
      "canceled",
      "expired",
    ];

    expect(standupTypes).toHaveLength(2);
    expect(preferences).toHaveLength(3);
    expect(styles).toHaveLength(3);
    expect(matchStatuses).toHaveLength(4);
    expect(tiers).toHaveLength(2);
    expect(subStatuses).toHaveLength(4);
  });
});
