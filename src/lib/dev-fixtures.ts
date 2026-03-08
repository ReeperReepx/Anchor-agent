import type { Standup, Streak, User } from "@/lib/types/database";

const now = Date.now();
const day = 86400000;

export const DEV_STANDUPS: Standup[] = [
  {
    id: "dev-1",
    user_id: "dev-user",
    type: "daily",
    date: new Date(now).toISOString().split("T")[0],
    transcript: null,
    audio_url: null,
    duration_seconds: 342,
    done_summary:
      "Shipped the new onboarding flow. Fixed 3 bugs in the payment integration. Wrote tests for the streak calculation logic.",
    planned_summary:
      "Finish the partner matching algorithm. Deploy staging build. Write copy for the landing page FAQ.",
    blockers_summary: null,
    productivity_score: 4,
    score_reasoning: "shipped multiple items, clear plan ahead",
    created_at: new Date(now).toISOString(),
  },
  {
    id: "dev-2",
    user_id: "dev-user",
    type: "daily",
    date: new Date(now - day).toISOString().split("T")[0],
    transcript: null,
    audio_url: null,
    duration_seconds: 287,
    done_summary:
      "Designed the dashboard layout. Set up Supabase RLS policies. Got calendar sync working with Google API.",
    planned_summary:
      "Build the onboarding voice flow. Connect ElevenLabs WebSocket.",
    blockers_summary:
      "Waiting on ElevenLabs API key approval, submitted 2 days ago.",
    productivity_score: 3,
    score_reasoning: "completed a couple tasks, clear plan ahead, identified blockers",
    created_at: new Date(now - day).toISOString(),
  },
  {
    id: "dev-3",
    user_id: "dev-user",
    type: "weekly",
    date: new Date(now - 3 * day).toISOString().split("T")[0],
    transcript: null,
    audio_url: null,
    duration_seconds: 1847,
    done_summary:
      "Completed full app scaffold. Landing page live. Auth flow working end-to-end.",
    planned_summary:
      "Focus this week on voice integration and partner matching. Target: MVP by Friday.",
    blockers_summary:
      "Need to decide on hosting, VPS vs managed. Budget concern.",
    productivity_score: 4,
    score_reasoning: "shipped multiple items, clear plan ahead, identified blockers",
    created_at: new Date(now - 3 * day).toISOString(),
  },
  {
    id: "dev-4",
    user_id: "dev-user",
    type: "daily",
    date: new Date(now - 4 * day).toISOString().split("T")[0],
    transcript: null,
    audio_url: null,
    duration_seconds: 198,
    done_summary:
      "Set up CI/CD pipeline. Configured Docker for self-hosting. Added error tracking with Sentry.",
    planned_summary: "Start on the full app scaffold. Get auth working.",
    blockers_summary: null,
    productivity_score: 3,
    score_reasoning: "shipped multiple items, clear plan ahead",
    created_at: new Date(now - 4 * day).toISOString(),
  },
  {
    id: "dev-5",
    user_id: "dev-user",
    type: "daily",
    date: new Date(now - 5 * day).toISOString().split("T")[0],
    transcript: null,
    audio_url: null,
    duration_seconds: 415,
    done_summary:
      "Finalized the product spec. Chose the tech stack. Set up the repo and initial project structure.",
    planned_summary:
      "Build out the database schema. Start Supabase integration.",
    blockers_summary:
      "Still comparing ElevenLabs vs Deepgram for voice. Need to test latency.",
    productivity_score: 3,
    score_reasoning: "shipped multiple items, clear plan ahead, identified blockers",
    created_at: new Date(now - 5 * day).toISOString(),
  },
];

export const DEV_STREAK: Streak = {
  id: "dev-streak",
  user_id: "dev-user",
  current_streak: 12,
  longest_streak: 34,
  last_standup_date: new Date().toISOString().split("T")[0],
};

export const DEV_PROFILE: User = {
  id: "dev-user-id",
  email: "dev@anchor.local",
  name: "Builder",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  standup_time: "09:00",
  goal_categories: ["shipping", "fitness", "reading"],
  preference: "both",
  accountability_style: "direct",
  onboarded_at: "2026-02-15T10:00:00Z",
  created_at: "2026-02-15T10:00:00Z",
};

export const DEV_PARTNER_STANDUP: Standup = {
  id: "partner-1",
  user_id: "partner-user",
  type: "daily",
  date: new Date().toISOString().split("T")[0],
  transcript: null,
  audio_url: null,
  duration_seconds: 312,
  done_summary:
    "Launched email campaign for early access list. Got 47 signups in the first 3 hours. Fixed mobile responsiveness on the pricing page.",
  planned_summary:
    "Write the onboarding email sequence. Set up analytics. Start on referral system.",
  blockers_summary:
    "Stripe webhook keeps timing out in staging, need to debug.",
  productivity_score: 4,
  score_reasoning: "shipped multiple items, clear plan ahead, identified blockers",
  created_at: new Date().toISOString(),
};
