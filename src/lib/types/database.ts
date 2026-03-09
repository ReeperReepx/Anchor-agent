export type StandupType = "daily" | "weekly";
export type UserPreference = "solo" | "shared" | "both";
export type AccountabilityStyle = "gentle" | "direct" | "drill";
export type MatchStatus = "pending" | "active" | "paused" | "ended";
export type SubscriptionTier = "builder" | "founder";
export type SubscriptionStatus = "trialing" | "active" | "canceled" | "expired";

export interface User {
  id: string;
  email: string;
  name: string | null;
  timezone: string | null;
  standup_time: string | null;
  goal_categories: string[];
  preference: UserPreference | null;
  accountability_style: AccountabilityStyle | null;
  onboarded_at: string | null;
  created_at: string;
}

export interface Standup {
  id: string;
  user_id: string;
  type: StandupType;
  date: string;
  transcript: string | null;
  audio_url: string | null;
  duration_seconds: number | null;
  done_summary: string | null;
  planned_summary: string | null;
  blockers_summary: string | null;
  productivity_score: number | null;
  score_reasoning: string | null;
  created_at: string;
}

export interface Match {
  id: string;
  user_a_id: string;
  user_b_id: string | null;
  goal_category: string;
  week_of: string;
  status: MatchStatus;
  matched_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export interface WeeklySummary {
  id: string;
  user_id: string;
  week_of: string;
  summary: string;
  standup_count: number;
  created_at: string;
}

export interface MonthlySummary {
  id: string;
  user_id: string;
  month_of: string;
  summary: string;
  highlights: string | null;
  standup_count: number;
  streak_best: number | null;
  created_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_standup_date: string | null;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  trial_ends_at: string | null;
  current_period_end: string | null;
}

export type PartnerQueueStatus = "waiting" | "matched" | "canceled";

export interface PartnerQueue {
  id: string;
  user_id: string;
  selected_days: string[];
  joined_at: string;
  status: PartnerQueueStatus;
}

export interface Community {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  created_by: string;
  member_count: number;
  is_public: boolean;
  created_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: "owner" | "member";
  joined_at: string;
}

export interface CommunityMessage {
  id: string;
  community_id: string;
  user_id: string;
  body: string;
  created_at: string;
  user_name?: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "created_at">;
        Update: Partial<Omit<User, "id" | "created_at">>;
      };
      standups: {
        Row: Standup;
        Insert: Omit<Standup, "id" | "created_at">;
        Update: Partial<Omit<Standup, "id" | "created_at">>;
      };
      matches: {
        Row: Match;
        Insert: Omit<Match, "id" | "created_at">;
        Update: Partial<Omit<Match, "id" | "created_at">>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "created_at">;
        Update: Partial<Omit<Message, "id" | "created_at">>;
      };
      weekly_summaries: {
        Row: WeeklySummary;
        Insert: Omit<WeeklySummary, "id" | "created_at">;
        Update: Partial<Omit<WeeklySummary, "id" | "created_at">>;
      };
      monthly_summaries: {
        Row: MonthlySummary;
        Insert: Omit<MonthlySummary, "id" | "created_at">;
        Update: Partial<Omit<MonthlySummary, "id" | "created_at">>;
      };
      streaks: {
        Row: Streak;
        Insert: Omit<Streak, "id">;
        Update: Partial<Omit<Streak, "id">>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, "id">;
        Update: Partial<Omit<Subscription, "id">>;
      };
      partner_queue: {
        Row: PartnerQueue;
        Insert: Omit<PartnerQueue, "id">;
        Update: Partial<Omit<PartnerQueue, "id">>;
      };
      communities: {
        Row: Community;
        Insert: Omit<Community, "id" | "created_at">;
        Update: Partial<Omit<Community, "id" | "created_at">>;
      };
      community_members: {
        Row: CommunityMember;
        Insert: Omit<CommunityMember, "id">;
        Update: Partial<Omit<CommunityMember, "id">>;
      };
      community_messages: {
        Row: CommunityMessage;
        Insert: Omit<CommunityMessage, "id" | "created_at">;
        Update: Partial<Omit<CommunityMessage, "id" | "created_at">>;
      };
    };
  };
}
