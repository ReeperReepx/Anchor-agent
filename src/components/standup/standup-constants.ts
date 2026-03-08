import type { StandupType } from "@/lib/types/database";

export type SessionState = "idle" | "connecting" | "active" | "completed" | "error";

export const SESSION_INFO: Record<StandupType, { title: string; description: string; cap: string }> = {
  daily: {
    title: "Daily Standup",
    description: "Three questions. Five minutes. What you did, what\u2019s next, what\u2019s blocking you.",
    cap: "5-10 min",
  },
  weekly: {
    title: "Weekly Planning",
    description: "A deeper session. Review your week, set goals, dig into blockers.",
    cap: "Up to 45 min",
  },
};
