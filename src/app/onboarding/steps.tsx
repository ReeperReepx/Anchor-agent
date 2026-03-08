import { Button } from "@/components/ui/button";
import { RadioCard } from "./radio-card";
import type { OnboardingData } from "./types";
import { GOAL_OPTIONS, ACCOUNTABILITY_STYLES, INPUT_CLASSES } from "./types";
import type { UserPreference } from "@/lib/types/database";

interface StepProps {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
  next: () => void;
}

export function StepWelcome({ next }: { next: () => void }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-[rgba(255,149,0,0.08)] border border-[rgba(255,149,0,0.15)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_24px_rgba(255,149,0,0.08)]">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FF9500"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="5" r="3" />
          <line x1="12" y1="22" x2="12" y2="8" />
          <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        </svg>
      </div>
      <h1 className="text-[32px] font-bold text-[#1D1D1F] tracking-[-0.02em] mb-3">
        Welcome to Anchor
      </h1>
      <p className="text-[#86868B] text-base mb-10 max-w-sm mx-auto leading-relaxed">
        Six quick questions to set up your daily standup. Takes about a minute.
      </p>
      <Button size="lg" onClick={next}>
        Let&apos;s go
      </Button>
    </div>
  );
}

export function StepName({ data, setData, next, canProceed }: StepProps & { canProceed: boolean }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">
        What should we call you?
      </h2>
      <p className="text-[#86868B] text-sm mb-8">
        Your AI agent will use this during standups.
      </p>
      <input
        type="text"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        placeholder="Your first name"
        autoFocus
        className={INPUT_CLASSES}
        onKeyDown={(e) => e.key === "Enter" && canProceed && next()}
      />
    </div>
  );
}

export function StepSchedule({ data, setData }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">
        When do you want to standup?
      </h2>
      <p className="text-[#86868B] text-sm mb-8">
        We&apos;ll send you a reminder and sync it to your calendar.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[#86868B] mb-2">Timezone</label>
          <select
            value={data.timezone}
            onChange={(e) => setData({ ...data, timezone: e.target.value })}
            className={INPUT_CLASSES}
          >
            {Intl.supportedValuesOf("timeZone").map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-[#86868B] mb-2">
            Standup time
          </label>
          <input
            type="time"
            value={data.standup_time}
            onChange={(e) =>
              setData({ ...data, standup_time: e.target.value })
            }
            className={INPUT_CLASSES}
          />
        </div>
      </div>
    </div>
  );
}

export function StepGoals({ data, setData }: StepProps) {
  function toggleGoal(goal: string) {
    setData({
      ...data,
      goal_categories: data.goal_categories.includes(goal)
        ? data.goal_categories.filter((g) => g !== goal)
        : [...data.goal_categories, goal],
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">
        What are you building?
      </h2>
      <p className="text-[#86868B] text-sm mb-8">
        Pick as many as apply. This helps us match you with the right partner.
      </p>
      <div className="flex flex-wrap gap-2">
        {GOAL_OPTIONS.map((goal) => {
          const selected = data.goal_categories.includes(goal);
          return (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={`px-4 py-2.5 rounded-[10px] text-sm font-medium transition-all ${
                selected
                  ? "bg-[#FF9500] text-white shadow-[0_2px_8px_rgba(255,149,0,0.3)]"
                  : "bg-[#F0F0F0] text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E5E5E5]"
              }`}
            >
              {goal}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const PREFERENCE_OPTIONS = [
  {
    value: "solo" as const,
    label: "Solo",
    desc: "Just me and the AI. Focused, private.",
  },
  {
    value: "shared" as const,
    label: "Shared",
    desc: "Matched with a new partner every week for mutual accountability.",
  },
  {
    value: "both" as const,
    label: "Both",
    desc: "Solo standup + see a partner's standup too. Partners rotate weekly.",
  },
];

export function StepPreference({ data, setData }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">
        How do you want to standup?
      </h2>
      <p className="text-[#86868B] text-sm mb-8">
        Solo is just you and the AI. Shared means you&apos;ll also see a
        partner&apos;s standup after you both complete yours.
      </p>
      <div className="space-y-3">
        {PREFERENCE_OPTIONS.map((opt) => (
          <RadioCard
            key={opt.value}
            label={opt.label}
            description={opt.desc}
            selected={data.preference === opt.value}
            onClick={() =>
              setData({ ...data, preference: opt.value as UserPreference })
            }
          />
        ))}
      </div>
    </div>
  );
}

export function StepAccountability({ data, setData }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">
        How should the AI hold you accountable?
      </h2>
      <p className="text-[#86868B] text-sm mb-8">
        This sets the personality of your AI standup agent.
      </p>
      <div className="space-y-3">
        {ACCOUNTABILITY_STYLES.map((style) => (
          <RadioCard
            key={style.id}
            label={style.label}
            description={style.description}
            selected={data.accountability_style === style.id}
            onClick={() =>
              setData({ ...data, accountability_style: style.id })
            }
          />
        ))}
      </div>
    </div>
  );
}

export function StepComplete({
  data,
  loading,
  onComplete,
  onCalendarDownload,
}: {
  data: OnboardingData;
  loading: boolean;
  onComplete: () => void;
  onCalendarDownload: () => void;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-[rgba(52,199,89,0.08)] border border-[rgba(52,199,89,0.15)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_24px_rgba(52,199,89,0.08)]">
        <svg
          className="w-7 h-7 text-[#34C759]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-[28px] font-bold text-[#1D1D1F] mb-2">
        You&apos;re all set, {data.name}
      </h2>
      <p className="text-[#86868B] mb-10">
        Your first standup is at{" "}
        <span className="text-[#1D1D1F] font-medium">{data.standup_time}</span>{" "}
        tomorrow. Or start one right now.
      </p>
      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        <Button size="lg" onClick={onComplete} disabled={loading}>
          {loading ? "Setting up..." : "Start my first standup"}
        </Button>
        <Button variant="secondary" onClick={onCalendarDownload}>
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Add to calendar
          </span>
        </Button>
        <Button variant="ghost" onClick={onComplete} disabled={loading}>
          Go to dashboard
        </Button>
      </div>
    </div>
  );
}
