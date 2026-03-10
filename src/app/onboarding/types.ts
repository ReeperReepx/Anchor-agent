import type { UserPreference } from "@/lib/types/database";

export interface OnboardingData {
  name: string;
  timezone: string;
  standup_time: string;
  goal_categories: string[];
  preference: UserPreference;
  accountability_style: string;
  pain_points: string[];
}

export const PAIN_POINT_OPTIONS = [
  { id: "no-accountability", label: "No accountability", desc: "nobody to answer to" },
  { id: "losing-momentum", label: "Losing momentum", desc: "start strong, fizzle out" },
  { id: "working-alone", label: "Working alone", desc: "no team, no check-ins" },
  { id: "no-structure", label: "No structure", desc: "days blur together" },
  { id: "cant-see-progress", label: "Can't see progress", desc: "unsure if I'm moving forward" },
];

export const GOAL_OPTIONS = [
  "SaaS",
  "Freelance",
  "E-commerce",
  "Content creation",
  "Fitness",
  "Open source",
  "Agency",
  "Side project",
  "Other",
];

export const ACCOUNTABILITY_STYLES = [
  {
    id: "gentle",
    label: "Gentle nudges",
    description: "Encouraging, warm, celebrates small wins",
  },
  {
    id: "direct",
    label: "Straight talk",
    description: "Honest, no sugarcoating, calls it like it is",
  },
  {
    id: "drill",
    label: "Drill sergeant",
    description: "Push hard, no excuses, maximum pressure",
  },
];

export const INPUT_CLASSES =
  "w-full rounded-[10px] border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3 text-base text-[#1D1D1F] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF9500]/30 focus:border-[#FF9500] focus:bg-white transition-all";
